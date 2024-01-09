sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast) {
        "use strict";
        var controller, oModel, oCreatepayload;

        return Controller.extend("employeedetailentity.controller.View1",
            {
                onInit: function () {
                    controller = this;
                    // code to create a model
                    oModel = controller.getOwnerComponent().getModel("MainModel");


                    var oReqModel = new sap.ui.model.json.JSONModel();
                    controller.getView().setModel(oReqModel, "oReqModel");
                    controller.getView().getModel("oReqModel").setProperty("/results", []);
                    // new model for  enable data
                    var oenableModel = new sap.ui.model.json.JSONModel();
                    controller.getView().setModel(oenableModel, "oenableModel");
                    //new model to store the payload
                    oCreatepayload = new sap.ui.model.json.JSONModel();
                    controller.getView().setModel(oCreatepayload, "oCreatepayload");
                    var payload =
                    {
                            "EmployeeId": " ",
                            "EmployeeName": " ",
                            "Designation": " ",
                            "CompanyMail": " ",
                            "employeehead_to_details": 
                            {
                                "EmployeeId": " ",
                                "Adress": " ",
                                "PhoneNumber": " ",
                                "PersonalMail": " ",
                                "Skills": " "
                            }
                    };
                    // // this.getView().getModel("oCreatepayload").setProperty("/EmployeeId"," 1");
                    // // this.getView().getModel("oCreatepayload").setProperty("/EmployeeName"," annoel");
                    // // this.getView().getModel("oCreatepayload").setProperty("/Designation"," M.D ");
                    // // this.getView().getModel("oCreatepayload").setProperty("/CompanyMail"," annoelskaria@mindset.com");
                    // // this.getView().getModel("oCreatepayload").setProperty("/Adress","kerala ");
                    // // this.getView().getModel("oCreatepayload").setProperty("/PhoneNumber","9745113660 ");
                    // // this.getView().getModel("oCreatepayload").setProperty("/PersonalMail","annoelskaria4901@gmail.com ");
                    // // this.getView().getModel("oCreatepayload").setProperty("/Skills"," A");
                    

                    this.getView().getModel("oCreatepayload").setProperty("/payload",payload);



                },
                listItemPressed: function (oEvent) {
                    var id;
                    var that = this;
                    id = oEvent.getSource().getProperty("title");
                    oModel = this.getOwnerComponent().getModel();
                    oModel.read("/employee_headSet('"+ id +"')",
                        {
                            urlParameters: {
                                "$expand": "employeehead_to_details",

                            },
                            // filters: [],
                            success: function (oData) {

                                that.getView().getModel("oReqModel").setProperty("/results", oData);
                                that.getView().getModel("oenableModel").setProperty("/enabled", false);




                            },
                            error: function (error) {
                                MessageToast.show(error);
                            }
                        }
                    )




                },
                onCreate: function (evt) {
                    // var oView = Controller.getView();
                    if (!this._oDialog1) {
                        this._oDialog1 = sap.ui.xmlfragment("employeedetailentity.fragment.addempdetails", this);
                        //oView.addDependent(controller._oDialog1);
                    }
                    this._oDialog1.setModel(this.getView().getModel("oCreatepayload"));
                    this._oDialog1.open();
                    // var obj = {
                    // 	"request_id" :	" " ,
                    // 	"like_material" :	" " ,
                    // 	"like_material_desc" :	" ",
                    // 	"material_imported"	: " " ,
                    // 	"material_exported"	: " " ,
                    // 	"system_long_description" :	" " ,
                    // 	"system_short_description" : " ",
                    // 	"payee_number " :	" "																	
                    //  };
                    // oModel.setProperty("/createTaskObj", obj);

                },
                closeDialog1: function () {
                    this._oDialog1.close();
                },
                onEdit: function (evt) {
                    var that = this;

                    that.getView().getModel("oenableModel").setProperty("/enabled", true);

                },
                handleSavePress: function (evt) {
                    var that = this;
                    MessageToast.show("Details updated succesfully");
                    that.getView().getModel("oenableModel").setProperty("/enabled", false);
                    // this is copy code
                    var oPayload = that.getView().getModel("oReqModel").getData().results;
                    oCreatepayload = this.getOwnerComponent().getModel();

                    oPayload.employeehead_to_details.EmployeeId = oPayload.EmployeeId;
                    oCreatepayload.create("/employee_headSet", oPayload, 
                        {
                        success: function(data) 
                        {
                          // Handle successful POST response
                          console.log('POST success:', data);
                        },
                        error: function(error) 
                        {
                          // Handle errors
                          console.error('POST error:', error);
                        },
                        

                    })
                 


                },
                handleCancelPress: function (evt) {
                    var that = this;
                    // MessageToast.show("Data deleted sucessfully");
                    that.getView().getModel("oenableModel").setProperty("/enabled", false);
                    var del = this.getView().getModel("oReqModel").getData().results.EmployeeId;
                    var path = "/employee_headSet('"+del+"')";
                    var odataModel = this.getView().getModel("oReqModel");
                    //get the empy id from o req model
                    oModel.remove(path,{
                        success: function(data,response){
                            MessageToast.show("Data deleted sucessfully");
                            that.getView().getModel("oReqModel").setProperty("/results", []);
                            oModel.refresh();
                        },
                        error: function(error){
                            MessageToast.show("Error deleting Data");
                        }
                    })
                   
                },

                Createdetails :function(evt)
                {
                    MessageToast.show("detials created");
                    this._oDialog1.close();
                    //create operation code
                    var oPayload = this._oDialog1.getModel().getData().payload;
                    oCreatepayload = this.getOwnerComponent().getModel();

                    oPayload.employeehead_to_details.EmployeeId = oPayload.EmployeeId;
                    oCreatepayload.create("/employee_headSet", oPayload, 
                        {
                        success: function(data) 
                        {
                          // Handle successful POST response
                          console.log('POST success:', data);
                        //   this.getView().getModel("oCreatepayload").setProperty("/payload",[]);
                        },
                        error: function(error) 
                        {
                          // Handle errors
                          console.error('POST error:', error);
                        }
                    })
                    
                    
                   
                }
    });
});

