import { createRouter, createWebHistory } from 'vue-router'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import ProductList from "@/components/ProductList.vue";


const routes = [
    {
        path: '/',
        name: 'ProductList',
        component: ProductList,
        meta: { requiresAuth: true } // Protected route
    },
    {
        path: '/products',
        name: 'Products',
        component: () => import('./components/ProductList.vue'),
        meta: { requiresAuth: true }
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
    } ,{
        path: '/products/add',
        name: 'AddProduct',
        component: () => import('./components/AddProduct.vue'),
        meta: { requiresAuth: true }
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
        return next({ name: 'ProductList' })
    }

    next()
})

export default router
