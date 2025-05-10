import { createContext, useContext, useState, useEffect } from 'react';
import { getSquares, addSquare, clearSquares, getRandomColor } from '../services/api';

// Skapa en Context för hantering av kvadrater
const SquareContext = createContext();

// Custom hook för att använda Square Context
export const useSquareContext = () => {
    const context = useContext(SquareContext);
    if (!context) {
        throw new Error('useSquareContext måste användas inom en SquareProvider');
    }
    return context;
};

// Provider-komponent som omsluter applikationen
export const SquareProvider = ({ children }) => {
    // State för att spara alla kvadrater
    const [squares, setSquares] = useState([]);
    // State för att hantera laddningsstatus
    const [loading, setLoading] = useState(true);
    // State för att hantera felmeddelanden
    const [error, setError] = useState(null);

    // Funktion för att läsa in alla kvadrater
    const fetchSquares = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getSquares();
            setSquares(data);
        } catch (err) {
            setError('Kunde inte ladda kvadrater. Är servern igång?');
            console.error('Fel vid hämtning av kvadrater:', err);
        } finally {
            setLoading(false);
        }
    };

    // Funktion för att lägga till en ny kvadrat
    const createSquare = async (x, y) => {
        try {
            setError(null);
            const newSquare = {
                x,
                y,
                color: getRandomColor(),
            };

            const createdSquare = await addSquare(newSquare);
            setSquares(prev => [...prev, createdSquare]);
            return createdSquare;
        } catch (err) {
            setError('Kunde inte lägga till kvadrat');
            console.error('Fel vid skapande av kvadrat:', err);
            throw err;
        }
    };

    // Funktion för att rensa alla kvadrater
    const resetSquares = async () => {
        try {
            setError(null);
            await clearSquares();
            setSquares([]);
        } catch (err) {
            setError('Kunde inte rensa kvadrater');
            console.error('Fel vid rensning av kvadrater:', err);
        }
    };

    // Ladda in kvadrater när komponenten monteras
    useEffect(() => {
        fetchSquares();
    }, []);

    // Värden och funktioner som ska delas via Context
    const value = {
        squares,
        loading,
        error,
        fetchSquares,
        createSquare,
        resetSquares
    };

    return (
        <SquareContext.Provider value={value}>
            {children}
        </SquareContext.Provider>
    );
};