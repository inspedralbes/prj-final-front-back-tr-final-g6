const URL = 'http://localhost:3020';

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
    const userId = localStorage.getItem('userId');  // Obtener el ID desde el localStorage

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

export async function updateAula(aula) {
    try {
        const response = await fetch(`${URL}/aula/${aula.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(aula)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar el aula');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Hubo un error en la solicitud');
    }
}

export async function deleteAula(id) {
    try {
        const response = await fetch(`${URL}/aula/${id}`, {
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