<template>
	<div id="feed-container">
		<main-section theme="one-column">
			<template v-slot:default>
				<h2>rssList type: {{ typeof(rssList) }}</h2>
				<pre>
				
				</pre>
				<h1>feed list</h1>
				<p>count: {{ count }}</p>
				<!-- <p>displayed: {{ displayedCount }}</p> -->
				<ul>
					<!-- <li v-for="(rssItem) in feedItems" :key="rssItem.title" v-bind="rssItem" v-html="rssItem.content"> -->
					<li v-for="(rssItem) in feedItems" :key="rssItem.title" v-bind="rssItem" >
						<p>RSS ITEM</p>
						<pre> {{ rssItem }}</pre>
						<div v-html="rssItem.content"></div>
					</li>
				</ul>
			</template>
		</main-section>
	</div>
</template>
<script>
/* eslint-disable */
import { mapState } from 'vuex';
import rssList from '~/assets/data/rss-feeds.json';
export default {
	data() {

		return {
			rssList,
			//rssURLList,
			feedItems: [],
			rssItemJSON: []

		}
	},
	created() {
		this.readRSS();
	},
	computed: {
		...mapState(['title', 'subtitle', 'featureImage'])
	},
	methods: {
		readRSS() {
			const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
			const Parser = require("rss-parser");
			let parser = new Parser();
			this.count = 0;
			//this.diplsayedCount = 0;
			console.log(rssList)
			//let rssURLList = [];

			for( let k in rssList ){
				
				rssList[k].feeds.forEach( url => {
					console.log('url', url);
					
					//rssURLList.push(url);
					(async () => {
						try {
							console.log('inside async, fetching');
							
							let feed = await parser.parseURL(CORS_PROXY + url);
							console.log('feed',feed);
							if(!feed){
								return;
							}
							
							
							
							feed.items.forEach(item => {
								this.rssItemJSON.push( item );
								this.feedItems.push(item);
								this.count++;		
							});	
						} catch(e) {
							console.log('e: ', e);
						}
						
					})();
					//console.log('rssURLList ', rssURLList );
				});
			}
		}
	}
}
</script>
<style>
#feed-container {
		margin-top: 100px;
}

.item {
		margin: 1rem;
		font-size: 8px;
		color: #000;
}
</style>