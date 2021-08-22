import json

from flask import Flask, request, url_for
import torch
from transformers import AutoModelForQuestionAnswering, AutoTokenizer


app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000

model_path='models'
model = AutoModelForQuestionAnswering.from_pretrained(model_path)
tokenizer = AutoTokenizer.from_pretrained(model_path, model_max_length=300)
device = torch.device('cpu')
model.to(device)
_ = model.eval()

categories = {'ТЕМА':'заседание',
              'ДАТА':'сегодня',
              'ПОВЕСТКА':'рассмотре',
              '*ФАКТ':'факт',
              '*ИСПОЛНИТЕЛЬ':'делать|занимае|исполнит',
              '*ПОСТАНОВИЛИ':'решение|постанов|'
             }

categories_order = ['ТЕМА', 'ДАТА', 'ПОВЕСТКА', '*ФАКТ', '*ИСПОЛНИТЕЛЬ', '*ПОСТАНОВИЛИ']

@app.route('/protocol/', methods=['POST'])
def get_protocol():
    res = []
    text_document = request.values.get('text')
    
    if text_document is None:
        res = {}
        return json.dumps(res, ensure_ascii=False)

        
    offsets = {key:0 for key in categories_order}
    skips = {key:False for key in categories_order}

    text_out = []

    for _ in range(20):
        for category in categories_order:

            if skips[category]:
                continue

            cat = category if category[0] != '*' else category[1:]

            multi = True if category[0] == '*' else False

            keywords = categories[category]
            offset = offsets[category]

            if keywords.find('|') < 0:
                position = text_document[offset:].find(keywords)
            else:
                min_pos = len(text_document)

                for kw in keywords.split('|'):
                    k_pos = text_document[offset:].find(kw)
                    if k_pos>=0 and k_pos < min_pos:
                        min_pos = k_pos

                if min_pos == len(text_document):
                    position = -1

            if position < 0:
                print('skip', cat, keywords)
                skips[category] = True
                continue

            sp = max(0, position - 50)
            ep = min(len(text_document), sp + 200)

            text = text_document[sp:ep]
            text = text[text.find(' '):text.rfind(' ')].strip()

            batch = tokenizer(text, cat, truncation=True, padding=True)
            input_ids = torch.LongTensor(batch['input_ids']).unsqueeze(0).to(device)
            attention_mask = torch.LongTensor(batch['attention_mask']).unsqueeze(0).to(device)
            outputs = model(input_ids, attention_mask=attention_mask)

            start_pred = torch.argmax(outputs['start_logits'], dim=1)
            end_pred = torch.argmax(outputs['end_logits'], dim=1)

            if end_pred < start_pred:
                start_pred, end_pred = end_pred, start_pred

            text_out.append({cat:text[start_pred:end_pred]})

            if not multi:
                skips[category] = True

            offsets[category] += max(sp + 50, end_pred)


    return json.dumps(text_out, ensure_ascii=False)
