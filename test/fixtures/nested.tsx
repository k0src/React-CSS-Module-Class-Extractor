import styles from "./nested.module.css";

type ButtonVariant = "solid" | "ghost";
type Variant = ButtonVariant;

interface Props {
  variant: Variant;
}

export function Nested({ variant }: Props) {
  return (
    <div>
      <div className={styles.root} />
      <div className={styles[`button-${variant}`]} />
      <div className={styles[getClass()]} />
    </div>
  );
}

function getClass(): string {
  return "ignored";
}
