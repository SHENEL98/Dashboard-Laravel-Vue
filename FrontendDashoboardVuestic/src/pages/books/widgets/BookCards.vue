<script setup lang="ts">
import { PropType } from 'vue'
import { Book } from '../types'
import BookStatusBadge from '../components/BookStatusBadge.vue'
import { defineProps, defineEmits } from 'vue'

// Define the props that the component will receive
const props = defineProps<{
  apiBookData: [],
  books: Book[],
  loading: boolean
}>()

// Access the props
const apiBooks = props.apiBookData;

defineEmits<{
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
      v-for="book in books"
      :key="book.book_name"
      :style="{ '--va-card-outlined-border': '1px solid var(--va-background-element)' }"
      outlined
    >
      <VaCardContent class="flex flex-col h-full">
        <div class="text-[var(--va-secondary)]">{{ book.creation_date }}</div>
        <div class="flex flex-col items-center gap-4 grow">
          <h4 class="va-h4 text-center self-stretch overflow-hidden line-clamp-2 text-ellipsis">
            {{ book.book_name }}
          </h4>
          <p>
            <span class="text-[var(--va-secondary)]">Owner: </span>
            <span>{{ book.book_owner.fullname }}</span>
          </p>
          <VaAvatarGroup
            class="my-4"
            :options="
              book.team.map((user) => ({
                label: user.fullname,
                src: user.avatar,
                fallbackText: user.fullname[0],
                color: avatarColor(user.fullname),
              }))
            "
            :max="5"
          />
          <BookStatusBadge :status="book.status" />
        </div>
        <VaDivider class="my-6" />
        <div class="flex justify-between">
          <VaButton preset="secondary" icon="mso-edit" color="secondary" @click="$emit('edit', book)" />
          <VaButton preset="secondary" icon="mso-delete" color="danger" @click="$emit('delete', book)" />
        </div>
      </VaCardContent>
    </VaCard>
  </VaInnerLoading>
  <div v-else class="p-4 flex justify-center items-center text-[var(--va-secondary)]">No books</div>
</template>
