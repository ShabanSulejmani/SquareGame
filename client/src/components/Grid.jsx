import { useState, useEffect } from 'react';
import { useSquareContext } from '../context/SquareContext';
import Square from './Square';

/*
 Grid-komponent som visar rutnätet med kvadrater
 */
const Grid = () => {
    const { squares, createSquare, resetSquares, loading, error } = useSquareContext();
    const [gridSize] = useState({ width: 10, height: 10 });
    const [nextPosition, setNextPosition] = useState({ x: 0, y: 0 });
    const [isGridFull, setIsGridFull] = useState(false);

    // Kontrollera om rutnätet är fullt när squares ändras
    useEffect(() => {
        if (squares.length >= gridSize.width * gridSize.height) {
            setIsGridFull(true);
        } else {
            setIsGridFull(false);
        }
    }, [squares, gridSize]);

    // Hantera klick på "Lägg till kvadrat"-knappen
    const handleAddSquare = async () => {
        try {
            // Försök lägga till en ny kvadrat på aktuell position
            await createSquare(nextPosition.x, nextPosition.y);

            // Uppdatera till nästa position (gå rad för rad)
            const newX = (nextPosition.x + 1) % gridSize.width;
            const newY = newX === 0 ? nextPosition.y + 1 : nextPosition.y;
            setNextPosition({ x: newX, y: newY % gridSize.height });
        } catch (err) {
            console.error('Kunde inte lägga till kvadrat på aktuell position:', err);
        }
    };

    // Hantera klick på "Starta om"-knappen
    const handleReset = async () => {
        await resetSquares();
        setNextPosition({ x: 0, y: 0 });
    };

    return (
        <div className="grid-container">
            <div className="controls">
                {!isGridFull ? (
                    <>
                        <button
                            onClick={handleAddSquare}
                            disabled={loading}
                            className="add-button"
                        >
                            Lägg till kvadrat
                        </button>
                        <div className="position-info">
                            Nästa position: ({nextPosition.x}, {nextPosition.y})
                        </div>
                    </>
                ) : (
                    <div className="grid-full-message">
                        <p>Nu är alla rutor ifyllda!</p>
                        <button
                            onClick={handleReset}
                            className="reset-button"
                        >
                            Starta om
                        </button>
                    </div>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}

            <div
                className="grid"
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gridSize.width}, 50px)`,
                    gridTemplateRows: `repeat(${gridSize.height}, 50px)`,
                    gap: '2px'
                }}
            >
                {/* Rendera tomma celler som visar rutnätet */}
                {Array.from({ length: gridSize.width * gridSize.height }).map((_, index) => {
                    const x = index % gridSize.width;
                    const y = Math.floor(index / gridSize.width);

                    return (
                        <div
                            key={`cell-${x}-${y}`}
                            className="grid-cell"
                            style={{
                                gridColumn: x + 1,
                                gridRow: y + 1
                            }}
                        />
                    );
                })}

                {/* Rendera alla kvadrater ovanpå rutnätet */}
                {squares.map(square => (
                    <Square
                        key={square.id}
                        x={square.x}
                        y={square.y}
                        color={square.color}
                    />
                ))}
            </div>
        </div>
    );
};

export default Grid;