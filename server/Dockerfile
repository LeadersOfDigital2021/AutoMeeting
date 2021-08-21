FROM python:3.9.6-slim-buster
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

ENV FLASK_APP=server

WORKDIR /app

CMD ["python3", "-m" , "flask", "run", "--host=0.0.0.0"]
