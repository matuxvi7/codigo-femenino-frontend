import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre nosotras — Código Femenino" },
      { name: "description", content: "Quiénes somos y qué viene próximamente en Código Femenino." },
      { property: "og:title", content: "Sobre nosotras — Código Femenino" },
      { property: "og:description", content: "Nuestra misión editorial y próximos lanzamientos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: About,
});

const soon = ["Cuentas de lectora y artículos guardados", "Boletín semanal por correo", "Panel editorial para publicar artículos", "Recomendaciones de productos de belleza", "Buscador de artículos"];

function About() {
  return (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 py-12 text-foreground">
        <h1 className="font-display text-5xl">Sobre nosotras</h1>
        <p className="mt-6 text-lg leading-relaxed">Código Femenino es una revista digital para mujeres de Latinoamérica y España. Te ayudamos a comprender tus emociones, mejorar tus relaciones, fortalecer tu autoestima y cuidarte con consejos de belleza útiles y honestos.</p>
        <p className="mt-4 text-sm text-muted-foreground">Nuestro contenido es informativo y no sustituye la atención de un profesional de la salud.</p>
        <h2 className="font-display mt-12 text-3xl">Próximamente</h2>
        <ul className="mt-4 space-y-2">
          {soon.map((s) => <li key={s} className="flex gap-3"><span className="text-primary">✦</span>{s}</li>)}
        </ul>
      </div>
    </Layout>
  );
}
