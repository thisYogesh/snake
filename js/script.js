//
'use strict';

// extends Functions prototype 
Function.prototype._prototype = function (proto) {
    for (var key in proto) {
        this.prototype[key] = proto[key];
    }
    return this;
};
Function.prototype._inherit = function (fn) { // prototype inheritance
    this.prototype = Object.create(fn.prototype);
    return this;
};
Function.prototype._inheritInstance = function (Obj) {
    for (var key in Obj) {
        if (typeof Obj[key] != "function") {
            this.prototype[key] = Obj[key];
        }
    }
    return this;
};

function animationFrame() {
    /*var d = new Date();
    function fun(){
        var e = new Date();
        if( e.getSeconds() >= d.getSeconds() + 5 ){
            d =[] e;
            console.log('hi');
        }
        requestAnimationFrame(fun);
    }*/
    this.frame = function (w) {
        var a;
        if (w.requestAnimationFrame) {
            a = {
                type: 0,
                execute: w.requestAnimationFrame,
                close: w.cancelAnimationFrame
            }
        } else {
            a = {
                type: 1,
                execute: w.setTimeout,
                close: w.clearTimeout
            }
        }
        return a;
    }(window);
}

// var d = new Date();
// function fun(){
// 	var e = new Date(), 
// 	gs = e.getSeconds() - d.getSeconds(),
// 	gm = e.getMinutes() - d.getMinutes();
// 	if( (e.getMilliseconds()) * (gs + 1) * (gm + 1) >= (d.getMilliseconds() + 5000) ){
// 		d = e;
// 		console.log('requestAnimationFrame');
// 	}
// 	a = requestAnimationFrame(fun);
// }
// //fun()
// //setInterval(function(){ console.log('setInterval'); },5000)

function num(a) {
    return a + 0.5;
}

var snakeApp = (function snakeApp(container) {
    var _this = this;
    _this.container = $(container || "body");
    _this.canvas = $("<canvas id='canvas'>").get(0);
    _this.container.append(_this.canvas);
    _this.setup();
    _this.playGround = new playGround(_this.container, _this.canvas);
    return this;
})._prototype({
    setup: function () {
        var _this = this;
        _this.reScale();
        /*$(window).resize(function () {
            _this.reScale();
        });*/
    },
    reScale: function () {
        this.canvas.height = this.canvas.width = 400 + 1;
    }
});

var playGround = (function playGround(container, canvas) {
    var _this = this;
    _this.container = container;
    _this.canvas = canvas;
    _this.context = _this.canvas.getContext('2d');
    _this.initPlayground();
    _this.addSnake();
    _this.setup();
})._prototype({
    drawBackground: function () {
        var _this = this, cx = _this.context, w = _this.canvas.width;
        //cx.lineWidth = 0.5;
        cx.strokeStyle = "gray";
        cx.beginPath();
        for (var q = 0; q < w; q += 10) {
            cx.moveTo(num(q), 0);
            cx.lineTo(num(q), num(_this.canvas.height));
            cx.moveTo(0, num(q));
            cx.lineTo(num(_this.canvas.width), num(q));
        }
        cx.closePath();
        cx.stroke();
    },
    initPlayground: function () {
        var _this = this, cx = _this.context;
        _this.drawBackground();
    },
    setup: function () {
        var _this = this;
        $(window).resize(function () {
            _this.drawBackground();
        }).bind("keyup keydown keypress", function (e) {
            if (e.type == "keyup") {
                console.log(_this)
            }
        });
    },
    addSnake: function () {
        this.snake = new snake({
            context: this.context,
            length: 8
        });
    }
});

var snake = function () {
    var s = (function snake(config) {
        this.length = config.length || 4;
        this.color = config.color || "#000";
        this.dimention = config.dimention || 10;
        this.context = config.context || null;
        this.dir = {
            ltr: "Left to Right",
            rtl: "Right to Left",
            ttb: "Top to Bottom",
            btt: "Bottom to Top"
        };
        this.init();
        return this;
    })._prototype({
        init: function () {
            this.direction = this.dir.ltr;
            this.snakeSegment = new (snakeSegment._inheritInstance(this));
        },
        move: function () {
            var segments = this.snakeSegment.segments;
            for (var i = 0; i < segments.length; i++) {
                this.snakeSegment.move(segments[i]);
            }
        },
        head: function () {
            return this.snakeSegment.getSegment(0);
        }
    });

    var snakeSegment = (function snakeSegment() {
        this.addSegment();
        return this;
    })._prototype({
        createSegment: function () {
            var segment = {
                dimention: this.dimention,
                x: 0,
                y: 0
            };
            this.segments = this.segments || [];
            this.positionize(segment);
            this.segments.push(segment);
            this.drawSegment(segment);
        },
        positionize: function (segment) {
            var sg = this.segments.length == 0 ? true : false;
            if (sg) {
                segment.dimention = this.dimention - 1;
                segment.x = 100 + 1;
                segment.y = 100 + 1;
            } else {
                var lastSegment = this.segments[this.segments.length - 1];
                segment.dimention = this.dimention - 1;
                segment.x = lastSegment.x - lastSegment.dimention - 1;
                segment.y = lastSegment.y;
            }
        },
        move: function (segment) {
            this.clearSegment(segment);
            if (this.direction == this.dir.ltr) {
                segment.x = segment.x + segment.dimention + 1;
                segment.y = segment.y;
            }
            this.drawSegment(segment);
        },
        clearSegment: function (segment) {
            this.context.clearRect(segment.x, segment.y, segment.dimention, segment.dimention);
        },
        addSegment: function (length) {
            length = length || this.length;
            for (var i = 0; i < length; i++) {
                this.createSegment();
            };
        },
        drawSegment: function (segment) {
            this.context.fillRect(segment.x, segment.y, segment.dimention, segment.dimention);
        },
        getSegment: function (index) {
            return this.segments[index];
        }
    });

    return s;
}();
