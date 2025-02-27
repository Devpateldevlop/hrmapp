sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageBox"], (Controller,MessageBox) => {
    "use strict";
  
    return Controller.extend("hrmate.controller.ApplyLeave", {
      onInit() {
      },
      onAfterRendering() {
        sap.ui.core.BusyIndicator.hide();
        
       }
      
    
      
    })
})