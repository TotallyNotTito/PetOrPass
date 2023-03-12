from minio import Minio
from minio.error import S3Error
import os

class FileDumper():
    def __init__(self, user, image, path, bucket):
        self.user = user
        self.image = image
        self.path = path
        self.bucket = bucket
        self.client = Minio(
                        "play.min.io",
                        access_key=self.access_key,
                        secret_key=self.secret_key,
                      )
        self.access_key = os.environ.get('ACCESS_KEY') if os.environ.get('ACCESS_KEY') else "Q3AM3UQ867SPQQA43P2F" 
        self.secret_key = os.environ.get('SECRET_KEY') if os.environ.get('SECRET_KEY') else "zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG"
    
    def add_image(self):
        image = self.image

        found = self.client.bucket_exists(f'{self.bucket}')
        print(f'Found response: {found}')
        if not found:
            print(f'making bucket: {self.bucket}')
            self.client.make_bucket(self.bucket)
        else:
            print(f'Bucket: {self.bucket} already exists')

        self.client.fput_object(
            f'{image}', f'{self.bucket}', f'{self.path}',
        )
    
    def show_pets(self):
        objects = self.client.list_objects(self.bucket)
        for image in objects:
            print(image)


