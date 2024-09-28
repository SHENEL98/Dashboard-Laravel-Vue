<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { EmptyBook, Book } from '../types'
import { SelectOption } from 'vuestic-ui'
import { useUsers } from '../../users/composables/useUsers'
import BookStatusBadge from '../components/BookStatusBadge.vue'
import UserAvatar from '../../users/widgets/UserAvatar.vue'
import moment from "moment"
import axios from "axios" 

const user = ref(null); // Set to null initially

onMounted(async () => {
  try {
    const { data } = await axios.get('/api/user');
    user.value = data;

    // Now that user is loaded, set created_by for newBook if it's not already set
    if (!newBook.value.created_by) {
      newBook.value.created_by = user.value.id;
    }
  } catch (error) {
    console.error("Error fetching user", error);
  }
});

const props = defineProps<{
  book: Book | null
  saveButtonLabel: string
}>()

defineEmits<{
  (event: 'save', book: Book): void
  (event: 'close'): void
}>()

const defaultNewBook: EmptyBook = {
  name: '',
  book_owner: undefined,
  categories : '',
  status: undefined,
  created_by : null // Initialize as null
}

const newBook = ref({ ...defaultNewBook })

const isForm_HasUnsavedChanges = computed(() => {
  return Object.keys(newBook.value).some((key) => {
    if (key === 'team') {
      return false
    }

    return (
      newBook.value[key as keyof EmptyBook] !== (props.book ?? defaultNewBook)?.[key as keyof EmptyBook]
    )
  })
})

defineExpose({
  isForm_HasUnsavedChanges,
})

watch(
  () => props.book,
  () => {
    if (!props.book) {
      return;
    }

    // Update newBook when props.book changes, including setting created_by
    newBook.value = {
      ...props.book,
      book_owner: props.book.book_owner,
      categories: props.book.categories,
      status: props.book.status,
      created_date: moment(props.book.created_at).format("DD-MMM-YYYY hh:mm"),
      created_by: user.value?.id || props.book.created_by, // Ensure created_by is set based on user data
    };
  },
  { immediate: true },
);

const required = (v: string | SelectOption) => !!v || 'This field is required'

const { users: teamUsers, filters: teamFilters } = useUsers({ pagination: ref({ page: 1, perPage: 100, total: 10 }) })
const { users: ownerUsers, filters: ownerFilters } = useUsers({ pagination: ref({ page: 1, perPage: 100, total: 10 }) })
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <VaInput v-model="newBook.name" label="Book name" :rules="[required]" />
    <VaInput v-model="newBook.book_owner" label="Book owner name" :rules="[required]" />
    <VaInput v-model="newBook.categories" label="Book Categories" :rules="[required]" />
    <VaSelect
      v-model="newBook.status"
      label="Status"
      :rules="[required]"
      track-by="value"
      value-by="value"
      :options="[
        { text: 'Ready', value: 'ready' },
        { text: 'Published', value: 'published' },
        { text: 'Canceled', value: 'canceled' },
      ]"
    >
    </VaSelect>
    <VaInput v-if="newBook.created_date" v-model="newBook.created_date" label="Created on" mask="date" readonly  />
    <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton @click="validate() && $emit('save', newBook as Book)">{{ saveButtonLabel }}</VaButton>
    </div>
  </VaForm>
</template>

<style lang="scss" scoped>
.va-select-content__autocomplete {
  flex: 1;
}

.va-input-wrapper__text {
  gap: 0.2rem;
}
</style>
