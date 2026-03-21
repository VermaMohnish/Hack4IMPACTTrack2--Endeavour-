"""
AegisGrid — Flask Prediction Server (CSV Row-by-Row)
=====================================================
Reads a CSV file row by row, predicts disaster type + severity for each row,
and forwards each result as JSON to your friend's Node.js backend.

USAGE
-----
1. Install dependencies:
       pip install flask requests pandas

2. Set your friend's Node.js backend URL below (NODE_BACKEND_URL).
   Set the CSV file path below (CSV_PATH).

3. Run the server:
       python aegisgrid_server.py

4. Trigger processing by calling:
       POST http://localhost:5000/run

   The server will read the CSV row by row, predict each one,
   and send each result to the Node.js backend automatically.

5. Check progress at any time:
       GET http://localhost:5000/status
"""

from flask import Flask, jsonify
import requests
import pandas as pd
import threading
from pipeline import predict

app = Flask(__name__)

# ── Config ────────────────────────────────────────────────────────────────────
NODE_BACKEND_URL = "http://localhost:3000/api/prediction"   # ← your friend's URL
CSV_PATH         = "aegisgrid_final_dataset.csv"            # ← your CSV file path

# ── State tracker (shared across threads) ────────────────────────────────────
_state = {
    "running":    False,
    "total":      0,
    "processed":  0,
    "succeeded":  0,
    "failed":     0,
    "errors":     [],       # list of {row_index, error} for failed rows
    "done":       False,
}


def _forward_to_node(payload: dict) -> dict:
    """Send one prediction payload to the Node.js backend."""
    response = requests.post(NODE_BACKEND_URL, json=payload, timeout=10)
    response.raise_for_status()
    return response.json()


def _process_csv():
    """Read CSV row by row, predict, and forward. Runs in a background thread."""
    global _state

    try:
        df = pd.read_csv(CSV_PATH)
    except FileNotFoundError:
        _state["running"] = False
        _state["done"]    = True
        _state["errors"].append({"row_index": -1, "error": f"CSV not found: {CSV_PATH}"})
        return

    _state["total"]     = len(df)
    _state["processed"] = 0
    _state["succeeded"] = 0
    _state["failed"]    = 0
    _state["errors"]    = []
    _state["done"]      = False

    for idx, row in df.iterrows():
        row_dict = row.to_dict()

        # ── Predict ───────────────────────────────────────────────────────
        try:
            result = predict(row_dict)
        except Exception as e:
            _state["failed"]    += 1
            _state["processed"] += 1
            _state["errors"].append({"row_index": int(idx), "error": f"Prediction error: {str(e)}"})
            continue

        # ── Build payload ─────────────────────────────────────────────────
        # Use place_name from CSV if it exists, otherwise fall back to row index
        place_name = row_dict.get("place_name") or row_dict.get("location") or f"Row {idx}"

        payload = {
            "place_name":         place_name,
            "disaster_type":      result["disaster_type"],
            "disaster_severity":  result["disaster_severity"],
            "type_probabilities": result["type_probabilities"],
        }

        # ── Forward to Node.js ────────────────────────────────────────────
        try:
            _forward_to_node(payload)
            _state["succeeded"] += 1
        except requests.exceptions.ConnectionError:
            _state["failed"] += 1
            _state["errors"].append({
                "row_index": int(idx),
                "error": f"Could not connect to Node.js backend at {NODE_BACKEND_URL}"
            })
        except requests.exceptions.Timeout:
            _state["failed"] += 1
            _state["errors"].append({"row_index": int(idx), "error": "Node.js backend timed out"})
        except requests.exceptions.HTTPError as e:
            _state["failed"] += 1
            _state["errors"].append({"row_index": int(idx), "error": f"Node.js HTTP error: {str(e)}"})
        except Exception as e:
            _state["failed"] += 1
            _state["errors"].append({"row_index": int(idx), "error": f"Unexpected error: {str(e)}"})

        _state["processed"] += 1

    _state["running"] = False
    _state["done"]    = True
    print(f"\nDone. {_state['succeeded']}/{_state['total']} rows sent successfully.")


# ── Routes ────────────────────────────────────────────────────────────────────

@app.route("/run", methods=["POST"])
def run():
    """Start processing the CSV. Returns immediately; processing runs in background."""
    if _state["running"]:
        return jsonify({"message": "Already running", "status": _state}), 409

    _state["running"] = True
    _state["done"]    = False

    thread = threading.Thread(target=_process_csv, daemon=True)
    thread.start()

    return jsonify({
        "message": f"Started processing {CSV_PATH}",
        "node_backend": NODE_BACKEND_URL
    }), 200


@app.route("/status", methods=["GET"])
def status():
    """Check how many rows have been processed so far."""
    return jsonify({
        "running":   _state["running"],
        "done":      _state["done"],
        "total":     _state["total"],
        "processed": _state["processed"],
        "succeeded": _state["succeeded"],
        "failed":    _state["failed"],
        "errors":    _state["errors"][-10:],   # show last 10 errors only
    }), 200


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)