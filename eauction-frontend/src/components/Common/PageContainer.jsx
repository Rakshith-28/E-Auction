const PageContainer = ({ title, subtitle, children, actions }) => (
  <section className="mx-auto w-full max-w-6xl px-4 py-8">
    {(title || subtitle || actions) && (
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          {title && <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>}
          {subtitle && <p className="mt-2 max-w-2xl text-sm text-slate-600">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </header>
    )}
    <div className="space-y-6">{children}</div>
  </section>
);

export default PageContainer;
