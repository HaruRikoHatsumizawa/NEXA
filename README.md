# NEXA

Versão Cloudflare do projeto Nexus, preservando a interface e as principais funções do projeto original.

- Cloudflare Workers no lugar do Flask.
- D1 para dados persistentes.
- Excel é lido no navegador com SheetJS.
- Sem R2.
- Login administrativo obrigatório para o painel.
- Resumo financeiro, Budget, Comparativo anual, Comparar planilhas e Energia ESP32.
- Banco de Dados para consultar os dados salvos e gerar novamente um .xlsx.

## Configuração

1. Crie um D1 chamado `nexa-db` e coloque o ID em `wrangler.toml`.
2. Execute `npx wrangler d1 execute nexa-db --remote --file=schema.sql`.
3. Configure `ADMIN_USER`, `ADMIN_PASSWORD` e `SESSION_SECRET` como secrets.
4. Execute `npm install` e `npm run deploy`.

O Excel original não é armazenado como arquivo: seus dados são persistidos no D1 e podem ser reconstruídos em uma nova planilha quando necessário.
