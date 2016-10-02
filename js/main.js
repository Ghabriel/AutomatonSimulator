/// <reference path="jQuery.d.ts" />
define(["require", "exports", "./Mainbar", "./Sidebar", "./UI"], function (require, exports, Mainbar_1, Sidebar_1, UI_1) {
    "use strict";
    $(document).ready(function () {
        var ui = new UI_1.UI(new Sidebar_1.Sidebar(), new Mainbar_1.Mainbar());
        ui.render();
    });
});
