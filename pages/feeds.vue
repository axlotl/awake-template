<template>
	<div id="feed-container">
		<main-section theme="one-column">
			<template v-slot:default>
				<h2>rss json type: {{ typeof(rssList) }}</h2>
				<pre>
				{{ rssList.electric.feeds }}
				</pre>
				<h1>feed list</h1>
				<p>count: {{ count }}</p>
				<ul>
					<li v-for="(rssItem) in rssItemJSON" :key="rssItem.title" v-html="rssItem.content">
						<!-- <template v-if='typeof(rssItem) === "string"'>
						<p>string? {{ rssItem }}</p>
					</template>
					<p>type: {{ typeof(rssItem) }}</p>
					<p class="item">item: {{ rssItem }}</p> -->
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
			
			console.log(rssList)
			let rssURLList = [];
			for( let k in rssList){
				
				rssList[k].feeds.forEach(url =>{
					console.log('url', url);
					
					
					(async () => {
						
						
						let feed = await parser.parseURL(CORS_PROXY + url);
						console.log('feed',feed);
						if(!feed){
							return;
						}
						this.rssItemJSON = feed.items;
							feed.items.forEach(item => {
								this.count++;
								
							});
					})();
				});
				//console.log(rssURLList)

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