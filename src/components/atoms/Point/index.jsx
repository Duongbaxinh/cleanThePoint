import PropTypes from 'prop-types';
import React, { useEffect, useState, useMemo } from 'react';
import './styles.css';

function Point({ point, onClick, isHidden, disabled, isReset }) {
    const [timeLeft, setTimeLeft] = useState(3000);

    useEffect(() => {
        if (!isHidden) {
            setTimeLeft(3000);
            return;
        }
        const intervalId = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    clearInterval(intervalId);
                    return 0;
                }
                return prev - 100;
            });
        }, 100);
        if (disabled) {
            return clearInterval(intervalId)
        }
        return () => clearInterval(intervalId);
    }, [disabled, isHidden]);

    // Random position point
    const position = useMemo(() => ({
        left: Math.random() * (500 - 30),
        top: Math.random() * (400 - 30),
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [isReset]);

    const handleClick = () => {
        if (!disabled && !isHidden) {
            onClick(point);
        }
    };

    const opacity = isHidden ? Math.max(0, timeLeft / 3000) : 1;
    const zIndex = !isHidden ? 1 : 999
    const backgroundColor = !isHidden ? "white" : "red"
    return (
        <div
            className="point"
            onClick={handleClick}
            style={{
                backgroundColor: backgroundColor,
                position: 'absolute',
                left: position.left,
                top: position.top,
                opacity: opacity,
                zIndex: zIndex
            }}
        >
            <p className='point_title'>{point}</p>
            {isHidden && (
                <p className='point_time'>{(timeLeft / 1000).toFixed(1)}s</p>
            )}
        </div>
    );
}

Point.propTypes = {
    point: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    isHidden: PropTypes.bool.isRequired,
    isReset: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
};

export default Point;