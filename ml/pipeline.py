"""
AegisGrid — Single-Row Prediction Pipeline
==========================================
Send one row of raw sensor/infrastructure data and get back:
  • disaster_type  (Flood | Water Clogging | Heatwave | Lightning)
  • disaster_severity  (0–100 score)

You can pass a completely raw row straight from the CSV — leakage columns,
target columns, record_id, everything. The pipeline drops and cleans
internally before predicting.

USAGE
-----
1. Train & save models first by running the notebook (Step 12).
   This expects:
       models/xgb_classifier_pipeline.pkl
       models/xgb_regressor_pipeline.pkl
       models/label_encoder.pkl

2. Run directly:
       python aegisgrid_predict.py

3. Or import the predict() function in your own code:
       from aegisgrid_predict import predict
       result = predict(row_dict)
"""

import joblib
import pandas as pd
import os

# ── Model paths ──────────────────────────────────────────────────────────────
MODEL_DIR    = "models"
CLF_PATH     = os.path.join(MODEL_DIR, "xgb_classifier_pipeline.pkl")
REG_PATH     = os.path.join(MODEL_DIR, "xgb_regressor_pipeline.pkl")
ENCODER_PATH = os.path.join(MODEL_DIR, "label_encoder.pkl")

# ── Columns to drop before predicting (mirrors DROP_COLS in notebook Step 3) -
# Leakage columns, derived risk labels, probability targets, and target columns.
# Any of these present in the input row will be silently removed.
_DROP_COLS = {
    "record_id",
    # Risk label/code columns
    "flood_risk_level",     "flood_risk_code",
    "heat_risk_level",      "heat_risk_code",
    "lightning_risk_level", "lightning_risk_code",
    "overall_disaster_risk","overall_risk_code",
    "recommended_action",
    # Probability columns used in the severity formula
    "flood_probability",
    "heat_probability",
    "lightning_probability",
    # Other leakage-adjacent columns
    "power_outage_probability_pct",
    "casualties_risk_lightning",
    # Target columns — not features
    "disaster_type",
    "disaster_type_enc",
    "disaster_severity",
}

# ── Binary flag columns that must be int, not bool/object ────────────────────
_BINARY_COLS = [
    "is_monsoon_season", "is_summer_season", "is_pre_monsoon",
    "is_afternoon_peak", "thunder_heard_30min", "lightning_rods_installed",
]

# ── Load models once at import time ─────────────────────────────────────────
_clf_pipeline  = None
_reg_pipeline  = None
_label_encoder = None


def _load_models():
    global _clf_pipeline, _reg_pipeline, _label_encoder
    if _clf_pipeline is None:
        print("Loading models...")
        _clf_pipeline  = joblib.load(CLF_PATH)
        _reg_pipeline  = joblib.load(REG_PATH)
        _label_encoder = joblib.load(ENCODER_PATH)
        print("Models loaded.\n")


def _clean(row: dict) -> pd.DataFrame:
    """Drop leakage/target columns and cast binary flags — works on any raw row."""
    df_row = pd.DataFrame([row])

    # Drop leakage / target columns if present (ignore missing ones)
    cols_to_drop = [c for c in _DROP_COLS if c in df_row.columns]
    if cols_to_drop:
        df_row = df_row.drop(columns=cols_to_drop)

    # Cast binary flag columns to int (True/False → 1/0)
    for col in _BINARY_COLS:
        if col in df_row.columns:
            df_row[col] = df_row[col].astype(int)

    return df_row


# ── Core prediction function ─────────────────────────────────────────────────
def predict(row: dict) -> dict:
    """
    Predict disaster type and severity for a single observation.

    Parameters
    ----------
    row : dict
        Any raw row from the dataset — pass it as-is, including leakage
        columns, target columns, record_id, etc. They will be dropped
        automatically before prediction.

    Returns
    -------
    dict with keys:
        disaster_type      – str    e.g. "Flood"
        disaster_severity  – float  e.g. 72.4
        type_probabilities – dict   {class: probability, ...}
    """
    _load_models()

    df_row = _clean(row)

    # Classifier
    enc_pred   = _clf_pipeline.predict(df_row)[0]
    disaster_type = _label_encoder.inverse_transform([enc_pred])[0]

    # Class probabilities
    proba = _clf_pipeline.predict_proba(df_row)[0]
    type_probs = {
        cls: round(float(p), 4)
        for cls, p in zip(_label_encoder.classes_, proba)
    }

    # Regressor
    severity = float(_reg_pipeline.predict(df_row)[0])
    severity = round(max(0.0, min(100.0, severity)), 2)  # clip to [0, 100]

    return {
        "disaster_type":      disaster_type,
        "disaster_severity":  severity,
        "type_probabilities": type_probs,
    }


# ── Demo ─────────────────────────────────────────────────────────────────────
if __name__ == "__main__":

    # You can now pass a completely raw row straight from the CSV —
    # leakage columns, target columns, record_id included. All cleaned internally.

    # Example 1 — raw row as it would appear in the CSV (Flood scenario)
    flood_row = {
        "record_id":                     101,           # dropped automatically
        "temperature_c":                 28.5,
        "humidity_pct":                  88.0,
        "wind_speed_kmh":                22.0,
        "rainfall_mm_per_hr":            45.0,
        "visibility_km":                 6.0,
        "water_level_m":                 3.8,
        "blocked_drains_count":          5,
        "impervious_surface_pct":        55.0,
        "solar_radiation_wm2":           180.0,
        "is_monsoon_season":             True,
        "is_summer_season":              False,
        "is_pre_monsoon":                False,
        "is_afternoon_peak":             False,
        "thunder_heard_30min":           False,
        "lightning_rods_installed":      True,
        # leakage columns — dropped automatically
        "flood_probability":             0.85,
        "heat_probability":              0.10,
        "lightning_probability":         0.20,
        "flood_risk_level":              "High",
        "flood_risk_code":               3,
        "recommended_action":            "Evacuate",
        # targets — dropped automatically
        "disaster_type":                 "Flood",
        "disaster_severity":             74.2,
    }

    # Example 2 — raw row (Heatwave scenario)
    heat_row = {
        "record_id":                     202,
        "temperature_c":                 42.0,
        "humidity_pct":                  18.0,
        "wind_speed_kmh":                8.0,
        "rainfall_mm_per_hr":            0.0,
        "visibility_km":                 15.0,
        "water_level_m":                 0.5,
        "blocked_drains_count":          1,
        "impervious_surface_pct":        60.0,
        "solar_radiation_wm2":           850.0,
        "is_monsoon_season":             False,
        "is_summer_season":              True,
        "is_pre_monsoon":                False,
        "is_afternoon_peak":             True,
        "thunder_heard_30min":           False,
        "lightning_rods_installed":      True,
        "flood_probability":             0.05,
        "heat_probability":              0.91,
        "lightning_probability":         0.03,
        "heat_risk_level":               "Extreme",
        "heat_risk_code":                4,
        "recommended_action":            "Stay Indoors",
        "disaster_type":                 "Heatwave",
        "disaster_severity":             81.5,
    }

    # Or pull directly from your CSV — no need to clean anything manually:
    #   import pandas as pd
    #   df = pd.read_csv("aegisgrid_final_dataset.csv")
    #   raw_row = df.iloc[0].to_dict()
    #   result  = predict(raw_row)

    for label, row in [("Flood scenario", flood_row), ("Heatwave scenario", heat_row)]:
        print(f"{'='*55}")
        print(f"  {label}")
        print(f"{'='*55}")
        result = predict(row)
        print(f"  Predicted Type     : {result['disaster_type']}")
        print(f"  Predicted Severity : {result['disaster_severity']:.2f} / 100")
        print("  Class Probabilities:")
        for cls, prob in sorted(result["type_probabilities"].items(),
                                key=lambda x: -x[1]):
            bar = "█" * int(prob * 30)
            print(f"    {cls:<18} {prob:.4f}  {bar}")
        print()