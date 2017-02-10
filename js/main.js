var __extends=this&&this.__extends||function(t,e){function i(){this.constructor=t}for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)};define("Keyboard",["require","exports"],function(t,e){"use strict";var i;!function(t){t.keys={A:65,B:66,C:67,D:68,E:69,F:70,G:71,H:72,I:73,J:74,K:75,L:76,M:77,N:78,O:79,P:80,Q:81,R:82,S:83,T:84,U:85,V:86,W:87,X:88,Y:89,Z:90,0:48,1:49,2:50,3:51,4:52,5:53,6:54,7:55,8:56,9:57,ENTER:13,SHIFT:16,SPACE:32,ESC:27,LEFT:37,UP:38,RIGHT:39,DOWN:40,"+":61,"-":173}}(i=e.Keyboard||(e.Keyboard={}))}),define("lists/MachineList",["require","exports"],function(t,e){"use strict";!function(t){t[t.FA=0]="FA",t[t.PDA=1]="PDA",t[t.LBA=2]="LBA"}(e.Machine||(e.Machine={}));e.Machine}),define("interface/Renderer",["require","exports"],function(t,e){"use strict";var i=function(){function t(){}return t.prototype.bind=function(t){this.node=t,this.onBind()},t.prototype.render=function(){this.node&&this.onRender()},t.prototype.onBind=function(){},t}();e.Renderer=i}),define("languages/Portuguese",["require","exports"],function(t,e){"use strict";var i;!function(t){t.strings={LANGUAGE_NAME:"Português",SELECT_LANGUAGE:"Idioma do Sistema",CHANGE_LANGUAGE:'Mudar o idioma para "%"?',FILE_MENUBAR:"Manipulação de Arquivos",SAVE:"Salvar",OPEN:"Abrir",SELECT_MACHINE:"Seleção de Máquina",FA:"Autômato Finito",PDA:"Autômato de Pilha",LBA:"Autômato Linearmente Limitado",RECOGNITION:"Reconhecimento",TEST_CASE:"caso de teste"}}(i=e.portuguese||(e.portuguese={}))}),define("languages/English",["require","exports"],function(t,e){"use strict";var i;!function(t){t.strings={LANGUAGE_NAME:"English",SELECT_LANGUAGE:"System Language",CHANGE_LANGUAGE:'Change the language to "%"?',FILE_MENUBAR:"File Manipulation",SAVE:"Save",OPEN:"Open",SELECT_MACHINE:"Machine Selection",FA:"Finite Automaton",PDA:"Pushdown Automaton",LBA:"Linearly Bounded Automaton",RECOGNITION:"Recognition",TEST_CASE:"test case"}}(i=e.english||(e.english={}))}),define("lists/LanguageList",["require","exports","languages/Portuguese","languages/English"],function(t,e,i,n){"use strict";function r(t){for(var i in t)e.hasOwnProperty(i)||(e[i]=t[i])}r(i),r(n)}),define("datastructures/Queue",["require","exports"],function(t,e){"use strict";var i=function(){function t(){this.data=[],this.pointer=0}return t.prototype.push=function(t){this.data.push(t)},t.prototype.front=function(){return this.data[this.pointer]},t.prototype.pop=function(){var t=this.front();return this.pointer++,this.pointer>=this.size()/2&&(this.data=this.data.slice(this.pointer),this.pointer=0),t},t.prototype.clear=function(){this.data=[],this.pointer=0},t.prototype.empty=function(){return 0==this.size()},t.prototype.size=function(){return this.data.length-this.pointer},t}();e.Queue=i}),define("datastructures/UnorderedSet",["require","exports"],function(t,e){"use strict";var i=function(){function t(){this.data={},this.count=0}return t.prototype.insert=function(t){this.contains(t)||this.count++,this.data[t]=!0},t.prototype.erase=function(t){this.contains(t)&&this.count--,delete this.data[t]},t.prototype.contains=function(t){return!!this.data[t]},t.prototype.clear=function(){this.data={},this.count=0},t.prototype.empty=function(){return 0==this.size()},t.prototype.size=function(){return this.count},t.prototype.forEach=function(t){for(var e in this.data)if(this.data.hasOwnProperty(e)&&t(parseFloat(e))===!1)break},t.prototype.asList=function(){var t=[];return this.forEach(function(e){t.push(e)}),t},t}();e.UnorderedSet=i}),define("machines/FA",["require","exports","datastructures/Queue","datastructures/UnorderedSet"],function(t,e,i,n){"use strict";var r=function(){function t(){this.stateList=[],this.transitions={},this.epsilonTransitions={},this.initialState=-1,this.finalStates=new n.UnorderedSet,this.currentStates=new n.UnorderedSet}return t.prototype.addState=function(t){this.stateList.push(t);var e=this.numStates()-1;return this.transitions[e]={},this.epsilonTransitions[e]=new n.UnorderedSet,this.initialState==-1&&(this.initialState=e,this.reset()),e},t.prototype.removeState=function(t){},t.prototype.addTransition=function(t,e,i){var r=this.transitions[t];""==i?this.epsilonTransitions[t].insert(e):(r.hasOwnProperty(i)||(r[i]=new n.UnorderedSet),r[i].insert(e))},t.prototype.removeTransition=function(t,e,i){var n=this.transitions[t];""==i?this.epsilonTransitions[t].erase(e):n.hasOwnProperty(i)&&n[i].erase(e)},t.prototype.setInitialState=function(t){t<this.numStates()&&(this.initialState=t)},t.prototype.unsetInitialState=function(){this.initialState=-1},t.prototype.getInitialState=function(){return this.initialState},t.prototype.addAcceptingState=function(t){this.finalStates.insert(t)},t.prototype.removeAcceptingState=function(t){this.finalStates.erase(t)},t.prototype.getAcceptingStates=function(){return this.finalStates.asList()},t.prototype.getStates=function(){var t=[],e=this;return this.currentStates.forEach(function(i){t.push(e.stateList[i])}),t},t.prototype.alphabet=function(){var t=[];return t},t.prototype.read=function(t){var e=new n.UnorderedSet,i=this;this.currentStates.forEach(function(n){var r=i.transition(n,t);r&&r.forEach(function(t){e.insert(t)})}),this.expandSpontaneous(e),this.currentStates=e},t.prototype.reset=function(){this.currentStates.clear(),this.currentStates.insert(this.initialState),this.expandSpontaneous(this.currentStates)},t.prototype.accepts=function(){var t=!1,e=this;return this.finalStates.forEach(function(i){if(e.currentStates.contains(i))return t=!0,!1}),t},t.prototype.error=function(){return 0==this.currentStates.size()},t.prototype.numStates=function(){return this.stateList.length},t.prototype.transition=function(t,e){return this.transitions[t][e]},t.prototype.expandSpontaneous=function(t){var e=new i.Queue;for(t.forEach(function(t){e.push(t)});!e.empty();){var n=e.pop(),r=this.epsilonTransitions[n];r.forEach(function(i){t.contains(i)||(t.insert(i),e.push(i))})}},t}();e.FA=r}),define("Utils",["require","exports","System"],function(t,e,i){"use strict";var n;!function(t){function e(t){return document.querySelector(t)}function n(t){return e("#"+t)}function r(t,e){var i=document.createElement(t);return e&&this.foreach(e,function(t,e){i[t]=e}),i}function s(t,e){for(var i in t)if(t.hasOwnProperty(i)&&e(i,t[i])===!1)break}function o(t){return"which"in t?3==t.which:"button"in t?2==t.button:(console.log("[WARNING] Right click events will not work properly in this browser."),!1)}function a(t,e,i,n){return"M"+t+" "+e+" L"+i+" "+n}function u(t,e,i,n,r){var s=t.path(this.linePath(e,i,n,r));return s.attr("stroke","black"),s}function h(t){return t*Math.PI/180}function c(t,e){i.System.addKeyObserver(t,e)}t.select=e,t.id=n,t.create=r,t.foreach=s,t.isRightClick=o,t.linePath=a,t.line=u,t.toRadians=h,t.bindShortcut=c}(n=e.utils||(e.utils={}))}),define("initializers/initFA",["require","exports","interface/Menu","Settings","Utils"],function(t,e,i,n,r){"use strict";var s;!function(t){function e(){var t=[],e=new i.Menu(n.Strings.RECOGNITION),s=r.utils.create("input",{type:"text",placeholder:n.Strings.TEST_CASE});e.add(s),t.push(e),n.Settings.machines[n.Settings.Machine.FA].sidebar=t}t.init=e}(s=e.initFA||(e.initFA={}))}),define("initializers/initPDA",["require","exports"],function(t,e){"use strict";var i;!function(t){function e(){console.log("[INIT] PDA")}t.init=e}(i=e.initPDA||(e.initPDA={}))}),define("initializers/initLBA",["require","exports"],function(t,e){"use strict";var i;!function(t){function e(){console.log("[INIT] LBA")}t.init=e}(i=e.initLBA||(e.initLBA={}))}),define("lists/InitializerList",["require","exports","initializers/initFA","initializers/initPDA","initializers/initLBA"],function(t,e,i,n,r){"use strict";function s(t){for(var i in t)e.hasOwnProperty(i)||(e[i]=t[i])}s(i),s(n),s(r)}),define("Initializer",["require","exports","lists/InitializerList","Utils"],function(t,e,i,n){"use strict";var r=function(){function t(){}return t.exec=function(){this.initSidebars()},t.initSidebars=function(){n.utils.foreach(i,function(t,e){e.init()})},t}();e.Initializer=r}),define("Settings",["require","exports","lists/LanguageList","lists/MachineList","Initializer","Utils"],function(t,e,i,n,r,s){"use strict";var o;!function(t){function o(){var e={};for(var i in t.Machine)t.Machine.hasOwnProperty(i)&&!isNaN(parseInt(i))&&(e[i]={name:t.language.strings[t.Machine[i]],sidebar:[]});s.utils.foreach(e,function(e,i){t.machines[e]=i}),u=!1,r.Initializer.exec()}function a(i){t.language=i,e.Strings=t.language.strings,o()}t.sidebarID="sidebar",t.mainbarID="mainbar",t.slideInterval=300,t.machineSelRows=3,t.machineSelColumns=1,t.stateLabelFontFamily="sans-serif",t.stateLabelFontSize=20,t.stateRadius=32,t.stateRingRadius=27,t.stateDragTolerance=50,t.stateFillColor="white",t.stateStrokeColor="black",t.stateStrokeWidth=1,t.stateRingStrokeWidth=1,t.stateHighlightFillColor="#FFD574",t.stateHighlightStrokeColor="red",t.stateHighlightStrokeWidth=3,t.stateHighlightRingStrokeWidth=2,t.edgeArrowLength=30,t.edgeArrowAngle=30,t.shortcuts={save:["ctrl","S"],open:["ctrl","O"],toggleInitial:["I"],toggleFinal:["F"],dimState:["ESC"]},t.languages=i,t.Machine=n.Machine,t.language=i.english,t.currentMachine=t.Machine.FA,t.machines={};var u=!0;t.update=o,t.changeLanguage=a}(o=e.Settings||(e.Settings={})),e.Strings=o.language.strings,o.update()}),define("interface/Menu",["require","exports","interface/Renderer","Settings","Utils"],function(t,e,i,n,r){"use strict";var s=function(t){function e(e){t.call(this),this.body=null,this.toggled=!1,this.title=e,this.children=[]}return __extends(e,t),e.prototype.add=function(t){this.children.push(t)},e.prototype.clear=function(){this.children=[]},e.prototype.onRender=function(){var t=this.node,e=r.utils.create("div");e.classList.add("menu");var i=r.utils.create("div");i.classList.add("title"),i.innerHTML=this.title,e.appendChild(i);var s=r.utils.create("div");s.classList.add("content");for(var o=0,a=this.children;o<a.length;o++){var u=a[o];s.appendChild(u)}e.appendChild(s),t.appendChild(e),i.addEventListener("click",function(){$(s).is(":animated")||$(s).slideToggle(n.Settings.slideInterval)}),this.body=e,this.toggled&&this.internalToggle()},e.prototype.toggle=function(){this.toggled=!this.toggled,this.body&&this.internalToggle()},e.prototype.html=function(){return this.body},e.prototype.internalToggle=function(){var t=this.body.querySelector(".content");$(t).toggle()},e}(i.Renderer);e.Menu=s}),define("interface/Table",["require","exports","interface/Renderer","Utils"],function(t,e,i,n){"use strict";var r=function(t){function e(e,i){t.call(this),this.numRows=e,this.numColumns=i,this.children=[]}return __extends(e,t),e.prototype.add=function(t){this.children.push(t)},e.prototype.html=function(){for(var t=n.utils.create("table"),e=0,i=0;i<this.numRows;i++){for(var r=n.utils.create("tr"),s=0;s<this.numColumns;s++){var o=n.utils.create("td");e<this.children.length&&o.appendChild(this.children[e]),r.appendChild(o),e++}t.appendChild(r)}return t},e.prototype.onRender=function(){this.node.appendChild(this.html())},e}(i.Renderer);e.Table=r}),define("interface/Sidebar",["require","exports","interface/Menu","interface/Renderer","Settings","Settings","System","interface/Table","Utils"],function(t,e,i,n,r,s,o,a,u){"use strict";var h=function(t){function e(){t.call(this),this.build()}return __extends(e,t),e.prototype.build=function(){this.languageSelection=new i.Menu(s.Strings.SELECT_LANGUAGE),this.fileManipulation=new i.Menu(s.Strings.FILE_MENUBAR),this.machineSelection=new i.Menu(s.Strings.SELECT_MACHINE),this.otherMenus=[],this.buildLanguageSelection(),this.buildFileManipulation(),this.buildMachineSelection(),this.node&&this.onBind()},e.prototype.onBind=function(){this.languageSelection.bind(this.node),this.fileManipulation.bind(this.node),this.machineSelection.bind(this.node);for(var t=0,e=this.otherMenus;t<e.length;t++){var i=e[t];i.bind(this.node)}},e.prototype.onRender=function(){this.languageSelection.render(),this.fileManipulation.render(),this.machineSelection.render();for(var t=0,e=this.otherMenus;t<e.length;t++){var i=e[t];i.render()}},e.prototype.loadMachine=function(t){for(var e=0,i=this.otherMenus;e<i.length;e++){var n=i[e];$(n.html()).remove()}this.otherMenus=r.Settings.machines[t].sidebar;for(var s=0,o=this.otherMenus;s<o.length;s++){var n=o[s];n.bind(this.node)}},e.prototype.buildLanguageSelection=function(){var t=u.utils.create("select"),e=r.Settings.languages,i={},n=0;u.utils.foreach(e,function(e,s){var o=u.utils.create("option");o.value=n.toString(),o.innerHTML=s.strings.LANGUAGE_NAME,t.appendChild(o),i[n]=e,s==r.Settings.language&&(t.selectedIndex=n),n++}),this.languageSelection.clear(),this.languageSelection.add(t),this.languageSelection.toggle(),t.addEventListener("change",function(t){var n=this.options[this.selectedIndex],r=n.value,a=n.innerHTML,u=confirm(s.Strings.CHANGE_LANGUAGE.replace("%",a));u&&o.System.changeLanguage(e[i[r]])})},e.prototype.buildFileManipulation=function(){this.fileManipulation.clear();var t=u.utils.create("input");t.classList.add("file_manip_btn"),t.type="button",t.value=s.Strings.SAVE,t.addEventListener("click",function(){var t="Hello, world!",e=new Blob([t],{type:"text/plain; charset=utf-8"});saveAs(e,"file.txt")}),u.utils.bindShortcut(r.Settings.shortcuts.save,function(){t.click()}),this.fileManipulation.add(t);var e=u.utils.create("input");e.classList.add("file_manip_btn"),e.type="button",e.value=s.Strings.OPEN,e.addEventListener("click",function(){alert("Not yet implemented")}),u.utils.bindShortcut(r.Settings.shortcuts.open,function(){e.click()}),this.fileManipulation.add(e)},e.prototype.buildMachineSelection=function(){var t=new a.Table(r.Settings.machineSelRows,r.Settings.machineSelColumns),e={},i=this;u.utils.foreach(r.Settings.machines,function(n,s){var o=u.utils.create("input");o.classList.add("machine_selection_btn"),o.type="button",o.value=s.name,o.disabled=n==r.Settings.currentMachine,o.addEventListener("click",function(){e[r.Settings.currentMachine].disabled=!1,e[n].disabled=!0,e[n].blur(),r.Settings.currentMachine=n,i.loadMachine(n)}),t.add(o),e[n]=o}),u.utils.bindShortcut(["M"],function(){for(var t=document.querySelectorAll(".machine_selection_btn"),e=0;e<t.length;e++){var i=t[e];if(!i.disabled){i.focus();break}}}),this.machineSelection.clear(),this.machineSelection.add(t.html()),this.loadMachine(r.Settings.currentMachine)},e}(n.Renderer);e.Sidebar=h}),define("System",["require","exports","Keyboard","Settings","Utils"],function(t,e,i,n,r){"use strict";var s=function(){function t(){}return t.changeLanguage=function(t){n.Settings.changeLanguage(t),this.reload()},t.reload=function(){r.utils.id(n.Settings.sidebarID).innerHTML="",this.sidebar.build(),this.sidebar.render()},t.bindSidebar=function(t){this.sidebar=t},t.keyEvent=function(t){for(var e=!1,i=0,n=this.keyboardObservers;i<n.length;i++){var r=n[i],s=r.keys;this.shortcutMatches(t,s)&&(r.callback(),e=!0)}return!e||(t.preventDefault(),!1)},t.addKeyObserver=function(t,e){this.keyboardObservers.push({keys:t,callback:e})},t.shortcutMatches=function(t,e){function n(t){return t+"Key"}for(var r=["alt","ctrl","shift"],s=[],o=0,a=e;o<a.length;o++){var u=a[o];if(r.indexOf(u)>=0){if(s.push(u),!t[n(u)])return!1}else if(t.keyCode!=i.Keyboard.keys[u])return!1}for(var h=0,c=r;h<c.length;h++){var l=c[h];if(s.indexOf(l)==-1&&t[n(l)])return!1}return!0},t.keyboardObservers=[],t}();e.System=s}),define("interface/State",["require","exports","Settings","Utils"],function(t,e,i,n){"use strict";var r=function(){function t(){this.body=null,this.ring=null,this.arrow=null,this.name="",this.initial=!1,this.final=!1,this.highlighted=!1,this.radius=i.Settings.stateRadius}return t.prototype.setPosition=function(t,e){this.x=t,this.y=e},t.prototype.getPosition=function(){return{x:this.x,y:this.y}},t.prototype.setName=function(t){this.name=t},t.prototype.setInitial=function(t){this.initial=t},t.prototype.isInitial=function(){return this.initial},t.prototype.setFinal=function(t){this.final=t},t.prototype.isFinal=function(){return this.final},t.prototype.highlight=function(){this.highlighted=!0},t.prototype.dim=function(){this.highlighted=!1},t.prototype.arrowParams=function(t){var e=t?[t]:[],i=40;return e.concat([this.x-this.radius-i,this.y,this.x-this.radius,this.y])},t.prototype.fillColor=function(){return this.highlighted?i.Settings.stateHighlightFillColor:i.Settings.stateFillColor},t.prototype.strokeColor=function(){return this.highlighted?i.Settings.stateHighlightStrokeColor:i.Settings.stateStrokeColor},t.prototype.strokeWidth=function(){return this.highlighted?i.Settings.stateHighlightStrokeWidth:i.Settings.stateStrokeWidth},t.prototype.ringStrokeWidth=function(){return this.highlighted?i.Settings.stateHighlightRingStrokeWidth:i.Settings.stateRingStrokeWidth},t.prototype.renderBody=function(t){this.body?this.body.attr({cx:this.x,cy:this.y}):(this.body=t.circle(this.x,this.y,this.radius),t.text(this.x,this.y,this.name).attr({"font-family":i.Settings.stateLabelFontFamily,"font-size":i.Settings.stateLabelFontSize})),this.body.attr("fill",this.fillColor()),this.body.attr("stroke",this.strokeColor()),this.body.attr("stroke-width",this.strokeWidth())},t.prototype.renderInitialMark=function(t){this.initial?this.arrow?this.arrow.attr("path",n.utils.linePath.apply(n.utils,this.arrowParams())):this.arrow=n.utils.line.apply(n.utils,this.arrowParams(t)):this.arrow&&(this.arrow.remove(),this.arrow=null)},t.prototype.renderFinalMark=function(t){this.final?(this.ring?this.ring.attr({cx:this.x,cy:this.y}):this.ring=t.circle(this.x,this.y,i.Settings.stateRingRadius),this.ring.attr("stroke",this.strokeColor()),this.ring.attr("stroke-width",this.ringStrokeWidth())):this.ring&&(this.ring.remove(),this.ring=null)},t.prototype.render=function(t){this.renderBody(t),this.renderInitialMark(t),this.renderFinalMark(t)},t.prototype.node=function(){return this.body},t.prototype.html=function(){return this.body?this.body.node:null},t.prototype.drag=function(t,e){var i=this,n=function(t,e){i.body.attr({cx:t,cy:e}),i.ring&&i.ring.attr({cx:t,cy:e}),i.setPosition(t,e)},r=function(t,e,i){return this.ox=this.attr("cx"),this.oy=this.attr("cy"),null},s=function(e,i,r,s,o){return n(this.ox+e,this.oy+i),t.call(this,o),null},o=function(i){var r=this.attr("cx")-this.ox,s=this.attr("cy")-this.oy,o=r*r+s*s,a=e.call(this,o,i);return a||(n(this.ox,this.oy),t.call(this,i)),null};this.body.drag(s,r,o)},t}();e.State=r}),define("interface/Edge",["require","exports","Settings","Utils"],function(t,e,i,n){"use strict";function r(t,e,i){var n=Math.sin(i),r=Math.cos(i),s={x:t.x,y:t.y};s.x-=e.x,s.y-=e.y;var o={x:s.x*r-s.y*n,y:s.x*n+s.y*r};return{x:o.x+e.x,y:o.y+e.y}}var s=function(){function t(){this.origin=null,this.target=null,this.virtualTarget=null,this.body=null,this.head=[]}return t.prototype.setOrigin=function(t){this.origin=t},t.prototype.setTarget=function(t){this.target=t},t.prototype.setVirtualTarget=function(t){this.virtualTarget=t},t.prototype.render=function(t){this.renderBody(t),this.renderHead(t)},t.prototype.renderBody=function(t){var e,r=this.origin.getPosition();if(this.target){e=this.target.getPosition();var s=e.x-r.x,o=e.y-r.y,a=Math.atan2(o,s),u=Math.sin(a),h=Math.cos(a),c=i.Settings.stateRadius*h,l=i.Settings.stateRadius*u;e.x-=c,e.y-=l}else if(this.virtualTarget){e={x:this.virtualTarget.x,y:this.virtualTarget.y};var s=e.x-r.x,o=e.y-r.y;e.x=r.x+.98*s,e.y=r.y+.98*o}else e=r;this.body?this.body.attr("path",n.utils.linePath(r.x,r.y,e.x,e.y)):this.body=n.utils.line(t,r.x,r.y,e.x,e.y)},t.prototype.renderHead=function(t){if(this.target){var e=this.origin.getPosition(),s=this.target.getPosition(),o=s.x-e.x,a=s.y-e.y,u=Math.atan2(a,o),h=Math.sin(u),c=Math.cos(u),l=i.Settings.stateRadius*c,d=i.Settings.stateRadius*h;s.x-=l,s.y-=d,o-=l,a-=d;var f=i.Settings.edgeArrowLength,g=n.utils.toRadians(i.Settings.edgeArrowAngle),p=Math.sqrt(o*o+a*a),y=1-f/p,S={x:e.x+y*o,y:e.y+y*a},v=r(S,s,g),b=r(S,s,-g);this.head.length?(this.head[0].attr("path",n.utils.linePath(v.x,v.y,s.x,s.y)),this.head[1].attr("path",n.utils.linePath(b.x,b.y,s.x,s.y))):(this.head.push(n.utils.line(t,v.x,v.y,s.x,s.y)),this.head.push(n.utils.line(t,b.x,b.y,s.x,s.y)))}},t}();e.Edge=s}),define("interface/StateRenderer",["require","exports","interface/Edge","Settings","interface/State","Utils"],function(t,e,i,n,r,s){"use strict";var o=function(){function t(t,e){this.canvas=null,this.node=null,this.stateList=[],this.edgeList=[],this.highlightedState=null,this.edgeMode=!1,this.currentEdge=null,this.canvas=t,this.node=e}return t.prototype.render=function(){this.stateList=[new r.State,new r.State,new r.State,new r.State];var t=this.stateList;t[0].setPosition(120,120),t[0].setFinal(!0),t[1].setPosition(300,80),t[2].setPosition(340,320),t[3].setPosition(130,290);for(var e=this.canvas,i=this,o=function(t){t.render(e),t.drag(function(){i.updateEdges()},function(r,o){return!(r<=n.Settings.stateDragTolerance)||(i.edgeMode?i.finishEdge(t):s.utils.isRightClick(o)?i.beginEdge(t):t==i.highlightedState?(t.dim(),i.highlightedState=null,t.render(e)):(i.highlightedState&&(i.highlightedState.dim(),i.highlightedState.render(e)),t.highlight(),i.highlightedState=t,t.render(e)),!1)})},a=0,u=this.stateList;a<u.length;a++){var h=u[a];o(h)}this.bindShortcuts(),$(this.node).contextmenu(function(t){return t.preventDefault(),!1}),$(this.node).mousemove(function(t){i.edgeMode&&i.adjustEdge(this,t)})},t.prototype.beginEdge=function(t){console.log("[ENTER EDGE MODE]"),this.edgeMode=!0,this.currentEdge=new i.Edge,this.currentEdge.setOrigin(t)},t.prototype.finishEdge=function(t){console.log("[BUILD EDGE]"),this.edgeMode=!1,this.currentEdge.setTarget(t),this.currentEdge.render(this.canvas),this.edgeList.push(this.currentEdge),this.currentEdge=null},t.prototype.adjustEdge=function(t,e){var i={x:e.pageX-t.offsetLeft,y:e.pageY-t.offsetTop};this.currentEdge.setVirtualTarget(i),this.currentEdge.render(this.canvas)},t.prototype.updateEdges=function(){for(var t=0,e=this.edgeList;t<e.length;t++){var i=e[t];i.render(this.canvas)}},t.prototype.bindShortcuts=function(){var t=this.canvas,e=this.highlightedState;s.utils.bindShortcut(n.Settings.shortcuts.toggleInitial,function(){e&&(e.setInitial(!e.isInitial()),e.render(t))}),s.utils.bindShortcut(n.Settings.shortcuts.toggleFinal,function(){e&&(e.setFinal(!e.isFinal()),e.render(t))});var i=this;s.utils.bindShortcut(n.Settings.shortcuts.dimState,function(){e&&(e.dim(),e.render(t),i.highlightedState=null)})},t}();e.StateRenderer=o}),define("interface/Mainbar",["require","exports","interface/Renderer","interface/StateRenderer"],function(t,e,i,n){"use strict";var r=function(t){function e(){t.call(this),this.canvas=null,this.stateRenderer=null;var e=this;$(window).resize(function(){e.resizeCanvas()})}return __extends(e,t),e.prototype.resizeCanvas=function(){var t=this.canvas;if(t){var e=$(this.node);t.setSize(50,50);var i=e.width(),n=e.height()-10;t.setSize(i,n)}},e.prototype.onBind=function(){this.canvas=Raphael(this.node,0,0),this.resizeCanvas(),this.stateRenderer=new n.StateRenderer(this.canvas,this.node)},e.prototype.onRender=function(){this.stateRenderer.render()},e}(i.Renderer);e.Mainbar=r}),define("interface/UI",["require","exports","interface/Mainbar","Settings","interface/Sidebar","System","Utils"],function(t,e,i,n,r,s,o){"use strict";var a=function(){function t(){var t=new r.Sidebar,e=new i.Mainbar;this.bindSidebar(t),this.bindMain(e),s.System.bindSidebar(t)}return t.prototype.render=function(){this.sidebarRenderer.render(),this.mainRenderer.render(),console.log("Interface ready.")},t.prototype.bindSidebar=function(t){t.bind(o.utils.id(n.Settings.sidebarID)),this.sidebarRenderer=t},t.prototype.bindMain=function(t){t.bind(o.utils.id(n.Settings.mainbarID)),this.mainRenderer=t},t}();e.UI=a}),define("main",["require","exports","System","interface/UI"],function(t,e,i,n){"use strict";$(document).ready(function(){var t=new n.UI;t.render(),document.body.addEventListener("keydown",function(t){return i.System.keyEvent(t)})})});
