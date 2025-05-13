export function getBaseUrl() {
    const config = useRuntimeConfig();
    return config.public.URL;
}

// Nueva función para probar la conexión con la API
export async function fetchTest() {
    try {
        const response = await fetch(`${getBaseUrl()}/test`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en la prueba de conexión');
        }

        const data = await response.json();
        console.log('Conexión exitosa:', data);
        return data;

    } catch (error) {
        console.error('Error en la prueba de conexión:', error);
        throw new Error(error.message || 'Hubo un error en la solicitud');
    }
}

// Login

export async function login(correu, contrasenya) {
    try {
        const response = await fetch(`${getBaseUrl()}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correu, contrasenya }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al hacer login');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        throw new Error(error.message || 'Hubo un error en la solicitud');
    }
}

// Aulas

export async function getTotesAulas() {
    try {
        const response = await fetch(`${getBaseUrl()}/api/aules`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener las aulas');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Hubo un error en la solicitud');
    }
}

export async function getAulas() {
    try {
        const response = await fetch(`${getBaseUrl()}/api/aules/actives`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener las aulas');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Hubo un error en la solicitud');
    }
}

export async function getAulaById(id) {
    try {
        const response = await fetch(`${getBaseUrl()}/api/aules/${id}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener el aula');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Hubo un error en la solicitud');
    }
}

export async function createAula(curs, classe, etapa) {
    if (!curs || !classe || !etapa) {
        throw new Error("curs, classe i etapa són necessaris");
    }

    const response = await fetch(`${getBaseUrl()}/api/aules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ curs, classe, etapa })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el aula');
    }

    return await response.json();
}

export async function updateAula(id, aula) {
    try {
        const response = await fetch(`${getBaseUrl()}/api/aules/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(aula)
        });

        if (!response.ok) {
            throw new Error(`Error en la actualización: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Aula actualizada con éxito', result);
        return result;
    } catch (error) {
        console.error('Error en la solicitud de actualización:', error);
        throw new Error('Error en actualizar el aula');
    }
}

export async function deleteAula(id) {
    try {
        const response = await fetch(`${getBaseUrl()}/api/aules/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar el aula');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Hubo un error en la solicitud');
    }
}

export async function habilitarAula(aula) {
    try {
        const response = await fetch(`${getBaseUrl()}/api/aules/${aula.id}/activa`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ activa: aula.activa }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al habilitar el aula');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Hubo un error en la solicitud');
    }

}

//GET MAPA

export async function getMapa(bodyRequest) {
    try {
        console.log("Enviando solicitud con bodyRequest:", bodyRequest);

        const baseUrl = getBaseUrl();  // Verifica la URL base
        console.log("Base URL:", baseUrl);  // Agregado para verificar la URL
        const response = await fetch(`${baseUrl}/api/mapa`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyRequest)
        });

        if (!response.ok) {
            console.error("Error al obtener la respuesta:", response.statusText);
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener las aulas');
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        throw new Error(error.message || 'Hubo un error en la solicitud');
    }
}

export async function getDadesGrafic(taula, tipus, idAula, dataIni, dataFi) {
    if (!taula || !tipus || !idAula || !dataIni || !dataFi) {
        throw new Error("taula, tipus, idAula, dataIni i dataFi són necessaris");
    }

    try {
        const queryParams = new URLSearchParams({ taula, tipus, dataIni, dataFi }).toString();
        const response = await fetch(`${getBaseUrl()}/api/aules/${idAula}/grafic?${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtenir les dades per al gràfic');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Hubo un error en la solicitud');
    }
}

export async function getAllSensors() {
    try {
        const response = await fetch(`${getBaseUrl()}/api/sensors`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener los sensores');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los sensores:', error);
        throw error;
    }
}

export async function getNewsensors() {
    try {
        const response = await fetch(`${getBaseUrl()}/api/newsensors`);
        if (!response.ok) {
            throw new Error('Error al obtener los sensores');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los sensores:', error);
        throw error;
    }
}

// Aceptar un sensor nuevo
export async function acceptSensor(idSensor) {
    try {
        const response = await fetch(`${getBaseUrl()}/api/newsensors/${idSensor}/accept`, { // Endpoint correcto
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al aceptar el sensor');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al aceptar el sensor:', error);
        throw new Error(error.message || 'Hubo un error en la solicitud');
    }
}

export async function banSensor(idSensor, banned) {
    try {
        const response = await fetch(`${getBaseUrl()}/api/newsensors/${idSensor}/ban`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ banned }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al banear/desbanear el sensor');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al banear/desbanear el sensor:', error);
        throw new Error(error.message || 'Hubo un error en la solicitud');
    }
}

// Rechazar (eliminar) un sensor nuevo
export async function deletePendingSensor(idSensor) {
    try {
        const response = await fetch(`${getBaseUrl()}/api/sensors/${idSensor}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar el sensor pendiente');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al eliminar el sensor pendiente:', error);
        throw new Error(error.message || 'Hubo un error en la solicitud');
    }
}

// Editar un sensor nuevo
export async function updateSensor(sensorData) { // Cambiado para usar MAC
    try {
        const response = await fetch(`${getBaseUrl()}/api/sensors`, { // Cambiado a /api/sensors
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sensorData), // Enviar sensorData directamente
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar el sensor');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al actualizar el sensor:', error);
        throw new Error(error.message || 'Hubo un error en la solicitud');
    }
}

export async function banPendingSensor(idSensor, banned) {
    try {
        const response = await fetch(`${getBaseUrl()}/api/sensors/${idSensor}/ban`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ banned }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al banear/desbanear el sensor');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al banear/desbanear el sensor:', error);
        throw new Error(error.message || 'Hubo un error en la solicitud');
    }
}

export async function getBannedSensors() {
    try {
        const response = await fetch(`${getBaseUrl()}/api/newsensors/banned`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener los sensores baneados');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los sensores baneados:', error);
        throw new Error('Error al obtener los sensores baneados: ' + error.message);
    }
}

export async function deleteSensor(idSensor) {
    try {
        const response = await fetch(`${getBaseUrl()}/api/sensors/${idSensor}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar el sensor');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al eliminar el sensor:', error);
        throw new Error(error.message || 'Hubo un error en la solicitud');
    }
}

// Actualizar un sensor
export async function updateSensorById(idSensor, sensorData) {
    try {
        const response = await fetch(`${getBaseUrl()}/api/sensors/${idSensor}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sensorData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar el sensor');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al actualizar el sensor:', error);
        throw new Error(error.message || 'Hubo un error en la solicitud');
    }
}

export async function updateSensorStatus(id, status) {
    if (!['accept', 'reject'].includes(status)) {
        throw new Error('El estado debe ser "accept" o "reject"');
    }

    try {
        const response = await fetch(`${getBaseUrl()}/api/newsensors/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar el estado del sensor');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al actualizar el estado del sensor:', error);
        throw new Error(error.message || 'Hubo un error en la solicitud');
    }
}

export async function unbanSensor(idSensor) {
    try {
        const response = await fetch(`${getBaseUrl()}/api/newsensors/${idSensor}/unban`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al desbanear el sensor');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al desbanear el sensor:', error);
        throw new Error(error.message || 'Hubo un error en la solicitud');
    }
}

export async function getSensorConfig() {
    const response = await fetch(`${getBaseUrl()}/api/sensor/config`);
    if (!response.ok) {
        throw new Error('Error al cargar la configuración');
    }
    return await response.json();
}

export async function saveSensorConfig(config) {
    const response = await fetch(`${getBaseUrl()}/api/sensor/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar la configuración');
    }
    return await response.json();
}

export async function uploadSensorImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(`${getBaseUrl()}/api/sensor/images`, {
        method: 'POST',
        body: formData
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al pujar la imatge');
    }
    return await response.json();
}