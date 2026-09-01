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
      {/*
        PREVIOUS/NEXT stay on the /g/:groupId/e/:exerciseId route, so without a
        key React would reuse this <video> node and only swap its src. WebKit —
        and therefore every browser on iOS, Safari, Chrome and Firefox alike —
        carries the pre-swap playback state over on a reused element: its
        shadow-DOM controls keep showing PAUSE for a video that is not playing.
        Keying on src gives each exercise a brand-new element with fresh
        controls, which can only start out paused.
      */}
      <video
        key={src}
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
