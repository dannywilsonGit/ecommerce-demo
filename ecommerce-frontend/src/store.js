import { createStore } from "vuex"
import router from './router'
import axios from '@/axios'

export default createStore({
    state: {
        isLoggedIn: !!localStorage.getItem('token'),
        token: localStorage.getItem('token') || null
    },
    mutations: {
        SET_LOGIN(state, token) {
            state.isLoggedIn = true
            state.token = token
            localStorage.setItem('token', token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}` //Ajout Important
        },
        SET_LOGOUT(state) {
            state.isLoggedIn = false
            state.token = null
            localStorage.removeItem('token')
            delete axios.defaults.headers.common['Authorization'] //Nettoyage
        }
    },
    actions: {
        login({ commit }, token) {
            commit('SET_LOGIN', token)
            router.push({ name: 'ProductList' }) // Redirect to ProductList after login
        },
        logout({ commit }) {
            return new Promise((resolve) => {
                commit('SET_LOGOUT')
                delete axios.defaults.headers.common['Authorization'];
                localStorage.removeItem('token');
                router.push({ name: 'Login' })
                    .then(() => resolve())
                    .catch(err => {
                        console.error('Navigation error:', err)
                        // Fallback to window.location if router fails
                        window.location.href = '/login'
                        resolve()
                    })
            })
        }
    },
    getters: {
        isAuthenticated: state => !!state.token
    }
})


