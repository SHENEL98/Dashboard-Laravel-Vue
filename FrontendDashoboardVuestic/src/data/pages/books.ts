import { sleep } from '../../services/utils'
import booksDb from './books-db.json'
import usersDb from './users-db.json'

// Simulate API calls
export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof (typeof booksDb)[number] | undefined
  sortingOrder: 'asc' | 'desc' | null
}

const getSortItem = (obj: any, sortBy: keyof (typeof booksDb)[number]) => {
  if (sortBy === 'book_owner') {
    return obj.book_owner.fullname
  }

  if (sortBy === 'team') {
    return obj.team.map((user: any) => user.fullname).join(', ')
  }

  if (sortBy === 'creation_date') {
    return new Date(obj[sortBy])
  }

  return obj[sortBy]
}

export const getBooks = async (options: Sorting & Pagination) => {
  await sleep(1000)

  const books = booksDb.map((book) => ({
    ...book,
    book_owner: usersDb.find((user) => user.id === book.book_owner)! as (typeof usersDb)[number],
    team: usersDb.filter((user) => book.team.includes(user.id)) as (typeof usersDb)[number][],
  }))

  if (options.sortBy && options.sortingOrder) {
    books.sort((a, b) => {
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

  const normalizedBooks = books.slice((options.page - 1) * options.perPage, options.page * options.perPage)

  return {
    data: normalizedBooks,
    pagination: {
      page: options.page,
      perPage: options.perPage,
      total: booksDb.length,
    },
  }
}

export const addBook = async (book: Omit<(typeof booksDb)[number], 'id' | 'creation_date'>) => {
  await sleep(1000)

  const newBook = {
    ...book,
    id: booksDb.length + 1,
    creation_date: new Date().toLocaleDateString('gb', { day: 'numeric', month: 'short', year: 'numeric' }),
  }

  booksDb.push(newBook)

  return {
    ...newBook,
    book_owner: usersDb.find((user) => user.id === book.book_owner)! as (typeof usersDb)[number],
    team: usersDb.filter((user) => book.team.includes(user.id)) as (typeof usersDb)[number][],
  }
}

export const updateBook = async (book: (typeof booksDb)[number]) => {
  await sleep(1000)

  const index = booksDb.findIndex((p) => p.id === book.id)
  booksDb[index] = book

  return book
}

export const removeBook = async (book: (typeof booksDb)[number]) => {
  await sleep(1000)

  const index = booksDb.findIndex((p) => p.id === book.id)
  booksDb.splice(index, 1)

  return book
}
