import React, { useRef, MouseEvent } from 'react';
import styles from "./styles.module.css";

interface NodeProps {
    id: string;
    x: number;
    y: number;
    numberInputs: number;
    numberOutputs: number;
    selected: boolean;
    onMouseDownNode: (id: string, event: MouseEvent<HTMLDivElement>) => void;
    onMouseDownOutput: (outputPositionX: number, outputPositionY: number, nodeId: string, outputIndex: number, event: React.MouseEvent<HTMLDivElement>) => void;
    onMouseEnterInput: (inputPositionX: number, inputPositionY: number, nodeId: string, outputIndex: number) => void;
    onMouseLeaveInput: (nodeId: string, inputIndex: number) => void;
}

const NodeComponent: React.FC<NodeProps> = (props) => {
    // Using refs for DOM elements
    const outputRefs = useRef<(HTMLDivElement | null)[]>([]);
    const inputRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleMouseDownOutput = (event: React.MouseEvent<HTMLDivElement>, outputIndex: number) => {
        event.stopPropagation();
        const ref = outputRefs.current[outputIndex];
        if (ref) {
            const rect = ref.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            props.onMouseDownOutput(centerX, centerY, props.id, outputIndex, event);
        }
    };

    const handleMouseEnterInput = (inputIndex: number) => {
        const ref = inputRefs.current[inputIndex];
        if (ref) {
            const rect = ref.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            props.onMouseEnterInput(centerX, centerY, props.id, inputIndex);
        }
    };

    const handleMouseLeaveInput = (inputIndex: number) => {
        props.onMouseLeaveInput(props.id, inputIndex);
    };

    return (
        <div
            className={props.selected ? styles.nodeSelected : styles.node}
            style={{
                transform: `translate(${props.x}px, ${props.y}px)`,
            }}
            onMouseDown={(event: React.MouseEvent<HTMLDivElement>) => {
                event.stopPropagation();
                props.onMouseDownNode(props.id, event);
            }}
        >
            <div className={styles.inputsWrapper}>
                {Array.from({ length: props.numberInputs }, (_, index) => (
                    <div
                        key={index}
                        ref={el => inputRefs.current[index] = el}
                        className={styles.input}
                        onMouseEnter={() => handleMouseEnterInput(index)}
                        onMouseLeave={() => handleMouseLeaveInput(index)}
                    />
                ))}
            </div>
            <div className={styles.outputsWrapper}>
                {Array.from({ length: props.numberOutputs }, (_, index) => (
                    <div
                        key={index}
                        ref={el => outputRefs.current[index] = el}
                        className={styles.output}
                        onMouseDown={(event) => handleMouseDownOutput(event, index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default NodeComponent;
