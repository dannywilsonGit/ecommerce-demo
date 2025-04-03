<template>
  <div class="product-list-container">
    <div class="header">
      <h2>Liste des Produits</h2>
      <router-link to="/products/add" class="add-btn">
        <svg class="plus-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
        </svg>
        Ajouter un produit
      </router-link>
    </div>

    <div class="filters">
      <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher un produit..."
          class="search-input"
      />
      <select v-model="sortBy" class="sort-select">
        <option value="name">Trier par nom</option>
        <option value="price">Trier par prix</option>
        <option value="created_at">Trier par date</option>
      </select>
      <select v-model="sortDirection" class="sort-direction">
        <option value="asc">Croissant</option>
        <option value="desc">Décroissant</option>
      </select>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>

    <div v-else>
      <div v-if="filteredProducts.length === 0" class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z" />
        </svg>
        <p>Aucun produit trouvé</p>
      </div>

      <div class="product-grid">
        <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-card"
            @click="$router.push(`/products/${product.id}`)"
        >
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-desc">{{ truncateDescription(product.description) }}</p>
            <div class="product-price">{{ formatPrice(product.price) }} €</div>
          </div>
          <div class="product-actions">
            <button
                class="edit-btn"
                @click.stop="$router.push(`/products/edit/${product.id}`)"
            >
              <svg class="edit-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
              </svg>
            </button>
            <button
                class="delete-btn"
                @click.stop="confirmDelete(product.id)"
            >
              <svg class="delete-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="pagination" v-if="filteredProducts.length > 0">
        <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="pagination-btn"
        >
          Précédent
        </button>
        <span>Page {{ currentPage }} sur {{ totalPages }}</span>
        <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="pagination-btn"
        >
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  data() {
    return {
      products: [],
      loading: true,
      searchQuery: '',
      sortBy: 'name',
      sortDirection: 'asc',
      currentPage: 1,
      itemsPerPage: 8
    }
  },
  computed: {
    filteredProducts() {
      let filtered = this.products.filter(product =>
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      filtered.sort((a, b) => {
        if (this.sortBy === 'price') {
          return this.sortDirection === 'asc'
              ? a.price - b.price
              : b.price - a.price;
        } else if (this.sortBy === 'created_at') {
          return this.sortDirection === 'asc'
              ? new Date(a.created_at) - new Date(b.created_at)
              : new Date(b.created_at) - new Date(a.created_at);
        } else {
          return this.sortDirection === 'asc'
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name);
        }
      });

      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return filtered.slice(start, end);
    },
    totalPages() {
      return Math.ceil(
          this.products.filter(product =>
              product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
              product.description.toLowerCase().includes(this.searchQuery.toLowerCase())
          ).length / this.itemsPerPage
      );
    }
  },
  methods: {
    async fetchProducts() {
      this.loading = true;
      try {
        // Vérifiez d'abord si le token existe
        if (!this.$store.state.token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('/products');
        this.products = response.data;
      } catch (error) {
        console.error('Fetch error:', error);

        if (error.response?.status === 401 || error.message.includes('token')) {
          await this.$store.dispatch('logout');
          this.$router.push('/login');
        }
      } finally {
        this.loading = false;
      }
    }
    ,
    truncateDescription(desc) {
      return desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
    },
    formatPrice(price) {
      return parseFloat(price).toFixed(2);
    },
    confirmDelete(id) {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        this.deleteProduct(id);
      }
    },
    async deleteProduct(id) {
      try {
        await axios.delete(`/products/${id}`);
        alert('Produit supprimé avec succès' );
        await this.fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);

        // Même adaptation pour les erreurs de suppression
        const errorMessage = error.response?.data?.message
            ? error.response.data.message
            : 'Erreur lors de la suppression';

        this.$toast.error(errorMessage);
      }
    },
  },
  mounted() {
    this.fetchProducts();
  }
}
</script>

<style scoped>
.product-list-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h2 {
  font-size: 1.8rem;
  color: #1e293b;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #6366f1;
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: #4f46e5;
  transform: translateY(-2px);
}

.plus-icon {
  width: 20px;
  height: 20px;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #6366f1;
  outline: none;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.sort-select, .sort-direction {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: #64748b;
}

.empty-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.product-info {
  margin-bottom: 1rem;
}

.product-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.product-desc {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.product-price {
  font-size: 1.1rem;
  font-weight: 600;
  color: #6366f1;
}

.product-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.edit-btn, .delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn:hover {
  background: rgba(99, 102, 241, 0.1);
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
}

.edit-icon {
  width: 18px;
  height: 18px;
  color: #6366f1;
}

.delete-icon {
  width: 18px;
  height: 18px;
  color: #ef4444;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  background: #f1f5f9;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #e2e8f0;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .filters {
    flex-direction: column;
  }

  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>