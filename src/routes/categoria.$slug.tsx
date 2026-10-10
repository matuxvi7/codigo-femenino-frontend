import { createFileRoute, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Layout, ArticleCard } from "@/components/Layout";
import { ApiError, getCategory, listArticles } from "@/lib/api";
import { toArticle, toCategory } from "@/lib/articles";

const categoryQuery = (slug: string) =>
  queryOptions({
    queryKey: ["category", slug],
    queryFn: async () => {
      try {
        return toCategory(await getCategory(slug));
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) throw notFound();
        // API no disponible: mostramos la categoría con datos mínimos.
        return { slug, name: slug, description: "" };
      }
    },
  });

const categoryArticlesQuery = (slug: string) =>
  queryOptions({
    queryKey: ["articles", "category", slug],
    queryFn: async () => {
      try {
        return (await listArticles({ category: slug, limit: 50 })).articles.map(toArticle);
      } catch {
        return [];
      }
    },
  });

export const Route = createFileRoute("/categoria/$slug")({
  loader: async ({ params, context }) => {
    const category = await context.queryClient.ensureQueryData(categoryQuery(params.slug));
    await context.queryClient.ensureQueryData(categoryArticlesQuery(params.slug));
    return { category };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.category.name} — Código Femenino` },
      { name: "description", content: loaderData?.category.description },
      { property: "og:title", content: `${loaderData?.category.name} — Código Femenino` },
      { property: "og:description", content: loaderData?.category.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const { data: list } = useSuspenseQuery(categoryArticlesQuery(category.slug));
  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-display text-5xl text-foreground">{category.name}</h1>
        <p className="mt-2 text-muted-foreground">{category.description}</p>
        {list.length === 0 ? (
          <p className="mt-10 text-muted-foreground">Todavía no hay artículos publicados en esta categoría.</p>
        ) : (
          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((a) => <ArticleCard key={a.slug} a={a} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
