FROM python:alpine

RUN apk update && apk upgrade

COPY . /app

WORKDIR /app

ENV FLASK_PORT=3000
ENV FLASK_HOST=0.0.0.0
ENV MINIO_HOST=minio
ENV MINIO_PORT=9000
ENV MINIO_ACCESS_KEY=minioUser
ENV MINIO_SECRET_KEY=minioPass
ENV MINIO_BUCKET=petorpass

RUN pip3 install -r requirements.txt

EXPOSE 3000

CMD ["python3", "app.py"]
