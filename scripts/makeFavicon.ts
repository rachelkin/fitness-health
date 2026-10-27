import sharp from 'sharp'
import path from 'path'

const input = path.join(process.cwd(), 'public', 'images', 'LOGO.jpg')
const output = path.join(process.cwd(), 'public', 'favicon.png')

sharp(input)
  .resize(64, 64)
  .png()
  .toFile(output)
  .then(() => console.log('favicon.png created'))
  .catch(err => console.error(err))
