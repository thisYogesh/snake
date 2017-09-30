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

var direction = { ltr: 1, rtl: 2, ttb: 3, btt: 4 },
    _direction = { 1: "ltr", 2: "rtl", 3: "ttb", 4: "btt" };

function animationFrame(a) {
    this.frameID = 0;
    this.live = null;
    this.frame = function () {
        var _this = this;
        if (_this.live === null || _this.live === true) {
            _this.frameID = setTimeout(function () {
                a.callback();
                _this.frame();
            }, a.interval);
            _this.live = true;
        }
    }
    this.stop = function () {
        clearTimeout(this.frameID);
        this.live = false;
    }
    this.start = function () {
        this.live = true;
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
    _this.playGround = new playGround({
        container: _this.container,
        canvas: _this.canvas,
        gridDimention: 14
    });
    return _this;
})._prototype({
    setup: function () {
        var _this = this;
        _this.reScale();
    },
    reScale: function () {
        this.canvas.height = this.canvas.width = 400 + 1;
    }
});

var playGround = (function playGround(op) {
    var _this = this;
    _this.container = op.container;
    _this.canvas = op.canvas;
    _this.gridDimention = op.gridDimention;
    _this.context = _this.canvas.getContext('2d');
    _this.initPlayground();
    _this.addSnake();
    _this.setup();
})._prototype({
    drawBackground: function () {
        var _this = this, cx = _this.context, w = _this.canvas.width;
        cx.strokeStyle = "#a7b78e";
        cx.beginPath();
        for (var q = 0; q < w; q += _this.gridDimention) {
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
            _keyCode = { 39: 1, 37: 2, 40: 3, 38: 4 };
        $(window).resize(function () {
            _this.drawBackground();
        }).bind("keyup", function (e) {
            if (keyCode.indexOf(e.keyCode) > -1) {
                if (_this.snake._direction._ !== _keyCode[e.keyCode] || !frame) {
                    if (frame) frame.stop();
                    if (!_this.snake.setDirection(_direction[_keyCode[e.keyCode]]).move()) {
                        frame.stop();
                    } else {
                        if (!frame) {
                            frame = new animationFrame({
                                callback: function () {
                                    if (!_this.snake.move()) {
                                        frame.stop();
                                    }
                                },
                                interval: 400
                            })
                        } else if (frame && frame.live === false) {
                            frame.start();
                        };
                    };
                }
            } else if (e.keyCode == 13) {
                if (frame) frame.stop();
                _this.snake.reset();
            }
        });
    },
    addSnake: function () {
        this.snake = new snake({
            context: this.context,
            length: 8,
            color: "#000",
            dimention: this.gridDimention
        });
    }
});

var snake = function () {
    var s = (function snake(config) {
        var _this = this;
        _this.length = config.length || 4;
        _this.color = config.color || "#000";
        _this.dimention = config.dimention || 10;
        _this.context = config.context || null;
        _this.dir = {
            ltr: 1,
            rtl: 2,
            ttb: 3,
            btt: 4
        };
        _this.init();
        return _this;
    })._prototype({
        init: function () {
            this._direction = { _: this.dir.ltr };
            this.snakeSegment = new (snakeSegment._inheritInstance(this));
        },
        move: function () {
            var segments = this.snakeSegment.segments,
                isCollide = false;
            for (var i = 0; i < segments.length; i++) {
                if (!this.snakeSegment.move(segments[i])) {
                    isCollide = true;
                    break;
                };
            }

            return !isCollide;
        },
        moveTo: function (dir) {
            this.setDirection(dir);
            this.move();
        },
        setDirection: function (dir) {
            this._direction._ = this.dir[dir] || this._direction._;
            return this;
        },
        reset: function () {
            var _this = this,
                segments = _this.snakeSegment.segments;
            for (var i = 0; i < segments.length; i++) {
                _this.snakeSegment.clearSegment(segments[i]);
            };
            _this.snakeSegment.addSegment(8);
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
            this.positionize(segment).segments.push(segment);
            this.drawSegment(segment);
        },
        positionize: function (segment) {
            var sg = this.segments.length == 0 ? true : false;
            if (sg) {
                segment.dimention = this.dimention - 1;
                segment.x = (this.dimention * 10) + 1;
                segment.y = (this.dimention * 10) + 1;
            } else {
                var lastSegment = this.segments[this.segments.length - 1];
                segment.dimention = this.dimention - 1;
                segment.x = lastSegment.x - lastSegment.dimention - 1;
                segment.y = lastSegment.y;
            }
            return this;
        },
        move: function (segment) {
            var snakeHead = this.clearSegment(segment).getSegment(0),
                isSnakeHead = snakeHead == segment;
            if (this.direction != this._direction._) { // if direction changes
                this.setTurnPoints({
                    x: snakeHead.x,
                    y: snakeHead.y
                });
                this.direction = this._direction._;
            }
            this._move(segment, this.direction);
            if (!this.checkSegmentCollide(snakeHead, isSnakeHead)) {
                this.drawSegment(segment);
                return true;
            } else {
                return false; // snake head got collied with one of his segment
            }
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
        checkSegmentCollide: function (snakeHead, isSnakeHead) {
            var found = false;
            if (isSnakeHead) {
                for (var i = 1; i < this.segments.length; i++) {
                    if (this.segments[i].x == snakeHead.x && this.segments[i].y == snakeHead.y) {
                        found = true;
                        break;
                    }
                }
            }
            return found;
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
            return this;
        },
        addSegment: function (length) {
            length = length || this.length;
            for (var i = 0; i < length; i++) {
                this.createSegment();
            };
        },
        drawSegment: function (segment) {
            var _this = this;
            _this.context.strokeStyle = _this.context.fillStyle = _this.color;
            _this.context.fillRect(segment.x + 2, segment.y + 2, segment.dimention - 4, segment.dimention - 4);
            _this.context.strokeRect(segment.x + .5, segment.y + .5, segment.dimention - 1, segment.dimention - 1);
            return _this;
        },
        getSegment: function (i) {
            return this.segments[i];
        },
        setTurnPoints: function (turnPoint) {
            turnPoint.resolveIndex = 1;
            this.turnPoints.push(turnPoint);
            for (var i = 1, j = this.segments[i]; i < this.segments.length; i++ , j = this.segments[i]) {
                if (!j.resolveDirection) j.resolveDirection = "";
                j.resolveDirection += " " + this.direction;
                j.resolveDirection = j.resolveDirection.trim();
            };
            return this;
        },
        clearTurnPoints: function () {
            this.turnPoints.length = 0;
        },
        matchTurnPoint: function (segment) {
            var found = false;
            for (var i = 0; i < this.turnPoints.length; i++) {
                if (segment.x == this.turnPoints[i].x && segment.y == this.turnPoints[i].y) {
                    this.turnPoints[i].resolveIndex++;
                    if (this.segments.length == this.turnPoints[i].resolveIndex) {
                        this.turnPoints.splice(i, 1);
                    }
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