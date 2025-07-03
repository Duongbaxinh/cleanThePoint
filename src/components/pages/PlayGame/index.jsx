import { useEffect, useRef, useState } from 'react';
import { formatDuration } from '../../../utils/formatDurationTime';
import Point from '../../atoms/Point';
import './styles.css';

function PlayGame() {
    const [points, setPoints] = useState([]);
    const [isReset, setIsReset] = useState(false)
    const [clickedPoints, setClickedPoints] = useState([]);
    const [timeCount, setTimeCount] = useState(0);
    const [autoPlay, setAutoPlay] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const expectedValueRef = useRef(1);
    const intervalIdRef = useRef(null);
    const [stop, setStop] = useState(false);
    const [win, setWin] = useState(false);
    const start = points.length > 0;

    // Generate point by value input
    const generatePoints = (numberPoint) => {
        if (numberPoint <= 0) return alert("Please enter a number bigger 0")
        if (Number.isInteger(numberPoint) && numberPoint > 0) {
            setPoints(Array.from({ length: numberPoint }, (_, i) => i + 1));
            setClickedPoints([]);
            setStop(false);
            setWin(false);
            setTimeCount(0);
            expectedValueRef.current = 1;
            setAutoPlay(false); // Reset autoPlay on new game
        } else {
            setPoints([]);
            setTimeCount(0);
        }
    };

    // clean point function
    const handleClick = (point) => {
        if (stop || win) return;
        setClickedPoints(prev => [...prev, point]);

        if (clickedPoints.length + 1 === points.length) {
            setAutoPlay(false);
            setTimeout(() => {
                setWin(true);
            }, 3100);
            return;
        }

        if (expectedValueRef.current !== point) {
            setStop(true);
            setAutoPlay(false);
            return;
        }

        expectedValueRef.current += 1;
    };

    const resetGame = ({ clearPoints = false, clearInput = false } = {}) => {
        setTimeCount(0);
        setIsReset(prev => !prev);
        setWin(false);
        setStop(false);
        setAutoPlay(false);

        if (clearPoints) {
            setPoints([]);
        } else {
            generatePoints(points.length);
        }

        if (clearInput) {
            setInputValue('');
        }
    };
    // restart game
    const handleRestart = () => {
        resetGame();
    };
    // return begin
    const handleReset = () => {
        resetGame({ clearPoints: true, clearInput: true });
    };

    const getTitlePlayGame = () => {
        if (stop) return { title: "game over", color: "play_title--red" };
        if (win) return { title: "all cleared", color: "play_title--green" };
        return { title: "let's play", color: "play_title--black" };
    };

    // Time count
    useEffect(() => {
        if (points.length > 0 && !stop && !win && start) {
            intervalIdRef.current = setInterval(() => {
                setTimeCount(prev => prev + 100);
            }, 100);
        } else {
            clearInterval(intervalIdRef.current);
        }

        return () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
                intervalIdRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [points.length, stop, win, clickedPoints.length]);

    // Auto-play 
    useEffect(() => {
        if (autoPlay && !stop && !win && clickedPoints.length < points.length) {

            const intervalId = setInterval(() => {
                if (!stop && !win && clickedPoints.length < points.length) {
                    handleClick(expectedValueRef.current);
                }
            }, 1000);

            return () => clearInterval(intervalId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoPlay, stop, win, clickedPoints.length, points.length]);


    return (
        <div className='play'>
            <form onSubmit={(e) => {
                e.preventDefault();
                generatePoints(Number(inputValue));
            }}>
                <p className={`play_title ${getTitlePlayGame().color}`}>{getTitlePlayGame().title}</p>
                <label className='play_input_label'>Point:</label>
                <input
                    className='play_input'
                    placeholder='Enter quantity point'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <br />
                <span className='play_input_label'>Time: </span> <span>{formatDuration(timeCount)}</span>
                <br />
                <div className="play_action">
                    {points.length <= 0 ? (
                        <button className='play_btn' type='submit'>Play</button>
                    ) : (
                        <button className='play_btn' type='button' onClick={handleRestart}>Restart</button>
                    )}
                    {(!win && !stop && start) && (
                        <button className='play_btn' type="button" onClick={() => setAutoPlay(!autoPlay)}>
                            {autoPlay ? 'AutoPlay Off' : 'AutoPlay On'}
                        </button>
                    )}
                    {(start) && (
                        <button className='play_btn' type="button" onClick={handleReset}>
                            {"Reset"}
                        </button>
                    )}
                </div>
            </form>

            <div className="play_point">
                {points.map((point) => (
                    <Point
                        key={point}
                        point={point}
                        onClick={handleClick}
                        isHidden={clickedPoints.includes(point)}
                        disabled={stop || win}
                        isReset={isReset}
                    />
                ))}
            </div>
        </div>
    );
}

export default PlayGame;