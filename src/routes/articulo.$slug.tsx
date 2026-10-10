import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Layout, ArticleCard } from "@/components/Layout";
import { ApiError, getArticle, listArticles } from "@/lib/api";
import { articleImage, formatDate, toArticle, toArticleDetail } from "@/lib/articles";

const articleQuery = (slug: string) =>
  queryOptions({
    queryKey: ["article", slug],
    queryFn: async () => {
      try {
        return toArticleDetail(await getArticle(slug));
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) throw notFound();
        // API no disponible: la página muestra un aviso en lugar de romperse.
        return null;
      }
    },
  });

const relatedQuery = queryOptions({
  queryKey: ["articles", "latest"],
  queryFn: async () => {
    try {
      return (await listArticles({ limit: 10 })).articles.map(toArticle);
    } catch {
      return [];
    }
  },
});

export const Route = createFileRoute("/articulo/$slug")({
  loader: async ({ params, context }) => {
    const article = await context.queryClient.ensureQueryData(articleQuery(params.slug));
    await context.queryClient.ensureQueryData(relatedQuery);
    return { article };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.article?.title ?? "Artículo"} — Código Femenino` },
      { name: "description", content: loaderData?.article?.excerpt ?? "Revista digital Código Femenino" },
      { property: "og:title", content: loaderData?.article?.title ?? "Código Femenino" },
      { property: "og:description", content: loaderData?.article?.excerpt ?? "Revista digital Código Femenino" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ArticlePage,
});

function ArticlePage() {
  const { article: a } = Route.useLoaderData();
  const { data: latest } = useSuspenseQuery(relatedQuery);

  if (!a) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="font-display text-4xl text-foreground">No pudimos cargar este artículo</h1>
          <p className="mt-3 text-muted-foreground">Nuestro servidor no responde en este momento. Intenta de nuevo en unos minutos.</p>
          <Link to="/" className="mt-6 inline-block rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Volver al inicio</Link>
        </div>
      </Layout>
    );
  }

  const related = latest.filter((x) => x.slug !== a.slug).slice(0, 3);
  return (
    <Layout>
      <article className="mx-auto max-w-2xl px-4 py-12">
        <Link to="/categoria/$slug" params={{ slug: a.category }} className="text-[11px] uppercase tracking-[0.2em] text-primary">{a.categoryName}</Link>
        <h1 className="font-display mt-2 text-4xl md:text-5xl leading-tight text-foreground">{a.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{a.excerpt}</p>
        <p className="mt-4 text-xs text-muted-foreground">Por {a.author} · {formatDate(a.date)} · {a.readTime} min de lectura</p>
        <img
          src={articleImage(a)}
          alt={a.title}
          width={1200}
          height={800}
          className="my-8 aspect-[16/9] w-full rounded-sm object-cover"
        />
        <div className="space-y-5 text-[17px] leading-relaxed text-foreground">
          {a.body.map((b, i) => (
            <div key={i}>
              {b.h && <h2 className="font-display mb-2 text-2xl">{b.h}</h2>}
              <p>{b.p}</p>
              {i === 1 && <AdSlot />}
            </div>
          ))}
        </div>
        <aside className="mt-10 rounded-sm border border-border p-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-primary">Recomendado</p>
          <p className="font-display mt-1 text-2xl text-foreground">Nuestros favoritos para ti</p>
          <p className="mt-2 text-sm text-muted-foreground">Pronto verás aquí productos que probamos y recomendamos.</p>
          <p className="mt-3 text-[11px] text-muted-foreground">Aviso: algunos enlaces serán de afiliación; podemos recibir una comisión sin coste extra para ti.</p>
        </aside>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link to="/guia-gratuita" className="rounded-sm bg-secondary p-5 hover:opacity-90">
            <p className="text-[11px] uppercase tracking-[0.2em] text-primary">Gratis</p>
            <p className="font-display text-xl text-foreground">Descarga «Empezá por vos»</p>
          </Link>
          <Link to="/ebook" className="rounded-sm bg-secondary p-5 hover:opacity-90">
            <p className="text-[11px] uppercase tracking-[0.2em] text-primary">Ebook · 12,90 €</p>
            <p className="font-display text-xl text-foreground">Código Femenino: guía práctica</p>
          </Link>
        </div>
        <AdSlot />
      </article>
      {related.length > 0 && (
        <div className="mx-auto max-w-6xl px-4 pb-16">
          <h2 className="mb-6 border-b border-border pb-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">Sigue leyendo</h2>
          <div className="grid gap-10 sm:grid-cols-3">{related.map((r) => <ArticleCard key={r.slug} a={r} />)}</div>
        </div>
      )}
    </Layout>
  );
}

function AdSlot() {
  return (
    <div className="my-8 flex h-24 items-center justify-center rounded-sm border border-dashed border-border text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
      Espacio publicitario · próximamente
    </div>
  );
}
