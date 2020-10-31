from flask import Flask

app = Flask(__name__)

@app.route('/api/findPoints')
def index():
    return"Hello World!"

@app.route('/api/convert')
def index():
    return"LOL"

if __name__ =="__main__":
    app.run(debug = True)

# routes : 
# /api/findPoints
# /api/convert/

