FROM python:3.9-slim
WORKDIR /usr/src/app

# Copy requirements first to leverage Docker cache
COPY ./back/services/python/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY ./back/services/python .

EXPOSE 5000

CMD ["python", "server.py"]