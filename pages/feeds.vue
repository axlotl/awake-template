<template>
	<div id="feed-container">
		<h1>feed list</h1>
		<p>count: {{count}}</p>
		<ul>
			<li v-for="(rssItem) in rssItemJSON" :key="rssItem.title" v-html="rssItem.content">
				<!-- <template v-if='typeof(rssItem) === "string"'>
					<p>string? {{ rssItem }}</p>
				</template>
				<p>type: {{ typeof(rssItem) }}</p>
				<p class="item">item: {{ rssItem }}</p> -->
				
			</li>
		</ul>
		<h2>json block</h2>		
		<pre>
			{{ rssItemJSON }}
		</pre>
	</div>
</template>
<script>
/* eslint-disable */
	export default {
		data() {

			return {
				rssItemJSON: []
			
			}
		},
		created() {
			this.readRSS();
		},
		methods: {
			readRSS(){
				const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
				const Parser = require("rss-parser");
				let parser = new Parser();
				this.count = 0;
				(async () => {
					let feed = await parser.parseURL(CORS_PROXY + "https://electrek.co/feed/");
					this.rssItemJSON = feed.items;
					feed.items.forEach(item => {
						this.count++;
						console.log(item.title);

					});
				})();			
			}
		}
	}
	
	
</script>
<style>
	#feed-container {
		margin-top:  100px;
	}
	.item {
		margin: 1rem;
		font-size:  8px;
		color:  #000;
	}
</style>

