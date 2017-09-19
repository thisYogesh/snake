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

var direction = {
    ltr: "Left_to_Right",
    rtl: "Right_to_Left",
    ttb: "Top_to_Bottom",
    btt: "Bottom_to_Top"
}, _direction = {
    "Left_to_Right": "ltr",
    "Right_to_Left": "rtl",
    "Top_to_Bottom": "ttb",
    "Bottom_to_Top": "btt"
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
            _keyCode = { 37: "Right_to_Left", 38: "Bottom_to_Top", 39: "Left_to_Right", 40: "Top_to_Bottom" };
        $(window).resize(function () {
            _this.drawBackground();
        }).bind("keyup", function (e) {
            if (keyCode.indexOf(e.keyCode) > -1) {
                if (_this.snake._direction._ != _keyCode[e.keyCode]) {
                    _this.snake.moveTo(_direction[_keyCode[e.keyCode]]);
                    if (frame) frame.stop();
                }

                if (!frame) {
                    _this.snake.move();
                    frame = new animationFrame({
                        callback: function () {
                            _this.snake.move();
                        },
                        interval: 400
                    })
                } else if (frame && frame.live === false) {
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
            ltr: "Left_to_Right",
            rtl: "Right_to_Left",
            ttb: "Top_to_Bottom",
            btt: "Bottom_to_Top"
        };
        this.init();
        return this;
    })._prototype({
        init: function () {
            this._direction = { _: this.dir.ltr };
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
            this._direction._ = this.dir[dir] || this._direction._;
        }
    });

    var snakeSegment = (function snakeSegment() {
        this.addSegment();
        this.turnPoints = [];
        this.direction = this._direction._;
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
            if (this.direction != this._direction._) { // if direction changes
                var snakehead = this.getSegment(0);
                this.setTurnPoints({
                    x: snakehead.x,
                    y: snakehead.y
                });
                this.direction = this._direction._;
            }
            this._move(segment, this.direction);
            this.drawSegment(segment);
        },
        _move: function (segment, dir, resolve) {
            if (this.resolveSegmentDirection(segment, resolve)) {
                if (dir == this.dir.ltr) {
                    segment.x = segment.x + (segment.dimention + 1);
                } else if (dir == this.dir.rtl) {
                    segment.x = segment.x - (segment.dimention + 1);
                } else if (dir == this.dir.ttb) {
                    segment.y = segment.y + (segment.dimention + 1);
                } else if (dir == this.dir.btt) {
                    segment.y = segment.y - (segment.dimention + 1);
                }
            }
        },
        resolveSegmentDirection: function (segment, resolve) {
            if (segment.resolveDirection && !resolve) {
                var dirs = segment.resolveDirection.split(" ");
                this._move(segment, dirs[0], true);

                if (this.matchTurnPoint(segment)) {
                    dirs.splice(0, 1);
                    segment.resolveDirection = dirs.join(" ");
                    if (!segment.resolveDirection) {
                        segment.resolveDirection = null;
                    }
                }
                return false;
            } else {
                return true;
            }
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
        },
        getSegment: function (i) {
            return this.segments[i];
        },
        setTurnPoints: function (turnPoint) {
            turnPoint.index = this.turnPoints.length;
            this.turnPoints.push(turnPoint);
            for (var i = 1, j = this.segments[i]; i < this.segments.length; i++ , j = this.segments[i]) {
                if (!j.resolveDirection) j.resolveDirection = "";
                j.resolveDirection += " " + this.direction;
                j.resolveDirection = j.resolveDirection.trim();
            };
        },
        clearTurnPoints: function () {
            this.turnPoints.length = 0;
        },
        matchTurnPoint: function (segment) {
            var found = false;
            for (var i = 0; i < this.turnPoints.length; i++) {
                if (segment.x == this.turnPoints[i].x && segment.y == this.turnPoints[i].y) {
                    //this.turnPoints.splice(i, 1);
                    found = true;
                    break;
                }
            }
            return found;
        },
        removeTurnPoints: function (turnPoint) {
            this.turnPoints.splice(turnPoint.index, 1);
        }
    });

    return s;
}();