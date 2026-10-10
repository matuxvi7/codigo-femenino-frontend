import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Layout, ArticleCard } from "@/components/Layout";
import { listArticles } from "@/lib/api";
import { toArticle } from "@/lib/articles";

const latestArticlesQuery = queryOptions({
  queryKey: ["articles", "latest"],
  queryFn: async () => {
    try {
      return (await listArticles({ limit: 10 })).articles.map(toArticle);
    } catch {
      // Si la API no está disponible, mostramos el estado vacío en lugar de romper la página.
      return [];
    }
  },
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(latestArticlesQuery),
  head: () => ({
    meta: [
      { title: "Código Femenino — Revista de relaciones, autoestima y belleza" },
      { name: "description", content: "Revista digital para mujeres: relaciones, autoestima, psicología cotidiana y belleza." },
      { property: "og:title", content: "Código Femenino — Revista digital" },
      { property: "og:description", content: "Relaciones, autoestima, psicología y belleza para mujeres hispanohablantes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: articles } = useSuspenseQuery(latestArticlesQuery);

  if (articles.length === 0) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="font-display text-4xl text-foreground">Aún no hay artículos publicados</h1>
          <p className="mt-3 text-muted-foreground">Vuelve pronto: estamos preparando contenido nuevo para ti.</p>
        </div>
      </Layout>
    );
  }

  const first = articles[0]!;
  const rest = articles.slice(1);
  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <ArticleCard a={first} large />
        <h2 className="mt-16 mb-6 border-b border-border pb-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">Lo último</h2>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((a) => <ArticleCard key={a.slug} a={a} />)}
        </div>
      </div>
    </Layout>
  );
}
