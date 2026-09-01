/**
 * Extracts the first frame of every video under public/media/ to a sibling
 * .jpg, which the exercise page uses as the <video> poster.
 *
 * The posters are committed, so this runs only when videos are added or
 * replaced — CI never needs ffmpeg. Set FFMPEG to use a binary that is not on
 * PATH, e.g. one from the ffmpeg-static npm package.
 *
 *   npm run posters
 *   FFMPEG=/path/to/ffmpeg npm run posters
 */
import { execFileSync } from 'node:child_process'
import { readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const MEDIA_ROOT = 'public/media'
const LONG_EDGE = 1280
const ffmpeg = process.env.FFMPEG ?? 'ffmpeg'

function videosUnder(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) return videosUnder(path)
    return path.endsWith('.mp4') ? [path] : []
  })
}

const videos = videosUnder(MEDIA_ROOT).sort()
if (videos.length === 0) {
  console.error(`No .mp4 files under ${MEDIA_ROOT}/`)
  process.exit(1)
}

for (const video of videos) {
  const poster = video.replace(/\.mp4$/, '.jpg')
  execFileSync(
    ffmpeg,
    [
      '-y',
      '-i', video,
      // First frame only. -frames:v 1 without a seek gives frame 0, which is
      // always a keyframe and so needs no decoding of anything before it.
      '-frames:v', '1',
      // Cap the long edge at 1280px, leaving the short edge to the aspect
      // ratio (-2 keeps it even, which JPEG's chroma subsampling requires).
      // The player is at most 78vh tall, so a 1280px source still covers a 2x
      // phone display; the full 1080x1920 frame was ~400 kB of detail nothing
      // could show. gt(a,1) is true for landscape, so this handles either.
      '-vf', `scale=w='if(gt(a\\,1)\\,min(${LONG_EDGE}\\,iw)\\,-2)':h='if(gt(a\\,1)\\,-2\\,min(${LONG_EDGE}\\,ih))'`,
      '-q:v', '4',
      poster,
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  )
  console.log(`  ${relative(MEDIA_ROOT, poster)}`)
}

console.log(`\n${videos.length} posters written under ${MEDIA_ROOT}/`)
