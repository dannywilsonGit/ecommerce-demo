<template>
  <div class="edit-product-container">
    <div class="form-card">
      <h2>Modifier le produit</h2>

      <form @submit.prevent="submitForm">
        <!-- Nom -->
        <div class="form-group">
          <input v-model="product.name" required placeholder=" ">
          <label>Nom du produit</label>
          <span class="error" v-if="errors.name">{{ errors.name[0] }}</span>
        </div>

        <!-- Description -->
        <div class="form-group">
          <textarea v-model="product.description" required placeholder=" " rows="3"></textarea>
          <label>Description</label>
          <span class="error" v-if="errors.description">{{ errors.description[0] }}</span>
        </div>

        <!-- Prix -->
        <div class="form-group">
          <input v-model.number="product.price" type="number" min="0" step="0.01" required placeholder=" ">
          <label>Prix (€)</label>
          <span class="error" v-if="errors.price">{{ errors.price[0] }}</span>
        </div>

        <div class="form-actions">
          <button type="button" @click="$router.go(-1)" class="cancel-btn">Annuler</button>
          <button type="submit" :disabled="loading" class="submit-btn">
            <span v-if="!loading">Enregistrer</span>
            <div v-else class="spinner"></div>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  data() {
    return {
      product: {
        id: null,
        name: '',
        description: '',
        price: 0
      },
      errors: {},
      loading: false
    }
  },
  created() {
    this.fetchProduct();
  },
  methods: {
    async fetchProduct() {
      this.loading = true;
      try {
        const response = await axios.get(`/products/${this.$route.params.id}`);
        this.product = response.data;
      } catch (error) {
        console.error('Fetch error:', error);
        alert('Erreur de chargement');
        this.$router.push('/products');
      } finally {
        this.loading = false;
      }
    },
    async submitForm() {
      this.loading = true;
      this.errors = {};

      try {
        await axios.put(`/products/${this.product.id}`, this.product);
        alert('Produit mis à jour');
        await this.$router.push('/products');
      } catch (error) {
        if (error.response?.status === 422) {
          this.errors = error.response.data.errors || {};
        } else {
          if (error.response?.status === 401) {
            await this.$store.dispatch('logout');
            this.$router.push('/login');
          }
        }
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.edit-product-container {
  margin: 2rem auto;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  padding: 2rem;
  background: #f8fafc;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-btn {
  background: #f1f5f9;
  color: #64748b;
}

.submit-btn {
  background: #6366f1;
  color: white;
}
.form-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 500px;
  padding: 2rem;
}

.form-title {
  color: #1e293b;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 0;
  font-size: 1rem;
  border: none;
  border-bottom: 1px solid #e2e8f0;
  outline: none;
  background: transparent;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-group label {
  position: absolute;
  top: 0.75rem;
  left: 0;
  color: #64748b;
  pointer-events: none;
  transition: all 0.3s ease;
}

.form-group input:focus ~ label,
.form-group input:not(:placeholder-shown) ~ label,
.form-group textarea:focus ~ label,
.form-group textarea:not(:placeholder-shown) ~ label {
  top: -0.5rem;
  font-size: 0.75rem;
  color: #6366f1;
}

.underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #6366f1;
  transition: width 0.3s ease;
}

.form-group input:focus ~ .underline,
.form-group textarea:focus ~ .underline {
  width: 100%;
}

.error {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.submit-btn:hover {
  background: #4f46e5;
}

.submit-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
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

</style>