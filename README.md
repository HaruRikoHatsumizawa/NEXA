# NEXA

Cópia do projeto Nexus adaptada para Cloudflare.

A interface e o fluxo do Nexus foram preservados. As únicas mudanças estruturais necessárias são:
- Flask -> Cloudflare Workers.
- pandas/openpyxl -> SheetJS no navegador para ler/analisar Excel.
- memória do Flask -> Cloudflare D1.
- sessão Flask -> cookie HttpOnly assinado.
- arquivos Excel não precisam de R2: o conteúdo estruturado é salvo no D1 e pode ser reconstruído/exportado no navegador.

## Configuração

1. Crie um D1 chamado `nexa-db`.
2. Coloque o ID do D1 em `wrangler.toml`.
3. Execute `npx wrangler d1 execute nexa-db --remote --file=schema.sql`.
4. Configure os secrets:
   `npx wrangler secret put ADMIN_USER`
   `npx wrangler secret put ADMIN_PASSWORD`
   `npx wrangler secret put SESSION_SECRET`
5. `npm install`
6. `npm run deploy`

O endpoint `POST /api/energia/leitura` continua público para permitir que o ESP32 envie telemetria sem uma sessão do navegador.
