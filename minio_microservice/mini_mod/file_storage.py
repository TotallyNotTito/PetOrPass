from minio import Minio

class FileDumper():
    
    def __init__(self, config):
        self.client = Minio(endpoint=config["endpoint"],
                            access_key=config["access_key"],
                            secret_key=config["secret_key"],
                            secure=config["secure"])

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
