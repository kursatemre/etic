// In-memory mock database for testing without PostgreSQL
import bcrypt from 'bcryptjs'

// Users mock data
export const users: any[] = [
  {
    id: '1',
    email: 'demo@etic.com',
    password: bcrypt.hashSync('demo1234', 10),
    name: 'Demo User',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Stores mock data
export const stores: any[] = [
  {
    id: '1',
    name: 'Demo Store',
    slug: 'demo-store',
    description: 'Demo e-ticaret mağazası',
    plan: 'PROFESSIONAL',
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Store users relation
export const storeUsers: any[] = [
  {
    id: '1',
    storeId: '1',
    userId: '1',
    role: 'OWNER',
  },
]

export function findUserByEmail(email: string) {
  return users.find((u) => u.email === email)
}

export function findUserById(id: string) {
  return users.find((u) => u.id === id)
}

export function createUser(data: any) {
  const user = {
    id: String(users.length + 1),
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  users.push(user)
  return user
}

export function getUserStores(userId: string) {
  const userStoreRelations = storeUsers.filter((su) => su.userId === userId)
  return userStoreRelations.map((relation) => {
    const store = stores.find((s) => s.id === relation.storeId)
    return {
      ...store,
      role: relation.role,
    }
  })
}
