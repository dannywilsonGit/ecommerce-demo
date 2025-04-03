<template>
  <div class="edit-product-container">
    <div class="form-card">
      <div class="header">
        <h2>Modifier le produit</h2>
        <router-link :to="'/products/' + product.id" class="back-btn">
          <svg class="back-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
          </svg>
          Retour
        </router-link>
      </div>

      <form @submit.prevent="submitForm" class="product-form">
        <div class="form-group">
          <input
              type="text"
              v-model="product.name"
              required
              placeholder=" "
          />
          <label>Nom du produit*</label>
          <div class="underline"></div>
          <span class="error" v-if="errors.name">{{ errors.name[0] }}</span>
        </div>

        <div class="form-group">
          <textarea
              v-model="product.description"
              required
              placeholder=" "
              rows="3"
          ></textarea>
          <label>Description*</label>
          <div class="underline"></div>
          <span class="error" v-if="errors.description">{{ errors.description[0] }}</span>
        </div>

        <div class="form-group">
          <input
              type="number"
              v-model.number="product.price"
              min="0"
              step="0.01"
              required
              placeholder=" "
          />
          <label>Prix (€)*</label>
          <div class="underline"></div>
          <span class="error" v-if="errors.price">{{ errors.price[0] }}</span>
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="$router.go(-1)">
            Annuler
          </button>
          <button type="submit" class="submit-btn" :disabled="loading">
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
      loading: false,
      initialLoad: true
    }
  },
  created() {
    this.fetchProduct();
  },
  methods: {
    async fetchProduct() {
      try {
        const response = await axios.get(`/products/${this.$route.params.id}`);
        this.product = response.data;
      } catch (error) {
        console.error('Error fetching product:', error);
        this.$toast.error('Produit introuvable');
        this.$router.push('/products');
      } finally {
        this.initialLoad = false;
      }
    },
    async submitForm() {
      this.loading = true;
      this.errors = {};

      try {
        const response = await axios.put(`/products/${this.product.id}`, this.product);
        this.$toast.success('Produit mis à jour avec succès');
        this.$router.push(`/products/${this.product.id}`);
      } catch (error) {
        if (error.response?.status === 422) {
          this.errors = error.response.data.errors;
        } else {
          this.$toast.error("Erreur lors de la mise à jour");
          console.error('Error:', error);
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
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  padding: 2rem;
  background: #f8fafc;
}

.form-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 600px;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header h2 {
  color: #1e293b;
  font-size: 1.5rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #6366f1;
}

.back-icon {
  width: 20px;
  height: 20px;
}

.form-group {
  position: relative;
  margin-bottom: 1.5rem;
}

/* Styles identiques à AddProduct.vue pour les inputs */
/* ... */

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  background: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #e2e8f0;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) {
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
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>