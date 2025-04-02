<template>
  <div class="form-container">
    <form @submit.prevent = "login" class="login-form">
      <input type="email" v-model="email"  placeholder="Email" required/>
      <input type="password" v-model="password" placeholder="Password" required/>
      <button type="submit">Login</button>
    </form>
  </div>
</template>


<script>
import axios from '@/axios' ;
export default {
  data() {
    return {
      email:'',
      password:'',
    };
  },

  methods: {
    async login() {
      try {
        const reponse = await axios.post('/login', {email: this.email, password: this.password});
        if (reponse.data.token) {
          localStorage.setItem('token', reponse.data.token);
        }
        this.$store.commit('SET_LOGIN');
        this.$router.push('/');
      }
      catch (error) {
        console.error("An error occurred: " + error);
      }



    }
  }
}
</script>