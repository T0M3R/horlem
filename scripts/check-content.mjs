import fs from 'node:fs'

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'))

const errors = []
const portfolio = readJson('./public/data/portfolio.json')
if (!Array.isArray(portfolio)) errors.push('portfolio.json deve ser uma lista.')

for (const [index, item] of (Array.isArray(portfolio) ? portfolio : []).entries()) {
  if (!item.id) errors.push(`Projeto ${index + 1}: identificador obrigatório.`)
  if (!item.title) errors.push(`Projeto ${index + 1}: título obrigatório.`)
  if (!item.category) errors.push(`Projeto ${index + 1}: categoria obrigatória.`)
  if (!Array.isArray(item.data)) errors.push(`Projeto ${item.title || index + 1}: dados do gráfico inválidos.`)
}

for (const path of ['./public/data/site.json', './public/data/categories.json', './public/data/services.json', './public/data/library.json', './public/data/articles.json']) {
  try {
    readJson(path)
  } catch {
    errors.push(`${path}: JSON inválido ou arquivo ausente.`)
  }
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

console.log(`Conteúdo válido: ${portfolio.length} projeto(s) no portfólio.`)
