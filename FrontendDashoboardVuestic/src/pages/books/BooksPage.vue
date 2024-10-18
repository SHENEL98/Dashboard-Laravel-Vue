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
        <VaButton color="success" icon="add" @click="createNewBook">Add Book</VaButton>
      </div>
      <section v-if="doShowAsCards">
        <ApiBookCards
          :books="allBooks"
          :loading="isLoading"
          @edit="edit_Book"
          @delete="on_BookDeleted"
        >
        </ApiBookCards>
      </section>
      <section v-else>
        <ApiBookTable
          :books="allBooks"
          :loading="isLoading"
          @edit="edit_Book"
          @delete="on_BookDeleted"
          >
        </ApiBookTable>
      </section>
    </VaCardContent>

    <VaModal
      v-slot="{ cancel, ok }"
      v-model="doShowBook_FormModal"
      size="small"
      mobile-fullscreen
      close-button
      stateful
      hide-default-actions
      :before-cancel="before_EditFormModalClose"
    >
      <h1 v-if="book_ToEdit === null" class="va-h5 mb-4">Add Book</h1>
      <h1 v-else class="va-h5 mb-4">Edit book</h1>
      <ApiEditBookForm
        ref="edit_FormRef"
        :book="book_ToEdit"
        :save-button-label="book_ToEdit === null ? 'Add' : 'Save'"
        @close="cancel"
        @save="
          (book) => {
            on_BookSaved(book)
            ok()
          }
        "
      />
    </VaModal>
  </VaCard>
</template>
<script setup lang="ts">
import { ref , onMounted } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { useBooks } from './composables/useBooks'
import ApiBookTable from './widgets/ApiBooksTable.vue'
import ApiBookCards from './widgets/ApiBookCards.vue'
import ApiEditBookForm from './widgets/ApiEditBookForm.vue'
import { Book } from './types'
import { useModal, useToast } from 'vuestic-ui'
import axios from "axios" 

const doShowAsCards = useLocalStorage('books-view', true)

const { books, update, add, isLoading, remove, pagination, sorting } = useBooks()

const doShowBookFormModal = ref(false)
const doShowBook_FormModal = ref(false)

const book_ToEdit = ref<Book | null>(null)

const edit_Book = (book ) => {
  book_ToEdit.value = book
  doShowBook_FormModal.value =true
}
const createNewBook = () => {
  book_ToEdit.value = null
  doShowBook_FormModal.value = true
}

const { init: notify } = useToast()

const on_BookSaved = async(book : Book)=>{
  doShowBookFormModal.value = false
  try{  
    if(!book_ToEdit._value){
      const response = await axios.post('api/v1/books/', book);
      if (!response) {
        return
      }
      notify({
        message: 'Book created',
        color: 'success',
      })
    }else{
      const response = await axios.patch('api/v1/books/'+book.id, book);
      if (!response) {
        return
      }
      notify({
        message: 'Book updated',
        color: 'success',
      })
    }
    // After saving or updating, call getAllBooks to refresh the data
    await getAllBooks();

  }catch(error){
    notify({
        message: 'Something not right :'+ error.data,
        color: 'danger',
      })
    console.log("error :"+ error)    
  }
}

const { confirm } = useModal()

const on_BookDeleted = async (book: Book) => {
  const response = await confirm({
    title: 'Delete book',
    message: `Are you sure you want to delete book "${book.name}"?`,
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

  // After deleteing, call getAllBooks to refresh the data
  await getAllBooks();
}

const edit_FormRef = ref()

const before_EditFormModalClose = async (hide: () => unknown) => {
  if (edit_FormRef.value.isForm_HasUnsavedChanges) {
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

const allBooks = ref([]);
const getAllBooks = async () => {
  try {
    const response = await axios.get('api/v1/books');
    allBooks.value = response.data; // Assuming response.data is the array of books
  } catch (error) {
    console.error('Error fetching books:', error);
  }
};

onMounted(getAllBooks);

</script>