//
'use strict';

// extends Functions prototype 
Function.prototype._prototype = function (proto) {
    for (var key in proto) {
        this.prototype[key] = proto[key];
    }
    return this;
};
Function.prototype._inherit = function (fn) {
    this.prototype = Object.create(fn.prototype);
    return this;
};

var snakeApp = (function snakeApp(container) {
    var _this = this;
    _this.container = $(container || "body");
    _this.canvas = $("<canvas id='canvas'>").get(0);
    _this.container.append(_this.canvas);
    _this.setup();
    _this.snakeBoard = new snakeBoard(_this.container, _this.canvas);
    return this;
})._prototype({
    setup: function () {
        var _this = this;
        _this.reScale();
        $(window).resize(function () {
            _this.reScale();
        });
    },
    reScale: function () {
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
    }
});

var snakeBoard = (function snakeBoard(container, canvas) {
    var _this = this;
    _this.container = container;
    _this.canvas = canvas;
    _this.context = _this.canvas.getContext('2d');
    _this.initPlayground();
    _this.addSnake();
    _this.setup();
})._inherit(snakeApp)._prototype({
    drawBackground: function () {
        var _this = this, cx = _this.context, w = _this.canvas.width;
        //cx.lineWidth = 0.5;
        cx.strokeStyle = "#fafafa";
        cx.beginPath();
        for (var q = 0; q < w; q += 10) {
            cx.moveTo(q + 0.5, 0);
            cx.lineTo(q + 0.5, _this.canvas.height + 0.5);
            cx.moveTo(0, q + 0.5);
            cx.lineTo(_this.canvas.width + 0.5, q + 0.5);
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
        });
    },
    addSnake: function () {
        this.snake = new snake({
            context: this.context,
            length: 1
        });
    }
});

var snake = (function snake(config) {
    this.length = config.length || 4;
    this.color = config.color || "#000";
    this.dimention = config.dimention || 10;
    this.context = config.context || null;
    this.init();
    return this;
})._inherit(snakeBoard)._prototype({
    init: function () {
        this.segmentInit();
    },
    segmentInit: function () {
        this.position = { x: 100, y: 100 };
        this.createSegment();
    },
    createSegment: function () {
        this.segments = this.segments || [];
        var segment = {
            dimention: this.dimention,
            x: 0,
            y: 0
        };
        this.segments.push(segment);
    }
});