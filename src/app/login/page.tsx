'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SurfaceCard from '@/components/common/SurfaceCard';

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <SurfaceCard className="p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-app-muted">
          Login seguro
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-app-fg">
          Entre para validar as rotas protegidas
        </h1>
        <p className="mt-4 max-w-xl text-base leading-8 text-app-muted">
          O envio passa pelo servidor, cria a sessão opaca com cookies httpOnly e direciona a experiência conforme a role retornada pela autenticação.
        </p>

        <form action="/auth-redirect" method="POST" className="mt-8 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.28em] text-app-muted">
              Username
            </label>
            <input
              type="text"
              name="username"
              className="w-full rounded-[1.4rem] border border-edge-soft/70 bg-surface-soft px-5 py-4 text-app-fg shadow-neo-inset outline-none placeholder:text-app-muted/70 focus:border-tivit-red/30 focus:ring-2 focus:ring-tivit-red/20"
              placeholder="Informe o usuário de teste"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.28em] text-app-muted">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full rounded-[1.4rem] border border-edge-soft/70 bg-surface-soft px-5 py-4 text-app-fg shadow-neo-inset outline-none placeholder:text-app-muted/70 focus:border-tivit-red/30 focus:ring-2 focus:ring-tivit-red/20"
              placeholder="Digite a senha correspondente"
              required
            />
          </div>

          {error && (
            <div className="rounded-[1.4rem] bg-accent-soft px-4 py-3 text-sm font-medium text-tivit-red shadow-neo-inset">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="tivit-button-motion inline-flex h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-tivit-red to-tivit-red-deep px-6 font-semibold text-white shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tivit-red/40"
          >
            Entrar com sessão server-side
          </button>
        </form>
      </SurfaceCard>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
        <SurfaceCard className="p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-app-muted">
            O que acontece depois
          </p>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-app-muted">
            <li>• O servidor realiza a autenticação na API externa de login;</li>
            <li>• Cria uma sessão opaca com SID e SID-role em caso de sucesso;</li>
            <li>• Redireciona para /user ou /admin conforme a role;</li>
            <li>• O estado global é hidratado sem expor token no browser.</li>
          </ul>
        </SurfaceCard>

        <SurfaceCard className="p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-app-muted">
            Tema e experiência
          </p>
          <p className="mt-4 text-sm leading-7 text-app-muted">
            O design segue a linha visual do restante do projeto, com foco em usabilidade, feedback visual e consistência de marca, usando os tokens globais de tema para cores, espaçamento e tipografia.
          </p>
        </SurfaceCard>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex w-full max-w-3xl">
          <SurfaceCard className="w-full p-10 text-center text-app-muted">
            Carregando experiência de login...
          </SurfaceCard>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}