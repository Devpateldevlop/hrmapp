sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageBox", "sap/ui/core/Fragment"], (Controller, MessageBox, Fragment) => {
    "use strict";

    return Controller.extend("hrmate.controller.login", {
        onInit() {

            this.getView().byId("sUserID").attachBrowserEvent("keydown", this._handleEnterKey.bind(this));
            this.getView().byId("SuserPassword").attachBrowserEvent("keydown", this._handleEnterKey.bind(this));

        },
        onLogin: function (oEvent) {
            debugger
            this.sUserID = this.getView().byId("sUserID").getValue();
            this.sPassword = this.getView().byId("SuserPassword").getValue();
            var currentDate = new Date();
            var formattedDate = currentDate.getDate().toString().padStart(2, '0') + "-" +
                (currentDate.getMonth() + 1).toString().padStart(2, '0') + "-" +
                currentDate.getFullYear();

            if (!this.sUserID || !this.sPassword) {
                sap.m.MessageToast.show("Employee Code and Password are required.");
                return;
            }
            sap.ui.core.BusyIndicator.show();
            var apiUrl = "https://hrmapi-lac.vercel.app/api/employee";

            fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch punch history");
                    }
                    return response.json();
                })
                .then(data => {
                    var isValidUser = false;
                    // sap.ui.core.BusyIndicator.hide();
                    data.forEach(element => {
                        if (element.EmployeeCode === Number(this.sUserID) && element.profile.Password === this.sPassword) {
                            element.currentDate = formattedDate;
                            this.getOwnerComponent().getModel("maindata").setData(element);
                            $.sap.EmployeeCode = element.EmployeeCode
                            // localStorage.setItem("isLoggedIn", "true");  
                            if (element.profile.role === "Admin") {
                                var oRouter = this.getOwnerComponent().getRouter();
                                oRouter.navTo("RouteView10");
                            } else {
                                var oRouter = this.getOwnerComponent().getRouter();
                                oRouter.navTo("RouteView1");
                            }
                            isValidUser = true;
                        }
                    });
                    // sap.ui.getCore().byId("sUserID").setValue("");
                    // sap.ui.getCore().byId("SuserPassword").setValue("");
                    if (!isValidUser) {
                        sap.m.MessageToast.show("Invalid Employee Code or Password. Please try again.");
                        sap.ui.core.BusyIndicator.hide();
                    }
                })
                .catch(error => {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Error occurred: " + error.message);
                });

        },

        _handleEnterKey: function (oEvent) {
            if (oEvent.key === "Enter" || oEvent.keyCode === 13) {
                this.onLogin();
            }
        },

        onForgetPassword: function (oEvent) {
            debugger
            // var oButton = oEvent.getSource(),
            // oView = this.getView();
            // if (!this._pPopover) {
            //     this._pPopover = Fragment.load({
            //         id: oView.getId(),
            //         name: "hrmate.fragments.forgetPassword",
            //         controller: this
            //     }).then(function(oPopover) {
            //         oView.addDependent(oPopover);
            //         return oPopover;
            //     });
            // }
            // this._pPopover.then(function(oPopover) {
            //     oPopover.openBy(oButton);
            // });






            var sEmployeeCode = this.getView().byId("sUserID").getValue();
            var apiUrl = "https://hrmapi-lac.vercel.app/api/employee";

            fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch punch history");
                    }
                    return response.json();
                })
                .then(data => {
                    var employeeFound = false;
                    sap.ui.core.BusyIndicator.hide();
                    data.forEach(element => {
                        if (element.EmployeeCode === Number(sEmployeeCode)) {
                            employeeFound = true;

                            MessageBox.information(
                                "verification code sent to your registered email: " + element.profile.Email + "?", {
                                title: "Forgot Password",
                                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                                onClose: function (oAction) {
                                    if (oAction === MessageBox.Action.OK) {
                                        sap.m.MessageToast.show("Verification code has been sent to your registered email.");
                                    } else {
                                        sap.m.MessageToast.show("You clicked Cancel. No action taken.");
                                    }
                                }
                            }
                            );


                        }
                    });
                    if (!employeeFound) {
                        MessageBox.error("Please enter the correct Employee Code");
                    }
                })
                .catch(error => {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Error occurred: " + error.message);
                });

        }






    });
});
