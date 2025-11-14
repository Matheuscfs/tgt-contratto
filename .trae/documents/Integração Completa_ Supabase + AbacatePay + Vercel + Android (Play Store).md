## Visão Geral
- Transformar o protótipo de telas em um aplicativo completo: web (Vercel) e Android (Play Store) usando Capacitor.
- Backend de dados no Supabase: autenticação, banco, storage, realtime, RLS.
- Cobranças e assinaturas via AbacatePay (PIX), com webhook de confirmação.
- Substituir todos dados mockados por dados reais do banco.

## Estado Atual (Auditoria)
- Estrutura mínima com `components/` e `views/` e `.env.local` (tem `VITE_SUPABASE_URL`).
- Não há `package.json`, roteamento, nem cliente Supabase.
- Telas usam props e mocks. Exemplos confirmados:
  - `views/DashboardPage.tsx:58` usa `MOCK_DATA` (visitas, serviços, favoritos, origem).  
  - `views/NotificationsPage.tsx:10` usa `MOCK_NOTIFICATIONS`.
  - `components/QuoteModal.tsx:14` envia `alert` ao invés de gravar no banco.
  - `views/HomePage.tsx:9` usa `CATEGORIES` importado de `../constants` (arquivo ausente).
  - Várias telas importam tipos de `../types`, mas o arquivo não existe.

## Arquitetura Proposta
- Frontend: Vite + React + TypeScript + Tailwind + Heroicons.
- Organização: `src/` com `app` (router, layout), `lib/supabase.ts`, `features/*`, `components`, `views`.
- Estado: React Query para data-fetch e cache, Context para sessão do usuário.
- Mobile: Capacitor para wrapper Android; PWA habilitada (Service Worker + manifest), opção TWA caso necessário.
- Deploy Web: Vercel (build de Vite, variáveis de ambiente, função serverless para webhook do AbacatePay).
- Backend: Supabase (Postgres, Auth, Storage, Realtime, Edge Functions se precisarmos server-side sem Vercel).

## Modelagem de Banco (Supabase)
- Tabelas principais:
  - `profiles`: id (uuid auth), role (`client`|`company`), name, email, phone, created_at.
  - `companies`: id (uuid, FK profiles), name, logo_url, cover_url, description, category, specialties json[], phone, location (street, number, complement, neighborhood, city, state).
  - `services`: id, company_id, name, description, price (text/num), detailed_description, image_url.
  - `portfolio_images`: id, company_id, url.
  - `quotes`: id, client_id, company_id, service_id (nullable), status (`Solicitado`,`Respondido`,`Concluído`,`Cancelado`), description, attachments json[], created_at.
  - `reviews`: id, client_id, company_id, rating, comment, created_at.
  - `favorites`: client_id, company_id (PK composto).
  - `conversations`: id, client_id, company_id, created_at.
  - `messages`: id, conversation_id, sender (`client`|`company`), text, created_at.
  - `notifications`: id, user_id, title, description, type, is_new, created_at.
  - `subscriptions`: company_id, plan_name, status (`Ativa`|`Cancelada`|`Pendente`), price (numeric), renewal_date (date), payment_method (json: brand,last4), abacate_charge_id.
  - `billing_history`: id, company_id, amount (text/numeric), status (`Pago`|`Pendente`), date.
  - `categories`: id, name, icon (opcional) — para substituir `CATEGORIES` estático.
- Storage buckets:
  - `company-logos`, `company-covers`, `portfolio`, `quote-attachments`.
- RLS (Row Level Security) resumo:
  - `profiles`: usuário vê/edita próprio perfil.
  - `companies/services/portfolio_images`: público select, dono CRUD.
  - `quotes`: cliente cria e vê as próprias; empresa vê e atualiza quando `company_id` corresponde; outros negado.
  - `conversations/messages`: somente cliente e empresa participantes.
  - `notifications`: somente dono.
  - `favorites`: somente cliente dono do registro.
  - `reviews`: cliente cria, público select; edição restrita.
  - `subscriptions/billing_history`: empresa dona; alterações por função server (webhook) com service key.

## Integrações (Supabase)
- Cliente: `@supabase/supabase-js` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
- Tipos: gerar com CLI do Supabase para `src/types/supabase.ts` e tipos de domínio finos (`Company`, `Service`, etc.).
- Auth: email/senha nas telas `LoginPage.tsx` e `RegisterPage.tsx`, recuperação de senha em `ForgotPasswordPage.tsx`.
- Realtime: canal em `messages` para Chat (`views/ChatPage.tsx`), atualiza `conversation.messages` em tempo real.
- Queries: hooks por tela (React Query) com paginação onde aplicável.

## Integração de Pagamentos (AbacatePay)
- Fluxo de assinatura em `views/SubscriptionPage.tsx`:
  - Criar cobrança PIX via API AbacatePay (retorno: `id`, `status`, `qrcode`).
  - Mostrar QR Code e status, gravar `subscriptions` e `billing_history`.
  - Webhook: endpoint (Vercel) recebe eventos da AbacatePay, valida assinatura (`ABACATEPAY_WEBHOOK_SECRET`), atualiza `subscriptions.status` e adiciona registro em `billing_history` no Supabase (usando Service Role Key em Vercel).
- Cancelamento/planos: ações atualizam registros e refletem UI.

## Substituição de Mocks (Tela a Tela)
- `DashboardPage.tsx:58` `MOCK_DATA` → consultas agregadas no Supabase: visitas (se houver tracking), serviços mais orçados (`quotes` por `service_id`), favoritos (`favorites` por período), origem (se guardarmos cidade do usuário em `profiles`).
- `NotificationsPage.tsx:10` `MOCK_NOTIFICATIONS` → fetch em `notifications` filtrado por `user_id` e `is_new`.
- `CompanyPage.tsx`: dados de `companies`, `services`, `portfolio_images`, `reviews`; ações “Favoritar” gravam em `favorites`; “Solicitar Orçamento” abre `QuoteModal` que insere em `quotes`.
- `QuoteModal.tsx:14` → substituir `alert` por `insert` em `quotes` + upload opcional para `quote-attachments`.
- `HomePage.tsx:41` `CATEGORIES` → tabela `categories` e hook de busca; “Mais Empresas” → consulta paginada `companies`.
- `ChatPage.tsx` → `messages` realtime; `onSendMessage` insere mensagem com `sender` e dispara notificação.
- `ClientQuotesPage.tsx` / `CompanyQuotesPage.tsx` → listas de `quotes` por perfil, com filtros por `status`.
- `RegisterPage.tsx` / `LoginPage.tsx` / `ForgotPasswordPage.tsx` → conectar Supabase Auth; criar `profiles` pós-signup com `role`.
- `SubscriptionPage.tsx` → ler `subscriptions` do Supabase e histórico (`billing_history`).

## Funcões Server (Webhook + Utilitários)
- `api/abacatepay-webhook` (Vercel): recebe eventos, valida assinatura, atualiza Supabase.
- Opcional: `supabase edge function` para tarefas internas (ex: notificação push por mensagem nova), se preferirmos rodar no Supabase ao invés de Vercel.

## Mobile (Android Play Store)
- Adicionar Capacitor ao projeto Vite.
- Configurar `android/` (package id, permissões, deep links).
- Splash, ícone, assinatura (keystore), build `release`.
- Publicar na Play Console (telas, políticas, privacidade).

## Deploy & Configuração
- Vercel: importar repositório, `build` Vite, variáveis:
  - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
  - `ABACATEPAY_API_KEY`, `ABACATEPAY_WEBHOOK_SECRET`.
  - `SUPABASE_SERVICE_ROLE_KEY` (apenas em serverless, nunca no cliente).
- Supabase: criar tabelas e RLS; buckets de storage; chaves; policies.
- Domínio e HTTPS; CORS liberando domínio do app.

## Entregáveis
- Projeto Vite estruturado com todas telas conectadas ao Supabase.
- Tipos TypeScript gerados via Supabase.
- Módulos de dados (auth, companies, services, quotes, chat, notifications, subscriptions).
- Webhook funcional da AbacatePay em Vercel.
- Capacitor Android pronto para publicação (APK/AAB assinado).
- Remoção total de `MOCK_*` e dados estáticos substituídos por consultas reais.

## Próximos Passos (Execução)
1. Criar scaffold Vite + React + Tailwind e migrar `components/` e `views/` para `src/` com router.
2. Adicionar `@supabase/supabase-js` e `lib/supabase.ts`; configurar `.env` com URL e ANON KEY.
3. Aplicar schema SQL no Supabase com RLS.
4. Gerar tipos TS com Supabase CLI e conectar hooks por tela; substituir mocks progressivamente.
5. Implementar upload para Storage e Realtime no Chat.
6. Integrar AbacatePay (SDK/API) e webhook em Vercel; conectar `SubscriptionPage`.
7. Configurar Capacitor Android, ícones, splash, keystore; build e checklist Play Store.
8. Deploy no Vercel com variáveis e testes ponta-a-ponta.

## Variáveis de Ambiente Necessárias
- Cliente: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- Server (Vercel): `SUPABASE_SERVICE_ROLE_KEY`, `ABACATEPAY_API_KEY`, `ABACATEPAY_WEBHOOK_SECRET`.

Confirme se seguimos com esta implementação e se deseja que eu inicialize o projeto Vite e a estrutura agora.