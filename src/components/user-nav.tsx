"use client"

import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"

export default function UserNav() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-4">
        <div className="animate-pulse">
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/auth/signin"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Iniciar Sesión
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-3">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || "Usuario"}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <div className="text-sm">
          <p className="font-medium text-gray-900">{session.user?.name}</p>
          <p className="text-gray-500">{session.user?.email}</p>
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        Cerrar Sesión
      </button>
    </div>
  )
}