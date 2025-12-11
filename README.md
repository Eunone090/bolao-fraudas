# Bolão de Fraldas — Next.js (Provisório)

Projeto Next.js pronto para deploy no Vercel. Dados atualmente salvos no `localStorage` do navegador para testes rápidos.
Admin: senha `olivervemai`.

## Como usar
1. Instale dependências:
   npm install
2. Rode em dev:
   npm run dev
3. Abra: http://localhost:3000

## Deploy no Vercel
1. Crie repositório no GitHub e envie esses arquivos.
2. No Vercel: Add New → Project → escolha o repositório.
3. Deploy.

### Persistência (opcional)
Para persistência no servidor, recomendo habilitar **Vercel KV** e eu adapto as API routes para usar KV. Atualmente a app usa `localStorage`.
