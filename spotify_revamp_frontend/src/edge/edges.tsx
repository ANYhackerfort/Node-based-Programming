import React, { useState, useEffect } from 'react';
import styles from './styles.module.css'

interface EdgeProps {
    selected: boolean;
    isNew: boolean;
    position: { x0: number; y0: number; x1: number; y1: number };
    onMouseDownEdge: () => void;
    onClickDelete: () => void;
}

const EdgeComponent: React.FC<EdgeProps> = (props) => {
    const [middlePoint, setMiddlePoint] = useState<{ x: number; y: number }>({
        x: (props.position.x0 + props.position.x1) / 2,
        y: (props.position.y0 + props.position.y1) / 2,
    });

    useEffect(() => {
        setMiddlePoint({
            x: (props.position.x0 + props.position.x1) / 2,
            y: (props.position.y0 + props.position.y1) / 2,
        });
    }, [props.position]);

    const calculateOffset = (value: number): number => {
        return value / 2;
    };

    const handleOnMouseDownEdge = (event: React.MouseEvent): void => {
        event.stopPropagation();
        props.onMouseDownEdge();
    };

    const handleOnClickDelete = (event: React.MouseEvent): void => {
        event.stopPropagation();
        props.onClickDelete();
    };

    return (
        <svg className={styles.wrapper}>
            <path
                className={props.isNew ? styles.edgeNew : props.selected ? styles.edgeSelected : styles.edge}
                d={`M ${props.position.x0} ${props.position.y0} C ${
                    props.position.x0 + calculateOffset(Math.abs(props.position.x1 - props.position.x0))
                } ${props.position.y0}, ${props.position.x1 - calculateOffset(Math.abs(props.position.x1 - props.position.x0))} ${
                    props.position.y1
                }, ${props.position.x1} ${props.position.y1}`}
                onMouseDown={handleOnMouseDownEdge}
            />
            <g
                className={props.selected ? styles.delete : styles.deleteHidden}
                transform={`translate(${middlePoint.x}, ${middlePoint.y - (props.selected ? 24 : 0)})`}
                onMouseDown={handleOnClickDelete}
            >
                <circle className={styles.circle} />
            </g>
            <svg
                fill="currentColor"
                strokeWidth="0"
                width="30"
                height="30"
                viewBox="210 240 1000 1000"
                style={{ overflow: 'visible' }}
                className={styles.icon}
            >
                <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0h120.4c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64s14.3-32 32-32h96l7.2-14.3zM32 128h384v320c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"></path>
            </svg>
        </svg>
    );
};

export default EdgeComponent;
