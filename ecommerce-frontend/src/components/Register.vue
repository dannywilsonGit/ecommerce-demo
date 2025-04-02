<template>
  <div class="form-container">
    <form @submit.prevent="register" class="register">
      <!-- Name Field -->
      <input
          type="text"
          v-model="form.name"
          placeholder="Name"
          required
      />
      <span class="error" v-if="errors.name">{{ errors.name[0] }}</span>

      <!-- Email Field -->
      <input
          type="email"
          v-model="form.email"
          placeholder="Email"
          required
      />
      <span class="error" v-if="errors.email">{{ errors.email[0] }}</span>

      <!-- Password Field -->
      <input
          type="password"
          v-model="form.password"
          placeholder="Password"
          required
      />
      <span class="error" v-if="errors.password">{{ errors.password[0] }}</span>

      <!-- Password Confirmation Field -->
      <input
          type="password"
          v-model="form.password_confirmation"
          placeholder="Confirm Password"
          required
      />

      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import axios from "@/axios";

export default {
  data() {
    return {
      loading: false,
      form: {
        name: "",
        email: "",
        password: "",
        password_confirmation: ""
      },
      errors: {}
    }
  },

  methods: {
    async register() {
      this.loading = true
      this.errors = {}
      try {
        const response = await axios.post("/register", this.form)
        this.$router.push('/login')
      } catch (error) {
        if (error.response?.status === 422) {
          this.errors = error.response.data.errors
        } else {
          console.error('Error:', error)
          alert("Une erreur est survenue. Veuillez réessayer.")
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.error {
  color: red;
  font-size: 0.8rem;
  display: block;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
}
</style>