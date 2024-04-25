FROM python:3.10.7

RUN mkdir /fastapi_app
WORKDIR /fastapi_app

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade -r /fastapi_app/requirements.txt

COPY . .

RUN chmod a+x docker/*.sh
