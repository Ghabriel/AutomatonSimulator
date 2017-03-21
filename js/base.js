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
            PROMPT_CONFIRM: "Confirmar",
            PROMPT_CANCEL: "Cancelar",
            SELECT_MACHINE: "Seleção de Máquina",
            CLEAR_MACHINE: "Limpar",
            CLEAR_CONFIRMATION: "Deseja realmente limpar o autômato?",
            FA: "Autômato Finito",
            PDA: "Autômato de Pilha",
            LBA: "Autômato Linearmente Limitado",
            RECOGNITION: "Reconhecimento",
            TEST_CASE: "caso de teste",
            FAST_RECOGNITION: "Reconhecimento rápido (R)",
            STEP_RECOGNITION: "Reconhecimento passo-a-passo (N)",
            STOP_RECOGNITION: "Parar reconhecimento passo-a-passo (S)",
            CHANGE_MACHINE_WARNING: "Alterar o tipo de máquina reseta o autômato. Deseja continuar?"
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
            PROMPT_CONFIRM: "Confirm",
            PROMPT_CANCEL: "Cancel",
            SELECT_MACHINE: "Machine Selection",
            CLEAR_MACHINE: "Clear",
            CLEAR_CONFIRMATION: "Do you really want to reset this automaton?",
            FA: "Finite Automaton",
            PDA: "Pushdown Automaton",
            LBA: "Linearly Bounded Automaton",
            RECOGNITION: "Recognition",
            TEST_CASE: "test case",
            FAST_RECOGNITION: "Fast recognition (R)",
            STEP_RECOGNITION: "Step-by-step recognition (N)",
            STOP_RECOGNITION: "Stop step-by-step recognition (S)",
            CHANGE_MACHINE_WARNING: "Changing the machine type resets the automaton. Do you wish to continue?"
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
define("Utils", ["require", "exports", "Keyboard", "Settings", "System"], function (require, exports, Keyboard_1, Settings_1, System_1) {
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
        function toDegrees(angle) {
            return angle * 180 / Math.PI;
        }
        utils.toDegrees = toDegrees;
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
        function async(callback) {
            setTimeout(callback, 0);
        }
        utils.async = async;
        function prompt(message, numFields, success, fail) {
            var blocker = this.create("div", {
                className: "click_blocker"
            });
            var container = this.create("div", {
                id: "system_prompt"
            });
            container.innerHTML = message + "<br>";
            var mainbar = this.id(Settings_1.Settings.mainbarID);
            var dismiss = function () {
                document.body.removeChild(blocker);
                System_1.System.unblockEvents();
                $(container).slideUp(Settings_1.Settings.promptSlideInterval, function () {
                    mainbar.removeChild(container);
                });
            };
            var inputs = [];
            var ok = this.create("input", {
                type: "button",
                value: Settings_1.Strings.PROMPT_CONFIRM,
                click: function () {
                    var contents = [];
                    for (var _i = 0, inputs_1 = inputs; _i < inputs_1.length; _i++) {
                        var input = inputs_1[_i];
                        contents.push(input.value);
                    }
                    dismiss();
                    success(contents);
                }
            });
            var cancel = this.create("input", {
                type: "button",
                value: Settings_1.Strings.PROMPT_CANCEL,
                click: function () {
                    dismiss();
                    if (fail) {
                        fail();
                    }
                }
            });
            for (var i = 0; i < numFields; i++) {
                var input = this.create("input", {
                    type: "text"
                });
                input.addEventListener("keydown", function (e) {
                    if (e.keyCode == Keyboard_1.Keyboard.keys.ENTER) {
                        ok.click();
                    }
                    else if (e.keyCode == Keyboard_1.Keyboard.keys.ESC) {
                        cancel.click();
                    }
                });
                inputs.push(input);
                container.appendChild(input);
            }
            container.appendChild(ok);
            container.appendChild(cancel);
            document.body.insertBefore(blocker, document.body.children[0]);
            System_1.System.blockEvents();
            $(container).toggle();
            mainbar.insertBefore(container, mainbar.children[0]);
            $(container).slideDown(Settings_1.Settings.promptSlideInterval, function () {
                inputs[0].focus();
            });
        }
        utils.prompt = prompt;
    })(utils = exports.utils || (exports.utils = {}));
});
define("interface/State", ["require", "exports", "Settings", "Utils"], function (require, exports, Settings_2, Utils_1) {
    "use strict";
    var State = (function () {
        function State() {
            this.initial = false;
            this.final = false;
            this.name = "";
            this.highlighted = false;
            this.initialMarkOffsets = [];
            this.body = null;
            this.ring = null;
            this.arrowParts = [];
            this.textContainer = null;
            this.radius = Settings_2.Settings.stateRadius;
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
        State.prototype.setName = function (name) {
            this.name = name;
        };
        State.prototype.getName = function () {
            return this.name;
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
            if (this.textContainer) {
                this.textContainer.remove();
                this.textContainer = null;
            }
        };
        State.prototype.render = function (canvas) {
            this.renderBody(canvas);
            this.renderInitialMark(canvas);
            this.renderFinalMark(canvas);
            this.renderText(canvas);
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
            var self = this;
            var begin = function (x, y, event) {
                var position = self.getPosition();
                this.ox = position.x;
                this.oy = position.y;
                return null;
            };
            var moveController = 0;
            var callbackFrequency = 3;
            var move = function (dx, dy, x, y, event) {
                self.setVisualPosition(this.ox + dx, this.oy + dy);
                if (moveController == 0) {
                    moveCallback.call(this, event);
                }
                moveController = (moveController + 1) % callbackFrequency;
                return null;
            };
            var end = function (event) {
                var position = self.getPosition();
                var dx = position.x - this.ox;
                var dy = position.y - this.oy;
                var distanceSquared = dx * dx + dy * dy;
                var accepted = endCallback.call(this, distanceSquared, event);
                if (!accepted && (dx != 0 || dy != 0)) {
                    self.setVisualPosition(this.ox, this.oy);
                    moveCallback.call(this, event);
                }
                return null;
            };
            this.body.drag(move, begin, end);
            if (this.textContainer) {
                this.textContainer.drag(move, begin, end);
            }
        };
        State.prototype.fillColor = function () {
            return this.highlighted ? Settings_2.Settings.stateHighlightFillColor
                : Settings_2.Settings.stateFillColor;
        };
        State.prototype.strokeColor = function () {
            return this.highlighted ? Settings_2.Settings.stateHighlightStrokeColor
                : Settings_2.Settings.stateStrokeColor;
        };
        State.prototype.strokeWidth = function () {
            return this.highlighted ? Settings_2.Settings.stateHighlightStrokeWidth
                : Settings_2.Settings.stateStrokeWidth;
        };
        State.prototype.ringStrokeWidth = function () {
            return this.highlighted ? Settings_2.Settings.stateHighlightRingStrokeWidth
                : Settings_2.Settings.stateRingStrokeWidth;
        };
        State.prototype.renderBody = function (canvas) {
            if (!this.body) {
                this.body = canvas.circle(this.x, this.y, this.radius);
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
            var length = Settings_2.Settings.stateInitialMarkLength;
            var x = this.x - this.radius;
            var y = this.y;
            var arrowLength = Settings_2.Settings.stateInitialMarkHeadLength;
            var alpha = Settings_2.Settings.stateInitialMarkAngle;
            var u = 1 - arrowLength / length;
            var ref = {
                x: x - length + u * length,
                y: y
            };
            var target = { x: x, y: y };
            var p1 = Utils_1.utils.rotatePoint(ref, target, alpha);
            var p2 = Utils_1.utils.rotatePoint(ref, target, -alpha);
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
                var length_1 = Settings_2.Settings.stateInitialMarkLength;
                var x = this.x - this.radius;
                var y = this.y;
                if (this.arrowParts.length) {
                    var parts = this.arrowParts;
                    var body = parts[0];
                    var topLine = parts[1];
                    var bottomLine = parts[2];
                    body.attr("path", Utils_1.utils.linePath(x - length_1, y, x, y));
                    this.updateInitialMarkOffsets();
                    var topOffsets = this.initialMarkOffsets[0];
                    var botOffsets = this.initialMarkOffsets[1];
                    topLine.attr("path", Utils_1.utils.linePath(topOffsets.x + x, topOffsets.y + y, x, y));
                    bottomLine.attr("path", Utils_1.utils.linePath(botOffsets.x + x, botOffsets.y + y, x, y));
                }
                else {
                    var strokeColor = Settings_2.Settings.stateInitialMarkColor;
                    var strokeWidth = Settings_2.Settings.stateInitialMarkThickness;
                    var body = Utils_1.utils.line(canvas, x - length_1, y, x, y);
                    body.attr("stroke", strokeColor);
                    body.attr("stroke-width", strokeWidth);
                    this.updateInitialMarkOffsets();
                    var topOffsets = this.initialMarkOffsets[0];
                    var botOffsets = this.initialMarkOffsets[1];
                    var topLine = Utils_1.utils.line(canvas, topOffsets.x + x, topOffsets.y + y, x, y);
                    topLine.attr("stroke", strokeColor);
                    topLine.attr("stroke-width", strokeWidth);
                    var bottomLine = Utils_1.utils.line(canvas, botOffsets.x + x, botOffsets.y + y, x, y);
                    bottomLine.attr("stroke", strokeColor);
                    bottomLine.attr("stroke-width", strokeWidth);
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
                    this.ring = canvas.circle(this.x, this.y, Settings_2.Settings.stateRingRadius);
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
        State.prototype.renderText = function (canvas) {
            if (!this.textContainer) {
                this.textContainer = canvas.text(this.x, this.y, this.name);
                this.textContainer.attr("font-family", Settings_2.Settings.stateLabelFontFamily);
                this.textContainer.attr("font-size", Settings_2.Settings.stateLabelFontSize);
                this.textContainer.attr("stroke", Settings_2.Settings.stateLabelFontColor);
                this.textContainer.attr("fill", Settings_2.Settings.stateLabelFontColor);
            }
            else {
                this.textContainer.attr("x", this.x);
                this.textContainer.attr("y", this.y);
                this.textContainer.attr("text", this.name);
            }
        };
        State.prototype.setVisualPosition = function (x, y) {
            this.setPosition(x, y);
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
            this.renderText();
        };
        return State;
    }());
    exports.State = State;
});
define("controllers/Controller", ["require", "exports"], function (require, exports) {
    "use strict";
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
        FA.prototype.clear = function () {
            this.stateList = [];
            this.transitions = {};
            this.epsilonTransitions = {};
            this.unsetInitialState();
            this.finalStates.clear();
            this.currentStates.clear();
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
define("controllers/FAController", ["require", "exports", "machines/FA", "Utils"], function (require, exports, FA_1, Utils_2) {
    "use strict";
    var FAController = (function () {
        function FAController() {
            this.stateMapping = {};
            this.stepIndex = -1;
            this.machine = new FA_1.FA();
            window["machine"] = this.machine;
        }
        FAController.prototype.edgePrompt = function (origin, target, callback, fallback) {
            var self = this;
            Utils_2.utils.prompt("Enter the edge content:", 1, function (data) {
                self.createEdge(origin, target, data);
                callback(data, self.edgeDataToText(data));
            }, fallback);
        };
        FAController.prototype.edgeDataToText = function (data) {
            return data[0];
        };
        FAController.prototype.createState = function (state) {
            var name = state.getName();
            var index = this.machine.addState(name);
            this.stateMapping[name] = index;
            if (state.isInitial()) {
                this.machine.setInitialState(index);
            }
            if (state.isFinal()) {
                this.machine.addAcceptingState(index);
            }
        };
        FAController.prototype.createEdge = function (origin, target, data) {
            var indexOrigin = this.index(origin);
            var indexTarget = this.index(target);
            this.machine.addTransition(indexOrigin, indexTarget, data[0]);
        };
        FAController.prototype.changeInitialFlag = function (state) {
            if (state.isInitial()) {
                this.machine.setInitialState(this.index(state));
            }
            else {
                this.machine.unsetInitialState();
            }
        };
        FAController.prototype.changeFinalFlag = function (state) {
            var index = this.index(state);
            if (state.isFinal()) {
                this.machine.addAcceptingState(index);
            }
            else {
                this.machine.removeAcceptingState(index);
            }
        };
        FAController.prototype.clear = function () {
            this.machine.clear();
        };
        FAController.prototype.fastForward = function (input) {
            this.machine.reset();
            for (var i = 0; i < input.length; i++) {
                this.machine.read(input[i]);
            }
        };
        FAController.prototype.step = function (input) {
            if (!this.finished(input)) {
                if (this.stepIndex == -1) {
                    this.machine.reset();
                }
                else {
                    var symbol = input[this.stepIndex];
                    this.machine.read(symbol);
                }
                this.stepIndex++;
            }
        };
        FAController.prototype.stop = function () {
            this.stepIndex = -1;
        };
        FAController.prototype.finished = function (input) {
            return this.stepIndex >= input.length;
        };
        FAController.prototype.currentStates = function () {
            return this.machine.getStates();
        };
        FAController.prototype.accepts = function () {
            return this.machine.accepts();
        };
        FAController.prototype.index = function (state) {
            return this.stateMapping[state.getName()];
        };
        return FAController;
    }());
    exports.FAController = FAController;
});
define("controllers/PDAController", ["require", "exports", "Utils"], function (require, exports, Utils_3) {
    "use strict";
    var PDAController = (function () {
        function PDAController() {
        }
        PDAController.prototype.edgePrompt = function (origin, target, callback, fallback) {
            var epsilon = "ε";
            var self = this;
            Utils_3.utils.prompt("Enter the edge content:", 3, function (data) {
                data[0] = data[0] || epsilon;
                data[1] = data[1] || epsilon;
                data[2] = data[2] || epsilon;
                callback(data, self.edgeDataToText(data));
            }, fallback);
        };
        PDAController.prototype.edgeDataToText = function (data) {
            return data[0] + "," + data[1] + " → " + data[2];
        };
        PDAController.prototype.createState = function (state) { };
        PDAController.prototype.createEdge = function (origin, target, data) { };
        PDAController.prototype.changeInitialFlag = function (state) { };
        PDAController.prototype.changeFinalFlag = function (state) { };
        PDAController.prototype.clear = function () { };
        PDAController.prototype.fastForward = function (input) { };
        PDAController.prototype.step = function (input) { };
        PDAController.prototype.stop = function () { };
        PDAController.prototype.finished = function (input) { return true; };
        PDAController.prototype.currentStates = function () { return []; };
        PDAController.prototype.accepts = function () { return false; };
        return PDAController;
    }());
    exports.PDAController = PDAController;
});
define("controllers/LBAController", ["require", "exports"], function (require, exports) {
    "use strict";
    var LBAController = (function () {
        function LBAController() {
        }
        LBAController.prototype.edgePrompt = function (origin, target, callback, fallback) {
            console.log("[TODO] LBAController::edgePrompt()");
        };
        LBAController.prototype.edgeDataToText = function (data) { return "TODO"; };
        LBAController.prototype.createState = function (state) { };
        LBAController.prototype.createEdge = function (origin, target, data) { };
        LBAController.prototype.changeInitialFlag = function (state) { };
        LBAController.prototype.changeFinalFlag = function (state) { };
        LBAController.prototype.clear = function () { };
        LBAController.prototype.fastForward = function (input) { };
        LBAController.prototype.step = function (input) { };
        LBAController.prototype.stop = function () { };
        LBAController.prototype.finished = function (input) { return true; };
        LBAController.prototype.currentStates = function () { return []; };
        LBAController.prototype.accepts = function () { return false; };
        return LBAController;
    }());
    exports.LBAController = LBAController;
});
define("lists/ControllerList", ["require", "exports", "controllers/FAController", "controllers/PDAController", "controllers/LBAController"], function (require, exports, FAController_1, PDAController_1, LBAController_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(FAController_1);
    __export(PDAController_1);
    __export(LBAController_1);
});
define("interface/Edge", ["require", "exports", "Settings", "Utils"], function (require, exports, Settings_3, Utils_4) {
    "use strict";
    var Edge = (function () {
        function Edge() {
            this.origin = null;
            this.target = null;
            this.prevOriginPosition = null;
            this.prevTargetPosition = null;
            this.virtualTarget = null;
            this.textList = [];
            this.dataList = [];
            this.body = [];
            this.head = [];
            this.textContainer = null;
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
        Edge.prototype.addText = function (text) {
            this.textList.push(text);
        };
        Edge.prototype.getTextList = function () {
            return this.textList;
        };
        Edge.prototype.addData = function (data) {
            this.dataList.push(data);
        };
        Edge.prototype.getDataList = function () {
            return this.dataList;
        };
        Edge.prototype.remove = function () {
            for (var _i = 0, _a = this.body; _i < _a.length; _i++) {
                var elem = _a[_i];
                elem.remove();
            }
            this.body = [];
            for (var _b = 0, _c = this.head; _b < _c.length; _b++) {
                var elem = _c[_b];
                elem.remove();
            }
            this.head = [];
            if (this.textContainer) {
                this.textContainer.remove();
                this.textContainer = null;
            }
        };
        Edge.prototype.render = function (canvas) {
            var preservedOrigin = this.origin
                && Utils_4.utils.samePoint(this.prevOriginPosition, this.origin.getPosition());
            var preservedTarget = this.target
                && Utils_4.utils.samePoint(this.prevTargetPosition, this.target.getPosition());
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
            if (this.target) {
                this.renderText(canvas);
            }
        };
        Edge.prototype.stateCenterOffsets = function (dx, dy) {
            var angle = Math.atan2(dy, dx);
            var sin = Math.sin(angle);
            var cos = Math.cos(angle);
            var offsetX = Settings_3.Settings.stateRadius * cos;
            var offsetY = Settings_3.Settings.stateRadius * sin;
            return {
                x: offsetX,
                y: offsetY
            };
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
            var radius = Settings_3.Settings.stateRadius;
            var offsets = this.stateCenterOffsets(dx, dy);
            if (dx * dx + dy * dy > radius * radius) {
                origin.x += offsets.x;
                origin.y += offsets.y;
            }
            if (this.target) {
                target.x -= offsets.x;
                target.y -= offsets.y;
            }
            if (this.origin == this.target) {
                var pos = this.origin.getPosition();
                if (this.body.length == 1) {
                    this.body[0].remove();
                    this.body = [];
                }
                if (!this.body.length) {
                    this.body.push(Utils_4.utils.line(canvas, pos.x + radius, pos.y, pos.x + 2 * radius, pos.y));
                    this.body.push(Utils_4.utils.line(canvas, pos.x + 2 * radius, pos.y, pos.x + 2 * radius, pos.y - 2 * radius));
                    this.body.push(Utils_4.utils.line(canvas, pos.x + 2 * radius, pos.y - 2 * radius, pos.x, pos.y - 2 * radius));
                    this.body.push(Utils_4.utils.line(canvas, pos.x, pos.y - 2 * radius, pos.x, pos.y - radius));
                }
                else {
                    this.body[0].attr("path", Utils_4.utils.linePath(pos.x + radius, pos.y, pos.x + 2 * radius, pos.y));
                    this.body[1].attr("path", Utils_4.utils.linePath(pos.x + 2 * radius, pos.y, pos.x + 2 * radius, pos.y - 2 * radius));
                    this.body[2].attr("path", Utils_4.utils.linePath(pos.x + 2 * radius, pos.y - 2 * radius, pos.x, pos.y - 2 * radius));
                    this.body[3].attr("path", Utils_4.utils.linePath(pos.x, pos.y - 2 * radius, pos.x, pos.y - radius));
                }
            }
            else {
                if (!this.body.length) {
                    this.body.push(Utils_4.utils.line(canvas, origin.x, origin.y, target.x, target.y));
                }
                else {
                    this.body[0].attr("path", Utils_4.utils.linePath(origin.x, origin.y, target.x, target.y));
                }
            }
        };
        Edge.prototype.renderHead = function (canvas) {
            if (!this.target) {
                return;
            }
            var origin;
            var target;
            var dx;
            var dy;
            if (this.origin == this.target) {
                var pos = this.origin.getPosition();
                var radius = Settings_3.Settings.stateRadius;
                origin = {
                    x: pos.x,
                    y: pos.y - 2 * radius
                };
                target = {
                    x: pos.x,
                    y: pos.y - radius
                };
                dx = 0;
                dy = radius;
            }
            else {
                origin = this.origin.getPosition();
                target = this.target.getPosition();
                dx = target.x - origin.x;
                dy = target.y - origin.y;
                var offsets = this.stateCenterOffsets(dx, dy);
                target.x -= offsets.x;
                target.y -= offsets.y;
                dx -= offsets.x;
                dy -= offsets.y;
            }
            var arrowLength = Settings_3.Settings.edgeArrowLength;
            var alpha = Settings_3.Settings.edgeArrowAngle;
            var edgeLength = Math.sqrt(dx * dx + dy * dy);
            var u = 1 - arrowLength / edgeLength;
            var ref = {
                x: origin.x + u * dx,
                y: origin.y + u * dy
            };
            var p1 = Utils_4.utils.rotatePoint(ref, target, alpha);
            var p2 = Utils_4.utils.rotatePoint(ref, target, -alpha);
            if (!this.head.length) {
                this.head.push(Utils_4.utils.line(canvas, p1.x, p1.y, target.x, target.y));
                this.head.push(Utils_4.utils.line(canvas, p2.x, p2.y, target.x, target.y));
            }
            else {
                this.head[0].attr("path", Utils_4.utils.linePath(p1.x, p1.y, target.x, target.y));
                this.head[1].attr("path", Utils_4.utils.linePath(p2.x, p2.y, target.x, target.y));
            }
        };
        Edge.prototype.preparedText = function () {
            return this.textList.join("\n");
        };
        Edge.prototype.renderText = function (canvas) {
            var origin = this.origin.getPosition();
            var target = this.target.getPosition();
            var x;
            var y;
            if (this.origin == this.target) {
                var radius = Settings_3.Settings.stateRadius;
                x = origin.x + radius;
                y = origin.y - 2 * radius;
            }
            else {
                x = (origin.x + target.x) / 2;
                y = (origin.y + target.y) / 2;
            }
            if (!this.textContainer) {
                this.textContainer = canvas.text(x, y, this.preparedText());
                this.textContainer.attr("font-family", Settings_3.Settings.edgeTextFontFamily);
                this.textContainer.attr("font-size", Settings_3.Settings.edgeTextFontSize);
                this.textContainer.attr("stroke", Settings_3.Settings.edgeTextFontColor);
                this.textContainer.attr("fill", Settings_3.Settings.edgeTextFontColor);
            }
            else {
                this.textContainer.attr("x", x);
                this.textContainer.attr("y", y);
                this.textContainer.attr("text", this.preparedText());
                this.textContainer.transform("");
            }
            var angleRad = Math.atan2(target.y - origin.y, target.x - origin.x);
            var angle = Utils_4.utils.toDegrees(angleRad);
            if (angle < -90 || angle > 90) {
                angle = (angle + 180) % 360;
            }
            this.textContainer.rotate(angle);
            y -= Settings_3.Settings.edgeTextFontSize * .6;
            y -= Settings_3.Settings.edgeTextFontSize * (this.textList.length - 1) * .7;
            this.textContainer.attr("y", y);
        };
        return Edge;
    }());
    exports.Edge = Edge;
});
define("interface/AutomatonRenderer", ["require", "exports", "interface/Edge", "Settings", "interface/State", "Utils"], function (require, exports, Edge_1, Settings_4, State_1, Utils_5) {
    "use strict";
    var AutomatonRenderer = (function () {
        function AutomatonRenderer(canvas, node) {
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
        AutomatonRenderer.prototype.render = function () {
            var state = this.newState("q0");
            state.setPosition(350, 400);
            var groups = [
                [100, 400],
                [350, 150],
                [600, 400],
                [350, 650]
            ];
            var i = 0;
            var controller = Settings_4.Settings.controller();
            for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
                var group = groups_1[_i];
                var s = this.newState("q" + this.stateList.length);
                s.setPosition(group[0], group[1]);
                var e = new Edge_1.Edge();
                if (i == 1) {
                    e.setOrigin(s);
                    e.setTarget(state);
                }
                else {
                    e.setOrigin(state);
                    e.setTarget(s);
                }
                switch (i) {
                    case 0:
                        this.addEdgeData(e, ["b"]);
                        this.addEdgeData(e, ["e"]);
                        break;
                    case 1:
                        this.addEdgeData(e, ["a"]);
                        break;
                    case 2:
                        this.addEdgeData(e, ["c"]);
                        break;
                    case 3:
                        this.addEdgeData(e, ["d"]);
                        break;
                }
                this.edgeList.push(e);
                i++;
            }
            this.setInitialState(this.stateList[2]);
            this.changeFinalFlag(this.stateList[this.stateList.length - 1], true);
            var e1 = new Edge_1.Edge();
            e1.setOrigin(this.stateList[1]);
            e1.setTarget(this.stateList[4]);
            this.addEdgeData(e1, ["b"]);
            this.edgeList.push(e1);
            var e2 = new Edge_1.Edge();
            e2.setOrigin(this.stateList[3]);
            e2.setTarget(this.stateList[4]);
            this.addEdgeData(e2, ["c"]);
            this.edgeList.push(e2);
            var e3 = new Edge_1.Edge();
            e3.setOrigin(this.stateList[1]);
            e3.setTarget(this.stateList[2]);
            this.addEdgeData(e3, ["a"]);
            this.edgeList.push(e3);
            var e4 = new Edge_1.Edge();
            e4.setOrigin(this.stateList[3]);
            e4.setTarget(this.stateList[2]);
            this.addEdgeData(e4, ["a"]);
            this.edgeList.push(e4);
            var e5 = new Edge_1.Edge();
            e5.setOrigin(this.stateList[2]);
            e5.setTarget(this.stateList[2]);
            this.addEdgeData(e5, ["b"]);
            this.edgeList.push(e5);
            this.updateEdges();
            this.bindEvents();
            this.bindShortcuts();
        };
        AutomatonRenderer.prototype.clear = function () {
            for (var _i = 0, _a = this.stateList; _i < _a.length; _i++) {
                var state = _a[_i];
                state.remove();
            }
            this.stateList = [];
            for (var _b = 0, _c = this.edgeList; _b < _c.length; _b++) {
                var edge = _c[_b];
                edge.remove();
            }
            this.edgeList = [];
            this.highlightedState = null;
            this.initialState = null;
            this.edgeMode = false;
            this.currentEdge = null;
            Settings_4.Settings.controller().clear();
        };
        AutomatonRenderer.prototype.empty = function () {
            return this.stateList.length == 0;
        };
        AutomatonRenderer.prototype.save = function () {
            var result = {
                type: Settings_4.Settings.Machine[Settings_4.Settings.currentMachine],
                states: [],
                edges: []
            };
            for (var _i = 0, _a = this.stateList; _i < _a.length; _i++) {
                var state = _a[_i];
                var position = state.getPosition();
                result.states.push({
                    name: state.getName(),
                    initial: state.isInitial(),
                    final: state.isFinal(),
                    x: position.x,
                    y: position.y
                });
            }
            for (var _b = 0, _c = this.edgeList; _b < _c.length; _b++) {
                var edge = _c[_b];
                result.edges.push({
                    origin: edge.getOrigin().getName(),
                    target: edge.getTarget().getName(),
                    dataList: edge.getDataList()
                });
            }
            return JSON.stringify(result);
        };
        AutomatonRenderer.prototype.load = function (content) {
            var self = this;
            var error = function () {
                self.clear();
                alert("Invalid file");
            };
            var obj = {};
            try {
                obj = JSON.parse(content);
            }
            catch (e) {
                error();
                return;
            }
            var machineType = Settings_4.Settings.Machine[Settings_4.Settings.currentMachine];
            var validation = obj.type == machineType
                && obj.states instanceof Array
                && obj.edges instanceof Array;
            if (!validation) {
                error();
                return;
            }
            var nameToIndex = {};
            var controller = Settings_4.Settings.controller();
            for (var _i = 0, _a = obj.states; _i < _a.length; _i++) {
                var data = _a[_i];
                var state = new State_1.State();
                state.setName(data.name);
                state.setInitial(data.initial);
                state.setFinal(data.final);
                state.setPosition(data.x, data.y);
                if (data.initial) {
                    this.initialState = state;
                }
                nameToIndex[data.name] = this.stateList.length;
                this.stateList.push(state);
                controller.createState(state);
            }
            var states = this.stateList;
            for (var _b = 0, _c = obj.edges; _b < _c.length; _b++) {
                var edgeData = _c[_b];
                if (!edgeData.origin || !edgeData.target || !edgeData.dataList) {
                    error();
                    return;
                }
                var edge = new Edge_1.Edge();
                var origin = states[nameToIndex[edgeData.origin]];
                var target = states[nameToIndex[edgeData.target]];
                edge.setOrigin(origin);
                edge.setTarget(target);
                for (var _d = 0, _e = edgeData.dataList; _d < _e.length; _d++) {
                    var data = _e[_d];
                    this.addEdgeData(edge, data);
                }
                this.edgeList.push(edge);
            }
            for (var _f = 0, _g = this.stateList; _f < _g.length; _f++) {
                var state = _g[_f];
                state.render(this.canvas);
                this.bindStateEvents(state);
            }
            for (var _h = 0, _j = this.edgeList; _h < _j.length; _h++) {
                var edge = _j[_h];
                edge.render(this.canvas);
            }
        };
        AutomatonRenderer.prototype.recognitionHighlight = function (stateNames) {
            var nameMapping = {};
            for (var _i = 0, _a = this.stateList; _i < _a.length; _i++) {
                var state = _a[_i];
                nameMapping[state.getName()] = state;
                state.dim();
            }
            for (var _b = 0, stateNames_1 = stateNames; _b < stateNames_1.length; _b++) {
                var name_1 = stateNames_1[_b];
                nameMapping[name_1].highlight();
            }
            for (var _c = 0, _d = this.stateList; _c < _d.length; _c++) {
                var state = _d[_c];
                state.render(this.canvas);
            }
        };
        AutomatonRenderer.prototype.selectState = function (state) {
            if (this.highlightedState) {
                this.highlightedState.dim();
                this.highlightedState.render(this.canvas);
            }
            state.highlight();
            this.highlightedState = state;
            state.render(this.canvas);
        };
        AutomatonRenderer.prototype.bindEvents = function () {
            for (var _i = 0, _a = this.stateList; _i < _a.length; _i++) {
                var state = _a[_i];
                state.render(this.canvas);
                this.bindStateEvents(state);
            }
            var self = this;
            $(this.node).dblclick(function (e) {
                var state = new State_1.State();
                state.setPosition(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
                self.selectState(state);
                self.bindStateEvents(state);
                var stateNamePrompt = function () {
                    Utils_5.utils.prompt("Enter the state name:", 1, function (data) {
                        var name = data[0];
                        for (var _i = 0, _a = self.stateList; _i < _a.length; _i++) {
                            var state_1 = _a[_i];
                            if (state_1.getName() == name) {
                                alert("State name already in use");
                                return stateNamePrompt();
                            }
                        }
                        self.stateList.push(state);
                        state.setName(name);
                        state.render(self.canvas);
                        Settings_4.Settings.controller().createState(state);
                    }, function () {
                        self.highlightedState = null;
                        state.remove();
                    });
                };
                stateNamePrompt();
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
        AutomatonRenderer.prototype.bindStateEvents = function (state) {
            var canvas = this.canvas;
            var self = this;
            state.drag(function () {
                self.updateEdges();
            }, function (distanceSquared, event) {
                if (distanceSquared <= Settings_4.Settings.stateDragTolerance) {
                    if (self.edgeMode) {
                        self.finishEdge(state);
                    }
                    else if (Utils_5.utils.isRightClick(event)) {
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
        AutomatonRenderer.prototype.beginEdge = function (state) {
            this.edgeMode = true;
            this.currentEdge = new Edge_1.Edge();
            this.currentEdge.setOrigin(state);
        };
        AutomatonRenderer.prototype.finishEdge = function (state) {
            this.edgeMode = false;
            var origin = this.currentEdge.getOrigin();
            var edgeText = function (callback, fallback) {
                Settings_4.Settings.controller().edgePrompt(origin, state, function (data, content) {
                    callback(data, content);
                }, fallback);
            };
            var self = this;
            var clearCurrentEdge = function () {
                self.currentEdge.remove();
                self.currentEdge = null;
            };
            var _loop_1 = function(edge) {
                if (edge.getOrigin() == origin && edge.getTarget() == state) {
                    edgeText(function (data, text) {
                        edge.addText(text);
                        edge.addData(data);
                        edge.render(self.canvas);
                        clearCurrentEdge();
                    }, clearCurrentEdge);
                    return { value: void 0 };
                }
            };
            for (var _i = 0, _a = this.edgeList; _i < _a.length; _i++) {
                var edge = _a[_i];
                var state_2 = _loop_1(edge);
                if (typeof state_2 === "object") return state_2.value;
            }
            this.currentEdge.setTarget(state);
            this.currentEdge.render(this.canvas);
            edgeText(function (data, text) {
                self.currentEdge.addText(text);
                self.currentEdge.addData(data);
                self.currentEdge.render(self.canvas);
                self.edgeList.push(self.currentEdge);
                self.currentEdge = null;
            }, clearCurrentEdge);
        };
        AutomatonRenderer.prototype.adjustEdge = function (elem, e) {
            var target = {
                x: e.pageX - elem.offsetLeft,
                y: e.pageY - elem.offsetTop
            };
            this.currentEdge.setVirtualTarget(target);
            this.currentEdge.render(this.canvas);
        };
        AutomatonRenderer.prototype.updateEdges = function () {
            for (var _i = 0, _a = this.edgeList; _i < _a.length; _i++) {
                var edge = _a[_i];
                edge.render(this.canvas);
            }
        };
        AutomatonRenderer.prototype.clearSelection = function () {
            this.highlightedState = null;
            if (this.edgeMode) {
                this.edgeMode = false;
                this.currentEdge.remove();
                this.currentEdge = null;
            }
        };
        AutomatonRenderer.prototype.newState = function (name) {
            var state = new State_1.State();
            state.setName(name);
            this.stateList.push(state);
            Settings_4.Settings.controller().createState(state);
            return state;
        };
        AutomatonRenderer.prototype.setInitialState = function (state) {
            var controller = Settings_4.Settings.controller();
            if (state == this.initialState) {
                state.setInitial(false);
                controller.changeInitialFlag(state);
                this.initialState = null;
            }
            else {
                if (this.initialState) {
                    this.initialState.setInitial(false);
                    controller.changeInitialFlag(this.initialState);
                    this.initialState.render(this.canvas);
                }
                state.setInitial(true);
                controller.changeInitialFlag(state);
                console.log(state);
                this.initialState = state;
            }
        };
        AutomatonRenderer.prototype.changeFinalFlag = function (state, value) {
            state.setFinal(value);
            Settings_4.Settings.controller().changeFinalFlag(state);
        };
        AutomatonRenderer.prototype.addEdgeData = function (edge, data) {
            var controller = Settings_4.Settings.controller();
            edge.addText(controller.edgeDataToText(data));
            edge.addData(data);
            controller.createEdge(edge.getOrigin(), edge.getTarget(), data);
        };
        AutomatonRenderer.prototype.bindShortcuts = function () {
            var canvas = this.canvas;
            var self = this;
            Utils_5.utils.bindShortcut(Settings_4.Settings.shortcuts.toggleInitial, function () {
                var highlightedState = self.highlightedState;
                if (highlightedState) {
                    self.setInitialState(highlightedState);
                    highlightedState.render(self.canvas);
                }
            });
            Utils_5.utils.bindShortcut(Settings_4.Settings.shortcuts.toggleFinal, function () {
                var highlightedState = self.highlightedState;
                if (highlightedState) {
                    self.changeFinalFlag(highlightedState, !highlightedState.isFinal());
                    highlightedState.render(canvas);
                }
            });
            Utils_5.utils.bindShortcut(Settings_4.Settings.shortcuts.dimState, function () {
                var highlightedState = self.highlightedState;
                if (highlightedState) {
                    highlightedState.dim();
                    highlightedState.render(canvas);
                    self.highlightedState = null;
                }
            });
            Utils_5.utils.bindShortcut(Settings_4.Settings.shortcuts.deleteState, function () {
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
            Utils_5.utils.bindShortcut(Settings_4.Settings.shortcuts.clearMachine, function () {
                var confirmation = confirm(Settings_4.Strings.CLEAR_CONFIRMATION);
                if (confirmation) {
                    self.clear();
                }
            });
            Utils_5.utils.bindShortcut(Settings_4.Settings.shortcuts.left, function () {
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
            Utils_5.utils.bindShortcut(Settings_4.Settings.shortcuts.right, function () {
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
            Utils_5.utils.bindShortcut(Settings_4.Settings.shortcuts.up, function () {
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
            Utils_5.utils.bindShortcut(Settings_4.Settings.shortcuts.down, function () {
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
            Utils_5.utils.bindShortcut(Settings_4.Settings.shortcuts.undo, function () {
                alert("TODO: undo");
            });
        };
        AutomatonRenderer.prototype.selectionThreshold = function () {
            return 2 * Settings_4.Settings.stateRadius;
        };
        AutomatonRenderer.prototype.moveStateSelection = function (isViable, isBetterCandidate) {
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
        return AutomatonRenderer;
    }());
    exports.AutomatonRenderer = AutomatonRenderer;
});
define("initializers/initFA", ["require", "exports", "interface/Menu", "Settings", "Utils"], function (require, exports, Menu_1, Settings_5, Utils_6) {
    "use strict";
    var initFA;
    (function (initFA) {
        function init() {
            var menuList = [];
            var menu = new Menu_1.Menu(Settings_5.Strings.RECOGNITION);
            var rows = [];
            buildTestCaseInput(rows);
            buildRecognitionControls(rows);
            for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                var row = rows_1[_i];
                var div = Utils_6.utils.create("div", {
                    className: "row"
                });
                for (var _a = 0, row_1 = row; _a < row_1.length; _a++) {
                    var node = row_1[_a];
                    div.appendChild(node);
                }
                menu.add(div);
            }
            menuList.push(menu);
            Settings_5.Settings.machines[Settings_5.Settings.Machine.FA].sidebar = menuList;
        }
        initFA.init = init;
        var testCaseInput = null;
        function testCase() {
            return testCaseInput.value;
        }
        function buildTestCaseInput(container) {
            var input = Utils_6.utils.create("input", {
                type: "text",
                placeholder: Settings_5.Strings.TEST_CASE
            });
            container.push([input]);
            testCaseInput = input;
        }
        function highlightCurrentStates() {
            var states = Settings_5.Settings.controller().currentStates();
            Settings_5.Settings.automatonRenderer.recognitionHighlight(states);
            console.log(Settings_5.Settings.controller().currentStates());
        }
        function buildRecognitionControls(container) {
            var disabledClass = Settings_5.Settings.disabledButtonClass;
            var fastForwardEnabled = true;
            var stopEnabled = false;
            var fastRecognition = Utils_6.utils.create("img", {
                className: "image_button",
                src: "images/fastforward.svg",
                title: Settings_5.Strings.FAST_RECOGNITION,
                click: function () {
                    if (fastForwardEnabled) {
                        var input = testCase();
                        Settings_5.Settings.controller().fastForward(input);
                        highlightCurrentStates();
                    }
                }
            });
            var stopRecognition = Utils_6.utils.create("img", {
                className: "image_button " + disabledClass,
                src: "images/stop.svg",
                title: Settings_5.Strings.STOP_RECOGNITION
            });
            stopRecognition.addEventListener("click", function () {
                if (stopEnabled) {
                    Settings_5.Settings.controller().stop();
                    fastForwardEnabled = true;
                    fastRecognition.classList.remove(disabledClass);
                    testCaseInput.disabled = false;
                    stopEnabled = false;
                    stopRecognition.classList.add(disabledClass);
                }
            });
            var stepRecognition = Utils_6.utils.create("img", {
                className: "image_button",
                src: "images/play.svg",
                title: Settings_5.Strings.STEP_RECOGNITION,
                click: function () {
                    fastForwardEnabled = false;
                    fastRecognition.classList.add(disabledClass);
                    testCaseInput.disabled = true;
                    stopEnabled = true;
                    stopRecognition.classList.remove(disabledClass);
                    var input = testCase();
                    var controller = Settings_5.Settings.controller();
                    if (!controller.finished(input)) {
                        controller.step(input);
                        highlightCurrentStates();
                    }
                }
            });
            container.push([fastRecognition, stepRecognition,
                stopRecognition]);
            Utils_6.utils.bindShortcut(Settings_5.Settings.shortcuts.fastForward, function () {
                fastRecognition.click();
            });
            Utils_6.utils.bindShortcut(Settings_5.Settings.shortcuts.step, function () {
                stepRecognition.click();
            });
            Utils_6.utils.bindShortcut(Settings_5.Settings.shortcuts.stop, function () {
                stopRecognition.click();
            });
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
define("Initializer", ["require", "exports", "lists/InitializerList", "Utils"], function (require, exports, init, Utils_7) {
    "use strict";
    var Initializer = (function () {
        function Initializer() {
        }
        Initializer.exec = function () {
            this.initSidebars();
        };
        Initializer.initSidebars = function () {
            Utils_7.utils.foreach(init, function (moduleName, obj) {
                obj.init();
            });
        };
        return Initializer;
    }());
    exports.Initializer = Initializer;
});
define("Settings", ["require", "exports", "lists/LanguageList", "lists/MachineList", "lists/ControllerList", "Initializer", "Utils"], function (require, exports, lang, automata, controllers, Initializer_1, Utils_8) {
    "use strict";
    var Settings;
    (function (Settings) {
        Settings.sidebarID = "sidebar";
        Settings.mainbarID = "mainbar";
        Settings.disabledButtonClass = "disabled";
        Settings.menuSlideInterval = 300;
        Settings.promptSlideInterval = 200;
        Settings.machineSelRows = 3;
        Settings.machineSelColumns = 1;
        Settings.stateRadius = 32;
        Settings.stateRingRadius = 27;
        Settings.stateDragTolerance = 50;
        Settings.stateFillColor = "white";
        Settings.stateStrokeColor = "black";
        Settings.stateStrokeWidth = 1;
        Settings.stateRingStrokeWidth = 1;
        Settings.stateLabelFontFamily = "arial";
        Settings.stateLabelFontSize = 20;
        Settings.stateLabelFontColor = "black";
        Settings.stateInitialMarkLength = 40;
        Settings.stateInitialMarkHeadLength = 15;
        Settings.stateInitialMarkAngle = Utils_8.utils.toRadians(20);
        Settings.stateInitialMarkColor = "blue";
        Settings.stateInitialMarkThickness = 2;
        Settings.stateHighlightFillColor = "#FFD574";
        Settings.stateHighlightStrokeColor = "red";
        Settings.stateHighlightStrokeWidth = 3;
        Settings.stateHighlightRingStrokeWidth = 2;
        Settings.edgeArrowLength = 30;
        Settings.edgeArrowAngle = Utils_8.utils.toRadians(30);
        Settings.edgeTextFontFamily = "arial";
        Settings.edgeTextFontSize = 20;
        Settings.edgeTextFontColor = "black";
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
            undo: ["ctrl", "Z"],
            fastForward: ["R"],
            step: ["N"],
            stop: ["S"]
        };
        Settings.languages = lang;
        Settings.Machine = automata.Machine;
        Settings.language = lang.english;
        Settings.currentMachine = 0;
        Settings.machines = {};
        Settings.controllerMap = {};
        Settings.automatonRenderer = null;
        function controller() {
            return this.machines[this.currentMachine].controller;
        }
        Settings.controller = controller;
        var firstUpdate = true;
        function update() {
            if (firstUpdate) {
                for (var index in Settings.Machine) {
                    if (Settings.Machine.hasOwnProperty(index) && !isNaN(parseInt(index))) {
                        Settings.controllerMap[index] = new controllers[Settings.Machine[index] + "Controller"]();
                    }
                }
            }
            var machineList = {};
            for (var index in Settings.Machine) {
                if (Settings.Machine.hasOwnProperty(index) && !isNaN(parseInt(index))) {
                    machineList[index] = {
                        name: Settings.language.strings[Settings.Machine[index]],
                        sidebar: [],
                        controller: Settings.controllerMap[index]
                    };
                }
            }
            Utils_8.utils.foreach(machineList, function (key, value) {
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
});
define("interface/Menu", ["require", "exports", "interface/Renderer", "Settings", "Utils"], function (require, exports, Renderer_1, Settings_6, Utils_9) {
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
            var wrapper = Utils_9.utils.create("div");
            wrapper.classList.add("menu");
            var title = Utils_9.utils.create("div");
            title.classList.add("title");
            title.innerHTML = this.title;
            wrapper.appendChild(title);
            var content = Utils_9.utils.create("div");
            content.classList.add("content");
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var child = _a[_i];
                content.appendChild(child);
            }
            wrapper.appendChild(content);
            node.appendChild(wrapper);
            title.addEventListener("click", function () {
                if (!$(content).is(":animated")) {
                    $(content).slideToggle(Settings_6.Settings.menuSlideInterval);
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
define("interface/Table", ["require", "exports", "interface/Renderer", "Utils"], function (require, exports, Renderer_2, Utils_10) {
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
            var wrapper = Utils_10.utils.create("table");
            var index = 0;
            for (var i = 0; i < this.numRows; i++) {
                var tr = Utils_10.utils.create("tr");
                for (var j = 0; j < this.numColumns; j++) {
                    var td = Utils_10.utils.create("td");
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
define("interface/Sidebar", ["require", "exports", "interface/Menu", "interface/Renderer", "Settings", "Settings", "System", "interface/Table", "Utils"], function (require, exports, Menu_2, Renderer_3, Settings_7, Settings_8, System_2, Table_1, Utils_11) {
    "use strict";
    var Sidebar = (function (_super) {
        __extends(Sidebar, _super);
        function Sidebar() {
            _super.call(this);
            this.build();
        }
        Sidebar.prototype.build = function () {
            this.languageSelection = new Menu_2.Menu(Settings_8.Strings.SELECT_LANGUAGE);
            this.fileManipulation = new Menu_2.Menu(Settings_8.Strings.FILE_MENUBAR);
            this.machineSelection = new Menu_2.Menu(Settings_8.Strings.SELECT_MACHINE);
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
            this.otherMenus = Settings_7.Settings.machines[machine].sidebar;
            for (var _b = 0, _c = this.otherMenus; _b < _c.length; _b++) {
                var menu = _c[_b];
                menu.bind(this.node);
            }
        };
        Sidebar.prototype.buildLanguageSelection = function () {
            var select = Utils_11.utils.create("select");
            var languages = Settings_7.Settings.languages;
            var languageTable = {};
            var i = 0;
            Utils_11.utils.foreach(languages, function (moduleName, obj) {
                var option = Utils_11.utils.create("option");
                option.value = i.toString();
                option.innerHTML = obj.strings.LANGUAGE_NAME;
                select.appendChild(option);
                languageTable[i] = moduleName;
                if (obj == Settings_7.Settings.language) {
                    select.selectedIndex = i;
                }
                i++;
            });
            this.languageSelection.clear();
            this.languageSelection.add(select);
            this.languageSelection.toggle();
            select.addEventListener("change", function (e) {
                var node = this;
                var option = node.options[node.selectedIndex];
                var index = option.value;
                var name = option.innerHTML;
                var confirmation = confirm(Settings_8.Strings.CHANGE_LANGUAGE.replace("%", name));
                if (confirmation) {
                    System_2.System.changeLanguage(languages[languageTable[index]]);
                }
            });
        };
        Sidebar.prototype.buildFileManipulation = function () {
            this.fileManipulation.clear();
            var save = Utils_11.utils.create("input", {
                className: "file_manip_btn",
                type: "button",
                value: Settings_8.Strings.SAVE,
                click: function () {
                    var content = Settings_7.Settings.automatonRenderer.save();
                    var blob = new Blob([content], { type: "text/plain; charset=utf-8" });
                    saveAs(blob, "file.txt");
                }
            });
            Utils_11.utils.bindShortcut(Settings_7.Settings.shortcuts.save, function () {
                save.click();
            });
            this.fileManipulation.add(save);
            var fileSelector = Utils_11.utils.create("input", {
                id: "file_selector",
                type: "file"
            });
            fileSelector.addEventListener("change", function (e) {
                var file = e.target.files[0];
                this.value = "";
                if (file) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        Settings_7.Settings.automatonRenderer.load(e.target.result);
                    };
                    reader.readAsText(file);
                }
            });
            var open = Utils_11.utils.create("input", {
                className: "file_manip_btn",
                type: "button",
                value: Settings_8.Strings.OPEN,
                click: function () {
                    fileSelector.click();
                    this.blur();
                }
            });
            Utils_11.utils.bindShortcut(Settings_7.Settings.shortcuts.open, function () {
                open.click();
            });
            this.fileManipulation.add(open);
        };
        Sidebar.prototype.buildMachineSelection = function () {
            var table = new Table_1.Table(Settings_7.Settings.machineSelRows, Settings_7.Settings.machineSelColumns);
            var machineButtonMapping = {};
            var self = this;
            Utils_11.utils.foreach(Settings_7.Settings.machines, function (type, props) {
                var button = Utils_11.utils.create("input");
                button.classList.add("machine_selection_btn");
                button.type = "button";
                button.value = props.name;
                button.disabled = (type == Settings_7.Settings.currentMachine);
                button.addEventListener("click", function () {
                    if (Settings_7.Settings.automatonRenderer.empty()
                        || confirm(Settings_8.Strings.CHANGE_MACHINE_WARNING)) {
                        Settings_7.Settings.automatonRenderer.clear();
                        machineButtonMapping[Settings_7.Settings.currentMachine].disabled = false;
                        machineButtonMapping[type].disabled = true;
                        machineButtonMapping[type].blur();
                        Settings_7.Settings.currentMachine = type;
                        self.loadMachine(type);
                        self.renderDynamicMenus();
                    }
                });
                table.add(button);
                machineButtonMapping[type] = button;
            });
            Utils_11.utils.bindShortcut(["M"], function () {
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
            this.loadMachine(Settings_7.Settings.currentMachine);
        };
        return Sidebar;
    }(Renderer_3.Renderer));
    exports.Sidebar = Sidebar;
});
define("System", ["require", "exports", "Keyboard", "Settings", "Utils"], function (require, exports, Keyboard_2, Settings_9, Utils_12) {
    "use strict";
    var System = (function () {
        function System() {
        }
        System.changeLanguage = function (language) {
            Settings_9.Settings.changeLanguage(language);
            this.reload();
        };
        System.reload = function () {
            Utils_12.utils.id(Settings_9.Settings.sidebarID).innerHTML = "";
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
        System.blockEvents = function () {
            this.eventBlock = true;
        };
        System.unblockEvents = function () {
            this.eventBlock = false;
        };
        System.shortcutMatches = function (event, keys) {
            if (this.eventBlock) {
                return false;
            }
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
                else if (event.keyCode != Keyboard_2.Keyboard.keys[key]) {
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
        System.eventBlock = false;
        return System;
    }());
    exports.System = System;
});
define("interface/Mainbar", ["require", "exports", "interface/AutomatonRenderer", "interface/Renderer", "Settings"], function (require, exports, AutomatonRenderer_1, Renderer_4, Settings_10) {
    "use strict";
    var Mainbar = (function (_super) {
        __extends(Mainbar, _super);
        function Mainbar() {
            _super.call(this);
            this.canvas = null;
            this.automatonRenderer = null;
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
            this.automatonRenderer = new AutomatonRenderer_1.AutomatonRenderer(this.canvas, this.node);
            Settings_10.Settings.automatonRenderer = this.automatonRenderer;
        };
        Mainbar.prototype.onRender = function () {
            this.automatonRenderer.render();
        };
        return Mainbar;
    }(Renderer_4.Renderer));
    exports.Mainbar = Mainbar;
});
define("interface/UI", ["require", "exports", "interface/Mainbar", "Settings", "interface/Sidebar", "System", "Utils"], function (require, exports, Mainbar_1, Settings_11, Sidebar_1, System_3, Utils_13) {
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
            renderer.bind(Utils_13.utils.id(Settings_11.Settings.sidebarID));
            this.sidebarRenderer = renderer;
        };
        UI.prototype.bindMain = function (renderer) {
            renderer.bind(Utils_13.utils.id(Settings_11.Settings.mainbarID));
            this.mainRenderer = renderer;
        };
        return UI;
    }());
    exports.UI = UI;
});
define("main", ["require", "exports", "Settings", "System", "interface/UI"], function (require, exports, Settings_12, System_4, UI_1) {
    "use strict";
    Settings_12.Settings.update();
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
