<template>
  <VaForm>
    <VaInput v-model="user.name" label="User name" :rules="[required]" />
    <VaInput v-model="user.email" label="User email" :rules="[required]" />

    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        v-model="user.password"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        label="Password"
        placeholder="#########"
        @click-append-inner="isPasswordVisible.value = !isPasswordVisible.value"
      >
        <template #appendInner>
          <VaIcon :name="isPasswordVisible.value ? 'visibility_off' : 'visibility'" size="small" color="primary" />
        </template>
      </VaInput>
    </VaValue>

    <VaValue v-slot="isConfirmPasswordVisible" :default-value="false">
      <VaInput
        v-model="user.confirmPassword"
        :type="isConfirmPasswordVisible.value ? 'text' : 'password'"
        label="Confirm Password"
        placeholder="#########"
        @click-append-inner="isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value"
        :error="passwordMismatch"
        error-message="Passwords do not match"
      >
        <template #appendInner>
          <VaIcon
            :name="isConfirmPasswordVisible.value ? 'visibility_off' : 'visibility'"
            size="small"
            color="primary"
          />
        </template>
      </VaInput>
    </VaValue>

    <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton :disabled="isSaveDisabled" @click="$emit('save', user)">Save</VaButton>
    </div>
  </VaForm>
</template>

<script>
import { VaInput, VaForm, VaButton, VaIcon } from 'vuestic-ui'

export default {
  name: 'UserForm',
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
    }
  },
  computed: {
    // Check if password and confirm password match
    passwordMismatch() {
      return this.user.password !== this.user.confirmPassword
    },
    // Disable save button if any field is empty or passwords do not match
    isSaveDisabled() {
      return !this.user.name || !this.user.email || !this.user.password || this.passwordMismatch
    },
  },
  methods: {
  },
}
</script>
