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

    # Method to retrieve an image in a bucket on the MinIO instance
    def retrieve_image(self, file_name):
        data = None
        headers = None

        try:
            response = self.client.get_object(bucket_name = self.bucket, object_name = file_name)
            data = response.data
            headers = response.getheaders()

        finally:
            response.close()
            response.release_conn()

        return (headers, data)
