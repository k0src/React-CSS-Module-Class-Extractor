import styles from "./template.module.css";

type Size = "sm" | "lg";
type Theme = "primary" | "secondary";

interface Props {
  size: Size;
  theme: Theme;
  unknownSize: string;
}

export function Card({ size, theme, unknownSize }: Props) {
  return (
    <div>
      <div className={styles[`card-${size}-${theme}`]} />
      <div className={styles[`fallback-${unknownSize}-${theme}`]} />
    </div>
  );
}
