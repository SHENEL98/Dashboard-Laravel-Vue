<script setup lang="ts">
import { PropType } from 'vue'
import { Role } from '../types'

defineProps({
  status: {
    type: String as PropType<Role['status']>,
    required: true,
  },
})

const badgeColorMap: Record<Role['status'], string> = {
  'in progress': 'primary',
  archived: 'secondary',
  completed: 'success',
  important: 'warning',
}
</script>

<template>
  <VaBadge square :color="badgeColorMap[$props.status]" :text="$props.status.toUpperCase()" />
</template>
