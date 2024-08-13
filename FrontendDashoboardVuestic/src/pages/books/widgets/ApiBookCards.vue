<script setup lang="ts">
import { PropType, computed } from 'vue'
import { Book } from '../types'
import BookStatusBadge from '../components/BookStatusBadge.vue'
import { defineProps, defineEmits } from 'vue'
import moment from "moment"

// Define the props that the component will receive
const props = defineProps({
  books: {
    type: Array as PropType<Book[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,

  },
})

// Access the props
const apiBooks = computed(() => props.books);

const emit = defineEmits<{
  (event: 'edit', book: Book): void
  (event: 'delete', book: Book): void
}>()

const avatarColor = (userName: string) => {
  const colors = ['primary', '#FFD43A', '#ADFF00', '#262824', 'danger']
  const index = userName.charCodeAt(0) % colors.length
  return colors[index]
}
</script>

<template>
  <VaInnerLoading
    v-if="books.length > 0 || loading"
    :loading="loading"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[4rem]"
  >
    <VaCard
      v-for="book in apiBooks"
      :key="book.name"
      :style="{ '--va-card-outlined-border': '1px solid var(--va-background-element)' }"
      outlined
    >
      <VaCardContent class="flex flex-col h-full">
        <div class="text-[var(--va-secondary)]">
          {{ moment(book.created_at).format("DD-MMM-YYYY hh:mm") }}
        </div>
        <div class="flex flex-col items-center gap-4 grow">
          <h4 class="va-h4 text-center self-stretch overflow-hidden line-clamp-2 text-ellipsis">
            {{ book.name }}
          </h4>
          <p>
            <span class="text-[var(--va-secondary)]">Owner: </span>
            <span>{{ book.book_owner }}</span>
          </p>
          <BookStatusBadge :status="book.status" />
        </div>
        <VaDivider class="my-6" />
        <div class="flex justify-between">
          <VaButton preset="secondary" icon="mso-edit" color="secondary" @click="$emit('edit', book as Book)" />
          <VaButton preset="secondary" icon="mso-delete" color="danger" @click="$emit('delete', book)" />
        </div>
      </VaCardContent>
    </VaCard>
  </VaInnerLoading>
  <div v-else class="p-4 flex justify-center items-center text-[var(--va-secondary)]">No books</div>
</template>
