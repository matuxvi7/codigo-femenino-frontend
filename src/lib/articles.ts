import imgRelaciones from "@/assets/cat-relaciones.jpg";
import imgAutoestima from "@/assets/cat-autoestima.jpg";
import imgPsicologia from "@/assets/cat-psicologia.jpg";
import imgBelleza from "@/assets/cat-belleza.jpg";
import type { ApiArticleDetail, ApiArticleSummary, ApiCategory } from "@/lib/api";

// Imágenes locales por categoría (la API no devuelve imágenes).
// Si el slug no coincide, se usa una imagen por defecto.
export const categoryImages: Record<string, string> = {
  relaciones: imgRelaciones,
  autoestima: imgAutoestima,
  psicologia: imgPsicologia,
  belleza: imgBelleza,
};

export function categoryImage(slug: string): string {
  return categoryImages[slug] ?? imgAutoestima;
}

// Imagen del artículo: la subida a Cloudinary si existe, si no la de su categoría.
export function articleImage(a: { imageUrl: string | null; category: string }): string {
  return a.imageUrl ?? categoryImage(a.category);
}

export type Category = { slug: string; name: string; description: string };

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryName: string;
  author: string;
  date: string;
  readTime: number;
  imageUrl: string | null;
  body: { h: string | undefined; p: string }[];
};

export function toCategory(c: ApiCategory): Category {
  return { slug: c.slug, name: c.name, description: c.description ?? "" };
}

export function toArticle(a: ApiArticleSummary): Article {
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category_slug,
    categoryName: a.category_name,
    author: a.author,
    date: a.published_at ?? a.created_at,
    readTime: a.read_time_minutes,
    imageUrl: a.image_url ?? null,
    body: [],
  };
}

export function toArticleDetail(a: ApiArticleDetail): Article {
  return {
    ...toArticle(a),
    body: (a.sections ?? [])
      .sort((x, y) => (x.position ?? 0) - (y.position ?? 0))
      .map((s) => ({ h: s.heading ?? undefined, p: s.content })),
  };
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
