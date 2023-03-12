from minio import Minio
from minio.error import S3Error
import os

class FileDumper():
    
    def __init__(self, bucket):
        self.access_key = os.environ.get('ACCESS_KEY')
        self.secret_key = os.environ.get('SECRET_KEY')
        self.service = os.environ.get('MINIO_SERVICE')
        self.client = Minio(
                        self.service,
                        access_key=self.access_key,
                        secret_key=self.secret_key,
                      )
        self.bucket = bucket

    def add_image(self, path, name):
        found = self.client.bucket_exists(f'{self.bucket}')
        print(f'Found response: {found}')
        if not found:
            print(f'making bucket: {self.bucket}')
            self.client.make_bucket(self.bucket)
        else:
            print(f'Bucket: {self.bucket} already exists')

        self.client.fput_object(
            f'{name}', f'{self.bucket}', f'{path}',
        )
    
    def show_pets(self):
        objects = self.client.list_objects(self.bucket)
        return objects if objects else None


