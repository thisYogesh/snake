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

function animationFrame(a) {
    this.frameID = 0;
    this.live = false;
    this.frame = function () {
        var _this = this;
        this.frameID = setTimeout(function () {
            a.callback();
            _this.frame();
        }, a.interval);
        this.live = true;
    }
    this.stop = function () {
        clearTimeout(this.frameID);
        this.live = false;
    }
    this.start = function () {
        this.frame();
    }
    this.frame();
    return this;
}

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
        cx.strokeStyle = "#a7b78e";
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
        var _this = this, frame,
            keyCode = [37, 38, 39, 40],
            _keyCode = { 37: "rtl", 38: "btt", 39: "ltr", 40: "ttb" };
        $(window).resize(function () {
            _this.drawBackground();
        }).bind("keydown", function (e) {
            if (keyCode.indexOf(e.keyCode) > -1) {
                if (_this.snake.direction._ != _keyCode[e.keyCode]) {
                    _this.snake.moveTo(_keyCode[e.keyCode]);
                    frame.stop();
                }

                if (!frame) {
                    frame = new animationFrame({
                        callback: function () {
                            _this.snake.move();
                        },
                        interval: 1000
                    })
                }else if(frame && frame.live === false){
                    frame.start();
                };
            }

        });
    },
    addSnake: function () {
        this.snake = new snake({
            context: this.context,
            length: 8,
            color: "#748658"
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
            this.direction = { _: this.dir.ltr };
            this.snakeSegment = new (snakeSegment._inheritInstance(this));
        },
        move: function () {
            var segments = this.snakeSegment.segments;
            for (var i = 0; i < segments.length; i++) {
                this.snakeSegment.move(segments[i]);
            }
        },
        moveTo: function (dir) {
            this.setDirection(dir);
            this.move();
        },
        setDirection: function (dir) {
            this.direction._ = this.dir[dir] || this.direction._;
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
            if (this.direction._ == this.dir.ltr) {
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
            this.context.strokeStyle = "#606f49";
            this.context.fillStyle = this.color;
            this.context.fillRect(segment.x, segment.y, segment.dimention, segment.dimention);
            this.context.strokeRect(segment.x + .5, segment.y + .5, segment.dimention - 1, segment.dimention - 1);
        }
    });

    return s;
}();