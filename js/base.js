var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("interface/Renderer", ["require", "exports"], function (require, exports) {
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
        Settings.slideInterval = 300;
        Settings.machineSelRows = 2;
        Settings.machineSelColumns = 2;
        Settings.stateLabelFontFamily = "sans-serif";
        Settings.stateLabelFontSize = 20;
        Settings.stateRadius = 32;
        Settings.stateRingRadius = 27;
        Settings.stateFillColor = "white";
        Settings.stateStrokeColor = "black";
        (function (Machine) {
            Machine[Machine["DFA"] = 0] = "DFA";
            Machine[Machine["NFA"] = 1] = "NFA";
            Machine[Machine["PDA"] = 2] = "PDA";
            Machine[Machine["LBA"] = 3] = "LBA";
        })(Settings.Machine || (Settings.Machine = {}));
        var Machine = Settings.Machine;
        Settings.language = English_1.english;
        Settings.currentMachine = Machine.DFA;
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
/// <reference path="../defs/raphael.d.ts" />
define("interface/State", ["require", "exports", "Settings"], function (require, exports, Settings_1) {
    "use strict";
    var State = (function () {
        function State() {
            this.body = null;
            this.ring = null;
            this.name = "";
            this.initial = false;
            this.final = false;
        }
        State.prototype.setPosition = function (x, y) {
            this.x = x;
            this.y = y;
        };
        State.prototype.setName = function (name) {
            this.name = name;
        };
        State.prototype.setInitial = function (flag) {
            this.initial = flag;
        };
        State.prototype.setFinal = function (flag) {
            this.final = flag;
        };
        State.prototype.isFinal = function () {
            return this.final;
        };
        State.prototype.render = function (canvas) {
            if (!this.body) {
                this.body = canvas.circle(this.x, this.y, Settings_1.Settings.stateRadius);
                this.body.attr("fill", Settings_1.Settings.stateFillColor);
                this.body.attr("stroke", Settings_1.Settings.stateStrokeColor);
                canvas.text(this.x, this.y, this.name).attr({
                    "font-family": Settings_1.Settings.stateLabelFontFamily,
                    "font-size": Settings_1.Settings.stateLabelFontSize
                });
            }
            else {
                this.body.attr({
                    cx: this.x,
                    cy: this.y
                });
            }
            if (this.final) {
                if (!this.ring) {
                    this.ring = canvas.circle(this.x, this.y, Settings_1.Settings.stateRingRadius);
                    this.ring.attr("stroke", Settings_1.Settings.stateStrokeColor);
                }
                else {
                    this.ring.attr({
                        cx: this.x,
                        cy: this.y
                    });
                }
            }
            else if (this.ring) {
                this.ring.remove();
                this.ring = null;
            }
        };
        State.prototype.html = function () {
            if (this.body) {
                return this.body.node;
            }
            return null;
        };
        return State;
    }());
    exports.State = State;
});
/// <reference path="../defs/raphael.d.ts" />
define("interface/Mainbar", ["require", "exports", "interface/Renderer", "interface/State"], function (require, exports, Renderer_1, State_1) {
    "use strict";
    var Mainbar = (function (_super) {
        __extends(Mainbar, _super);
        function Mainbar() {
            _super.apply(this, arguments);
        }
        Mainbar.prototype.onRender = function () {
            var node = this.node;
            var canvas = Raphael(node, 500, 500);
            var states = [
                new State_1.State(),
                new State_1.State(),
                new State_1.State()
            ];
            states[0].setPosition(120, 120);
            states[0].setFinal(true);
            states[1].setPosition(300, 80);
            states[2].setPosition(340, 320);
            var _loop_1 = function(state) {
                state.render(canvas);
                state.html().addEventListener("click", function () {
                    state.setFinal(!state.isFinal());
                    state.render(canvas);
                });
            };
            for (var _i = 0, states_1 = states; _i < states_1.length; _i++) {
                var state = states_1[_i];
                _loop_1(state);
            }
        };
        return Mainbar;
    }(Renderer_1.Renderer));
    exports.Mainbar = Mainbar;
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
/// <reference path="../defs/jQuery.d.ts" />
define("interface/Menu", ["require", "exports", "interface/Renderer", "Settings", "Utils"], function (require, exports, Renderer_2, Settings_2, Utils_1) {
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
        Menu.prototype.clear = function () {
            this.children = [];
        };
        Menu.prototype.onRender = function () {
            var node = this.node;
            var wrapper = Utils_1.utils.create("div");
            wrapper.classList.add("menu");
            var title = Utils_1.utils.create("div");
            title.classList.add("title");
            title.innerHTML = this.title;
            wrapper.appendChild(title);
            var content = Utils_1.utils.create("div");
            content.classList.add("content");
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var child = _a[_i];
                content.appendChild(child);
            }
            wrapper.appendChild(content);
            node.appendChild(wrapper);
            title.addEventListener("click", function () {
                if (!$(content).is(":animated")) {
                    $(content).slideToggle(Settings_2.Settings.slideInterval);
                }
            });
        };
        return Menu;
    }(Renderer_2.Renderer));
    exports.Menu = Menu;
});
define("interface/Table", ["require", "exports", "interface/Renderer", "Utils"], function (require, exports, Renderer_3, Utils_2) {
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
            var wrapper = Utils_2.utils.create("table");
            var index = 0;
            for (var i = 0; i < this.numRows; i++) {
                var tr = Utils_2.utils.create("tr");
                for (var j = 0; j < this.numColumns; j++) {
                    var td = Utils_2.utils.create("td");
                    if (index < this.children.length) {
                        td.appendChild(this.children[index]);
                    }
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
    }(Renderer_3.Renderer));
    exports.Table = Table;
});
define("interface/Sidebar", ["require", "exports", "interface/Menu", "interface/Renderer", "Settings", "Settings", "interface/Table", "Utils"], function (require, exports, Menu_1, Renderer_4, Settings_3, Settings_4, Table_1, Utils_3) {
    "use strict";
    var Sidebar = (function (_super) {
        __extends(Sidebar, _super);
        function Sidebar() {
            _super.call(this);
            this.machineSelection = new Menu_1.Menu(Settings_4.Strings.SELECT_MACHINE);
            this.temp = new Menu_1.Menu("TEMPORARY");
            var span = Utils_3.utils.create("span");
            span.innerHTML = "Lorem ipsum dolor sit amet";
            this.temp.add(span);
        }
        Sidebar.prototype.onBind = function () {
            this.machineSelection.bind(this.node);
            this.temp.bind(this.node);
        };
        Sidebar.prototype.onRender = function () {
            this.node.innerHTML = "";
            this.build();
            this.machineSelection.render();
            if (Settings_3.Settings.currentMachine == Settings_3.Settings.Machine.DFA) {
                this.temp.render();
            }
        };
        Sidebar.prototype.build = function () {
            var table = new Table_1.Table(Settings_3.Settings.machineSelRows, Settings_3.Settings.machineSelColumns);
            var self = this;
            Utils_3.utils.foreach(Settings_3.Settings.machines, function (type, props) {
                var button = Utils_3.utils.create("input");
                button.type = "button";
                button.value = props.name;
                button.disabled = (type == Settings_3.Settings.currentMachine);
                button.addEventListener("click", function () {
                    Settings_3.Settings.currentMachine = type;
                    self.render();
                    // alert("Not yet implemented.");
                });
                table.add(button);
            });
            this.machineSelection.clear();
            this.machineSelection.add(table.html());
        };
        return Sidebar;
    }(Renderer_4.Renderer));
    exports.Sidebar = Sidebar;
});
define("interface/UI", ["require", "exports", "Settings", "Utils"], function (require, exports, Settings_5, Utils_4) {
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
                renderer.bind(Utils_4.utils.id(Settings_5.Settings.sidebarID));
            }
            this.sidebarRenderer = renderer;
        };
        UI.prototype.bindMain = function (renderer) {
            if (renderer) {
                renderer.bind(Utils_4.utils.id(Settings_5.Settings.mainbarID));
            }
            this.mainRenderer = renderer;
        };
        return UI;
    }());
    exports.UI = UI;
});
/// <reference path="defs/jQuery.d.ts" />
define("main", ["require", "exports", "interface/Mainbar", "interface/Sidebar", "interface/UI"], function (require, exports, Mainbar_1, Sidebar_1, UI_1) {
    "use strict";
    $(document).ready(function () {
        var ui = new UI_1.UI(new Sidebar_1.Sidebar(), new Mainbar_1.Mainbar());
        ui.render();
    });
});
