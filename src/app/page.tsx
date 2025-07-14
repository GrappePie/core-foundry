import Link from 'next/link';

/**
 * Página de inicio (Landing Page) de la aplicación.
 * Sirve como la portada principal y el punto de entrada para los usuarios.
 */
export default function HomePage() {
  return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-background text-white p-8">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
            Construye tu Fábrica de Negocios
          </h1>
          <p className="text-lg md:text-xl text-text-secondary mb-8">
            Una plataforma SaaS modular donde visualizas tus operaciones como una fábrica interactiva. Activa módulos, conecta flujos de trabajo y optimiza tu productividad de una forma nunca antes vista.
          </p>
          <div className="flex justify-center">
            <Link
                href="/dashboard"
                className="px-8 py-4 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Acceder a mi Dashboard
            </Link>
          </div>
        </div>
        <footer className="absolute bottom-8 text-text-secondary text-sm">
          <p>Desarrollado con Next.js, Phaser y mucho 🚀</p>
        </footer>
      </main>
  );
}
