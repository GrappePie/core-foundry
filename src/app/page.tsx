import { auth } from "@/lib/auth"
import UserNav from "@/components/user-nav"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                🏭 CoreFoundry
              </h1>
              <span className="ml-2 px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                Beta
              </span>
            </div>
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ¡Bienvenido a CoreFoundry!
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Plataforma SaaS modular multi-tenant con interfaz gamificada
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {/* Módulo de Inventario */}
                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <div className="text-4xl mb-4">📦</div>
                  <h3 className="text-xl font-semibold mb-2">Inventario</h3>
                  <p className="text-gray-600 mb-4">
                    Gestiona tu inventario y stock en tiempo real
                  </p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Activar Módulo
                  </button>
                </div>

                {/* Módulo de Ventas */}
                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <div className="text-4xl mb-4">💰</div>
                  <h3 className="text-xl font-semibold mb-2">Ventas</h3>
                  <p className="text-gray-600 mb-4">
                    Procesa pedidos y gestiona ventas
                  </p>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                    Activar Módulo
                  </button>
                </div>

                {/* Módulo de Reportes */}
                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold mb-2">Reportes</h3>
                  <p className="text-gray-600 mb-4">
                    Genera reportes y analíticas avanzadas
                  </p>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                    Activar Módulo
                  </button>
                </div>
              </div>

              <div className="mt-12 p-6 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  🎮 Vista Gamificada (Próximamente)
                </h3>
                <p className="text-blue-700">
                  Experimenta una interfaz similar a Satisfactory donde cada módulo
                  se presenta como una máquina interactiva en un mapa 2D.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
