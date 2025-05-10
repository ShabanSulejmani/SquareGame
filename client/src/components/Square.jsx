import { memo } from 'react';

/**
 * Komponent som representerar en färgad kvadrat i rutnätet
 */
const Square = memo(({ color, x, y }) => {
    return (
        <div
            className="square"
            style={{
                backgroundColor: color,
                gridColumn: x + 1, // +1 eftersom CSS grid börjar på 1
                gridRow: y + 1
            }}
            title={`Position: (${x}, ${y}), Färg: ${color}`}
        />
    );
});

export default Square;