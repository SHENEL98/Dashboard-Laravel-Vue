<script setup lang="ts">
import { PropType } from 'vue'
import { Book } from '../types'

defineProps({
  status: {
    type: String as PropType<Book['status']>,
    required: true,
  },
})

const badgeColorMap: Record<Book['status'], string> = {
  'in progress': 'primary',
  archived: 'secondary',
  completed: 'success',
  important: 'warning',
}
</script>

<template>
  <VaBadge square :color="badgeColorMap[$props.status]" :text="$props.status.toUpperCase()" />
</template>
