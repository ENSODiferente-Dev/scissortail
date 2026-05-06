import { copyFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

const copyJobs = [
  ['src/content/terms.html', 'public/terms.html'],
  ['src/content/privacy.html', 'public/privacy.html'],
]

async function main() {
  for (const [sourceRelPath, targetRelPath] of copyJobs) {
    const sourcePath = path.join(projectRoot, sourceRelPath)
    const targetPath = path.join(projectRoot, targetRelPath)
    await mkdir(path.dirname(targetPath), { recursive: true })
    await copyFile(sourcePath, targetPath)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
