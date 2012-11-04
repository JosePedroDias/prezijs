//$(window).load(function() {

window.prezijs = function(o) {

    'use strict';

    /*jshint browser:true, eqeqeq:true, undef:true, curly:true, laxbreak:true, forin:false, smarttabs:true */
    /*global $:false, console:false */


    o.current = 0;
    o.length = o.slides.length;


    var time = (o.time|| 30) * 60; // presentation time, in minutes
    var debug = o.debug; // if true, shows: idx, allows dragging and space to show layout in console

    
    
    var slides = o.slides,
        layout = o.layout;
         
    var getCanvasDims = function() {
        var el = document.querySelector('.zoomContainer');
        if (!el) { throw 'Could not find .zoomContainer!'; }
        return [
            el.offsetWidth,
            el.offsetHeight
        ];
    };

    var getElementPos = function(el) {
        return [
            el.offsetLeft,
            el.offsetTop
        ];
    };
         
    var getElementDims = function(el) {
        return [
            el.offsetWidth,
            el.offsetHeight
        ];
    };

    var trunc = function(n, o) {
        return Number(n.toFixed(o));
    };

    var forLayEls = function(cb) {
        var el, i = 0;
        for (var id in o.layout) {
            el = document.getElementById(id);
            cb(el, i++);
        }
    };

    var pad0 = function(n) {
        return (n < 10 ? '0' + n : n);
    };

    var formatTime = function() {
        var m = ~~(time / 60);
        var s = time - m * 60;
        return [
            pad0(m),
            pad0(s)
        ].join(':');
    };


    var tp;
    var dragEl;
    var onDown = function(ev) {
        var p = [ev.clientX, ev.clientY];
        var el = ev.target;
        while (!el.classList.contains('zoomTarget')) {
            el = el.parentNode;
        }
        dragEl = el;
        tp = p;
    };

    var onMove = function(ev) {
        if (!tp) { return; }
        var p = [ev.clientX, ev.clientY];
        var pos = getElementPos(dragEl);
        var st = dragEl.style;
        st.left = (pos[0] + p[0] - tp[0]) + 'px';
        st.top  = (pos[1] + p[1] - tp[1]) + 'px';
        tp = p;
    };

    var onUp = function(ev) {
        tp = undefined;
    };

    var doLayout = function() {
        var styleEl = document.createElement('style');
        styleEl.setAttribute('type', 'text/css');
        document.head.appendChild(styleEl);
        
        var st = [];
        var wDims = getCanvasDims();
        var lay, el, dims, center, I, val;

        var i = 0;
        
        for (var id in layout) {
            lay = layout[id];
            el = document.getElementById(id);
            if (!el) {
                throw 'Could not find ' + id + '!';
            }

            el.classList.add('zoomTarget');
            el.classList.add('zoomNotClickable');

            if ('pos' in lay) {
                st = st.concat(['#', id, ' {']);
                for (I = 0; I < 2; ++I) {
                    val = lay.pos[I];
                    if (val <= 1) {
                        center = lay.center ? lay.center : [0.5, 0.5];
                        dims = getElementDims(el);
                        val = Math.round( wDims[I]*val - dims[I] * center[I] );
                    }
                    st = st.concat([(I === 0 ? 'left' : 'top'), ':', val, 'px;']);
                }
                st.push('} ');
            }

            if ('r' in lay) {
                el.style['-webkit-transform'] = 'rotate(' + lay.r + 'deg)';
            }

            if (debug) {
                if (id !== 'overview') { el.addEventListener('mousedown', onDown); }

                var idxEl = document.createElement('span');
                idxEl.className = 'idx';
                idxEl.innerHTML = '#' + (i + 1);
                el.appendChild(idxEl);
            }
            ++i;
        }

        styleEl.innerHTML = st.join('');
        
    };

    if (debug) {
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup',   onUp);
    }

    doLayout();

    window.addEventListener('resize', doLayout);



    var onKeyDown = function(ev) {
        var sld = slides[0];
        var lay = o.layout[ sld ];
        var oldEl, el = document.getElementById(sld);
        el.classList.remove('current');
        oldEl = el;

        var dir;
        switch(ev.keyCode) {
            case 37: case 38: // left up
                slides.unshift( slides.pop() );
                dir = -1;
                --o.current;
                if (o.current < 0) {
                    o.current += o.length;
                }
                break;

            case 39: case 40: // right down
                slides.push( slides.shift() );
                dir = 1;
                ++o.current;
                if (o.current >= o.length) {
                    o.current -= o.length;
                    forLayEls(function(el, idx) { el.classList.remove('visited'); });
                }
                break;

            case 32:
                if (!debug) { return; }
                (function() {
                    var lay, el, center, pos, dims;
                    var cvsDims = getCanvasDims();
                    for (var id in o.layout) {
                        lay = o.layout[id];
                        el = document.getElementById(id);
                        center = lay.center ? lay.center : [0.5, 0.5];
                        pos = getElementPos(el);
                        dims = getElementDims(el);
                        lay.pos = [
                            (pos[0] + dims[0] * center[0]) / cvsDims[0],
                            (pos[1] + dims[1] * center[1]) / cvsDims[1]
                        ];
                        lay.pos[0] = trunc(lay.pos[0], 3);
                        lay.pos[1] = trunc(lay.pos[1], 3);
                    }
                    console.log( JSON.stringify(o.layout).replace(/\},/g, '},\n'));
                    return;
                })();
                break;

            default:
                return;
        }

        if (dir === 1 && o.current !== 0) { oldEl.classList.add(   'visited'); }
        else {                              oldEl.classList.remove('visited'); }

        sld = slides[0];
        el = document.getElementById(sld);
        lay = o.layout[ sld ];

        ev.stopPropagation();
        $(el).zoomTo({
            targetsize: lay.sz || el.dataset.targetsize || o.defaultTargetSize,
            root:       $('.zoomViewport')
        });
        el.classList.add('current');
    };

    document.body.addEventListener('keydown', onKeyDown);



    // counter
    var counterEl = document.getElementById('counter');
    if (counterEl) {
        var counterCb = function() {
            counterEl.innerHTML = [
                o.current + 1,
                ' / ',
                o.length,
                '<br/>',
                formatTime()
            ].join('');
            --time;
        };
        setInterval(counterCb, 1000);
    }



    // hack
    onKeyDown({keyCode:39, stopPropagation:function(){}});
    onKeyDown({keyCode:37, stopPropagation:function(){}});

};
