from minio import Minio

client = Minio(endpoint="play.min.io",
               access_key="<some_key>",
               secret_key="<some_secret>",
               secure=True)

