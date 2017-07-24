//
'use strict';

// extends Functions prototype 
Function.prototype._prototype = function(proto){for(var key in proto){ this.prototype[key] = proto[key]; }}
Function.prototype._inherit = function(fn){this.prototype = Object.create(fn);}

(function snakeApp(container){
    var _this = this;
    _this.container = $(container || "body");
    _this.canvas = $("canvas").get(0);
    _this.container.append(this.canvas);
    _this.snakeBoard = new snakeBoard(this.container, this.canvas);
    this.setup();
    return this;
})._prototype({
    setup : function(){
        var _this = this;
        _this.reScale();
        $(window).resize(function(){
            _this.reScale();
        });
    },
    reScale : function(){
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
    }
});

(function snakeBoard(container, canvas){
    var _this = this;
    _this.container = container;
    _this.canvas = canvas;
    _this.context = _this.canvas.getContext('2d');
})._prototype({
    initPlayground : function(){

    }
})._inherit(snakeApp);