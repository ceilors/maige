from flask import Flask, render_template, request, jsonify
from colors import get_main_colors
from base64 import decodebytes
from io import BytesIO

app = Flask(__name__, static_url_path='')


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        if request.form:
            _, b64data = request.form['file'].split(',')
            image = BytesIO(decodebytes(b64data.encode()))
            colors = get_main_colors(image, use_hsv=True)
            return jsonify({'status': 'ok', 'colors': colors})
        else:
            return jsonify({'status': 'file not uploaded!'})
    else:
        return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
