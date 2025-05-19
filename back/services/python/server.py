from flask import Flask, jsonify
import subprocess
import os
import requests
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

def get_dades_mongo(start_date, end_date):
    response = requests.get('http://prfg6-back:3020/api/data/mongodb', params={
        'startDate': start_date,
        'endDate': end_date
    })
    app.logger.info("Dades obtingudes de l'API: %s", response.json())
    return response.json()

def get_dades_mysql(timeSpan, dataIni, dataFi):
    params = {
        'timeSpan': timeSpan,
        'dataIni': dataIni,
        'dataFi': dataFi
    }
    response = requests.get('http://prfg6-back:3020/api/data/mysql', params=params)
    
    if response.status_code == 200:
        app.logger.info("Dades obtingudes de l'API: %s", response.json())
        return response.json()
    else:
        app.logger.error("Error en obtenir les dades de l'API: %s", response.text)
        response.raise_for_status()

def run_script(script_name, data, timeSpan):
    script_path = os.path.join(os.path.dirname(__file__), 'scripts', script_name)
    data_str = json.dumps(data) 
    command = ['python3', script_path, data_str, timeSpan]
    result = subprocess.run(command, capture_output=True, text=True)
    return result.stdout

def delete_all_mongo_data():
    try:
        response = requests.delete('http://prfg6-back:3020/api/data/mongodb')
        if response.status_code == 200:
            app.logger.info("Dades de MongoDB esborrades correctament després de l'agregació d'hora.")
        else:
            app.logger.error("Error esborrant les dades de MongoDB: %s", response.text)
    except Exception as e:
        app.logger.error("Excepció esborrant les dades de MongoDB: %s", str(e))

def execute_scheduled_script(timeSpan):
    app.logger.info(f"Executant script programat per {timeSpan}...")

    # Obtenim la data actual amb la zona horària de Barcelona
    current_date = datetime.now(BARCELONA_TZ)

    # Calculem start_date i end_date segons el timeSpan
    if timeSpan == "minut":
        end_date = current_date.replace(second=0, microsecond=0)
        start_date = end_date - timedelta(minutes=1)

        # Obtenim les dades de l'API
        data = get_dades_mongo(start_date.isoformat(), end_date.isoformat())
        app.logger.info("Dades obtingudes amb èxit: %s", data)

        # Executem el script d'agregació amb les dades obtingudes
        output = run_script('agregationMinute.py', data, timeSpan)
        app.logger.info("Script d'agregació executat amb èxit: %s", output)

    elif timeSpan == "hora":
        end_date = current_date.replace(minute=0, second=0, microsecond=0)
        start_date = end_date - timedelta(hours=1)

        data = get_dades_mysql(timeSpan, start_date.isoformat(), end_date.isoformat())
        app.logger.info("Dades obtingudes amb èxit: %s", data)

        output = run_script('agregationSql.py', data, timeSpan)
        app.logger.info("Script d'agregació executat amb èxit: %s", output)

        # Esborra les dades de MongoDB després de l'agregació d'hora
        delete_all_mongo_data()

    elif timeSpan == "dia":
        end_date = current_date.replace(hour=0, minute=0, second=0, microsecond=0)
        start_date = end_date - timedelta(days=1)

        data = get_dades_mysql(timeSpan, start_date.isoformat(), end_date.isoformat())
        app.logger.info("Dades obtingudes amb èxit: %s", data)

        output = run_script('agregationSql.py', data, timeSpan)
        app.logger.info("Script d'agregació executat amb èxit: %s", output)

    elif timeSpan == "setmana":
        end_date = current_date.replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=current_date.weekday())
        start_date = end_date - timedelta(weeks=1)

        data = get_dades_mysql(timeSpan, start_date.isoformat(), end_date.isoformat())
        app.logger.info("Dades obtingudes amb èxit: %s", data)

        output = run_script('agregationSql.py', data, timeSpan)
        app.logger.info("Script d'agregació executat amb èxit: %s", output)

    elif timeSpan == "mes":
        end_date = current_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        start_date = (end_date - timedelta(days=1)).replace(day=1)

        data = get_dades_mysql(timeSpan, start_date.isoformat(), end_date.isoformat())
        app.logger.info("Dades obtingudes amb èxit: %s", data)

        output = run_script('agregationSql.py', data, timeSpan)
        app.logger.info("Script d'agregació executat amb èxit: %s", output)
    else:
        app.logger.error(f"Interval de temps no reconegut: {timeSpan}")
        return
    send_agregated_data(output, timeSpan)

def send_agregated_data(data, timeSpan):
    app.logger.info("Enviant dades agregades a l'API per %s...", timeSpan)
    app.logger.info("Dades a enviar: %s", data)
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

# Scheduler functions
def run_scheduler_minute():
    while True:
        now = datetime.now(BARCELONA_TZ)
        seconds_to_next_minute = 60 - now.second
        if seconds_to_next_minute == 60:
            seconds_to_next_minute = 0
        app.logger.info("Esperant %d segons per executar el script de minut...", seconds_to_next_minute)
        time.sleep(seconds_to_next_minute)
        execute_scheduled_script("minut")

def run_scheduler_hour():
    while True:
        now = datetime.now(BARCELONA_TZ)
        seconds_to_next_hour = (59 - now.minute) * 60 + (60 - now.second)
        if seconds_to_next_hour == 3600:
            seconds_to_next_hour = 0
        app.logger.info("Esperant %d segons per executar el script d'hora...", seconds_to_next_hour)
        time.sleep(seconds_to_next_hour)
        execute_scheduled_script("hora")

def run_scheduler_day():
    while True:
        now = datetime.now(BARCELONA_TZ)
        seconds_to_next_day = ((23 - now.hour) * 3600) + ((59 - now.minute) * 60) + (60 - now.second)
        if seconds_to_next_day == 86400:
            seconds_to_next_day = 0
        app.logger.info("Esperant %d segons per executar el script de dia...", seconds_to_next_day)
        time.sleep(seconds_to_next_day)
        execute_scheduled_script("dia")

def run_scheduler_week():
    while True:
        now = datetime.now(BARCELONA_TZ)
        # Days until next Monday (weekday 0)
        days_to_next_week = (7 - now.weekday()) % 7
        if days_to_next_week == 0:
            days_to_next_week = 7
        seconds_to_next_week = ((days_to_next_week - 1) * 86400) + ((23 - now.hour) * 3600) + ((59 - now.minute) * 60) + (60 - now.second)
        app.logger.info("Esperant %d segons per executar el script de setmana...", seconds_to_next_week)
        time.sleep(seconds_to_next_week)
        execute_scheduled_script("setmana")

def run_scheduler_month():
    import calendar
    while True:
        now = datetime.now(BARCELONA_TZ)
        # Get last day of current month
        last_day = calendar.monthrange(now.year, now.month)[1]
        days_to_next_month = last_day - now.day
        if days_to_next_month == 0:
            days_to_next_month = calendar.monthrange(now.year, now.month + 1 if now.month < 12 else 1)[1]
        seconds_to_next_month = (days_to_next_month * 86400) + ((23 - now.hour) * 3600) + ((59 - now.minute) * 60) + (60 - now.second)
        app.logger.info("Esperant %d segons per executar el script de mes...", seconds_to_next_month)
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
    
    # Inicia els schedulers en fils separats
    scheduler_threads = [
        Thread(target=run_scheduler_minute, daemon=True),
        Thread(target=run_scheduler_hour, daemon=True),
        Thread(target=run_scheduler_day, daemon=True),
        Thread(target=run_scheduler_week, daemon=True),
        Thread(target=run_scheduler_month, daemon=True)
    ]
    
    for thread in scheduler_threads:
        thread.start()
    
    # Inicia el servidor Flask
    app.run(host='0.0.0.0', port=5000)