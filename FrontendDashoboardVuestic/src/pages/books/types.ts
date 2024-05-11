import { User } from '../users/types'

export type Book = {
  id: number
  book_name: string
  book_owner: Omit<User, 'books'>
  team: Omit<User, 'books'>[]
  status: 'important' | 'completed' | 'archived' | 'in progress'
  creation_date: string
}

export type EmptyBook = Omit<Book, 'id' | 'book_owner' | 'creation_date' | 'status'> & {
  book_owner: Book['book_owner'] | undefined
  status: Book['status'] | undefined
}
