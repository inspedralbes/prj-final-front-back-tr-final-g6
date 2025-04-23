import sys
import json
from collections import defaultdict

# Llegir arguments
data = sys.argv[1]

# Convertir la cadena JSON a un diccionari Python
data_dict = json.loads(data)

# Agrupar dades per id_sensor
grouped_data = defaultdict(list)
for item in data_dict:
    grouped_data[item['id_sensor']].append(item)

# Calcular màxim, mínim i mitjana per cada id_sensor
result = {}
for sensor_id, items in grouped_data.items():
    volumes = [item['volume'] for item in items]
    temperatures = [float(item['temperature']) for item in items]
    result[sensor_id] = {
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

# Imprimir els resultats
print(json.dumps(result, indent=4))