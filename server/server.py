from flask import Flask, request, jsonify
from filestorage import store
from filestorage.handlers import LocalFileHandler
from filestorage.filters import RandomizeFilename
import hashlib
import json
import os
import ffmpeg
from flask_pymongo import PyMongo
from werkzeug.utils import redirect
from flask_cors import CORS
import requests

STORAGE_FOLDER = os.getenv('STORAGE_FOLDER', default='storage')
ALLOWED_EXTENSIONS = {'mp4', 'mp3', 'mkv'}
MONGO_HOST = os.getenv('MONGO_HOST', default='localhost')
MONGO_PORT = os.getenv('MONGO_PORT', default=27017)
MONGO_USER = os.getenv('MONGO_USER')
MONGO_PASSWORD = os.getenv('MONGO_PASSWORD')
MONGO_DB = os.getenv('MONGO_DB', default='db')


app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 200 * 1000 * 1000  # MB
app.config["MONGO_URI"] = f'mongodb://{MONGO_USER}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}/{MONGO_DB}'
mongo = PyMongo(app)
store.handler = LocalFileHandler(base_path='storage', auto_make_dir=True, filters=[RandomizeFilename()])


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
            record_id = stored_as.split('.')[0]
            process = (
                ffmpeg
                .input(os.path.join(STORAGE_FOLDER, stored_as))
                .output(os.path.join(STORAGE_FOLDER, record_id + '.wav'), ac=1, ar=16000, f='wav')
                .run_async(pipe_stdout=True, pipe_stderr=True)
            )
            out, err = process.communicate()
            print(out)
            # print(err)
            # ffmpeg.output(stream.audio, filename=).run()
            mongo.db.files.insert({
                'id': record_id,
                'isPending': True
            })
            return jsonify({
                'success': True,
                'id': record_id,
                'isPending': True
            })
        return jsonify({
            'success': False,
            'message': 'Invalid file format'
        })
    return '', 404

def get_beauty(text):
    offset = 0
    txt_len = 30

    text_out = []

    txt_list = text.split()
    while offset < len(text) + 3:
        txt = " ".join(txt_list[offset:offset+txt_len])
        offset += txt_len
        r = requests.post('http://109.248.175.110:8885/beauty/', params={'text': txt}, headers={'Content-type': 'text/plain; charset=utf-8'})
        if r.status_code < 400:
            resp_text = json.loads(r.content)['text']
            text_out.append(resp_text[:246+1])
            offset -= len(resp_text[246+1:].split())

    text_out = [x for x in text_out if x.strip(" \n")]

    return " ".join(text_out)

@app.route('/status/<id>')
def status(id):
    record = mongo.db.files.find_one({'id': id})
    # del record['_id']
    record_id = record['id']
    files = {'audio_blob': open(os.path.join(STORAGE_FOLDER, record_id + '.wav'),'rb')}
    if not 'stt_result' in record:
        r = requests.post('http://109.248.175.110:8889/asr/', files=files)
        speech_to_text = r.json()['r'][0]['response'][0]['text']

        mongo.db.files.update({'_id': record['_id']},
        {'$set': {
            'stt_result': speech_to_text
        }}, upsert=True)
    else:
        speech_to_text = record['stt_result']

    print('STT result:')
    print(speech_to_text)
    print('-------------')

    if not 'gec_result' in record:
        beauty_text = get_beauty(speech_to_text)
        mongo.db.files.update({'_id': record['_id']},
        {'$set': {
            'gec_result': beauty_text
        }}, upsert=True)
    else:
        beauty_text = record['gec_result']

    print('GEC-result')
    print(beauty_text)
    print('-------------')

    if not 'ir_result' in record:
        protocol_request = {'text': beauty_text}
        r = requests.post('http://109.248.175.110:8886/protocol/', data=protocol_request)
        protocol_extracted = r.json()

        protocol_data = {
            'presiding': '',
            'secretary': '',
            'topic': '',
            'date': '',
            'agenda': '',
            'facts': [],
            'participants': []
        }

        cnt = 0
        fact = {}
        for item in protocol_extracted:
            if 'ТЕМА' in item:
                protocol_data['topic'] = item['ТЕМА']
            if 'ДАТА' in item:
                protocol_data['date'] = item['ДАТА']
            if 'ПОВЕСТКА' in item:
                protocol_data['agenda'] = item['ПОВЕСТКА']
            if 'ФАКТ' in item:
                cnt += 1
                fact = {
                    'id': cnt,
                    'data': item['ФАКТ']
                }
            if 'ИСПОЛНИТЕЛЬ' in item:
                fact['responsible'] = item['ИСПОЛНИТЕЛЬ']
                protocol_data['facts'].append(fact)

        mongo.db.files.update({'_id': record['_id']},
        {'$set': {
            'ir_result': protocol_data
        }}, upsert=True)
    else:
        protocol_data = record['ir_result']

    print('IR-result')
    print(protocol_data)
    print('-------------')

    return jsonify({
        'success': True,
        'isPending': False,
        'raw_text': speech_to_text,
        'beauty_text': beauty_text,
        'data': protocol_data
    })


@app.route('/complete/<id>')
def complete(id):
    pass

@app.route('/download/<id>')
def download(id):
    pass