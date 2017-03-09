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
            "ESC": 27,
            "DELETE": 46,
            "LEFT": 37,
            "UP": 38,
            "RIGHT": 39,
            "DOWN": 40,
            "+": 61,
            "-": 173
        };
    })(Keyboard = exports.Keyboard || (exports.Keyboard = {}));
});
define("lists/MachineList", ["require", "exports"], function (require, exports) {
    "use strict";
    (function (Machine) {
        Machine[Machine["FA"] = 0] = "FA";
        Machine[Machine["PDA"] = 1] = "PDA";
        Machine[Machine["LBA"] = 2] = "LBA";
    })(exports.Machine || (exports.Machine = {}));
    var Machine = exports.Machine;
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
                this.onRender();
            }
        };
        Renderer.prototype.onBind = function () { };
        return Renderer;
    }());
    exports.Renderer = Renderer;
});
define("languages/Portuguese", ["require", "exports"], function (require, exports) {
    "use strict";
    var portuguese;
    (function (portuguese) {
        portuguese.strings = {
            LANGUAGE_NAME: "Português",
            SELECT_LANGUAGE: "Idioma do Sistema",
            CHANGE_LANGUAGE: "Mudar o idioma para \"%\"?",
            FILE_MENUBAR: "Manipulação de Arquivos",
            SAVE: "Salvar",
            OPEN: "Abrir",
            SELECT_MACHINE: "Seleção de Máquina",
            CLEAR_MACHINE: "Limpar",
            CLEAR_CONFIRMATION: "Deseja realmente limpar o autômato?",
            FA: "Autômato Finito",
            PDA: "Autômato de Pilha",
            LBA: "Autômato Linearmente Limitado",
            RECOGNITION: "Reconhecimento",
            TEST_CASE: "caso de teste",
            FAST_RECOGNITION: "Reconhecimento rápido",
            STEP_RECOGNITION: "Reconhecimento passo-a-passo",
            STOP_RECOGNITION: "Parar reconhecimento passo-a-passo"
        };
    })(portuguese = exports.portuguese || (exports.portuguese = {}));
});
define("languages/English", ["require", "exports"], function (require, exports) {
    "use strict";
    var english;
    (function (english) {
        english.strings = {
            LANGUAGE_NAME: "English",
            SELECT_LANGUAGE: "System Language",
            CHANGE_LANGUAGE: "Change the language to \"%\"?",
            FILE_MENUBAR: "File Manipulation",
            SAVE: "Save",
            OPEN: "Open",
            SELECT_MACHINE: "Machine Selection",
            CLEAR_MACHINE: "Clear",
            CLEAR_CONFIRMATION: "Do you really want to reset this automaton?",
            FA: "Finite Automaton",
            PDA: "Pushdown Automaton",
            LBA: "Linearly Bounded Automaton",
            RECOGNITION: "Recognition",
            TEST_CASE: "test case",
            FAST_RECOGNITION: "Fast recognition",
            STEP_RECOGNITION: "Step-by-step recognition",
            STOP_RECOGNITION: "Stop step-by-step recognition"
        };
    })(english = exports.english || (exports.english = {}));
});
define("lists/LanguageList", ["require", "exports", "languages/Portuguese", "languages/English"], function (require, exports, Portuguese_1, English_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(Portuguese_1);
    __export(English_1);
});
define("datastructures/Queue", ["require", "exports"], function (require, exports) {
    "use strict";
    var Queue = (function () {
        function Queue() {
            this.data = [];
            this.pointer = 0;
        }
        Queue.prototype.push = function (value) {
            this.data.push(value);
        };
        Queue.prototype.front = function () {
            return this.data[this.pointer];
        };
        Queue.prototype.pop = function () {
            var result = this.front();
            this.pointer++;
            if (this.pointer >= this.size() / 2) {
                this.data = this.data.slice(this.pointer);
                this.pointer = 0;
            }
            return result;
        };
        Queue.prototype.clear = function () {
            this.data = [];
            this.pointer = 0;
        };
        Queue.prototype.empty = function () {
            return this.size() == 0;
        };
        Queue.prototype.size = function () {
            return this.data.length - this.pointer;
        };
        return Queue;
    }());
    exports.Queue = Queue;
});
define("datastructures/UnorderedSet", ["require", "exports"], function (require, exports) {
    "use strict";
    var UnorderedSet = (function () {
        function UnorderedSet() {
            this.data = {};
            this.count = 0;
        }
        UnorderedSet.prototype.insert = function (value) {
            if (!this.contains(value)) {
                this.count++;
            }
            this.data[value] = true;
        };
        UnorderedSet.prototype.erase = function (value) {
            if (this.contains(value)) {
                this.count--;
            }
            delete this.data[value];
        };
        UnorderedSet.prototype.contains = function (value) {
            return !!this.data[value];
        };
        UnorderedSet.prototype.clear = function () {
            this.data = {};
            this.count = 0;
        };
        UnorderedSet.prototype.empty = function () {
            return this.size() == 0;
        };
        UnorderedSet.prototype.size = function () {
            return this.count;
        };
        UnorderedSet.prototype.forEach = function (callback) {
            for (var value in this.data) {
                if (this.data.hasOwnProperty(value)) {
                    if (callback(parseFloat(value)) === false) {
                        break;
                    }
                }
            }
        };
        UnorderedSet.prototype.asList = function () {
            var result = [];
            this.forEach(function (value) {
                result.push(value);
            });
            return result;
        };
        return UnorderedSet;
    }());
    exports.UnorderedSet = UnorderedSet;
});
define("machines/FA", ["require", "exports", "datastructures/Queue", "datastructures/UnorderedSet"], function (require, exports, Queue_1, UnorderedSet_1) {
    "use strict";
    var FA = (function () {
        function FA() {
            this.stateList = [];
            this.transitions = {};
            this.epsilonTransitions = {};
            this.initialState = -1;
            this.finalStates = new UnorderedSet_1.UnorderedSet();
            this.currentStates = new UnorderedSet_1.UnorderedSet();
        }
        FA.prototype.addState = function (name) {
            this.stateList.push(name);
            var index = this.numStates() - 1;
            this.transitions[index] = {};
            this.epsilonTransitions[index] = new UnorderedSet_1.UnorderedSet();
            if (this.initialState == -1) {
                this.initialState = index;
                this.reset();
            }
            return index;
        };
        FA.prototype.removeState = function (index) {
        };
        FA.prototype.addTransition = function (source, target, input) {
            var transitions = this.transitions[source];
            if (input == "") {
                this.epsilonTransitions[source].insert(target);
            }
            else {
                if (!transitions.hasOwnProperty(input)) {
                    transitions[input] = new UnorderedSet_1.UnorderedSet();
                }
                transitions[input].insert(target);
            }
        };
        FA.prototype.removeTransition = function (source, target, input) {
            var transitions = this.transitions[source];
            if (input == "") {
                this.epsilonTransitions[source].erase(target);
            }
            else if (transitions.hasOwnProperty(input)) {
                transitions[input].erase(target);
            }
        };
        FA.prototype.setInitialState = function (index) {
            if (index < this.numStates()) {
                this.initialState = index;
            }
        };
        FA.prototype.unsetInitialState = function () {
            this.initialState = -1;
        };
        FA.prototype.getInitialState = function () {
            return this.initialState;
        };
        FA.prototype.addAcceptingState = function (index) {
            this.finalStates.insert(index);
        };
        FA.prototype.removeAcceptingState = function (index) {
            this.finalStates.erase(index);
        };
        FA.prototype.getAcceptingStates = function () {
            return this.finalStates.asList();
        };
        FA.prototype.getStates = function () {
            var result = [];
            var self = this;
            this.currentStates.forEach(function (index) {
                result.push(self.stateList[index]);
            });
            return result;
        };
        FA.prototype.alphabet = function () {
            var result = [];
            return result;
        };
        FA.prototype.read = function (input) {
            var newStates = new UnorderedSet_1.UnorderedSet();
            var self = this;
            this.currentStates.forEach(function (index) {
                var output = self.transition(index, input);
                if (output) {
                    output.forEach(function (state) {
                        newStates.insert(state);
                    });
                }
            });
            this.expandSpontaneous(newStates);
            this.currentStates = newStates;
        };
        FA.prototype.reset = function () {
            this.currentStates.clear();
            this.currentStates.insert(this.initialState);
            this.expandSpontaneous(this.currentStates);
        };
        FA.prototype.accepts = function () {
            var found = false;
            var self = this;
            this.finalStates.forEach(function (final) {
                if (self.currentStates.contains(final)) {
                    found = true;
                    return false;
                }
            });
            return found;
        };
        FA.prototype.error = function () {
            return this.currentStates.size() == 0;
        };
        FA.prototype.numStates = function () {
            return this.stateList.length;
        };
        FA.prototype.transition = function (state, input) {
            return this.transitions[state][input];
        };
        FA.prototype.expandSpontaneous = function (stateList) {
            var queue = new Queue_1.Queue();
            stateList.forEach(function (state) {
                queue.push(state);
            });
            while (!queue.empty()) {
                var state = queue.pop();
                var eps = this.epsilonTransitions[state];
                eps.forEach(function (index) {
                    if (!stateList.contains(index)) {
                        stateList.insert(index);
                        queue.push(index);
                    }
                });
            }
        };
        return FA;
    }());
    exports.FA = FA;
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
        function create(tag, props) {
            var result = document.createElement(tag);
            if (props) {
                this.foreach(props, function (key, value) {
                    if (key == "click") {
                        result.addEventListener("click", value);
                    }
                    else {
                        result[key] = value;
                    }
                });
            }
            return result;
        }
        utils.create = create;
        function foreach(obj, callback) {
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    if (callback(i, obj[i]) === false) {
                        break;
                    }
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
            line.attr("stroke", "black");
            return line;
        }
        utils.line = line;
        function toRadians(angle) {
            return angle * Math.PI / 180;
        }
        utils.toRadians = toRadians;
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
        utils.rotatePoint = rotatePoint;
        function samePoint(p1, p2) {
            return p1 && p2 && p1.x == p2.x && p1.y == p2.y;
        }
        utils.samePoint = samePoint;
        function bindShortcut(keys, callback) {
            System_1.System.addKeyObserver(keys, callback);
        }
        utils.bindShortcut = bindShortcut;
    })(utils = exports.utils || (exports.utils = {}));
});
define("initializers/initFA", ["require", "exports", "interface/Menu", "Settings", "Utils"], function (require, exports, Menu_1, Settings_1, Utils_1) {
    "use strict";
    var initFA;
    (function (initFA) {
        function init() {
            var menuList = [];
            var menu = new Menu_1.Menu(Settings_1.Strings.RECOGNITION);
            var rows = [];
            buildTestCaseInput(rows);
            buildRecognitionControls(rows);
            for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                var row = rows_1[_i];
                var div = Utils_1.utils.create("div", {
                    className: "row"
                });
                for (var _a = 0, row_1 = row; _a < row_1.length; _a++) {
                    var node = row_1[_a];
                    div.appendChild(node);
                }
                menu.add(div);
            }
            menuList.push(menu);
            Settings_1.Settings.machines[Settings_1.Settings.Machine.FA].sidebar = menuList;
        }
        initFA.init = init;
        var testCaseInput = null;
        function testCase() {
            return testCaseInput.value;
        }
        function buildTestCaseInput(container) {
            var input = Utils_1.utils.create("input", {
                type: "text",
                placeholder: Settings_1.Strings.TEST_CASE
            });
            container.push([input]);
            testCaseInput = input;
        }
        function buildRecognitionControls(container) {
            var fastForwardEnabled = true;
            var stopEnabled = false;
            var disabledClass = Settings_1.Settings.disabledButtonClass;
            var fastRecognition = Utils_1.utils.create("img", {
                className: "image_button",
                src: "images/fastforward.svg",
                title: Settings_1.Strings.FAST_RECOGNITION,
                click: function () {
                    if (fastForwardEnabled) {
                        alert("TODO: fast forward");
                    }
                }
            });
            var stopRecognition = Utils_1.utils.create("img", {
                className: "image_button " + disabledClass,
                src: "images/stop.svg",
                title: Settings_1.Strings.STOP_RECOGNITION
            });
            stopRecognition.addEventListener("click", function () {
                if (stopEnabled) {
                    fastForwardEnabled = true;
                    fastRecognition.classList.remove(disabledClass);
                    testCaseInput.disabled = false;
                    stopEnabled = false;
                    stopRecognition.classList.add(disabledClass);
                }
            });
            var stepRecognition = Utils_1.utils.create("img", {
                className: "image_button",
                src: "images/play.svg",
                title: Settings_1.Strings.STEP_RECOGNITION,
                click: function () {
                    fastForwardEnabled = false;
                    fastRecognition.classList.add(disabledClass);
                    testCaseInput.disabled = true;
                    stopEnabled = true;
                    stopRecognition.classList.remove(disabledClass);
                }
            });
            container.push([fastRecognition, stepRecognition,
                stopRecognition]);
        }
    })(initFA = exports.initFA || (exports.initFA = {}));
});
define("initializers/initPDA", ["require", "exports"], function (require, exports) {
    "use strict";
    var initPDA;
    (function (initPDA) {
        function init() {
            console.log("[INIT] PDA");
        }
        initPDA.init = init;
    })(initPDA = exports.initPDA || (exports.initPDA = {}));
});
define("initializers/initLBA", ["require", "exports"], function (require, exports) {
    "use strict";
    var initLBA;
    (function (initLBA) {
        function init() {
            console.log("[INIT] LBA");
        }
        initLBA.init = init;
    })(initLBA = exports.initLBA || (exports.initLBA = {}));
});
define("lists/InitializerList", ["require", "exports", "initializers/initFA", "initializers/initPDA", "initializers/initLBA"], function (require, exports, initFA_1, initPDA_1, initLBA_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(initFA_1);
    __export(initPDA_1);
    __export(initLBA_1);
});
define("Initializer", ["require", "exports", "lists/InitializerList", "Utils"], function (require, exports, init, Utils_2) {
    "use strict";
    var Initializer = (function () {
        function Initializer() {
        }
        Initializer.exec = function () {
            this.initSidebars();
        };
        Initializer.initSidebars = function () {
            Utils_2.utils.foreach(init, function (moduleName, obj) {
                obj.init();
            });
        };
        return Initializer;
    }());
    exports.Initializer = Initializer;
});
define("Settings", ["require", "exports", "lists/LanguageList", "lists/MachineList", "Initializer", "Utils"], function (require, exports, lang, automata, Initializer_1, Utils_3) {
    "use strict";
    var Settings;
    (function (Settings) {
        Settings.sidebarID = "sidebar";
        Settings.mainbarID = "mainbar";
        Settings.disabledButtonClass = "disabled";
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
        Settings.stateStrokeWidth = 1;
        Settings.stateRingStrokeWidth = 1;
        Settings.stateInitialMarkLength = 40;
        Settings.stateInitialMarkHeadLength = 15;
        Settings.stateInitialMarkAngle = Utils_3.utils.toRadians(25);
        Settings.stateHighlightFillColor = "#FFD574";
        Settings.stateHighlightStrokeColor = "red";
        Settings.stateHighlightStrokeWidth = 3;
        Settings.stateHighlightRingStrokeWidth = 2;
        Settings.edgeArrowLength = 30;
        Settings.edgeArrowAngle = Utils_3.utils.toRadians(30);
        Settings.edgeTextFontFamily = "arial";
        Settings.edgeTextFontSize = 20;
        Settings.shortcuts = {
            save: ["ctrl", "S"],
            open: ["ctrl", "O"],
            toggleInitial: ["I"],
            toggleFinal: ["F"],
            dimState: ["ESC"],
            deleteState: ["DELETE"],
            clearMachine: ["C"],
            left: ["LEFT"],
            right: ["RIGHT"],
            up: ["UP"],
            down: ["DOWN"],
            undo: ["ctrl", "Z"]
        };
        Settings.languages = lang;
        Settings.Machine = automata.Machine;
        Settings.language = lang.english;
        Settings.currentMachine = Settings.Machine.FA;
        Settings.machines = {};
        var firstUpdate = true;
        function update() {
            var machineList = {};
            for (var index in Settings.Machine) {
                if (Settings.Machine.hasOwnProperty(index) && !isNaN(parseInt(index))) {
                    machineList[index] = {
                        name: Settings.language.strings[Settings.Machine[index]],
                        sidebar: []
                    };
                }
            }
            Utils_3.utils.foreach(machineList, function (key, value) {
                Settings.machines[key] = value;
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
define("interface/Menu", ["require", "exports", "interface/Renderer", "Settings", "Utils"], function (require, exports, Renderer_1, Settings_2, Utils_4) {
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
            var wrapper = Utils_4.utils.create("div");
            wrapper.classList.add("menu");
            var title = Utils_4.utils.create("div");
            title.classList.add("title");
            title.innerHTML = this.title;
            wrapper.appendChild(title);
            var content = Utils_4.utils.create("div");
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
define("interface/Table", ["require", "exports", "interface/Renderer", "Utils"], function (require, exports, Renderer_2, Utils_5) {
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
            var wrapper = Utils_5.utils.create("table");
            var index = 0;
            for (var i = 0; i < this.numRows; i++) {
                var tr = Utils_5.utils.create("tr");
                for (var j = 0; j < this.numColumns; j++) {
                    var td = Utils_5.utils.create("td");
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
define("interface/Sidebar", ["require", "exports", "interface/Menu", "interface/Renderer", "Settings", "Settings", "System", "interface/Table", "Utils"], function (require, exports, Menu_2, Renderer_3, Settings_3, Settings_4, System_2, Table_1, Utils_6) {
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
            this.renderDynamicMenus();
        };
        Sidebar.prototype.renderDynamicMenus = function () {
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
            var select = Utils_6.utils.create("select");
            var languages = Settings_3.Settings.languages;
            var languageTable = {};
            var i = 0;
            Utils_6.utils.foreach(languages, function (moduleName, obj) {
                var option = Utils_6.utils.create("option");
                option.value = i.toString();
                option.innerHTML = obj.strings.LANGUAGE_NAME;
                select.appendChild(option);
                languageTable[i] = moduleName;
                if (obj == Settings_3.Settings.language) {
                    select.selectedIndex = i;
                }
                i++;
            });
            this.languageSelection.clear();
            this.languageSelection.add(select);
            this.languageSelection.toggle();
            select.addEventListener("change", function (e) {
                var option = this.options[this.selectedIndex];
                var index = option.value;
                var name = option.innerHTML;
                var confirmation = confirm(Settings_4.Strings.CHANGE_LANGUAGE.replace("%", name));
                if (confirmation) {
                    System_2.System.changeLanguage(languages[languageTable[index]]);
                }
            });
        };
        Sidebar.prototype.buildFileManipulation = function () {
            this.fileManipulation.clear();
            var save = Utils_6.utils.create("input");
            save.classList.add("file_manip_btn");
            save.type = "button";
            save.value = Settings_4.Strings.SAVE;
            save.addEventListener("click", function () {
                var content = "Hello, world!";
                var blob = new Blob([content], { type: "text/plain; charset=utf-8" });
                saveAs(blob, "file.txt");
            });
            Utils_6.utils.bindShortcut(Settings_3.Settings.shortcuts.save, function () {
                save.click();
            });
            this.fileManipulation.add(save);
            var open = Utils_6.utils.create("input");
            open.classList.add("file_manip_btn");
            open.type = "button";
            open.value = Settings_4.Strings.OPEN;
            open.addEventListener("click", function () {
                alert("Not yet implemented");
            });
            Utils_6.utils.bindShortcut(Settings_3.Settings.shortcuts.open, function () {
                open.click();
            });
            this.fileManipulation.add(open);
        };
        Sidebar.prototype.buildMachineSelection = function () {
            var table = new Table_1.Table(Settings_3.Settings.machineSelRows, Settings_3.Settings.machineSelColumns);
            var machineButtonMapping = {};
            var self = this;
            Utils_6.utils.foreach(Settings_3.Settings.machines, function (type, props) {
                var button = Utils_6.utils.create("input");
                button.classList.add("machine_selection_btn");
                button.type = "button";
                button.value = props.name;
                button.disabled = (type == Settings_3.Settings.currentMachine);
                button.addEventListener("click", function () {
                    machineButtonMapping[Settings_3.Settings.currentMachine].disabled = false;
                    machineButtonMapping[type].disabled = true;
                    machineButtonMapping[type].blur();
                    Settings_3.Settings.currentMachine = type;
                    self.loadMachine(type);
                    self.renderDynamicMenus();
                });
                table.add(button);
                machineButtonMapping[type] = button;
            });
            Utils_6.utils.bindShortcut(["M"], function () {
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
define("System", ["require", "exports", "Keyboard", "Settings", "Utils"], function (require, exports, Keyboard_1, Settings_5, Utils_7) {
    "use strict";
    var System = (function () {
        function System() {
        }
        System.changeLanguage = function (language) {
            Settings_5.Settings.changeLanguage(language);
            this.reload();
        };
        System.reload = function () {
            Utils_7.utils.id(Settings_5.Settings.sidebarID).innerHTML = "";
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
define("interface/State", ["require", "exports", "Settings", "Utils"], function (require, exports, Settings_6, Utils_8) {
    "use strict";
    var State = (function () {
        function State() {
            this.body = null;
            this.ring = null;
            this.arrowParts = [];
            this.name = "";
            this.initial = false;
            this.final = false;
            this.highlighted = false;
            this.initialMarkOffsets = [];
            this.radius = Settings_6.Settings.stateRadius;
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
        State.prototype.highlight = function () {
            this.highlighted = true;
        };
        State.prototype.dim = function () {
            this.highlighted = false;
        };
        State.prototype.remove = function () {
            if (this.body) {
                this.body.remove();
                this.body = null;
            }
            if (this.ring) {
                this.ring.remove();
                this.ring = null;
            }
            for (var _i = 0, _a = this.arrowParts; _i < _a.length; _i++) {
                var part = _a[_i];
                part.remove();
            }
            this.arrowParts = [];
        };
        State.prototype.fillColor = function () {
            return this.highlighted ? Settings_6.Settings.stateHighlightFillColor
                : Settings_6.Settings.stateFillColor;
        };
        State.prototype.strokeColor = function () {
            return this.highlighted ? Settings_6.Settings.stateHighlightStrokeColor
                : Settings_6.Settings.stateStrokeColor;
        };
        State.prototype.strokeWidth = function () {
            return this.highlighted ? Settings_6.Settings.stateHighlightStrokeWidth
                : Settings_6.Settings.stateStrokeWidth;
        };
        State.prototype.ringStrokeWidth = function () {
            return this.highlighted ? Settings_6.Settings.stateHighlightRingStrokeWidth
                : Settings_6.Settings.stateRingStrokeWidth;
        };
        State.prototype.renderBody = function (canvas) {
            if (!this.body) {
                this.body = canvas.circle(this.x, this.y, this.radius);
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
            this.body.attr("fill", this.fillColor());
            this.body.attr("stroke", this.strokeColor());
            this.body.attr("stroke-width", this.strokeWidth());
        };
        State.prototype.updateInitialMarkOffsets = function () {
            if (this.initialMarkOffsets.length) {
                return this.initialMarkOffsets;
            }
            var length = Settings_6.Settings.stateInitialMarkLength;
            var x = this.x - this.radius;
            var y = this.y;
            var arrowLength = Settings_6.Settings.stateInitialMarkHeadLength;
            var alpha = Settings_6.Settings.stateInitialMarkAngle;
            var u = 1 - arrowLength / length;
            var ref = {
                x: x - length + u * length,
                y: y
            };
            var target = { x: x, y: y };
            var p1 = Utils_8.utils.rotatePoint(ref, target, alpha);
            var p2 = Utils_8.utils.rotatePoint(ref, target, -alpha);
            this.initialMarkOffsets = [
                {
                    x: p1.x - x,
                    y: p1.y - y
                },
                {
                    x: p2.x - x,
                    y: p2.y - y
                }
            ];
        };
        State.prototype.renderInitialMark = function (canvas) {
            if (this.initial) {
                var length_1 = Settings_6.Settings.stateInitialMarkLength;
                var x = this.x - this.radius;
                var y = this.y;
                if (this.arrowParts.length) {
                    var parts = this.arrowParts;
                    var body = parts[0];
                    var topLine = parts[1];
                    var bottomLine = parts[2];
                    body.attr("path", Utils_8.utils.linePath(x - length_1, y, x, y));
                    this.updateInitialMarkOffsets();
                    var topOffsets = this.initialMarkOffsets[0];
                    var botOffsets = this.initialMarkOffsets[1];
                    topLine.attr("path", Utils_8.utils.linePath(topOffsets.x + x, topOffsets.y + y, x, y));
                    bottomLine.attr("path", Utils_8.utils.linePath(botOffsets.x + x, botOffsets.y + y, x, y));
                }
                else {
                    var body = Utils_8.utils.line(canvas, x - length_1, y, x, y);
                    this.updateInitialMarkOffsets();
                    var topOffsets = this.initialMarkOffsets[0];
                    var botOffsets = this.initialMarkOffsets[1];
                    var topLine = Utils_8.utils.line(canvas, topOffsets.x + x, topOffsets.y + y, x, y);
                    var bottomLine = Utils_8.utils.line(canvas, botOffsets.x + x, botOffsets.y + y, x, y);
                    var parts = this.arrowParts;
                    parts.push(body);
                    parts.push(topLine);
                    parts.push(bottomLine);
                }
            }
            else {
                var parts = this.arrowParts;
                while (parts.length) {
                    parts[parts.length - 1].remove();
                    parts.pop();
                }
            }
        };
        State.prototype.renderFinalMark = function (canvas) {
            if (this.final) {
                if (!this.ring) {
                    this.ring = canvas.circle(this.x, this.y, Settings_6.Settings.stateRingRadius);
                }
                else {
                    this.ring.attr({
                        cx: this.x,
                        cy: this.y
                    });
                }
                this.ring.attr("stroke", this.strokeColor());
                this.ring.attr("stroke-width", this.ringStrokeWidth());
            }
            else if (this.ring) {
                this.ring.remove();
                this.ring = null;
            }
        };
        State.prototype.setVisualPosition = function (x, y) {
            this.body.attr({
                cx: x,
                cy: y
            });
            if (this.ring) {
                this.ring.attr({
                    cx: x,
                    cy: y
                });
            }
            if (this.initial) {
                this.renderInitialMark();
            }
            this.setPosition(x, y);
        };
        State.prototype.render = function (canvas) {
            this.renderBody(canvas);
            this.renderInitialMark(canvas);
            this.renderFinalMark(canvas);
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
        State.prototype.drag = function (moveCallback, endCallback) {
            var begin = function (x, y, event) {
                this.ox = this.attr("cx");
                this.oy = this.attr("cy");
                return null;
            };
            var self = this;
            var move = function (dx, dy, x, y, event) {
                self.setVisualPosition(this.ox + dx, this.oy + dy);
                moveCallback.call(this, event);
                return null;
            };
            var end = function (event) {
                var dx = this.attr("cx") - this.ox;
                var dy = this.attr("cy") - this.oy;
                var distanceSquared = dx * dx + dy * dy;
                var accepted = endCallback.call(this, distanceSquared, event);
                if (!accepted) {
                    self.setVisualPosition(this.ox, this.oy);
                    moveCallback.call(this, event);
                }
                return null;
            };
            this.body.drag(move, begin, end);
        };
        return State;
    }());
    exports.State = State;
});
define("interface/Edge", ["require", "exports", "Settings", "Utils"], function (require, exports, Settings_7, Utils_9) {
    "use strict";
    var Edge = (function () {
        function Edge() {
            this.origin = null;
            this.target = null;
            this.prevOriginPosition = null;
            this.prevTargetPosition = null;
            this.virtualTarget = null;
            this.body = null;
            this.head = [];
        }
        Edge.prototype.setOrigin = function (origin) {
            this.origin = origin;
        };
        Edge.prototype.getOrigin = function () {
            return this.origin;
        };
        Edge.prototype.setTarget = function (target) {
            this.target = target;
        };
        Edge.prototype.getTarget = function () {
            return this.target;
        };
        Edge.prototype.setVirtualTarget = function (target) {
            this.virtualTarget = target;
        };
        Edge.prototype.render = function (canvas) {
            var preservedOrigin = this.origin
                && Utils_9.utils.samePoint(this.prevOriginPosition, this.origin.getPosition());
            var preservedTarget = this.target
                && Utils_9.utils.samePoint(this.prevTargetPosition, this.target.getPosition());
            if (!preservedOrigin || !preservedTarget) {
                this.renderBody(canvas);
                this.renderHead(canvas);
                if (this.origin) {
                    this.prevOriginPosition = this.origin.getPosition();
                }
                if (this.target) {
                    this.prevTargetPosition = this.target.getPosition();
                }
            }
        };
        Edge.prototype.remove = function () {
            if (this.body) {
                this.body.remove();
                this.body = null;
            }
            for (var _i = 0, _a = this.head; _i < _a.length; _i++) {
                var elem = _a[_i];
                elem.remove();
            }
            this.head = [];
        };
        Edge.prototype.renderBody = function (canvas) {
            var origin = this.origin.getPosition();
            var target;
            if (!this.target) {
                if (this.virtualTarget) {
                    target = {
                        x: this.virtualTarget.x,
                        y: this.virtualTarget.y
                    };
                    var dx_1 = target.x - origin.x;
                    var dy_1 = target.y - origin.y;
                    target.x = origin.x + dx_1 * 0.98;
                    target.y = origin.y + dy_1 * 0.98;
                }
                else {
                    target = origin;
                }
            }
            else {
                target = this.target.getPosition();
            }
            var dx = target.x - origin.x;
            var dy = target.y - origin.y;
            var angle = Math.atan2(dy, dx);
            var sin = Math.sin(angle);
            var cos = Math.cos(angle);
            var offsetX = Settings_7.Settings.stateRadius * cos;
            var offsetY = Settings_7.Settings.stateRadius * sin;
            origin.x += offsetX;
            origin.y += offsetY;
            if (this.target) {
                target.x -= offsetX;
                target.y -= offsetY;
            }
            if (!this.body) {
                this.body = Utils_9.utils.line(canvas, origin.x, origin.y, target.x, target.y);
            }
            else {
                this.body.attr("path", Utils_9.utils.linePath(origin.x, origin.y, target.x, target.y));
            }
        };
        Edge.prototype.renderHead = function (canvas) {
            if (!this.target) {
                return;
            }
            var origin = this.origin.getPosition();
            var target = this.target.getPosition();
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
            var arrowLength = Settings_7.Settings.edgeArrowLength;
            var alpha = Settings_7.Settings.edgeArrowAngle;
            var edgeLength = Math.sqrt(dx * dx + dy * dy);
            var u = 1 - arrowLength / edgeLength;
            var ref = {
                x: origin.x + u * dx,
                y: origin.y + u * dy
            };
            var p1 = Utils_9.utils.rotatePoint(ref, target, alpha);
            var p2 = Utils_9.utils.rotatePoint(ref, target, -alpha);
            if (!this.head.length) {
                this.head.push(Utils_9.utils.line(canvas, p1.x, p1.y, target.x, target.y));
                this.head.push(Utils_9.utils.line(canvas, p2.x, p2.y, target.x, target.y));
            }
            else {
                this.head[0].attr("path", Utils_9.utils.linePath(p1.x, p1.y, target.x, target.y));
                this.head[1].attr("path", Utils_9.utils.linePath(p2.x, p2.y, target.x, target.y));
            }
        };
        return Edge;
    }());
    exports.Edge = Edge;
});
define("interface/StateRenderer", ["require", "exports", "interface/Edge", "Settings", "interface/State", "Utils"], function (require, exports, Edge_1, Settings_8, State_1, Utils_10) {
    "use strict";
    var StateRenderer = (function () {
        function StateRenderer(canvas, node) {
            this.canvas = null;
            this.node = null;
            this.stateList = [];
            this.edgeList = [];
            this.highlightedState = null;
            this.initialState = null;
            this.edgeMode = false;
            this.currentEdge = null;
            this.canvas = canvas;
            this.node = node;
        }
        StateRenderer.prototype.render = function () {
            var state = new State_1.State();
            state.setPosition(100, 100);
            this.stateList.push(state);
            for (var _i = 0, _a = this.stateList; _i < _a.length; _i++) {
                var state_1 = _a[_i];
                state_1.render(this.canvas);
                this.bindStateEvents(state_1);
            }
            this.bindShortcuts();
            var self = this;
            $(this.node).dblclick(function (e) {
                var state = new State_1.State();
                state.setPosition(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
                self.stateList.push(state);
                self.selectState(state);
                self.bindStateEvents(state);
            });
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
        StateRenderer.prototype.selectState = function (state) {
            if (this.highlightedState) {
                this.highlightedState.dim();
                this.highlightedState.render(this.canvas);
            }
            state.highlight();
            this.highlightedState = state;
            state.render(this.canvas);
        };
        StateRenderer.prototype.bindStateEvents = function (state) {
            var canvas = this.canvas;
            var self = this;
            state.drag(function () {
                self.updateEdges();
            }, function (distanceSquared, event) {
                if (distanceSquared <= Settings_8.Settings.stateDragTolerance) {
                    if (self.edgeMode) {
                        self.finishEdge(state);
                    }
                    else if (Utils_10.utils.isRightClick(event)) {
                        self.beginEdge(state);
                    }
                    else if (state == self.highlightedState) {
                        state.dim();
                        self.highlightedState = null;
                        state.render(canvas);
                    }
                    else {
                        self.selectState(state);
                    }
                    return false;
                }
                return true;
            });
        };
        StateRenderer.prototype.beginEdge = function (state) {
            this.edgeMode = true;
            this.currentEdge = new Edge_1.Edge();
            this.currentEdge.setOrigin(state);
        };
        StateRenderer.prototype.finishEdge = function (state) {
            this.edgeMode = false;
            this.currentEdge.setTarget(state);
            this.currentEdge.render(this.canvas);
            this.edgeList.push(this.currentEdge);
            this.currentEdge = null;
        };
        StateRenderer.prototype.adjustEdge = function (elem, e) {
            var target = {
                x: e.pageX - elem.offsetLeft,
                y: e.pageY - elem.offsetTop
            };
            this.currentEdge.setVirtualTarget(target);
            this.currentEdge.render(this.canvas);
        };
        StateRenderer.prototype.updateEdges = function () {
            for (var _i = 0, _a = this.edgeList; _i < _a.length; _i++) {
                var edge = _a[_i];
                edge.render(this.canvas);
            }
        };
        StateRenderer.prototype.clearSelection = function () {
            this.highlightedState = null;
            if (this.edgeMode) {
                this.edgeMode = false;
                this.currentEdge.remove();
                this.currentEdge = null;
            }
        };
        StateRenderer.prototype.bindShortcuts = function () {
            var canvas = this.canvas;
            var self = this;
            Utils_10.utils.bindShortcut(Settings_8.Settings.shortcuts.toggleInitial, function () {
                var highlightedState = self.highlightedState;
                if (highlightedState) {
                    if (highlightedState == self.initialState) {
                        highlightedState.setInitial(false);
                        self.initialState = null;
                    }
                    else {
                        if (self.initialState) {
                            self.initialState.setInitial(false);
                            self.initialState.render(canvas);
                        }
                        highlightedState.setInitial(true);
                        self.initialState = highlightedState;
                    }
                    highlightedState.render(canvas);
                }
            });
            Utils_10.utils.bindShortcut(Settings_8.Settings.shortcuts.toggleFinal, function () {
                var highlightedState = self.highlightedState;
                if (highlightedState) {
                    highlightedState.setFinal(!highlightedState.isFinal());
                    highlightedState.render(canvas);
                }
            });
            Utils_10.utils.bindShortcut(Settings_8.Settings.shortcuts.dimState, function () {
                var highlightedState = self.highlightedState;
                if (highlightedState) {
                    highlightedState.dim();
                    highlightedState.render(canvas);
                    self.highlightedState = null;
                }
            });
            Utils_10.utils.bindShortcut(Settings_8.Settings.shortcuts.deleteState, function () {
                var highlightedState = self.highlightedState;
                if (highlightedState) {
                    for (var i = 0; i < self.edgeList.length; i++) {
                        var edge = self.edgeList[i];
                        var origin = edge.getOrigin();
                        var target = edge.getTarget();
                        if (origin == highlightedState || target == highlightedState) {
                            edge.remove();
                            self.edgeList.splice(i, 1);
                            i--;
                        }
                    }
                    highlightedState.remove();
                    var states = self.stateList;
                    for (var i = 0; i < states.length; i++) {
                        if (states[i] == highlightedState) {
                            states.splice(i, 1);
                            break;
                        }
                    }
                    self.clearSelection();
                }
            });
            Utils_10.utils.bindShortcut(Settings_8.Settings.shortcuts.clearMachine, function () {
                var confirmation = confirm(Settings_8.Strings.CLEAR_CONFIRMATION);
                if (confirmation) {
                    self.clearSelection();
                    for (var _i = 0, _a = self.edgeList; _i < _a.length; _i++) {
                        var edge = _a[_i];
                        edge.remove();
                    }
                    self.edgeList = [];
                    for (var _b = 0, _c = self.stateList; _b < _c.length; _b++) {
                        var state = _c[_b];
                        state.remove();
                    }
                    self.stateList = [];
                }
            });
            Utils_10.utils.bindShortcut(Settings_8.Settings.shortcuts.left, function () {
                self.moveStateSelection(function (attempt, highlighted) {
                    return attempt.getPosition().x < highlighted.getPosition().x;
                }, function (attempt, currBest, highlighted) {
                    if (!currBest) {
                        return true;
                    }
                    var reference = highlighted.getPosition();
                    var position = attempt.getPosition();
                    var dy = Math.abs(position.y - reference.y);
                    var targetPosition = currBest.getPosition();
                    var targetDy = Math.abs(targetPosition.y - reference.y);
                    var threshold = self.selectionThreshold();
                    if (dy < threshold) {
                        return targetDy >= threshold || position.x > targetPosition.x;
                    }
                    return dy < targetDy;
                });
            });
            Utils_10.utils.bindShortcut(Settings_8.Settings.shortcuts.right, function () {
                self.moveStateSelection(function (attempt, highlighted) {
                    return attempt.getPosition().x > highlighted.getPosition().x;
                }, function (attempt, currBest, highlighted) {
                    if (!currBest) {
                        return true;
                    }
                    var reference = highlighted.getPosition();
                    var position = attempt.getPosition();
                    var dy = Math.abs(position.y - reference.y);
                    var targetPosition = currBest.getPosition();
                    var targetDy = Math.abs(targetPosition.y - reference.y);
                    var threshold = self.selectionThreshold();
                    if (dy < threshold) {
                        return targetDy >= threshold || position.x < targetPosition.x;
                    }
                    return dy < targetDy;
                });
            });
            Utils_10.utils.bindShortcut(Settings_8.Settings.shortcuts.up, function () {
                self.moveStateSelection(function (attempt, highlighted) {
                    return attempt.getPosition().y < highlighted.getPosition().y;
                }, function (attempt, currBest, highlighted) {
                    if (!currBest) {
                        return true;
                    }
                    var reference = highlighted.getPosition();
                    var position = attempt.getPosition();
                    var dx = Math.abs(position.x - reference.x);
                    var targetPosition = currBest.getPosition();
                    var targetDx = Math.abs(targetPosition.x - reference.x);
                    var threshold = self.selectionThreshold();
                    if (dx < threshold) {
                        return targetDx >= threshold || position.y > targetPosition.y;
                    }
                    return dx < targetDx;
                });
            });
            Utils_10.utils.bindShortcut(Settings_8.Settings.shortcuts.down, function () {
                self.moveStateSelection(function (attempt, highlighted) {
                    return attempt.getPosition().y > highlighted.getPosition().y;
                }, function (attempt, currBest, highlighted) {
                    if (!currBest) {
                        return true;
                    }
                    var reference = highlighted.getPosition();
                    var position = attempt.getPosition();
                    var dx = Math.abs(position.x - reference.x);
                    var targetPosition = currBest.getPosition();
                    var targetDx = Math.abs(targetPosition.x - reference.x);
                    var threshold = self.selectionThreshold();
                    if (dx < self.selectionThreshold()) {
                        return targetDx >= threshold || position.y < targetPosition.y;
                    }
                    return dx < targetDx;
                });
            });
            Utils_10.utils.bindShortcut(Settings_8.Settings.shortcuts.undo, function () {
                alert("TODO: undo");
            });
        };
        StateRenderer.prototype.selectionThreshold = function () {
            return 2 * Settings_8.Settings.stateRadius;
        };
        StateRenderer.prototype.moveStateSelection = function (isViable, isBetterCandidate) {
            var highlightedState = this.highlightedState;
            if (highlightedState) {
                var target = null;
                for (var _i = 0, _a = this.stateList; _i < _a.length; _i++) {
                    var state = _a[_i];
                    if (isViable(state, highlightedState)) {
                        if (isBetterCandidate(state, target, highlightedState)) {
                            target = state;
                        }
                    }
                }
                if (target) {
                    this.selectState(target);
                }
            }
        };
        return StateRenderer;
    }());
    exports.StateRenderer = StateRenderer;
});
define("interface/Mainbar", ["require", "exports", "interface/Renderer", "interface/StateRenderer"], function (require, exports, Renderer_4, StateRenderer_1) {
    "use strict";
    var Mainbar = (function (_super) {
        __extends(Mainbar, _super);
        function Mainbar() {
            _super.call(this);
            this.canvas = null;
            this.stateRenderer = null;
            var self = this;
            $(window).resize(function () {
                self.resizeCanvas();
            });
        }
        Mainbar.prototype.resizeCanvas = function () {
            var canvas = this.canvas;
            if (canvas) {
                var node = $(this.node);
                canvas.setSize(50, 50);
                var width = node.width();
                var height = node.height() - 10;
                canvas.setSize(width, height);
            }
        };
        Mainbar.prototype.onBind = function () {
            this.canvas = Raphael(this.node, 0, 0);
            this.resizeCanvas();
            this.stateRenderer = new StateRenderer_1.StateRenderer(this.canvas, this.node);
        };
        Mainbar.prototype.onRender = function () {
            this.stateRenderer.render();
        };
        return Mainbar;
    }(Renderer_4.Renderer));
    exports.Mainbar = Mainbar;
});
define("interface/UI", ["require", "exports", "interface/Mainbar", "Settings", "interface/Sidebar", "System", "Utils"], function (require, exports, Mainbar_1, Settings_9, Sidebar_1, System_3, Utils_11) {
    "use strict";
    var UI = (function () {
        function UI() {
            var sidebar = new Sidebar_1.Sidebar();
            var mainbar = new Mainbar_1.Mainbar();
            this.bindSidebar(sidebar);
            this.bindMain(mainbar);
            System_3.System.bindSidebar(sidebar);
        }
        UI.prototype.render = function () {
            this.sidebarRenderer.render();
            this.mainRenderer.render();
            console.log("Interface ready.");
        };
        UI.prototype.bindSidebar = function (renderer) {
            renderer.bind(Utils_11.utils.id(Settings_9.Settings.sidebarID));
            this.sidebarRenderer = renderer;
        };
        UI.prototype.bindMain = function (renderer) {
            renderer.bind(Utils_11.utils.id(Settings_9.Settings.mainbarID));
            this.mainRenderer = renderer;
        };
        return UI;
    }());
    exports.UI = UI;
});
define("main", ["require", "exports", "System", "interface/UI"], function (require, exports, System_4, UI_1) {
    "use strict";
    $(document).ready(function () {
        var ui = new UI_1.UI();
        ui.render();
        document.body.addEventListener("keydown", function (e) {
            if (document.activeElement.tagName.toLowerCase() != "input") {
                return System_4.System.keyEvent(e);
            }
        });
    });
});
