import { createRouter, createWebHistory } from 'vue-router'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Home from './components/Home.vue' // Add this import

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: true } // Protected route
    },
    {
        path: '/login',
        name: 'Login', // Make sure this matches exactly
        component: Login,
        meta: { public: true }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: { public: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token')
    const isPublicRoute = to.meta.public

    if (!isPublicRoute && !isAuthenticated) {
        return next({ name: 'Login' })
    }

    if (isPublicRoute && isAuthenticated && ['Login', 'Register'].includes(to.name)) {
        return next({ name: 'Home' })
    }

    next()
})

export default router
