import { Link } from 'react-router-dom'
import styles from './BackLink.module.css'

interface BackLinkProps {
  to: string
  label: string
}

export function BackLink({ to, label }: BackLinkProps) {
  return (
    <Link to={to} className={styles.link}>
      <span aria-hidden="true">&larr;</span> {label}
    </Link>
  )
}
