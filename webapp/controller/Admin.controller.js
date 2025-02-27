sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageBox", "sap/ui/core/Fragment", "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], (Controller, MessageBox, Fragment, Filter, FilterOperator) => {
  "use strict";

  return Controller.extend("hrmate.controller.Admin", {
    onInit() {
      let Router = this.getOwnerComponent().getRouter()
      Router.getRoute("RouteView10").attachPatternMatched(this._ObjectfunctiongetMaster, this);

    },
    _ObjectfunctiongetMaster: function (oEvent) {
      debugger
      if (oEvent.getParameter("name") !== "RouteView10") {
        return;
      }
      sap.ui.core.BusyIndicator.show();
      var apiUrl = "https://hrmapi-lac.vercel.app/api/employee";
      fetch(apiUrl, { method: "GET" })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch punch history");
          }
          return response.json();
        })
        .then(data => {
          sap.ui.core.BusyIndicator.hide();

          data.forEach((element, i) => {
            if ($.sap.EmployeeCode == element.EmployeeCode) {
              data.splice(i, 1)
            }
          });

          this.getOwnerComponent().getModel("EMPData").setData(data);
          this.getOwnerComponent().getModel("EMPData").refresh(true);


        })
        .catch(error => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Error occurred: " + error.message);
        });

        this.onFetchCalendarData();
    },

    onFetchCalendarData: function () {
      sap.ui.core.BusyIndicator.show();
      var apiUrl = "https://hrmapi-lac.vercel.app/api/calendar";
  
      fetch(apiUrl, {
          method: "GET",
          headers: {
              "Content-Type": "application/json"
          }
      })
      .then(response => {
          if (!response.ok) {
              throw new Error("Failed to fetch Calendar Data");
          }
          return response.json();
      })
      .then(data => {
          sap.ui.core.BusyIndicator.hide();
          var oCalendar = this.getView().byId("AddCalendor");
          oCalendar.removeAllSpecialDates(); 
  
          var aHolidays = data.data;
          aHolidays.forEach(function (entry) {
              var oSpecialDate = new sap.ui.unified.DateTypeRange({
                  startDate: new Date(entry.date),
                  type: entry.type.toLowerCase() === "holiday" 
                        ? sap.ui.unified.CalendarDayType.Type06  // Holiday Highlight
                        : sap.ui.unified.CalendarDayType.NonWorking  // Non-Working Day Highlight
              });
              oCalendar.addSpecialDate(oSpecialDate);
          });
  
          // ✅ Update Model with Fetched Data
          this.getOwnerComponent().getModel("MasterDataHoliday").setData(data.data);
      })
      .catch(error => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Error occurred: " + error.message);
      });
  },

    onPressDetailsEMP: function (oEvent) {
      debugger
      sap.ui.core.BusyIndicator.show();
      var opath = Number(oEvent.getSource().getBindingContext("EMPData").getPath().split("/").pop())
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("RouteView9", {
        index: opath
      });


    },
    onFileChange: function (oEvent) {
      debugger
      var oFile = oEvent.getParameter('files')[0];
      // var size = oEvent.getParameter('files')[0].size
      // if(size>20000)
      // {

      // }
      var that = this
      if (oFile) {
        var reader = new FileReader();
        reader.onload = function (e) {
          var base64String = e.target.result;
          $.sap.profileimage = base64String
          that.base64()
        };
        reader.readAsDataURL(oFile);

      }

    },

    base64: function (oevent) {
      debugger
      this.getView().getModel("addPaylodEMP").getData().profileImage = $.sap.profileimage
      this.getView().getModel("addPaylodEMP").refresh(true)

    },

    onAddEMP: function (oEvent) {
      debugger
      debugger
      var pDialog3
      if (!pDialog3) {
        pDialog3 = this.loadFragment({
          name: "hrmate.fragments.newEMPAdd",
        });
      }
      pDialog3.then(function (oDialog3) {
        oDialog3.open()
      });
    },
    onCloseDialogWizard: function (oEvent) {
      debugger
      this._iSelectedStepIndex = undefined;
      this._oWizard = undefined;
      this._oSelectedStep = undefined;
      this._oSelectedStepIndex = undefined;
      oEvent.getSource().getParent().getParent().getParent().close()
      oEvent.getSource().getParent().getParent().getParent().destroy()
    },
    handleNavigationChange: function (oEvent) {
      var oWizard = this.byId("CreateProductWizard");
      oWizard.discardProgress();
      var oCurrentStep = oEvent.getParameter("step");
      var aSteps = oWizard.getSteps();
      this._iSelectedStepIndex = aSteps.indexOf(oCurrentStep);
      this._updateButtonVisibility();
    },

    onNextButtonPress: function () {
      debugger;
      if (!this._oWizard) {
        this._oWizard = this.byId("CreateProductWizard");
      }
      if (this._iSelectedStepIndex === undefined) {
        this._iSelectedStepIndex = 0;
      }
      this._oSelectedStep = this._oWizard.getSteps()[this._iSelectedStepIndex];
      var oNextStep = this._oWizard.getSteps()[this._iSelectedStepIndex + 1];

      if (this._oSelectedStep && !this._oSelectedStep.bLast) {
        this._oWizard.goToStep(oNextStep, true);
        this._iSelectedStepIndex++;
        this._oSelectedStep = oNextStep;
      } else {
        this._oWizard.nextStep();
        this._iSelectedStepIndex++;
        this._oSelectedStep = oNextStep;
      }
      this._updateButtonVisibility();
    },

    onPreviousButtonPress: function () {
      debugger;
      if (!this._oWizard) {
        this._oWizard = this.byId("CreateProductWizard");
      }
      if (!this._iSelectedStepIndex) {
        this._iSelectedStepIndex = 0;
      }
      this._oSelectedStep = this._oWizard.getSteps()[this._iSelectedStepIndex];
      var oPreviousStep = this._oWizard.getSteps()[this._iSelectedStepIndex - 1];
      if (this._oSelectedStep && this._iSelectedStepIndex > 0) {
        this._oWizard.goToStep(oPreviousStep, true);
        this._iSelectedStepIndex--;
        this._oSelectedStep = oPreviousStep;
      } else {
        this._iSelectedStepIndex = 0;
        this._oWizard.goToStep(this._oWizard.getSteps()[0], true);
        this._oSelectedStep = this._oWizard.getSteps()[0];
      }
      this._updateButtonVisibility();
    },
    _updateButtonVisibility: function () {
      if (!this._oWizard) {
        this._oWizard = this.byId("CreateProductWizard");
      }
      if (this._iSelectedStepIndex === undefined) {
        this._iSelectedStepIndex = 0;
      }

      var oPreviousButton = this.byId("onBackButtonPress");
      var oNextButton = this.byId("nextButton");
      var oFinishButton = this.byId("finishButton");
      if (this._iSelectedStepIndex === 0) {
        oPreviousButton.setVisible(false);
        oNextButton.setEnabled(true);
        oFinishButton.setEnabled(false);
      } else if (this._iSelectedStepIndex === 1 || this._iSelectedStepIndex === 2) {
        oPreviousButton.setVisible(true);
        oNextButton.setEnabled(true);
        oFinishButton.setEnabled(false);
      } else if (this._iSelectedStepIndex === 3) {
        oPreviousButton.setVisible(true);
        oNextButton.setEnabled(false);
        oFinishButton.setEnabled(true);
      }


    },

    onChangeValue: function (oEvent) {
      var oInput = oEvent.getSource();
      var sValue = oInput.getValue().trim();
      if (sValue) {
          oInput.setValueState("None");
        }else{
          oInput.setValueState("Error");
      }
  },

    onAddDetails: function (oEvent) {
      debugger;

      var aRequiredFields = [
        "EmployeeCodeID", "FirstNameID", "LastNameID", "DateofBirthID", 
        "GenderID", "MaritalStatusID", "PasswordID", "MobileNumberID",
        "EmailID", "PANNumberID", "AadhaarNumberID", "DesignationID",
        "BranchID", "RoleID", "DateofJoiningID", "ReportingManagerID",
        "ApprovingManagerID", "BankNameID", "BankAccountNumberID", 
        "BankIFSCCodeID"
    ];

    var isValid = true;

    aRequiredFields.forEach(function (sId) {
        var oInput = this.getView().byId(sId);
        if (oInput && oInput.getValue) {
            var sValue = oInput.getValue().trim();
            if (!sValue) {
                oInput.setValueState("Error");
                oInput.setValueStateText("This field is required");
                isValid = false;
            } else {
                oInput.setValueState("None");
            }
        }
    }, this);

    if (!isValid) {
        sap.m.MessageToast.show("Please fill all required fields.");
        return;
    }
      var EMPID = Number(this.getView().byId("EmployeeCodeID").getValue());
      var oModel = this.getOwnerComponent().getModel("addPaylodEMP").getData();
      var deductions = {
        description: oModel.description || "",
        amount: oModel.amount != null ? oModel.amount : 0,
        name: oModel.name || ""
      };
    
      delete oModel.description;
      delete oModel.amount;
      delete oModel.name;
    
      var payload = {
        "EmployeeCode": EMPID,
        "profile":  { ...oModel } ,
        "deductions": deductions
      };
      payload.profile.salary = parseInt(payload.profile.salary) || 0;

      function formatDateString(dateStr) {
        if (!dateStr) return null;
        var parts = dateStr.split("/");
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return null;
      }

      payload.profile.DateOfBirth = formatDateString(payload.profile.DateOfBirth);
      payload.profile.hireDate = formatDateString(payload.profile.hireDate);
      payload.profile.DateofJoining = formatDateString(payload.profile.DateofJoining);
      payload.profile.DateofConfirmation = formatDateString(payload.profile.DateofConfirmation);

      var apiUrl = "https://hrmapi-lac.vercel.app/api/employee";
      fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(err => { throw new Error(JSON.stringify(err)); });
          }
          return response.json();
        })
        .then(data => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Employee Added Successfully");
          oEvent.getSource().getParent().getParent().getParent().close();
          oEvent.getSource().getParent().getParent().getParent().destroy();
          this._ObjectfunctiongetMaster();
          this.getOwnerComponent().getModel("addPaylodEMP").setData();
          this.getOwnerComponent().getModel("addPaylodEMP").refresh(true);
          
        })
        .catch(error => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Error occurred: " + error.message);
        });
    },

    onDeleteEMPDetails: function (oEvent) {
      debugger;
      let aSelectedItems = this.byId("EMPData").getSelectedItems();

      if (aSelectedItems.length === 0) {
        sap.m.MessageBox.error("Please select items to delete.");
        return;
      }

      let sEmployeeCode = Number(aSelectedItems[0].getBindingContext("EMPData").getObject("EmployeeCode"));
      let apiUrl = "https://hrmapi-lac.vercel.app/api/employee?employeeCode=" + sEmployeeCode;

      sap.m.MessageBox.confirm("Are you sure you want to delete the selected item?", {
        title: "Confirm Deletion",
        actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
        emphasizedAction: sap.m.MessageBox.Action.YES,
        onClose: (sAction) => {
          if (sAction === sap.m.MessageBox.Action.YES) {
            sap.ui.core.BusyIndicator.show();

            fetch(apiUrl, { method: "DELETE" })
              .then(response => {
                if (!response.ok) {
                  throw new Error("Failed to delete selected items.");
                }
                return response.json();
              })
              .then(() => {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Selected items deleted successfully.");
                this.getOwnerComponent().getModel("EMPData").refresh(true);
              })
              .catch(error => {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Error occurred: " + error.message);
              });
          }
        }
      });
    },


    onSearchfield: function (oEvent) {
      debugger;
      var sQuery = oEvent.getParameter("query");
      var oBinding = this.byId("EMPData").getBinding("items");

      if (!sQuery) {
        oBinding.filter([]);
      } else {
        var oFilter = new sap.ui.model.Filter("EmployeeCode", sap.ui.model.FilterOperator.Contains, sQuery);
        oBinding.filter([oFilter]);
      }
    },

    onSelectAddDate: function (oEvent) {
      var sSelectedDate = oEvent.getSource().getSelectedDates()[0].getStartDate();
      var aHolidays = this.getOwnerComponent().getModel("MasterDataHoliday").getData();
      var year = sSelectedDate.getFullYear();
      var month = String(sSelectedDate.getMonth() + 1).padStart(2, "0"); 
      var day = String(sSelectedDate.getDate()).padStart(2, "0"); 
      var formattedDate = `${year}-${month}-${day}`;   
      var oSelectedEntry = aHolidays.find(entry => entry.date === formattedDate);
      if (oSelectedEntry) {
          this.getOwnerComponent().getModel("addDateTypeModel").setData({
              "date": formattedDate,
              "type": oSelectedEntry.type,
              "name": oSelectedEntry.name
          });
      } else {
          this.getOwnerComponent().getModel("addDateTypeModel").setData({
              "date": formattedDate,
              "type": "",
              "name": ""
          });
      }
  
      this.getOwnerComponent().getModel("addDateTypeModel").refresh(true);
  },
  

    OndateTypeAdd: function () {
      debugger;
      sap.ui.core.BusyIndicator.show();
      var apiUrl = "https://hrmapi-lac.vercel.app/api/calendar";
      var payload = this.getOwnerComponent().getModel("addDateTypeModel").getData();
  
      if (!payload.date || !payload.type || !payload.name) {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageBox.error("All fields (Date, Day Type, and Day Name) are required.");
          return;
      }
  
      var dateParts = payload.date.split("-"); 
      if (dateParts.length === 3) {
          var day = dateParts[2];
          var month = dateParts[1];
          var year = dateParts[0];
          payload.date = `${year}-${month}-${day}`; 
      }
  
      fetch(apiUrl, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
      })
      .then(response => {
          if (!response.ok) {
              throw new Error("Failed to add Calendar Data");
          }
          return response.json();
      })
      .then(data => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Date Entry Added");
          this.getView().getModel("addDateTypeModel").setData({
              "date": "",
              "type": "",
              "name": "",
          });
          this.getView().getModel("addDateTypeModel").refresh();
          this.getView().byId("AddCalendor").removeAllSelectedDates();
          this.onFetchCalendarData();
      })
      .catch(error => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Error occurred: " + error.message);
      });
  },
  
    onSelectIconTabFilter:function(oevent){
      debugger
      if(oevent.getSource().getSelectedKey() === 'AddCalender' ||oevent.getSource().getSelectedKey() === 'LeaveRequests'){
     ["onSearchbarEmployee","FirstName","LastName","Email","Designation"].forEach(element => {
      this.getView().byId(element).setEnabled(false);
     });
     this.getView().byId("filterbar").setShowGoButton(false);
     
    }else{
      ["onSearchbarEmployee","FirstName","LastName","Email","Designation"].forEach(element => {
        this.getView().byId(element).setEnabled(true);
      });
      this.getView().byId("filterbar").setShowGoButton(true);
    }


  }


  });
});
