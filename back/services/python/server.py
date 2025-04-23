from flask import Flask, request, jsonify
import subprocess
import os
import requests
import schedule
import time
from threading import Thread
from datetime import datetime, timedelta
import logging
import pytz
import json 

app = Flask(__name__)

# Defineix la zona horària de Barcelona
BARCELONA_TZ = pytz.timezone('Europe/Madrid')

# Functions

def get_dades(start_date, end_date):
    response = requests.get('http://prfg6-back:3020/api/data/mongodb', params={
        'startDate': start_date,
        'endDate': end_date
    })
    return response.json()

def run_script(script_name, data, timeSpan):
    script_path = os.path.join(os.path.dirname(__file__), 'scripts', script_name)
    data_str = json.dumps(data) 
    command = ['python3', script_path, data_str, timeSpan]
    result = subprocess.run(command, capture_output=True, text=True)
    return result.stdout

def execute_scheduled_script(timeSpan):
    app.logger.info(f"Executant script programat per {timeSpan}...")

    # Obtenim la data actual
    current_date = datetime.now()

    # Calculem start_date i end_date segons el timeSpan
    if timeSpan == "minut":
        end_date = current_date.replace(second=0, microsecond=0)
        start_date = end_date - timedelta(minutes=1)
    elif timeSpan == "hora":
        end_date = current_date.replace(minute=0, second=0, microsecond=0)
        start_date = end_date - timedelta(hours=1)
    elif timeSpan == "dia":
        end_date = current_date.replace(hour=0, minute=0, second=0, microsecond=0)
        start_date = end_date - timedelta(days=1)
    elif timeSpan == "setmana":
        end_date = current_date.replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=current_date.weekday())
        start_date = end_date - timedelta(weeks=1)
    elif timeSpan == "mes":
        end_date = current_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        start_date = (end_date - timedelta(days=1)).replace(day=1)
    else:
        app.logger.error(f"Interval de temps no reconegut: {timeSpan}")
        return

    app.logger.info(f"Start date: {start_date}, End date: {end_date}")

    # Obtenim les dades de l'API
    data = get_dades(start_date.isoformat(), end_date.isoformat())
    app.logger.info("Dades obtingudes amb èxit: %s", data)

    # Executem el script d'agregació amb les dades obtingudes
    output = run_script('agregation.py', data, timeSpan)
    app.logger.info("Script d'agregació executat amb èxit: %s", output)
    send_agregated_data(output)

def send_agregated_data(data):
    try:
        # Assegura't que `data` sigui un JSON vàlid
        if isinstance(data, str):
            data = json.loads(data)  # Converteix de string a diccionari si cal

        url = 'http://prfg6-back:3020/api/data/mysql'
        headers = {'Content-Type': 'application/json'}
        response = requests.post(url, data=json.dumps(data), headers=headers)
        
        if response.status_code == 200:
            app.logger.info("Dades agregades enviades amb èxit.")
        else:
            app.logger.error("Error en enviar les dades agregades: %s", response.text)
    except json.JSONDecodeError as e:
        app.logger.error("Error en el format de JSON: %s", str(e))
    except Exception as e:
        app.logger.error("Error inesperat: %s", str(e))

# Scheduler

    ## Scheduler per executar el script cada minut en punt

def run_scheduler_minute():
    while True:
        now = datetime.now()
        seconds_to_next_minute = 60 - now.second
        time.sleep(seconds_to_next_minute)  
        execute_scheduled_script("minut") 

    ## Scheduler per executar el script cada hora en punt

def run_scheduler_hour():
    while True:
        now = datetime.now()
        seconds_to_next_hour = (60 - now.second) + (60 * (60 - now.minute))
        time.sleep(seconds_to_next_hour)  
        execute_scheduled_script("hora") 

    ## Scheduler per executar el script cada dia a les 00:00

def run_scheduler_day():
    while True:
        now = datetime.now()
        seconds_to_next_day = (60 - now.second) + (60 * (60 - now.minute)) + (24 * 60 * (24 - now.hour))
        time.sleep(seconds_to_next_day)  
        execute_scheduled_script("dia")

    ## Scheduler per executar el script cada setmana a les 00:00 del dilluns

def run_scheduler_week():
    while True:
        now = datetime.now()
        days_to_next_week = (7 - now.weekday()) % 7
        seconds_to_next_week = (60 - now.second) + (60 * (60 - now.minute)) + (24 * 60 * (24 * days_to_next_week - now.hour))
        time.sleep(seconds_to_next_week)  
        execute_scheduled_script("setmana")

    ## Scheduler per executar el script cada mes el primer dia a les 00:00

def run_scheduler_month():
    while True:
        now = datetime.now()
        days_to_next_month = (30 - now.day) % 30
        seconds_to_next_month = (60 - now.second) + (60 * (60 - now.minute)) + (24 * 60 * (24 * days_to_next_month - now.hour))
        time.sleep(seconds_to_next_month)  
        execute_scheduled_script("mes")

# Routes

@app.route('/status', methods=['GET'])
def status():
    app.logger.info("Comprovant l'estat del servidor...")
    return jsonify({'status': 'Servidor operant'})

if __name__ == '__main__':
    os.makedirs(os.path.join(os.path.dirname(__file__), 'scripts'), exist_ok=True)
    
    # Configura el registre perquè mostri els print al terminal
    logging.basicConfig(level=logging.INFO)
    app.logger.setLevel(logging.INFO)
    
    # Inicia el scheduler en un fil separat
    scheduler_thread = Thread(target=run_scheduler_minute, daemon=True)
    scheduler_thread.start()
    
    # Inicia el servidor Flask
    app.run(host='0.0.0.0', port=5000)