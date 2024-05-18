<template>
  <div>
    <h1 class="page-title">Books</h1>

    <VaCard>
      <VaCardContent>
        <div>
          <h1>Book List</h1>
          <ul>
            <li v-for="book in allBooks" :key="book.id">
              {{ book.name }}
            </li>
          </ul>
        </div>
      </VaCardContent>
    </VaCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const allBooks = ref([]);
const getAllBooks = async () => {
  try {
    const response = await axios.get('api/books');
    console.log("books:", response.data); // Adjusted to reflect the correct response structure
    allBooks.value = response.data; // Assuming response.data is the array of books
  } catch (error) {
    console.error('Error fetching books:', error);
  }
};

onMounted(getAllBooks);
</script>
