import {useState} from 'react';

import styles from './Counter.module.scss';

export const Counter = () => {
    const [count, setCount] = useState(0);

    return (
        <div className={styles.wrapper}>
            <span className={styles.count}>{count}</span>
            <div className={styles.controls}>
                <button className={styles.btn} onClick={() => { setCount((c) => c - 1); }}>−</button>
                <button className={styles.btn} onClick={() => { setCount((c) => c + 1); }}>+</button>
            </div>
            <button
                className={`${styles.btn} ${styles['btn--reset']}`}
                onClick={() => { setCount(0); }}
            >
                reset
            </button>
        </div>
    );
};
