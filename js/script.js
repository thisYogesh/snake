// external script
(function (w) {
    function externalScript() {
        $("canvas").bind("touchmove", function (e) {
            e.preventDefault();
        });
    };
    w.externalScript = externalScript;
})(window);