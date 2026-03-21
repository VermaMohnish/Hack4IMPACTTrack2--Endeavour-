import os
import time
import threading
import requests
import pandas as pd

from flask import Flask, request, jsonify
from pipeline import predict

app = Flask(__name__)

# ================= CONFIG =================
NODE_BACKEND_URL = os.getenv(
    "NODE_BACKEND_URL",
    "http://localhost:3000/api/flask-webhook"
)

CSV_PATH = "aegisgrid_final_dataset.csv"

# ================= HEALTH CHECK =================
@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "ML Service Running"}), 200


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


# ================= REAL-TIME PREDICTION =================
@app.route("/predict", methods=["POST"])
def predict_api():
    try:
        data = request.json

        if not data:
            return jsonify({"error": "No input data provided"}), 400

        # 🔥 Run ML model
        result = predict(data)

        # 🔥 Decide signal
        if result["disaster_severity"] > 70:
            signal = "Critical"
        elif result["disaster_severity"] >= 45:
            signal = "Warning"
        else:
            signal = "Stable"

        sector_id = data.get("sector_id", 1)

        message = f"[{result['disaster_type']}] Risk ({result['disaster_severity']}/100) detected."

        payload = {
            "signal": signal,
            "sector_id": sector_id,
            "message": message
        }

        # 🔥 Send to Node backend (webhook)
        try:
            requests.post(NODE_BACKEND_URL, json=payload, timeout=5)
        except Exception as e:
            print("Webhook error:", str(e))

        return jsonify({
            "success": True,
            "prediction": result
        }), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# ================= OPTIONAL: CSV BATCH PROCESS =================
_state = {
    "running": False,
    "total": 0,
    "processed": 0,
    "done": False,
}


def _process_csv():
    global _state

    df = pd.read_csv(CSV_PATH)

    _state["total"] = len(df)
    _state["processed"] = 0
    _state["done"] = False

    for idx, row in df.iterrows():
        try:
            result = predict(row.to_dict())

            if result["disaster_severity"] > 70:
                signal = "Critical"
            elif result["disaster_severity"] >= 45:
                signal = "Warning"
            else:
                signal = "Stable"

            sector_id = (idx % 5) + 1

            payload = {
                "signal": signal,
                "sector_id": sector_id,
                "message": f"[{result['disaster_type']}] Risk detected"
            }

            requests.post(NODE_BACKEND_URL, json=payload, timeout=5)

        except Exception as e:
            print("Error:", str(e))

        _state["processed"] += 1
        time.sleep(2)

    _state["running"] = False
    _state["done"] = True


@app.route("/run", methods=["POST"])
def run_csv():
    if _state["running"]:
        return jsonify({"message": "Already running"}), 400

    _state["running"] = True

    thread = threading.Thread(target=_process_csv)
    thread.start()

    return jsonify({"message": "CSV processing started"}), 200


@app.route("/status", methods=["GET"])
def status():
    return jsonify(_state), 200


# ================= MAIN =================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # 🔥 IMPORTANT FOR RENDER
    app.run(host="0.0.0.0", port=port)