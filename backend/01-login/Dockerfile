FROM python:3

WORKDIR ${HOME}/PetOrPass/

#If we add the requirements and install dependencies first, docker can use cache if requirements don't change
ADD requirements.txt ${HOME}/PetOrPass/
RUN pip install --no-cache-dir -r requirements.txt

ADD . ${HOME}/PetOrPass/
CMD python server.py

EXPOSE 8080
