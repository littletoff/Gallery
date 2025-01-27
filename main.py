from flask import Flask, render_template, jsonify
import os

app = Flask(__name__)

# API to fetch artwork metadata
@app.route('/api/artworks')
def get_artworks():
    images_path = os.path.join(app.static_folder, "images")
    artworks = []

    for filename in os.listdir(images_path):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            artworks.append({
                "filename": filename,
                "title": os.path.splitext(filename)[0],  # Use filename as title
                "url": f"/static/images/{filename}"
            })

    return jsonify(artworks)

# Route for the main gallery page
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
