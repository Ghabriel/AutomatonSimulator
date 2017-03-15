var __extends=this&&this.__extends||function(t,e){function i(){this.constructor=t}for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)};define("Keyboard",["require","exports"],function(t,e){"use strict";var i;!function(t){t.keys={A:65,B:66,C:67,D:68,E:69,F:70,G:71,H:72,I:73,J:74,K:75,L:76,M:77,N:78,O:79,P:80,Q:81,R:82,S:83,T:84,U:85,V:86,W:87,X:88,Y:89,Z:90,0:48,1:49,2:50,3:51,4:52,5:53,6:54,7:55,8:56,9:57,ENTER:13,SHIFT:16,SPACE:32,ESC:27,DELETE:46,LEFT:37,UP:38,RIGHT:39,DOWN:40,"+":61,"-":173}}(i=e.Keyboard||(e.Keyboard={}))}),define("lists/MachineList",["require","exports"],function(t,e){"use strict";!function(t){t[t.FA=0]="FA",t[t.PDA=1]="PDA",t[t.LBA=2]="LBA"}(e.Machine||(e.Machine={}));e.Machine}),define("interface/Renderer",["require","exports"],function(t,e){"use strict";var i=function(){function t(){}return t.prototype.bind=function(t){this.node=t,this.onBind()},t.prototype.render=function(){this.node&&this.onRender()},t.prototype.onBind=function(){},t}();e.Renderer=i}),define("languages/Portuguese",["require","exports"],function(t,e){"use strict";var i;!function(t){t.strings={LANGUAGE_NAME:"Português",SELECT_LANGUAGE:"Idioma do Sistema",CHANGE_LANGUAGE:'Mudar o idioma para "%"?',FILE_MENUBAR:"Manipulação de Arquivos",SAVE:"Salvar",OPEN:"Abrir",SELECT_MACHINE:"Seleção de Máquina",CLEAR_MACHINE:"Limpar",CLEAR_CONFIRMATION:"Deseja realmente limpar o autômato?",FA:"Autômato Finito",PDA:"Autômato de Pilha",LBA:"Autômato Linearmente Limitado",RECOGNITION:"Reconhecimento",TEST_CASE:"caso de teste",FAST_RECOGNITION:"Reconhecimento rápido",STEP_RECOGNITION:"Reconhecimento passo-a-passo",STOP_RECOGNITION:"Parar reconhecimento passo-a-passo"}}(i=e.portuguese||(e.portuguese={}))}),define("languages/English",["require","exports"],function(t,e){"use strict";var i;!function(t){t.strings={LANGUAGE_NAME:"English",SELECT_LANGUAGE:"System Language",CHANGE_LANGUAGE:'Change the language to "%"?',FILE_MENUBAR:"File Manipulation",SAVE:"Save",OPEN:"Open",SELECT_MACHINE:"Machine Selection",CLEAR_MACHINE:"Clear",CLEAR_CONFIRMATION:"Do you really want to reset this automaton?",FA:"Finite Automaton",PDA:"Pushdown Automaton",LBA:"Linearly Bounded Automaton",RECOGNITION:"Recognition",TEST_CASE:"test case",FAST_RECOGNITION:"Fast recognition",STEP_RECOGNITION:"Step-by-step recognition",STOP_RECOGNITION:"Stop step-by-step recognition"}}(i=e.english||(e.english={}))}),define("lists/LanguageList",["require","exports","languages/Portuguese","languages/English"],function(t,e,i,n){"use strict";function s(t){for(var i in t)e.hasOwnProperty(i)||(e[i]=t[i])}s(i),s(n)}),define("datastructures/Queue",["require","exports"],function(t,e){"use strict";var i=function(){function t(){this.data=[],this.pointer=0}return t.prototype.push=function(t){this.data.push(t)},t.prototype.front=function(){return this.data[this.pointer]},t.prototype.pop=function(){var t=this.front();return this.pointer++,this.pointer>=this.size()/2&&(this.data=this.data.slice(this.pointer),this.pointer=0),t},t.prototype.clear=function(){this.data=[],this.pointer=0},t.prototype.empty=function(){return 0==this.size()},t.prototype.size=function(){return this.data.length-this.pointer},t}();e.Queue=i}),define("datastructures/UnorderedSet",["require","exports"],function(t,e){"use strict";var i=function(){function t(){this.data={},this.count=0}return t.prototype.insert=function(t){this.contains(t)||this.count++,this.data[t]=!0},t.prototype.erase=function(t){this.contains(t)&&this.count--,delete this.data[t]},t.prototype.contains=function(t){return!!this.data[t]},t.prototype.clear=function(){this.data={},this.count=0},t.prototype.empty=function(){return 0==this.size()},t.prototype.size=function(){return this.count},t.prototype.forEach=function(t){for(var e in this.data)if(this.data.hasOwnProperty(e)&&t(parseFloat(e))===!1)break},t.prototype.asList=function(){var t=[];return this.forEach(function(e){t.push(e)}),t},t}();e.UnorderedSet=i}),define("machines/FA",["require","exports","datastructures/Queue","datastructures/UnorderedSet"],function(t,e,i,n){"use strict";var s=function(){function t(){this.stateList=[],this.transitions={},this.epsilonTransitions={},this.initialState=-1,this.finalStates=new n.UnorderedSet,this.currentStates=new n.UnorderedSet}return t.prototype.addState=function(t){this.stateList.push(t);var e=this.numStates()-1;return this.transitions[e]={},this.epsilonTransitions[e]=new n.UnorderedSet,this.initialState==-1&&(this.initialState=e,this.reset()),e},t.prototype.removeState=function(t){},t.prototype.addTransition=function(t,e,i){var s=this.transitions[t];""==i?this.epsilonTransitions[t].insert(e):(s.hasOwnProperty(i)||(s[i]=new n.UnorderedSet),s[i].insert(e))},t.prototype.removeTransition=function(t,e,i){var n=this.transitions[t];""==i?this.epsilonTransitions[t].erase(e):n.hasOwnProperty(i)&&n[i].erase(e)},t.prototype.setInitialState=function(t){t<this.numStates()&&(this.initialState=t)},t.prototype.unsetInitialState=function(){this.initialState=-1},t.prototype.getInitialState=function(){return this.initialState},t.prototype.addAcceptingState=function(t){this.finalStates.insert(t)},t.prototype.removeAcceptingState=function(t){this.finalStates.erase(t)},t.prototype.getAcceptingStates=function(){return this.finalStates.asList()},t.prototype.getStates=function(){var t=[],e=this;return this.currentStates.forEach(function(i){t.push(e.stateList[i])}),t},t.prototype.alphabet=function(){var t=[];return t},t.prototype.read=function(t){var e=new n.UnorderedSet,i=this;this.currentStates.forEach(function(n){var s=i.transition(n,t);s&&s.forEach(function(t){e.insert(t)})}),this.expandSpontaneous(e),this.currentStates=e},t.prototype.reset=function(){this.currentStates.clear(),this.currentStates.insert(this.initialState),this.expandSpontaneous(this.currentStates)},t.prototype.accepts=function(){var t=!1,e=this;return this.finalStates.forEach(function(i){if(e.currentStates.contains(i))return t=!0,!1}),t},t.prototype.error=function(){return 0==this.currentStates.size()},t.prototype.numStates=function(){return this.stateList.length},t.prototype.transition=function(t,e){return this.transitions[t][e]},t.prototype.expandSpontaneous=function(t){var e=new i.Queue;for(t.forEach(function(t){e.push(t)});!e.empty();){var n=e.pop(),s=this.epsilonTransitions[n];s.forEach(function(i){t.contains(i)||(t.insert(i),e.push(i))})}},t}();e.FA=s}),define("Utils",["require","exports","System"],function(t,e,i){"use strict";var n;!function(t){function e(t){return document.querySelector(t)}function n(t){return e("#"+t)}function s(t,e){var i=document.createElement(t);return e&&this.foreach(e,function(t,e){"click"==t?i.addEventListener("click",e):i[t]=e}),i}function r(t,e){for(var i in t)if(t.hasOwnProperty(i)&&e(i,t[i])===!1)break}function a(t){return"which"in t?3==t.which:"button"in t?2==t.button:(console.log("[WARNING] Right click events will not work properly in this browser."),!1)}function o(t,e,i,n){return"M"+t+" "+e+" L"+i+" "+n}function h(t,e,i,n,s){var r=t.path(this.linePath(e,i,n,s));return r.attr("stroke","black"),r}function u(t){return t*Math.PI/180}function l(t){return 180*t/Math.PI}function c(t,e,i){var n=Math.sin(i),s=Math.cos(i),r={x:t.x,y:t.y};r.x-=e.x,r.y-=e.y;var a={x:r.x*s-r.y*n,y:r.x*n+r.y*s};return{x:a.x+e.x,y:a.y+e.y}}function d(t,e){return t&&e&&t.x==e.x&&t.y==e.y}function g(t,e){i.System.addKeyObserver(t,e)}function f(t){setTimeout(t,0)}t.select=e,t.id=n,t.create=s,t.foreach=r,t.isRightClick=a,t.linePath=o,t.line=h,t.toRadians=u,t.toDegrees=l,t.rotatePoint=c,t.samePoint=d,t.bindShortcut=g,t.async=f}(n=e.utils||(e.utils={}))}),define("initializers/initFA",["require","exports","interface/Menu","Settings","Utils"],function(t,e,i,n,s){"use strict";var r;!function(t){function e(){var t=[],e=new i.Menu(n.Strings.RECOGNITION),o=[];r(o),a(o);for(var h=0,u=o;h<u.length;h++){for(var l=u[h],c=s.utils.create("div",{className:"row"}),d=0,g=l;d<g.length;d++){var f=g[d];c.appendChild(f)}e.add(c)}t.push(e),n.Settings.machines[n.Settings.Machine.FA].sidebar=t}function r(t){var e=s.utils.create("input",{type:"text",placeholder:n.Strings.TEST_CASE});t.push([e]),o=e}function a(t){var e=!0,i=!1,r=n.Settings.disabledButtonClass,a=s.utils.create("img",{className:"image_button",src:"images/fastforward.svg",title:n.Strings.FAST_RECOGNITION,click:function(){e&&alert("TODO: fast forward")}}),h=s.utils.create("img",{className:"image_button "+r,src:"images/stop.svg",title:n.Strings.STOP_RECOGNITION});h.addEventListener("click",function(){i&&(e=!0,a.classList.remove(r),o.disabled=!1,i=!1,h.classList.add(r))});var u=s.utils.create("img",{className:"image_button",src:"images/play.svg",title:n.Strings.STEP_RECOGNITION,click:function(){e=!1,a.classList.add(r),o.disabled=!0,i=!0,h.classList.remove(r)}});t.push([a,u,h])}t.init=e;var o=null}(r=e.initFA||(e.initFA={}))}),define("initializers/initPDA",["require","exports"],function(t,e){"use strict";var i;!function(t){function e(){console.log("[INIT] PDA")}t.init=e}(i=e.initPDA||(e.initPDA={}))}),define("initializers/initLBA",["require","exports"],function(t,e){"use strict";var i;!function(t){function e(){console.log("[INIT] LBA")}t.init=e}(i=e.initLBA||(e.initLBA={}))}),define("lists/InitializerList",["require","exports","initializers/initFA","initializers/initPDA","initializers/initLBA"],function(t,e,i,n,s){"use strict";function r(t){for(var i in t)e.hasOwnProperty(i)||(e[i]=t[i])}r(i),r(n),r(s)}),define("Initializer",["require","exports","lists/InitializerList","Utils"],function(t,e,i,n){"use strict";var s=function(){function t(){}return t.exec=function(){this.initSidebars()},t.initSidebars=function(){n.utils.foreach(i,function(t,e){e.init()})},t}();e.Initializer=s}),define("Settings",["require","exports","lists/LanguageList","lists/MachineList","Initializer","Utils"],function(t,e,i,n,s,r){"use strict";var a;!function(t){function a(){var e={};for(var i in t.Machine)t.Machine.hasOwnProperty(i)&&!isNaN(parseInt(i))&&(e[i]={name:t.language.strings[t.Machine[i]],sidebar:[]});r.utils.foreach(e,function(e,i){t.machines[e]=i}),h=!1,s.Initializer.exec()}function o(i){t.language=i,e.Strings=t.language.strings,a()}t.sidebarID="sidebar",t.mainbarID="mainbar",t.disabledButtonClass="disabled",t.slideInterval=300,t.machineSelRows=3,t.machineSelColumns=1,t.stateRadius=32,t.stateRingRadius=27,t.stateDragTolerance=50,t.stateFillColor="white",t.stateStrokeColor="black",t.stateStrokeWidth=1,t.stateRingStrokeWidth=1,t.stateLabelFontFamily="arial",t.stateLabelFontSize=20,t.stateLabelFontColor="black",t.stateInitialMarkLength=40,t.stateInitialMarkHeadLength=15,t.stateInitialMarkAngle=r.utils.toRadians(20),t.stateInitialMarkColor="blue",t.stateInitialMarkThickness=2,t.stateHighlightFillColor="#FFD574",t.stateHighlightStrokeColor="red",t.stateHighlightStrokeWidth=3,t.stateHighlightRingStrokeWidth=2,t.edgeArrowLength=30,t.edgeArrowAngle=r.utils.toRadians(30),t.edgeTextFontFamily="arial",t.edgeTextFontSize=20,t.edgeTextFontColor="black",t.shortcuts={save:["ctrl","S"],open:["ctrl","O"],toggleInitial:["I"],toggleFinal:["F"],dimState:["ESC"],deleteState:["DELETE"],clearMachine:["C"],left:["LEFT"],right:["RIGHT"],up:["UP"],down:["DOWN"],undo:["ctrl","Z"]},t.languages=i,t.Machine=n.Machine,t.language=i.english,t.currentMachine=t.Machine.FA,t.machines={};var h=!0;t.update=a,t.changeLanguage=o}(a=e.Settings||(e.Settings={})),e.Strings=a.language.strings,a.update()}),define("interface/Menu",["require","exports","interface/Renderer","Settings","Utils"],function(t,e,i,n,s){"use strict";var r=function(t){function e(e){t.call(this),this.body=null,this.toggled=!1,this.title=e,this.children=[]}return __extends(e,t),e.prototype.add=function(t){this.children.push(t)},e.prototype.clear=function(){this.children=[]},e.prototype.onRender=function(){var t=this.node,e=s.utils.create("div");e.classList.add("menu");var i=s.utils.create("div");i.classList.add("title"),i.innerHTML=this.title,e.appendChild(i);var r=s.utils.create("div");r.classList.add("content");for(var a=0,o=this.children;a<o.length;a++){var h=o[a];r.appendChild(h)}e.appendChild(r),t.appendChild(e),i.addEventListener("click",function(){$(r).is(":animated")||$(r).slideToggle(n.Settings.slideInterval)}),this.body=e,this.toggled&&this.internalToggle()},e.prototype.toggle=function(){this.toggled=!this.toggled,this.body&&this.internalToggle()},e.prototype.html=function(){return this.body},e.prototype.internalToggle=function(){var t=this.body.querySelector(".content");$(t).toggle()},e}(i.Renderer);e.Menu=r}),define("interface/Table",["require","exports","interface/Renderer","Utils"],function(t,e,i,n){"use strict";var s=function(t){function e(e,i){t.call(this),this.numRows=e,this.numColumns=i,this.children=[]}return __extends(e,t),e.prototype.add=function(t){this.children.push(t)},e.prototype.html=function(){for(var t=n.utils.create("table"),e=0,i=0;i<this.numRows;i++){for(var s=n.utils.create("tr"),r=0;r<this.numColumns;r++){var a=n.utils.create("td");e<this.children.length&&a.appendChild(this.children[e]),s.appendChild(a),e++}t.appendChild(s)}return t},e.prototype.onRender=function(){this.node.appendChild(this.html())},e}(i.Renderer);e.Table=s}),define("interface/Sidebar",["require","exports","interface/Menu","interface/Renderer","Settings","Settings","System","interface/Table","Utils"],function(t,e,i,n,s,r,a,o,h){"use strict";var u=function(t){function e(){t.call(this),this.build()}return __extends(e,t),e.prototype.build=function(){this.languageSelection=new i.Menu(r.Strings.SELECT_LANGUAGE),this.fileManipulation=new i.Menu(r.Strings.FILE_MENUBAR),this.machineSelection=new i.Menu(r.Strings.SELECT_MACHINE),this.otherMenus=[],this.buildLanguageSelection(),this.buildFileManipulation(),this.buildMachineSelection(),this.node&&this.onBind()},e.prototype.onBind=function(){this.languageSelection.bind(this.node),this.fileManipulation.bind(this.node),this.machineSelection.bind(this.node);for(var t=0,e=this.otherMenus;t<e.length;t++){var i=e[t];i.bind(this.node)}},e.prototype.onRender=function(){this.languageSelection.render(),this.fileManipulation.render(),this.machineSelection.render(),this.renderDynamicMenus()},e.prototype.renderDynamicMenus=function(){for(var t=0,e=this.otherMenus;t<e.length;t++){var i=e[t];i.render()}},e.prototype.loadMachine=function(t){for(var e=0,i=this.otherMenus;e<i.length;e++){var n=i[e];$(n.html()).remove()}this.otherMenus=s.Settings.machines[t].sidebar;for(var r=0,a=this.otherMenus;r<a.length;r++){var n=a[r];n.bind(this.node)}},e.prototype.buildLanguageSelection=function(){var t=h.utils.create("select"),e=s.Settings.languages,i={},n=0;h.utils.foreach(e,function(e,r){var a=h.utils.create("option");a.value=n.toString(),a.innerHTML=r.strings.LANGUAGE_NAME,t.appendChild(a),i[n]=e,r==s.Settings.language&&(t.selectedIndex=n),n++}),this.languageSelection.clear(),this.languageSelection.add(t),this.languageSelection.toggle(),t.addEventListener("change",function(t){var n=this.options[this.selectedIndex],s=n.value,o=n.innerHTML,h=confirm(r.Strings.CHANGE_LANGUAGE.replace("%",o));h&&a.System.changeLanguage(e[i[s]])})},e.prototype.buildFileManipulation=function(){this.fileManipulation.clear();var t=h.utils.create("input");t.classList.add("file_manip_btn"),t.type="button",t.value=r.Strings.SAVE,t.addEventListener("click",function(){var t="Hello, world!",e=new Blob([t],{type:"text/plain; charset=utf-8"});saveAs(e,"file.txt")}),h.utils.bindShortcut(s.Settings.shortcuts.save,function(){t.click()}),this.fileManipulation.add(t);var e=h.utils.create("input");e.classList.add("file_manip_btn"),e.type="button",e.value=r.Strings.OPEN,e.addEventListener("click",function(){alert("Not yet implemented")}),h.utils.bindShortcut(s.Settings.shortcuts.open,function(){e.click()}),this.fileManipulation.add(e)},e.prototype.buildMachineSelection=function(){var t=new o.Table(s.Settings.machineSelRows,s.Settings.machineSelColumns),e={},i=this;h.utils.foreach(s.Settings.machines,function(n,r){var a=h.utils.create("input");a.classList.add("machine_selection_btn"),a.type="button",a.value=r.name,a.disabled=n==s.Settings.currentMachine,a.addEventListener("click",function(){e[s.Settings.currentMachine].disabled=!1,e[n].disabled=!0,e[n].blur(),s.Settings.currentMachine=n,i.loadMachine(n),i.renderDynamicMenus()}),t.add(a),e[n]=a}),h.utils.bindShortcut(["M"],function(){for(var t=document.querySelectorAll(".machine_selection_btn"),e=0;e<t.length;e++){var i=t[e];if(!i.disabled){i.focus();break}}}),this.machineSelection.clear(),this.machineSelection.add(t.html()),this.loadMachine(s.Settings.currentMachine)},e}(n.Renderer);e.Sidebar=u}),define("System",["require","exports","Keyboard","Settings","Utils"],function(t,e,i,n,s){"use strict";var r=function(){function t(){}return t.changeLanguage=function(t){n.Settings.changeLanguage(t),this.reload()},t.reload=function(){s.utils.id(n.Settings.sidebarID).innerHTML="",this.sidebar.build(),this.sidebar.render()},t.bindSidebar=function(t){this.sidebar=t},t.keyEvent=function(t){for(var e=!1,i=0,n=this.keyboardObservers;i<n.length;i++){var s=n[i],r=s.keys;this.shortcutMatches(t,r)&&(s.callback(),e=!0)}return!e||(t.preventDefault(),!1)},t.addKeyObserver=function(t,e){this.keyboardObservers.push({keys:t,callback:e})},t.shortcutMatches=function(t,e){function n(t){return t+"Key"}for(var s=["alt","ctrl","shift"],r=[],a=0,o=e;a<o.length;a++){var h=o[a];if(s.indexOf(h)>=0){if(r.push(h),!t[n(h)])return!1}else if(t.keyCode!=i.Keyboard.keys[h])return!1}for(var u=0,l=s;u<l.length;u++){var c=l[u];if(r.indexOf(c)==-1&&t[n(c)])return!1}return!0},t.keyboardObservers=[],t}();e.System=r}),define("interface/State",["require","exports","Settings","Utils"],function(t,e,i,n){"use strict";var s=function(){function t(){this.initial=!1,this.final=!1,this.name="",this.highlighted=!1,this.initialMarkOffsets=[],this.body=null,this.ring=null,this.arrowParts=[],this.textContainer=null,this.radius=i.Settings.stateRadius}return t.prototype.setPosition=function(t,e){this.x=t,this.y=e},t.prototype.getPosition=function(){return{x:this.x,y:this.y}},t.prototype.setInitial=function(t){this.initial=t},t.prototype.isInitial=function(){return this.initial},t.prototype.setFinal=function(t){this.final=t},t.prototype.isFinal=function(){return this.final},t.prototype.setName=function(t){this.name=t},t.prototype.highlight=function(){this.highlighted=!0},t.prototype.dim=function(){this.highlighted=!1},t.prototype.remove=function(){this.body&&(this.body.remove(),this.body=null),this.ring&&(this.ring.remove(),this.ring=null);for(var t=0,e=this.arrowParts;t<e.length;t++){var i=e[t];i.remove()}this.arrowParts=[]},t.prototype.render=function(t){this.renderBody(t),this.renderInitialMark(t),this.renderFinalMark(t),this.renderText(t)},t.prototype.node=function(){return this.body},t.prototype.html=function(){return this.body?this.body.node:null},t.prototype.drag=function(t,e){var i=this,n=function(t,e,n){var s=i.getPosition();return this.ox=s.x,this.oy=s.y,null},s=0,r=3,a=function(e,n,a,o,h){return i.setVisualPosition(this.ox+e,this.oy+n),0==s&&t.call(this,h),s=(s+1)%r,null},o=function(n){var s=i.getPosition(),r=s.x-this.ox,a=s.y-this.oy,o=r*r+a*a,h=e.call(this,o,n);return h||0==r&&0==a||(i.setVisualPosition(this.ox,this.oy),t.call(this,n)),null};this.body.drag(a,n,o),this.textContainer&&this.textContainer.drag(a,n,o)},t.prototype.fillColor=function(){return this.highlighted?i.Settings.stateHighlightFillColor:i.Settings.stateFillColor},t.prototype.strokeColor=function(){return this.highlighted?i.Settings.stateHighlightStrokeColor:i.Settings.stateStrokeColor},t.prototype.strokeWidth=function(){return this.highlighted?i.Settings.stateHighlightStrokeWidth:i.Settings.stateStrokeWidth},t.prototype.ringStrokeWidth=function(){return this.highlighted?i.Settings.stateHighlightRingStrokeWidth:i.Settings.stateRingStrokeWidth},t.prototype.renderBody=function(t){this.body?this.body.attr({cx:this.x,cy:this.y}):this.body=t.circle(this.x,this.y,this.radius),this.body.attr("fill",this.fillColor()),this.body.attr("stroke",this.strokeColor()),this.body.attr("stroke-width",this.strokeWidth())},t.prototype.updateInitialMarkOffsets=function(){if(this.initialMarkOffsets.length)return this.initialMarkOffsets;var t=i.Settings.stateInitialMarkLength,e=this.x-this.radius,s=this.y,r=i.Settings.stateInitialMarkHeadLength,a=i.Settings.stateInitialMarkAngle,o=1-r/t,h={x:e-t+o*t,y:s},u={x:e,y:s},l=n.utils.rotatePoint(h,u,a),c=n.utils.rotatePoint(h,u,-a);this.initialMarkOffsets=[{x:l.x-e,y:l.y-s},{x:c.x-e,y:c.y-s}]},t.prototype.renderInitialMark=function(t){if(this.initial){var e=i.Settings.stateInitialMarkLength,s=this.x-this.radius,r=this.y;if(this.arrowParts.length){var a=this.arrowParts,o=a[0],h=a[1],u=a[2];o.attr("path",n.utils.linePath(s-e,r,s,r)),this.updateInitialMarkOffsets();var l=this.initialMarkOffsets[0],c=this.initialMarkOffsets[1];h.attr("path",n.utils.linePath(l.x+s,l.y+r,s,r)),u.attr("path",n.utils.linePath(c.x+s,c.y+r,s,r))}else{var d=i.Settings.stateInitialMarkColor,g=i.Settings.stateInitialMarkThickness,o=n.utils.line(t,s-e,r,s,r);o.attr("stroke",d),o.attr("stroke-width",g),this.updateInitialMarkOffsets();var l=this.initialMarkOffsets[0],c=this.initialMarkOffsets[1],h=n.utils.line(t,l.x+s,l.y+r,s,r);h.attr("stroke",d),h.attr("stroke-width",g);var u=n.utils.line(t,c.x+s,c.y+r,s,r);u.attr("stroke",d),u.attr("stroke-width",g);var a=this.arrowParts;a.push(o),a.push(h),a.push(u)}}else for(var a=this.arrowParts;a.length;)a[a.length-1].remove(),a.pop()},t.prototype.renderFinalMark=function(t){this.final?(this.ring?this.ring.attr({cx:this.x,cy:this.y}):this.ring=t.circle(this.x,this.y,i.Settings.stateRingRadius),this.ring.attr("stroke",this.strokeColor()),this.ring.attr("stroke-width",this.ringStrokeWidth())):this.ring&&(this.ring.remove(),this.ring=null)},t.prototype.renderText=function(t){this.textContainer?(this.textContainer.attr("x",this.x),this.textContainer.attr("y",this.y),this.textContainer.attr("text",this.name)):(this.textContainer=t.text(this.x,this.y,this.name),this.textContainer.attr("font-family",i.Settings.stateLabelFontFamily),this.textContainer.attr("font-size",i.Settings.stateLabelFontSize),this.textContainer.attr("stroke",i.Settings.stateLabelFontColor),this.textContainer.attr("fill",i.Settings.stateLabelFontColor))},t.prototype.setVisualPosition=function(t,e){this.setPosition(t,e),this.body.attr({cx:t,cy:e}),this.ring&&this.ring.attr({cx:t,cy:e}),this.initial&&this.renderInitialMark(),this.renderText()},t}();e.State=s}),define("interface/Edge",["require","exports","Settings","Utils"],function(t,e,i,n){"use strict";var s=function(){function t(){this.origin=null,this.target=null,this.prevOriginPosition=null,this.prevTargetPosition=null,this.virtualTarget=null,this.textList=[],this.body=null,this.head=[],this.textContainer=null}return t.prototype.setOrigin=function(t){this.origin=t},t.prototype.getOrigin=function(){return this.origin},t.prototype.setTarget=function(t){this.target=t},t.prototype.getTarget=function(){return this.target},t.prototype.setVirtualTarget=function(t){this.virtualTarget=t},t.prototype.addText=function(t){this.textList.push(t)},t.prototype.remove=function(){this.body&&(this.body.remove(),this.body=null);for(var t=0,e=this.head;t<e.length;t++){var i=e[t];i.remove()}this.head=[],this.textContainer&&(this.textContainer.remove(),this.textContainer=null)},t.prototype.render=function(t){var e=this.origin&&n.utils.samePoint(this.prevOriginPosition,this.origin.getPosition()),i=this.target&&n.utils.samePoint(this.prevTargetPosition,this.target.getPosition());e&&i||(this.renderBody(t),this.renderHead(t),this.origin&&(this.prevOriginPosition=this.origin.getPosition()),this.target&&(this.prevTargetPosition=this.target.getPosition())),this.target&&this.renderText(t)},t.prototype.renderBody=function(t){var e,s=this.origin.getPosition();if(this.target)e=this.target.getPosition();else if(this.virtualTarget){e={x:this.virtualTarget.x,y:this.virtualTarget.y};var r=e.x-s.x,a=e.y-s.y;e.x=s.x+.98*r,e.y=s.y+.98*a}else e=s;var o=e.x-s.x,h=e.y-s.y,u=Math.atan2(h,o),l=Math.sin(u),c=Math.cos(u),d=i.Settings.stateRadius*c,g=i.Settings.stateRadius*l;s.x+=d,s.y+=g,this.target&&(e.x-=d,e.y-=g),this.body?this.body.attr("path",n.utils.linePath(s.x,s.y,e.x,e.y)):this.body=n.utils.line(t,s.x,s.y,e.x,e.y)},t.prototype.renderHead=function(t){if(this.target){var e=this.origin.getPosition(),s=this.target.getPosition(),r=s.x-e.x,a=s.y-e.y,o=Math.atan2(a,r),h=Math.sin(o),u=Math.cos(o),l=i.Settings.stateRadius*u,c=i.Settings.stateRadius*h;s.x-=l,s.y-=c,r-=l,a-=c;var d=i.Settings.edgeArrowLength,g=i.Settings.edgeArrowAngle,f=Math.sqrt(r*r+a*a),p=1-d/f,S={x:e.x+p*r,y:e.y+p*a},y=n.utils.rotatePoint(S,s,g),v=n.utils.rotatePoint(S,s,-g);this.head.length?(this.head[0].attr("path",n.utils.linePath(y.x,y.y,s.x,s.y)),this.head[1].attr("path",n.utils.linePath(v.x,v.y,s.x,s.y))):(this.head.push(n.utils.line(t,y.x,y.y,s.x,s.y)),this.head.push(n.utils.line(t,v.x,v.y,s.x,s.y)))}},t.prototype.preparedText=function(){return this.textList.join("\n")},t.prototype.renderText=function(t){var e=this.origin.getPosition(),s=this.target.getPosition(),r=(e.x+s.x)/2,a=(e.y+s.y)/2;this.textContainer?(this.textContainer.attr("x",r),this.textContainer.attr("y",a),this.textContainer.attr("text",this.preparedText()),this.textContainer.transform("")):(this.textContainer=t.text(r,a,this.preparedText()),this.textContainer.attr("font-family",i.Settings.edgeTextFontFamily),this.textContainer.attr("font-size",i.Settings.edgeTextFontSize),this.textContainer.attr("stroke",i.Settings.edgeTextFontColor),this.textContainer.attr("fill",i.Settings.edgeTextFontColor));var o=Math.atan2(s.y-e.y,s.x-e.x),h=n.utils.toDegrees(o);(h<-90||h>90)&&(h=(h+180)%360),this.textContainer.rotate(h),a-=.6*i.Settings.edgeTextFontSize,a-=i.Settings.edgeTextFontSize*(this.textList.length-1)*.7,this.textContainer.attr("y",a)},t}();e.Edge=s}),define("interface/StateRenderer",["require","exports","interface/Edge","Settings","interface/State","Utils"],function(t,e,i,n,s,r){"use strict";var a=function(){function t(t,e){this.canvas=null,this.node=null,this.stateList=[],this.edgeList=[],this.highlightedState=null,this.initialState=null,this.edgeMode=!1,this.currentEdge=null,this.canvas=t,this.node=e}return t.prototype.render=function(){var t=new s.State;t.setPosition(350,300),this.stateList.push(t);for(var e=[[100,300],[350,50],[600,300],[350,550]],n=0,a=0,o=e;a<o.length;a++){var h=o[a],u=new s.State;u.setPosition(h[0],h[1]),this.stateList.push(u);var l=new i.Edge;1==n?(l.setOrigin(u),l.setTarget(t)):(l.setOrigin(t),l.setTarget(u)),n++,this.edgeList.push(l)}this.stateList[2].setInitial(!0),this.initialState=this.stateList[2],this.stateList[this.stateList.length-1].setFinal(!0);for(var c=0;c<this.stateList.length;c++)this.stateList[c].setName("q"+c);this.edgeList[0].addText("b"),this.edgeList[0].addText("e"),this.edgeList[1].addText("a"),this.edgeList[2].addText("c"),this.edgeList[3].addText("d");var d=new i.Edge;d.setOrigin(this.stateList[1]),d.setTarget(this.stateList[4]),d.addText("b"),this.edgeList.push(d);var g=new i.Edge;g.setOrigin(this.stateList[3]),g.setTarget(this.stateList[4]),g.addText("c"),this.edgeList.push(g);var f=new i.Edge;f.setOrigin(this.stateList[1]),f.setTarget(this.stateList[2]),f.addText("a"),this.edgeList.push(f);var p=new i.Edge;p.setOrigin(this.stateList[3]),p.setTarget(this.stateList[2]),p.addText("a"),this.edgeList.push(p),this.updateEdges();for(var S=0,y=this.stateList;S<y.length;S++){var v=y[S];v.render(this.canvas),this.bindStateEvents(v)}this.bindShortcuts();var x=this;$(this.node).dblclick(function(t){var e=new s.State;e.setPosition(t.pageX-this.offsetLeft,t.pageY-this.offsetTop),x.stateList.push(e),x.selectState(e),x.bindStateEvents(e),r.utils.async(function(){var t=prompt("Enter the state name:");e.setName(t),e.render(x.canvas)})}),$(this.node).contextmenu(function(t){return t.preventDefault(),!1}),$(this.node).mousemove(function(t){x.edgeMode&&x.adjustEdge(this,t)})},t.prototype.selectState=function(t){this.highlightedState&&(this.highlightedState.dim(),this.highlightedState.render(this.canvas)),t.highlight(),this.highlightedState=t,t.render(this.canvas)},t.prototype.bindStateEvents=function(t){var e=this.canvas,i=this;t.drag(function(){i.updateEdges()},function(s,a){return!(s<=n.Settings.stateDragTolerance)||(i.edgeMode?i.finishEdge(t):r.utils.isRightClick(a)?i.beginEdge(t):t==i.highlightedState?(t.dim(),i.highlightedState=null,t.render(e)):i.selectState(t),!1)})},t.prototype.beginEdge=function(t){this.edgeMode=!0,this.currentEdge=new i.Edge,this.currentEdge.setOrigin(t)},t.prototype.finishEdge=function(t){this.edgeMode=!1;for(var e=this.currentEdge.getOrigin(),i=0,n=this.edgeList;i<n.length;i++){var s=n[i];if(s.getOrigin()==e&&s.getTarget()==t){var a=prompt("Enter some text");return s.addText(a),s.render(this.canvas),this.currentEdge.remove(),void(this.currentEdge=null)}}this.currentEdge.setTarget(t),this.currentEdge.render(this.canvas);var o=this;r.utils.async(function(){var t=prompt("Enter some text");o.currentEdge.addText(t),o.currentEdge.render(o.canvas),o.edgeList.push(o.currentEdge),o.currentEdge=null})},t.prototype.adjustEdge=function(t,e){var i={x:e.pageX-t.offsetLeft,y:e.pageY-t.offsetTop};this.currentEdge.setVirtualTarget(i),this.currentEdge.render(this.canvas)},t.prototype.updateEdges=function(){for(var t=0,e=this.edgeList;t<e.length;t++){var i=e[t];i.render(this.canvas)}},t.prototype.clearSelection=function(){this.highlightedState=null,this.edgeMode&&(this.edgeMode=!1,this.currentEdge.remove(),this.currentEdge=null)},t.prototype.bindShortcuts=function(){var t=this.canvas,e=this;r.utils.bindShortcut(n.Settings.shortcuts.toggleInitial,function(){var i=e.highlightedState;i&&(i==e.initialState?(i.setInitial(!1),e.initialState=null):(e.initialState&&(e.initialState.setInitial(!1),e.initialState.render(t)),i.setInitial(!0),e.initialState=i),i.render(t))}),r.utils.bindShortcut(n.Settings.shortcuts.toggleFinal,function(){var i=e.highlightedState;i&&(i.setFinal(!i.isFinal()),i.render(t))}),r.utils.bindShortcut(n.Settings.shortcuts.dimState,function(){var i=e.highlightedState;i&&(i.dim(),i.render(t),e.highlightedState=null)}),r.utils.bindShortcut(n.Settings.shortcuts.deleteState,function(){var t=e.highlightedState;if(t){for(var i=0;i<e.edgeList.length;i++){var n=e.edgeList[i],s=n.getOrigin(),r=n.getTarget();s!=t&&r!=t||(n.remove(),e.edgeList.splice(i,1),i--)}t.remove();for(var a=e.stateList,i=0;i<a.length;i++)if(a[i]==t){a.splice(i,1);break}e.clearSelection()}}),r.utils.bindShortcut(n.Settings.shortcuts.clearMachine,function(){var t=confirm(n.Strings.CLEAR_CONFIRMATION);if(t){e.clearSelection();for(var i=0,s=e.edgeList;i<s.length;i++){var r=s[i];r.remove()}e.edgeList=[];for(var a=0,o=e.stateList;a<o.length;a++){var h=o[a];h.remove()}e.stateList=[]}}),r.utils.bindShortcut(n.Settings.shortcuts.left,function(){e.moveStateSelection(function(t,e){return t.getPosition().x<e.getPosition().x},function(t,i,n){if(!i)return!0;var s=n.getPosition(),r=t.getPosition(),a=Math.abs(r.y-s.y),o=i.getPosition(),h=Math.abs(o.y-s.y),u=e.selectionThreshold();return a<u?h>=u||r.x>o.x:a<h})}),r.utils.bindShortcut(n.Settings.shortcuts.right,function(){e.moveStateSelection(function(t,e){return t.getPosition().x>e.getPosition().x},function(t,i,n){if(!i)return!0;var s=n.getPosition(),r=t.getPosition(),a=Math.abs(r.y-s.y),o=i.getPosition(),h=Math.abs(o.y-s.y),u=e.selectionThreshold();return a<u?h>=u||r.x<o.x:a<h})}),r.utils.bindShortcut(n.Settings.shortcuts.up,function(){e.moveStateSelection(function(t,e){return t.getPosition().y<e.getPosition().y},function(t,i,n){if(!i)return!0;var s=n.getPosition(),r=t.getPosition(),a=Math.abs(r.x-s.x),o=i.getPosition(),h=Math.abs(o.x-s.x),u=e.selectionThreshold();return a<u?h>=u||r.y>o.y:a<h})}),r.utils.bindShortcut(n.Settings.shortcuts.down,function(){e.moveStateSelection(function(t,e){return t.getPosition().y>e.getPosition().y},function(t,i,n){if(!i)return!0;
var s=n.getPosition(),r=t.getPosition(),a=Math.abs(r.x-s.x),o=i.getPosition(),h=Math.abs(o.x-s.x),u=e.selectionThreshold();return a<e.selectionThreshold()?h>=u||r.y<o.y:a<h})}),r.utils.bindShortcut(n.Settings.shortcuts.undo,function(){alert("TODO: undo")})},t.prototype.selectionThreshold=function(){return 2*n.Settings.stateRadius},t.prototype.moveStateSelection=function(t,e){var i=this.highlightedState;if(i){for(var n=null,s=0,r=this.stateList;s<r.length;s++){var a=r[s];t(a,i)&&e(a,n,i)&&(n=a)}n&&this.selectState(n)}},t}();e.StateRenderer=a}),define("interface/Mainbar",["require","exports","interface/Renderer","interface/StateRenderer"],function(t,e,i,n){"use strict";var s=function(t){function e(){t.call(this),this.canvas=null,this.stateRenderer=null;var e=this;$(window).resize(function(){e.resizeCanvas()})}return __extends(e,t),e.prototype.resizeCanvas=function(){var t=this.canvas;if(t){var e=$(this.node);t.setSize(50,50);var i=e.width(),n=e.height()-10;t.setSize(i,n)}},e.prototype.onBind=function(){this.canvas=Raphael(this.node,0,0),this.resizeCanvas(),this.stateRenderer=new n.StateRenderer(this.canvas,this.node)},e.prototype.onRender=function(){this.stateRenderer.render()},e}(i.Renderer);e.Mainbar=s}),define("interface/UI",["require","exports","interface/Mainbar","Settings","interface/Sidebar","System","Utils"],function(t,e,i,n,s,r,a){"use strict";var o=function(){function t(){var t=new s.Sidebar,e=new i.Mainbar;this.bindSidebar(t),this.bindMain(e),r.System.bindSidebar(t)}return t.prototype.render=function(){this.sidebarRenderer.render(),this.mainRenderer.render(),console.log("Interface ready.")},t.prototype.bindSidebar=function(t){t.bind(a.utils.id(n.Settings.sidebarID)),this.sidebarRenderer=t},t.prototype.bindMain=function(t){t.bind(a.utils.id(n.Settings.mainbarID)),this.mainRenderer=t},t}();e.UI=o}),define("main",["require","exports","System","interface/UI"],function(t,e,i,n){"use strict";$(document).ready(function(){var t=new n.UI;t.render(),document.body.addEventListener("keydown",function(t){if("input"!=document.activeElement.tagName.toLowerCase())return i.System.keyEvent(t)})})});
