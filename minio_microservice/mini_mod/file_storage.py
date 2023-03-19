from minio import Minio

class FileDumper():
    
    def __init__(self, config):
        self.client = Minio(endpoint = config["endpoint"],
                            access_key = config["access_key"],
                            secret_key = config["secret_key"],
                            secure = config["secure"])
        self.bucket = config["bucket"]

    # Method to store an image into a bucket in the MinIO instance
    def add_image(self, file_name, image, file_size):
        success = True

        try:
            self.client.put_object(bucket_name = self.bucket,
                                   object_name = file_name,
                                   data = image,
                                   length = file_size)
        except Exception as e:
            print(e)
            success = False

        return success


    
    def show_pets(self):
        objects = self.client.list_objects(self.bucket)
        return objects if objects else None
