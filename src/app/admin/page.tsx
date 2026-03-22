'use client';

import { useSelector } from 'react-redux';
import SurfaceCard from '@/components/common/SurfaceCard';
import StatusPanel from '@/components/common/StatusPanel';
import { RootState } from '@/lib/store';

export default function AdminPage() {
  const { data, loading, error } = useSelector((state: RootState) => state.admin);

  if (loading) {
    return (
      <StatusPanel
        variant="loading"
        title="Preparando o painel administrativo"
        description="Os reports protegidos estão sendo buscados para compor a visão de gestão desta sessão."
      />
    );
  }

  if (error) {
    return (
      <StatusPanel
        variant="error"
        title="Falha ao carregar os dados do admin"
        description={error}
      />
    );
  }

  if (!data) {
    return (
      <StatusPanel
        variant="empty"
        title="Nenhum dado administrativo no store"
        description="A área admin depende da hidratação da sessão e do fetch protegido dos reports."
      />
    );
  }

  const reports = data.data.reports;
  const reportGroups = reports.reduce<Record<string, number>>((groups, report) => {
    groups[report.status] = (groups[report.status] ?? 0) + 1;
    return groups;
  }, {});
  const statusEntries = Object.entries(reportGroups);

  return (
    <div className="flex w-full flex-col gap-[var(--space-section)] animate-[fade-up_0.45s_ease-out]">
      <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <SurfaceCard className="p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-app-muted">
            Painel administrativo
          </p>
          <h1 className="mt-4 font-display text-3xl font-semibold text-app-fg sm:text-4xl">
            Governança e reports de {data.data.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-app-muted">
            {data.message}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] bg-surface-soft p-4 shadow-neo-inset">
              <p className="text-xs uppercase tracking-[0.28em] text-app-muted">Reports</p>
              <p className="mt-3 font-display text-3xl font-semibold text-app-fg">
                {reports.length}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-surface-soft p-4 shadow-neo-inset">
              <p className="text-xs uppercase tracking-[0.28em] text-app-muted">Status distintos</p>
              <p className="mt-3 font-display text-3xl font-semibold text-app-fg">
                {statusEntries.length}
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
            Distribuição de status
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {statusEntries.map(([status, amount]) => (
              <div
                key={status}
                className="rounded-full bg-surface-soft px-4 py-3 text-sm font-medium text-app-fg shadow-neo hover:-translate-y-0.5 hover:shadow-neo-hover"
              >
                <span className="text-app-muted">{status}</span>
                <span className="ml-3 rounded-full bg-accent-soft px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-tivit-red shadow-neo-inset">
                  {amount}
                </span>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-app-muted">
            Reports carregados do slice admin
          </p>
          <h2 className="font-display text-3xl font-semibold text-app-fg">
            Lista interativa de relatórios
          </h2>
        </div>

        {reports.length === 0 ? (
          <StatusPanel
            variant="empty"
            title="Nenhum report disponível"
            description="A sessão foi validada, mas o payload atual do admin não retornou relatórios para exibição."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {reports.map((report, index) => (
              <SurfaceCard
                key={report.id}
                className="p-5 animate-[fade-up_0.45s_ease-out_both]"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-app-muted">
                      Report #{report.id}
                    </p>
                    <h3 className="mt-3 font-display text-2xl font-semibold text-app-fg">
                      {report.title}
                    </h3>
                  </div>
                  <span className="rounded-full bg-accent-soft px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-tivit-red shadow-neo-inset">
                    {report.status}
                  </span>
                </div>
                <div className="mt-6 rounded-[1.4rem] bg-surface-soft p-4 shadow-neo-inset">
                  <p className="text-xs uppercase tracking-[0.28em] text-app-muted">Status atual</p>
                  <p className="mt-2 text-lg font-semibold text-app-fg">{report.status}</p>
                </div>
              </SurfaceCard>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}