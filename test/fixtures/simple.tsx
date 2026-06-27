import styles from "./simple.module.css";

export function Card() {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader} />
      <div className={styles.card} />
      <div className={styles.footer} />
      <div className={styles["quoted"]} />
    </div>
  );
}
