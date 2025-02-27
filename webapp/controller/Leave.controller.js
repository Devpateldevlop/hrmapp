sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageBox"], (Controller, MessageBox) => {
  "use strict";

  return Controller.extend("hrmate.controller.Leave", {
    onInit() {

    },
    listpressApplyLeave: function (oEvent) {
      // sap.ui.core.BusyIndicator.show();
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("RouteView11");
    },

    listpressLeaveBalance: function (oEvent) {
      // sap.ui.core.BusyIndicator.show();
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("RouteView5");
    }


  })
})