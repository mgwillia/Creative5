<template>
  <div class="column">
    <img src="/static/images/mighty_heroes.jpg"/>
    <img src="/static/images/magic-wand-hi.png"/>
    <img src="/static/images/sword.png"/>
    <h1>Create and browse your favorite heroes!</h1>
    <h2>For the mightiest of the mighty.</h2>
    <h2>The most heroic of the heroes.</h2>
    <form v-on:submit.prevent="register">
      <p>1. Choose a user name (this is how you will be known by others on Red Bird).</p>
      <input class="narrow" v-model="username" placeholder="User Name">
      <p>2. Create an account.</p>
      <input class="wide" v-model="name" placeholder="First and Last Name"><br/>
      <input class="narrow" v-model="email" placeholder="Email Address">
      <input class="narrow" type="password" v-model="password" placeholder="Password">
      <button class="alternate" type="submit">Register</button>
    </form>
    <p class="error">{{registerError}}</p>
  </div>
</template>

<script>
 export default {
   name: 'WelcomePage',
   data () {
     return {
       username: '',
       email: '',
       password: '',
       name: '',
     }
   },
   computed: {
     registerError: function() {
       return this.$store.getters.registerError;
     },
   },
   methods: {
     register: function() {
       this.$store.dispatch('register',{
	 username: this.username,
         email: this.email,
         password: this.password,
	 name: this.name,
       });
     }
   }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 img {
     width: 100px;
 }

 h1 {
     margin-bottom: 0px;
 }
 h2 {
     margin-top: 5px;
     margin-bottom: 0px;
     font-size: 1.2em;
     font-weight: normal;
 }
form {
     margin-top: 50px;
}
 .column {
     width: 960px;
     height: 600px;
     margin: auto;
     position: absolute;
     top: 0;
     right: 0;
     bottom: 0;
     left: 0;
     text-align: center;
 }
 .narrow {
     width: 170px;
 }
 .wide {
     width: 370px;
 }
</style>
