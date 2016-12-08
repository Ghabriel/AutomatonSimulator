var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("Keyboard", ["require", "exports"], function (require, exports) {
    "use strict";
    var Keyboard;
    (function (Keyboard) {
        Keyboard.keys = {
            "A": 65,
            "B": 66,
            "C": 67,
            "D": 68,
            "E": 69,
            "F": 70,
            "G": 71,
            "H": 72,
            "I": 73,
            "J": 74,
            "K": 75,
            "L": 76,
            "M": 77,
            "N": 78,
            "O": 79,
            "P": 80,
            "Q": 81,
            "R": 82,
            "S": 83,
            "T": 84,
            "U": 85,
            "V": 86,
            "W": 87,
            "X": 88,
            "Y": 89,
            "Z": 90,
            "0": 48,
            "1": 49,
            "2": 50,
            "3": 51,
            "4": 52,
            "5": 53,
            "6": 54,
            "7": 55,
            "8": 56,
            "9": 57,
            "ENTER": 13,
            "SHIFT": 16,
            "SPACE": 32,
            "LEFT": 37,
            "UP": 38,
            "RIGHT": 39,
            "DOWN": 40,
            "+": 61,
            "-": 173
        };
    })(Keyboard = exports.Keyboard || (exports.Keyboard = {}));
});
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
            SELECT_LANGUAGE: "System Language",
            CHANGE_LANGUAGE: "Change the language to \"%\"?",
            FILE_MENUBAR: "File Manipulation",
            SAVE: "Save",
            OPEN: "Open",
            SELECT_MACHINE: "Machine Selection",
            FA: "Finite Automaton",
            PDA: "Pushdown Automaton",
            LBA: "Linearly Bounded Automaton",
            RECOGNITION: "Recognition",
            TEST_CASE: "test case"
        };
    })(english = exports.english || (exports.english = {}));
});
define("languages/Portuguese", ["require", "exports"], function (require, exports) {
    "use strict";
    var portuguese;
    (function (portuguese) {
        portuguese.strings = {
            SELECT_LANGUAGE: "Idioma do Sistema",
            CHANGE_LANGUAGE: "Mudar o idioma para \"%\"?",
            FILE_MENUBAR: "Manipulação de Arquivos",
            SAVE: "Salvar",
            OPEN: "Abrir",
            SELECT_MACHINE: "Seleção de Máquina",
            FA: "Autômato Finito",
            PDA: "Autômato de Pilha",
            LBA: "Autômato Linearmente Limitado",
            RECOGNITION: "Reconhecimento",
            TEST_CASE: "caso de teste"
        };
    })(portuguese = exports.portuguese || (exports.portuguese = {}));
});
define("Utils", ["require", "exports", "System"], function (require, exports, System_1) {
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
        function isRightClick(event) {
            if ("which" in event) {
                return event.which == 3;
            }
            else if ("button" in event) {
                return event.button == 2;
            }
            // Unknown browser
            console.log("[WARNING] Right click events will not work properly in this browser.");
            return false;
        }
        utils.isRightClick = isRightClick;
        function linePath(x1, y1, x2, y2) {
            return "M" + x1 + " " + y1 + " L" + x2 + " " + y2;
        }
        utils.linePath = linePath;
        function line(canvas, x1, y1, x2, y2) {
            var line = canvas.path(this.linePath(x1, y1, x2, y2));
            // TODO: make the stroke color flexible
            line.attr("stroke", "black");
            return line;
        }
        utils.line = line;
        function toRadians(angle) {
            return angle * Math.PI / 180;
        }
        utils.toRadians = toRadians;
        function bindShortcut(keys, callback) {
            System_1.System.addKeyObserver(keys, callback);
        }
        utils.bindShortcut = bindShortcut;
    })(utils = exports.utils || (exports.utils = {}));
});
define("Initializer", ["require", "exports", "interface/Menu", "Settings", "Utils"], function (require, exports, Menu_1, Settings_1, Utils_1) {
    "use strict";
    var Initializer = (function () {
        function Initializer() {
        }
        Initializer.exec = function () {
            // if (this.initialized) {
            // 	return;
            // }
            // this.initialized = true;
            this.initSidebars();
        };
        Initializer.initSidebars = function () {
            this.initSidebarFA();
            this.initSidebarPDA();
            this.initSidebarLBA();
        };
        Initializer.initSidebarFA = function () {
            var menuList = [];
            var temp = new Menu_1.Menu(Settings_1.Strings.RECOGNITION);
            var input = Utils_1.utils.create("input");
            input.type = "text";
            input.placeholder = Settings_1.Strings.TEST_CASE;
            temp.add(input);
            menuList.push(temp);
            Settings_1.Settings.machines[Settings_1.Settings.Machine.FA].sidebar = menuList;
        };
        Initializer.initSidebarPDA = function () {
            // TODO
            console.log("[INIT] PDA");
        };
        Initializer.initSidebarLBA = function () {
            // TODO
            console.log("[INIT] LBA");
        };
        return Initializer;
    }());
    exports.Initializer = Initializer;
});
define("Settings", ["require", "exports", "languages/English", "languages/Portuguese", "Initializer", "Utils"], function (require, exports, English_1, Portuguese_1, Initializer_1, Utils_2) {
    "use strict";
    var Settings;
    (function (Settings) {
        Settings.sidebarID = "sidebar";
        Settings.mainbarID = "mainbar";
        Settings.slideInterval = 300;
        Settings.machineSelRows = 3;
        Settings.machineSelColumns = 1;
        Settings.stateLabelFontFamily = "sans-serif";
        Settings.stateLabelFontSize = 20;
        Settings.stateRadius = 32;
        Settings.stateRingRadius = 27;
        Settings.stateDragTolerance = 50;
        Settings.stateFillColor = "white";
        Settings.stateStrokeColor = "black";
        Settings.edgeArrowLength = 30;
        Settings.edgeArrowAngle = 30;
        Settings.shortcuts = {
            save: ["ctrl", "S"],
            open: ["ctrl", "O"]
        };
        Settings.languages = {
            "English": English_1.english,
            "Português": Portuguese_1.portuguese
        };
        (function (Machine) {
            Machine[Machine["FA"] = 0] = "FA";
            Machine[Machine["PDA"] = 1] = "PDA";
            Machine[Machine["LBA"] = 2] = "LBA";
        })(Settings.Machine || (Settings.Machine = {}));
        var Machine = Settings.Machine;
        Settings.language = English_1.english;
        Settings.currentMachine = Machine.FA;
        Settings.machines = {};
        var firstUpdate = true;
        function update() {
            var machineList = {};
            machineList[Machine.FA] = {
                name: Settings.language.strings.FA,
                sidebar: []
            };
            machineList[Machine.PDA] = {
                name: Settings.language.strings.PDA,
                sidebar: []
            };
            machineList[Machine.LBA] = {
                name: Settings.language.strings.LBA,
                sidebar: []
            };
            Utils_2.utils.foreach(machineList, function (key, value) {
                Settings.machines[key] = value;
                // if (firstUpdate) {
                // 	machines[key] = value;
                // } else {
                // 	machines[key].name = value.name;
                // }
            });
            firstUpdate = false;
            Initializer_1.Initializer.exec();
        }
        Settings.update = update;
        function changeLanguage(newLanguage) {
            Settings.language = newLanguage;
            exports.Strings = Settings.language.strings;
            update();
        }
        Settings.changeLanguage = changeLanguage;
    })(Settings = exports.Settings || (exports.Settings = {}));
    exports.Strings = Settings.language.strings;
    Settings.update();
});
// Initializer.exec();
/// <reference path="../defs/jQuery.d.ts" />
define("interface/Menu", ["require", "exports", "interface/Renderer", "Settings", "Utils"], function (require, exports, Renderer_1, Settings_2, Utils_3) {
    "use strict";
    var Menu = (function (_super) {
        __extends(Menu, _super);
        function Menu(title) {
            _super.call(this);
            this.body = null;
            this.toggled = false;
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
            var wrapper = Utils_3.utils.create("div");
            wrapper.classList.add("menu");
            var title = Utils_3.utils.create("div");
            title.classList.add("title");
            title.innerHTML = this.title;
            wrapper.appendChild(title);
            var content = Utils_3.utils.create("div");
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
            this.body = wrapper;
            if (this.toggled) {
                this.internalToggle();
            }
        };
        Menu.prototype.toggle = function () {
            this.toggled = !this.toggled;
            if (this.body) {
                this.internalToggle();
            }
        };
        Menu.prototype.html = function () {
            return this.body;
        };
        Menu.prototype.internalToggle = function () {
            var content = this.body.querySelector(".content");
            $(content).toggle();
        };
        return Menu;
    }(Renderer_1.Renderer));
    exports.Menu = Menu;
});
define("interface/Table", ["require", "exports", "interface/Renderer", "Utils"], function (require, exports, Renderer_2, Utils_4) {
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
            var wrapper = Utils_4.utils.create("table");
            var index = 0;
            for (var i = 0; i < this.numRows; i++) {
                var tr = Utils_4.utils.create("tr");
                for (var j = 0; j < this.numColumns; j++) {
                    var td = Utils_4.utils.create("td");
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
    }(Renderer_2.Renderer));
    exports.Table = Table;
});
/// <reference path="../defs/filesaver.d.ts" />
define("interface/Sidebar", ["require", "exports", "interface/Menu", "interface/Renderer", "Settings", "Settings", "System", "interface/Table", "Utils"], function (require, exports, Menu_2, Renderer_3, Settings_3, Settings_4, System_2, Table_1, Utils_5) {
    "use strict";
    var Sidebar = (function (_super) {
        __extends(Sidebar, _super);
        function Sidebar() {
            _super.call(this);
            this.build();
        }
        Sidebar.prototype.build = function () {
            this.languageSelection = new Menu_2.Menu(Settings_4.Strings.SELECT_LANGUAGE);
            this.fileManipulation = new Menu_2.Menu(Settings_4.Strings.FILE_MENUBAR);
            this.machineSelection = new Menu_2.Menu(Settings_4.Strings.SELECT_MACHINE);
            this.otherMenus = [];
            this.buildLanguageSelection();
            this.buildFileManipulation();
            this.buildMachineSelection();
            if (this.node) {
                this.onBind();
            }
        };
        Sidebar.prototype.onBind = function () {
            this.languageSelection.bind(this.node);
            this.fileManipulation.bind(this.node);
            this.machineSelection.bind(this.node);
            for (var _i = 0, _a = this.otherMenus; _i < _a.length; _i++) {
                var menu = _a[_i];
                menu.bind(this.node);
            }
        };
        Sidebar.prototype.onRender = function () {
            this.languageSelection.render();
            this.fileManipulation.render();
            this.machineSelection.render();
            for (var _i = 0, _a = this.otherMenus; _i < _a.length; _i++) {
                var menu = _a[_i];
                menu.render();
            }
        };
        Sidebar.prototype.loadMachine = function (machine) {
            for (var _i = 0, _a = this.otherMenus; _i < _a.length; _i++) {
                var menu = _a[_i];
                $(menu.html()).remove();
            }
            this.otherMenus = Settings_3.Settings.machines[machine].sidebar;
            for (var _b = 0, _c = this.otherMenus; _b < _c.length; _b++) {
                var menu = _c[_b];
                menu.bind(this.node);
            }
        };
        Sidebar.prototype.buildLanguageSelection = function () {
            var select = Utils_5.utils.create("select");
            var languages = Settings_3.Settings.languages;
            var i = 0;
            var selectedIndex = -1;
            Utils_5.utils.foreach(languages, function (name, obj) {
                var option = Utils_5.utils.create("option");
                option.value = name;
                option.innerHTML = name;
                select.appendChild(option);
                if (obj == Settings_3.Settings.language) {
                    selectedIndex = i;
                }
                i++;
            });
            select.selectedIndex = selectedIndex;
            this.languageSelection.clear();
            this.languageSelection.add(select);
            this.languageSelection.toggle();
            select.addEventListener("change", function (e) {
                var name = this.options[this.selectedIndex].value;
                var confirmation = confirm(Settings_4.Strings.CHANGE_LANGUAGE.replace("%", name));
                if (confirmation) {
                    System_2.System.changeLanguage(languages[name]);
                }
            });
        };
        Sidebar.prototype.buildFileManipulation = function () {
            this.fileManipulation.clear();
            var save = Utils_5.utils.create("input");
            save.classList.add("file_manip_btn");
            save.type = "button";
            save.value = Settings_4.Strings.SAVE;
            save.addEventListener("click", function () {
                // TODO
                var content = "Hello, world!";
                var blob = new Blob([content], { type: "text/plain; charset=utf-8" });
                saveAs(blob, "file.txt");
            });
            Utils_5.utils.bindShortcut(Settings_3.Settings.shortcuts.save, function () {
                save.click();
            });
            this.fileManipulation.add(save);
            var open = Utils_5.utils.create("input");
            open.classList.add("file_manip_btn");
            open.type = "button";
            open.value = Settings_4.Strings.OPEN;
            open.addEventListener("click", function () {
                // TODO
                alert("Not yet implemented");
            });
            Utils_5.utils.bindShortcut(Settings_3.Settings.shortcuts.open, function () {
                open.click();
            });
            this.fileManipulation.add(open);
        };
        Sidebar.prototype.buildMachineSelection = function () {
            var table = new Table_1.Table(Settings_3.Settings.machineSelRows, Settings_3.Settings.machineSelColumns);
            var machineButtonMapping = {};
            var self = this;
            Utils_5.utils.foreach(Settings_3.Settings.machines, function (type, props) {
                var button = Utils_5.utils.create("input");
                button.classList.add("machine_selection_btn");
                button.type = "button";
                button.value = props.name;
                button.disabled = (type == Settings_3.Settings.currentMachine);
                button.addEventListener("click", function () {
                    machineButtonMapping[Settings_3.Settings.currentMachine].disabled = false;
                    machineButtonMapping[type].disabled = true;
                    // Firefox ignores keyboard events triggered while focusing
                    // a disabled input, so blur it.
                    machineButtonMapping[type].blur();
                    Settings_3.Settings.currentMachine = type;
                    self.loadMachine(type);
                });
                table.add(button);
                machineButtonMapping[type] = button;
            });
            Utils_5.utils.bindShortcut(["M"], function () {
                var buttons = document.querySelectorAll(".machine_selection_btn");
                for (var i = 0; i < buttons.length; i++) {
                    var button = buttons[i];
                    if (!button.disabled) {
                        button.focus();
                        break;
                    }
                }
            });
            this.machineSelection.clear();
            this.machineSelection.add(table.html());
            this.loadMachine(Settings_3.Settings.currentMachine);
        };
        return Sidebar;
    }(Renderer_3.Renderer));
    exports.Sidebar = Sidebar;
});
define("System", ["require", "exports", "Keyboard", "Settings", "Utils"], function (require, exports, Keyboard_1, Settings_5, Utils_6) {
    "use strict";
    var System = (function () {
        function System() {
        }
        System.changeLanguage = function (language) {
            Settings_5.Settings.changeLanguage(language);
            this.reload();
        };
        System.reload = function () {
            Utils_6.utils.id(Settings_5.Settings.sidebarID).innerHTML = "";
            this.sidebar.build();
            this.sidebar.render();
        };
        System.bindSidebar = function (sidebar) {
            this.sidebar = sidebar;
        };
        System.keyEvent = function (event) {
            var triggered = false;
            for (var _i = 0, _a = this.keyboardObservers; _i < _a.length; _i++) {
                var observer = _a[_i];
                var keys = observer.keys;
                if (this.shortcutMatches(event, keys)) {
                    observer.callback();
                    triggered = true;
                }
            }
            if (triggered) {
                event.preventDefault();
                return false;
            }
            return true;
        };
        System.addKeyObserver = function (keys, callback) {
            this.keyboardObservers.push({
                keys: keys,
                callback: callback
            });
        };
        System.shortcutMatches = function (event, keys) {
            function propertyName(type) {
                return type + "Key";
            }
            var modifiers = ["alt", "ctrl", "shift"];
            var expectedModifiers = [];
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if (modifiers.indexOf(key) >= 0) {
                    expectedModifiers.push(key);
                    if (!event[propertyName(key)]) {
                        return false;
                    }
                }
                else if (event.keyCode != Keyboard_1.Keyboard.keys[key]) {
                    return false;
                }
            }
            // Ignores the key combination if there are extra modifiers being pressed
            for (var _a = 0, modifiers_1 = modifiers; _a < modifiers_1.length; _a++) {
                var modifier = modifiers_1[_a];
                if (expectedModifiers.indexOf(modifier) == -1) {
                    if (event[propertyName(modifier)]) {
                        return false;
                    }
                }
            }
            return true;
        };
        System.keyboardObservers = [];
        return System;
    }());
    exports.System = System;
});
/// <reference path="../defs/raphael.d.ts" />
define("interface/State", ["require", "exports", "Settings"], function (require, exports, Settings_6) {
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
        State.prototype.getPosition = function () {
            return {
                x: this.x,
                y: this.y
            };
        };
        State.prototype.setName = function (name) {
            this.name = name;
        };
        State.prototype.setInitial = function (flag) {
            this.initial = flag;
        };
        State.prototype.isInitial = function () {
            return this.initial;
        };
        State.prototype.setFinal = function (flag) {
            this.final = flag;
        };
        State.prototype.isFinal = function () {
            return this.final;
        };
        State.prototype.render = function (canvas) {
            if (!this.body) {
                this.body = canvas.circle(this.x, this.y, Settings_6.Settings.stateRadius);
                this.body.attr("fill", Settings_6.Settings.stateFillColor);
                this.body.attr("stroke", Settings_6.Settings.stateStrokeColor);
                canvas.text(this.x, this.y, this.name).attr({
                    "font-family": Settings_6.Settings.stateLabelFontFamily,
                    "font-size": Settings_6.Settings.stateLabelFontSize
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
                    this.ring = canvas.circle(this.x, this.y, Settings_6.Settings.stateRingRadius);
                    this.ring.attr("stroke", Settings_6.Settings.stateStrokeColor);
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
        State.prototype.node = function () {
            return this.body;
        };
        State.prototype.html = function () {
            if (this.body) {
                return this.body.node;
            }
            return null;
        };
        State.prototype.drag = function (callback) {
            // TODO: find a new home for all these functions
            var self = this;
            var setPosition = function (x, y) {
                self.body.attr({
                    cx: x,
                    cy: y
                });
                if (self.ring) {
                    self.ring.attr({
                        cx: x,
                        cy: y
                    });
                }
                self.setPosition(x, y);
            };
            var maxTravelDistance;
            var begin = function (x, y, event) {
                this.ox = this.attr("cx");
                this.oy = this.attr("cy");
                maxTravelDistance = 0;
                return null;
            };
            var move = function (dx, dy, x, y, event) {
                var trueDx = this.attr("cx") - this.ox;
                var trueDy = this.attr("cy") - this.oy;
                var distanceSquared = trueDx * trueDx + trueDy * trueDy;
                if (distanceSquared > maxTravelDistance) {
                    maxTravelDistance = distanceSquared;
                }
                setPosition(this.ox + dx, this.oy + dy);
                return null;
            };
            var end = function (event) {
                var dx = this.attr("cx") - this.ox;
                var dy = this.attr("cy") - this.oy;
                setPosition(this.ox, this.oy);
                var accepted = callback.call(this, maxTravelDistance, event);
                if (accepted) {
                    setPosition(this.ox + dx, this.oy + dy);
                }
                return null;
            };
            this.body.drag(move, begin, end);
        };
        return State;
    }());
    exports.State = State;
});
/// <reference path="../defs/raphael.d.ts" />
/// <reference path="../defs/jQuery.d.ts" />
define("interface/Mainbar", ["require", "exports", "interface/Renderer", "interface/State", "Settings", "Utils"], function (require, exports, Renderer_4, State_1, Settings_7, Utils_7) {
    "use strict";
    function rotatePoint(point, center, angle) {
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        var copy = {
            x: point.x,
            y: point.y
        };
        copy.x -= center.x;
        copy.y -= center.y;
        var result = {
            x: copy.x * cos - copy.y * sin,
            y: copy.x * sin + copy.y * cos
        };
        return {
            x: result.x + center.x,
            y: result.y + center.y
        };
    }
    var Mainbar = (function (_super) {
        __extends(Mainbar, _super);
        function Mainbar() {
            _super.call(this);
            this.canvas = null;
            this.edgeMode = false;
            this.currentEdge = {
                origin: null,
                target: null,
                body: null
            };
            var self = this;
            $(window).resize(function () {
                self.resizeCanvas();
            });
        }
        Mainbar.prototype.resizeCanvas = function () {
            var canvas = this.canvas;
            if (canvas) {
                var node = $(this.node);
                // allows the parent node to adjust
                canvas.setSize(50, 50);
                var width = node.width();
                var height = node.height() - 10;
                canvas.setSize(width, height);
            }
        };
        Mainbar.prototype.beginEdge = function (state) {
            console.log("[ENTER EDGE MODE]");
            this.edgeMode = true;
            var origin = state.getPosition();
            var edge = this.currentEdge;
            edge.origin = state;
            edge.body = Utils_7.utils.line(this.canvas, origin.x, origin.y, origin.x, origin.y);
        };
        Mainbar.prototype.finishEdge = function (state) {
            console.log("[BUILD EDGE]");
            this.edgeMode = false;
            // Arrow body (i.e a straight line)
            var edge = this.currentEdge;
            var origin = edge.origin.getPosition();
            var target = state.getPosition();
            edge.target = state;
            // edge.body.attr("path", utils.linePath(
            // 	origin.x, origin.y,
            // 	target.x, target.y
            // ));
            // Adjusts the edge so that it points to the border of the state
            // rather than its center
            var dx = target.x - origin.x;
            var dy = target.y - origin.y;
            var angle = Math.atan2(dy, dx);
            var sin = Math.sin(angle);
            var cos = Math.cos(angle);
            var offsetX = Settings_7.Settings.stateRadius * cos;
            var offsetY = Settings_7.Settings.stateRadius * sin;
            target.x -= offsetX;
            target.y -= offsetY;
            dx -= offsetX;
            dy -= offsetY;
            edge.body.attr("path", Utils_7.utils.linePath(origin.x, origin.y, target.x, target.y));
            // Arrow head
            var arrowLength = Settings_7.Settings.edgeArrowLength;
            var alpha = Utils_7.utils.toRadians(Settings_7.Settings.edgeArrowAngle);
            var length = Math.sqrt(dx * dx + dy * dy);
            var u = 1 - arrowLength / length;
            var ref = {
                x: origin.x + u * dx,
                y: origin.y + u * dy
            };
            var p1 = rotatePoint(ref, target, alpha);
            Utils_7.utils.line(this.canvas, p1.x, p1.y, target.x, target.y);
            var p2 = rotatePoint(ref, target, -alpha);
            Utils_7.utils.line(this.canvas, p2.x, p2.y, target.x, target.y);
        };
        Mainbar.prototype.adjustEdge = function (elem, e) {
            var edge = this.currentEdge;
            var origin = edge.origin.getPosition();
            var target = {
                x: e.pageX - elem.offsetLeft,
                y: e.pageY - elem.offsetTop
            };
            var dx = target.x - origin.x;
            var dy = target.y - origin.y;
            // The offsets are necessary to ensure that mouse events are
            // still correctly fired, since not using them makes the edge
            // stay directly below the cursor.
            var x = origin.x + dx * 0.98;
            var y = origin.y + dy * 0.98;
            edge.body.attr("path", Utils_7.utils.linePath(origin.x, origin.y, x, y));
        };
        Mainbar.prototype.onRender = function () {
            // 50x50 is a placeholder size: resizeCanvas() calculates the true size.
            this.canvas = Raphael(this.node, 50, 50);
            this.resizeCanvas();
            var states = [
                new State_1.State(),
                new State_1.State(),
                new State_1.State()
            ];
            states[0].setPosition(120, 120);
            states[0].setFinal(true);
            states[1].setPosition(300, 80);
            states[2].setPosition(340, 320);
            // TODO: separate left click/right click dragging handlers
            var canvas = this.canvas;
            var self = this;
            var _loop_1 = function(state) {
                state.render(canvas);
                state.drag(function (distanceSquared, event) {
                    if (distanceSquared <= Settings_7.Settings.stateDragTolerance) {
                        if (self.edgeMode) {
                            self.finishEdge(state);
                        }
                        else if (Utils_7.utils.isRightClick(event)) {
                            self.beginEdge(state);
                        }
                        else {
                            state.setFinal(!state.isFinal());
                            state.render(canvas);
                        }
                        return false;
                    }
                    return true;
                });
                state.node().mousedown(function (e) {
                    if (Utils_7.utils.isRightClick(e)) {
                        console.log("Initial state changed.");
                        state.setInitial(!state.isInitial());
                        e.preventDefault();
                        return false;
                    }
                });
            };
            for (var _i = 0, states_1 = states; _i < states_1.length; _i++) {
                var state = states_1[_i];
                _loop_1(state);
            }
            $(this.node).contextmenu(function (e) {
                e.preventDefault();
                return false;
            });
            $(this.node).mousemove(function (e) {
                if (self.edgeMode) {
                    self.adjustEdge(this, e);
                }
            });
        };
        return Mainbar;
    }(Renderer_4.Renderer));
    exports.Mainbar = Mainbar;
});
define("interface/UI", ["require", "exports", "Settings", "Utils"], function (require, exports, Settings_8, Utils_8) {
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
                renderer.bind(Utils_8.utils.id(Settings_8.Settings.sidebarID));
            }
            this.sidebarRenderer = renderer;
        };
        UI.prototype.bindMain = function (renderer) {
            if (renderer) {
                renderer.bind(Utils_8.utils.id(Settings_8.Settings.mainbarID));
            }
            this.mainRenderer = renderer;
        };
        return UI;
    }());
    exports.UI = UI;
});
/// <reference path="defs/jQuery.d.ts" />
define("main", ["require", "exports", "interface/Mainbar", "interface/Sidebar", "System", "interface/UI"], function (require, exports, Mainbar_1, Sidebar_1, System_3, UI_1) {
    "use strict";
    $(document).ready(function () {
        var sidebar = new Sidebar_1.Sidebar();
        var mainbar = new Mainbar_1.Mainbar();
        var ui = new UI_1.UI(sidebar, mainbar);
        ui.render();
        System_3.System.bindSidebar(sidebar);
        document.body.addEventListener("keydown", function (e) {
            return System_3.System.keyEvent(e);
        });
    });
});
