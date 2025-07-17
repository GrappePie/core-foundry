// Mock Prisma client for development when real database is not available
interface MockPrismaClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  account: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  verificationToken: any
}

const mockPrisma: MockPrismaClient = {
  account: {},
  session: {},
  user: {},
  verificationToken: {},
}

// Try to import the real Prisma client, fallback to mock if not available
let prisma: MockPrismaClient

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require("@prisma/client")
  
  const globalForPrisma = globalThis as unknown as {
    prisma: InstanceType<typeof PrismaClient> | undefined
  }

  prisma = globalForPrisma.prisma ?? new PrismaClient()

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
} catch {
  console.warn("Prisma client not available, using mock client")
  prisma = mockPrisma
}

export { prisma }