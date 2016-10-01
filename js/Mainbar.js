var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./Renderer"], function (require, exports, Renderer_1) {
    "use strict";
    var Mainbar = (function (_super) {
        __extends(Mainbar, _super);
        function Mainbar() {
            _super.apply(this, arguments);
        }
        Mainbar.prototype.onRender = function () {
            this.node.innerHTML = "main";
        };
        return Mainbar;
    }(Renderer_1.Renderer));
    exports.Mainbar = Mainbar;
});
