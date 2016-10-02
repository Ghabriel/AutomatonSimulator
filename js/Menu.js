var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./Renderer"], function (require, exports, Renderer_1) {
    "use strict";
    var Menu = (function (_super) {
        __extends(Menu, _super);
        function Menu(title) {
            _super.call(this);
            this.title = title;
        }
        Menu.prototype.add = function (elem) {
            this.children.push(elem);
        };
        Menu.prototype.onRender = function () {
            console.log("[MENU] Rendering...");
            var node = this.node;
            node.innerHTML = this.title;
        };
        return Menu;
    }(Renderer_1.Renderer));
    exports.Menu = Menu;
});
