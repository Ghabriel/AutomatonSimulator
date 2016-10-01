define(["require", "exports"], function (require, exports) {
    "use strict";
    var Renderer = (function () {
        function Renderer() {
        }
        Renderer.prototype.bind = function (node) {
            this.node = node;
        };
        Renderer.prototype.render = function () {
            if (this.node) {
                this.node.innerHTML = "";
                this.onRender();
            }
        };
        return Renderer;
    }());
    exports.Renderer = Renderer;
});
