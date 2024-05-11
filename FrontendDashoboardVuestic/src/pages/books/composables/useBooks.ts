import { Ref, ref, unref } from 'vue'
import {
  getBooks,
  addBook,
  updateBook,
  removeBook,
  Sorting,
  Pagination,
} from '../../../data/pages/books'
import { Book } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'creation_date', sortingOrder: 'desc' })

export const useBooks = (options?: { sorting?: Ref<Sorting>; pagination?: Ref<Pagination> }) => {
  const isLoading = ref(false)
  const books = ref<Book[]>([])

  const { sorting = makeSortingRef(), pagination = makePaginationRef() } = options ?? {}

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getBooks({
      ...unref(sorting),
      ...unref(pagination),
    })
    books.value = data as Book[]

    ignoreUpdates(() => {
      pagination.value = newPagination
    })

    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([pagination, sorting], fetch, { deep: true })

  fetch()

  return {
    isLoading,

    books,

    fetch,

    async add(book: Omit<Book, 'id' | 'creation_date'>) {
      isLoading.value = true
      await addBook({
        ...book,
        book_owner: book.book_owner.id,
        team: book.team.map((user) => user.id),
      })
      await fetch()
      isLoading.value = false
    },

    async update(book: Book) {
      isLoading.value = true
      await updateBook({
        ...book,
        book_owner: book.book_owner.id,
        team: book.team.map((user) => user.id),
      })
      await fetch()
      isLoading.value = false
    },

    async remove(book: Book) {
      isLoading.value = true
      await removeBook({
        ...book,
        book_owner: book.book_owner.id,
        team: book.team.map((user) => user.id),
      })
      await fetch()
      isLoading.value = false
    },

    pagination,
    sorting,
  }
}
