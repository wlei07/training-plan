import styles from './VideoPlayer.module.css'

interface VideoPlayerProps {
  src: string
  /** Accessible name for the player. */
  title: string
  unsupportedMessage: string
}

export function VideoPlayer({ src, title, unsupportedMessage }: VideoPlayerProps) {
  return (
    <div className={styles.frame}>
      <video
        data-testid="exercise-video"
        className={styles.video}
        src={src}
        title={title}
        controls
        loop
        playsInline
        preload="metadata"
      >
        {unsupportedMessage}
      </video>
    </div>
  )
}
