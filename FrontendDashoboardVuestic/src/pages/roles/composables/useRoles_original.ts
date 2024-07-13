import { Ref, ref, unref } from 'vue'
import {
  getRoles,
  addRole,
  updateRole,
  removeRole,
  Sorting,
  Pagination,
} from '../../../data/pages/roles'
import { Role } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'creation_date', sortingOrder: 'desc' })

export const useRoles = (options?: { sorting?: Ref<Sorting>; pagination?: Ref<Pagination> }) => {
  const isLoading = ref(false)
  const roles = ref<Role[]>([])

  const { sorting = makeSortingRef(), pagination = makePaginationRef() } = options ?? {}

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getRoles({
      ...unref(sorting),
      ...unref(pagination),
    })
    roles.value = data as Role[]

    ignoreUpdates(() => {
      pagination.value = newPagination
    })

    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([pagination, sorting], fetch, { deep: true })

  fetch()

  return {
    isLoading,

    roles,

    fetch,

    async add(role: Omit<Role, 'id' | 'creation_date'>) {
      isLoading.value = true
      await addRole({
        ...role,
        role_owner: role.role_owner.id,
        team: role.team.map((user) => user.id),
      })
      await fetch()
      isLoading.value = false
    },

    async update(role: Role) {
      isLoading.value = true
      await updateRole({
        ...role,
        role_owner: role.role_owner.id,
        team: role.team.map((user) => user.id),
      })
      await fetch()
      isLoading.value = false
    },

    async remove(role: Role) {
      isLoading.value = true
      await removeRole({
        ...role,
        role_owner: role.role_owner.id,
        team: role.team.map((user) => user.id),
      })
      await fetch()
      isLoading.value = false
    },

    pagination,
    sorting,
  }
}
