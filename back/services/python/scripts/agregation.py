import sys
import json
from collections import defaultdict

# Llegir arguments
data = sys.argv[1]
timeSpan = sys.argv[2]

# Convertir la cadena JSON a un diccionari Python
data_dict = json.loads(data)

# Agrupar dades per id_sensor
grouped_data = defaultdict(list)
for item in data_dict:
    grouped_data[item['id_sensor']].append(item)

# Calcular màxim, mínim i mitjana per cada id_sensor
sensor_results = {}
for sensor_id, items in grouped_data.items():
    volumes = [item['volume'] for item in items]
    temperatures = [float(item['temperature']) for item in items]
    sensor_results[sensor_id] = {
        'volume': {
            'max': max(volumes),
            'min': min(volumes),
            'avg': sum(volumes) / len(volumes)
        },
        'temperature': {
            'max': max(temperatures),
            'min': min(temperatures),
            'avg': sum(temperatures) / len(temperatures)
        }
    }

# Crear el JSON final amb timeSpan 
final_result = {
    'timeSpan': timeSpan,
    'sensors': sensor_results
}

# Imprimir els resultats
print(json.dumps(final_result, indent=4))