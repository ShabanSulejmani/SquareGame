import { useState, useEffect } from 'react';
import { useSquareContext } from '../context/SquareContext';
import Square from './Square';

/*
 Grid-komponent som visar kvadrater i ett spiralmönster från mitten och utåt
 */
const Grid = () => {
    const { squares, createSquare, resetSquares, loading, error } = useSquareContext();
    const [gridSize] = useState({ width: 10, height: 10 });
    const [nextPosition, setNextPosition] = useState({ x: 4, y: 4 }); // Starta i mitten
    const [isGridFull, setIsGridFull] = useState(false);
    const [currentLayer, setCurrentLayer] = useState(0); // Nuvarande lager av spiralen
    const [direction, setDirection] = useState(0); // 0: höger, 1: ner, 2: vänster, 3: upp
    const [stepsInCurrentDirection, setStepsInCurrentDirection] = useState(1); // Steg i nuvarande riktning
    const [stepsTaken, setStepsTaken] = useState(0); // Tagna steg i nuvarande riktning

    // Kontrollera om rutnätet är fullt när squares ändras
    useEffect(() => {
        if (squares.length >= gridSize.width * gridSize.height) {
            setIsGridFull(true);
        } else {
            setIsGridFull(false);
        }
    }, [squares, gridSize]);

    // Beräkna nästa position i ett spiralmönster
    const calculateNextPosition = () => {
        let nextX = nextPosition.x;
        let nextY = nextPosition.y;
        let nextDirection = direction;
        let nextStepsTaken = stepsTaken + 1;
        let nextStepsInCurrentDirection = stepsInCurrentDirection;
        let nextLayer = currentLayer;

        // Beräkna nästa position baserat på nuvarande riktning
        switch (direction) {
            case 0: // Höger
                nextX++;
                break;
            case 1: // Ner
                nextY++;
                break;
            case 2: // Vänster
                nextX--;
                break;
            case 3: // Upp
                nextY--;
                break;
        }

        // Kontrollera om vi behöver byta riktning
        if (nextStepsTaken >= stepsInCurrentDirection) {
            nextStepsTaken = 0;
            nextDirection = (direction + 1) % 4;

            // Efter att ha rört sig höger och sedan ner, öka stegen per riktning
            if (nextDirection === 2 || nextDirection === 0) {
                nextStepsInCurrentDirection++;
            }

            // Om vi har färdigställt ett komplett varv i spiralen, öka lagret
            if (nextDirection === 0) {
                nextLayer++;
            }
        }

        return {
            position: { x: nextX, y: nextY },
            direction: nextDirection,
            stepsTaken: nextStepsTaken,
            stepsInCurrentDirection: nextStepsInCurrentDirection,
            layer: nextLayer
        };
    };

    // Hantera klick på "Lägg till kvadrat"-knappen
    const handleAddSquare = async () => {
        try {
            // Försök lägga till en ny kvadrat på aktuell position
            await createSquare(nextPosition.x, nextPosition.y);

            // Beräkna nästa position enligt spiralmönstret
            const next = calculateNextPosition();
            setNextPosition(next.position);
            setDirection(next.direction);
            setStepsTaken(next.stepsTaken);
            setStepsInCurrentDirection(next.stepsInCurrentDirection);
            setCurrentLayer(next.layer);
        } catch (err) {
            console.error('Kunde inte lägga till kvadrat på aktuell position:', err);
        }
    };

    // Hantera klick på "Starta om"-knappen
    const handleReset = async () => {
        await resetSquares();
        setNextPosition({ x: 4, y: 4 }); // Återgå till mitten
        setDirection(0);
        setStepsInCurrentDirection(1);
        setStepsTaken(0);
        setCurrentLayer(0);
    };

    return (
        <div className="grid-container">
            <div className="controls">
                {!isGridFull ? (
                    <button
                        onClick={handleAddSquare}
                        disabled={loading}
                        className="add-button"
                    >
                        Lägg till kvadrat
                    </button>
                ) : (
                    <div className="grid-full-message">
                        <p>Nu är alla rutor ifyllda!</p>
                    </div>
                )}

                <button
                    onClick={handleReset}
                    className="reset-button"
                >
                    Starta om
                </button>

                <div className="position-info">
                    Nästa position: ({nextPosition.x}, {nextPosition.y})
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div
                className="grid"
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gridSize.width}, 50px)`,
                    gridTemplateRows: `repeat(${gridSize.height}, 50px)`,
                    gap: '2px',
                    position: 'relative'
                }}
            >
                {/* Rendera alla kvadrater */}
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