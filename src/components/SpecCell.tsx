import styles from './SpecCell.module.css'

interface SpecCellProps {
  label: string
  value: string
}

export function SpecCell({ label, value }: SpecCellProps) {
  return (
    <div className={styles.cell} data-testid="spec-cell">
      <p className={styles.value}>{value}</p>
      <p className={styles.label}>{label}</p>
    </div>
  )
}
