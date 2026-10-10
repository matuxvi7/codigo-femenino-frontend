import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import cover from "@/assets/ebook-cover.jpg";

export const Route = createFileRoute("/ebook")({
  head: () => ({
    meta: [
      { title: "Ebook Código Femenino: guía práctica — 12,90 €" },
      { name: "description", content: "La guía práctica de Código Femenino para tu autoestima, tus relaciones y tu bienestar. 12,90 €." },
      { property: "og:title", content: "Ebook Código Femenino: guía práctica" },
      { property: "og:description", content: "Autoestima, relaciones y bienestar en una guía práctica. 12,90 €." },
    ],
  }),
  component: Ebook,
});

const indice = [
  "Capítulo 1 · Conocerte de verdad",
  "Capítulo 2 · La autoestima como hábito",
  "Capítulo 3 · Relaciones sanas y límites",
  "Capítulo 4 · Emociones sin culpa",
  "Capítulo 5 · Rituales de belleza y autocuidado",
  "Capítulo 6 · Tu plan de 30 días",
];

const testimonios = [
  { t: "Lo leí en un fin de semana y cambió cómo me hablo a mí misma.", n: "Lucía, Madrid" },
  { t: "Práctico, cálido y sin frases vacías. El plan de 30 días es oro.", n: "Camila, Buenos Aires" },
  { t: "Por fin un libro que entiende lo que vivimos.", n: "Andrea, CDMX" },
];

function Ebook() {
  const [clicked, setClicked] = useState(false);
  return (
    <Layout>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2 md:items-center">
        <img src={cover} alt="Portada del ebook Código Femenino" width={1024} height={1280} className="w-full rounded-sm" />
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-primary">Ebook</p>
          <h1 className="font-display mt-2 text-4xl md:text-5xl leading-tight text-foreground">Código Femenino: guía práctica</h1>
          <p className="mt-3 text-lg text-muted-foreground">Herramientas concretas para quererte más, elegir mejor y vivir con calma.</p>
          <p className="font-display mt-6 text-4xl text-foreground">12,90 €</p>
          <button onClick={() => setClicked(true)} className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">Comprar ebook</button>
          {clicked && <p className="mt-3 rounded-sm bg-secondary p-3 text-sm text-primary">El pago en línea llega próximamente. ¡Gracias por tu interés!</p>}
          <p className="mt-2 text-[11px] text-muted-foreground">PDF y ePub · Descarga inmediata (próximamente)</p>
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 md:grid-cols-2">
        <section>
          <h2 className="mb-4 border-b border-border pb-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">Índice</h2>
          <ul className="space-y-2 text-foreground">{indice.map((c) => <li key={c}>{c}</li>)}</ul>
        </section>
        <section>
          <h2 className="mb-4 border-b border-border pb-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">Lo que dicen las lectoras</h2>
          <div className="space-y-5">
            {testimonios.map((x) => (
              <blockquote key={x.n}>
                <p className="font-display text-xl italic text-foreground">“{x.t}”</p>
                <footer className="mt-1 text-xs text-muted-foreground">— {x.n}</footer>
              </blockquote>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
