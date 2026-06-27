import type { UISize } from "./types";
import styles from "./imported.module.css";

type LocalSize = UISize;

export function Imported({ size }: { size: LocalSize }) {
  return <div className={styles[`button-${size}`]} />;
}
