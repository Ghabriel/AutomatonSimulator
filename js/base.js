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
        Keyboard.symbols = {
            delta: "δ",
            epsilon: "ε",
            sigma: "Σ"
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
            SETTINGS: "Configurações do Sistema",
            CHANGE_LANGUAGE: "Mudar o idioma para \"%\"?",
            SYSTEM_LANGUAGE: "Idioma do sistema",
            UNDO_MAX_COUNT: "Quantidade de 'desfazer'",
            MEMORY_CONSUMPTION_WARNING: "Aumentar o tamanho do histórico aumenta o consumo de memória. Deseja continuar?",
            FILE_MENUBAR: "Manipulação de Arquivos",
            SAVE: "Salvar",
            OPEN: "Abrir",
            INVALID_FILE: "Arquivo inválido",
            PROMPT_CONFIRM: "Confirmar",
            PROMPT_CANCEL: "Cancelar",
            SELECTED_ENTITY: "Entidade selecionada",
            NO_SELECTED_ENTITY: "nenhuma entidade selecionada",
            ORIGIN: "Origem",
            TARGET: "Destino",
            TRANSITIONS: "Transições",
            STATE_NAME: "Nome",
            STATE_IS_INITIAL: "É inicial",
            STATE_IS_FINAL: "É final",
            RENAME_STATE: "renomear",
            TOGGLE_PROPERTY: "alternar",
            CHANGE_PROPERTY: "alterar",
            DELETE_STATE: "Remover estado",
            DELETE_SELECTED_TRANSITION: "Remover transição selecionada",
            DELETE_ALL_TRANSITIONS: "Remover todas as transições",
            YES: "sim",
            NO: "não",
            FORMAL_DEFINITION: "Definição Formal",
            DEFINITION_WHERE_SUFFIX: ", onde:",
            NO_INITIAL_STATE: "nenhum",
            SELECT_MACHINE: "Seleção de Máquina",
            ACTION_LIST: "Ações",
            CREATE_STATE: "Criar estado",
            CREATE_EDGE: "Criar aresta",
            CLEAR_MACHINE: "Limpar máquina",
            CLEAR_CONFIRMATION: "Deseja realmente limpar o autômato?",
            UNDO: "Desfazer",
            CREATE_STATE_INSTRUCTIONS: "clique duplo no local alvo",
            CREATE_EDGE_INSTRUCTIONS: "clique direito na origem e então clique no destino",
            STATE_MANUAL_CREATION: "Digite o nome do estado:",
            EDGE_MANUAL_CREATION: "Escolha a origem e o destino:",
            DUPLICATE_STATE_NAME: "Nome do estado já em uso",
            STATE_RENAME_ACTION: "Digite o novo nome do estado:",
            EDGE_ENTER_NEW_ORIGIN: "Digite a nova origem:",
            EDGE_ENTER_NEW_TARGET: "Digite o novo destino:",
            FA: "Autômato Finito",
            PDA: "Autômato de Pilha",
            LBA: "Autômato Linearmente Limitado",
            FA_ENTER_EDGE_CONTENT: "Digite o conteúdo da aresta (1 caractere):",
            RECOGNITION: "Reconhecimento",
            TEST_CASE: "caso de teste",
            FAST_RECOGNITION: "Reconhecimento rápido (R)",
            STEP_RECOGNITION: "Reconhecimento passo-a-passo (N)",
            STOP_RECOGNITION: "Parar reconhecimento passo-a-passo (S)",
            CHANGE_MACHINE_WARNING: "Alterar o tipo de máquina reseta o autômato. Deseja continuar?",
            INPUT_ACCEPTED: "aceito",
            INPUT_REJECTED: "rejeitado",
            ERROR_INVALID_STATE_NAME: "Nome de estado inválido"
        };
    })(portuguese = exports.portuguese || (exports.portuguese = {}));
});
define("languages/English", ["require", "exports"], function (require, exports) {
    "use strict";
    var english;
    (function (english) {
        english.strings = {
            LANGUAGE_NAME: "English",
            SETTINGS: "System Settings",
            CHANGE_LANGUAGE: "Change the language to \"%\"?",
            SYSTEM_LANGUAGE: "System language",
            UNDO_MAX_COUNT: "Undo max count",
            MEMORY_CONSUMPTION_WARNING: "Increasing the history size increases the memory consumption. Do you wish to continue?",
            FILE_MENUBAR: "File Manipulation",
            SAVE: "Save",
            OPEN: "Open",
            INVALID_FILE: "Invalid file",
            PROMPT_CONFIRM: "Confirm",
            PROMPT_CANCEL: "Cancel",
            SELECTED_ENTITY: "Selected entity",
            NO_SELECTED_ENTITY: "no selected entity",
            ORIGIN: "Origin",
            TARGET: "Target",
            TRANSITIONS: "Transitions",
            STATE_NAME: "Name",
            STATE_IS_INITIAL: "Is initial",
            STATE_IS_FINAL: "Is final",
            RENAME_STATE: "rename",
            TOGGLE_PROPERTY: "toggle",
            CHANGE_PROPERTY: "change",
            DELETE_STATE: "Delete state",
            DELETE_SELECTED_TRANSITION: "Delete selected transition",
            DELETE_ALL_TRANSITIONS: "Delete all transitions",
            YES: "yes",
            NO: "no",
            FORMAL_DEFINITION: "Formal Definition",
            DEFINITION_WHERE_SUFFIX: ", where:",
            NO_INITIAL_STATE: "none",
            SELECT_MACHINE: "Machine Selection",
            ACTION_LIST: "Actions",
            CREATE_STATE: "Create state",
            CREATE_EDGE: "Create edge",
            CLEAR_MACHINE: "Clear machine",
            CLEAR_CONFIRMATION: "Do you really want to reset this automaton?",
            UNDO: "Undo",
            CREATE_STATE_INSTRUCTIONS: "double click on target position",
            CREATE_EDGE_INSTRUCTIONS: "right click on origin then click on target",
            STATE_MANUAL_CREATION: "Enter the state name:",
            EDGE_MANUAL_CREATION: "Choose the origin and destination",
            DUPLICATE_STATE_NAME: "State name already in use",
            STATE_RENAME_ACTION: "Enter the new state name:",
            EDGE_ENTER_NEW_ORIGIN: "Enter a new origin:",
            EDGE_ENTER_NEW_TARGET: "Enter a new target:",
            FA: "Finite Automaton",
            PDA: "Pushdown Automaton",
            LBA: "Linearly Bounded Automaton",
            FA_ENTER_EDGE_CONTENT: "Enter the edge content (1 character):",
            RECOGNITION: "Recognition",
            TEST_CASE: "test case",
            FAST_RECOGNITION: "Fast recognition (R)",
            STEP_RECOGNITION: "Step-by-step recognition (N)",
            STOP_RECOGNITION: "Stop step-by-step recognition (S)",
            CHANGE_MACHINE_WARNING: "Changing the machine type resets the automaton. Do you wish to continue?",
            INPUT_ACCEPTED: "accepted",
            INPUT_REJECTED: "rejected",
            ERROR_INVALID_STATE_NAME: "Invalid state name"
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
define("Browser", ["require", "exports"], function (require, exports) {
    "use strict";
    var Browser;
    (function (Browser) {
        var data = info();
        Browser.name = data.name;
        Browser.version = data.version;
        function info() {
            var ua = navigator.userAgent.toLowerCase();
            var test = function (regex) {
                return regex.test(ua);
            };
            var data = {
                msie: test(/msie/) || test(/trident/),
                edge: test(/edge/),
                firefox: test(/mozilla/) && test(/firefox/),
                chrome: test(/webkit/) && test(/chrome/) && !test(/edge/),
                safari: test(/safari/) && test(/applewebkit/) && !test(/chrome/),
                opera: test(/opera/)
            };
            var browserName = "";
            var version = "Unknown";
            for (var name_1 in data) {
                if (data.hasOwnProperty(name_1) && data[name_1]) {
                    browserName = name_1;
                    var regex = new RegExp(name_1 + "( |/)([0-9]+)");
                    var matches = ua.match(regex);
                    if (matches) {
                        version = matches[2];
                    }
                    else if (matches = ua.match(/rv:([0-9]+)/)) {
                        version = matches[1];
                    }
                }
            }
            return {
                name: browserName,
                version: version
            };
        }
    })(Browser = exports.Browser || (exports.Browser = {}));
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
        function bindShortcut(keys, callback, group) {
            System_1.System.addKeyObserver(keys, callback, group);
        }
        utils.bindShortcut = bindShortcut;
        function lockShortcutGroup(group) {
            System_1.System.lockShortcutGroup(group);
        }
        utils.lockShortcutGroup = lockShortcutGroup;
        function unlockShortcutGroup(group) {
            System_1.System.unlockShortcutGroup(group);
        }
        utils.unlockShortcutGroup = unlockShortcutGroup;
        function async(callback) {
            setTimeout(callback, 0);
        }
        utils.async = async;
        function printShortcut(keys) {
            return keys.join(" ").toLowerCase();
        }
        utils.printShortcut = printShortcut;
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
define("interface/State", ["require", "exports", "Browser", "Settings", "Utils"], function (require, exports, Browser_1, Settings_2, Utils_1) {
    "use strict";
    var State = (function () {
        function State() {
            this.initial = false;
            this.final = false;
            this.name = "";
            this.initialMarkOffsets = [];
            this.defaultPalette = {
                fillColor: Settings_2.Settings.stateFillColor,
                strokeColor: Settings_2.Settings.stateStrokeColor,
                strokeWidth: Settings_2.Settings.stateStrokeWidth,
                ringStrokeWidth: Settings_2.Settings.stateRingStrokeWidth
            };
            this.palette = this.defaultPalette;
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
        State.prototype.applyPalette = function (palette) {
            this.palette = palette;
        };
        State.prototype.removePalette = function () {
            this.palette = this.defaultPalette;
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
            var callbackFrequency;
            if (Browser_1.Browser.name == "chrome") {
                callbackFrequency = 3;
            }
            else {
                callbackFrequency = 4;
            }
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
                }
                moveCallback.call(this, event);
                return null;
            };
            this.body.drag(move, begin, end);
            if (this.textContainer) {
                this.textContainer.drag(move, begin, end);
            }
        };
        State.prototype.fillColor = function () {
            return this.palette.fillColor;
        };
        State.prototype.strokeColor = function () {
            return this.palette.strokeColor;
        };
        State.prototype.strokeWidth = function () {
            return this.palette.strokeWidth;
        };
        State.prototype.ringStrokeWidth = function () {
            return this.palette.ringStrokeWidth;
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
                return;
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
            this.type = typeof value;
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
                    var val = value;
                    if (this.type == "number") {
                        val = parseFloat(value);
                    }
                    if (callback(val) === false) {
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
define("machines/FA", ["require", "exports", "datastructures/Queue", "datastructures/UnorderedSet", "Utils"], function (require, exports, Queue_1, UnorderedSet_1, Utils_2) {
    "use strict";
    var FA = (function () {
        function FA() {
            this.stateList = [];
            this.alphabetSet = {};
            this.transitions = {};
            this.epsilonTransitions = {};
            this.initialState = -1;
            this.finalStates = new UnorderedSet_1.UnorderedSet();
            this.numRemovedStates = 0;
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
            var self = this;
            Utils_2.utils.foreach(this.transitions, function (originIndex, transitions) {
                var origin = parseInt(originIndex);
                Utils_2.utils.foreach(transitions, function (input) {
                    if (transitions[input].contains(index)) {
                        this.removeTransition(origin, index, input);
                    }
                    if (origin == index) {
                        transitions[input].forEach(function (target) {
                            self.removeTransition(index, target, input);
                        });
                    }
                });
            });
            this.stateList[index] = undefined;
            this.numRemovedStates++;
        };
        FA.prototype.renameState = function (index, newName) {
            this.stateList[index] = newName;
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
                if (!this.alphabetSet.hasOwnProperty(input)) {
                    this.alphabetSet[input] = 0;
                }
                this.alphabetSet[input]++;
            }
        };
        FA.prototype.removeTransition = function (source, target, input) {
            var transitions = this.transitions[source];
            if (input == "") {
                this.epsilonTransitions[source].erase(target);
            }
            else if (transitions.hasOwnProperty(input)) {
                transitions[input].erase(target);
                this.alphabetSet[input]--;
                if (this.alphabetSet[input] == 0) {
                    delete this.alphabetSet[input];
                }
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
            return this.stateList[this.initialState];
        };
        FA.prototype.addAcceptingState = function (index) {
            this.finalStates.insert(index);
        };
        FA.prototype.removeAcceptingState = function (index) {
            this.finalStates.erase(index);
        };
        FA.prototype.getAcceptingStates = function () {
            var result = [];
            var self = this;
            this.finalStates.forEach(function (index) {
                result.push(self.stateList[index]);
            });
            return result;
        };
        FA.prototype.getCurrentStates = function () {
            var result = [];
            var self = this;
            this.currentStates.forEach(function (index) {
                result.push(self.stateList[index]);
            });
            return result;
        };
        FA.prototype.getStates = function () {
            return this.stateList.filter(function (value) {
                return value !== undefined;
            });
        };
        FA.prototype.transitionIteration = function (callback) {
            var self = this;
            var _loop_1 = function(index) {
                if (this_1.transitions.hasOwnProperty(index)) {
                    var sourceState_1 = self.stateList[index];
                    var stateTransitions = this_1.transitions[index];
                    var _loop_2 = function(input) {
                        if (stateTransitions.hasOwnProperty(input)) {
                            stateTransitions[input].forEach(function (target) {
                                var targetState = self.stateList[target];
                                callback(sourceState_1, targetState, input);
                            });
                        }
                    };
                    for (var input in stateTransitions) {
                        _loop_2(input);
                    }
                }
            };
            var this_1 = this;
            for (var index in this.transitions) {
                _loop_1(index);
            }
            var _loop_3 = function(index) {
                if (this_2.transitions.hasOwnProperty(index)) {
                    var sourceState_2 = self.stateList[index];
                    var stateTransitions = this_2.epsilonTransitions[index];
                    stateTransitions.forEach(function (target) {
                        var targetState = self.stateList[target];
                        callback(sourceState_2, targetState, "");
                    });
                }
            };
            var this_2 = this;
            for (var index in this.epsilonTransitions) {
                _loop_3(index);
            }
        };
        FA.prototype.alphabet = function () {
            var result = [];
            for (var member in this.alphabetSet) {
                if (this.alphabetSet.hasOwnProperty(member)) {
                    result.push(member);
                }
            }
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
            if (this.initialState != -1) {
                this.currentStates.insert(this.initialState);
                this.expandSpontaneous(this.currentStates);
            }
        };
        FA.prototype.clear = function () {
            this.stateList = [];
            this.alphabetSet = {};
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
                return true;
            });
            return found;
        };
        FA.prototype.error = function () {
            return this.currentStates.size() == 0;
        };
        FA.prototype.numStates = function () {
            return this.stateList.length - this.numRemovedStates;
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
define("controllers/FAController", ["require", "exports", "machines/FA", "Keyboard", "Settings", "Utils"], function (require, exports, FA_1, Keyboard_2, Settings_3, Utils_3) {
    "use strict";
    var FAController = (function () {
        function FAController() {
            this.stateMapping = {};
            this.stepIndex = -1;
            this.editingCallback = function () { };
            this.machine = new FA_1.FA();
        }
        FAController.prototype.edgePrompt = function (callback, fallback) {
            var self = this;
            Utils_3.utils.prompt(Settings_3.Strings.FA_ENTER_EDGE_CONTENT, 1, function (data) {
                callback(data, self.edgeDataToText(data));
            }, fallback);
        };
        FAController.prototype.edgeDataToText = function (data) {
            var epsilon = Keyboard_2.Keyboard.symbols.epsilon;
            return data[0] || epsilon;
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
            this.editingCallback();
        };
        FAController.prototype.createEdge = function (origin, target, data) {
            var indexOrigin = this.index(origin);
            var indexTarget = this.index(target);
            var edgeText = this.edgeDataToText(data);
            this.machine.addTransition(indexOrigin, indexTarget, edgeText);
            this.editingCallback();
        };
        FAController.prototype.changeInitialFlag = function (state) {
            if (state.isInitial()) {
                this.machine.setInitialState(this.index(state));
            }
            else {
                this.machine.unsetInitialState();
            }
            this.editingCallback();
        };
        FAController.prototype.changeFinalFlag = function (state) {
            var index = this.index(state);
            if (state.isFinal()) {
                this.machine.addAcceptingState(index);
            }
            else {
                this.machine.removeAcceptingState(index);
            }
            this.editingCallback();
        };
        FAController.prototype.renameState = function (state, newName) {
            var index = this.index(state);
            delete this.stateMapping[state.getName()];
            this.stateMapping[newName] = index;
            this.machine.renameState(index, newName);
            this.editingCallback();
        };
        FAController.prototype.deleteState = function (state) {
            this.machine.removeState(this.index(state));
            this.editingCallback();
        };
        FAController.prototype.deleteEdge = function (origin, target, data) {
            var indexOrigin = this.index(origin);
            var indexTarget = this.index(target);
            var edgeText = this.edgeDataToText(data);
            this.machine.removeTransition(indexOrigin, indexTarget, edgeText);
            this.editingCallback();
        };
        FAController.prototype.clear = function () {
            this.machine.clear();
            this.editingCallback();
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
        FAController.prototype.isStopped = function () {
            return this.stepIndex == -1;
        };
        FAController.prototype.stepPosition = function () {
            return this.stepIndex;
        };
        FAController.prototype.currentStates = function () {
            return this.machine.getCurrentStates();
        };
        FAController.prototype.accepts = function () {
            return this.machine.accepts();
        };
        FAController.prototype.formalDefinition = function () {
            var machine = this.machine;
            var delta = Keyboard_2.Keyboard.symbols.delta;
            var sigma = Keyboard_2.Keyboard.symbols.sigma;
            var result = {
                tupleSequence: ["Q", sigma, delta, "q0", "F"],
                parameterSequence: ["Q", sigma, "q0", "F", delta],
                parameterValues: {}
            };
            var values = result.parameterValues;
            values["Q"] = machine.getStates();
            values[sigma] = machine.alphabet();
            values[delta] = this.transitionTable();
            values["q0"] = machine.getInitialState();
            values["F"] = machine.getAcceptingStates();
            return result;
        };
        FAController.prototype.setEditingCallback = function (callback) {
            this.editingCallback = callback;
        };
        FAController.prototype.index = function (state) {
            return this.stateMapping[state.getName()];
        };
        FAController.prototype.transitionTable = function () {
            var transitions = [];
            var callback = function (source, target, input) {
                transitions.push([source, target, input]);
            };
            this.machine.transitionIteration(callback);
            return transitions;
        };
        return FAController;
    }());
    exports.FAController = FAController;
});
define("controllers/PDAController", ["require", "exports", "Utils"], function (require, exports, Utils_4) {
    "use strict";
    var PDAController = (function () {
        function PDAController() {
        }
        PDAController.prototype.edgePrompt = function (callback, fallback) {
            var self = this;
            Utils_4.utils.prompt("Enter the edge content:", 3, function (data) {
                callback(data, self.edgeDataToText(data));
            }, fallback);
        };
        PDAController.prototype.edgeDataToText = function (data) {
            var epsilon = "ε";
            var input = data[0] || epsilon;
            var stackRead = data[1] || epsilon;
            var stackWrite = data[2] || epsilon;
            return input + "," + stackRead + " → " + stackWrite;
        };
        PDAController.prototype.createState = function (state) { };
        PDAController.prototype.createEdge = function (origin, target, data) { };
        PDAController.prototype.changeInitialFlag = function (state) { };
        PDAController.prototype.changeFinalFlag = function (state) { };
        PDAController.prototype.renameState = function (state, newName) { };
        PDAController.prototype.deleteState = function (state) { };
        PDAController.prototype.deleteEdge = function (origin, target, data) { };
        PDAController.prototype.clear = function () { };
        PDAController.prototype.fastForward = function (input) { };
        PDAController.prototype.step = function (input) { };
        PDAController.prototype.stop = function () { };
        PDAController.prototype.finished = function (input) { return true; };
        PDAController.prototype.isStopped = function () { return true; };
        PDAController.prototype.stepPosition = function () { return -1; };
        PDAController.prototype.setEditingCallback = function (callback) { };
        PDAController.prototype.currentStates = function () { return []; };
        PDAController.prototype.accepts = function () { return false; };
        PDAController.prototype.formalDefinition = function () { return null; };
        return PDAController;
    }());
    exports.PDAController = PDAController;
});
define("controllers/LBAController", ["require", "exports"], function (require, exports) {
    "use strict";
    var LBAController = (function () {
        function LBAController() {
        }
        LBAController.prototype.edgePrompt = function (callback, fallback) {
            console.log("[TODO] LBAController::edgePrompt()");
        };
        LBAController.prototype.edgeDataToText = function (data) { return "TODO"; };
        LBAController.prototype.createState = function (state) { };
        LBAController.prototype.createEdge = function (origin, target, data) { };
        LBAController.prototype.changeInitialFlag = function (state) { };
        LBAController.prototype.changeFinalFlag = function (state) { };
        LBAController.prototype.renameState = function (state, newName) { };
        LBAController.prototype.deleteState = function (state) { };
        LBAController.prototype.deleteEdge = function (origin, target, data) { };
        LBAController.prototype.clear = function () { };
        LBAController.prototype.fastForward = function (input) { };
        LBAController.prototype.step = function (input) { };
        LBAController.prototype.stop = function () { };
        LBAController.prototype.finished = function (input) { return true; };
        LBAController.prototype.isStopped = function () { return true; };
        LBAController.prototype.stepPosition = function () { return -1; };
        LBAController.prototype.setEditingCallback = function (callback) { };
        LBAController.prototype.currentStates = function () { return []; };
        LBAController.prototype.accepts = function () { return false; };
        LBAController.prototype.formalDefinition = function () { return null; };
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
define("interface/Edge", ["require", "exports", "Settings", "Utils"], function (require, exports, Settings_4, Utils_5) {
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
            this.curved = false;
            this.forcedRender = false;
            this.deleted = false;
            this.defaultColor = Settings_4.Settings.edgeStrokeColor;
            this.color = this.defaultColor;
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
        Edge.prototype.setCurveFlag = function (flag) {
            this.forcedRender = this.forcedRender || (this.curved != flag);
            this.curved = flag;
        };
        Edge.prototype.isCurved = function () {
            return this.curved;
        };
        Edge.prototype.removed = function () {
            return this.deleted;
        };
        Edge.prototype.addClickHandler = function (callback) {
            var self = this;
            for (var _i = 0, _a = this.body; _i < _a.length; _i++) {
                var elem = _a[_i];
                elem.click(function (e) {
                    callback.call(self);
                });
            }
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
            this.deleted = true;
        };
        Edge.prototype.setCustomColor = function (color) {
            this.color = color;
        };
        Edge.prototype.removeCustomColor = function () {
            this.color = this.defaultColor;
        };
        Edge.prototype.render = function (canvas) {
            var preservedOrigin = this.origin
                && Utils_5.utils.samePoint(this.prevOriginPosition, this.origin.getPosition());
            var preservedTarget = this.target
                && Utils_5.utils.samePoint(this.prevTargetPosition, this.target.getPosition());
            if (!preservedOrigin || !preservedTarget || this.forcedRender) {
                this.renderBody(canvas);
                this.renderHead(canvas);
                if (this.origin) {
                    this.prevOriginPosition = this.origin.getPosition();
                }
                if (this.target) {
                    this.prevTargetPosition = this.target.getPosition();
                }
                this.forcedRender = false;
            }
            for (var _i = 0, _a = this.body; _i < _a.length; _i++) {
                var elem = _a[_i];
                elem.attr("stroke", this.strokeColor());
            }
            for (var _b = 0, _c = this.head; _b < _c.length; _b++) {
                var elem = _c[_b];
                elem.attr("stroke", this.strokeColor());
            }
            if (this.target) {
                this.renderText(canvas);
            }
        };
        Edge.prototype.strokeColor = function () {
            return this.color;
        };
        Edge.prototype.stateCenterOffsets = function (dx, dy) {
            var angle = Math.atan2(dy, dx);
            var sin = Math.sin(angle);
            var cos = Math.cos(angle);
            var offsetX = Settings_4.Settings.stateRadius * cos;
            var offsetY = Settings_4.Settings.stateRadius * sin;
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
            var radius = Settings_4.Settings.stateRadius;
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
                this.loop(canvas);
            }
            else if (this.isCurved()) {
                this.curve(canvas, origin, target);
            }
            else {
                this.normal(canvas, origin, target);
            }
        };
        Edge.prototype.adjustBodyLength = function (canvas, length) {
            if (this.body.length == length) {
                return false;
            }
            while (this.body.length > length) {
                this.body[this.body.length - 1].remove();
                this.body.pop();
            }
            while (this.body.length < length) {
                this.body.push(Utils_5.utils.line(canvas, 0, 0, 0, 0));
            }
            return true;
        };
        Edge.prototype.loop = function (canvas) {
            var radius = Settings_4.Settings.stateRadius;
            var pos = this.origin.getPosition();
            if (this.adjustBodyLength(canvas, 4)) {
                for (var _i = 0, _a = this.body; _i < _a.length; _i++) {
                    var elem = _a[_i];
                    elem.attr("stroke-width", Settings_4.Settings.edgeArrowThickness);
                }
            }
            this.body[0].attr("path", Utils_5.utils.linePath(pos.x + radius, pos.y, pos.x + 2 * radius, pos.y));
            this.body[1].attr("path", Utils_5.utils.linePath(pos.x + 2 * radius, pos.y, pos.x + 2 * radius, pos.y - 2 * radius));
            this.body[2].attr("path", Utils_5.utils.linePath(pos.x + 2 * radius, pos.y - 2 * radius, pos.x, pos.y - 2 * radius));
            this.body[3].attr("path", Utils_5.utils.linePath(pos.x, pos.y - 2 * radius, pos.x, pos.y - radius));
        };
        Edge.prototype.curve = function (canvas, origin, target) {
            var dx = target.x - origin.x;
            var dy = target.y - origin.y;
            var hypot = Math.sqrt(dx * dx + dy * dy);
            var perpVector = {
                x: dy / hypot,
                y: -dx / hypot
            };
            var distance = 30;
            var offsets = {
                x: distance * perpVector.x,
                y: distance * perpVector.y
            };
            if (this.adjustBodyLength(canvas, 3)) {
                for (var _i = 0, _a = this.body; _i < _a.length; _i++) {
                    var elem = _a[_i];
                    elem.attr("stroke-width", Settings_4.Settings.edgeArrowThickness);
                }
            }
            this.body[0].attr("path", Utils_5.utils.linePath(origin.x, origin.y, origin.x + offsets.x + dx * 0.125, origin.y + offsets.y + dy * 0.125));
            this.body[1].attr("path", Utils_5.utils.linePath(origin.x + offsets.x + dx * 0.125, origin.y + offsets.y + dy * 0.125, origin.x + offsets.x + dx * 0.875, origin.y + offsets.y + dy * 0.875));
            this.body[2].attr("path", Utils_5.utils.linePath(origin.x + offsets.x + dx * 0.875, origin.y + offsets.y + dy * 0.875, target.x, target.y));
        };
        Edge.prototype.normal = function (canvas, origin, target) {
            if (this.adjustBodyLength(canvas, 1)) {
                for (var _i = 0, _a = this.body; _i < _a.length; _i++) {
                    var elem = _a[_i];
                    elem.attr("stroke-width", Settings_4.Settings.edgeArrowThickness);
                }
            }
            this.body[0].attr("path", Utils_5.utils.linePath(origin.x, origin.y, target.x, target.y));
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
                var radius = Settings_4.Settings.stateRadius;
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
            else if (this.isCurved()) {
                var path = this.body[2].attr("path");
                origin = {
                    x: path[0][1],
                    y: path[0][2]
                };
                target = {
                    x: path[1][1],
                    y: path[1][2]
                };
                dx = target.x - origin.x;
                dy = target.y - origin.y;
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
            var arrowLength = Settings_4.Settings.edgeArrowLength;
            var alpha = Settings_4.Settings.edgeArrowAngle;
            var edgeLength = Math.sqrt(dx * dx + dy * dy);
            var u = 1 - arrowLength / edgeLength;
            var ref = {
                x: origin.x + u * dx,
                y: origin.y + u * dy
            };
            var p1 = Utils_5.utils.rotatePoint(ref, target, alpha);
            var p2 = Utils_5.utils.rotatePoint(ref, target, -alpha);
            if (!this.head.length) {
                this.head.push(Utils_5.utils.line(canvas, 0, 0, 0, 0));
                this.head.push(Utils_5.utils.line(canvas, 0, 0, 0, 0));
                for (var _i = 0, _a = this.head; _i < _a.length; _i++) {
                    var elem = _a[_i];
                    elem.attr("stroke-width", Settings_4.Settings.edgeArrowThickness);
                }
            }
            this.head[0].attr("path", Utils_5.utils.linePath(p1.x, p1.y, target.x, target.y));
            this.head[1].attr("path", Utils_5.utils.linePath(p2.x, p2.y, target.x, target.y));
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
                var radius = Settings_4.Settings.stateRadius;
                x = origin.x + radius;
                y = origin.y - 2 * radius;
            }
            else if (this.isCurved()) {
                var path = this.body[1].attr("path");
                var x1 = path[0][1];
                var y1 = path[0][2];
                var x2 = path[1][1];
                var y2 = path[1][2];
                x = (x1 + x2) / 2;
                y = (y1 + y2) / 2;
            }
            else {
                x = (origin.x + target.x) / 2;
                y = (origin.y + target.y) / 2;
            }
            if (!this.textContainer) {
                this.textContainer = canvas.text(x, y, this.preparedText());
                this.textContainer.attr("font-family", Settings_4.Settings.edgeTextFontFamily);
                this.textContainer.attr("font-size", Settings_4.Settings.edgeTextFontSize);
                this.textContainer.attr("stroke", Settings_4.Settings.edgeTextFontColor);
                this.textContainer.attr("fill", Settings_4.Settings.edgeTextFontColor);
            }
            else {
                this.textContainer.attr("x", x);
                this.textContainer.attr("y", y);
                this.textContainer.attr("text", this.preparedText());
                this.textContainer.transform("");
            }
            var angleRad = Math.atan2(target.y - origin.y, target.x - origin.x);
            var angle = Utils_5.utils.toDegrees(angleRad);
            if (angle < -90 || angle > 90) {
                angle = (angle + 180) % 360;
            }
            this.textContainer.rotate(angle);
            y -= Settings_4.Settings.edgeTextFontSize * .6;
            y -= Settings_4.Settings.edgeTextFontSize * (this.textList.length - 1) * .7;
            this.textContainer.attr("y", y);
        };
        return Edge;
    }());
    exports.Edge = Edge;
});
define("interface/EdgeUtils", ["require", "exports", "Settings"], function (require, exports, Settings_5) {
    "use strict";
    var EdgeUtils;
    (function (EdgeUtils) {
        function addEdgeData(edge, data) {
            var controller = Settings_5.Settings.controller();
            edge.addText(controller.edgeDataToText(data));
            edge.addData(data);
            controller.createEdge(edge.getOrigin(), edge.getTarget(), data);
        }
        EdgeUtils.addEdgeData = addEdgeData;
    })(EdgeUtils = exports.EdgeUtils || (exports.EdgeUtils = {}));
});
define("Memento", ["require", "exports"], function (require, exports) {
    "use strict";
    var Memento = (function () {
        function Memento(limit) {
            this.bottomIndex = 0;
            this.topIndex = -1;
            this.states = {};
            this.limit = limit;
        }
        Memento.prototype.push = function (state) {
            console.log("push", state);
            var limit = this.limit() + 1;
            if (this.topIndex - this.bottomIndex + 1 == limit) {
                delete this.states[this.bottomIndex];
                this.bottomIndex++;
            }
            this.topIndex++;
            this.states[this.topIndex] = state;
        };
        Memento.prototype.pop = function () {
            var data = this.states[this.topIndex - 1];
            delete this.states[this.topIndex];
            this.topIndex--;
            return data;
        };
        return Memento;
    }());
    exports.Memento = Memento;
});
define("Persistence", ["require", "exports", "interface/Edge", "interface/EdgeUtils", "Settings", "interface/State"], function (require, exports, Edge_1, EdgeUtils_1, Settings_6, State_1) {
    "use strict";
    var Persistence;
    (function (Persistence) {
        function save(stateList, edgeList, initialState) {
            var result = [
                Settings_6.Settings.Machine[Settings_6.Settings.currentMachine],
                [],
                [],
                -1
            ];
            var i = 0;
            for (var _i = 0, stateList_1 = stateList; _i < stateList_1.length; _i++) {
                var state = stateList_1[_i];
                var position = state.getPosition();
                result[1].push([
                    state.getName(),
                    state.isFinal() ? 1 : 0,
                    position.x,
                    position.y
                ]);
                if (state == initialState) {
                    result[3] = i;
                }
                i++;
            }
            for (var _a = 0, edgeList_1 = edgeList; _a < edgeList_1.length; _a++) {
                var edge = edgeList_1[_a];
                result[2].push([
                    edge.getOrigin().getName(),
                    edge.getTarget().getName(),
                    edge.getDataList()
                ]);
            }
            return JSON.stringify(result);
        }
        Persistence.save = save;
        function load(content) {
            var loadedData = {
                error: false,
                initialState: null,
                stateList: [],
                edgeList: []
            };
            var obj = [];
            try {
                obj = JSON.parse(content);
            }
            catch (e) {
                loadedData.error = true;
                return loadedData;
            }
            var machineType = Settings_6.Settings.Machine[Settings_6.Settings.currentMachine];
            var validation = obj[0] == machineType
                && obj[1] instanceof Array
                && obj[2] instanceof Array
                && typeof obj[3] == "number"
                && obj.length == 4;
            if (!validation) {
                loadedData.error = true;
                return loadedData;
            }
            var connections = {};
            var nameToIndex = loadStates(obj, loadedData, function (state) {
                connections[state.getName()] = {};
            });
            if (!loadEdges(obj, loadedData, nameToIndex, connections)) {
                loadedData.error = true;
                return loadedData;
            }
            return loadedData;
        }
        Persistence.load = load;
        function loadStates(dataObj, result, callback) {
            var nameToIndex = {};
            var controller = Settings_6.Settings.controller();
            var i = 0;
            for (var _i = 0, _a = dataObj[1]; _i < _a.length; _i++) {
                var data = _a[_i];
                var isInitial = (dataObj[3] == i);
                var state = new State_1.State();
                state.setName(data[0]);
                state.setInitial(isInitial);
                state.setFinal(!!data[1]);
                state.setPosition(data[2], data[3]);
                if (isInitial) {
                    result.initialState = state;
                }
                nameToIndex[data[0]] = i;
                callback(state);
                result.stateList.push(state);
                controller.createState(state);
                i++;
            }
            return nameToIndex;
        }
        function loadEdges(data, result, nameToIndex, connections) {
            var states = result.stateList;
            for (var _i = 0, _a = data[2]; _i < _a.length; _i++) {
                var edgeData = _a[_i];
                if (edgeData.length != 3) {
                    return false;
                }
                var edge = new Edge_1.Edge();
                var originName = edgeData[0];
                var targetName = edgeData[1];
                var origin = states[nameToIndex[originName]];
                var target = states[nameToIndex[targetName]];
                edge.setOrigin(origin);
                edge.setTarget(target);
                if (connections[targetName].hasOwnProperty(originName)) {
                    var opposite = connections[targetName][originName];
                    opposite.setCurveFlag(true);
                    edge.setCurveFlag(true);
                }
                for (var _b = 0, _c = edgeData[2]; _b < _c.length; _b++) {
                    var data_1 = _c[_b];
                    EdgeUtils_1.EdgeUtils.addEdgeData(edge, data_1);
                }
                connections[originName][targetName] = edge;
                result.edgeList.push(edge);
            }
            return true;
        }
    })(Persistence = exports.Persistence || (exports.Persistence = {}));
});
define("interface/Table", ["require", "exports", "interface/Renderer", "Utils"], function (require, exports, Renderer_1, Utils_6) {
    "use strict";
    var Table = (function (_super) {
        __extends(Table, _super);
        function Table(numRows, numColumns) {
            _super.call(this);
            this.customColspans = {};
            this.numRows = numRows;
            this.numColumns = numColumns;
            this.children = [];
        }
        Table.prototype.add = function (elem, colspan) {
            if (colspan) {
                this.customColspans[this.children.length] = colspan;
            }
            this.children.push(elem);
        };
        Table.prototype.html = function () {
            var wrapper = Utils_6.utils.create("table");
            var index = 0;
            for (var i = 0; i < this.numRows; i++) {
                var tr = Utils_6.utils.create("tr");
                for (var j = 0; j < this.numColumns; j++) {
                    var td = Utils_6.utils.create("td");
                    if (index < this.children.length) {
                        if (this.customColspans.hasOwnProperty(index + "")) {
                            var colSpan = this.customColspans[index];
                            td.colSpan = colSpan;
                            j += colSpan - 1;
                        }
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
    }(Renderer_1.Renderer));
    exports.Table = Table;
});
define("Prompt", ["require", "exports", "Keyboard", "Settings", "System", "Utils"], function (require, exports, Keyboard_3, Settings_7, System_2, Utils_7) {
    "use strict";
    var Prompt = (function () {
        function Prompt(message) {
            this.inputs = [];
            this.successCallback = null;
            this.abortCallback = null;
            this.message = message;
        }
        Prompt.prototype.addInput = function (properties) {
            this.inputs.push(properties);
        };
        Prompt.prototype.onSuccess = function (callback) {
            this.successCallback = callback;
        };
        Prompt.prototype.onAbort = function (callback) {
            this.abortCallback = callback;
        };
        Prompt.prototype.show = function () {
            var blocker = Utils_7.utils.create("div", {
                className: "click_blocker"
            });
            var container = Utils_7.utils.create("div", {
                id: "system_prompt"
            });
            container.innerHTML = this.message + "<br>";
            var mainbar = Utils_7.utils.id(Settings_7.Settings.mainbarID);
            var inputIdPrefix = "system_prompt_input_";
            var dismiss = function () {
                document.body.removeChild(blocker);
                System_2.System.unblockEvents();
                $(container).slideUp(Settings_7.Settings.promptSlideInterval, function () {
                    mainbar.removeChild(container);
                });
            };
            var inputs = [];
            var self = this;
            var allInputsValid = function () {
                for (var _i = 0, inputs_2 = inputs; _i < inputs_2.length; _i++) {
                    var input = inputs_2[_i];
                    var index = input.id.replace(inputIdPrefix, "");
                    var validator = self.inputs[index].validator;
                    console.log(index);
                    console.log(validator.toString());
                    console.log(input.value);
                    console.log("---------------");
                    if (validator && !validator(input.value)) {
                        return false;
                    }
                }
                return true;
            };
            var ok = Utils_7.utils.create("input", {
                type: "button",
                value: Settings_7.Strings.PROMPT_CONFIRM,
                click: function () {
                    var allValid = true;
                    var contents = [];
                    for (var _i = 0, inputs_3 = inputs; _i < inputs_3.length; _i++) {
                        var input = inputs_3[_i];
                        var index = input.id.replace(inputIdPrefix, "");
                        var validator = self.inputs[index].validator;
                        if (validator && !validator(input.value)) {
                            allValid = false;
                            break;
                        }
                        contents.push(input.value);
                    }
                    dismiss();
                    self.successCallback(contents);
                }
            });
            var cancel = Utils_7.utils.create("input", {
                type: "button",
                value: Settings_7.Strings.PROMPT_CANCEL,
                click: function () {
                    dismiss();
                    if (self.abortCallback) {
                        self.abortCallback();
                    }
                }
            });
            for (var i = 0; i < this.inputs.length; i++) {
                var input = Utils_7.utils.create("input", {
                    id: inputIdPrefix + i,
                    type: "text",
                    placeholder: this.inputs[i].placeholder || ""
                });
                input.addEventListener("keydown", function (e) {
                    if (e.keyCode == Keyboard_3.Keyboard.keys.ENTER) {
                        ok.click();
                    }
                    else if (e.keyCode == Keyboard_3.Keyboard.keys.ESC) {
                        cancel.click();
                    }
                    else {
                        ok.disabled = !allInputsValid();
                    }
                });
                inputs.push(input);
                container.appendChild(input);
            }
            container.appendChild(ok);
            container.appendChild(cancel);
            document.body.insertBefore(blocker, document.body.children[0]);
            System_2.System.blockEvents();
            $(container).toggle();
            mainbar.insertBefore(container, mainbar.children[0]);
            $(container).slideDown(Settings_7.Settings.promptSlideInterval, function () {
                inputs[0].focus();
            });
        };
        return Prompt;
    }());
    exports.Prompt = Prompt;
});
define("interface/AutomatonRenderer", ["require", "exports", "interface/Edge", "Persistence", "Settings", "interface/State", "Utils", "interface/Table", "System", "Prompt"], function (require, exports, Edge_2, Persistence_1, Settings_8, State_2, Utils_8, Table_1, System_3, Prompt_1) {
    "use strict";
    var AutomatonRenderer = (function () {
        function AutomatonRenderer(canvas, node, memento) {
            this.canvas = null;
            this.node = null;
            this.stateList = [];
            this.edgeList = [];
            this.highlightedState = null;
            this.highlightedEdge = null;
            this.initialState = null;
            this.edgeMode = false;
            this.currentEdge = null;
            this.locked = false;
            this.memento = null;
            this.frozenMemento = false;
            this.canvas = canvas;
            this.memento = memento;
            this.node = node;
        }
        AutomatonRenderer.prototype.render = function () {
            this.bindEvents();
            this.bindShortcuts();
            this.bindFormalDefinitionListener();
            System_3.System.addLanguageChangeObserver(this);
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
            this.initialState = null;
            this.clearSelection();
            Settings_8.Settings.controller().clear();
        };
        AutomatonRenderer.prototype.empty = function () {
            return this.stateList.length == 0;
        };
        AutomatonRenderer.prototype.save = function () {
            return Persistence_1.Persistence.save(this.stateList, this.edgeList, this.initialState);
        };
        AutomatonRenderer.prototype.load = function (content, pushResult) {
            if (pushResult === void 0) { pushResult = true; }
            this.frozenMemento = true;
            var loadedData = Persistence_1.Persistence.load(content);
            if (loadedData.error) {
                alert(Settings_8.Strings.INVALID_FILE);
                return;
            }
            this.stateList = this.stateList.concat(loadedData.stateList);
            this.edgeList = this.edgeList.concat(loadedData.edgeList);
            if (this.initialState === null) {
                this.initialState = loadedData.initialState;
            }
            for (var _i = 0, _a = this.stateList; _i < _a.length; _i++) {
                var state = _a[_i];
                state.render(this.canvas);
                this.bindStateEvents(state);
            }
            for (var _b = 0, _c = this.edgeList; _b < _c.length; _b++) {
                var edge = _c[_b];
                edge.render(this.canvas);
                this.bindEdgeEvents(edge);
            }
            this.frozenMemento = false;
            if (pushResult) {
                this.memento.push(this.save());
                console.log(this.memento["states"]);
            }
        };
        AutomatonRenderer.prototype.recognitionHighlight = function (stateNames) {
            var nameMapping = {};
            for (var _i = 0, _a = this.stateList; _i < _a.length; _i++) {
                var state = _a[_i];
                nameMapping[state.getName()] = state;
                state.removePalette();
            }
            for (var _b = 0, stateNames_1 = stateNames; _b < stateNames_1.length; _b++) {
                var name_2 = stateNames_1[_b];
                nameMapping[name_2].applyPalette(Settings_8.Settings.stateRecognitionPalette);
            }
            for (var _c = 0, _d = this.stateList; _c < _d.length; _c++) {
                var state = _d[_c];
                state.render(this.canvas);
            }
        };
        AutomatonRenderer.prototype.recognitionDim = function () {
            for (var _i = 0, _a = this.stateList; _i < _a.length; _i++) {
                var state = _a[_i];
                state.removePalette();
                state.render(this.canvas);
            }
            this.highlightedState = null;
        };
        AutomatonRenderer.prototype.lock = function () {
            Utils_8.utils.lockShortcutGroup(Settings_8.Settings.canvasShortcutID);
            this.locked = true;
        };
        AutomatonRenderer.prototype.unlock = function () {
            Utils_8.utils.unlockShortcutGroup(Settings_8.Settings.canvasShortcutID);
            this.locked = false;
        };
        AutomatonRenderer.prototype.stateManualCreation = function () {
            var stateRadius = Settings_8.Settings.stateRadius;
            this.newStateAt(stateRadius, stateRadius);
        };
        AutomatonRenderer.prototype.edgeManualCreation = function () {
            if (!this.locked) {
                var self_1 = this;
                Utils_8.utils.prompt(Settings_8.Strings.EDGE_MANUAL_CREATION, 2, function (data) {
                    var edge = new Edge_2.Edge();
                    for (var _i = 0, _a = self_1.stateList; _i < _a.length; _i++) {
                        var state = _a[_i];
                        var name_3 = state.getName();
                        if (name_3 == data[0]) {
                            edge.setOrigin(state);
                        }
                        if (name_3 == data[1]) {
                            edge.setTarget(state);
                        }
                    }
                    if (edge.getOrigin() && edge.getTarget()) {
                        self_1.currentEdge = edge;
                        self_1.finishEdge(edge.getTarget());
                    }
                    else {
                        alert(Settings_8.Strings.ERROR_INVALID_STATE_NAME);
                    }
                });
            }
        };
        AutomatonRenderer.prototype.onLanguageChange = function () {
            this.bindFormalDefinitionListener();
        };
        AutomatonRenderer.prototype.bindFormalDefinitionListener = function () {
            var definitionContainer = null;
            var controller = Settings_8.Settings.controller();
            var self = this;
            var callback = function () {
                if (!self.frozenMemento) {
                    self.memento.push(self.save());
                    console.log(self.memento["states"]);
                }
                if (!definitionContainer) {
                    definitionContainer = Utils_8.utils.create("div");
                    Settings_8.Settings.sidebar.updateFormalDefinition(definitionContainer);
                }
                var formalDefinition = controller.formalDefinition();
                var tupleSequence = formalDefinition.tupleSequence;
                var content = "M = (" + tupleSequence.join(", ") + ")";
                content += Settings_8.Strings.DEFINITION_WHERE_SUFFIX + "<br>";
                for (var _i = 0, _a = formalDefinition.parameterSequence; _i < _a.length; _i++) {
                    var parameter = _a[_i];
                    var value = formalDefinition.parameterValues[parameter];
                    var type = typeof value;
                    content += parameter + " = ";
                    if (type == "number" || type == "string") {
                        content += value;
                    }
                    else if (value instanceof Array) {
                        content += "{" + value.join(", ") + "}";
                    }
                    else if (type == "undefined") {
                        content += "<span class='none'>";
                        content += Settings_8.Strings.NO_INITIAL_STATE;
                        content += "</span>";
                    }
                    else {
                        content += "unspecified type (AutomatonRenderer:266)";
                    }
                    content += "<br>";
                }
                definitionContainer.innerHTML = content;
            };
            controller.setEditingCallback(callback);
            callback();
        };
        AutomatonRenderer.prototype.selectState = function (state) {
            if (!this.locked) {
                this.dimEdge();
                if (this.highlightedState) {
                    this.highlightedState.removePalette();
                    this.highlightedState.render(this.canvas);
                }
                state.applyPalette(Settings_8.Settings.stateHighlightPalette);
                this.highlightedState = state;
                state.render(this.canvas);
                this.updateEditableState(state);
            }
        };
        AutomatonRenderer.prototype.dimState = function () {
            if (!this.locked && this.highlightedState) {
                this.highlightedState.removePalette();
                this.highlightedState.render(this.canvas);
                this.highlightedState = null;
                Settings_8.Settings.sidebar.unsetSelectedEntityContent();
            }
        };
        AutomatonRenderer.prototype.selectEdge = function (edge) {
            if (!this.locked) {
                this.dimState();
                if (this.highlightedEdge) {
                    this.highlightedEdge.removeCustomColor();
                    this.highlightedEdge.render(this.canvas);
                }
                edge.setCustomColor(Settings_8.Settings.edgeHighlightColor);
                this.highlightedEdge = edge;
                edge.render(this.canvas);
                this.updateEditableEdge(edge);
            }
        };
        AutomatonRenderer.prototype.dimEdge = function () {
            if (!this.locked && this.highlightedEdge) {
                this.highlightedEdge.removeCustomColor();
                this.highlightedEdge.render(this.canvas);
                this.highlightedEdge = null;
                Settings_8.Settings.sidebar.unsetSelectedEntityContent();
            }
        };
        AutomatonRenderer.prototype.updateEditableState = function (state) {
            Settings_8.Settings.sidebar.unsetSelectedEntityContent();
            if (state) {
                Settings_8.Settings.sidebar.setSelectedEntityContent(this.showEditableState(state));
            }
        };
        AutomatonRenderer.prototype.updateEditableEdge = function (edge) {
            Settings_8.Settings.sidebar.unsetSelectedEntityContent();
            if (edge) {
                Settings_8.Settings.sidebar.setSelectedEntityContent(this.showEditableEdge(edge));
            }
        };
        AutomatonRenderer.prototype.showEditableState = function (state) {
            var container = Utils_8.utils.create("div");
            var table = new Table_1.Table(4, 3);
            var canvas = this.canvas;
            var self = this;
            var renameButton = Utils_8.utils.create("input", {
                type: "button",
                value: Settings_8.Strings.RENAME_STATE,
                click: function () {
                    var message = new Prompt_1.Prompt(Settings_8.Strings.STATE_RENAME_ACTION);
                    message.addInput({
                        validator: function (content) {
                            return content.length <= 6;
                        }
                    });
                    message.show();
                }
            });
            var toggleInitialButton = Utils_8.utils.create("input", {
                type: "button",
                value: Settings_8.Strings.TOGGLE_PROPERTY,
                click: function () {
                    self.setInitialState(state);
                    state.render(canvas);
                    $("#entity_initial").html(state.isInitial() ? Settings_8.Strings.YES
                        : Settings_8.Strings.NO);
                }
            });
            var toggleFinalButton = Utils_8.utils.create("input", {
                type: "button",
                value: Settings_8.Strings.TOGGLE_PROPERTY,
                click: function () {
                    self.changeFinalFlag(state, !state.isFinal());
                    state.render(canvas);
                    $("#entity_final").html(state.isFinal() ? Settings_8.Strings.YES
                        : Settings_8.Strings.NO);
                }
            });
            var deleteButton = Utils_8.utils.create("input", {
                type: "button",
                value: Settings_8.Strings.DELETE_STATE,
                click: function () {
                    self.deleteState(state);
                    self.clearSelection();
                    Settings_8.Settings.sidebar.unsetSelectedEntityContent();
                }
            });
            table.add(Utils_8.utils.create("span", { innerHTML: Settings_8.Strings.STATE_NAME + ":" }));
            table.add(Utils_8.utils.create("span", { innerHTML: state.getName(),
                className: "property_value",
                id: "entity_name" }));
            table.add(renameButton);
            table.add(Utils_8.utils.create("span", { innerHTML: Settings_8.Strings.STATE_IS_INITIAL + ":" }));
            table.add(Utils_8.utils.create("span", { innerHTML: state.isInitial() ? Settings_8.Strings.YES
                    : Settings_8.Strings.NO,
                className: "property_value",
                id: "entity_initial" }));
            table.add(toggleInitialButton);
            table.add(Utils_8.utils.create("span", { innerHTML: Settings_8.Strings.STATE_IS_FINAL + ":" }));
            table.add(Utils_8.utils.create("span", { innerHTML: state.isFinal() ? Settings_8.Strings.YES
                    : Settings_8.Strings.NO,
                className: "property_value",
                id: "entity_final" }));
            table.add(toggleFinalButton);
            table.add(deleteButton, 3);
            container.appendChild(table.html());
            return container;
        };
        AutomatonRenderer.prototype.fixEdgeConsistency = function (newEdge) {
            var origin = newEdge.getOrigin();
            var target = newEdge.getTarget();
            var oppositeEdge = null;
            var mergedEdge = null;
            var edgeIndex = -1;
            var pendingRemoval = false;
            var i = 0;
            for (var _i = 0, _a = this.edgeList; _i < _a.length; _i++) {
                var edge = _a[_i];
                if (edge.getOrigin() == origin && edge.getTarget() == target) {
                    if (edge != newEdge) {
                        var dataList = newEdge.getDataList();
                        var textList = newEdge.getTextList();
                        var length_2 = dataList.length;
                        for (var i_1 = 0; i_1 < length_2; i_1++) {
                            edge.addData(dataList[i_1]);
                            edge.addText(textList[i_1]);
                        }
                        edge.render(this.canvas);
                        mergedEdge = edge;
                        pendingRemoval = true;
                    }
                    else {
                        edgeIndex = i;
                    }
                }
                else if (edge.getOrigin() == target && edge.getTarget() == origin) {
                    oppositeEdge = edge;
                }
                i++;
            }
            if (oppositeEdge) {
                oppositeEdge.setCurveFlag(true);
                oppositeEdge.render(this.canvas);
                newEdge.setCurveFlag(true);
                newEdge.render(this.canvas);
            }
            else {
                newEdge.setCurveFlag(false);
                newEdge.render(this.canvas);
            }
            if (pendingRemoval && edgeIndex > -1) {
                if (this.highlightedEdge == newEdge) {
                    this.selectEdge(mergedEdge);
                }
                newEdge.remove();
                this.edgeList.splice(edgeIndex, 1);
            }
        };
        AutomatonRenderer.prototype.showEditableEdge = function (edge) {
            var container = Utils_8.utils.create("div");
            var table = new Table_1.Table(5, 3);
            var canvas = this.canvas;
            var self = this;
            var changeOriginButton = Utils_8.utils.create("input", {
                type: "button",
                value: Settings_8.Strings.CHANGE_PROPERTY,
                click: function () {
                    var newOrigin = prompt(Settings_8.Strings.EDGE_ENTER_NEW_ORIGIN);
                    if (newOrigin !== null) {
                        for (var _i = 0, _a = self.stateList; _i < _a.length; _i++) {
                            var state = _a[_i];
                            if (state.getName() == newOrigin) {
                                edge.setOrigin(state);
                                self.fixEdgeConsistency(edge);
                            }
                        }
                        if (!edge.removed()) {
                            edge.render(canvas);
                        }
                        $("#entity_origin").html(newOrigin);
                    }
                }
            });
            var changeTargetButton = Utils_8.utils.create("input", {
                type: "button",
                value: Settings_8.Strings.CHANGE_PROPERTY,
                click: function () {
                    var newTarget = prompt(Settings_8.Strings.EDGE_ENTER_NEW_TARGET);
                    if (newTarget !== null) {
                        for (var _i = 0, _a = self.stateList; _i < _a.length; _i++) {
                            var state = _a[_i];
                            if (state.getName() == newTarget) {
                                edge.setTarget(state);
                                self.fixEdgeConsistency(edge);
                            }
                        }
                        if (!edge.removed()) {
                            edge.render(canvas);
                        }
                        $("#entity_target").html(newTarget);
                    }
                }
            });
            var changeTransitionButton = Utils_8.utils.create("input", {
                type: "button",
                value: Settings_8.Strings.CHANGE_PROPERTY,
                click: function () {
                    var transitionSelector = $("#entity_transition_list").get(0);
                    var selectedIndex = transitionSelector.selectedIndex;
                    var controller = Settings_8.Settings.controller();
                    controller.edgePrompt(function (data, content) {
                        var origin = edge.getOrigin();
                        var target = edge.getTarget();
                        var dataList = edge.getDataList();
                        controller.deleteEdge(origin, target, dataList[selectedIndex]);
                        edge.getDataList()[selectedIndex] = data;
                        edge.getTextList()[selectedIndex] = content;
                        edge.render(self.canvas);
                        controller.createEdge(origin, target, data);
                        self.updateEditableEdge(edge);
                    });
                }
            });
            var deleteTransitionButton = Utils_8.utils.create("input", {
                type: "button",
                value: Settings_8.Strings.DELETE_SELECTED_TRANSITION,
                click: function () {
                    var transitionSelector = $("#entity_transition_list").get(0);
                    var selectedIndex = transitionSelector.selectedIndex;
                    var controller = Settings_8.Settings.controller();
                    var origin = edge.getOrigin();
                    var target = edge.getTarget();
                    var dataList = edge.getDataList();
                    controller.deleteEdge(origin, target, dataList[selectedIndex]);
                    edge.getDataList().splice(selectedIndex, 1);
                    edge.getTextList().splice(selectedIndex, 1);
                    if (dataList.length == 0) {
                        self.deleteEdge(edge);
                        self.clearSelection();
                        Settings_8.Settings.sidebar.unsetSelectedEntityContent();
                    }
                    else {
                        edge.render(self.canvas);
                        self.updateEditableEdge(edge);
                    }
                }
            });
            var deleteAllButton = Utils_8.utils.create("input", {
                title: Utils_8.utils.printShortcut(Settings_8.Settings.shortcuts.deleteEntity),
                type: "button",
                value: Settings_8.Strings.DELETE_ALL_TRANSITIONS,
                click: function () {
                    self.deleteEdge(edge);
                    self.clearSelection();
                    Settings_8.Settings.sidebar.unsetSelectedEntityContent();
                }
            });
            table.add(Utils_8.utils.create("span", { innerHTML: Settings_8.Strings.ORIGIN + ":" }));
            table.add(Utils_8.utils.create("span", { innerHTML: edge.getOrigin().getName(),
                className: "property_value",
                id: "entity_origin" }));
            table.add(changeOriginButton);
            table.add(Utils_8.utils.create("span", { innerHTML: Settings_8.Strings.TARGET + ":" }));
            table.add(Utils_8.utils.create("span", { innerHTML: edge.getTarget().getName(),
                className: "property_value",
                id: "entity_target" }));
            table.add(changeTargetButton);
            var textSelector = Utils_8.utils.create("select", {
                id: "entity_transition_list"
            });
            var textList = edge.getTextList();
            var i = 0;
            for (var _i = 0, textList_1 = textList; _i < textList_1.length; _i++) {
                var text = textList_1[_i];
                var option = Utils_8.utils.create("option", { value: i, innerHTML: text });
                textSelector.appendChild(option);
                i++;
            }
            table.add(Utils_8.utils.create("span", { innerHTML: Settings_8.Strings.TRANSITIONS + ":" }));
            table.add(textSelector);
            table.add(changeTransitionButton);
            table.add(deleteTransitionButton, 3);
            table.add(deleteAllButton, 3);
            container.appendChild(table.html());
            return container;
        };
        AutomatonRenderer.prototype.bindEvents = function () {
            for (var _i = 0, _a = this.stateList; _i < _a.length; _i++) {
                var state = _a[_i];
                state.render(this.canvas);
                this.bindStateEvents(state);
            }
            for (var _b = 0, _c = this.edgeList; _b < _c.length; _b++) {
                var edge = _c[_b];
                this.bindEdgeEvents(edge);
            }
            var self = this;
            $(this.node).dblclick(function (e) {
                self.newStateAt(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
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
        AutomatonRenderer.prototype.bindEdgeEvents = function (edge) {
            var self = this;
            edge.addClickHandler(function () {
                self.selectEdge(this);
            });
        };
        AutomatonRenderer.prototype.bindStateEvents = function (state) {
            var canvas = this.canvas;
            var self = this;
            state.drag(function () {
                self.updateEdges();
            }, function (distanceSquared, event) {
                if (!self.locked && distanceSquared <= Settings_8.Settings.stateDragTolerance) {
                    if (self.edgeMode) {
                        self.finishEdge(state);
                    }
                    else if (Utils_8.utils.isRightClick(event)) {
                        self.beginEdge(state);
                    }
                    else if (state == self.highlightedState) {
                        self.dimState();
                    }
                    else {
                        self.selectState(state);
                    }
                    return false;
                }
                self.memento.push(self.save());
                return true;
            });
        };
        AutomatonRenderer.prototype.beginEdge = function (state) {
            this.edgeMode = true;
            this.currentEdge = new Edge_2.Edge();
            this.currentEdge.setOrigin(state);
        };
        AutomatonRenderer.prototype.finishEdge = function (state) {
            this.edgeMode = false;
            var origin = this.currentEdge.getOrigin();
            var edgeText = function (callback, fallback) {
                var controller = Settings_8.Settings.controller();
                controller.edgePrompt(function (data, content) {
                    controller.createEdge(origin, state, data);
                    callback(data, content);
                }, fallback);
            };
            var self = this;
            var oppositeEdge = null;
            var clearCurrentEdge = function () {
                self.currentEdge.remove();
                self.currentEdge = null;
            };
            var _loop_4 = function(edge) {
                if (edge.getOrigin() == origin && edge.getTarget() == state) {
                    edgeText(function (data, text) {
                        edge.addText(text);
                        edge.addData(data);
                        edge.render(self.canvas);
                        clearCurrentEdge();
                    }, clearCurrentEdge);
                    return { value: void 0 };
                }
                else if (edge.getOrigin() == state && edge.getTarget() == origin) {
                    oppositeEdge = edge;
                }
            };
            for (var _i = 0, _a = this.edgeList; _i < _a.length; _i++) {
                var edge = _a[_i];
                var state_4 = _loop_4(edge);
                if (typeof state_4 === "object") return state_4.value;
            }
            if (oppositeEdge) {
                oppositeEdge.setCurveFlag(true);
                oppositeEdge.render(this.canvas);
                this.currentEdge.setCurveFlag(true);
            }
            this.currentEdge.setTarget(state);
            this.currentEdge.render(this.canvas);
            edgeText(function (data, text) {
                self.currentEdge.addText(text);
                self.currentEdge.addData(data);
                self.bindEdgeEvents(self.currentEdge);
                self.currentEdge.render(self.canvas);
                self.edgeList.push(self.currentEdge);
                self.currentEdge = null;
            }, function () {
                clearCurrentEdge();
                if (oppositeEdge) {
                    oppositeEdge.setCurveFlag(false);
                    oppositeEdge.render(self.canvas);
                }
            });
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
            this.highlightedEdge = null;
            Settings_8.Settings.sidebar.unsetSelectedEntityContent();
            if (this.edgeMode) {
                this.edgeMode = false;
                this.currentEdge.remove();
                this.currentEdge = null;
            }
        };
        AutomatonRenderer.prototype.newStateAt = function (x, y) {
            if (!this.locked) {
                var state_5 = new State_2.State();
                state_5.setPosition(x, y);
                this.selectState(state_5);
                this.bindStateEvents(state_5);
                var self_2 = this;
                var stateNamePrompt_1 = function () {
                    Utils_8.utils.prompt(Settings_8.Strings.STATE_MANUAL_CREATION, 1, function (data) {
                        var name = data[0];
                        for (var _i = 0, _a = self_2.stateList; _i < _a.length; _i++) {
                            var state_6 = _a[_i];
                            if (state_6.getName() == name) {
                                alert(Settings_8.Strings.DUPLICATE_STATE_NAME);
                                return stateNamePrompt_1();
                            }
                        }
                        state_5.setName(name);
                        self_2.onStateCreation(state_5);
                        self_2.updateEditableState(state_5);
                    }, function () {
                        self_2.highlightedState = null;
                        state_5.remove();
                        self_2.updateEditableState(null);
                    });
                };
                stateNamePrompt_1();
            }
        };
        AutomatonRenderer.prototype.onStateCreation = function (state) {
            if (this.stateList.length == 0) {
                state.setInitial(true);
                this.initialState = state;
            }
            state.render(this.canvas);
            this.stateList.push(state);
            Settings_8.Settings.controller().createState(state);
        };
        AutomatonRenderer.prototype.setInitialState = function (state) {
            var controller = Settings_8.Settings.controller();
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
                this.initialState = state;
            }
        };
        AutomatonRenderer.prototype.changeFinalFlag = function (state, value) {
            state.setFinal(value);
            Settings_8.Settings.controller().changeFinalFlag(state);
        };
        AutomatonRenderer.prototype.deleteState = function (state) {
            for (var i = 0; i < this.edgeList.length; i++) {
                var edge = this.edgeList[i];
                var origin = edge.getOrigin();
                var target = edge.getTarget();
                if (origin == state || target == state) {
                    edge.remove();
                    this.edgeList.splice(i, 1);
                    i--;
                }
            }
            state.remove();
            var states = this.stateList;
            for (var i = 0; i < states.length; i++) {
                if (states[i] == state) {
                    states.splice(i, 1);
                    break;
                }
            }
            Settings_8.Settings.controller().deleteState(state);
        };
        AutomatonRenderer.prototype.deleteEdge = function (edge) {
            for (var i = 0; i < this.edgeList.length; i++) {
                if (this.edgeList[i] == edge) {
                    edge.remove();
                    this.edgeList.splice(i, 1);
                    var origin = edge.getOrigin();
                    var target = edge.getTarget();
                    var dataLists = edge.getDataList();
                    var controller = Settings_8.Settings.controller();
                    for (var _i = 0, dataLists_1 = dataLists; _i < dataLists_1.length; _i++) {
                        var data = dataLists_1[_i];
                        controller.deleteEdge(origin, target, data);
                    }
                    break;
                }
            }
        };
        AutomatonRenderer.prototype.toggleInitial = function () {
            var highlightedState = this.highlightedState;
            if (highlightedState) {
                this.setInitialState(highlightedState);
                highlightedState.render(this.canvas);
                this.updateEditableState(highlightedState);
            }
        };
        AutomatonRenderer.prototype.toggleFinal = function () {
            var highlightedState = this.highlightedState;
            if (highlightedState) {
                this.changeFinalFlag(highlightedState, !highlightedState.isFinal());
                highlightedState.render(this.canvas);
                this.updateEditableState(highlightedState);
            }
        };
        AutomatonRenderer.prototype.undo = function () {
            this.frozenMemento = true;
            this.clear();
            var data = this.memento.pop();
            console.log("undo", data);
            console.log(this.memento["states"]);
            var self = this;
            if (data) {
                this.load(data, false);
            }
        };
        AutomatonRenderer.prototype.bindShortcuts = function () {
            var self = this;
            var group = Settings_8.Settings.canvasShortcutID;
            Utils_8.utils.bindShortcut(Settings_8.Settings.shortcuts.toggleInitial, function () {
                self.toggleInitial();
            }, group);
            Utils_8.utils.bindShortcut(Settings_8.Settings.shortcuts.toggleFinal, function () {
                self.toggleFinal();
            }, group);
            Utils_8.utils.bindShortcut(Settings_8.Settings.shortcuts.dimSelection, function () {
                if (self.edgeMode) {
                    self.edgeMode = false;
                    self.currentEdge.remove();
                    self.currentEdge = null;
                }
                self.dimState();
                self.dimEdge();
            }, group);
            Utils_8.utils.bindShortcut(Settings_8.Settings.shortcuts.deleteEntity, function () {
                var highlightedState = self.highlightedState;
                var highlightedEdge = self.highlightedEdge;
                if (highlightedState) {
                    self.deleteState(highlightedState);
                }
                else if (highlightedEdge) {
                    self.deleteEdge(highlightedEdge);
                }
                self.clearSelection();
            }, group);
            Utils_8.utils.bindShortcut(Settings_8.Settings.shortcuts.clearMachine, function () {
                var confirmation = confirm(Settings_8.Strings.CLEAR_CONFIRMATION);
                if (confirmation) {
                    self.clear();
                }
            }, group);
            Utils_8.utils.bindShortcut(Settings_8.Settings.shortcuts.left, function () {
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
            }, group);
            Utils_8.utils.bindShortcut(Settings_8.Settings.shortcuts.right, function () {
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
            }, group);
            Utils_8.utils.bindShortcut(Settings_8.Settings.shortcuts.up, function () {
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
            }, group);
            Utils_8.utils.bindShortcut(Settings_8.Settings.shortcuts.down, function () {
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
            }, group);
            Utils_8.utils.bindShortcut(Settings_8.Settings.shortcuts.undo, function () {
                self.undo();
            }, group);
        };
        AutomatonRenderer.prototype.selectionThreshold = function () {
            return 2 * Settings_8.Settings.stateRadius;
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
define("initializers/initFA", ["require", "exports", "Keyboard", "interface/Menu", "Settings", "Utils"], function (require, exports, Keyboard_4, Menu_1, Settings_9, Utils_9) {
    "use strict";
    var initFA;
    (function (initFA) {
        function init() {
            var menuList = [];
            var menu = new Menu_1.Menu(Settings_9.Strings.RECOGNITION);
            var rows = [];
            buildTestCaseInput(rows);
            buildRecognitionControls(rows);
            buildRecognitionProgress(rows);
            bindRecognitionEvents();
            bindShortcuts();
            for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                var row = rows_1[_i];
                var div = Utils_9.utils.create("div", {
                    className: "row"
                });
                for (var _a = 0, row_1 = row; _a < row_1.length; _a++) {
                    var node = row_1[_a];
                    div.appendChild(node);
                }
                menu.add(div);
            }
            menuList.push(menu);
            Settings_9.Settings.machines[Settings_9.Settings.Machine.FA].sidebar = menuList;
        }
        initFA.init = init;
        var boundShortcuts = false;
        var testCaseInput = null;
        var fastRecognition = null;
        var stepRecognition = null;
        var stopRecognition = null;
        var progressContainer = null;
        function testCase() {
            return testCaseInput.value;
        }
        function buildTestCaseInput(container) {
            var input = Utils_9.utils.create("input", {
                type: "text",
                placeholder: Settings_9.Strings.TEST_CASE
            });
            container.push([input]);
            testCaseInput = input;
        }
        function highlightCurrentStates() {
            var states = Settings_9.Settings.controller().currentStates();
            Settings_9.Settings.automatonRenderer.recognitionHighlight(states);
        }
        function buildRecognitionControls(container) {
            var disabledClass = Settings_9.Settings.disabledButtonClass;
            fastRecognition = Utils_9.utils.create("img", {
                className: "image_button",
                src: "images/fastforward.svg",
                title: Settings_9.Strings.FAST_RECOGNITION
            });
            stopRecognition = Utils_9.utils.create("img", {
                className: "image_button " + disabledClass,
                src: "images/stop.svg",
                title: Settings_9.Strings.STOP_RECOGNITION
            });
            stepRecognition = Utils_9.utils.create("img", {
                className: "image_button",
                src: "images/play.svg",
                title: Settings_9.Strings.STEP_RECOGNITION
            });
            container.push([fastRecognition, stepRecognition,
                stopRecognition]);
        }
        function buildRecognitionProgress(container) {
            progressContainer = Utils_9.utils.create("div", {
                id: "recognition_progress"
            });
            progressContainer.style.display = "none";
            container.push([progressContainer]);
        }
        function showAcceptanceStatus() {
            if (Settings_9.Settings.controller().accepts()) {
                progressContainer.style.color = Settings_9.Settings.acceptedTestCaseColor;
                progressContainer.innerHTML = Settings_9.Strings.INPUT_ACCEPTED;
            }
            else {
                progressContainer.style.color = Settings_9.Settings.rejectedTestCaseColor;
                progressContainer.innerHTML = Settings_9.Strings.INPUT_REJECTED;
            }
        }
        function bindRecognitionEvents() {
            var disabledClass = Settings_9.Settings.disabledButtonClass;
            var fastForwardEnabled = true;
            var stepEnabled = true;
            var stopEnabled = false;
            var fastForwardStatus = function (enabled) {
                fastForwardEnabled = enabled;
                fastRecognition.classList[enabled ? "remove" : "add"](disabledClass);
            };
            var stepStatus = function (enabled) {
                stepEnabled = enabled;
                stepRecognition.classList[enabled ? "remove" : "add"](disabledClass);
            };
            var stopStatus = function (enabled) {
                stopEnabled = enabled;
                stopRecognition.classList[enabled ? "remove" : "add"](disabledClass);
            };
            fastRecognition.addEventListener("click", function () {
                if (fastForwardEnabled) {
                    Settings_9.Settings.automatonRenderer.lock();
                    var input = testCase();
                    var controller = Settings_9.Settings.controller();
                    controller.fastForward(input);
                    highlightCurrentStates();
                    progressContainer.style.display = "";
                    showAcceptanceStatus();
                    fastForwardStatus(false);
                    stepStatus(false);
                    stopStatus(true);
                    testCaseInput.disabled = true;
                }
            });
            stopRecognition.addEventListener("click", function () {
                if (stopEnabled) {
                    Settings_9.Settings.controller().stop();
                    Settings_9.Settings.automatonRenderer.recognitionDim();
                    Settings_9.Settings.automatonRenderer.unlock();
                    progressContainer.style.color = "black";
                    progressContainer.style.display = "none";
                    fastForwardStatus(true);
                    stepStatus(true);
                    stopStatus(false);
                    testCaseInput.disabled = false;
                }
            });
            stepRecognition.addEventListener("click", function () {
                if (stepEnabled) {
                    fastForwardStatus(false);
                    stopStatus(true);
                    testCaseInput.disabled = true;
                    var input = testCase();
                    var controller = Settings_9.Settings.controller();
                    if (controller.isStopped()) {
                        Settings_9.Settings.automatonRenderer.lock();
                        progressContainer.style.display = "";
                        var sidebar = Utils_9.utils.id(Settings_9.Settings.sidebarID);
                        var width = sidebar.offsetWidth;
                        width -= 10;
                        width -= 1;
                        progressContainer.style.width = width + "px";
                    }
                    var finished = controller.finished(input);
                    if (!finished) {
                        controller.step(input);
                        highlightCurrentStates();
                        finished = controller.finished(input);
                    }
                    var position = controller.stepPosition();
                    var displayedText = input.substr(position);
                    if (displayedText == "") {
                        showAcceptanceStatus();
                    }
                    else {
                        progressContainer.innerHTML = displayedText;
                    }
                    if (finished) {
                        stepStatus(false);
                    }
                }
            });
        }
        function bindShortcuts() {
            if (!boundShortcuts) {
                Utils_9.utils.bindShortcut(Settings_9.Settings.shortcuts.focusTestCase, function () {
                    testCaseInput.focus();
                });
                Utils_9.utils.bindShortcut(Settings_9.Settings.shortcuts.fastForward, function () {
                    fastRecognition.click();
                });
                Utils_9.utils.bindShortcut(Settings_9.Settings.shortcuts.step, function () {
                    stepRecognition.click();
                });
                Utils_9.utils.bindShortcut(Settings_9.Settings.shortcuts.stop, function () {
                    stopRecognition.click();
                });
                boundShortcuts = true;
            }
            testCaseInput.addEventListener("keydown", function (e) {
                if (e.keyCode == Keyboard_4.Keyboard.keys[Settings_9.Settings.shortcuts.dimTestCase[0]]) {
                    if (testCaseInput == document.activeElement) {
                        testCaseInput.blur();
                    }
                }
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
define("Initializer", ["require", "exports", "lists/InitializerList", "Utils"], function (require, exports, init, Utils_10) {
    "use strict";
    var Initializer = (function () {
        function Initializer() {
        }
        Initializer.exec = function () {
            this.initSidebars();
        };
        Initializer.initSidebars = function () {
            Utils_10.utils.foreach(init, function (moduleName, obj) {
                obj.init();
            });
        };
        return Initializer;
    }());
    exports.Initializer = Initializer;
});
define("Settings", ["require", "exports", "lists/LanguageList", "lists/MachineList", "lists/ControllerList", "Initializer", "Utils"], function (require, exports, lang, automata, controllers, Initializer_1, Utils_11) {
    "use strict";
    var Settings;
    (function (Settings) {
        Settings.sidebarID = "sidebar";
        Settings.mainbarID = "mainbar";
        Settings.disabledButtonClass = "disabled";
        Settings.canvasShortcutID = "canvas";
        Settings.undoMaxAmount = 2;
        Settings.menuSlideInterval = 300;
        Settings.promptSlideInterval = 200;
        Settings.machineSelRows = 3;
        Settings.machineSelColumns = 1;
        Settings.machineActionRows = 2;
        Settings.machineActionColumns = 2;
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
        Settings.stateInitialMarkAngle = Utils_11.utils.toRadians(20);
        Settings.stateInitialMarkColor = "blue";
        Settings.stateInitialMarkThickness = 2;
        Settings.stateHighlightPalette = {
            fillColor: "#FFD574",
            strokeColor: "red",
            strokeWidth: 3,
            ringStrokeWidth: 2
        };
        Settings.stateRecognitionPalette = {
            fillColor: "#CCC",
            strokeColor: "black",
            strokeWidth: 3,
            ringStrokeWidth: 2
        };
        Settings.edgeStrokeColor = "black";
        Settings.edgeHighlightColor = "red";
        Settings.edgeArrowThickness = 2;
        Settings.edgeArrowLength = 30;
        Settings.edgeArrowAngle = Utils_11.utils.toRadians(30);
        Settings.edgeTextFontFamily = "arial";
        Settings.edgeTextFontSize = 20;
        Settings.edgeTextFontColor = "black";
        Settings.acceptedTestCaseColor = "green";
        Settings.rejectedTestCaseColor = "red";
        Settings.shortcuts = {
            save: ["ctrl", "S"],
            open: ["ctrl", "O"],
            toggleInitial: ["I"],
            toggleFinal: ["F"],
            dimSelection: ["ESC"],
            deleteEntity: ["DELETE"],
            clearMachine: ["C"],
            left: ["LEFT"],
            right: ["RIGHT"],
            up: ["UP"],
            down: ["DOWN"],
            undo: ["ctrl", "Z"],
            focusTestCase: ["ctrl", "I"],
            dimTestCase: ["ENTER"],
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
        Settings.sidebar = null;
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
            Utils_11.utils.foreach(machineList, function (key, value) {
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
define("interface/Menu", ["require", "exports", "interface/Renderer", "Settings", "Utils"], function (require, exports, Renderer_2, Settings_10, Utils_12) {
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
            var wrapper = Utils_12.utils.create("div");
            wrapper.classList.add("menu");
            var arrow = Utils_12.utils.create("div");
            arrow.classList.add("menu_arrow");
            var title = Utils_12.utils.create("div");
            title.classList.add("title");
            title.appendChild(arrow);
            title.innerHTML += this.title;
            wrapper.appendChild(title);
            var content = Utils_12.utils.create("div");
            content.classList.add("content");
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var child = _a[_i];
                content.appendChild(child);
            }
            wrapper.appendChild(content);
            node.appendChild(wrapper);
            var self = this;
            title.addEventListener("click", function () {
                if (!$(content).is(":animated")) {
                    $(content).slideToggle(Settings_10.Settings.menuSlideInterval, function () {
                        self.updateArrow();
                    });
                }
            });
            this.body = wrapper;
            if (this.toggled) {
                this.internalToggle();
            }
            this.updateArrow();
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
        Menu.prototype.content = function () {
            return this.body.querySelector(".content");
        };
        Menu.prototype.updateArrow = function () {
            var arrow = this.body.querySelector(".menu_arrow");
            if ($(this.content()).css("display") == "none") {
                arrow.innerHTML = "&#x25BA;";
            }
            else {
                arrow.innerHTML = "&#x25BC;";
            }
        };
        Menu.prototype.internalToggle = function () {
            $(this.content()).toggle();
        };
        return Menu;
    }(Renderer_2.Renderer));
    exports.Menu = Menu;
});
define("interface/Sidebar", ["require", "exports", "interface/Menu", "interface/Renderer", "Settings", "Settings", "System", "interface/Table", "Utils"], function (require, exports, Menu_2, Renderer_3, Settings_11, Settings_12, System_4, Table_2, Utils_13) {
    "use strict";
    var Sidebar = (function (_super) {
        __extends(Sidebar, _super);
        function Sidebar() {
            _super.call(this);
            this.otherMenus = [];
            this.build();
        }
        Sidebar.prototype.build = function () {
            this.mainMenus = {
                settings: new Menu_2.Menu(Settings_12.Strings.SETTINGS),
                fileManipulation: new Menu_2.Menu(Settings_12.Strings.FILE_MENUBAR),
                selectedEntity: new Menu_2.Menu(Settings_12.Strings.SELECTED_ENTITY),
                formalDefinition: new Menu_2.Menu(Settings_12.Strings.FORMAL_DEFINITION),
                machineSelection: new Menu_2.Menu(Settings_12.Strings.SELECT_MACHINE),
                actionMenu: new Menu_2.Menu(Settings_12.Strings.ACTION_LIST)
            };
            this.buildSettings();
            this.buildFileManipulation();
            this.buildSelectedEntityArea();
            this.buildMachineSelection();
            this.buildActionMenu();
            if (this.node) {
                this.onBind();
            }
        };
        Sidebar.prototype.setSelectedEntityContent = function (content) {
            var node = this.mainMenus.selectedEntity.content();
            $(node.querySelector(".none")).hide();
            node.appendChild(content);
        };
        Sidebar.prototype.unsetSelectedEntityContent = function () {
            var node = this.mainMenus.selectedEntity.content();
            while (node.children.length > 1) {
                node.removeChild(node.children[node.children.length - 1]);
            }
            $(node.querySelector(".none")).show();
        };
        Sidebar.prototype.updateFormalDefinition = function (content) {
            var node = this.mainMenus.formalDefinition.content();
            node.innerHTML = "";
            if (content) {
                node.appendChild(content);
            }
        };
        Sidebar.prototype.onBind = function () {
            var self = this;
            Utils_13.utils.foreach(this.mainMenus, function (name, menu) {
                menu.bind(self.node);
            });
            for (var _i = 0, _a = this.otherMenus; _i < _a.length; _i++) {
                var menu = _a[_i];
                menu.bind(this.node);
            }
            Settings_11.Settings.sidebar = this;
        };
        Sidebar.prototype.onRender = function () {
            Utils_13.utils.foreach(this.mainMenus, function (name, menu) {
                menu.render();
            });
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
            this.otherMenus = Settings_11.Settings.machines[machine].sidebar;
            for (var _b = 0, _c = this.otherMenus; _b < _c.length; _b++) {
                var menu = _c[_b];
                menu.bind(this.node);
            }
        };
        Sidebar.prototype.buildSettings = function () {
            var settings = this.mainMenus.settings;
            settings.clear();
            var table = new Table_2.Table(2, 2);
            var undoMaxAmountInput = Utils_13.utils.create("input", {
                className: "property_value",
                type: "text",
                value: Settings_11.Settings.undoMaxAmount
            });
            var originalMaxCount;
            undoMaxAmountInput.addEventListener("focus", function () {
                originalMaxCount = this.value;
            });
            undoMaxAmountInput.addEventListener("blur", function () {
                var value = parseInt(this.value);
                if (!isNaN(value) && value >= 1) {
                    if (originalMaxCount >= value
                        || confirm(Settings_12.Strings.MEMORY_CONSUMPTION_WARNING)) {
                        Settings_11.Settings.undoMaxAmount = value;
                    }
                    this.value = Settings_11.Settings.undoMaxAmount;
                }
            });
            this.buildLanguageSelection(table);
            table.add(Utils_13.utils.create("span", { innerHTML: Settings_12.Strings.UNDO_MAX_COUNT + ":" }));
            table.add(undoMaxAmountInput);
            settings.add(table.html());
            settings.toggle();
        };
        Sidebar.prototype.buildLanguageSelection = function (table) {
            var select = Utils_13.utils.create("select");
            var languages = Settings_11.Settings.languages;
            var languageTable = {};
            var i = 0;
            Utils_13.utils.foreach(languages, function (moduleName, obj) {
                var option = Utils_13.utils.create("option");
                option.value = i.toString();
                option.innerHTML = obj.strings.LANGUAGE_NAME;
                select.appendChild(option);
                languageTable[i] = moduleName;
                if (obj == Settings_11.Settings.language) {
                    select.selectedIndex = i;
                }
                i++;
            });
            select.addEventListener("change", function (e) {
                var node = this;
                var option = node.options[node.selectedIndex];
                var index = option.value;
                var name = option.innerHTML;
                var confirmation = confirm(Settings_12.Strings.CHANGE_LANGUAGE.replace("%", name));
                if (confirmation) {
                    System_4.System.changeLanguage(languages[languageTable[index]]);
                }
            });
            table.add(Utils_13.utils.create("span", { innerHTML: Settings_12.Strings.SYSTEM_LANGUAGE + ":" }));
            table.add(select);
        };
        Sidebar.prototype.buildFileManipulation = function () {
            var fileManipulation = this.mainMenus.fileManipulation;
            fileManipulation.clear();
            var save = Utils_13.utils.create("input", {
                className: "file_manip_btn",
                type: "button",
                value: Settings_12.Strings.SAVE,
                click: function () {
                    var content = Settings_11.Settings.automatonRenderer.save();
                    var blob = new Blob([content], { type: "text/plain; charset=utf-8" });
                    saveAs(blob, "file.txt");
                }
            });
            Utils_13.utils.bindShortcut(Settings_11.Settings.shortcuts.save, function () {
                save.click();
            });
            fileManipulation.add(save);
            var fileSelector = Utils_13.utils.create("input", {
                id: "file_selector",
                type: "file"
            });
            fileSelector.addEventListener("change", function (e) {
                var file = e.target.files[0];
                this.value = "";
                if (file) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        Settings_11.Settings.automatonRenderer.load(e.target.result);
                    };
                    reader.readAsText(file);
                }
            });
            var open = Utils_13.utils.create("input", {
                className: "file_manip_btn",
                type: "button",
                value: Settings_12.Strings.OPEN,
                click: function () {
                    fileSelector.click();
                    this.blur();
                }
            });
            Utils_13.utils.bindShortcut(Settings_11.Settings.shortcuts.open, function () {
                open.click();
            });
            fileManipulation.add(open);
        };
        Sidebar.prototype.buildSelectedEntityArea = function () {
            var none = Utils_13.utils.create("span", {
                className: "none",
                innerHTML: Settings_12.Strings.NO_SELECTED_ENTITY
            });
            this.mainMenus.selectedEntity.add(none);
        };
        Sidebar.prototype.buildMachineSelection = function () {
            var table = new Table_2.Table(Settings_11.Settings.machineSelRows, Settings_11.Settings.machineSelColumns);
            var machineButtonMapping = {};
            var self = this;
            Utils_13.utils.foreach(Settings_11.Settings.machines, function (type, props) {
                var button = Utils_13.utils.create("input");
                button.classList.add("machine_selection_btn");
                button.type = "button";
                button.value = props.name;
                button.disabled = (type == Settings_11.Settings.currentMachine);
                button.addEventListener("click", function () {
                    if (Settings_11.Settings.automatonRenderer.empty()
                        || confirm(Settings_12.Strings.CHANGE_MACHINE_WARNING)) {
                        Settings_11.Settings.automatonRenderer.clear();
                        machineButtonMapping[Settings_11.Settings.currentMachine].disabled = false;
                        machineButtonMapping[type].disabled = true;
                        machineButtonMapping[type].blur();
                        Settings_11.Settings.currentMachine = type;
                        self.loadMachine(type);
                        self.renderDynamicMenus();
                    }
                });
                table.add(button);
                machineButtonMapping[type] = button;
            });
            Utils_13.utils.bindShortcut(["M"], function () {
                var buttons = document.querySelectorAll(".machine_selection_btn");
                for (var i = 0; i < buttons.length; i++) {
                    var button = buttons[i];
                    if (!button.disabled) {
                        button.focus();
                        break;
                    }
                }
            });
            var machineSelection = this.mainMenus.machineSelection;
            machineSelection.clear();
            machineSelection.add(table.html());
            this.loadMachine(Settings_11.Settings.currentMachine);
        };
        Sidebar.prototype.buildActionMenu = function () {
            var table = new Table_2.Table(Settings_11.Settings.machineActionRows, Settings_11.Settings.machineActionColumns);
            var createState = Utils_13.utils.create("input", {
                title: Settings_12.Strings.CREATE_STATE_INSTRUCTIONS,
                type: "button",
                value: Settings_12.Strings.CREATE_STATE,
                click: function () {
                    Settings_11.Settings.automatonRenderer.stateManualCreation();
                }
            });
            table.add(createState);
            var createEdge = Utils_13.utils.create("input", {
                title: Settings_12.Strings.CREATE_EDGE_INSTRUCTIONS,
                type: "button",
                value: Settings_12.Strings.CREATE_EDGE,
                click: function () {
                    Settings_11.Settings.automatonRenderer.edgeManualCreation();
                }
            });
            table.add(createEdge);
            var clearMachine = Utils_13.utils.create("input", {
                title: Utils_13.utils.printShortcut(Settings_11.Settings.shortcuts.clearMachine),
                type: "button",
                value: Settings_12.Strings.CLEAR_MACHINE,
                click: function () {
                    System_4.System.emitKeyEvent(Settings_11.Settings.shortcuts.clearMachine);
                }
            });
            table.add(clearMachine);
            var undo = Utils_13.utils.create("input", {
                title: Utils_13.utils.printShortcut(Settings_11.Settings.shortcuts.undo),
                type: "button",
                value: Settings_12.Strings.UNDO,
                click: function () {
                    System_4.System.emitKeyEvent(Settings_11.Settings.shortcuts.undo);
                }
            });
            table.add(undo);
            var actionMenu = this.mainMenus.actionMenu;
            var tableElement = table.html();
            tableElement.id = "machine_actions";
            actionMenu.add(tableElement);
        };
        return Sidebar;
    }(Renderer_3.Renderer));
    exports.Sidebar = Sidebar;
});
define("System", ["require", "exports", "Keyboard", "Settings", "Utils"], function (require, exports, Keyboard_5, Settings_13, Utils_14) {
    "use strict";
    var modifiers = ["alt", "ctrl", "shift"];
    function propertyName(type) {
        return type + "Key";
    }
    var System = (function () {
        function System() {
        }
        System.changeLanguage = function (language) {
            Settings_13.Settings.changeLanguage(language);
            this.reload();
            for (var _i = 0, _a = this.languageChangeObservers; _i < _a.length; _i++) {
                var listener = _a[_i];
                listener.onLanguageChange();
            }
        };
        System.reload = function () {
            Utils_14.utils.id(Settings_13.Settings.sidebarID).innerHTML = "";
            this.sidebar.build();
            this.sidebar.render();
        };
        System.bindSidebar = function (sidebar) {
            this.sidebar = sidebar;
        };
        System.addLanguageChangeObserver = function (observer) {
            this.languageChangeObservers.push(observer);
        };
        System.emitKeyEvent = function (keys) {
            var event = {
                preventDefault: function () { }
            };
            for (var _i = 0, modifiers_1 = modifiers; _i < modifiers_1.length; _i++) {
                var modifier = modifiers_1[_i];
                event[propertyName(modifier)] = false;
            }
            for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
                var key = keys_1[_a];
                if (modifiers.indexOf(key) >= 0) {
                    event[propertyName(key)] = true;
                }
                else {
                    event["keyCode"] = Keyboard_5.Keyboard.keys[key.toUpperCase()];
                }
            }
            this.keyEvent(event);
        };
        System.keyEvent = function (event) {
            var triggered = false;
            for (var _i = 0, _a = this.keyboardObservers; _i < _a.length; _i++) {
                var observer = _a[_i];
                var keys = observer.keys;
                if (!this.locked(observer) && this.shortcutMatches(event, keys)) {
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
        System.addKeyObserver = function (keys, callback, group) {
            this.keyboardObservers.push({
                keys: keys,
                callback: callback,
                group: group
            });
        };
        System.lockShortcutGroup = function (group) {
            this.lockedGroups[group] = true;
        };
        System.unlockShortcutGroup = function (group) {
            delete this.lockedGroups[group];
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
            var expectedModifiers = [];
            for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
                var key = keys_2[_i];
                if (modifiers.indexOf(key) >= 0) {
                    expectedModifiers.push(key);
                    if (!event[propertyName(key)]) {
                        return false;
                    }
                }
                else if (event.keyCode != Keyboard_5.Keyboard.keys[key]) {
                    return false;
                }
            }
            for (var _a = 0, modifiers_2 = modifiers; _a < modifiers_2.length; _a++) {
                var modifier = modifiers_2[_a];
                if (expectedModifiers.indexOf(modifier) == -1) {
                    if (event[propertyName(modifier)]) {
                        return false;
                    }
                }
            }
            return true;
        };
        System.locked = function (observer) {
            return this.lockedGroups.hasOwnProperty(observer.group);
        };
        System.keyboardObservers = [];
        System.languageChangeObservers = [];
        System.eventBlock = false;
        System.lockedGroups = {};
        return System;
    }());
    exports.System = System;
});
define("interface/Mainbar", ["require", "exports", "interface/AutomatonRenderer", "Memento", "interface/Renderer", "Settings"], function (require, exports, AutomatonRenderer_1, Memento_1, Renderer_4, Settings_14) {
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
            var canvas = this.canvas;
            var node = this.node;
            var memento = new Memento_1.Memento(function () {
                return Settings_14.Settings.undoMaxAmount;
            });
            this.automatonRenderer = new AutomatonRenderer_1.AutomatonRenderer(canvas, node, memento);
            Settings_14.Settings.automatonRenderer = this.automatonRenderer;
        };
        Mainbar.prototype.onRender = function () {
            this.automatonRenderer.render();
        };
        return Mainbar;
    }(Renderer_4.Renderer));
    exports.Mainbar = Mainbar;
});
define("interface/UI", ["require", "exports", "interface/Mainbar", "Settings", "interface/Sidebar", "System", "Utils"], function (require, exports, Mainbar_1, Settings_15, Sidebar_1, System_5, Utils_15) {
    "use strict";
    var UI = (function () {
        function UI() {
            var sidebar = new Sidebar_1.Sidebar();
            var mainbar = new Mainbar_1.Mainbar();
            this.bindSidebar(sidebar);
            this.bindMain(mainbar);
            System_5.System.bindSidebar(sidebar);
        }
        UI.prototype.render = function () {
            this.sidebarRenderer.render();
            this.mainRenderer.render();
            console.log("Interface ready.");
        };
        UI.prototype.bindSidebar = function (renderer) {
            renderer.bind(Utils_15.utils.id(Settings_15.Settings.sidebarID));
            this.sidebarRenderer = renderer;
        };
        UI.prototype.bindMain = function (renderer) {
            renderer.bind(Utils_15.utils.id(Settings_15.Settings.mainbarID));
            this.mainRenderer = renderer;
        };
        return UI;
    }());
    exports.UI = UI;
});
define("main", ["require", "exports", "Settings", "System", "interface/UI"], function (require, exports, Settings_16, System_6, UI_1) {
    "use strict";
    Settings_16.Settings.update();
    $(document).ready(function () {
        var ui = new UI_1.UI();
        ui.render();
        document.body.addEventListener("keydown", function (e) {
            if (document.activeElement.tagName.toLowerCase() != "input") {
                return System_6.System.keyEvent(e);
            }
            return true;
        });
    });
});
