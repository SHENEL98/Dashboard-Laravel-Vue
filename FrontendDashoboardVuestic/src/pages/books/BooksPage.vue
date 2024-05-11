<script setup lang="ts">
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { useBooks } from './composables/useBooks'
import BookCards from './widgets/BookCards.vue'
import BookTable from './widgets/BooksTable.vue'
import EditBookForm from './widgets/EditBookForm.vue'
import { Book } from './types'
import { useModal, useToast } from 'vuestic-ui'

const doShowAsCards = useLocalStorage('books-view', true)

const { books, update, add, isLoading, remove, pagination, sorting } = useBooks()

const bookToEdit = ref<Book | null>(null)
const doShowBookFormModal = ref(false)

const editBook = (book: Book) => {
  bookToEdit.value = book
  doShowBookFormModal.value = true
}

const createNewBook = () => {
  bookToEdit.value = null
  doShowBookFormModal.value = true
}

const { init: notify } = useToast()

const onBookSaved = async (book: Book) => {
  doShowBookFormModal.value = false
  if ('id' in book) {
    await update(book as Book)
    notify({
      message: 'Book updated',
      color: 'success',
    })
  } else {
    await add(book as Book)
    notify({
      message: 'Book created',
      color: 'success',
    })
  }
}

const { confirm } = useModal()

const onBookDeleted = async (book: Book) => {
  const response = await confirm({
    title: 'Delete book',
    message: `Are you sure you want to delete book "${book.book_name}"?`,
    okText: 'Delete',
    size: 'small',
    maxWidth: '380px',
  })

  if (!response) {
    return
  }

  await remove(book)
  notify({
    message: 'Book deleted',
    color: 'success',
  })
}

const editFormRef = ref()

const beforeEditFormModalClose = async (hide: () => unknown) => {
  if (editFormRef.value.isFormHasUnsavedChanges) {
    const agreed = await confirm({
      maxWidth: '380px',
      message: 'Form has unsaved changes. Are you sure you want to close it?',
      size: 'small',
    })
    if (agreed) {
      hide()
    }
  } else {
    hide()
  }
}
</script>

<template>
  <h1 class="page-title">Books</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaButtonToggle
            v-model="doShowAsCards"
            color="background-element"
            border-color="background-element"
            :options="[
              { label: 'Cards', value: true },
              { label: 'Table', value: false },
            ]"
          />
        </div>
        <VaButton icon="add" @click="createNewBook">Book</VaButton>
      </div>

      <BookCards
        v-if="doShowAsCards"
        :books="books"
        :loading="isLoading"
        @edit="editBook"
        @delete="onBookDeleted"
      />
      <BookTable
        v-else
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        v-model:pagination="pagination"
        :books="books"
        :loading="isLoading"
        @edit="editBook"
        @delete="onBookDeleted"
      />
    </VaCardContent>

    <VaModal
      v-slot="{ cancel, ok }"
      v-model="doShowBookFormModal"
      size="small"
      mobile-fullscreen
      close-button
      stateful
      hide-default-actions
      :before-cancel="beforeEditFormModalClose"
    >
      <h1 v-if="bookToEdit === null" class="va-h5 mb-4">Add book</h1>
      <h1 v-else class="va-h5 mb-4">Edit book</h1>
      <EditBookForm
        ref="editFormRef"
        :book="bookToEdit"
        :save-button-label="bookToEdit === null ? 'Add' : 'Save'"
        @close="cancel"
        @save="
          (book) => {
            onBookSaved(book)
            ok()
          }
        "
      />
    </VaModal>
  </VaCard>
</template>
