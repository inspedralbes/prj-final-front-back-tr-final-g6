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