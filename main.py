from flask import Flask, render_template, jsonify
import os

app = Flask(__name__)

# API to fetch artwork metadata
@app.route('/api/artworks')
def get_artworks():
    images_path = os.path.join(app.static_folder, "images")
    artworks = []

    # Check if the folder exists
    if not os.path.exists(images_path):
        return jsonify({"error": "Images folder not found"}), 404

    #scan the folder for image files
    for filename in os.listdir(images_path):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            artworks.append({
                "filename": filename,
                "title": os.path.splitext(filename)[0],  # Use filename as title
                "url": f"/static/images/{filename}"
            })

    # Handle the case where no images are found
    if not artworks:
        return jsonify({"message": "No artworks found"}), 404

    return jsonify(artworks)

# if you go to /about it will print this statement
@app.route('/about')
def about():
   # return "Gallery designed by Oliver"  #no frills display of message
    return render_template('about.html')  #note html file must be in templates!



# Route for the main gallery page
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
