import sys
import json
from collections import defaultdict

# Llegir arguments
data = sys.argv[1]
timeSpan = sys.argv[2]

# Convertir la cadena JSON a un diccionari Python
data_list = json.loads(data)

# Agrupar dades per idSensor i tipus
grouped_data = defaultdict(lambda: defaultdict(list))
for item in data_list:
    grouped_data[item['idSensor']][item['tipus']].append(item)

# Calcular màxim, mínim i mitjana per cada idSensor i tipus
sensor_results = {}
for sensor_id, tipus_data in grouped_data.items():
    sensor_results[sensor_id] = {}
    for tipus, items in tipus_data.items():
        max_values = [item['max'] for item in items]
        min_values = [item['min'] for item in items]
        avg_values = [item['average'] for item in items]
        sensor_results[sensor_id][tipus] = {
            'max': max(max_values),
            'min': min(min_values),
            'avg': sum(avg_values) / len(avg_values)
        }

# Crear el JSON final amb timeSpan
final_result = {
    'timeSpan': timeSpan,
    'sensors': sensor_results
}

# Imprimir els resultats
print(json.dumps(final_result, indent=4))