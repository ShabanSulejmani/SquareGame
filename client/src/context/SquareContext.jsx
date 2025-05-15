import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSquares, addSquare as apiAddSquare, clearSquares as apiClearSquares } from '../services/api';

// Skapa ett Context för kvadrater
const SquareContext = createContext();

// Hook för att använda SquareContext i komponenter
export const useSquareContext = () => useContext(SquareContext);

export const SquareProvider = ({ children }) => {
    const [squares, setSquares] = useState([]);  // Lista med alla kvadrater
    const [loading, setLoading] = useState(false); // Om API-anrop pågår
    const [error, setError] = useState(null); // Eventuella felmeddelanden

    // Hämtar alla kvadrater från backend och uppdaterar state
    const refreshSquares = async () => {
        setLoading(true);
        setError(null);
        try {
            const squaresFromApi = await getSquares();
            setSquares(squaresFromApi);
        } catch (err) {
            setError('Misslyckades att hämta kvadrater');
        } finally {
            setLoading(false);
        }
    };

    // Hämta kvadrater direkt vid mount
    useEffect(() => {
        refreshSquares();
    }, []);

    // Skapar en ny kvadrat via API och uppdaterar listan
    const createSquare = async (x, y, color) => {
        setLoading(true);
        setError(null);
        try {
            await apiAddSquare({ x, y, color });
            await refreshSquares(); // Uppdatera listan efter skapande
        } catch (err) {
            setError('Misslyckades att skapa kvadrat');
            throw err; // Skicka vidare felet så frontend kan hantera det
        } finally {
            setLoading(false);
        }
    };

    // Rensar alla kvadrater via API och tömmer local state
    const resetSquares = async () => {
        setLoading(true);
        setError(null);
        try {
            await apiClearSquares();
            setSquares([]); // Töm lokalt state
        } catch (err) {
            setError('Misslyckades att rensa kvadrater');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Tillgängliga värden/funktioner i contexten
    return (
        <SquareContext.Provider value={{
            squares,
            createSquare,
            resetSquares,
            refreshSquares,
            loading,
            error
        }}>
            {children}
        </SquareContext.Provider>
    );
};
