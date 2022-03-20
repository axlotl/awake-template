const fs = require('fs');
const process = require('process');
const axios = require('axios');
const Parser = require('rss-parser');
const CWD = process.cwd();
let parser = new Parser({
		customFields: {
			item: [
				['media:content', 'media:thumbnail']
			]
		}
	});
let url = "https://nordot.app/-/feed/posts/rss?source_id=877587091591004160&curation_url=true";
let count = 0;
(async () => {
	try {
		console.log('inside async, fetching');
		
		let feed = await parser.parseURL(url);
		//console.log('feed',feed);
		if(!feed){
			return;
		}
		
		fs.writeFile('output.json', JSON.stringify( feed ), function(e){
			if(e){
				return console.log('error: ', e);
			}
			console.log('written');
		});
		
		feed.items.forEach(item => {
			//console.log(item);
			//this.feedItems.push(item);

			writeMarkdown(item);
			this.count++;		
		});	
	} catch(e) {
		console.log('e: ', e);
	}
	
})();


function retrieveImage(url, filename){

	const extension = url.match(/\.(jpg|webp|gif|png|jpeg)$/gm);
	const imagename = filename + extension;
	
	//const path = '/uploads/rss-images/' + imagename;
	const path = '/images/' + imagename;
	console.log('image: ', path);

	axios({ 
		url,
		method : 'GET',
		responseType : 'stream' 
	})
	.then(function (response) {
		//response.data.pipe( fs.createWriteStream(CWD + "../assets/" + path ) );
		try {
			response.data.pipe( fs.createWriteStream( path ) );	
		} catch( err ){
			console.log( 'error: ', err );
		}
		
	});

	return path;
}

function writeMarkdown(itemObj){

	let filename = itemObj.title.replace(/\s/g, '_').replace(/:|,|\'/,'').substr(0,20);

	//grab a local copy of the item's image
	let img = retrieveImage(itemObj["media:thumbnail"].$.url, filename);

	let markdown = "---\n"
	markdown += "title: " + itemObj.title + "\n";

	markdown += itemObj.subtitle ? "subtitle: " + itemObj + "\n" : "";
	markdown += "category: \n";
	markdown += "author: " + itemObj.creator + "\n";
	markdown += "date: " + itemObj.pubDate + "\n";
	markdown += "featureImage: " + img + "\n"
	markdown += "---\n\n\n";
	markdown += "## Synopsis...\n\n\n";
	markdown += itemObj.contentSnippet + "\n\n\n";
	markdown += "## And more...\n\n\n";
	markdown += itemObj.content + "\n\n\n";
	markdown += "## get the full story\n\n\n";
	markdown += "[Full Story](" + itemObj.guid + ")\n\n\n";

	//console.log(markdown);
	//let target = CWD + '/../content/posts/_' + filename + ".md";
	let target = CWD + '/markdown/' + filename + ".md";
	fs.writeFile( target, markdown, function(e){
			if(e){
				return console.log('error: ', e);
			}
			
		});
}