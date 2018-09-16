// Your code goes here

// ----- PLEASE NOTE -----
// Although your code is bundled, we do not otherwise transform or transpile your
// user code. ES6+ JavaScript is incompatible with the in-vehicle platform and
// will need to be transpiled into ES5!
// -----------------------

// You can require definitions from other JavaScript and JSON files.
// Your code will be bundled together using WebPack during DFF compilation.
// Load each term into built-in flow context for Terms & Conditions.
ngi.cards("_ngi:terms", []);

// Define the Splash screen.
ngi.cards('_ngi:init.splash', {
  icon: './images/splash.png'
});

ngi.cards('menu.mainMenu', [
    {
      $key: 'play',
      title: 'Recommend me podcasts!',
    },
	{
      $key: 'addLikes',
      title: 'Add favorites'
    }
  ]);

ngi.flow('menu', {
    entry: 'mainMenu' // The first view the task will load.
  })
  .addRoute('mainMenu', {
    layout: 'VerticalList',
	beforeEnter: function() {
		if (!ngi.state.has('id')) {
			console.log("No user id, need to get one!");
			ngi.state.set('id', 'cjen1');
		}
	},
    listActions: [{
        default: true,
        action: function(index) {
          var card = this.content[index];
          var key = card.$key;
          this.exit(key);
        }
      }],
      links: {
        exit: {
          addLikes: 'addLikes',
          play: 'play'
        }
      }
  });
  
ngi.flow('play', {
		entry: 'recommendations'
	})
	.addRoute('recommendations', {
		title: 'Podcasts recommended for you',
		layout: 'VerticalList',
		links: { back: 'menu', exit : { menu : 'menu' }, detail: 'player' }
	})
	.addRoute('player', {
		layout: 'Media'
	});
	
ngi.flow('addLikes', {
		entry: 'addLikesForm'
	})
	.addRoute('addLikesForm', {
		layout: 'Form',
		links: { back: 'menu', exit : { menu : 'menu' }, neighbors : [ 'confirmSearchResult' ] }
	})
	.addRoute('confirmSearchResult', {
		layout: 'Detail',
		actions: [{
			label: 'Yes',
			action: function() {
				var podcast = ngi.state.get('candidateLikedPodcast')
				ngi.http({
				  url: 'http://168.62.163.47:8080/like',
				  queryParams : {
					  'title' : podcast.collectionName,
					  'user_id' : ngi.state.get('id')
				  },
				  verb: 'GET'
				});
				console.log("Liked podcast", podcast);
				this.exit('menu');
			}			
		},
		{
			label: 'No',
			action: function() {
				this.route('addLikesForm');
			}
		}],
		links: { back: 'addLikesForm', exit : { menu : 'menu' }, neighbors : ['addLikesForm']}
	});
	
ngi.form("addLikes.addLikesForm", {
  onSubmit: function(values) {
    console.log("FORM FINISHED", values);
    ngi.state.set('likeFormResponse', values);
    this.route('confirmSearchResult');
  },
  fields: [
    {
      type: "input",
      name: "likedPodcast",
      label: "Enter name of podcast you liked"
    },
  ]
});

	ngi.cards('addLikes.confirmSearchResult', { 
	remote: {
      url: 'https://itunes.apple.com/search',
      prepare: function(config) {
		config.queryParams = {
		  'media': 'podcast',
		  'limit': '1',
          'term': ngi.state.get('likeFormResponse').likedPodcast
        };
        return config;
      },
	  transform: function(payload, headers) {
			console.log(payload);
			ngi.state.set('candidateLikedPodcast', payload.results[0]);
		return {
			title: 'Confirm liked podcast',
			body: 'Do you mean ' + payload.results[0].collectionName + ' by ' + payload.results[0].artistName + '?',
		}
	  },
	  lifetime: 'route'
    }
 } );

ngi.cards('play.recommendations', {
	remote: {
      url: 'http://168.62.163.47:8080/rec',
      lifetime: 'route',
      prepare: function(config) {
        config.queryParams = {
          'user_id': ngi.state.get('id')
        };
        return config;
      },
	  transform: function(payload, headers) {
		  if (payload.length > 0) {
			 return payload.map(function(item) {
				 return {
					title: item.title,
					//images: [item.picture],
					media: {
					  source: item['rss-latest'],
					  //artist: item.artist,
					  title: item.title,
					  //album: item.podcastName,
					  //length: item.length
					}
				 }
			 });
		  }
		  else {
			return [{
				title: 'You have not liked any podcasts',
				body: 'Go to the menu and like some podcasts in order to get recommendations!'
			}]
		  }
		  /*return {
			  title : payload
		  }*/
	}}}
	  /*[{
		  title: 'Hello Internet',
		  images: ['http://static1.squarespace.com/static/52d66949e4b0a8cec3bcdd46/t/52ebf67fe4b0f4af2a4502d8/1391195777839/1500w/Hello+Internet.003.png'],
		  media: {
			  source: 'http://traffic.libsyn.com/hellointernet/109.mp3',
			  artist: 'CGP Grey & Brady Haran',
			  title: 'H.I. #109: Twitter War Room',
			  album: 'Hello Internet',
			  length: 7209000
		  }
	  }]*/
    
  );
 

// Specify your own entry flow, this will connect to Splash, Terms, and About.
ngi.init('menu');

