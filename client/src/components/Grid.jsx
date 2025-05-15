import React from 'react';
import { useState, useEffect } from 'react';
import { useSquareContext } from '../context/SquareContext';
import Square from './Square';
import { getRandomColor } from '../services/api';

const Grid = () => {
    // Hämta squares och funktioner från context
    const { squares, createSquare, resetSquares, loading, error } = useSquareContext();

    // Storlek på rutnätet
    const gridSize = { width: 20, height: 20 };

    // Om alla rutor är fyllda
    const [isGridFull, setIsGridFull] = useState(false);
    // Nuvarande mönster ('spiral' eller 'box')
    const [patternMode, setPatternMode] = useState('spiral');

    // Starta spiral i mitten av rutnätet
    const [spiral, setSpiral] = useState({
        position: { x: Math.floor(gridSize.width / 2), y: Math.floor(gridSize.height / 2) },
        direction: 0,          // 0 = höger, 1 = ner, 2 = vänster, 3 = upp
        stepsTaken: 0,         // Steg tagna i nuvarande riktning
        stepsInCurrentDirection: 1, // Antal steg att ta i nuvarande riktning innan svängning
        layer: 0,              // Vilket lager i spiralen vi är på
    });

    // State för boxmönstret
    const [box, setBox] = useState({
        size: 2,  // Storleken på boxen
        index: 0, // Index för nuvarande position i boxen
    });

    // Kolla om rutnätet är fullt när squares uppdateras
    useEffect(() => {
        setIsGridFull(squares.length >= gridSize.width * gridSize.height);
    }, [squares]);

    // Beräkna nästa position i spiralen
    const calculateNextSpiral = () => {
        let { x, y } = spiral.position;
        let { direction, stepsTaken, stepsInCurrentDirection, layer } = spiral;

        // Flytta enligt nuvarande riktning
        switch (direction) {
            case 0: x++; break; // Höger
            case 1: y++; break; // Ner
            case 2: x--; break; // Vänster
            case 3: y--; break; // Upp
        }

        stepsTaken++;

        // Om vi nått slutet av nuvarande riktning, byt riktning
        if (stepsTaken >= stepsInCurrentDirection) {
            direction = (direction + 1) % 4;
            stepsTaken = 0;

            // Öka antal steg för vågräta riktningar (höger/vänster)
            if (direction === 0 || direction === 2) {
                stepsInCurrentDirection++;
            }

            // Nytt lager när vi går höger igen
            if (direction === 0) {
                layer++;
            }
        }

        return { position: { x, y }, direction, stepsTaken, stepsInCurrentDirection, layer };
    };

    // Beräkna nästa position i boxmönstret
    const calculateNextBox = (boxState) => {
        const { size, index } = boxState;
        let x = 0, y = 0;

        // Beräkna position baserat på index i boxen
        if (index === 0) {
            // Första positionen i boxen
            x = size === 2 ? 0 : size - 1;
            y = 0;
        } else if (index < size) {
            // Övre kanten av boxen
            x = index;
            y = 0;
        } else if (index < 2 * size - 1) {
            // Högra kanten av boxen
            x = size - 1;
            y = index - size + 1;
        } else if (index < 3 * size - 2) {
            // Nedre kanten av boxen
            x = 3 * size - 3 - index;
            y = size - 1;
        } else {
            // Insidan av boxen (om den är större än 2x2)
            const innerSize = size - 2;
            const borderCount = 3 * size - 2;
            const innerIndex = index - borderCount;

            if (innerSize > 0) {
                const col = Math.floor(innerIndex / innerSize);
                const row = innerIndex % innerSize;
                x = col + 1;
                y = row + 1;
            }
        }

        // Beräkna nästa index och ev. ny boxstorlek
        const nextIndex = index + 1;
        const total = size * size;
        const nextSize = nextIndex >= total ? size + 1 : size;
        const resetIndex = nextIndex >= total ? 0 : nextIndex;

        return { position: { x, y }, nextSize, nextIndex: resetIndex };
    };

    // Kontrollera om ruta redan är upptagen
    const isSquareOccupied = (x, y) => {
        return squares.some(s => s.x === x && s.y === y);
    };

    // Hantera klick för att lägga till nästa kvadrat
    const handleAddSquare = async () => {
        try {
            if (patternMode === 'spiral') {
                // För spiralmönster
                const { x, y } = spiral.position;
                if (!isSquareOccupied(x, y)) {
                    await createSquare(x, y, getRandomColor());
                }
                setSpiral(calculateNextSpiral());
            } else {
                // För boxmönster
                let boxState = { ...box };
                let tries = 0;
                const maxTries = gridSize.width * gridSize.height;
                let next = calculateNextBox(boxState);

                // Hitta nästa lediga position
                while (isSquareOccupied(next.position.x, next.position.y) && tries < maxTries) {
                    boxState = { size: next.nextSize, index: next.nextIndex };
                    next = calculateNextBox(boxState);
                    tries++;
                }

                if (tries < maxTries) {
                    await createSquare(next.position.x, next.position.y, getRandomColor());
                    setBox({ size: next.nextSize, index: next.nextIndex });
                } else {
                    console.warn("Inga lediga positioner hittades för boxmönstret.");
                }
            }
        } catch (err) {
            console.error("Fel vid skapande av kvadrat:", err);
        }
    };

    // Rensa rutnät och återställ tillstånd
    const handleReset = async () => {
        await resetSquares();
        setSpiral({
            position: { x: Math.floor(gridSize.width / 2), y: Math.floor(gridSize.height / 2) },
            direction: 0,
            stepsTaken: 0,
            stepsInCurrentDirection: 1,
            layer: 0
        });
        setBox({ size: 2, index: 0 });
    };

    // Byt mönster och rensa rutnät
    const handleSetPattern = async (mode) => {
        await resetSquares(); // Rensa alla kvadrater först
        setPatternMode(mode); // Sätt valt mönster

        if (mode === 'spiral') {
            setSpiral({
                position: { x: Math.floor(gridSize.width / 2), y: Math.floor(gridSize.height / 2) },
                direction: 0,
                stepsTaken: 0,
                stepsInCurrentDirection: 1,
                layer: 0
            });
        } else {
            setBox({ size: 2, index: 0 });
        }
    };

    return (
        <div className="grid-container">
            <div className="controls">
                <h3>Välj mönster</h3>

                {/* Box-knapp med intryckt stil om vald */}
                <button
                    onClick={() => handleSetPattern('box')}
                    disabled={loading}
                    style={{
                        fontWeight: patternMode === 'box' ? 'bold' : 'normal',
                        backgroundColor: patternMode === 'box' ? '#4CAF50' : 'initial',
                        color: patternMode === 'box' ? 'white' : 'black',
                        marginRight: '10px',
                        padding: '8px 16px',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Box
                </button>

                {/* Spiral-knapp med intryckt stil om vald */}
                <button
                    onClick={() => handleSetPattern('spiral')}
                    disabled={loading}
                    style={{
                        fontWeight: patternMode === 'spiral' ? 'bold' : 'normal',
                        backgroundColor: patternMode === 'spiral' ? '#4CAF50' : 'initial',
                        color: patternMode === 'spiral' ? 'white' : 'black',
                        padding: '8px 16px',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Spiral
                </button>

                <br /><br />

                {/* Lägg till kvadrat-knapp */}
                {!isGridFull ? (
                    <button onClick={handleAddSquare} disabled={loading}>
                        Lägg till kvadrat
                    </button>
                ) : (
                    <p>Nu är alla rutor ifyllda!</p>
                )}

                {/* Starta om-knapp */}
                <button onClick={handleReset}>
                    Starta om
                </button>
            </div>

            {/* Visa eventuellt felmeddelande */}
            {error && <div className="error-message">{error}</div>}

            {/* Rutnätet */}
            <div
                className="grid"
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gridSize.width}, 50px)`,
                    gridTemplateRows: `repeat(${gridSize.height}, 50px)`,
                    gap: '2px'
                }}
            >
                {/* Rendera varje kvadrat */}
                {squares.map(square => (
                    <Square key={square.id} x={square.x} y={square.y} color={square.color} />
                ))}
            </div>
        </div>
    );
};

export default Grid;