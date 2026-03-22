'use client';

import { useSelector } from 'react-redux';
import SurfaceCard from '@/components/common/SurfaceCard';
import StatusPanel from '@/components/common/StatusPanel';
import { RootState } from '@/lib/store';

export default function UserPage() {
  const { data, loading, error } = useSelector((state: RootState) => state.user);

  if (loading) {
    return (
      <div className="flex w-full flex-col gap-6">
        <StatusPanel
          variant="loading"
          title="Carregando área do usuário"
          description="Estamos buscando os dados protegidos e montando a experiência personalizada desta sessão."
        />
      </div>
    );
  }

  if (error) {
    return (
      <StatusPanel
        variant="error"
        title="Não foi possível carregar os dados do usuário"
        description={error}
      />
    );
  }

  if (!data) {
    return (
      <StatusPanel
        variant="empty"
        title="Nenhum dado disponível no store"
        description="Entre novamente ou aguarde a hidratação da sessão para popular o dashboard do usuário."
      />
    );
  }

  const totalSpent = data.data.purchases.reduce(
    (total, purchase) => total + purchase.price,
    0
  );
  const hasPurchases = data.data.purchases.length > 0;

  return (
    <div className="flex w-full flex-col gap-[var(--space-section)] animate-[fade-up_0.45s_ease-out]">
      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <SurfaceCard className="p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-app-muted">
            Dashboard do usuário
          </p>
          <h1 className="mt-4 font-display text-3xl font-semibold text-app-fg sm:text-4xl">
            Bem-vindo, {data.data.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-app-muted">
            {data.message}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] bg-surface-soft p-4 shadow-neo-inset">
              <p className="text-xs uppercase tracking-[0.28em] text-app-muted">Compras</p>
              <p className="mt-3 font-display text-3xl font-semibold text-app-fg">
                {data.data.purchases.length}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-surface-soft p-4 shadow-neo-inset">
              <p className="text-xs uppercase tracking-[0.28em] text-app-muted">Total investido</p>
              <p className="mt-3 font-display text-3xl font-semibold text-app-fg">
                US$ {totalSpent.toFixed(2)}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-surface-soft p-4 shadow-neo-inset">
              <p className="text-xs uppercase tracking-[0.28em] text-app-muted">Contato</p>
              <p className="mt-3 text-sm font-medium text-app-fg break-all">
                {data.data.email}
              </p>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-app-muted">
            Perfil & contexto
          </p>
          <div className="mt-6 space-y-4 text-sm leading-7 text-app-muted">
            <div className="rounded-[1.4rem] bg-surface-soft p-4 shadow-neo-inset">
              <p className="text-xs uppercase tracking-[0.28em]">Nome</p>
              <p className="mt-2 text-lg font-semibold text-app-fg">{data.data.name}</p>
            </div>
            <div className="rounded-[1.4rem] bg-surface-soft p-4 shadow-neo-inset">
              <p className="text-xs uppercase tracking-[0.28em]">Email</p>
              <p className="mt-2 text-base font-medium text-app-fg break-all">{data.data.email}</p>
            </div>
          </div>
        </SurfaceCard>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-app-muted">
              Lista de compras
            </p>
            <h2 className="font-display text-3xl font-semibold text-app-fg">
              Itens disponíveis no slice de user
            </h2>
          </div>
        </div>

        {!hasPurchases ? (
          <StatusPanel
            variant="empty"
            title="Nenhuma compra disponível"
            description="A sessão foi carregada, mas o payload atual do usuário não possui itens para exibir."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {data.data.purchases.map((purchase, index) => (
              <SurfaceCard
                key={purchase.id}
                className="p-5 animate-[fade-up_0.45s_ease-out_both]"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-app-muted">
                      Compra #{purchase.id}
                    </p>
                    <h3 className="mt-3 font-display text-2xl font-semibold text-app-fg">
                      {purchase.item}
                    </h3>
                  </div>
                  <span className="rounded-full bg-accent-soft px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-tivit-red shadow-neo-inset">
                    Confirmada
                  </span>
                </div>
                <div className="mt-6 rounded-[1.4rem] bg-surface-soft p-4 shadow-neo-inset">
                  <p className="text-xs uppercase tracking-[0.28em] text-app-muted">Valor</p>
                  <p className="mt-2 text-2xl font-semibold text-app-fg">
                    US$ {purchase.price.toFixed(2)}
                  </p>
                </div>
              </SurfaceCard>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}