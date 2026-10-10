import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { listCategories, subscribeNewsletter } from "@/lib/api";
import { articleImage, formatDate, toCategory, type Article } from "@/lib/articles";

export function Layout({ children }: { children: ReactNode }) {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await listCategories()).map(toCategory),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center">
          <Link to="/" className="font-display text-4xl md:text-5xl tracking-tight text-foreground">
            Código <em className="text-primary">Femenino</em>
          </Link>
          <nav className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {categories.map((c) => (
              <Link key={c.slug} to="/categoria/$slug" params={{ slug: c.slug }} className="hover:text-primary" activeProps={{ className: "text-primary" }}>
                {c.name}
              </Link>
            ))}
            <Link to="/guia-gratuita" className="hover:text-primary" activeProps={{ className: "text-primary" }}>Guía gratis</Link>
            <Link to="/ebook" className="hover:text-primary" activeProps={{ className: "text-primary" }}>Ebook</Link>
            <Link to="/sobre" className="hover:text-primary" activeProps={{ className: "text-primary" }}>Nosotras</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Newsletter />
      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © 2026 Código Femenino · Revista digital para mujeres hispanohablantes
      </footer>
    </div>
  );
}

function Newsletter() {
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email") as string;
    setState("loading");
    try {
      const msg = await subscribeNewsletter(email);
      setMessage(msg);
      setState("ok");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "No pudimos registrar tu correo. Intenta de nuevo.");
      setState("error");
    }
  }

  return (
    <section className="bg-secondary py-14">
      <div className="mx-auto max-w-xl px-4 text-center">
        <h2 className="font-display text-3xl text-foreground">Recibe lo mejor cada semana</h2>
        <p className="mt-2 text-sm text-muted-foreground">Deja tu correo y te avisaremos cuando lancemos el boletín.</p>
        {state === "ok" ? (
          <p className="mt-6 font-medium text-primary">{message}</p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 flex gap-2">
            <input required name="email" type="email" placeholder="tu@correo.com" className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            <button disabled={state === "loading"} className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60">
              {state === "loading" ? "Enviando…" : "Avisarme"}
            </button>
          </form>
        )}
        {state === "error" && <p className="mt-3 text-sm text-destructive">{message}</p>}
      </div>
    </section>
  );
}

export function ArticleCard({ a, large }: { a: Article; large?: boolean }) {
  return (
    <Link to="/articulo/$slug" params={{ slug: a.slug }} className="group block">
      <div className={`overflow-hidden rounded-sm ${large ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
        <img
          src={articleImage(a)}
          alt={a.title}
          width={1200}
          height={800}
          loading={large ? "eager" : "lazy"}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-primary">{a.categoryName}</p>
      <h3 className={`font-display mt-1 text-foreground group-hover:text-primary transition-colors ${large ? "text-3xl md:text-4xl" : "text-xl"}`}>{a.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{a.excerpt}</p>
      <p className="mt-2 text-xs text-muted-foreground">{a.author} · {formatDate(a.date)} · {a.readTime} min</p>
    </Link>
  );
}
