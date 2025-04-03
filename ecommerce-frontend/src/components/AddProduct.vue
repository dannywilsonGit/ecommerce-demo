<template>
  <div class="add-product-container">
    <div class="form-card">
      <h2 class="form-title">Ajouter un produit</h2>

      <form @submit.prevent="submitForm" class="product-form">
        <!-- Nom du Produit -->
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

        <!-- Description -->
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

        <!-- Prix -->
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

        <button type="submit" class="submit-btn" :disabled="loading">
          <span v-if="!loading">Ajouter le produit</span>
          <div v-else class="spinner"></div>
        </button>
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
        name: '',
        description: '',
        price: 0
      },
      errors: {},
      loading: false
    }
  },
  methods: {
    async submitForm() {
      this.loading = true;
      this.errors = {};

      try {
        const response = await axios.post('/products', this.product);

        this.$toast.success('Produit ajouté avec succès');
        this.resetForm();
        this.$router.push('/products'); // Redirige vers la liste des produits

      } catch (error) {
        if (error.response?.status === 422) {
          this.errors = error.response.data.errors;
        } else {
          this.$toast.error("Erreur lors de l'ajout du produit");
          console.error('Error:', error);
        }
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.product = {
        name: '',
        description: '',
        price: 0
      };
    }
  }
}
</script>

<style scoped>
.add-product-container {
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