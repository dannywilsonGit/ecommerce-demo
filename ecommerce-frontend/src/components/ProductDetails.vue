<template>
  <div class="product-details-container">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>

    <div v-else class="product-card">
      <div class="header">
        <router-link to="/products" class="back-btn">
          <svg class="back-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
          </svg>
          Retour à la liste
        </router-link>

        <div class="actions">
          <router-link
              :to="'/products/edit/' + product.id"
              class="edit-btn"
          >
            <svg class="edit-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
            </svg>
            Modifier
          </router-link>
        </div>
      </div>

      <div class="product-content">
        <h1 class="product-name">{{ product.name }}</h1>
        <div class="product-price">{{ formatPrice(product.price) }} €</div>

        <div class="section">
          <h3>Description</h3>
          <p class="product-description">{{ product.description }}</p>
        </div>

        <div class="meta-info">
          <div class="meta-item">
            <svg class="meta-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
            </svg>
            <span>Créé le {{ formatDate(product.created_at) }}</span>
          </div>
          <div class="meta-item" v-if="product.updated_at !== product.created_at">
            <svg class="meta-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M16.18,7.76L15.12,8.82L12.96,6.66L12,7.62L14.06,9.68L12.96,10.76L11,8.82L9.96,9.86L11.68,11.58L9.1,14.16L7.64,12.7L6.58,13.76L9.17,16.34L16.18,9.34L16.18,7.76Z" />
            </svg>
            <span>Modifié le {{ formatDate(product.updated_at) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  data() {
    return {
      product: {},
      loading: true
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
        this.loading = false;
      }
    },
    formatPrice(price) {
      return parseFloat(price).toFixed(2);
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('fr-FR', options);
    }
  }
}
</script>

<style scoped>
.product-details-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(99, 102, 241, 0.2);
  border-radius: 50%;
  border-top-color: #6366f1;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.product-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
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

.actions {
  display: flex;
  gap: 1rem;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #6366f1;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.edit-btn:hover {
  background: #4f46e5;
}

.edit-icon {
  width: 18px;
  height: 18px;
}

.product-content {
  padding: 2rem;
}

.product-name {
  font-size: 2rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 600;
  color: #6366f1;
  margin-bottom: 2rem;
}

.section {
  margin-bottom: 2rem;
}

.section h3 {
  color: #475569;
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
}

.product-description {
  color: #475569;
  line-height: 1.6;
  white-space: pre-line;
}

.meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #f1f5f9;
  color: #64748b;
  font-size: 0.9rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-icon {
  width: 16px;
  height: 16px;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .actions {
    width: 100%;
    justify-content: flex-end;
  }

  .product-content {
    padding: 1.5rem;
  }

  .product-name {
    font-size: 1.5rem;
  }
}
</style>