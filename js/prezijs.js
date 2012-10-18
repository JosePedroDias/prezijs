//$(window).load(function() {

window.prezijs = function(o) {

	'use strict';

	/*jshint browser:true, eqeqeq:true, undef:true, curly:true, laxbreak:true, forin:true, smarttabs:true */
	/*global $:false */
	
	var slides = o.slides,
		layout = o.layout;
		 
	var getCanvasDims = function() {
		var el = document.querySelector('.zoomContainer');
		return [
			el.offsetWidth,
			el.offsetHeight
		];
	};

	var getElementPos = function(id) {
		var el = document.getElementById(id);
		return [
			el.offsetLeft,
			el.offsetTop
		];
	};
		 
	var getElementDims = function(id) {
		var el = document.getElementById(id);
		return [
			el.offsetWidth,
			el.offsetHeight
		];
	};
		 
	var getElementCenter = function(id) {
		var d = getElementDims(id);
		var p = getElementPos(id);
		return [
			Math.round(d[0]/2 + p[0]),
			Math.round(d[1]/2 + p[1])
		];
	};



	var doLayout = function() {
		var styleEl = document.createElement('style');
		styleEl.setAttribute('type', 'text/css');
		document.body.appendChild(styleEl);
		
		var st = [];
		var wDims = getCanvasDims();
		var i, f, el, dims, center, I, val;
		
		for (i = 0, f = layout.length; i < f; ++i) {
			el = layout[i];
			st = st.concat(['#', el.id, ' {']);
			for (I = 0; I < 2; ++I) {
				val = el.pos[I];
				if (val <= 1) {
					center = el.center ? el.center : [0.5, 0.5];
					dims = getElementDims(el.id);
					val = Math.round( wDims[I]*val - dims[I] * center[I] );
				}
				st = st.concat([(I === 0 ? 'left' : 'top'), ':', val, 'px;']);
			}
			st.push('} ');

			if ('r' in el) {
				document.getElementById(el.id).style['-webkit-transform'] = 'rotate(' + el.r + 'deg)';
			}
		}
		styleEl.innerHTML = st.join('');
	};

	doLayout();


		
	window.addEventListener('resize', doLayout);

	var onKeyDown = function(ev) {
		switch(ev.keyCode) {
			case 37: case 38: // left up
				slides.unshift( slides.pop() );
				break;

			case 39: case 40: // right down
				slides.push( slides.shift() );
				break;

			default:
				return;
		}

		ev.stopPropagation();
		$('#' + slides[0]).zoomTo();
	};

	document.body.addEventListener('keydown', onKeyDown);

	onKeyDown({
		keyCode:			39,
		stopPropagation:	function() {}
	});

	onKeyDown({
		keyCode:			37,
		stopPropagation:	function() {}
	});

};
