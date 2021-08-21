FROM python:3.9.6-slim-buster
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

RUN apt-get -qq update > /dev/null && DEBIAN_FRONTEND=noninteractive apt-get -qq -y --no-install-recommends install ffmpeg

ENV FLASK_APP=server

WORKDIR /app

CMD ["python3", "-m" , "flask", "run", "--host=0.0.0.0"]
