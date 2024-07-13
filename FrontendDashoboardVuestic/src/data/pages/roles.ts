import { sleep } from '../../services/utils'
import rolesDb from './roles-db.json'
import usersDb from './users-db.json'

// Simulate API calls
export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof (typeof rolesDb)[number] | undefined
  sortingOrder: 'asc' | 'desc' | null
}

const getSortItem = (obj: any, sortBy: keyof (typeof rolesDb)[number]) => {
  if (sortBy === 'role_owner') {
    return obj.role_owner.fullname
  }

  if (sortBy === 'team') {
    return obj.team.map((user: any) => user.fullname).join(', ')
  }

  if (sortBy === 'creation_date') {
    return new Date(obj[sortBy])
  }

  return obj[sortBy]
}

export const getRoles = async (options: Sorting & Pagination) => {
  await sleep(1000)

  const roles = rolesDb.map((role) => ({
    ...role,
    role_owner: usersDb.find((user) => user.id === role.role_owner)! as (typeof usersDb)[number],
    team: usersDb.filter((user) => role.team.includes(user.id)) as (typeof usersDb)[number][],
  }))

  if (options.sortBy && options.sortingOrder) {
    roles.sort((a, b) => {
      a = getSortItem(a, options.sortBy!)
      b = getSortItem(b, options.sortBy!)
      if (a < b) {
        return options.sortingOrder === 'asc' ? -1 : 1
      }
      if (a > b) {
        return options.sortingOrder === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  const normalizedRoles = roles.slice((options.page - 1) * options.perPage, options.page * options.perPage)

  return {
    data: normalizedRoles,
    pagination: {
      page: options.page,
      perPage: options.perPage,
      total: rolesDb.length,
    },
  }
}

export const addRole = async (role: Omit<(typeof rolesDb)[number], 'id' | 'creation_date'>) => {
  await sleep(1000)

  const newRole = {
    ...role,
    id: rolesDb.length + 1,
    creation_date: new Date().toLocaleDateString('gb', { day: 'numeric', month: 'short', year: 'numeric' }),
  }

  rolesDb.push(newRole)

  return {
    ...newRole,
    role_owner: usersDb.find((user) => user.id === role.role_owner)! as (typeof usersDb)[number],
    team: usersDb.filter((user) => role.team.includes(user.id)) as (typeof usersDb)[number][],
  }
}

export const updateRole = async (role: (typeof rolesDb)[number]) => {
  await sleep(1000)

  const index = rolesDb.findIndex((p) => p.id === role.id)
  rolesDb[index] = role

  return role
}

export const removeRole = async (role: (typeof rolesDb)[number]) => {
  await sleep(1000)

  const index = rolesDb.findIndex((p) => p.id === role.id)
  rolesDb.splice(index, 1)

  return role
}
