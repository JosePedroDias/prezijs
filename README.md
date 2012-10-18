prezijs is a [prezi](http://prezi.com/)-like script that tries to mimic the prezi concept (huge scene, zooms in for slides) in HTML5.

It makes use of [zoomooz](http://janne.aukia.com/zoomooz/) for zooming.

index.html is a demo presentation (in fact, its the stage-core presentation).

You must put all your relevant content inside 2 divs (.zoomViewport and .zoomContainer).

Make each reference element for slide stops have a meaningful id name.

Call the prezijs function specifying the elements order and layout.
	
	javascript
	$(window).load(function() {
	    prezijs({
	        slides: [
	            'overview',
	            'title',
	            'what_is',
	            'sm_rt', 'sm_tb',
	            'api',
	            'api1', 'api2', 'api3', 'api4', 'api5', 
	            'future'
	        ],
	        layout: [
	            {id:'overview', pos:[0.5, 0.5]},
	            {id:'title',    pos:[0.1, 0.1], center:[0, 0]},
	            {id:'what_is',  pos:[0.3, 0.1], center:[0, 0]},
	            {id:'sm_rt',    pos:[0.1, 0.35], center:[0, 0]},
	            {id:'sm_tb',    pos:[0.3, 0.35], center:[0, 0]},
	            {id:'api',      pos:[0.1,      0.65], center:[0, 0]},
	            {id:'api1',     pos:[0.2-0.03, 0.65], center:[0, 0]},
	            {id:'api2',     pos:[0.3+0.00, 0.65], center:[0, 0]},
	            {id:'api3',     pos:[0.4+0.05, 0.65], center:[0, 0]},
	            {id:'api4',     pos:[0.5+0.05, 0.65], center:[0, 0]},
	            {id:'api5',     pos:[0.6+0.11, 0.65], center:[0, 0]},
	            {id:'future',   pos:[0.1, 0.8], center:[0, 0]}
	        ]
	    });
	});

the `position` and `center` attributes are between 0 and 1 (ratio of stage element).
By default the element anchor is centered in [0.5, 0.5], (centered both horizontally and vertically).
To change the zooming ratio relative to the element, set the `data-targetsize` attribute to the element.

To navigate, use the left/top right/bottom direction to move respectively to the previous/next point of interest.
