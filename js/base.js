var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("Renderer", ["require", "exports"], function (require, exports) {
    "use strict";
    var Renderer = (function () {
        function Renderer() {
        }
        Renderer.prototype.bind = function (node) {
            this.node = node;
            this.onBind();
        };
        Renderer.prototype.render = function () {
            if (this.node) {
                this.node.innerHTML = "";
                this.onRender();
            }
        };
        Renderer.prototype.onBind = function () { };
        return Renderer;
    }());
    exports.Renderer = Renderer;
});
define("languages/English", ["require", "exports"], function (require, exports) {
    "use strict";
    var english;
    (function (english) {
        english.strings = {
            SELECT_MACHINE: "Machine Selection"
        };
    })(english = exports.english || (exports.english = {}));
});
define("Settings", ["require", "exports", "languages/English"], function (require, exports, English_1) {
    "use strict";
    var Settings;
    (function (Settings) {
        Settings.sidebarID = "sidebar";
        Settings.mainbarID = "mainbar";
        Settings.language = English_1.english;
    })(Settings = exports.Settings || (exports.Settings = {}));
    exports.Strings = Settings.language.strings;
});
define("Utils", ["require", "exports"], function (require, exports) {
    "use strict";
    var utils;
    (function (utils) {
        function select(selector) {
            return document.querySelector(selector);
        }
        utils.select = select;
        function id(selector) {
            return select("#" + selector);
        }
        utils.id = id;
    })(utils = exports.utils || (exports.utils = {}));
});
define("UI", ["require", "exports", "Settings", "Utils"], function (require, exports, Settings_1, Utils_1) {
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
define("Menu", ["require", "exports", "Renderer"], function (require, exports, Renderer_1) {
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
            var node = this.node;
            node.innerHTML = this.title;
        };
        return Menu;
    }(Renderer_1.Renderer));
    exports.Menu = Menu;
});
define("Sidebar", ["require", "exports", "Menu", "Renderer", "Settings"], function (require, exports, Menu_1, Renderer_2, Settings_2) {
    "use strict";
    var Sidebar = (function (_super) {
        __extends(Sidebar, _super);
        function Sidebar() {
            _super.call(this);
            this.machineSelection = new Menu_1.Menu(Settings_2.Strings.SELECT_MACHINE);
        }
        Sidebar.prototype.onBind = function () {
            this.machineSelection.bind(this.node);
        };
        Sidebar.prototype.onRender = function () {
            this.machineSelection.render();
        };
        return Sidebar;
    }(Renderer_2.Renderer));
    exports.Sidebar = Sidebar;
});
define("Mainbar", ["require", "exports", "Renderer"], function (require, exports, Renderer_3) {
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
    }(Renderer_3.Renderer));
    exports.Mainbar = Mainbar;
});
/// <reference path="jQuery.d.ts" />
define("main", ["require", "exports", "Mainbar", "Sidebar", "UI"], function (require, exports, Mainbar_1, Sidebar_1, UI_1) {
    "use strict";
    $(document).ready(function () {
        var ui = new UI_1.UI(new Sidebar_1.Sidebar(), new Mainbar_1.Mainbar());
        ui.render();
    });
});
