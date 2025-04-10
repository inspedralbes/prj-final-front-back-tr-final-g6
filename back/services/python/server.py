from flask import Flask, request, jsonify
import subprocess
import os
import requests

app = Flask(__name__)

# Functions

def get_dades(start_date, end_date):
    response = requests.get('http://localhost:3020/getDades', params={
        'startDate': start_date,
        'endDate': end_date
    })
    return response.json()

# Routes

@app.route('/status', methods=['GET'])
def status():
    return jsonify({'status': 'Servidor operant'})

if __name__ == '__main__':
    os.makedirs(os.path.join(os.path.dirname(__file__), 'scripts'), exist_ok=True)
    app.run(host='0.0.0.0', port=5000)