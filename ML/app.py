from flask import Flask, render_template, request, redirect, url_for, Response, jsonify, make_response
import json 
import demo


app = Flask(__name__)

# class Points(db.Model):
#      id = db.column(db.integer, primary_key = True)
#      content = db.column(db.json, nullabe = False)


@app.route('/api/calibrate-board', methods = ['POST'])
def index1():

    if request.is_json:

        req = request.get_json()
        #print req
        r1 = req["name"]
        r2 = req["message"]
        z = demo.findPoints(r1, r2)

        if z:
            return {"success": True, "data": z}, 200

    else:
        return {"success": False}, 400


@app.route('/api/convert', methods = ['POST'])
def index2():

    if request.is_json:

        req = request.get_json()
        # print(req)
        r1 = req["name"]
        r2 = req["message"]
        z = demo.convert(r1, r2)

        if z:
            return {"success": True, "data": z}, 200

    else:
        return {"success": False}, 400


if __name__ =="__main__":
    app.run(debug = True)

# routes : 
# /api/findPoints
# /api/convert/