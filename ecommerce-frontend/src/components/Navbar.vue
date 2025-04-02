<template>
  <nav class="navbar">
    <div class="navbar-content">
      <router-link to="/" class="logo" >
        <span>MonApp</span>
      </router-link>

      <div class="nav-links">
        <router-link
            to="/login"
            class="nav-link"
            v-if="!isLoggedIn">
          Connexion
        </router-link>

        <router-link
            to="/register"
            class="nav-link register"
            v-if="!isLoggedIn">
          Inscription
        </router-link>

        <a
            href="#"
            @click.prevent="logout"
            class="nav-link logout"
            v-if="isLoggedIn">
          Déconnexion
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['isLoggedIn'])
  },
  methods: {
    ...mapActions(['logout'])
  }
}
</script>

<style scoped>
/* Variables couleurs */
:root {
  --primary: #4f46e5;  /* Violet plus doux */
  --text: #1e293b;     /* Gris foncé */
  --text-light: #64748b;
  --bg: #ffffff;       /* Fond blanc */
  --border: #e2e8f0;   /* Bordure légère */
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: white;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;


}

.navbar-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: var(--text-light);
  text-decoration: none;
  font-weight: 500;
  padding: 8px 0;
  position: relative;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--primary);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary);
  transition: width 0.2s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.register {
  color: var(--primary);
}

.logout {
  color: var(--text);
}

/* Version mobile */
@media (max-width: 768px) {
  .navbar-content {
    padding: 0 15px;
  }

  .nav-links {
    gap: 15px;
  }
}
</style>