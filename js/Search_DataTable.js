<script>
//--------------------------------------------------------------------------------------------------
window.socketOpen = false;

var gbmClinicalColumns = [
                 {"sTitle":  "Ref"},
                 {"sTitle":  "Grade"},
                 {"sTitle":  "tissueID"},
                 {"sTitle":  "RTx_StartDt"},
                 {"sTitle":  "monthsTo1stProgression"},
                 {"sTitle":  "Type"},
                 {"sTitle":  "ChemoStartDate"},
                 {"sTitle":  "ChemoAgent"},
                 {"sTitle":  "FirstProgression"},
                 {"sTitle":  "Vital"},
                 {"sTitle":  "overallSurvival"},
                 {"sTitle":  "ageAtDx"},
                 {"sTitle":  "KPS"},
                 {"sTitle":  "Surgeon"},
                 {"sTitle":  "Procedure"},
                 {"sTitle":  "Histology"},
                 {"sTitle":  "HistologicCategory"},
                 {"sTitle":  "SpecimenId"},
                 {"sTitle":  "RTx_StopDt"},
                 {"sTitle":  "Target"},
                 {"sTitle":  "TotalDose"},
                 {"sTitle":  "ChemoEndDate"},
                 {"sTitle":  "ChemoStartDate2"},
                 {"sTitle":  "ChemoEndDate2"},
                 {"sTitle":  "ChemoAgent2"},
                 {"sTitle":  "ChemoStartDate3"},
                 {"sTitle":  "ChemoEndDate3"},
                 {"sTitle":  "ChemoAgent3"},
                 {"sTitle":  "ChemoStartDate4"},
                 {"sTitle":  "ChemoEndDate4"},
                 {"sTitle":  "ChemoAgent4"},
                 {"sTitle":  "ChemoStartDate5"},
                 {"sTitle":  "ChemoEndDate5"},
                 {"sTitle":  "ChemoAgent5"},
                 {"sTitle":  "ChemoStartDate6"},
                 {"sTitle":  "ChemoStopDate6"},
                 {"sTitle":  "ChemoAgent6"},
                 {"sTitle":  "PostOpMRIDate"},
                 {"sTitle":  "PostOpMRIResult"},
                 {"sTitle":  "SecondProgression"},
                 {"sTitle":  "ThirdProgression"},
                 {"sTitle":  "StatusDate"}];

//----------------------------------------------------------------------------------------------------
requestAllTissueIDs = function()
{
   msg = {cmd:"fetchAllTissueIDs", status:"request", payload:""};
   msg.json = JSON.stringify(msg);
   socket.send(msg.json);

} // requestAllTissueIDs
//----------------------------------------------------------------------------------------------------
// called at startup
handleAllTissueIDs = function(msg)
{
    console.log("clinicalData2 learns that there are " + msg.payload.length + " tissueIDs");
    window.clinicalData2AllTissueIds = msg.payload
    window.clinicalData2CurrentTissueIDs = window.clinicalData2AllTissueIds

} // handleAllTissueIDs
//----------------------------------------------------------------------------------------------------
showAllRows = function()
{
   var tableRef = $("#clinicalTable2").dataTable();
   tableRef.fnFilter('',2);   // tissueID column
   tableRef.fnFilter('');
   window.clinicalData2CurrentTissueIDs = window.clinicalData2AllTissueIds

} // showAllRows
//----------------------------------------------------------------------------------------------------
handleRequestToFilterByTissueID = function(msg)
{
   tissueIDs = msg$payload
   console.log("handleRequestToFilterByTissueiD" + tissueIDs.length + ": " + tissueIDs)
   //var tableRef = $("#clinicalTable").dataTable();
   //filterString = patientIDs[0]
   //for(var p=1; p < patientIDs.length; p++){
   //  filterString += "|" + patientIDs[p]
   //  }
   //console.log(filterString)
   //tableRef.fnFilter(filterString, 7, true);
   //$("#tabs").tabs( "option", "active", 2);

} // handleRequestToFilterByTissueID
//----------------------------------------------------------------------------------------------------
sendTissueIDsToModule = function(moduleName)
{
   var tableRef = $("#clinicalTable2").dataTable();

    // var tissueIDs = tableRef.fnGetData(2);
   console.log("found " + window.clinicalData2CurrentTissueIDs.length + 
               " in window.clinicalData2CurrentTissueIDs");
   var tissueIDs = window.clinicalData2CurrentTissueIDs
   // window.clinicalDataTable2CurrentTissueSelection = 

   if(tissueIDs.length == 0){
      alert("No tissueIDs selected in table");
      return;
      }

   if(moduleName == "PCA" && tissueIDs.length < 3){
      alert("Three or more tissueIDs needed for PCA");
      return;
      }

   msg = {cmd:"sendTissueIDsToModule", status:"request",
           payload:{module: moduleName,
                    tissueIDs: tissueIDs}}
    msg.json = JSON.stringify(msg);
    socket.send(msg.json);

} // sendTissueIDsToModule
//----------------------------------------------------------------------------------------------------
toMarkersAndTissues = function()
{

} // toMarkersAndTissues
//----------------------------------------------------------------------------------------------------
toPLSR = function()
{

} // toPLSR
//----------------------------------------------------------------------------------------------------
toPCA = function()
{

} // toPCA
//----------------------------------------------------------------------------------------------------
readAndApplyClinicalTableFilters = function()
{
    console.log("readAndApplyClinicalTableFilters")
    var ageAtDxMin = $("#ageAtDxMinSliderReadout").val()
    var ageAtDxMax = $("#ageAtDxMaxSliderReadout").val()
    var overallSurvivalMin = $("#overallSurvivalMinSliderReadout").val()
    var overallSurvivalMax = $("#overallSurvivalMaxSliderReadout").val()

    msg = {cmd:"filterClinicalData", status:"request",
           payload:{ageAtDxMin: ageAtDxMin,
                    ageAtDxMax: ageAtDxMax,
                    overallSurvivalMin: overallSurvivalMin,
                    overallSurvivalMax: overallSurvivalMax}};
     msg.json = JSON.stringify(msg);
     console.log(msg.json);
     socket.send(msg.json);

} // readAndApplyClinicalTableFilters 
//----------------------------------------------------------------------------------------------------
handleFilterClinicalDataTable = function(msg)
{
   console.log("=== handleFilterClinicalDataTable");
   console.log(msg);
   if(msg.status != "success"){
      alert("handleFilterClinicalDataTable error: " + msg.payload);
      return;
      }

   var tissueIDCount = msg.payload.count;
   var tissueIDs = msg.payload.tissueIDs;
   console.log("--- filtered tissueIDs returned by Oncoscape: " + tissueIDs);
   var tableRef = $("#clinicalTable2").dataTable()

     // having trouble getting visible tissueIDs from DataTable for now
     // an imperfect workaround:  save them to a global variable
     // TODO:  this does not work with direct in-browser filtering of the table


     // if tissueIDs is a single string, then 'length' returns the number
     // of characters in the string, not the number of elements in the array
     // protect against this.


   if(tissueIDCount == 1){
       window.clinicalData2CurrentTissueIDs = [tissueIDs]
       filterString = tissueIDs;
       }
   else{
      window.clinicalData2CurrentTissueIDs = tissueIDs
      filterString = tissueIDs[0];
      for(var i=1; i < tissueIDs.length; i++){
         filterString += "|" + tissueIDs[i]
         }
      } // if more than one tissueID

   console.log("---- clinicalDataTable2.handleFilterClinicalDataTable");
   console.log(filterString)
   console.log("about to call fnFilter");
   tableRef.fnFilter(filterString, 2, true);


} // handleFilterClinicalDataTable 
//----------------------------------------------------------------------------------------------------
toggleMoreFewerColumns = function()
{
    console.log("about to toggleMoreFewerColumns");
    tableRef = $("#clinicalTable2").dataTable()
    var showingFewerColumns = false;

    for(var i=11; i < 41; i++){
	var currentlyVisible = tableRef.fnSettings().aoColumns[i].bVisible;
        if(currentlyVisible) {
           showingFewerColumns = true;
           }
        tableRef.fnSetColumnVis(i, currentlyVisible ? false : true);
        }

   buttonText = "Fewer Columns";

   if(showingFewerColumns){
      buttonText = "More Columns";
      }

   $("#toggleMoreFewerColumnsButton" ).text(buttonText).button("refresh");


} // toggleCompactView
//----------------------------------------------------------------------------------------------------
fetchClinicalData2 = function()
{
     console.log("about to fetchClinicalData from server");
     msg = {cmd:"fetchClinicalData2", status:"request", payload:-1};
     msg.json = JSON.stringify(msg);
     socket.send(msg.json);

} // fetchClinicalData2
//----------------------------------------------------------------------------------------------------
$(document).ready(function() {
   console.log("==== clinicalDataTable code.js document ready");
   $("#clinicalDataTable2Div").html('<table cellpadding="0" cellspacing="0" border="0" class="display" id="clinicalTable2"></table>');
   console.log("about to call .dataTable");

   $("#clinicalTable2").dataTable({
        "sDom": "Rlfrtip",
        "aoColumns": gbmClinicalColumns,
	"sScrollX": "100px",
        "iDisplayLength": 10,
        "fnInitComplete": function(){
            $(".display_results").show();
          }
         }); // dataTable
    
    $("#toGBMPathwaysButton").button();
    $("#toGBMPathwaysButton").click(function(){sendTissueIDsToModule("GBMPathways")});
    $("#toMarkersAndTissuesButton").button();
    $("#toMarkersAndTissuesButton").click(function(){sendTissueIDsToModule("MarkersAndTissues")});
    $("#toPCAButton").button();
    $("#toPCAButton").click(function(){sendTissueIDsToModule("PCA")});
    $("#toSurvivalStatsButton").button();
    $("#toSurvivalStatsButton").click(function(){sendTissueIDsToModule("SurvivalStats")});
    $("#toTimeLinesButton").button();
    $("#toTimeLinesButton").click(function(){
        $("#tabs").tabs( "option", "active", 7);
        });

    $("#toggleMoreFewerColumnsButton").button();
    $("#toggleMoreFewerColumnsButton").click(toggleMoreFewerColumns)
    console.log("about to push socketConnectedFunction fetchClinicalData")
       // TODO, nasty hack:  wait 1 second for the socket connection to open, then load table
    socketConnectedFunctions.push(fetchClinicalData2);
    socketConnectedFunctions.push(requestAllTissueIDs);

    toggleMoreFewerColumns();

    $("#ageAtDxMinSlider").slider({
       change: function(event, ui) {$("#ageAtDxMinSliderReadout").text (ui.value)},
       min: 17,
       max: 90,
       value: 17
       });
    $("#ageAtDxMinSliderReadout").text(17);

    $("#ageAtDxMaxSlider").slider({
       change: function(event, ui) {$("#ageAtDxMaxSliderReadout").text (ui.value)},
       min: 17,
       max: 90,
       value: 90
       });
    $("#ageAtDxMaxSliderReadout").text(90);

    $("#overallSurvivalMinSlider").slider({
       change: function(event, ui) {$("#overallSurvivalMinSliderReadout").text (ui.value)},
       min: 0,
       max: 74,
       value: 0
       });
    $("#overallSurvivalMinSliderReadout").text(0);

    $("#overallSurvivalMaxSlider").slider({
       change: function(event, ui) {$("#overallSurvivalMaxSliderReadout").text (ui.value)},
       min: 0,
       max: 74,
       value: 74
       });
    $("#overallSurvivalMaxSliderReadout").text(74);
    $("#applyClinicalTablesFiltersSlidersButton").button();
    $("#showAllClinicalTablesRowsButton").button()
    $("#showAllClinicalTablesRowsButton").click(showAllRows)
    $("#applyClinicalTablesFiltersSlidersButton").click(readAndApplyClinicalTableFilters);
    }); // document ready


//--------------------------------------------------------------------------------------------------
handleIncomingTissueIDs = function(msg)
{
   console.log("============= clinicalDataTabld2.handleIncomingTissueIDs");
   console.log(msg);
   //debugger;

   tissueIDs = msg.payload.tissueIDs
   tissueIDCount = msg.payload.count

   if(tissueIDCount == 1)
      tissueIDs = [tissueIDs]

   filterString = tissueIDs[0]

   for(var i=1; i < tissueIDs.length; i++){
      filterString += "|" + tissueIDs[i]
      }

   console.log(filterString)

   var tableRef = $("#clinicalTable2").dataTable();
   tableRef.fnFilter('',2);   // tissueID column
   tableRef.fnFilter('');

   tableRef.fnFilter(filterString, 2, true);
   $("#tabs").tabs( "option", "active", 0);

   window.clinicalData2CurrentTissueIDs = tissueIDs;

} // handleIncomingTissueIDs
//--------------------------------------------------------------------------------------------------
handleClinicalData2 = function(msg)
{
   console.log("clinicalData code.js adding data to table");
   result = msg.payload;
   clinicalDataAsJSON = msg.payload;
   var tableRef = $("#clinicalTable2").dataTable();
   tableRef.fnAddData(clinicalDataAsJSON)

} // handleClinicalData2
//--------------------------------------------------------------------------------------------------
addJavascriptMessageHandler("allTissueIDs", handleAllTissueIDs);
addJavascriptMessageHandler("clinicalData2",  handleClinicalData2);
addJavascriptMessageHandler("selectClinicalDataRows", handleFilterClinicalDataTable);
addJavascriptMessageHandler("tissueIDsForClinicalDataTable2", handleIncomingTissueIDs);
//--------------------------------------------------------------------------------------------------
</script>

