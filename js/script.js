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

var snakeApp = (function snakeApp(config) {
    var _this = this;
    !config && (config = {});
    _this.container = $(config.container || "body");
    _this.media = config.media;
    _this.canvas = $("<canvas id='canvas'>").get(0);
    _this.container.append(_this.canvas);
    _this.gridDimention = 14;
    _this.setup();
    _this.playGround = new (playGround._inheritInstance(_this))({
        container: _this.container,
        canvas: _this.canvas,
        gridDimention: _this.gridDimention
    });
    return _this;
})._prototype({
    setup: function () {
        var _this = this;
        _this.reScale();
    },
    reScale: function () {
        this.canvas.height = this.canvas.width = this.gridDimention * 30 + 1;
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
            _keyCode = { 39: 1, 37: 2, 40: 3, 38: 4 },
            _dir = { 1: "horizontal", 2: "horizontal", 3: "vertical", 4: "vertical" };
        $(window).resize(function () {
            _this.drawBackground();
        }).bind("keyup", function (e) {
            if (keyCode.indexOf(e.keyCode) > -1) {
                if (checkSnakeDirection(_keyCode[e.keyCode]) || !frame) {
                    if (frame) frame.stop();
                    if (_this.snake.collide || !_this.snake.setDirection(_direction[_keyCode[e.keyCode]]).move()) {
                        frame.stop();
                    } else if (!frame) {
                        frame = new animationFrame({
                            callback: function () {
                                if (!_this.snake.move()) {
                                    frame.stop();
                                }
                            },
                            interval: 200
                        })
                    } else if (frame && frame.live === false) {
                        frame.start();
                    };
                }
            } else if (e.keyCode == 13) {
                if (frame) frame.stop();
                _this.snake.reset();
            }
        });

        function checkSnakeDirection(dir) {
            return _this.snake._direction._ !== dir && _dir[dir] !== _dir[_this.snake._direction._];
        }
    },
    addSnake: function () {
        this.snake = new (snake._inheritInstance(this))({
            playGroundContext: this.context,
            length: 8,
            color: "#000",
            dimention: this.gridDimention
        });
    }
});

var snakeFood = (function snakeFood(config) {
    var _this = this;
    _this.rengeHeight = config.height;
    _this.rengeWidth = config.width;
    _this.color = config.color || "#000"
    _this.snake = config.snake;
    _this._food = null;
    _this.giveFood();
    return this;
})._prototype({
    genetareRandomPos: function () {
        return {
            x: Math.floor(Math.random() * (this.rengeWidth - 1)),
            y: Math.floor(Math.random() * (this.rengeHeight - 1)),
            dimention: this.snake.dimention - 1
        };
    },
    giveFood: function () {
        var FoodPos = this.returnFoodPos(this.snake.snakeSegment.segments);
        this.drawFood(FoodPos);
        return this._food = FoodPos;
    },
    returnFoodPos: function (segments) {
        var pos = this.genetareRandomPos();
        pos.x = (Math.floor(pos.x / this.snake.dimention) * this.snake.dimention) + 1;
        pos.y = (Math.floor(pos.y / this.snake.dimention) * this.snake.dimention) + 1;
        
        for (var i = 0; i < segments.length; i++) {
            if (((pos.x >= segments[i].x && pos.x <= segments[i].x + segments[i].dimention) || (pos.x + pos.dimention >= segments[i].x && pos.x + pos.dimention <= segments[i].x + segments[i].dimention)) && ((pos.y >= segments[i].y && pos.y <= segments[i].y + segments[i].dimention) || (pos.y + pos.dimention >= segments[i].y && pos.y + pos.dimention <= segments[i].y + segments[i].dimention))) {
                pos = this.returnFoodPos(segments);
                break;
            }
        };

        return pos;
    },
    drawFood: function (food) {
        var _this = this;
        _this.snake.playGroundContext.strokeStyle = _this.snake.playGroundContext.fillStyle = _this.color;
        _this.snake.playGroundContext.fillRect(food.x + 2, food.y + 2, food.dimention - 4, food.dimention - 4);
        _this.snake.playGroundContext.strokeRect(food.x + .5, food.y + .5, food.dimention - 1, food.dimention - 1);

        return _this;
    },
    clearFood: function (food) {
        this.snake.playGroundContext.clearRect(food.x, food.y, food.dimention, food.dimention);
        return this;
    }
});

var snake = function () {
    var s = (function snake(config) {
        var _this = this;
        _this.length = config.length || 4;
        _this.color = config.color || "#000";
        _this.dimention = config.dimention || 10;
        _this.playGroundContext = config.playGroundContext || null;
        _this.init();
        return _this;
    })._prototype({
        init: function () {
            var _this = this;
            _this.dir = {
                ltr: 1,
                rtl: 2,
                ttb: 3,
                btt: 4
            };
            _this.collide = false;
            _this._direction = { _: _this.dir.ltr };
            _this.snakeSegment = new (snakeSegment._inheritInstance(_this))(_this);
            _this.food = new snakeFood({
                height: _this.playGroundContext.canvas.height,
                width: _this.playGroundContext.canvas.width,
                snake: _this,
                color: "#ea4335"
            });
        },
        move: function () {
            var _this = this,
                segments = _this.snakeSegment.segments,
                isCollide = false;
            if (!_this.collide) {
                for (var i = 0; i < segments.length; i++) {
                    if (!_this.snakeSegment.move(segments[i])) {
                        isCollide = true;
                        _this.collide = true;
                        break;
                    };
                }
            } else {
                isCollide = true;
            }

            if (isCollide && _this.media) { // if snake collide then play the media
                _this.media.collide.play();
            }

            return !isCollide;
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
            segments.length = 0;
            _this.snakeSegment.removeTurnPoints();
            _this.snakeSegment.addSegment(8);
            _this.snakeSegment.direction = _this.dir.ltr;
            _this._direction._ = null;
            _this.collide = false;
        },
        eaten: function () {
            this.media && this.media.eaten.play();
            this.food.giveFood();
        }
    });

    var snakeSegment = (function snakeSegment(snake) {
        var _this = this;
        _this.snake = snake;
        _this.direction = _this._direction._;
        _this.addSegment();
        _this.turnPoints = [];
        return _this;
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
            var _this = this;
            if (_this.segments.length == 0) { // initial position setup
                segment.dimention = _this.dimention - 1;
                segment.x = (_this.dimention * 10) + 1;
                segment.y = (_this.dimention * 10) + 1;
            } else {
                var lastSegment = _this.segments[_this.segments.length - 1],
                    has_rDirection = lastSegment.resolveDirection ? lastSegment.resolveDirection.match(/^\d+/) : false,
                    rDirection = has_rDirection ? Number(has_rDirection[0]) : _this.direction;

                segment.dimention = _this.dimention - 1;
                if (rDirection == _this.dir.ltr) {
                    segment.x = lastSegment.x - lastSegment.dimention - 1;
                    segment.y = lastSegment.y;
                } else if (rDirection == _this.dir.rtl) {
                    segment.x = lastSegment.x + lastSegment.dimention + 1;
                    segment.y = lastSegment.y;
                } else if (rDirection == _this.dir.ttb) {
                    segment.y = lastSegment.y - lastSegment.dimention - 1;
                    segment.x = lastSegment.x;
                } else if (rDirection == _this.dir.btt) {
                    segment.y = lastSegment.y + lastSegment.dimention + 1;
                    segment.x = lastSegment.x;
                }
                segment.resolveDirection = lastSegment.resolveDirection;
            }
            return _this;
        },
        move: function (segment) {
            var _this = this,
                snakeHead = _this.getSegment(0),
                isSnakeHead = snakeHead == segment,
                _snakeHead;

            if (isSnakeHead) {
                _snakeHead = {
                    x: snakeHead.x,
                    y: snakeHead.y,
                    dimention: snakeHead.dimention
                };
            } else {
                _this.clearSegment(segment);
            }

            if (_this.direction != _this._direction._) { // if direction changes
                _this.setTurnPoints({
                    x: snakeHead.x,
                    y: snakeHead.y
                });
                _this.direction = _this._direction._;
            }
            _this._move(segment, _this.direction);
            if (!_this.checkSegmentCollide(snakeHead, isSnakeHead)) {
                if (isSnakeHead) {
                    _this.clearSegment(_snakeHead);
                    _this.checkFood(segment);
                }
                _this.drawSegment(segment);
                return true;
            } else {
                // if snake head got collied then return his original position again;
                snakeHead.x = _snakeHead.x;
                snakeHead.y = _snakeHead.y;
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
        checkFood: function (segment) {
            if (segment.x == this.snake.food._food.x && segment.y == this.snake.food._food.y) {
                this.addSegment(1);
                this.snake.eaten();
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
            this.playGroundContext.clearRect(segment.x, segment.y, segment.dimention, segment.dimention);
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
            _this.playGroundContext.strokeStyle = _this.playGroundContext.fillStyle = _this.color;
            _this.playGroundContext.fillRect(segment.x + 2, segment.y + 2, segment.dimention - 4, segment.dimention - 4);
            _this.playGroundContext.strokeRect(segment.x + .5, segment.y + .5, segment.dimention - 1, segment.dimention - 1);
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
        removeTurnPoints: function () {
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
        }
    });

    return s;
}();