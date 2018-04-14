<template>
  <div class="feed">
    <div>
      <form v-on:submit.prevent="createHero" class="heroForm">
	<textarea v-model="textName" placeholder=""/><br/>
	<textarea v-model="textDescription" placeholder=""/><br/>
        <select v-model="heroClassSelect" placeholder="">
          <option value="ranger">Ranger</option>
	  <option value="mage">Mage</option>
  	  <option value="brawler">Brawler</option>
	  <option value="paladin">Paladin</option>
	  <option value="cleric">Cleric</option>
	</select><br/>
	<div class="buttonWrap">
	  <button class="primary" type="submit">Create Hero</button>
	</div>
      </form>
    </div>
    <feed-list v-bind:feed="feed" />
  </div>
</template>

<script>
 import FeedList from './FeedList';
 export default {
   name: 'UserFeed',
   components: { FeedList },
   data () {
     return {
       textName: '',
       textDescription: '',
       heroClassSelect: '',
     }
   },
   computed: {
     feed: function() {
       return this.$store.getters.feed;
     },
   },
   created: function() {
     this.$store.dispatch('getFeed');
   },
   methods: {
     createHero: function() {
       var power;
       var aPoints;
       var dPoints;
       var mPoints;
       if (this.heroClassSelect === 'ranger') {
         power = 'Bullseye';
	 aPoints = 10;
	 dPoints = 0;
	 mPoints = 0;
       }
       if (this.heroClassSelect === 'mage') {
         power = 'Fireball';
	 aPoints = 0;
	 dPoints = 0;
	 mPoints = 10;
       }
       if (this.heroClassSelect === 'brawler') {
         power = 'Superpunch';
	 aPoints = 5;
         dPoints = 5;
	 mPoints = 0;
       }
       if (this.heroClassSelect === 'paladin') {
         power = 'Divinity';
	 aPoints = 5;
	 dPoints = 0;
	 mPoints = 5;
       }
       if (this.heroClassSelect === 'cleric') {
         power = 'Heal';
	 aPoints = 0;
	 dPoints = 5;
	 mPoints = 5;
       }

       this.$store.dispatch('addHero',{
         heroName: this.textName,
         heroDescription: this.textDescription,
	 heroClass: this.heroClassSelect,
	 specialPower: power,
	 attackPoints: aPoints,
	 defensePoints: dPoints,
	 magicPoints: mPoints,
       }).then(tweet => {
	 this.textName = "";
         this.textDescription = "";
	 this.heroClassSelect = "";
       });
     },
   }
 }
</script>

<style scoped>
 .feed {
     width: 600px;
 }
 .heroForm {
     background: #eee;
     padding: 10px;
     margin-bottom: 10px;
 }
 .buttonWrap {
     width: 100%;
     display: flex;
 }
 button {
     margin-left: auto;
     height: 2em;
     font-size: 0.9em;
 }
 textarea {
     width: 100%;
     height: 5em;
     padding: 2px;
     margin-bottom: 5px;
     resize: none;
     box-sizing: border-box;
 }
</style>
