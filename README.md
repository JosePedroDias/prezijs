PreziJS is a [prezi](http://prezi.com/)-like script that tries to mimic the prezi concept (huge scene, zooms in for slides) in HTML5.

It makes use of [zoomooz](http://janne.aukia.com/zoomooz/) for zooming.

Check out the HTML files at the root dir - these are example presentations.

You must put all your relevant content inside 2 divs (.zoomViewport and .zoomContainer).

Make each reference element for slide stops have a meaningful id name.

Call the prezijs function specifying the elements order and layout.
    
    prezijs({
        slides: [
            'overview',
            'title',
            's1', 's2', 's3', 's4',
        ],
        layout: {
            overview: {pos:[0.5, 0.5]},
            title:    {pos:[0.5, 0.1],  center:[0.5, 0]},
            s1:       {pos:[0.33, 0.33]},
            s2:       {pos:[0.66, 0.33]},
            s3:       {pos:[0.33, 0.66]},
            s4:       {pos:[0.66, 0.66]}
        },
        time: 10
    });

The `position` and `center` attributes are between 0 and 1 (ratio of stage element).
By default the element anchor is centered in [0.5, 0.5], (centered both horizontally and vertically).
To change the zooming ratio relative to the element, set the `data-targetsize` attribute to the element.

To navigate, use the left/top right/bottom direction to move respectively to the previous/next point of interest.

You can use the CSS classes `.visited` and `.current` to make different looks for zoomTargets.
For example, make zoomTargets use CSS transitions...
