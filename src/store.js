import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);

const getAuthHeader = () => {
  console.log(localStorage.getItem('token'));
  return { headers: {'Authorization': localStorage.getItem('token')}};
}

export default new Vuex.Store({
  state: {
    user: {},
    token: '',
    loginError: '',
    registerError: '',
    feed: [],
    userView: [],
    feedView: [],
  },
  getters: {
    user: state => state.user,
    getToken: state => state.token,
    loggedIn: state => {
      console.log(state.token);
      if (state.token === '') {
	return false;
      }
      return true;
    },
    loginError: state => state.loginError,
    registerError: state => state.registerError,
    feed: state => state.feed,
    feedView: state => state.feedView,
    userView: state => state.userView,
  },
  mutations: {
    setUser (state, user) {
      state.user = user;
    },
    setToken (state, token) {
      state.token = token;
      console.log('Setter:',token);
      if (token === '') {
        localStorage.removeItem('token');
      }
      else {
	localStorage.setItem('token', token);
      }
    },
    setLoginError (state, message) {
      state.loginError = message;
    },
    setRegisterError (state, message) {
      state.registerError = message;
    },
    setFeed (state, feed) {
      state.feed = feed;
    },
    setUserView (state, user) {
      state.userView = user;
    },
    setFeedView (state, feed) {
      state.feedView = feed;
    },
  },
  actions: {
    // Registration, Login //
    register(context,user) {
      axios.post("/api/users",user).then(response => {
	context.commit('setUser', response.data.user);
	context.commit('setToken',response.data.token);
	context.commit('setRegisterError',"");
	context.commit('setLoginError',"");
      }).catch(error => {
	context.commit('setUser',{});
	context.commit('setToken','');
	context.commit('setLoginError',"");
	if (error.response) {
	  if (error.response.status === 403)
	    context.commit('setRegisterError',"That email address already has an account.");
	  else if (error.response.status === 409)
	    context.commit('setRegisterError',"That user name is already taken.");
	  return;
	}
	context.commit('setRegisterError',"Sorry, your request failed. We will look into it.");
      });
    },
    login(context,user) {
      axios.post("/api/login",user).then(response => {
	context.commit('setUser', response.data.user);
	context.commit('setToken',response.data.token);
	context.commit('setRegisterError',"");
	context.commit('setLoginError',"");
      }).catch(error => {
	context.commit('setUser',{});
        context.commit('setToken','');
	context.commit('setRegisterError',"");
	if (error.response) {
	  if (error.response.status === 403 || error.response.status === 400)
	    context.commit('setLoginError',"Invalid login.");
	  context.commit('setRegisterError',"");
	  return;
	}
	context.commit('setLoginError',"Sorry, your request failed. We will look into it.");
      });
    },
    logout(context,user) {
      context.commit('setUser', {});
      context.commit('setToken','');
    },
    getFeed(context) {
      axios.get("/api/users/" + context.state.user.id + "/heroes").then(response => {
	context.commit('setFeed',response.data.heroes);
      }).catch(err => {
	console.log("getFeed failed:",err);
      });
    },
    addHero(context,heroName,heroDescription, heroClass, specialPower, attackPoints, defensePoints, magicPoints) {
      axios.post("/api/users/" + context.state.user.id + "/heroes",{heroName:heroName,heroDescription:heroDescription,heroClass:heroClass,specialPower:specialPower, attackPoints:attackPoints, defensePoints:defensePoints, magicPoints:magicPoints},getAuthHeader()).then(response => {
	return context.dispatch('getFeed');
      }).catch(err => {
	console.log("addHero failed:",err);
      });
    },
    doSearch(context,keywords) {
      axios.get("/api/heroes/search?keywords=" + keywords).then(response => {
	context.commit('setFeed',response.data.heroes);
      }).catch(err => {
	console.log("doSearch failed:",err);
      });
    },
    getUser(context,user) {
      return axios.get("/api/users/" + user.id).then(response => {
	context.commit('setUserView',response.data.user);
      }).catch(err => {
        console.log("getUser failed:",err);
      });
    },
    getUserHeroes(context,user) {
      return axios.get("/api/users/" + user.id + "/heroes").then(response => {
	context.commit('setFeedView',response.data.heroes);
      }).catch(err => {
        console.log("getUserHeroes failed:",err);
      });
    },
    deleteHero(context,hero) {
      axios.delete("/api/users/" + context.state.user.id + "/delete",hero.hero.created,getAuthHeader()).then(response => { context.dispatch('getUserHeroes');
      }).catch(err => {
        console.log("deleteHero failed:",err);
      });
    },
    initialize(context) {
      let token = localStorage.getItem('token');
      console.log(token);
      if(token) {
	axios.get("/api/me",getAuthHeader()).then(response => {
	  context.commit('setToken',token);
	  context.commit('setUser',response.data.user);
	}).catch(err => {
	  localStorage.removeItem('token');
	  context.commit('setUser',{});
	  context.commit('setToken','');
	});
      }
    },
  }
});
