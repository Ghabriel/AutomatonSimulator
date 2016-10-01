var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./Renderer"], function (require, exports, Renderer_1) {
    "use strict";
    var Sidebar = (function (_super) {
        __extends(Sidebar, _super);
        function Sidebar() {
            _super.apply(this, arguments);
        }
        Sidebar.prototype.onRender = function () {
            this.node.innerHTML = "<table><tr><td>I'm a sidebar.</td></tr></table>";
        };
        return Sidebar;
    }(Renderer_1.Renderer));
    exports.Sidebar = Sidebar;
});
