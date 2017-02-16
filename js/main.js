var __extends=this&&this.__extends||function(t,i){function e(){this.constructor=t}for(var n in i)i.hasOwnProperty(n)&&(t[n]=i[n]);t.prototype=null===i?Object.create(i):(e.prototype=i.prototype,new e)};define("Keyboard",["require","exports"],function(t,i){"use strict";var e;!function(t){t.keys={A:65,B:66,C:67,D:68,E:69,F:70,G:71,H:72,I:73,J:74,K:75,L:76,M:77,N:78,O:79,P:80,Q:81,R:82,S:83,T:84,U:85,V:86,W:87,X:88,Y:89,Z:90,0:48,1:49,2:50,3:51,4:52,5:53,6:54,7:55,8:56,9:57,ENTER:13,SHIFT:16,SPACE:32,ESC:27,LEFT:37,UP:38,RIGHT:39,DOWN:40,"+":61,"-":173}}(e=i.Keyboard||(i.Keyboard={}))}),define("lists/MachineList",["require","exports"],function(t,i){"use strict";!function(t){t[t.FA=0]="FA",t[t.PDA=1]="PDA",t[t.LBA=2]="LBA"}(i.Machine||(i.Machine={}));i.Machine}),define("interface/Renderer",["require","exports"],function(t,i){"use strict";var e=function(){function t(){}return t.prototype.bind=function(t){this.node=t,this.onBind()},t.prototype.render=function(){this.node&&this.onRender()},t.prototype.onBind=function(){},t}();i.Renderer=e}),define("languages/Portuguese",["require","exports"],function(t,i){"use strict";var e;!function(t){t.strings={LANGUAGE_NAME:"Português",SELECT_LANGUAGE:"Idioma do Sistema",CHANGE_LANGUAGE:'Mudar o idioma para "%"?',FILE_MENUBAR:"Manipulação de Arquivos",SAVE:"Salvar",OPEN:"Abrir",SELECT_MACHINE:"Seleção de Máquina",FA:"Autômato Finito",PDA:"Autômato de Pilha",LBA:"Autômato Linearmente Limitado",RECOGNITION:"Reconhecimento",TEST_CASE:"caso de teste"}}(e=i.portuguese||(i.portuguese={}))}),define("languages/English",["require","exports"],function(t,i){"use strict";var e;!function(t){t.strings={LANGUAGE_NAME:"English",SELECT_LANGUAGE:"System Language",CHANGE_LANGUAGE:'Change the language to "%"?',FILE_MENUBAR:"File Manipulation",SAVE:"Save",OPEN:"Open",SELECT_MACHINE:"Machine Selection",FA:"Finite Automaton",PDA:"Pushdown Automaton",LBA:"Linearly Bounded Automaton",RECOGNITION:"Recognition",TEST_CASE:"test case"}}(e=i.english||(i.english={}))}),define("lists/LanguageList",["require","exports","languages/Portuguese","languages/English"],function(t,i,e,n){"use strict";function r(t){for(var e in t)i.hasOwnProperty(e)||(i[e]=t[e])}r(e),r(n)}),define("datastructures/Queue",["require","exports"],function(t,i){"use strict";var e=function(){function t(){this.data=[],this.pointer=0}return t.prototype.push=function(t){this.data.push(t)},t.prototype.front=function(){return this.data[this.pointer]},t.prototype.pop=function(){var t=this.front();return this.pointer++,this.pointer>=this.size()/2&&(this.data=this.data.slice(this.pointer),this.pointer=0),t},t.prototype.clear=function(){this.data=[],this.pointer=0},t.prototype.empty=function(){return 0==this.size()},t.prototype.size=function(){return this.data.length-this.pointer},t}();i.Queue=e}),define("datastructures/UnorderedSet",["require","exports"],function(t,i){"use strict";var e=function(){function t(){this.data={},this.count=0}return t.prototype.insert=function(t){this.contains(t)||this.count++,this.data[t]=!0},t.prototype.erase=function(t){this.contains(t)&&this.count--,delete this.data[t]},t.prototype.contains=function(t){return!!this.data[t]},t.prototype.clear=function(){this.data={},this.count=0},t.prototype.empty=function(){return 0==this.size()},t.prototype.size=function(){return this.count},t.prototype.forEach=function(t){for(var i in this.data)if(this.data.hasOwnProperty(i)&&t(parseFloat(i))===!1)break},t.prototype.asList=function(){var t=[];return this.forEach(function(i){t.push(i)}),t},t}();i.UnorderedSet=e}),define("machines/FA",["require","exports","datastructures/Queue","datastructures/UnorderedSet"],function(t,i,e,n){"use strict";var r=function(){function t(){this.stateList=[],this.transitions={},this.epsilonTransitions={},this.initialState=-1,this.finalStates=new n.UnorderedSet,this.currentStates=new n.UnorderedSet}return t.prototype.addState=function(t){this.stateList.push(t);var i=this.numStates()-1;return this.transitions[i]={},this.epsilonTransitions[i]=new n.UnorderedSet,this.initialState==-1&&(this.initialState=i,this.reset()),i},t.prototype.removeState=function(t){},t.prototype.addTransition=function(t,i,e){var r=this.transitions[t];""==e?this.epsilonTransitions[t].insert(i):(r.hasOwnProperty(e)||(r[e]=new n.UnorderedSet),r[e].insert(i))},t.prototype.removeTransition=function(t,i,e){var n=this.transitions[t];""==e?this.epsilonTransitions[t].erase(i):n.hasOwnProperty(e)&&n[e].erase(i)},t.prototype.setInitialState=function(t){t<this.numStates()&&(this.initialState=t)},t.prototype.unsetInitialState=function(){this.initialState=-1},t.prototype.getInitialState=function(){return this.initialState},t.prototype.addAcceptingState=function(t){this.finalStates.insert(t)},t.prototype.removeAcceptingState=function(t){this.finalStates.erase(t)},t.prototype.getAcceptingStates=function(){return this.finalStates.asList()},t.prototype.getStates=function(){var t=[],i=this;return this.currentStates.forEach(function(e){t.push(i.stateList[e])}),t},t.prototype.alphabet=function(){var t=[];return t},t.prototype.read=function(t){var i=new n.UnorderedSet,e=this;this.currentStates.forEach(function(n){var r=e.transition(n,t);r&&r.forEach(function(t){i.insert(t)})}),this.expandSpontaneous(i),this.currentStates=i},t.prototype.reset=function(){this.currentStates.clear(),this.currentStates.insert(this.initialState),this.expandSpontaneous(this.currentStates)},t.prototype.accepts=function(){var t=!1,i=this;return this.finalStates.forEach(function(e){if(i.currentStates.contains(e))return t=!0,!1}),t},t.prototype.error=function(){return 0==this.currentStates.size()},t.prototype.numStates=function(){return this.stateList.length},t.prototype.transition=function(t,i){return this.transitions[t][i]},t.prototype.expandSpontaneous=function(t){var i=new e.Queue;for(t.forEach(function(t){i.push(t)});!i.empty();){var n=i.pop(),r=this.epsilonTransitions[n];r.forEach(function(e){t.contains(e)||(t.insert(e),i.push(e))})}},t}();i.FA=r}),define("Utils",["require","exports","System"],function(t,i,e){"use strict";var n;!function(t){function i(t){return document.querySelector(t)}function n(t){return i("#"+t)}function r(t,i){var e=document.createElement(t);return i&&this.foreach(i,function(t,i){e[t]=i}),e}function s(t,i){for(var e in t)if(t.hasOwnProperty(e)&&i(e,t[e])===!1)break}function a(t){return"which"in t?3==t.which:"button"in t?2==t.button:(console.log("[WARNING] Right click events will not work properly in this browser."),!1)}function o(t,i,e,n){return"M"+t+" "+i+" L"+e+" "+n}function h(t,i,e,n,r){var s=t.path(this.linePath(i,e,n,r));return s.attr("stroke","black"),s}function u(t){return t*Math.PI/180}function c(t,i,e){var n=Math.sin(e),r=Math.cos(e),s={x:t.x,y:t.y};s.x-=i.x,s.y-=i.y;var a={x:s.x*r-s.y*n,y:s.x*n+s.y*r};return{x:a.x+i.x,y:a.y+i.y}}function l(t,i){e.System.addKeyObserver(t,i)}t.select=i,t.id=n,t.create=r,t.foreach=s,t.isRightClick=a,t.linePath=o,t.line=h,t.toRadians=u,t.rotatePoint=c,t.bindShortcut=l}(n=i.utils||(i.utils={}))}),define("initializers/initFA",["require","exports","interface/Menu","Settings","Utils"],function(t,i,e,n,r){"use strict";var s;!function(t){function i(){var t=[],i=new e.Menu(n.Strings.RECOGNITION),s=r.utils.create("input",{type:"text",placeholder:n.Strings.TEST_CASE});i.add(s),t.push(i),n.Settings.machines[n.Settings.Machine.FA].sidebar=t}t.init=i}(s=i.initFA||(i.initFA={}))}),define("initializers/initPDA",["require","exports"],function(t,i){"use strict";var e;!function(t){function i(){console.log("[INIT] PDA")}t.init=i}(e=i.initPDA||(i.initPDA={}))}),define("initializers/initLBA",["require","exports"],function(t,i){"use strict";var e;!function(t){function i(){console.log("[INIT] LBA")}t.init=i}(e=i.initLBA||(i.initLBA={}))}),define("lists/InitializerList",["require","exports","initializers/initFA","initializers/initPDA","initializers/initLBA"],function(t,i,e,n,r){"use strict";function s(t){for(var e in t)i.hasOwnProperty(e)||(i[e]=t[e])}s(e),s(n),s(r)}),define("Initializer",["require","exports","lists/InitializerList","Utils"],function(t,i,e,n){"use strict";var r=function(){function t(){}return t.exec=function(){this.initSidebars()},t.initSidebars=function(){n.utils.foreach(e,function(t,i){i.init()})},t}();i.Initializer=r}),define("Settings",["require","exports","lists/LanguageList","lists/MachineList","Initializer","Utils"],function(t,i,e,n,r,s){"use strict";var a;!function(t){function a(){var i={};for(var e in t.Machine)t.Machine.hasOwnProperty(e)&&!isNaN(parseInt(e))&&(i[e]={name:t.language.strings[t.Machine[e]],sidebar:[]});s.utils.foreach(i,function(i,e){t.machines[i]=e}),h=!1,r.Initializer.exec()}function o(e){t.language=e,i.Strings=t.language.strings,a()}t.sidebarID="sidebar",t.mainbarID="mainbar",t.slideInterval=300,t.machineSelRows=3,t.machineSelColumns=1,t.stateLabelFontFamily="sans-serif",t.stateLabelFontSize=20,t.stateRadius=32,t.stateRingRadius=27,t.stateDragTolerance=50,t.stateFillColor="white",t.stateStrokeColor="black",t.stateStrokeWidth=1,t.stateRingStrokeWidth=1,t.stateInitialMarkLength=40,t.stateInitialMarkHeadLength=15,t.stateInitialMarkAngle=s.utils.toRadians(25),t.stateHighlightFillColor="#FFD574",t.stateHighlightStrokeColor="red",t.stateHighlightStrokeWidth=3,t.stateHighlightRingStrokeWidth=2,t.edgeArrowLength=30,t.edgeArrowAngle=s.utils.toRadians(30),t.shortcuts={save:["ctrl","S"],open:["ctrl","O"],toggleInitial:["I"],toggleFinal:["F"],dimState:["ESC"],undo:["ctrl","Z"]},t.languages=e,t.Machine=n.Machine,t.language=e.english,t.currentMachine=t.Machine.FA,t.machines={};var h=!0;t.update=a,t.changeLanguage=o}(a=i.Settings||(i.Settings={})),i.Strings=a.language.strings,a.update()}),define("interface/Menu",["require","exports","interface/Renderer","Settings","Utils"],function(t,i,e,n,r){"use strict";var s=function(t){function i(i){t.call(this),this.body=null,this.toggled=!1,this.title=i,this.children=[]}return __extends(i,t),i.prototype.add=function(t){this.children.push(t)},i.prototype.clear=function(){this.children=[]},i.prototype.onRender=function(){var t=this.node,i=r.utils.create("div");i.classList.add("menu");var e=r.utils.create("div");e.classList.add("title"),e.innerHTML=this.title,i.appendChild(e);var s=r.utils.create("div");s.classList.add("content");for(var a=0,o=this.children;a<o.length;a++){var h=o[a];s.appendChild(h)}i.appendChild(s),t.appendChild(i),e.addEventListener("click",function(){$(s).is(":animated")||$(s).slideToggle(n.Settings.slideInterval)}),this.body=i,this.toggled&&this.internalToggle()},i.prototype.toggle=function(){this.toggled=!this.toggled,this.body&&this.internalToggle()},i.prototype.html=function(){return this.body},i.prototype.internalToggle=function(){var t=this.body.querySelector(".content");$(t).toggle()},i}(e.Renderer);i.Menu=s}),define("interface/Table",["require","exports","interface/Renderer","Utils"],function(t,i,e,n){"use strict";var r=function(t){function i(i,e){t.call(this),this.numRows=i,this.numColumns=e,this.children=[]}return __extends(i,t),i.prototype.add=function(t){this.children.push(t)},i.prototype.html=function(){for(var t=n.utils.create("table"),i=0,e=0;e<this.numRows;e++){for(var r=n.utils.create("tr"),s=0;s<this.numColumns;s++){var a=n.utils.create("td");i<this.children.length&&a.appendChild(this.children[i]),r.appendChild(a),i++}t.appendChild(r)}return t},i.prototype.onRender=function(){this.node.appendChild(this.html())},i}(e.Renderer);i.Table=r}),define("interface/Sidebar",["require","exports","interface/Menu","interface/Renderer","Settings","Settings","System","interface/Table","Utils"],function(t,i,e,n,r,s,a,o,h){"use strict";var u=function(t){function i(){t.call(this),this.build()}return __extends(i,t),i.prototype.build=function(){this.languageSelection=new e.Menu(s.Strings.SELECT_LANGUAGE),this.fileManipulation=new e.Menu(s.Strings.FILE_MENUBAR),this.machineSelection=new e.Menu(s.Strings.SELECT_MACHINE),this.otherMenus=[],this.buildLanguageSelection(),this.buildFileManipulation(),this.buildMachineSelection(),this.node&&this.onBind()},i.prototype.onBind=function(){this.languageSelection.bind(this.node),this.fileManipulation.bind(this.node),this.machineSelection.bind(this.node);for(var t=0,i=this.otherMenus;t<i.length;t++){var e=i[t];e.bind(this.node)}},i.prototype.onRender=function(){this.languageSelection.render(),this.fileManipulation.render(),this.machineSelection.render();for(var t=0,i=this.otherMenus;t<i.length;t++){var e=i[t];e.render()}},i.prototype.loadMachine=function(t){for(var i=0,e=this.otherMenus;i<e.length;i++){var n=e[i];$(n.html()).remove()}this.otherMenus=r.Settings.machines[t].sidebar;for(var s=0,a=this.otherMenus;s<a.length;s++){var n=a[s];n.bind(this.node)}},i.prototype.buildLanguageSelection=function(){var t=h.utils.create("select"),i=r.Settings.languages,e={},n=0;h.utils.foreach(i,function(i,s){var a=h.utils.create("option");a.value=n.toString(),a.innerHTML=s.strings.LANGUAGE_NAME,t.appendChild(a),e[n]=i,s==r.Settings.language&&(t.selectedIndex=n),n++}),this.languageSelection.clear(),this.languageSelection.add(t),this.languageSelection.toggle(),t.addEventListener("change",function(t){var n=this.options[this.selectedIndex],r=n.value,o=n.innerHTML,h=confirm(s.Strings.CHANGE_LANGUAGE.replace("%",o));h&&a.System.changeLanguage(i[e[r]])})},i.prototype.buildFileManipulation=function(){this.fileManipulation.clear();var t=h.utils.create("input");t.classList.add("file_manip_btn"),t.type="button",t.value=s.Strings.SAVE,t.addEventListener("click",function(){var t="Hello, world!",i=new Blob([t],{type:"text/plain; charset=utf-8"});saveAs(i,"file.txt")}),h.utils.bindShortcut(r.Settings.shortcuts.save,function(){t.click()}),this.fileManipulation.add(t);var i=h.utils.create("input");i.classList.add("file_manip_btn"),i.type="button",i.value=s.Strings.OPEN,i.addEventListener("click",function(){alert("Not yet implemented")}),h.utils.bindShortcut(r.Settings.shortcuts.open,function(){i.click()}),this.fileManipulation.add(i)},i.prototype.buildMachineSelection=function(){var t=new o.Table(r.Settings.machineSelRows,r.Settings.machineSelColumns),i={},e=this;h.utils.foreach(r.Settings.machines,function(n,s){var a=h.utils.create("input");a.classList.add("machine_selection_btn"),a.type="button",a.value=s.name,a.disabled=n==r.Settings.currentMachine,a.addEventListener("click",function(){i[r.Settings.currentMachine].disabled=!1,i[n].disabled=!0,i[n].blur(),r.Settings.currentMachine=n,e.loadMachine(n)}),t.add(a),i[n]=a}),h.utils.bindShortcut(["M"],function(){for(var t=document.querySelectorAll(".machine_selection_btn"),i=0;i<t.length;i++){var e=t[i];if(!e.disabled){e.focus();break}}}),this.machineSelection.clear(),this.machineSelection.add(t.html()),this.loadMachine(r.Settings.currentMachine)},i}(n.Renderer);i.Sidebar=u}),define("System",["require","exports","Keyboard","Settings","Utils"],function(t,i,e,n,r){"use strict";var s=function(){function t(){}return t.changeLanguage=function(t){n.Settings.changeLanguage(t),this.reload()},t.reload=function(){r.utils.id(n.Settings.sidebarID).innerHTML="",this.sidebar.build(),this.sidebar.render()},t.bindSidebar=function(t){this.sidebar=t},t.keyEvent=function(t){for(var i=!1,e=0,n=this.keyboardObservers;e<n.length;e++){var r=n[e],s=r.keys;this.shortcutMatches(t,s)&&(r.callback(),i=!0)}return!i||(t.preventDefault(),!1)},t.addKeyObserver=function(t,i){this.keyboardObservers.push({keys:t,callback:i})},t.shortcutMatches=function(t,i){function n(t){return t+"Key"}for(var r=["alt","ctrl","shift"],s=[],a=0,o=i;a<o.length;a++){var h=o[a];if(r.indexOf(h)>=0){if(s.push(h),!t[n(h)])return!1}else if(t.keyCode!=e.Keyboard.keys[h])return!1}for(var u=0,c=r;u<c.length;u++){var l=c[u];if(s.indexOf(l)==-1&&t[n(l)])return!1}return!0},t.keyboardObservers=[],t}();i.System=s}),define("interface/State",["require","exports","Settings","Utils"],function(t,i,e,n){"use strict";var r=function(){function t(){this.body=null,this.ring=null,this.arrowParts=[],this.name="",this.initial=!1,this.final=!1,this.highlighted=!1,this.initialMarkOffsets=[],this.radius=e.Settings.stateRadius}return t.prototype.setPosition=function(t,i){this.x=t,this.y=i},t.prototype.getPosition=function(){return{x:this.x,y:this.y}},t.prototype.setName=function(t){this.name=t},t.prototype.setInitial=function(t){this.initial=t},t.prototype.isInitial=function(){return this.initial},t.prototype.setFinal=function(t){this.final=t},t.prototype.isFinal=function(){return this.final},t.prototype.highlight=function(){this.highlighted=!0},t.prototype.dim=function(){this.highlighted=!1},t.prototype.fillColor=function(){return this.highlighted?e.Settings.stateHighlightFillColor:e.Settings.stateFillColor},t.prototype.strokeColor=function(){return this.highlighted?e.Settings.stateHighlightStrokeColor:e.Settings.stateStrokeColor},t.prototype.strokeWidth=function(){return this.highlighted?e.Settings.stateHighlightStrokeWidth:e.Settings.stateStrokeWidth},t.prototype.ringStrokeWidth=function(){return this.highlighted?e.Settings.stateHighlightRingStrokeWidth:e.Settings.stateRingStrokeWidth},t.prototype.renderBody=function(t){this.body?this.body.attr({cx:this.x,cy:this.y}):(this.body=t.circle(this.x,this.y,this.radius),t.text(this.x,this.y,this.name).attr({"font-family":e.Settings.stateLabelFontFamily,"font-size":e.Settings.stateLabelFontSize})),this.body.attr("fill",this.fillColor()),this.body.attr("stroke",this.strokeColor()),this.body.attr("stroke-width",this.strokeWidth())},t.prototype.updateInitialMarkOffsets=function(){if(this.initialMarkOffsets.length)return this.initialMarkOffsets;var t=e.Settings.stateInitialMarkLength,i=this.x-this.radius,r=this.y,s=e.Settings.stateInitialMarkHeadLength,a=e.Settings.stateInitialMarkAngle,o=1-s/t,h={x:i-t+o*t,y:r},u={x:i,y:r},c=n.utils.rotatePoint(h,u,a),l=n.utils.rotatePoint(h,u,-a);this.initialMarkOffsets=[{x:c.x-i,y:c.y-r},{x:l.x-i,y:l.y-r}]},t.prototype.renderInitialMark=function(t){if(this.initial){var i=e.Settings.stateInitialMarkLength,r=this.x-this.radius,s=this.y;if(this.arrowParts.length){var a=this.arrowParts,o=a[0],h=a[1],u=a[2];o.attr("path",n.utils.linePath(r-i,s,r,s)),this.updateInitialMarkOffsets();var c=this.initialMarkOffsets[0],l=this.initialMarkOffsets[1];h.attr("path",n.utils.linePath(c.x+r,c.y+s,r,s)),u.attr("path",n.utils.linePath(l.x+r,l.y+s,r,s))}else{var o=n.utils.line(t,r-i,s,r,s);this.updateInitialMarkOffsets();var c=this.initialMarkOffsets[0],l=this.initialMarkOffsets[1],h=n.utils.line(t,c.x+r,c.y+s,r,s),u=n.utils.line(t,l.x+r,l.y+s,r,s),a=this.arrowParts;a.push(o),a.push(h),a.push(u)}}else for(var a=this.arrowParts;a.length;)a[a.length-1].remove(),a.pop()},t.prototype.renderFinalMark=function(t){this.final?(this.ring?this.ring.attr({cx:this.x,cy:this.y}):this.ring=t.circle(this.x,this.y,e.Settings.stateRingRadius),this.ring.attr("stroke",this.strokeColor()),this.ring.attr("stroke-width",this.ringStrokeWidth())):this.ring&&(this.ring.remove(),this.ring=null)},t.prototype.setVisualPosition=function(t,i){this.body.attr({cx:t,cy:i}),this.ring&&this.ring.attr({cx:t,cy:i}),this.initial&&this.renderInitialMark(),this.setPosition(t,i)},t.prototype.render=function(t){this.renderBody(t),this.renderInitialMark(t),this.renderFinalMark(t)},t.prototype.node=function(){return this.body},t.prototype.html=function(){return this.body?this.body.node:null},t.prototype.drag=function(t,i){var e=function(t,i,e){return this.ox=this.attr("cx"),this.oy=this.attr("cy"),null},n=this,r=function(i,e,r,s,a){return n.setVisualPosition(this.ox+i,this.oy+e),t.call(this,a),null},s=function(e){var r=this.attr("cx")-this.ox,s=this.attr("cy")-this.oy,a=r*r+s*s,o=i.call(this,a,e);return o||(n.setVisualPosition(this.ox,this.oy),t.call(this,e)),null};this.body.drag(r,e,s)},t}();i.State=r}),define("interface/Edge",["require","exports","Settings","Utils"],function(t,i,e,n){"use strict";var r=function(){function t(){this.origin=null,this.target=null,this.virtualTarget=null,this.body=null,this.head=[]}return t.prototype.setOrigin=function(t){this.origin=t},t.prototype.setTarget=function(t){this.target=t},t.prototype.setVirtualTarget=function(t){this.virtualTarget=t},t.prototype.render=function(t){this.renderBody(t),this.renderHead(t)},t.prototype.renderBody=function(t){var i,r=this.origin.getPosition();if(this.target)i=this.target.getPosition();else if(this.virtualTarget){i={x:this.virtualTarget.x,y:this.virtualTarget.y};var s=i.x-r.x,a=i.y-r.y;i.x=r.x+.98*s,i.y=r.y+.98*a}else i=r;var o=i.x-r.x,h=i.y-r.y,u=Math.atan2(h,o),c=Math.sin(u),l=Math.cos(u),d=e.Settings.stateRadius*l,f=e.Settings.stateRadius*c;r.x+=d,r.y+=f,this.target&&(i.x-=d,i.y-=f),this.body?this.body.attr("path",n.utils.linePath(r.x,r.y,i.x,i.y)):this.body=n.utils.line(t,r.x,r.y,i.x,i.y)},t.prototype.renderHead=function(t){if(this.target){var i=this.origin.getPosition(),r=this.target.getPosition(),s=r.x-i.x,a=r.y-i.y,o=Math.atan2(a,s),h=Math.sin(o),u=Math.cos(o),c=e.Settings.stateRadius*u,l=e.Settings.stateRadius*h;r.x-=c,r.y-=l,s-=c,a-=l;var d=e.Settings.edgeArrowLength,f=e.Settings.edgeArrowAngle,g=Math.sqrt(s*s+a*a),p=1-d/g,y={x:i.x+p*s,y:i.y+p*a},S=n.utils.rotatePoint(y,r,f),v=n.utils.rotatePoint(y,r,-f);this.head.length?(this.head[0].attr("path",n.utils.linePath(S.x,S.y,r.x,r.y)),this.head[1].attr("path",n.utils.linePath(v.x,v.y,r.x,r.y))):(this.head.push(n.utils.line(t,S.x,S.y,r.x,r.y)),this.head.push(n.utils.line(t,v.x,v.y,r.x,r.y)))}},t}();i.Edge=r}),define("interface/StateRenderer",["require","exports","interface/Edge","Settings","interface/State","Utils"],function(t,i,e,n,r,s){"use strict";var a=function(){function t(t,i){this.canvas=null,this.node=null,this.stateList=[],this.edgeList=[],this.highlightedState=null,this.edgeMode=!1,this.currentEdge=null,this.canvas=t,this.node=i}return t.prototype.render=function(){var t=new r.State;t.setPosition(100,100),t.setInitial(!0),this.stateList.push(t);for(var i=0,e=this.stateList;i<e.length;i++){var n=e[i];n.render(this.canvas),this.bindStateEvents(n)}this.bindShortcuts();var s=this;$(this.node).dblclick(function(t){var i=new r.State;i.setPosition(t.pageX-this.offsetLeft,t.pageY-this.offsetTop),s.stateList.push(i),i.render(s.canvas),s.bindStateEvents(i)}),$(this.node).contextmenu(function(t){return t.preventDefault(),!1}),$(this.node).mousemove(function(t){s.edgeMode&&s.adjustEdge(this,t)})},t.prototype.bindStateEvents=function(t){var i=this.canvas,e=this;t.drag(function(){e.updateEdges()},function(r,a){return!(r<=n.Settings.stateDragTolerance)||(e.edgeMode?e.finishEdge(t):s.utils.isRightClick(a)?e.beginEdge(t):t==e.highlightedState?(t.dim(),e.highlightedState=null,t.render(i)):(e.highlightedState&&(e.highlightedState.dim(),e.highlightedState.render(i)),t.highlight(),e.highlightedState=t,t.render(i)),!1)})},t.prototype.beginEdge=function(t){this.edgeMode=!0,this.currentEdge=new e.Edge,this.currentEdge.setOrigin(t)},t.prototype.finishEdge=function(t){this.edgeMode=!1,this.currentEdge.setTarget(t),this.currentEdge.render(this.canvas),this.edgeList.push(this.currentEdge),this.currentEdge=null},t.prototype.adjustEdge=function(t,i){var e={x:i.pageX-t.offsetLeft,y:i.pageY-t.offsetTop};this.currentEdge.setVirtualTarget(e),this.currentEdge.render(this.canvas)},t.prototype.updateEdges=function(){for(var t=0,i=this.edgeList;t<i.length;t++){var e=i[t];e.render(this.canvas)}},t.prototype.bindShortcuts=function(){var t=this.canvas,i=this;s.utils.bindShortcut(n.Settings.shortcuts.toggleInitial,function(){var e=i.highlightedState;e&&(e.setInitial(!e.isInitial()),e.render(t))}),s.utils.bindShortcut(n.Settings.shortcuts.toggleFinal,function(){var e=i.highlightedState;e&&(e.setFinal(!e.isFinal()),e.render(t))}),s.utils.bindShortcut(n.Settings.shortcuts.dimState,function(){var e=i.highlightedState;e&&(e.dim(),e.render(t),i.highlightedState=null)}),s.utils.bindShortcut(n.Settings.shortcuts.undo,function(){alert("TODO: undo")})},t}();i.StateRenderer=a}),define("interface/Mainbar",["require","exports","interface/Renderer","interface/StateRenderer"],function(t,i,e,n){"use strict";var r=function(t){function i(){t.call(this),this.canvas=null,this.stateRenderer=null;var i=this;$(window).resize(function(){i.resizeCanvas()})}return __extends(i,t),i.prototype.resizeCanvas=function(){var t=this.canvas;if(t){var i=$(this.node);t.setSize(50,50);var e=i.width(),n=i.height()-10;t.setSize(e,n)}},i.prototype.onBind=function(){this.canvas=Raphael(this.node,0,0),this.resizeCanvas(),this.stateRenderer=new n.StateRenderer(this.canvas,this.node)},i.prototype.onRender=function(){this.stateRenderer.render()},i}(e.Renderer);i.Mainbar=r}),define("interface/UI",["require","exports","interface/Mainbar","Settings","interface/Sidebar","System","Utils"],function(t,i,e,n,r,s,a){"use strict";var o=function(){function t(){var t=new r.Sidebar,i=new e.Mainbar;this.bindSidebar(t),this.bindMain(i),s.System.bindSidebar(t)}return t.prototype.render=function(){this.sidebarRenderer.render(),this.mainRenderer.render(),console.log("Interface ready.")},t.prototype.bindSidebar=function(t){t.bind(a.utils.id(n.Settings.sidebarID)),this.sidebarRenderer=t},t.prototype.bindMain=function(t){t.bind(a.utils.id(n.Settings.mainbarID)),this.mainRenderer=t},t}();i.UI=o}),define("main",["require","exports","System","interface/UI"],function(t,i,e,n){"use strict";$(document).ready(function(){var t=new n.UI;t.render(),document.body.addEventListener("keydown",function(t){return e.System.keyEvent(t)})})});
