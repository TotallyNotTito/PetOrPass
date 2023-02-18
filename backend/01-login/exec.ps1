docker build -t auth0-python-web-01-login .
docker run --env-file .env -p 8080:8080 -it auth0-python-web-01-login
