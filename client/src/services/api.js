// Use relative URL instead of absolute URL
const API_URL = '/api';

/**
 * Hämtar alla kvadrater från API
 * @returns {Promise<Array>} En array med alla kvadrater
 */
export const getSquares = async () => {
    try {
        const response = await fetch(`${API_URL}/squares`);

        if (!response.ok) {
            throw new Error(`API anrop misslyckades: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Fel vid hämtning av kvadrater:', error);
        throw error;
    }
};

/**
 * Lägger till en ny kvadrat
 * @param {Object} square Kvadratobjekt att lägga till
 * @returns {Promise<Object>} Den skapade kvadraten
 */
export const addSquare = async (square) => {
    try {
        const response = await fetch(`${API_URL}/squares`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(square),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData || `API anrop misslyckades: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Fel vid skapande av kvadrat:', error);
        throw error;
    }
};

/**
 * Rensar alla kvadrater
 * @returns {Promise<void>}
 */
export const clearSquares = async () => {
    try {
        const response = await fetch(`${API_URL}/squares`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`API anrop misslyckades: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error('Fel vid rensning av kvadrater:', error);
        throw error;
    }
};

/**
 * Genererar en slumpmässig hexadecimal färg
 * @returns {string} Hexadecimal färgkod
 */
export const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};