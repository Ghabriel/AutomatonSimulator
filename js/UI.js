define(["require", "exports", "./Settings", "./Utils"], function (require, exports, Settings_1, Utils_1) {
    "use strict";
    var UI = (function () {
        function UI() {
            var renderers = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                renderers[_i - 0] = arguments[_i];
            }
            this.bindSidebar(renderers[0]);
            this.bindMain(renderers[1]);
        }
        UI.prototype.render = function () {
            this.sidebarRenderer && this.sidebarRenderer.render();
            this.mainRenderer && this.mainRenderer.render();
            console.log("Interface ready.");
        };
        UI.prototype.bindSidebar = function (renderer) {
            if (renderer) {
                renderer.bind(Utils_1.utils.id(Settings_1.Settings.sidebarID));
            }
            this.sidebarRenderer = renderer;
        };
        UI.prototype.bindMain = function (renderer) {
            if (renderer) {
                renderer.bind(Utils_1.utils.id(Settings_1.Settings.mainbarID));
            }
            this.mainRenderer = renderer;
        };
        return UI;
    }());
    exports.UI = UI;
});
