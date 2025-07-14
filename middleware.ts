export { auth as middleware } from "@/core/auth/options"

// El 'matcher' define qué rutas estarán protegidas por el middleware.
// No es necesario cambiarlo.
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/api/tenant/:path*",
    ],
}
