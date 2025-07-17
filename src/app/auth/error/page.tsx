import Link from "next/link"

interface ErrorPageProps {
  searchParams: Promise<{
    error?: string
  }>
}

export default async function AuthError({ searchParams }: ErrorPageProps) {
  const { error } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Error de Autenticación
          </h2>
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {error === "Configuration" && "Error de configuración del servidor"}
                  {error === "AccessDenied" && "Acceso denegado"}
                  {error === "Verification" && "Error de verificación"}
                  {!error && "Error desconocido"}
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    {error === "Configuration" && 
                      "Hay un problema con la configuración del servidor. Por favor, contacta al administrador."}
                    {error === "AccessDenied" && 
                      "No tienes permisos para acceder a esta aplicación."}
                    {error === "Verification" && 
                      "El enlace de verificación ha expirado o ya fue usado."}
                    {!error && 
                      "Ha ocurrido un error inesperado durante la autenticación."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <Link
            href="/auth/signin"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Intentar de nuevo
          </Link>
        </div>
      </div>
    </div>
  )
}