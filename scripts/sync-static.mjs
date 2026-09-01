import { cpSync, mkdirSync } from 'node:fs'

mkdirSync('public', { recursive: true })
cpSync('playground', 'public/playground/app', { recursive: true })
cpSync('assets', 'public/assets', { recursive: true })
console.log('synced playground/ -> public/playground/app/ and assets/ -> public/assets/')
