import dotenv from 'dotenv';

dotenv.config();

const URL = process.env.URL_PROD || 'http://localhost:3020';

// Login
export async function login(correu, contrasenya) {
    try {
        const response = await fetch(`${URL}/login`, {
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
        const response = await fetch(`${URL}/getAulas`);

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
        const response = await fetch(`${URL}/aulas`);

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
        const response = await fetch(`${URL}/aula/${id}`);

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

//Usuarios

export async function getUsuaris() {
    try {
        const response = await fetch(`${URL}/usuaris`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener los usuarios');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Hubo un error en la solicitud');
    }
}

export async function getUsuariById() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        throw new Error('No se encontró el ID del usuario en el almacenamiento local');
    }

    try {
        const response = await fetch(`${URL}/usuari/${userId}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener el usuario');
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

    const response = await fetch(`${URL}/createAula`, {
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
        const response = await fetch(`${URL}/updateAula/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(aula) // Asegúrate de enviar los datos correctamente
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
        const response = await fetch(`${URL}/deleteAula/${id}`, {
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
        const response = await fetch(`${URL}/api/aules/${aula.id}/activa`, {
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
