define(["require", "exports", "./Mainbar", "./Sidebar"], function (require, exports, Mainbar_1, Sidebar_1) {
    "use strict";
    var Settings;
    (function (Settings) {
        Settings.sidebarRenderer = new Sidebar_1.Sidebar();
        Settings.mainbarRenderer = new Mainbar_1.Mainbar();
        Settings.sidebarID = "sidebar";
        Settings.mainbarID = "mainbar";
    })(Settings = exports.Settings || (exports.Settings = {}));
});
