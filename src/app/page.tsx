import Link from 'next/link';
import SurfaceCard from '@/components/common/SurfaceCard';
import { getServerSession } from '@/lib/utils';

export default async function Home() {
  const session = await getServerSession();

  const architectureCards = [
    {
      title: 'API Routes como BFF',
      description:
        'As rotas em /api centralizam a comunicação com a API externa e protegem o frontend de expor quaisquer dados sensíveis.',
    },
    {
      title: 'Sessão opaca server-side',
      description:
        'A sessão é gerenciada exclusivamente no servidor, usando cookies HttpOnly para armazenar apenas um identificador de sessão (SID) e o papel do usuário, sem expor tokens JWT ou dados sensíveis ao cliente.',
    },
    {
      title: 'Authorization fora do browser',
      description:
        'O header Authorization é montado em src/lib/api/client.ts com base na sessão server-side, sem expor token ao frontend.',
    },
    {
      title: 'Proteção por proxy',
      description:
        'O proxy valida SID e SID-role antes de liberar /user e /admin, aplicando redirects por role.',
    },
    {
      title: 'Hidratação global do estado',
      description:
        'O GlobalSessionHydrator hidrata o estado de autenticação e perfil do usuário no Redux, garantindo que a UI reaja a mudanças de sessão sem expor detalhes sensíveis.',
    },
    {
      title: 'Slices separados por domínio',
      description:
        'User e Admin têm slices independentes, permitindo controle de loading, erro e dados específicos de cada role.',
    },
  ];

  const roleMessage =
    session?.role === 'admin'
      ? 'Você já está autenticado como admin. O painel protegido está pronto para validar guards, sessão e listagem de reports.'
      : session?.role === 'user'
        ? 'Você já está autenticado como user. A área protegida já pode ser inspecionada com dados de perfil e lista de compras.'
        : 'Não autenticado. Use o botão abaixo para acessar a tela de login e testar as áreas protegidas por role, redirecionamento e hidratação de sessão.';

  return (
    <div className="flex w-full flex-col gap-[var(--space-section)]">
      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
        <SurfaceCard className="relative overflow-hidden px-6 py-8 sm:px-10 sm:py-10">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-tivit-red/10 blur-3xl" />
          <div className="relative space-y-6 animate-[fade-up_0.55s_ease-out]">
            <span className="inline-flex items-center rounded-full bg-accent-soft px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-tivit-red shadow-neo-inset">
              Avaliação técnica · Next.js (React)
            </span>

            <div className="space-y-4">
              <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight text-app-fg sm:text-5xl xl:text-6xl">
                Bem-vindo avaliador
              </h1>
              <p className="max-w-2xl text-base leading-8 text-app-muted sm:text-lg">
                Esta landing resume a arquitetura real do projeto, orienta o fluxo de login e destaca as decisões de segurança e integração já implementadas.
              </p>
            </div>

            <SurfaceCard className="bg-surface-soft/90 p-5 shadow-neo-inset hover:translate-y-0 hover:shadow-neo-inset">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-app-muted">
                Estado atual da sessão
              </p>
              <p className="mt-3 text-lg leading-8 text-app-fg">{roleMessage}</p>
            </SurfaceCard>

            <div className="flex flex-wrap gap-4">
              <Link
                href={session?.role === 'admin' ? '/admin' : session?.role === 'user' ? '/user' : '/login'}
                className="tivit-button-motion inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-tivit-red to-tivit-red-deep px-7 font-semibold text-white shadow-glow"
              >
                {session?.role ? 'Abrir área protegida' : 'Ir para login'}
              </Link>
            </div>
          </div>
        </SurfaceCard>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
          <SurfaceCard className="animate-[fade-up_0.65s_ease-out] p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-app-muted">Next.js</p>
            <h2 className="mt-4 font-display text-2xl font-semibold text-app-fg">Framework de React</h2>
            <p className="mt-4 text-sm leading-7 text-app-muted">
              O projeto é construído com Next.js, usando App Router, Server Components e API Routes para uma arquitetura fullstack moderna.
            </p>
          </SurfaceCard>
          <SurfaceCard className="animate-[fade-up_0.75s_ease-out] p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-app-muted">Linha visual</p>
            <h2 className="mt-4 font-display text-2xl font-semibold text-app-fg">Neumorphism com profundidade suave</h2>
            <p className="mt-4 text-sm leading-7 text-app-muted">
              O design usa superfícies arredondadas, sombras difusas, microinterações e tema dark grafite com tokens globais via Context API.
            </p>
          </SurfaceCard>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-app-muted">
            Arquitetura
          </p>
          <h2 className="font-display text-3xl font-semibold text-app-fg sm:text-4xl">
            Decisões arquiteturais do projeto
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {architectureCards.map((card, index) => (
            <SurfaceCard
              key={card.title}
              className="min-h-[220px] p-6 animate-[fade-up_0.7s_ease-out_both]"
            >
              <div
                className="flex h-full flex-col"
                style={{ animation: 'float 7s ease-in-out infinite', animationDelay: `${index * 180}ms` }}
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-soft to-surface-elevated text-lg font-bold text-tivit-red shadow-neo-inset">
                  0{index + 1}
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold text-app-fg">
                  {card.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-app-muted">
                  {card.description}
                </p>
              </div>
            </SurfaceCard>
          ))}
        </div>
      </section>
    </div>
  );
}
