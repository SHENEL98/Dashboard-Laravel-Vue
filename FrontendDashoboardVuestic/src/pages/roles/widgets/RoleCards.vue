<script setup lang="ts">
import { PropType } from 'vue'
import { Role } from '../types'
import RoleStatusBadge from '../components/RoleStatusBadge.vue'

defineProps({
  roles: {
    type: Array as PropType<Role[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
})

defineEmits<{
  (event: 'edit', role: Role): void
  (event: 'delete', role: Role): void
}>()

const avatarColor = (userName: string) => {
  const colors = ['primary', '#FFD43A', '#ADFF00', '#262824', 'danger']
  const index = userName.charCodeAt(0) % colors.length
  return colors[index]
}
</script>

<template>
  <VaInnerLoading
    v-if="roles.length > 0 || loading"
    :loading="loading"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[4rem]"
  >
    <VaCard
      v-for="role in roles"
      :key="role.role_name"
      :style="{ '--va-card-outlined-border': '1px solid var(--va-background-element)' }"
      outlined
    >
      <VaCardContent class="flex flex-col h-full">
        <div class="text-[var(--va-secondary)]">{{ role.creation_date }}</div>
        <div class="flex flex-col items-center gap-4 grow">
          <h4 class="va-h4 text-center self-stretch overflow-hidden line-clamp-2 text-ellipsis">
            {{ role.role_name }}
          </h4>
          <p>
            <span class="text-[var(--va-secondary)]">Owner: </span>
            <span>{{ role.role_owner.fullname }}</span>
          </p>
          <VaAvatarGroup
            class="my-4"
            :options="
              role.team.map((user) => ({
                label: user.fullname,
                src: user.avatar,
                fallbackText: user.fullname[0],
                color: avatarColor(user.fullname),
              }))
            "
            :max="5"
          />
          <RoleStatusBadge :status="role.status" />
        </div>
        <VaDivider class="my-6" />
        <div class="flex justify-between">
          <VaButton preset="secondary" icon="mso-edit" color="secondary" @click="$emit('edit', role)" />
          <VaButton preset="secondary" icon="mso-delete" color="danger" @click="$emit('delete', role)" />
        </div>
      </VaCardContent>
    </VaCard>
  </VaInnerLoading>
  <div v-else class="p-4 flex justify-center items-center text-[var(--va-secondary)]">No roles</div>
</template>
