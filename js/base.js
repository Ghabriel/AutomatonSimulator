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
                // this.node.innerHTML = "";
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
            SELECT_MACHINE: "Machine Selection",
            DFA: "DFA",
            NFA: "NFA",
            PDA: "PDA",
            LBA: "LBA" // linear bounded automaton
        };
    })(english = exports.english || (exports.english = {}));
});
define("Settings", ["require", "exports", "languages/English"], function (require, exports, English_1) {
    "use strict";
    var Settings;
    (function (Settings) {
        Settings.sidebarID = "sidebar";
        Settings.mainbarID = "mainbar";
        (function (Machine) {
            Machine[Machine["DFA"] = 0] = "DFA";
            Machine[Machine["NFA"] = 1] = "NFA";
            Machine[Machine["PDA"] = 2] = "PDA";
            Machine[Machine["LBA"] = 3] = "LBA";
        })(Settings.Machine || (Settings.Machine = {}));
        var Machine = Settings.Machine;
        Settings.language = English_1.english;
        Settings.machines = {};
        Settings.machines[Machine.DFA] = {
            name: Settings.language.strings.DFA
        };
        Settings.machines[Machine.NFA] = {
            name: Settings.language.strings.NFA
        };
        Settings.machines[Machine.PDA] = {
            name: Settings.language.strings.PDA
        };
        Settings.machines[Machine.LBA] = {
            name: Settings.language.strings.LBA
        };
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
        function create(tag) {
            return document.createElement(tag);
        }
        utils.create = create;
        function foreach(obj, callback) {
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    callback(i, obj[i]);
                }
            }
        }
        utils.foreach = foreach;
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
/// <reference path="jQuery.d.ts" />
define("Menu", ["require", "exports", "Renderer", "Utils"], function (require, exports, Renderer_1, Utils_2) {
    "use strict";
    var Menu = (function (_super) {
        __extends(Menu, _super);
        function Menu(title) {
            _super.call(this);
            this.title = title;
            this.children = [];
        }
        Menu.prototype.add = function (elem) {
            this.children.push(elem);
        };
        Menu.prototype.onRender = function () {
            var node = this.node;
            var wrapper = Utils_2.utils.create("div");
            wrapper.classList.add("menu");
            var title = Utils_2.utils.create("div");
            title.classList.add("title");
            title.innerHTML = this.title;
            wrapper.appendChild(title);
            var content = Utils_2.utils.create("div");
            content.classList.add("content");
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var child = _a[_i];
                content.appendChild(child);
            }
            wrapper.appendChild(content);
            node.appendChild(wrapper);
            title.addEventListener("click", function () {
                $(content).slideToggle(300);
            });
        };
        return Menu;
    }(Renderer_1.Renderer));
    exports.Menu = Menu;
});
define("Table", ["require", "exports", "Renderer", "Utils"], function (require, exports, Renderer_2, Utils_3) {
    "use strict";
    var Table = (function (_super) {
        __extends(Table, _super);
        function Table(numRows, numColumns) {
            _super.call(this);
            this.numRows = numRows;
            this.numColumns = numColumns;
            this.children = [];
        }
        Table.prototype.add = function (elem) {
            this.children.push(elem);
        };
        Table.prototype.html = function () {
            var wrapper = Utils_3.utils.create("table");
            var index = 0;
            for (var i = 0; i < this.numRows; i++) {
                var tr = Utils_3.utils.create("tr");
                for (var j = 0; j < this.numColumns; j++) {
                    var td = Utils_3.utils.create("td");
                    td.appendChild(this.children[index]);
                    tr.appendChild(td);
                    index++;
                }
                wrapper.appendChild(tr);
            }
            return wrapper;
        };
        Table.prototype.onRender = function () {
            this.node.appendChild(this.html());
        };
        return Table;
    }(Renderer_2.Renderer));
    exports.Table = Table;
});
define("Sidebar", ["require", "exports", "Menu", "Renderer", "Settings", "Settings", "Table", "Utils"], function (require, exports, Menu_1, Renderer_3, Settings_2, Settings_3, Table_1, Utils_4) {
    "use strict";
    var Sidebar = (function (_super) {
        __extends(Sidebar, _super);
        function Sidebar() {
            _super.call(this);
            this.machineSelection = new Menu_1.Menu(Settings_3.Strings.SELECT_MACHINE);
            // TODO: make this more generic
            var table = new Table_1.Table(2, 2);
            Utils_4.utils.foreach(Settings_2.Settings.machines, function (type, props) {
                var button = Utils_4.utils.create("input");
                button.type = "button";
                button.value = props.name;
                button.addEventListener("click", function () {
                    alert("Not yet implemented.");
                });
                table.add(button);
            });
            this.machineSelection.add(table.html());
            this.temp = new Menu_1.Menu("TEMPORARY");
            var span = Utils_4.utils.create("span");
            span.innerHTML = "Lorem ipsum dolor sit amet";
            this.temp.add(span);
        }
        Sidebar.prototype.onBind = function () {
            this.machineSelection.bind(this.node);
            this.temp.bind(this.node);
        };
        Sidebar.prototype.onRender = function () {
            this.machineSelection.render();
            this.temp.render();
        };
        return Sidebar;
    }(Renderer_3.Renderer));
    exports.Sidebar = Sidebar;
});
define("Mainbar", ["require", "exports", "Renderer"], function (require, exports, Renderer_4) {
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
    }(Renderer_4.Renderer));
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
