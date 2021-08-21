import json

from flask import Flask, request, url_for
import torch

from gector.gec_model import GecBERTModel

app = Flask(__name__)

batch_size = 32

model = GecBERTModel(vocab_path='/model/vocabulary',
                     model_paths=['/model/best.th'],
                     max_len=120, min_len=3,
                     iterations=5,
                     min_error_probability=0.,
                     lowercase_tokens=0,
                     model_name='bert',
                     special_tokens_fix=1,
                     log=False,
                     confidence=0,
                     is_ensemble=0,
                     weigths=None)

print('\nWaiting for request...\n\n')

@app.route('/beauty/', methods=['POST'])
def beauty():
    res = []
    src_text = request.args.get('text')
    if src_text is None:
        src_text = ''
    
    src_text = src_text.split('\n')
    
    src_text = [text.strip() for text in src_text]
    
    predictions = []
    cnt_corrections = 0
    batch = []
    
    with torch.no_grad():
        for sent in src_text:
            batch.append(sent.split())
            if len(batch) == batch_size:
                preds, cnt = model.handle_batch(batch)
                predictions.extend(preds)
                cnt_corrections += cnt
                batch = []
        if batch:
            preds, cnt = model.handle_batch(batch)
            predictions.extend(preds)
            cnt_corrections += cnt

    dst_text = "\n".join([" ".join(x) for x in predictions]) + '\n'

    res = {'text': dst_text}
    return json.dumps(res, ensure_ascii=False)
