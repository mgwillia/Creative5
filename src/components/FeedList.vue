<template>
  <div>
    <div v-for="item in feed" class="item">
      <div class="hero">
        <div class="flexcontainer">
          <div>
            <div v-if="item.heroClass==='brawler'">
	      <img src="static/images/ninja.jpeg">
	    </div>
            <div v-if="item.heroClass==='mage'">
	      <img src="static/images/magic-wand-hi.png">
	    </div>
	    <div v-if="item.heroClass==='paladin'">
	      <img src="static/images/sword.png">
	    </div>
	    <div v-if="item.heroClass==='cleric'">
	      <img src="static/images/mighty_heroes.jpg">
	    </div>
	    <div v-if="item.heroClass==='ranger'">
	      <img src="static/images/bow.jpg">
	    </div>
	  </div>
          <div class="stats">
	    <p> Attack: {{item.attackPoints}}</p>
            <p> Defense: {{item.defensePoints}}</p>
            <p> Magic: {{item.magicPoints}}</p>
          </div>
	  <div class="buttonHolder">
	    <button v-on:click="deleteItem(item)" class="alternate">Delete</button>
	  </div>
	</div>
	<p>{{item.heroName}}: {{item.heroDescription}}</p>
        <p>As a {{item.heroClass}}, has the unique special ability: {{item.specialPower}}!</p>
      </div>
    </div>
    <div class="footer">
      <a href="https://github.com/mgwillia/Creative5">GitHub</a>
    </div>
  </div>
</template>

<script>
 import moment from 'moment';
 export default {
   name: 'FeedList',
   props: ['feed'],
   filters: {
     since: function(datetime) {
       moment.locale('en', {
	 relativeTime: {
	   future: 'in %s',
	   past: '%s',
	   s:  'seconds',
	   ss: '%ss',
	   m:  '1m',
	   mm: '%dm',
	   h:  'h',
	   hh: '%dh',
	   d:  'd',
	   dd: '%dd',
	   M:  ' month',
	   MM: '%dM',
	   y:  'a year',
	   yy: '%dY'
	 }
       });
       return moment(datetime).fromNow();
     },
   },
   methods: {
     deleteItem: function(item) {
       console.log(item);
       console.log(item.heroDescription);
       this.$store.dispatch('deleteHero',{
         hero: item
       });
     },
   },
 }
</script>

<style scoped>
 a {
     text-decoration: none;
     color: black;
 }
 .footer {
     margin-top: 20px;
     text-align: center; 
 }
 .item {
     border-bottom: 1px solid #ddd;
     padding: 10px;
 }
 .hero {
     margin-top: 0px;
 }
 .idline {
     margin-bottom: 0px;
 }
 .user {
     font-weight: bold;
     margin-right: 10px;
 }
 .handle {
     margin-right: 10px;
     color: #666;
 }
 .time {
     float: right;
     color: #666;
 }

 .delete {
     margin-left: auto;
 }
 img {
     width: 100px;
 }
 .stats {
     margin-left: 20px;
 }
 .flexcontainer {
     display: flex;
     flex-direction: row;
 }
 .buttonHolder {
     margin-right: 0px;
     margin-left: auto;
 }
</style>
