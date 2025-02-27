sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/unified/DateTypeRange", "sap/ui/core/Fragment", "sap/m/MessageBox"], (Controller, DateTypeRange, Fragment, MessageBox) => {
    "use strict";

    return Controller.extend("hrmate.controller.Calendor", {
        onInit() {
            debugger
            let Router = this.getOwnerComponent().getRouter()
            Router.getRoute("RouteView2").attachPatternMatched(this._Objectfunctionset, this);
            // var today = new Date();
            // var year = new Date().getFullYear();
            // var specialDates = [];
            //         for (var month = 0; month < 12; month++) {
            //     var sundays = this.getDaysOfMonth(year, month, 0);
            //     var saturdays = this.getDaysOfMonth(year, month, 6);
            //     sundays.forEach(date => {
            //         specialDates.push(new DateTypeRange({
            //             startDate: date,
            //             type: "NonWorking",
            //             // tooltip: "Weekly Off"
            //         }));
            //     });
            //     if (saturdays.length >= 4) {
            //         [1, 3].forEach(index => {
            //             specialDates.push(new DateTypeRange({
            //                 startDate: saturdays[index],
            //                 type: "NonWorking",
            //                 // tooltip: "Weekly Off"
            //             }));
            //         });
            //     }
            // }
            // var oCalendar = this.getView().byId("calendar");
            // if (oCalendar) {
            //     specialDates.forEach(date => oCalendar.addSpecialDate(date));
            //     oCalendar.addSelectedDate(new sap.ui.unified.DateRange({ startDate: today }));
            // }
            // var day = today.getDate().toString().padStart(2, '0');
            // var month = (today.getMonth() + 1).toString().padStart(2, '0');
            // var formattedDate = `${day}-${month}-${year}`;
            // var oModel = this.getOwnerComponent().getModel("dateinfo");
            // oModel.setProperty("/presseddate", formattedDate);
            // var isNonWorking = specialDates.some(specialDate =>
            //     specialDate.getStartDate().toDateString() === today.toDateString()
            // );
            // oModel.setProperty("/dayinfo", isNonWorking ? "Non-Working Day" : "Working Day");
            // this.setPunchHistory();
        },

        _Objectfunctionset: function (oEvent) {
            debugger
            if (oEvent.getParameter("name") !== "RouteView2") {
                return;
            }
            // this.sUserID = this.getView().byId("sUserID").getValue();
            // this.sPassword = this.getView().byId("SuserPassword").getValue();
            // if (!this.sUserID || !this.sPassword) {
            //     sap.m.MessageToast.show("Employee Code and Password are required.");
            //         return;  
            // }
            sap.ui.core.BusyIndicator.show();
            var sEMPID = localStorage.getItem("punchID")
            var apiUrl = "https://hrmapi-lac.vercel.app/api/employee/PunchHistory?employeeCode=" + $.sap.EmployeeCode;

            fetch(apiUrl, {
                method: "GET"
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch punch history");
                    }
                    return response.json();
                })
                .then(data => {
                    var isValidUser = false;
                    sap.ui.core.BusyIndicator.hide();
                    this.getOwnerComponent().getModel("punchhistory").setData(data);
                    this.getOwnerComponent().getModel("masterholiday").setData(data.masterholiday);
                    this._setPunchHistory();


                })
                .catch(error => {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Error occurred: " + error.message);
                    this._setPunchHistory();
                });

            this.getView().byId("calendar").removeAllSelectedDates();
            this.getView().byId("dateDayInfo").setVisible(false);
            // this.getView().getModel("dateinfo").setData()
            // this.getView().getModel("dateinfo").refresh(true);
        },




        // original code 
        // _setPunchHistory: function () {
        //     var oCalendar = this.getView().byId("calendar");
        //     var oModel = this.getOwnerComponent().getModel("punchhistory").getData();
        //     var masterholiday = this.getOwnerComponent().getModel("masterholiday").getData();
        //     var punchHistory = oModel.punchHistory || [];

        //     for(var k = 0; k<masterholiday.length;k++){
        //          var data = masterholiday[k].daytype
        //     }




        //     var today = new Date();
        //     today.setHours(0, 0, 0, 0);
        //     var year = today.getFullYear();
        //     var workingDays = [];

        //     for (var month = 0; month < 12; month++) {
        //         var sundays = this.getDaysOfMonth(year, month, 0);
        //         var saturdays = this.getDaysOfMonth(year, month, 6);
        //         var nonWorkingDays = new Set(sundays.concat([saturdays[1], saturdays[3]]));

        //         for (var day = 1; day <= 31; day++) {
        //             var workDate = new Date(year, month, day);
        //             if (workDate > today) break;
        //             if (!nonWorkingDays.has(workDate.toDateString()) && workDate.getMonth() === month) {
        //                 workingDays.push(workDate);
        //             }
        //         }
        //     }

        //     var existingDates = oCalendar.getSpecialDates() || [];



        //     workingDays.forEach(workDate => {
        //         var formattedDate = workDate.toLocaleDateString("en-GB").split("/").join("-");
        //         var entry = punchHistory.find(e => e.date === formattedDate);

        //         var existingDateEntry = existingDates.find(specialDate =>
        //             specialDate.getStartDate().toDateString() === workDate.toDateString()
        //         );

        //         var newType, newTooltip;

        //         if (existingDateEntry && existingDateEntry.getType() === "NonWorking") {
        //             return;
        //         }

        //         if (workDate.getTime() === today.getTime()) {
        //             if (nonWorkingDays.has(workDate.toDateString())) {
        //                 newType = "NonWorking";
        //                 newTooltip = "Today is a Non-Working Day";
        //             } else if (!entry) {
        //                 newType = "Type04";
        //                 newTooltip = "Punch In: Not Available, Punch Out: Not Available";
        //             } else if (!entry.punchIn || !entry.punchOut) {
        //                 newType = "Type04";
        //                 newTooltip = `Punch In: ${entry.punchIn || "Not Available"}, Punch Out: ${entry.punchOut || "Not Available"}`;
        //             } else {
        //                 newType = "Type08";
        //                 newTooltip = `Punch In: ${entry.punchIn}, Punch Out: ${entry.punchOut}`;
        //             }
        //         } else {
        //             if (!entry) {
        //                 newType = "Type02";
        //                 newTooltip = "MSP (Missed Punch) - No Punch Data";
        //             } else if (!entry.punchIn || !entry.punchOut) {
        //                 newType = "Type02";
        //                 newTooltip = `MSP (Missed Punch) - Punch In: ${entry.punchIn || "Not Available"}, Punch Out: ${entry.punchOut || "Not Available"}`;
        //             } else {
        //                 newType = "Type08";
        //                 newTooltip = `Punch In: ${entry.punchIn}, Punch Out: ${entry.punchOut}`;
        //             }
        //         }

        //         if (existingDateEntry) {
        //             existingDateEntry.setType(newType);
        //             existingDateEntry.setTooltip(newTooltip);
        //         } else {
        //             var oSpecialDate = new sap.ui.unified.DateTypeRange({
        //                 startDate: workDate,
        //                 type: newType,
        //                 tooltip: newTooltip
        //             });
        //             oCalendar.addSpecialDate(oSpecialDate);
        //         }
        //     });
        // },




        _setPunchHistory: function () {
            var oCalendar = this.getView().byId("calendar");
            var masterHolidays = this.getOwnerComponent().getModel("masterholiday").getData();
            var punchHistory = this.getOwnerComponent().getModel("punchhistory").getData().punchHistory || [];
            var specialDates = [];
        
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            var year = today.getFullYear();
        
            var holidayDates = new Set();
        
            masterHolidays.forEach(holiday => {
                var dateParts = holiday.date.split("-");
                var date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                date.setHours(0, 0, 0, 0);
        
                if (!isNaN(date)) {
                    var formattedDate = date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0");
                    holidayDates.add(formattedDate);
        
                    var type = holiday.type === "HoliDay" ? "Type06" : "NonWorking";
                    var tooltip = holiday.type === "HoliDay" ? (holiday.name || "Holiday") : "Non-Working Day";
        
                    specialDates.push(new sap.ui.unified.DateTypeRange({
                        startDate: date,
                        type: type,
                        tooltip: tooltip
                    }));
                }
            });
        
            for (var month = 0; month < 12; month++) {
                for (var day = 1; day <= 31; day++) {
                    var workDate = new Date(year, month, day);
                    if (workDate.getMonth() !== month || workDate > today) break;
                    workDate.setHours(0, 0, 0, 0);
        
                    var formattedDate = workDate.getFullYear() + "-" + (workDate.getMonth() + 1).toString().padStart(2, "0") + "-" + workDate.getDate().toString().padStart(2, "0");
        
                    if (holidayDates.has(formattedDate)) continue;
        
                    var punchEntry = punchHistory.find(e => {
                        // var punchDateParts = e.date.split("-"); 
                        // var punchFormattedDate = new Date(Date.UTC(
                        //     parseInt(punchDateParts[2], 10),  // Year (yyyy)
                        //     parseInt(punchDateParts[1], 10) - 1, // Month (0-based index)
                        //     parseInt(punchDateParts[0], 10)   // Day (dd)
                        // )).toISOString().split("T")[0]; // ✅ Converts to "yyyy-MM-dd"
                        
                        
                        return e.date === formattedDate;
                    });
                    
                    
                    var type = "Type02"; 
                    var tooltip = "MSP - No Punch Data";
        
                    if (punchEntry) {
                        if (punchEntry.punchIn && punchEntry.punchOut) {
                            type = "Type08"; 
                            tooltip = `Full Day - Punch In: ${punchEntry.punchIn}, Punch Out: ${punchEntry.punchOut}`;
                        } else {
                            tooltip = `MSP - Punch In: ${punchEntry.punchIn || "Not Available"}, Punch Out: ${punchEntry.punchOut || "Not Available"}`;
                        }
                    }
        
                    var todayFormatted = today.getFullYear() + "-" + (today.getMonth() + 1).toString().padStart(2, "0") + "-" + today.getDate().toString().padStart(2, "0");
        
                    if (formattedDate === todayFormatted) {
                        if (punchEntry && (punchEntry.punchIn && punchEntry.punchOut)) {
                            type = "Type08"; 
                            tooltip = `Full Day - Punch In: ${punchEntry.punchIn || "N/A"}, Punch Out: ${punchEntry.punchOut || "N/A"}`;
                        } else {
                            type = "Type02"; 
                            // tooltip = `Punch In: ${punchEntry.punchIn || "N/A"}, Punch Out: ${punchEntry.punchOut || "N/A"}`;
                        }
                        
                    }
        
                    specialDates.push(new sap.ui.unified.DateTypeRange({
                        startDate: workDate,
                        type: type,
                        tooltip: tooltip
                    }));
                }
            }
        
            oCalendar.removeAllSpecialDates();
            specialDates.forEach(dateEntry => oCalendar.addSpecialDate(dateEntry));
        },
        
        
        
        










        onDateSelect: function (oEvent) {
            var oCalendar = oEvent.getSource();
            var aSelectedDates = oCalendar.getSelectedDates();
            if (aSelectedDates.length === 0) return;
        
            var oDate = aSelectedDates[0].getStartDate();
            var formattedDate = oDate.toLocaleDateString("en-CA"); // ✅ Ensures "YYYY-MM-DD"
        
            var punchHistory = this.getOwnerComponent().getModel("punchhistory").getData().punchHistory || [];
            var specialDates = oCalendar.getSpecialDates() || [];
            var todayDate = new Date().toLocaleDateString("en-CA"); // ✅ Ensures "YYYY-MM-DD"
            var dateType = "Working Day";
            var punchEntry = null;
            var highlight = "None"; // Default highlight
        
            // 🔵 **Step 1: Check if selected date exists in punch history**
            for (var i = 0; i < punchHistory.length; i++) {
                var punchFormattedDate = new Date(punchHistory[i].date).toLocaleDateString("en-CA"); // ✅ Converts to "YYYY-MM-DD"
        
                if (punchFormattedDate === formattedDate) {
                    punchEntry = punchHistory[i];
        
                    if (formattedDate === todayDate) {
                        dateType = punchEntry.punchIn && punchEntry.punchOut ? "Full Day" : "Today";
                        highlight = punchEntry.punchIn && punchEntry.punchOut ? "Success" : "Warning";            
                   } else {
                        dateType = punchEntry.punchIn && punchEntry.punchOut ? "Full Day" : "MSP";
                        highlight = punchEntry.punchIn && punchEntry.punchOut ? "Success" : "Error"; 
                    }
                    break;
                }
            }
        
            // 🔴 **Step 2: If not found in punch history, check special dates**
            if (!punchEntry) {
                for (var j = 0; j < specialDates.length; j++) {
                    var oSpecialDate = specialDates[j];
                    var specialDate = oSpecialDate.getStartDate().toLocaleDateString("en-CA"); // ✅ Ensures "YYYY-MM-DD"
        
                    if (specialDate === formattedDate) {
                        var types = oSpecialDate.getType(); // ✅ Extract `types` correctly
        
                        if (types === "Type02") {
                            dateType = "MSP";
                            highlight = "Error";
                        } else if (types === "NonWorking") {
                            dateType = "Non-Working Day";
                            highlight = "None";
                        } else if (types === "Type04") {
                            dateType = "Today";
                            highlight = "Success";
                        } else if (types === "Type06") {
                            dateType = oSpecialDate.getTooltip();
                            highlight = "Information";
                        } else {
                            dateType = types;
                            highlight = "Warning";
                        }
        
                        break; // ✅ Break only if a match is found
                    }
                }
            }
        
            var formattedDateParts = formattedDate.split("-"); 
            var displayDate = formattedDateParts[2] + "-" + formattedDateParts[1] + "-" + formattedDateParts[0];
        
            var oModel = this.getOwnerComponent().getModel("dateinfo");
            oModel.setProperty("/date", displayDate);
            oModel.setProperty("/dateType", dateType);
            oModel.setProperty("/Highlight", highlight); // ✅ Corrected reference
            oModel.setProperty("/punchIn", punchEntry ? punchEntry.punchIn : "");
            oModel.setProperty("/punchOut", punchEntry ? punchEntry.punchOut : "");
        
            this.getView().getModel("dateinfo").refresh(true);
        },
        
        
        
        

        getDaysOfMonth: function (year, month, dayOfWeek) {
            var days = [];
            var date = new Date(year, month, 1);
            while (date.getMonth() === month) {
                if (date.getDay() === dayOfWeek) {
                    days.push(new Date(date));
                }
                date.setDate(date.getDate() + 1);
            }

            return days;

        },





        onPressLocationPunch: function (oEvent) {
            var oButton = oEvent.getSource(),
                oView = this.getView();

            if (!this._pPopover) {
                this._pPopover = Fragment.load({
                    id: oView.getId(),
                    name: "hrmate.fragments.locationPunch",
                    controller: this
                }).then(function (oPopover) {
                    oView.addDependent(oPopover);
                    // oPopover.bindElement("/ProductCollection/0");
                    return oPopover;
                });
            }
            this._pPopover.then(function (oPopover) {
                oPopover.openBy(oButton);
            });


            var oModel = new sap.ui.model.json.JSONModel(oEvent.getSource().getBindingContext("punchhistory").getObject())
            this.getView().setModel(oModel, "punchhistorylocation")
        },
        onPopoverCloseButton: function (oEvent) {
            oEvent.getSource().getParent().getParent().close();
            oEvent.getSource().getParent().getParent().destroy();
        },




    })
})  