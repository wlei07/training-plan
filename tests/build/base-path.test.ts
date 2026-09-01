import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry: string): string[] => {
    const full: string = join(dir, entry)
    if (statSync(full).isDirectory()) {
      return sourceFiles(full)
    }
    return /\.(ts|tsx)$/.test(entry) ? [full] : []
  })
}

/**
 * Strips comments before scanning.
 *
 * The guard is about CODE composing a media path. Doc comments legitimately
 * name the media directory in prose — src/data/groups.ts and src/data/types.ts
 * both do — and matching those would make the test fail on correct code.
 */
function code(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
}

describe('base path safety', () => {
  it('declares the GitHub Pages base path', () => {
    const config: string = readFileSync(
      join(process.cwd(), 'vite.config.ts'),
      'utf-8',
    )
    expect(config).toContain("base: '/training-plan/'")
  })

  it('composes media URLs only through mediaUrl()', () => {
    const offenders: string[] = sourceFiles(join(process.cwd(), 'src'))
      .filter((file: string): boolean => !file.endsWith('lib/media.ts'))
      .filter((file: string): boolean =>
        code(readFileSync(file, 'utf-8')).includes('media/'),
      )
    expect(offenders, `hard-coded media path in: ${offenders.join(', ')}`).toEqual(
      [],
    )
  })
})
