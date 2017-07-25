//
'use strict';

// extends Functions prototype 
Function.prototype._prototype = function (proto) { for (var key in proto) { this.prototype[key] = proto[key]; } return this; }
Function.prototype._inherit = function (fn) { this.prototype = Object.create(fn); return this; };

var snakeApp = (function snakeApp(container) {
    var _this = this;
    _this.container = $(container || "body");
    _this.canvas = $("<canvas>").get(0);
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
})._prototype({
    setup: function () { },
    initPlayground: function () {
        var _this = this, cx = _this.context;
    }
})._inherit(snakeApp);