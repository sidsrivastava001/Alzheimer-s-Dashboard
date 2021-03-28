import flask
from flask import request
import numpy as np
import pandas as pd
import sklearn
import pickle

pkl_filename = "/home/sidsrivastava/api/cross_sectional_ml.pkl"
with open(pkl_filename, 'rb') as file:
    pickle_model = pickle.load(file)

scaler_name = "/home/sidsrivastava/api/scaler.pkl"
with open(scaler_name, 'rb') as file:
    scaler = pickle.load(file)

app = flask.Flask(__name__)
app.config["DEBUG"] = True

@app.route('/', methods=['GET'])
def home():
   if 'Gender' in request.args and 'Age' in request.args and 'SES' in request.args and 'MMSE' in request.args and 'eTIV' in request.args and 'nWBV' in request.args and 'ASF' in request.args:
        arr = [int(request.args['Gender']), int(request.args['Age']), request.args['SES'], float(request.args['MMSE']), int(request.args['eTIV']), float(request.args['nWBV']), float(request.args['ASF'])]
        input = np.array([arr])
        new_input = scaler.transform(input)
        pred = pickle_model.predict(input)
        return str(pred[0])
   return "None"


if __name__ == '__main__':
    app.run()
