from flask import Flask, request, jsonify
from filestorage import store
from filestorage.handlers import LocalFileHandler
from filestorage.filters import RandomizeFilename
import hashlib
import json
import os
import ffmpeg

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000
store.handler = LocalFileHandler(base_path='storage', auto_make_dir=True, filters=[RandomizeFilename()])

STORAGE_FOLDER = os.getenv('STORAGE_FOLDER', default='storage')
ALLOWED_EXTENSIONS = {'mp4', 'mp3'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/")
def hello_world():
    return '''
<!doctype html>
<title>Upload new File</title>
<h1>Upload new File</h1>
<form method=post action=upload enctype=multipart/form-data>
    <input type=file name=file>
    <input type=submit value=Upload>
</form>
    '''

@app.route("/upload", methods=['POST'])
def upload():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'message': 'File not found'
            })
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            return jsonify({
                'success': False,
                'message': 'File not found'
            })
        if file and allowed_file(file.filename):
            stored_as = store.save_data(filename=file.filename, data=file.read())
            process = (
                ffmpeg
                .input(os.path.join(STORAGE_FOLDER, stored_as))
                .output(os.path.join(STORAGE_FOLDER, stored_as + '.wav'), ac=1, f='wav')
                .run_async(pipe_stdout=True, pipe_stderr=True)
            )
            out, err = process.communicate()
            print(out)
            # print(err)
            # ffmpeg.output(stream.audio, filename=).run()
            return jsonify({
                'success': True,
                'filename': stored_as
            })