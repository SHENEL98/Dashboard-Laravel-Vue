import { User } from '../users/types'

export type Role = {
  id: number
  role_name: string
  role_owner: Omit<User, 'roles'>
  team: Omit<User, 'roles'>[]
  status: 'important' | 'completed' | 'archived' | 'in progress'
  creation_date: string
}

export type EmptyRole = Omit<Role, 'id' | 'role_owner' | 'creation_date' | 'status'> & {
  role_owner: Role['role_owner'] | undefined
  status: Role['status'] | undefined
}
