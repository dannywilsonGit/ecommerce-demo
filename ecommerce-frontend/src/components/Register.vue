<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h2>Créer un compte</h2>
        <p>Rejoignez notre communauté</p>
      </div>

      <form @submit.prevent="register" class="auth-form">
        <div class="form-group">
          <input
              type="text"
              v-model="form.name"
              placeholder=" "
              required
          />
          <label>Nom complet</label>
          <div class="underline"></div>
          <span class="error" v-if="errors.name">{{ errors.name[0] }}</span>
        </div>

        <div class="form-group">
          <input
              type="email"
              v-model="form.email"
              placeholder=" "
              required
          />
          <label>Email</label>
          <div class="underline"></div>
          <span class="error" v-if="errors.email">{{ errors.email[0] }}</span>
        </div>

        <div class="form-group">
          <input
              type="password"
              v-model="form.password"
              placeholder=" "
              required
          />
          <label>Mot de passe</label>
          <div class="underline"></div>
          <span class="error" v-if="errors.password">{{ errors.password[0] }}</span>
        </div>

        <div class="form-group">
          <input
              type="password"
              v-model="form.password_confirmation"
              placeholder=" "
              required
          />
          <label>Confirmer le mot de passe</label>
          <div class="underline"></div>
        </div>

        <button type="submit" class="auth-btn" :disabled="loading">
          <span v-if="!loading">S'inscrire</span>
          <div v-else class="spinner"></div>
        </button>

        <div class="auth-footer">
          <p>Déjà un compte ? <router-link to="/login">Se connecter</router-link></p>
        </div>
      </form>
    </div>
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
      errors: {} ,

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
  color: #e53e3e;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.auth-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-top: 20px;
}

.auth-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  padding: 40px;
  transform: translateY(0);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.auth-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-header h2 {
  color: #2d3748;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
}

.auth-header p {
  color: #718096;
  font-size: 14px;
}

.form-group {
  position: relative;
  margin-bottom: 25px;
}

.form-group input {
  width: 100%;
  padding: 12px 0;
  font-size: 16px;
  border: none;
  border-bottom: 1px solid #e2e8f0;
  outline: none;
  background: transparent;
  transition: all 0.3s ease;
}

.form-group input:focus {
  border-bottom-color: transparent;
}

.form-group label {
  position: absolute;
  top: 12px;
  left: 0;
  color: #718096;
  font-size: 16px;
  pointer-events: none;
  transition: all 0.3s ease;
}

.form-group input:focus ~ label,
.form-group input:not(:placeholder-shown) ~ label {
  top: -15px;
  font-size: 12px;
  color: #667eea;
}

.underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #667eea;
  transition: width 0.4s ease;
}

.form-group input:focus ~ .underline {
  width: 100%;
}

.auth-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.auth-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.auth-btn:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.auth-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #718096;
}

.auth-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.auth-footer a:hover {
  color: #764ba2;
}
</style>