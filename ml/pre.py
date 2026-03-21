import pandas as pd
from pipeline import predict

df = pd.read_csv("aegisgrid_final_dataset.csv")
result = predict(df.iloc[0].to_dict())   # raw row, no manual cleaning needed
print(result)