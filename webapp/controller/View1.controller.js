sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox"

], (Controller, MessageBox) => {
  "use strict";

  return Controller.extend("hrmate.controller.View1", {
    onInit: function () {
      debugger
      sap.ui.core.BusyIndicator.hide();
      let Router = this.getOwnerComponent().getRouter()
      Router.getRoute("RouteView1").attachPatternMatched(this._Objectfunctionset, this);

      // sap.ui.core.BusyIndicator.show();
      // var today = new Date();
      // var formattedToday = today.toLocaleDateString("en-GB").split("/").join("-"); 
      // // var formattedToday = "13-02-2025" // For Testing
      // var apiUrl = "https://hrmapi-lac.vercel.app/api/employee/PunchHistory?employeeCode=" + $.sap.EmployeeCode;
      // fetch(apiUrl, { method: "GET" })
      //     .then(response => {
      //         if (!response.ok) {
      //             throw new Error("Failed to fetch punch history");
      //         }
      //         return response.json();
      //     })
      //     .then(data => {
      //         sap.ui.core.BusyIndicator.hide();
      //         var punchHistory = data.punchHistory || [];      
      //         for (var z = 0; z < punchHistory.length; z++) {
      //           if (punchHistory[z].date === formattedToday) {
      //             if (punchHistory[z].punchIn) {
      //               this.getView().byId("puchin").addStyleClass("tile-punchin");
      //                 this.getView().byId("puchin").setPressEnabled(false);
      //             }else{
      //               this.getView().byId("puchin").removeStyleClass("tile-punchin");
      //               this.getView().byId("puchin").setPressEnabled(true);
      //             }
      //             if (punchHistory[z].punchOut) {
      //                this.getView().byId("punchout").addStyleClass("tile-punchout");
      //                 this.getView().byId("punchout").setPressEnabled(false);
      //             }else{
      //               this.getView().byId("punchout").removeStyleClass("tile-punchout");
      //               this.getView().byId("punchout").setPressEnabled(true);
      //             }
      //             break; 
      //           }
      //         }

      //     })
      //     .catch(error => {
      //         sap.ui.core.BusyIndicator.hide();
      //         sap.m.MessageToast.show("Error occurred: " + error.message);
      //     });

    },
    onAfterRendering: function () {
      debugger
    },
    _Objectfunctionset: function (oEvent) {
      debugger
      if (oEvent.getParameter("name") !== "RouteView1") {
        return;
      }


      sap.ui.core.BusyIndicator.show();
      var today = new Date();
      // var formattedToday = today.toLocaleDateString("en-GB").split("/").join("-");
      var formattedToday = today.getFullYear() + "-" +String(today.getMonth() + 1).padStart(2, "0") + "-" +String(today.getDate()).padStart(2, "0");
      // var formattedToday = "13-02-2025" // For Testing
      var apiUrl = "https://hrmapi-lac.vercel.app/api/employee/PunchHistory?employeeCode=" + $.sap.EmployeeCode;
      fetch(apiUrl, { method: "GET" })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch punch history");
          }
          return response.json();
        })
        .then(data => {
          sap.ui.core.BusyIndicator.hide();
          var punchHistory = data.punchHistory || [];
          for (var z = 0; z < punchHistory.length; z++) {
            if (punchHistory[z].date === formattedToday) {
              if (punchHistory[z].punchIn) {
                this.getView().byId("puchin").addStyleClass("tile-punchin");
                this.getView().byId("puchin").setPressEnabled(false);
              } else {
                this.getView().byId("puchin").removeStyleClass("tile-punchin");
                this.getView().byId("puchin").setPressEnabled(true);
              }
              if (punchHistory[z].punchOut) {
                this.getView().byId("punchout").addStyleClass("tile-punchout");
                this.getView().byId("punchout").setPressEnabled(false);
              } else {
                this.getView().byId("punchout").removeStyleClass("tile-punchout");
                this.getView().byId("punchout").setPressEnabled(true);
              }
              break;
            }
          }

        })
        .catch(error => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Error occurred: " + error.message);
        });

    },

    // onPunchIn: function (oEvent) {
    //   debugger
    //   var that = this;
    //   sap.ui.core.BusyIndicator.show();
    //   navigator.geolocation.getCurrentPosition(function (position) {
    //     const latitude = position.coords.latitude;
    //     const longitude = position.coords.longitude;
    //     const locationText = `Latitude: ${latitude}, Longitude: ${longitude}`;
    //     console.log(locationText);
    //     $.ajax({
    //       url: `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=1c691fc6e3f94761b93e96943e0d18dc`,
    //       method: "GET",
    //       success: function (response) {
    //         $.sap.currentAddress = response.results[0]?.formatted || "Location not found";
    //           var apiUrl = "https://hrmapi-lac.vercel.app/api/employee/PunchHistory?employeeCode=" + $.sap.EmployeeCode;
    //         var today = new Date();
    //         $.sap.formattedDatein = today.toLocaleDateString("en-GB").split("/").join("-");
    //         $.sap.formattedTimein = today.toLocaleTimeString("en-US", { hour12: true });
    //         var payload = {
    //           "date": $.sap.formattedDatein,
    //           "punchIn": $.sap.formattedTimein,
    //           "Inaddress": $.sap.currentAddress,
    //           "punchOut": "",
    //           "Outaddress": "",
    //         };
    //         fetch(apiUrl, {
    //           method: "POST",
    //           headers: {
    //             "Content-Type": "application/json"
    //           },
    //           body: JSON.stringify(payload)
    //         })
    //           .then(response => {
    //             if (!response.ok) {
    //               throw new Error("Failed to add punch history");
    //             }
    //             return response.json();
    //           })
    //           .then(data => {
    //             sap.ui.core.BusyIndicator.hide();
    //             console.log("Response Data:", data);
    //             oEvent.getSource().addStyleClass("tile-punchin");
    //             oEvent.getSource().setPressEnabled(false);
    //             sap.m.MessageToast.show("Punch In Recorded Successfully");
    //             $.sap.punchID = data.punchHistory._id;

    //             localStorage.setItem("punchID", $.sap.punchID);
    //             // localStorage.setItem("date", $.sap.formattedDatein); 
    //             // localStorage.setItem("punchIn", $.sap.formattedTimein); 
    //             // localStorage.setItem("Inaddress", $.sap.currentAddress); 
    //           })
    //           .catch(error => {
    //             sap.ui.core.BusyIndicator.hide();
    //             sap.m.MessageToast.show("Error occurred: " + error.message);
    //           });
    //       },
    //       error: function (error) {
    //         sap.ui.core.BusyIndicator.hide();
    //         console.log("Error:", error);
    //         sap.m.MessageToast.show("Failed to fetch location.");
    //       }
    //     });
    //   }, function (error) {
    //     sap.ui.core.BusyIndicator.hide();
    //     console.log("Geolocation Error:", error);
    //     sap.m.MessageToast.show("Location access denied or unavailable.");
    //   });
    // },






    onPunchIn: function (oEvent) {
      var that = this;
      sap.ui.core.BusyIndicator.show();

      navigator.geolocation.getCurrentPosition(function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Use OpenStreetMap's Nominatim API (Free & No API Key Required)
        const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            $.sap.currentAddress = data.display_name || "Location not found";

            var punchApiUrl = "https://hrmapi-lac.vercel.app/api/employee/PunchHistory?employeeCode=" + $.sap.EmployeeCode;
            var today = new Date();
            var year = today.getFullYear();
            var month = String(today.getMonth() + 1).padStart(2, "0");
            var day = String(today.getDate()).padStart(2, "0");
            $.sap.formattedDatein = `${year}-${month}-${day}`;
            $.sap.formattedTimein = today.toLocaleTimeString("en-US", { hour12: true });


            var payload = {
              "date": $.sap.formattedDatein,
              "punchIn": $.sap.formattedTimein,
              "Inaddress": $.sap.currentAddress,
              "punchOut": "",
              "Outaddress": "",
            };

            fetch(punchApiUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            })
              .then(response => response.json())
              .then(data => {
                sap.ui.core.BusyIndicator.hide();
                oEvent.getSource().addStyleClass("tile-punchin");
                oEvent.getSource().setPressEnabled(false);
                sap.m.MessageToast.show("Punch In Recorded Successfully");
                $.sap.punchID = data.punchHistory._id;
                localStorage.setItem("punchID", $.sap.punchID);
              })
              .catch(error => {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Error occurred: " + error.message);
              });
          })
          .catch(error => {
            sap.ui.core.BusyIndicator.hide();
            sap.m.MessageToast.show("Failed to fetch location.");
          });

      }, function (error) {
        sap.ui.core.BusyIndicator.hide();
        sap.m.MessageToast.show("Location access denied or unavailable.");
      });
    },

    onPunchOut: function (oEvent) {
      var today = new Date();
      sap.ui.core.BusyIndicator.show();
      var formattedTimeout = today.toLocaleTimeString("en-US", { hour12: true });

      navigator.geolocation.getCurrentPosition(async function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        $.ajax({
          url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          method: "GET",
          success: function (response) {
            let outAddress = response.display_name || "Location not found";
            var spunchID = localStorage.getItem("punchID");

            let apiUrl = "https://hrmapi-lac.vercel.app/api/employee/PunchHistory?punchHistoryId=" +
              spunchID + "&employeeCode=" + $.sap.EmployeeCode;
            var formattedDateout = today.toLocaleDateString("en-GB").split("/").join("-");
            var updatePayload = {
              "punchOut": formattedTimeout,
              "Outaddress": outAddress,
            };

            fetch(apiUrl, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(updatePayload)
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error("Failed to update punch-out time");
                }
                return response.json();
              })
              .then(data => {
                sap.ui.core.BusyIndicator.hide();
                console.log("Punch Out Response Data:", data);
                oEvent.getSource().addStyleClass("tile-punchout");
                oEvent.getSource().setPressEnabled(false);
                sap.m.MessageToast.show("Punch Out Recorded Successfully");
              })
              .catch(error => {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Error occurred: " + error.message);
              });
          },
          error: function (error) {
            sap.ui.core.BusyIndicator.hide();
            console.log("Error:", error);
            sap.m.MessageToast.show("Failed to fetch location.");
          }
        });
      });
    },


    // onPunchOut: function (oEvent) {
    //   var today = new Date();
    //   sap.ui.core.BusyIndicator.show();
    //   var formattedTimeout = today.toLocaleTimeString("en-US", { hour12: true });
    //   navigator.geolocation.getCurrentPosition(async function (position) {
    //     const latitude = position.coords.latitude;
    //     const longitude = position.coords.longitude;
    //     $.ajax({
    //       url: `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=1c691fc6e3f94761b93e96943e0d18dc`,
    //       method: "GET",
    //       success: function (response) {
    //         let outAddress = response.results[0]?.formatted || "Location not found";
    //         var spunchID = localStorage.getItem("punchID");
    //         // var date = localStorage.getItem("date"); 
    //         // var punchIn = localStorage.getItem("punchIn"); 
    //         // var Inaddress = localStorage.getItem("Inaddress"); 
    //         let apiUrl = "https://hrmapi-lac.vercel.app/api/employee/PunchHistory?punchHistoryId=" +
    //           spunchID + "&employeeCode=" + $.sap.EmployeeCode;
    //         var formattedDateout = today.toLocaleDateString("en-GB").split("/").join("-");
    //         var updatePayload = {
    //           "punchOut": formattedTimeout,
    //           "Outaddress": outAddress,
    //         };

    //         fetch(apiUrl, {
    //           method: "PUT",
    //           headers: {
    //             "Content-Type": "application/json"
    //           },
    //           body: JSON.stringify(updatePayload)
    //         })
    //           .then(response => {
    //             if (!response.ok) {
    //               throw new Error("Failed to update punch-out time");
    //             }
    //             return response.json();
    //           })
    //           .then(data => {
    //             sap.ui.core.BusyIndicator.hide();
    //             console.log("Punch Out Response Data:", data);
    //             oEvent.getSource().addStyleClass("tile-punchout");
    //             oEvent.getSource().setPressEnabled(false);
    //             sap.m.MessageToast.show("Punch Out Recorded Successfully");
    //             // localStorage.setItem("punchID", ""); 
    //           })
    //           .catch(error => {
    //             sap.ui.core.BusyIndicator.hide();
    //             sap.m.MessageToast.show("Error occurred: " + error.message);
    //           });
    //       },
    //       error: function (error) {
    //         sap.ui.core.BusyIndicator.hide();
    //         console.log("Error:", error);
    //         sap.m.MessageToast.show("Failed to fetch location.");
    //       }
    //     });
    //   });
    // },

    onCalendar: function () {
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("RouteView2");
    },
    onLeave: function () {
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("RouteView3");
    },
    onPayslip: function () {
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("RouteView4");
    },
    onProfile: function () {
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("RouteView6");
    },
    onPunchHistory: function () {
      
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("RouteView7");
    },


    ////////////////////////////////Admin//////////////////////////////////////////////////////////////////////



  });
});