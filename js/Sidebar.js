var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./Menu", "./Renderer", "./Settings"], function (require, exports, Menu_1, Renderer_1, Settings_1) {
    "use strict";
    var Sidebar = (function (_super) {
        __extends(Sidebar, _super);
        function Sidebar() {
            _super.call(this);
            this.machineSelection = new Menu_1.Menu(Settings_1.Strings.SELECT_MACHINE);
        }
        Sidebar.prototype.onBind = function () {
            this.machineSelection.bind(this.node);
        };
        Sidebar.prototype.onRender = function () {
            this.machineSelection.render();
        };
        return Sidebar;
    }(Renderer_1.Renderer));
    exports.Sidebar = Sidebar;
});
