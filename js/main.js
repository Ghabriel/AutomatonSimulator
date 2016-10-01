/// <reference path="jQuery.d.ts" />
define(["require", "exports", "./Settings", "./UI"], function (require, exports, Settings_1, UI_1) {
    "use strict";
    $(document).ready(function () {
        var ui = new UI_1.UI(Settings_1.Settings.sidebarRenderer, Settings_1.Settings.mainbarRenderer);
        ui.render();
    });
});
