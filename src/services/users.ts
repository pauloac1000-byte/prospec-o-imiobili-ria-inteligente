import pb from '@/lib/pocketbase/client'

export interface UserItem {
  id: string
  name?: string
  email: string
  role?: 'admin' | 'corretor' | string
  avatar?: string
  created: string
  updated: string
  verified?: boolean
}

export interface CreateUserData {
  name: string
  email: string
  password: string
  role: 'admin' | 'corretor'
}

export interface UpdateUserData {
  name?: string
  email?: string
  role?: 'admin' | 'corretor'
}

export async function getUsers(): Promise<UserItem[]> {
  const records = await pb.collection('users').getFullList<UserItem>({
    sort: '-created',
  })
  return records
}

export async function createUser(data: CreateUserData): Promise<UserItem> {
  const record = await pb.collection('users').create<UserItem>({
    name: data.name,
    email: data.email,
    password: data.password,
    passwordConfirm: data.password,
    role: data.role || 'corretor',
    emailVisibility: true,
  })
  return record
}

export async function updateUser(id: string, data: UpdateUserData): Promise<UserItem> {
  const record = await pb.collection('users').update<UserItem>(id, data)
  return record
}

export async function deleteUser(id: string): Promise<boolean> {
  return await pb.collection('users').delete(id)
}

export async function adminResetUserPassword(userId: string, newPassword: string): Promise<void> {
  const baseUrl = import.meta.env.VITE_POCKETBASE_URL || ''
  const response = await fetch(`${baseUrl}/backend/v1/admin/users/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: pb.authStore.token,
    },
    body: JSON.stringify({ userId, newPassword }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Falha ao redefinir senha do usuário')
  }
}
