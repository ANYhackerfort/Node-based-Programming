import React, { useState, useEffect } from 'react';
import styles from "./styles.module.css";

interface ButtonsProps {
    showDelete: boolean;
    onClickAdd: (numberInputs: number, numberOutputs: number) => void;
    onClickDelete: () => void;
}

const ButtonsComponent: React.FC<ButtonsProps> = ({ showDelete, onClickAdd, onClickDelete }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [numberInputs, setNumberInputs] = useState<number>(0);
    const [numberOutputs, setNumberOutputs] = useState<number>(0);

    useEffect(() => {
        // Mimic SolidJS 'clickOutside' directive
        const onClickOutside = (e: MouseEvent) => {
            if (!e.target || !(e.target as HTMLElement).closest(`.${styles.wrapper}`)) {
                setIsOpen(false);
            }
        };
        document.body.addEventListener('click', onClickOutside);

        return () => {
            document.body.removeEventListener('click', onClickOutside);
        };
    }, []);

    const handleOnClickAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setIsOpen(true);
    };

    const handleOnClickAddNode = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (numberInputs > 4 || numberInputs < 0 || numberOutputs > 4 || numberOutputs < 0) return;

        setIsOpen(false);
        onClickAdd(numberInputs, numberOutputs);
        setNumberInputs(0);
        setNumberOutputs(0);
    };

    const handleChangeNumberInputs = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumberInputs(parseInt(event.target.value));
    };

    const handleChangeNumberOutputs = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumberOutputs(parseInt(event.target.value));
    };

    return (
        <div className={styles.wrapper}>
            <button className={showDelete ? styles.buttonDelete : styles.buttonDeleteHidden} onClick={onClickDelete}>
                {/* SVG Icon */}
            </button>
            <button className={styles.buttonAdd} onClick={handleOnClickAdd}>
                {/* SVG Icon */}
            </button>

            <div className={isOpen ? styles.dropdown : styles.dropdownHidden}>
                <label className={styles.label}>Number of inputs</label>
                <input className={styles.input} type="number" value={numberInputs} onChange={handleChangeNumberInputs}></input>
                <label className={styles.label}>Number of outputs</label>
                <input className={styles.input} type="number" value={numberOutputs} onChange={handleChangeNumberOutputs}></input>
                <button className={styles.buttonRect} onClick={handleOnClickAddNode}>
                    Add node
                </button>
            </div>
        </div>
    );
};

export default ButtonsComponent;
