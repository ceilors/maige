from flask import Flask, render_template, request, jsonify
from colors import get_main_colors

app = Flask(__name__, static_url_path='')


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        if request.files:
            image = request.files['file']
            colors = get_main_colors(image.stream, use_hsv=True)
            return jsonify({'status': 'ok', 'colors': colors})
        else:
            return jsonify({'status': 'file not uploaded!'})
    else:
        return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
