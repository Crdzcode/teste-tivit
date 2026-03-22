# Teste Técnico TIVIT

Aplicação web em **Next.js (React Framework)** com autenticação server-side, controle de acesso por role (`user` / `admin`), camada BFF via rotas internas (`/api/*`) e hidratação global de estado com Redux.

O projeto foi estruturado para demonstrar:

- segurança de sessão sem expor token no browser;
- separação de responsabilidades entre UI, BFF e integração externa;
- proteção de rotas por role no proxy;
- experiência visual premium com tema claro/escuro e design system próprio.

---

## Stack técnica

- **Next.js 16.2.1** (React Framework)
- **React 19**
- **TypeScript 5**
- **Redux Toolkit + React Redux**
- **Tailwind CSS v4**

---

## Pré-requisitos

Antes de rodar o projeto, garanta que você tenha instalado:

- **Node.js** (recomendado: versão 20+)
- **npm** (já vem com Node)

Opcional (mas recomendado):

- **Git** para versionamento e push para repositório remoto

---

## Instalação

No diretório raiz do projeto, execute:

```bash
npm install
```

Isso instala todas as dependências listadas em `package.json`.

---

## Configuração de ambiente (`.env`)

Crie um arquivo chamado **`.env`** na raiz do projeto.

Conteúdo sugerido:

```env
TIVIT_BASE_URL=https://api-onecloud.multicloud.tivit.com
```

### Observações

- Se `TIVIT_BASE_URL` não for informado, a aplicação usa esse mesmo valor como fallback no código.
- Essa variável define a base da API externa consumida pela camada BFF (`src/lib/api/client.ts`).

---

## Como rodar em desenvolvimento

```bash
npm run dev
```

Depois, acesse no navegador:

http://localhost:3000

---

## Scripts disponíveis

- `npm run dev` → inicia ambiente de desenvolvimento
- `npm run build` → gera build de produção
- `npm run start` → executa a build de produção
- `npm run lint` → roda análise estática (ESLint)

---

## Fluxo de autenticação (visão geral)

### 1) Login

O formulário de login envia `username` e `password` para `POST /auth-redirect`.

Essa rota:

1. chama `loginUser()` (`src/lib/api/auth.ts`), que consulta `POST /fake/token`;
2. recebe `access_token`;
3. extrai a role (`user`/`admin`) e o `exp` a partir do payload do JWT;
4. converte o `exp` para `expiresAt` em milissegundos;
5. cria sessão server-side (`createSession()`) usando esse tempo de expiração;
5. redireciona para `/user` ou `/admin`.

### 2) Sessão

A sessão é composta por:

- cookie `sid` (httpOnly)
- cookie `sid-role` (httpOnly)
- registro em memória (`Map`) no servidor com:
	- `sid`
	- `token`
	- `role`
	- `expiresAt`

Implementação: `src/lib/session-store.ts`.

O TTL atual da sessão e dos cookies é derivado do campo `exp` do JWT.

Se o token não vier com `exp`, o código usa um fallback de 24h para evitar quebra do fluxo.

### 3) Autorização nas rotas protegidas

O arquivo `src/proxy.ts` aplica guardas de acesso:

- sem sessão → redireciona para `/login`;
- `user` tentando acessar `/admin` → redireciona para `/user`;
- `admin` tentando acessar `/user` → redireciona para `/admin`;
- usuário autenticado em `/login` → redireciona para a área correta.

### 4) Logout

`POST /api/auth/logout` chama `clearSession()` e:

- remove a sessão do store em memória;
- remove os cookies `sid` e `sid-role`.

---

## Por que usar SID e `session-store` no servidor

### O que é o SID

`SID` (Session ID) é um identificador opaco e único da sessão.

Neste projeto, o browser **não armazena o token JWT real**. Ele armazena apenas:

- `sid` (id da sessão)
- `sid-role` (role da sessão)

Com isso, o frontend nunca recebe o token de autenticação em `localStorage`, `sessionStorage` ou estado global. O token fica somente no servidor.

### O que é o `session-store`

O arquivo `src/lib/session-store.ts` implementa um repositório de sessões no servidor usando um `Map<string, ServerSession>`.

Cada entrada do `Map` contém:

- `sid`
- `token`
- `role`
- `expiresAt` (TTL)

Quando uma rota interna precisa chamar a API externa, ela resolve o `sid` do cookie, busca a sessão no `Map` e recupera o token server-side para montar o header `Authorization`.

### Por que multiplicar `exp` por `1000`

No padrão JWT, o campo `exp` é representado em **segundos desde 1 de janeiro de 1970 (Unix timestamp)**.

Já no JavaScript, APIs como `Date.now()` e valores de tempo usados internamente na aplicação trabalham em **milissegundos**.

Por isso, quando o payload vem assim:

```text
{ sub: 'user', exp: 1774151970 }
```

o código converte para milissegundos fazendo:

```ts
expiresAt = decodedPayload.exp * 1000;
```

Sem essa multiplicação, o valor seria interpretado como se já estivesse em milissegundos, fazendo a sessão expirar muito antes do correto.

Resumo:

- `exp` no JWT → segundos
- `Date.now()` no JavaScript → milissegundos
- conversão necessária → `exp * 1000`

### Por que esse modelo é útil

- reduz exposição de credenciais no browser;
- facilita revogação de sessão (basta remover do store);
- simplifica controles de segurança;
- mantém o frontend desacoplado do formato/token real de autenticação.

### Por que usar Redis (ou storage compartilhado) em produção

O `Map` em memória funciona bem para desenvolvimento e execução em instância única, mas tem limitações em produção:

1. **não é compartilhado entre instâncias**
2. **perde dados ao reiniciar processo/deploy**
3. **não suporta distribuição** de forma robusta

Em produção, recomenda-se usar Redis (ou equivalente) para que:

- todas as instâncias da aplicação leiam a mesma sessão;
- a sessão sobreviva a restart de processo;
- seja possível escalar sem quebrar autenticação.

Resumo prático:

- **Dev/PoC**: `Map` em memória é simples e suficiente.
- **Produção**: storage compartilhado (ex.: Redis) é o caminho correto.

---

## Como os dados são processados

## Camada BFF (`/api/*`)

As páginas não chamam diretamente a API externa para dados sensíveis. O fluxo passa por rotas internas:

- `GET /api/user`
- `GET /api/admin`
- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`

Essas rotas validam sessão/role e fazem orquestração de dados no servidor.

### Cliente HTTP interno

`apiRequest()` (`src/lib/api/client.ts`):

1. lê sessão server-side via cookie (`getTokenFromCookie()`);
2. injeta `Authorization: Bearer <token>` no request;
3. envia requisição para `${TIVIT_BASE_URL}${endpoint}`.

Resultado: o token **não é exposto** para o frontend.

---

## Estado global e hidratação

O app usa dois slices separados:

- `userSlice`
- `adminSlice`

O componente `GlobalSessionHydrator` (`src/components/auth/GlobalSessionHydrator.tsx`) faz:

1. consulta `GET /api/auth/session`;
2. detecta role ativa;
3. dispara `fetchUserData()` ou `fetchAdminData()`;
4. limpa slice da role oposta para evitar mistura de contexto;
5. em sessão inválida, força logout e redirecionamento quando necessário.

Isso mantém o estado consistente entre cookies, sessão server-side e UI.

---

## Estrutura de diretórios (resumo)

```text
src/
	app/
		api/                 # BFF e endpoints internos
		auth-redirect/       # rota server-side de login com redirect por role
		admin/               # página protegida de admin
		user/                # página protegida de user
		login/               # página de login
	components/
		auth/                # hidratação global de sessão
		common/              # componentes reutilizáveis de UI
		layout/              # header
		theme/               # ThemeProvider e toggle
	lib/
		api/                 # integrações com API externa
		constants/           # base URL, endpoints e nomes de cookie
		session-store.ts     # store de sessão em memória (Map)
		store/               # configuração Redux e slices
		utils/               # helpers de sessão/cookies
	proxy.ts               # controle de acesso por rota/role
```

---

## Arquitetura (decisões principais)

1. **BFF com rotas internas (`/api`)**
	 - Centraliza integração externa, regras de autorização e tratamento de erro.

2. **Sessão opaca server-side**
	 - O browser só recebe identificadores (`sid`, `sid-role`) em cookies httpOnly.
	 - Token real fica em memória no servidor.

3. **Role guard no proxy**
	 - Bloqueia acesso indevido antes da renderização da página protegida.

4. **Hidratação global com Redux**
	 - Reconstrói o estado da UI a partir da sessão ativa de forma previsível.

5. **Separação por domínio (`user` e `admin`)**
	 - Estados independentes para reduzir acoplamento e simplificar manutenção.

---

## Segurança e limitações atuais

### Pontos positivos

- cookies `httpOnly`, `sameSite: 'strict'`;
- token não exposto ao frontend;
- validação de role em múltiplas camadas (proxy + rotas BFF).

### Limitação importante

O `session-store` atual é **em memória** (processo Node). Em produção com múltiplas instâncias, recomenda-se trocar por Redis ou outro storage compartilhado.

---

## Build de produção

```bash
npm run build
npm run start
```

---

## Troubleshooting rápido

### `npm run dev` falhou

1. rode `npm install` novamente;
2. valide se o `.env` existe e está correto;
3. execute `npm run build` para identificar erros de tipagem/compilação;
4. verifique versão do Node.

### Erro de autenticação

- confirme se `TIVIT_BASE_URL` aponta para a API correta;
- valide se o endpoint `/fake/token` está disponível;
- revise credenciais de teste.

---
