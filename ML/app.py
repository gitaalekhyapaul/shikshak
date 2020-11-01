from flask import Flask, render_template, request, redirect, url_for, Response
import pickle
import json 
import scan as demo

app = Flask(__name__)

@app.route('/api/calibrate-board', methods = ['POST'])
def index1():

    if request.is_json:

        req = request.get_json()
        r1 = req["roomId"]
        r2 = req["fileKey"]
        z = demo.findPoints(r1, r2)
            
        if z:
            return {"success": True}, 200

    else:
        return {"success": False}, 401


@app.route('/api/convert', methods = ['POST'])
def index2():

    if request.is_json:

        req = request.get_json()
        r1 = req["roomId"]
        r2 = req["fileKey"]
        z, check = demo.convert(r1, r2)
        if check:
            return json.dumps({"success": True, "data": z}), 200

        else:
            return {"success": False}, 401

if __name__ =="__main__":
    app.run(host="0.0.0.0", port=4500, debug = True)