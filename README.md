# Horlem — site administrativo

O site mantém o HTML estático original e usa arquivos JSON em `data/` para carregar projetos, categorias, serviços e configurações pelo Pages CMS. Não é necessário build ou framework JavaScript.

## Administrar o conteúdo

1. Instale o Pages CMS e autorize o acesso ao repositório pelo GitHub em https://app.pagescms.org.
2. Abra o repositório e selecione uma das áreas: Configurações do site, Portfólio, Categorias, Serviços, Biblioteca de gráficos ou Artigos.
3. Use os formulários para criar, editar ou excluir itens. Imagens podem ser enviadas diretamente pelos campos de imagem.
4. Publique as alterações pelo Pages CMS. O CMS registra a alteração no GitHub.
5. O workflow `Deploy GitHub Pages` enviará os arquivos estáticos diretamente ao GitHub Pages.

Não são necessários tokens ou credenciais no código.

## Dados do portfólio

Cada projeto pode conter título, descrição, categoria, tipo de gráfico, método, aplicação, texto explicativo, resultados, imagem principal, imagens adicionais e dados para o gráfico.

## Desenvolvimento

```bash
npm ci
npm run dev
npm run check:content
npm run lint
npm run build
```
