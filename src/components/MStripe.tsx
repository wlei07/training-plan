import styles from './MStripe.module.css'

interface MStripeProps {
  className?: string
}

/**
 * The M tricolor divider. Decorative only — never an action surface.
 */
export function MStripe({ className }: MStripeProps) {
  return (
    <div
      data-testid="m-stripe"
      aria-hidden="true"
      className={className ? `${styles.stripe} ${className}` : styles.stripe}
    />
  )
}
