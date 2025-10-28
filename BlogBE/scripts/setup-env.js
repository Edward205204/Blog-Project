import fs from 'fs'

const envPath = '.env'
const examplePath = '.env.example'

if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists, skipping creation.')
} else if (fs.existsSync(examplePath)) {
  fs.copyFileSync(examplePath, envPath)
  console.log('📄 Copied .env.example → .env')
} else {
  fs.writeFileSync(envPath, '# Auto-generated empty .env file\n')
  console.log('⚠️ No .env.example found — created an empty .env instead.')
}
