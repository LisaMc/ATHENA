var tableRef, pubRef, trialRef, grantRef, FullTableRef;
var graphResults;
var activeContent = "SearchSpan";
//----------------------------------------------------------------------------------------------------
// used to clean the search string of dubious single characters or null text, eg ""
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};
//----------------------------------------------------------------------------------------------------
// used to remove duplicate elements from an array (eg [UW, UW, FredHutch] -> [UW, FredHutch]
function uniqueArray(elem)
{
	var n = {},r=[];
	for(var i = 0; i < elem.length; i++) 
	{
		if (!n[elem[i]]) 
		{
			n[elem[i]] = true; 
			r.push(elem[i]); 
		}
	}
	return r;
}
//----------------------------------------------------------------------------------------------------
// determines the scroll position, e.g. $('body').scrollView to return to the top of the body
//$.fn.scrollView = function () {
//    return this.each(function () {
//        $('html, body').animate({
//            scrollTop: $(this).offset().top - 85 - $("#DisplaySettingsDiv").height() - 15  //header offset by 85px + ReportFilter text -10 for padding - defined in css
//        }, 500);  //lower numbers makes for faster animation
//    });
//}

 function scrollView(elem) {
 
   var test = $("#"+elem).offset().top
        $('html, body').animate({
            scrollTop: $("#"+elem).offset().top - 105 - $("#DisplaySettingsDiv").height() - 15  //header offset by 105px + ReportFilter text -10 for padding - defined in css
        }, 500);  //lower numbers makes for faster animation
}

//----------------------------------------------------------------------------------------------------
// reset height of side bars to account for header & footer positions.  
function checkOffset() {
       var b = $(window).scrollTop();
       var c = $("#SideNav").height();
       var d = $(window).height();
        var f = $("#footer_element").offset().top - 20;  // footer margin = 20
        
        if (f-b<d) {  //footer overlapping bottom
           $("#SideNav").css("height", f-b -100)  //offset 150 for 85px header and margins 
           $("#RightBar").css("height", f-b -100)
        } else {
           $("#SideNav").css("height", $(window).height() -100)
           $("#RightBar").css("height", $(window).height() -100)
        }
     $("#DisplaySettingsDiv").css("width", $("#DataToExport").width() + 5)
     $("#DataToExport").css("top",  $("#DisplaySettingsDiv").height() + 10)
}


//----------------------------------------------------------------------------------------------------
// resize side frames based on window height and header/footer position of scroll
   window.onresize = function() { checkOffset(); if(activeContent !== "SearchSpan") updateActiveContent();};	
   $(window).scroll(checkOffset);
//----------------------------------------------------------------------------------------------------
   
   //----------------------------------------------------------------------------------------------------
      function toggleWaitCursor(){ $('body').toggleClass('wait')}

//----------------------------------------------------------------------------------------------------
$(document).ready(function() {

   navigator.sayswho = (function(){
    var ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\bOPR\/(\d+)/)
        if(tem!= null) return 'Opera '+tem[1];
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
   })();
   
    if(navigator.sayswho == "IE 8"){
       $("#body_element")[0].innerHTML =
       "<div style='background:white; color:black; width:900px; margin-left:200px'>In order to provide maximum functionality the SIMS application requires use of the latest version of either Chrome, Firefox, Internet Explorer, or Safari.  The SIMS application relies heavily on JavaScript to minimize page redraws.  The ability to run JavaScript on the page is required.</div>"
       return;
   }
	checkOffset();       
	
    var ColumnTitle = [ {"sTitle": "Index", "sWidth": '50px'}, {"sTitle": "Full.Name", "sWidth": '50px'}, {"sTitle": "Last.Name", "sWidth": '50px'}, {"sTitle": "First.Name", "sWidth": '50px'}, {"sTitle": "Degrees", "sWidth": '50px'}, {"sTitle": "Job.Title", "sWidth": '50px'}, {"sTitle": "Primary.Organization", "sWidth": '50px'}, {"sTitle": "Other..Practice..Affiliations.", "sWidth": '50px'}, {"sTitle": "Department", "sWidth": '50px'}, {"sTitle": "Phone.Number", "sWidth": '50px'}, {"sTitle": "Email", "sWidth": '50px'}, {"sTitle": "Bio", "sWidth": '50px'}, {"sTitle": "Websites", "sWidth": '50px'}, {"sTitle": "Videos", "sWidth": '50px'}, {"sTitle": "Tumor.Type.s.", "sWidth": '50px'}, {"sTitle": "Designation", "sWidth": '50px'}, {"sTitle": "Institutional.Affiliation", "sWidth": '50px'}, {"sTitle": "Focus.Areas", "sWidth": '50px'}, {"sTitle": "Member.Photos", "sWidth": '50px'}, {"sTitle": "FH.Primary", "sWidth": '50px'}, {"sTitle": "Departments.and.Divisions", "sWidth": '50px'}, {"sTitle": "Converis.ID", "sWidth": '50px'}, {"sTitle": "STTR.member", "sWidth": '50px'}, {"sTitle": "omicsField", "sWidth": '50px'}, {"sTitle": "specialty", "sWidth": '50px'}, {"sTitle": "keywords", "sWidth": '50px'}, {"sTitle": "PubList", "sWidth": '50px'}, {"sTitle": "GrantList", "sWidth": '50px'}, {"sTitle": "TrialList", "sWidth": '50px'}]

 		 $("#DataTable").dataTable({
       		  "aoColumns": ColumnTitle,
         })   // dataTable
         .fnAdjustColumnSizing(); 
 	tableRef = $("#DataTable").dataTable();
		 $("#FullDataTable").dataTable({
       		  "aoColumns": ColumnTitle,
         })   // dataTable
         .fnAdjustColumnSizing(); 
 	FullTableRef = $("#FullDataTable").dataTable();

 		 $("#grantTable").dataTable({
       		  "aoColumns": [ {"sTitle": "Serial.Number", "sWidth": '50px'},{"sTitle": "Project.Title", "sWidth": '50px'},{"sTitle": "Tumor.Type.s.", "sWidth": '50px'},{"sTitle": "Administering..IC", "sWidth": '50px'},{"sTitle": "Application.ID", "sWidth": '50px'},{"sTitle": "Project.Number", "sWidth": '50px'},{"sTitle": "Type", "sWidth": '50px'},{"sTitle": "Activity", "sWidth": '50px'},{"sTitle": "IC", "sWidth": '50px'},{"sTitle": "Support.Year", "sWidth": '50px'},{"sTitle": "Suffix", "sWidth": '50px'},{"sTitle": "Subproject.Number", "sWidth": '50px'},{"sTitle": "Contact.PI..Person.ID", "sWidth": '50px'},{"sTitle": "Contact.PI...Project.Leader", "sWidth": '50px'},{"sTitle": "PI.Trim", "sWidth": '50px'},{"sTitle": "MemberID", "sWidth": '50px'},{"sTitle": "Other.PI.or.Project.Leader.s.", "sWidth": '50px'},{"sTitle": "Organization.Name", "sWidth": '50px'},{"sTitle": "ARRA.Indicator", "sWidth": '50px'},{"sTitle": "FY", "sWidth": '50px'},{"sTitle": "FY.Total.Cost", "sWidth": '50px'},{"sTitle": "FY.Total.Cost...Sub.Projects.", "sWidth": '50px'},{"sTitle": "FY.Total", "sWidth": '50px'}]
         })   // dataTable
         .fnAdjustColumnSizing(); 
 	grantRef = $("#grantTable").dataTable();

		 $("#trialTable").dataTable({
       		  "aoColumns": [ {"sTitle": "Index", "sWidth": '50px'},{"sTitle": "Inst", "sWidth": '50px'}, {"sTitle": "Title", "sWidth": '50px'}, {"sTitle": "PI", "sWidth": '50px'}, {"sTitle": "LocalPI", "sWidth": '50px'}, {"sTitle": "MemberID", "sWidth": '50px'},	{"sTitle": "Phase", "sWidth": '50px'},	{"sTitle": "Sponsor", "sWidth": '50px'},	{"sTitle": "Sponsor Type", "sWidth": '50px'},	{"sTitle": "Type", "sWidth": '50px'},	{"sTitle": "Age", "sWidth": '50px'},	{"sTitle": "Trial IDs", "sWidth": '50px'},	{"sTitle": "Tumor Type", "sWidth": '50px'}],
         })   // dataTable
         .fnAdjustColumnSizing(); 
  	trialRef = $("#trialTable").dataTable();

		 $("#pubTable").dataTable({
       		  "aoColumns": [ {"sTitle": "Index", "sWidth": '50px'},{"sTitle": "Author", "sWidth": '50px'}, {"sTitle": "MemberID", "sWidth": '50px'}, {"sTitle": "AuthorOrder", "sWidth": '50px'}, {"sTitle": "Authors", "sWidth": '50px'}, {"sTitle": "Title", "sWidth": '50px'},	{"sTitle": "Citation", "sWidth": '50px'},	{"sTitle": "Year", "sWidth": '50px'},	{"sTitle": "PMID", "sWidth": '50px'},	{"sTitle": "Tumor Type", "sWidth": '50px'},	{"sTitle": "AnyInstitution", "sWidth": '50px'}],
         })   // dataTable
         .fnAdjustColumnSizing(); 
	pubRef = $("#pubTable").dataTable();



	d3.json("data/HutchEast/HutchEast_GrantDescriptionProjNum_7-14-15_json.txt", function(json){
		 var grantData=json
		 grantRef.fnAddData(grantData);
  	   d3.json("data/HutchEast/HutchEast_ClinicalTrials_7-14-15_json.txt", function(json){
		 var trialData=json
		 trialRef.fnAddData(trialData);
    	d3.json("data/HutchEast/HutchEast_PublicationsCrossRefInst_7-14-15_json.txt", function(json){
		 var pubData=json		 
		 pubRef.fnAddData(pubData);

	d3.json("data/HutchEast/HutchEast_MembersCrossRef_7-14-15_json.txt", function(jsonMems){

		 var DataTable=jsonMems
		 tableRef.fnAddData(DataTable);
		 FullTableRef.fnAddData(DataTable);
         tableRef.fnSort([2, "asc"])  //sort by name
         var rows = tableRef._('tr', {"filter":"applied"})
         var uniqueIDs = uniqueArray(rows.map(function(value,index) { return value[0]; }))
 
        document.getElementById("NumberOfResultsDiv").innerHTML = uniqueIDs.length
        document.getElementById("SearchStringDiv").innerHTML = "(all HutchEast)";

        createProfileContainerFromTable();  //loads divs for each of the RowIdx, but not any data (set class to ProfileNotYetLoaded)
        resetPagingSystem()         //checks if profiles being show are in class ProfileNotYetLoaded and calls function

        // only called once to generate profiles - id set as "Profile_"+idx where idx = row[][0]

	});      });     });     });  //end json
   	$(".toExpand").click(function(){toggleContent(this, this.parentNode) })
    $(".toContract").click(function(){toggleContent(this, this.parentNode) })
    // toggle short vs long profile view - parentNode references Profile_idx
     		
    $(".MainTablePages").click(function(){
        var SearchTerms = this.innerHTML
        if(SearchTerms.match("Grants")){ window.location.href = "../HutchEast.htm";}
        if(SearchTerms.match("Members")){window.location.href = "../HutchEastMembers.htm";}
      })
     // run canned search based on query text
    
        $("#SearchSpan").click(function(){            
             if( document.getElementById("ProfileResults") == null)
                SearchAndFilterResults()
             toggle_visibility("SearchSpan", "SEARCHdiv");          });
        $("#ProfileSpan").click(function(){ 
             toggle_visibility("ProfileSpan", "PROFILEdiv");        });
        $(".VisualizeSpan").click(function(){ 
             toggle_visibility("", "VISUALIZEdiv");                 });
        $("#HomeSpan").click(function(){ 
//            toggle_visibility("Home", "HOMEdiv");
             if( document.getElementById("ProfileResults") == null)
                SearchAndFilterResults()
             toggle_visibility("SearchSpan", "SEARCHdiv");
           });

    $("#ReturnToSearch").click(function(){
       toggle_visibility("SearchSpan", "SEARCHdiv") });

//    $('.removableWord').click(function(){remove_searchTerm(this)})
	$('.filterOptions :checkbox').click(function(){ toggle_selection(this.className); });	
    $(".toClear").click(function(){clearSelection(this, this.parentNode) })
    $(".toSelectAll").click(function(){selectAll(this, this.parentNode) })
    // update filter selections by sideNav selections

    $(".unselectedItemNumber").click(function(){ 
       $(".selectedItemNumber")[0].className = "unselectedItemNumber"
       $(this)[0].className= "selectedItemNumber"
       $("#NumItemsSettings")[0].innerHTML = $(this)[0].innerHTML
       resetPagingSystem()
    })
    $(".unselectedItemNumber").each(function(){
      if($(this)[0].innerHTML == "20"){
        $(this)[0].className = "selectedItemNumber"
      }
    })

    $(".barPlot").click(function(){  toggle_visibility("barplot", "VISUALIZEdiv") })
    $(".plotOption").change(updateActiveContent);
    $(".plotFeatureOption").change(updateGroupOptions);
 	$('.fil_NA :checkbox').click(function(){
 	 drawBarplot(); });	

         // settings within visualization changed & need redrawn

	$("#SideNav").css("height", $(window).height() - 100)

		
}); //document.ready


//----------------------------------------------------------------------------------------------------
 window.onload = function() {
 
      var FreeForm = document.getElementById("QueryFreeForm");
      FreeForm.onsubmit = function(e) {
        e.preventDefault();
         SearchAndFilterResults()
         updateActiveContent();
        return false;
      }
     
   } //window.onload 

 //----------------------------------------------------------------------------------------------------	
 // called by Display settings dropdown to update active display by selected text
  function sortBy(elem){

     var sort = elem.innerHTML.replace(/<.+?>/g,"")
     var sortDirection = elem.children[0].className
      
     if(sort == "name"){
     
        if(sortDirection.match("sortAscending")){
           elem.children[0].className = elem.children[0].className.replace("glyphicon-arrow-down", "glyphicon-arrow-up")
           elem.children[0].className = elem.children[0].className.replace("sortAscending", "sortDescending")
           tableRef.fnSort([2, "desc"])  //sort by last name
        }else {
           elem.children[0].className = elem.children[0].className.replace("glyphicon-arrow-up", "glyphicon-arrow-down")
           elem.children[0].className = elem.children[0].className.replace("sortDescending", "sortAscending")
           tableRef.fnSort([2, "asc"])  //sort by last name
        }
         
          var $ProfileList = $("div.ProfileContainer")
         
          var rows = tableRef._('tr', {"filter":"applied"});   
          var IndexArray = rows.map(function(value,index) { return value[0]; });
            
          var SortedProfiles = $ProfileList.sort(function (a, b) {
               var test1 = IndexArray.indexOf(a.id.match(/\d+/)[0])
               var test2 = IndexArray.indexOf(b.id.match(/\d+/)[0])

              return test1 < test2 ? -1 : test1 > test2 ? 1 : 0;
           });
       
          $("#ProfileResults").html(SortedProfiles)

      }
        updateActiveContent()
    }

 //----------------------------------------------------------------------------------------------------	
 // called by Display settings dropdown to update active display by selected text
  function updateDisplay(elem){
     
         activeContent =  elem.innerHTML.replace(/<.+?>/g,"");
         if(activeContent == "profiles"){
           activeContent = "SearchSpan"
           toggle_visibility("SearchSpan", "SEARCHdiv");
         } else if (activeContent == "barplot"){
           toggle_visibility("barplot", "VISUALIZEdiv")
         }        
  }	
//----------------------------------------------------------------------------------------------------
    function updateActiveContent(){

         var rows = tableRef._('tr', {"filter":"applied"})
         var uniqueIDs = uniqueArray(rows.map(function(value,index) { return value[0]; }))
 
        document.getElementById("NumberOfResultsDiv").innerHTML = uniqueIDs.length
      if(activeContent != "ProfileSpan"){
           $("#SearchDisplayOptions")[0].style.display = "block"
           $("#ReportSearchFilterDiv")[0].style.display = "block"
           $("#ReturnToSearch")[0].style.display = "none"
           $("#DataToExport").css("top",  $("#DisplaySettingsDiv").height() + 10)
      }  
        var els = document.getElementsByClassName('selectedDisplay');
        for(var i=0; i<els.length; ++i){     //set all displays to none within SearchDisplayOptions
            els[i].className =  'unselectedDisplay';
        };

       if(activeContent == "SearchSpan"){
          $("#SEARCHdiv").css("top", 0)
          $("#SEARCHdiv").css("position", "relative")

          $("#DisplaySettings").text("profiles")
          document.getElementById("selectedDisplayProfiles").className = "selectedDisplay"
          getProfilesFromTable();
          resetPagingSystem();
        }
        else if (activeContent == "barplot"){
          $("#DisplaySettings").text("barplot")
          document.getElementById("selectedDisplayBarplot").className = "selectedDisplay"
            drawBarplot();
        }
           
        checkOffset(); 
    }

 //----------------------------------------------------------------------------------------------------	
 // Expand and Contract Profile views 
  function toggleContent(elem, content){
               
     if(content.className.match("hideContent") != null){
        content.className = content.className.replace("hideContent", "showContent")
           elem.className = elem.className.replace("toExpandlist", "toContractlist");
           elem.className = elem.className.replace("toExpand", "toContract");
     } else {
        content.className= content.className.replace("showContent", "hideContent");
           elem.className = elem.className.replace("toContractlist","toExpandlist");
           elem.className = elem.className.replace("toContract","toExpand");
     } ;
  };

 //----------------------------------------------------------------------------------------------------	
 // respond to SideNav selections for filtering
	function toggle_selection(group){
	
        if(group == "fil_inst"){
           tableRef.fnFilter("", 6);  
           Filter_Selection("FilterInstitution", "ReportInstFilterSpan",6, "<i> from </i>")
        } else if(group == "fil_disease"){        
           tableRef.fnFilter("", 14); 
           Filter_Selection("FilterDisease", "ReportDiseaseFilterSpan",14, "<i> researching </i>")
        } else if(group == "fil_year"){        
//           tableRef.fnFilter("", 14); 
           Filter_Selection("FilterYear", "ReportYearFilterSpan",null, "<i> with grants/publications in </i>")
        }
            updateActiveContent();
    }
 //----------------------------------------------------------------------------------------------------	  
    function clearSelection(elem, parent){
    
        var className = ""
         $("#"+parent.id+" :checkbox:checked").each(function() {
          $(this)[0].checked = false;
          className = $(this)[0].className
         })
   
       toggle_selection(className)
    }
 //----------------------------------------------------------------------------------------------------	
    function selectAll(elem, parent){
    
        var className = ""
         $("#"+parent.id+" :checkbox").each(function() {
          $(this)[0].checked = true;
          className = $(this)[0].className
         })
   
       toggle_selection(className)
    }

//----------------------------------------------------------------------------------------------------  
    function Filter_Selection(ElementID, ReportSpan, TableColumn, connectingHTML){

       var selectedFieldarray = []
       $("#"+ElementID+" :checkbox:checked").each(function() 
       	{ selectedFieldarray.push($(this).val().split(";") ) });         // get all selected options within group
        
        if(selectedFieldarray.length == 0){                   // set Report Output to blank & remove "clear" link from sidebar
         document.getElementById(ReportSpan).innerHTML = "";
         $("#"+ElementID)[0].children[1].style.display = "none";
         return;
        }
        selectedFieldarray = [].concat.apply([],selectedFieldarray)

         $("#"+ElementID)[0].children[1].style.display = "block";  // show "clear" link from sidebar
        
        var filterField_String = selectedFieldarray.join("|");
        var printedString = "";
        if(selectedFieldarray.length == 1){
//           printedString = "<span class='removableWord'>" + selectedFieldarray.pop() + "<span class='hide-button'><a href='#'><sup>x</sup></a></span></span>"
           printedString = "<span >" + selectedFieldarray.pop() + "</span>"
        }else{
           var lastWord= selectedFieldarray.pop()
//           printedString = "<span class='removableWord'>" + selectedFieldarray.join("<span class='hide-button'><a href='#'><sup>x</sup></a></span></span>, <span class='removableWord'>") + "<span class='hide-button'><a href='#'><sup>x</sup></a></span></span>"
//           printedString += ", or <span class='removableWord'>" + lastWord + "<span class='hide-button'><a href='#'><sup>x</sup></a></span></span>"
           printedString = "<span >" + selectedFieldarray.join(", ") + "</span>"
           printedString += ", or <span >" + lastWord + "</span>"

        }                                                    // use OR grammar in Report Output, with connecting HTML phrase, e.g. "available for"

      document.getElementById(ReportSpan).innerHTML = connectingHTML + printedString 

      if(TableColumn)          // Filter Institution uses table filter prototype defined in document ready
         tableRef.fnFilter(filterField_String, TableColumn, true, false);    
         //searches for filter String in column (TableColumn) using RegEx (true) without smart filtering (false)
    }

   //----------------------------------------------------------------------------------------------------
	function toggle_visibility(activeSpanID, activeDivID){
        activeContent = activeSpanID;
        var els = document.getElementsByClassName('MainFrameDiv');
        for(var i=0; i<els.length; ++i){     //set all displays to none
            els[i].style.display =  'none';
        };

        document.getElementById(activeDivID).style.display = 'block'  //then activate a single div
        if(activeSpanID != "Home"){ //not the home page
             document.getElementById("mainContent").style.background = "#F1F1F1"
             document.getElementById("mainContent").style.color = "#000"
             
         }else{
             document.getElementById("mainContent").style.background = "#000"
             document.getElementById("mainContent").style.color = "#F1F1F1"
         }
         
        updateActiveContent();
    }
  //----------------------------------------------------------------------------------------------------
   function SearchTableByStrings(wordArray) {
        var filterString = wordArray[0];
        for(var i=1; i < wordArray.length; i++){
           filterString += "|" + wordArray[i]
        } // if more than one search word

      tableRef.fnFilter(filterString, null, true, false); //searches all columns (null) using RegEx (true)
   }
  //----------------------------------------------------------------------------------------------------
   function showAllRows() {
      
      tableRef.fnFilter("");
      tableRef.fnFilter("", 6);  // clear Inst filter
      tableRef.fnFilter("", 14); // clear field filter

      tableRef.fnDraw()
   }
  //----------------------------------------------------------------------------------------------------
   function SearchAndFilterResults(){
        var searchString = document.getElementById("QueryFreeInput").value
        var wordArray = searchString.match(/[\w.\-]+|"(?:\\"|[^"])+"/g)
        if(wordArray == null) wordArray = [""]
        
        wordArray.clean("")
        var i = wordArray.length;
        while(i--){  wordArray[i] = wordArray[i].replace(/"/g,"");}
        	// STILL NEED TO HANDLE: ANDs!!!
        
        showAllRows();
       
        if(wordArray.length == 0){
           document.getElementById("SearchStringDiv").innerHTML = "(all HutchEast)";
        }else{
           document.getElementById("SearchStringDiv").innerHTML = searchString;
           SearchTableByStrings(wordArray); 
        }  
        
        Filter_Selection("FilterInstitution", "ReportInstFilterSpan",6, "<i> from </i>")
        Filter_Selection("FilterDisease", "ReportDiseaseFilterSpan",14, "<i> specializing in </i>")
   }

   //----------------------------------------------------------------------------------------------------
      function ArrayToStringSpan(wordString, splitChar, cleanChar, sepChar){
         var wordArray = wordString.split(splitChar)
         if(wordArray == null) wordArray = [""]
        
         var i = cleanChar.length
         while(i--){ wordArray.clean(cleanChar[i]) }
         var j = wordArray.length;
         while(j--){  wordArray[j] = "<span style='padding:0px 3px;border-radius:10px;-moz-border-radius:10px;-webkit-border-radius:10px' class='ActiveWords'>"+wordArray[j]+sepChar+"</span>";}
         
         return wordArray.join("")

      }

   //----------------------------------------------------------------------------------------------------
      function EditProfile(elem){
           toggle_visibility("ProfileSpan", "PROFILEdiv");           
           $("#SearchDisplayOptions")[0].style.display = "none"
           $("#ReportSearchFilterDiv")[0].style.display = "none"
           $("#ReturnToSearch")[0].style.display = "block"
           
           if(elem.id == ""){
                $("#edit_firstname").val("")
                $("#edit_lastname").val("")
                $("#edit_institution").val("")
                $("#edit_disease").val("")

           }
           else{
              var RowIdx = elem.id.match(/\d+/)[0]
              var FilterString = "^"+RowIdx+"$"
                  tableRef.fnFilter(FilterString, 0, true, false); //searches index column for Profile Index
              var row = tableRef._('tr', {"filter":"applied"});   
                $("#edit_firstname").val(row[0][3])
                $("#edit_lastname").val(row[0][14])
                $("#edit_institution").val(row[0][9])
                $("#edit_title").val(row[0][1])
                $("#edit_disease").val(row[0][2].replace(/#/, ""))

            tableRef.fnFilter("", 0); // clear index filter
           }
      }
     //----------------------------------------------------------------------------------------------------
     function FullProfile(elem){
      
      if(elem.className.match("toExpand") != null){
          var els = elem.parentNode.children
          for(var i=0; i<els.length; ++i){     //set all displays to none
            els[i].style.display =  'block';
        };
      }else{
          var els = elem.parentNode.children
          for(var i=0; i<els.length; ++i){     //set all displays to none
            if(els[i].className.match("fullProfile") != null){
              els[i].style.display =  'none'; }
        };
      }
         toggleContent(elem, elem.parentNode.children[3])
      }
     //----------------------------------------------------------------------------------------------------
     function ExpandList(elem){
      
      if(elem.className.match("toExpandlist") != null){
          var els = elem.parentNode.children
          for(var i=0; i<els.length; ++i){     //set all displays to none
            els[i].style.display =  'block';
        };
      }else{
          var els = elem.parentNode.children
          for(var i=0; i<els.length; ++i){     //set all displays to none
            if(els[i].className.match("fullProfile") != null){
              els[i].style.display =  'none'; }
        };
      }
         toggleContent(elem, elem.parentNode.children[1])
      }

 //----------------------------------------------------------------------------------------------------
	function getProfilesFromTable(){

          var rows = tableRef._('tr', {"filter":"applied"});   
         
      $('.ActiveProfileContent').toggleClass("FilteredProfileContent", true).toggleClass("ActiveProfileContent", false)
      $('#ProfileResults .ProfileContainer').css('display', 'none');  //set everything out of page range
          
         for(var i=0; i < rows.length; i++){   // then reveals ones that haven't been filtered
            var RowIdx = rows[i][0]
           $("#Profile_"+RowIdx).toggleClass("FilteredProfileContent", false).toggleClass("ActiveProfileContent", true)
        }
    
    }
 //----------------------------------------------------------------------------------------------------
	function getProfilesFromArray(IndexArray){
         
      $('.ActiveProfileContent').toggleClass("FilteredProfileContent", true).toggleClass("ActiveProfileContent", false)
      $('#ProfileResults .ProfileContainer').css('display', 'none');  //set everything out of page range
          
         for(var i=0; i < IndexArray.length; i++){   // then reveals ones that haven't been filtered
            var RowIdx = IndexArray[i]
           $("#Profile_"+RowIdx).toggleClass("FilteredProfileContent", false).toggleClass("ActiveProfileContent", true)
        }
    
    }
      
   //----------------------------------------------------------------------------------------------------
	  function resetPagingSystem(){
                       
          $("#SorryMessage")[0].style.display= "none"
           var ItemsPerPage = parseInt($(".selectedItemNumber")[0].innerHTML)
           var number_of_pages = Math.ceil($('#ProfileResults .ActiveProfileContent').length / ItemsPerPage);

           var current_link = 0;
           var navigation_html = "<li><a class='prev' onMouseDown = 'toggleWaitCursor()' onMouseUp='previous()'>&laquo;</a></li>"
           while (number_of_pages > current_link) {
                  var DisplayPageNumberLink = current_link > 4 ? "hidePageNumber" : "displayPageNumber"
                  navigation_html += "<li ><a class='page "+DisplayPageNumberLink+"' onMouseDown = 'toggleWaitCursor()' onMouseUp='go_to_page(" + current_link + ")' longdesc='" + current_link + "'>" + (current_link + 1) + "</a></li>";
                  current_link++;
           }
           navigation_html += "<li><a class='next' onMouseDown = 'toggleWaitCursor()' onMouseUp='next()'>&raquo;</a></li>"
           $('#SearchPageSelection .pagination').html(navigation_html);
           $('#SearchPageSelection .pagination .page:first').addClass('active');

           $('#ProfileResults .ActiveProfileContent').css('display', 'none');
           $('#ProfileResults .ActiveProfileContent').slice(0, ItemsPerPage).css('display', 'block').each(function(){ 
              if( $(this)[0].className.match("ProfileNotYetLoaded")){
                var RowIdx = $(this)[0].id.match(/\d+/)[0]
                createIndividualProfile(RowIdx);
                 $(this).removeClass("ProfileNotYetLoaded")
              }
          });

          $("#showingFirstSearch")[0].innerHTML = Math.min($('#ProfileResults .ActiveProfileContent').length, 1)
          $("#showingLastSearch")[0].innerHTML = Math.min($('#ProfileResults .ActiveProfileContent').length, ItemsPerPage)

          if($("#showingFirstSearch")[0].innerHTML == "0"){  $("#SorryMessage")[0].style.display = "block" }

       } 

   //----------------------------------------------------------------------------------------------------
       function go_to_page(page_num) {
          var show_per_page = parseInt($(".selectedItemNumber")[0].innerHTML)
          var start_from = page_num * show_per_page;
          var end_on = start_from + show_per_page;
           var number_of_pages = Math.ceil($('#ProfileResults .ActiveProfileContent').length / show_per_page);

          $("#showingFirstSearch")[0].innerHTML = start_from + 1
          $("#showingLastSearch")[0].innerHTML = Math.min(end_on, $('#ProfileResults .ActiveProfileContent').length)


          $('#ProfileResults  .ActiveProfileContent').css('display', 'none').slice(start_from, end_on).css('display', 'block').each(function(){ 
              if( $(this)[0].className.match("ProfileNotYetLoaded")){
                var RowIdx = $(this)[0].id.match(/\d+/)[0]
                createIndividualProfile(RowIdx);
                $(this).removeClass("ProfileNotYetLoaded")

              }
          });
          $('#SearchPageSelection .pagination .active').removeClass('active')
          $('.page[longDesc=' + page_num + ']').addClass('active');
          
          $(".displayPageNumber").removeClass("displayPageNumber").addClass("hidePageNumber")
          var start = Math.max(Math.min(page_num-2, number_of_pages-5), 0)
          var end = Math.min(number_of_pages,start+5)
          for(var i=start; i<end;i++){
             $('.page[longDesc=' + i + ']').removeClass("hidePageNumber").addClass('displayPageNumber');
              
          }
          toggleWaitCursor()

      }
   //----------------------------------------------------------------------------------------------------
       function previous() {
  
          var new_page = parseInt($('#SearchPageSelection .pagination .active')[0].innerHTML) - 2;
             //if there is an item before the current active link run the function
          if (new_page>=0) {
             go_to_page(new_page);
          }else{     toggleWaitCursor() }

       }
   //----------------------------------------------------------------------------------------------------
       function next() {
 
           var new_page = parseInt($('#SearchPageSelection .pagination .active')[0].innerHTML) ;
             //if there is an item after the current active link run the function
          if (new_page < $('#SearchPageSelection .pagination').children().length-2){ 
             go_to_page(new_page);
          } else{     toggleWaitCursor()  }

       }       
      
      
   //----------------------------------------------------------------------------------------------------
	  function createProfileContainerFromTable(){

        var rows = tableRef._('tr', {"filter":"applied"});   
        var uniqueIDs = uniqueArray(rows.map(function(value,index) { return value[0]; }))
                
        $('#ProfileResults').html('')
        var ProfileResults = $("#ProfileResults")
      
        document.getElementById("NumberOfResultsDiv").innerHTML = uniqueIDs.length
        
        if(uniqueIDs.length == 0){
           ProfileResults.append("Sorry, your search did not match any profiles.")
           return;
        }
        
         var ProfileContainers = ""
        for(var i=0; i < uniqueIDs.length; i++){
          var RowIdx = uniqueIDs[i]
          ProfileContainers += "<div id=Profile_"+RowIdx+ " class='ActiveProfileContent ProfileContainer ProfileNotYetLoaded'></div>"
        }
         ProfileResults.append(ProfileContainers)
    }
    
    //----------------------------------------------------------------------------------------------------
 function ShowPlotProfiles(IndexArray){

     $("#VizResults")[0].innerHTML = "";
     $("#VizResults").append("<div id='VizResultsHeader'><div id='scrollToTop' style='text-align:right;color:#60a8fa;font-size:0.9em; cursor:pointer'>back to top</div>"
        + "<div style='text-align:center; font-size:1.3em'><strong>"+ IndexArray.count+" results for "+IndexArray.name+"</strong><br/></div></div>");

     getProfilesFromArray(IndexArray.Index)  //sets Index values to ProfileActive
     resetPagingSystem()                     // displays first set of profiles to 

     $("#SEARCHdiv").css("position", "absolute")
     $("#SEARCHdiv").css("top", $("#VizResults")[0].offsetTop + $("#VizResultsHeader")[0].offsetHeight)
     $("#SEARCHdiv")[0].style.display = "block"
     
     $("#VizResults").css("height",$("#SEARCHdiv")[0].clientHeight)

     toggleWaitCursor() 
     scrollView("VizResults")
     $("#scrollToTop").click( function(){
        scrollView("DataToExport")
      })
  }

   //----------------------------------------------------------------------------------------------------        
    function createIndividualProfile(RowIdx){

           var FilterString = "^"+RowIdx+"$";
           FullTableRef.fnFilter(FilterString, 0, true, false); //searches index column for Profile Index
           var row = FullTableRef._('tr', {"filter":"applied"});   
           FullTableRef.fnFilter("",0)
           
         var Name =  "<b>"+row[0][1]+"</b>" ;
          if(row[0][4] !== ""){ Name= Name.concat(", " + row[0][4]); }
          var Title = "", Contact="";
           if(row[0][5] !== ""){ Title = row[0][5] + "<br>"}
           if(row[0][8] !== ""){ Title = Title + row[0][8] + "<br>"}
           if(row[0][6] !== ""){ Title = Title + row[0][6] + "<br>"}
           if(row[0][9] !== ""){ Contact = Contact + row[0][9] + "<br>"}
           if(row[0][10] !== ""){ Contact = Contact + row[0][10] + "<br>"}

         
         var pubSpan=      "<span id='pubSpan' style='display:none; padding-top:10px' class='fullProfile hideContent'>", 
             grantSpan=  "<span id='grantSpan' style='display:none; padding-top:10px' class='fullProfile hideContent'>", 
             trialSpan = "<span id='trialSpan' style='display:none; padding-top:10px' class='fullProfile hideContent'>";
        var numGrants=0, numPubs=0, numTrials=0;
         
         var grantIDs = "^"+row[0][27].split(";").join("$|^") + "$";
        if(grantIDs.length >2){
         grantRef.fnFilter(grantIDs, 0, true, false); //searches all columns (null) using RegEx (true)
         var grants = grantRef._('tr', {"filter":"applied"});   
         grantRef.fnFilter("",0)

         var seenIndices = []
         for(var i=0;i<grants.length; i++){
            if(seenIndices.indexOf(grants[i][0]) !== -1) continue;
            seenIndices.push(grants[i][0])

           var grantTitle = "", Org="", Funder="", FYcost="";
           if(grants[i][1] !== ""){ grantTitle = grants[i][1] }
           if(grants[i][17] !== ""){ Org = grants[i][17] }
           if(grants[i][14] !== ""){ PI = grants[i][14] }
           if(grants[i][14] !== ""){ Funder = grants[i][3] }
           
         grantRef.fnFilter(grants[i][0], 0, true, false); //searches all columns (null) using RegEx (true)
         var thisGrant = grantRef._('tr', {"filter":"applied"});   
         grantRef.fnFilter("",0)
           thisGrant = thisGrant.sort(function (a, b) { return a[19] < b[19] ? -1 : a[19] > b[19] ? 1 : 0; });
           for(var j=0;j<thisGrant.length; j++){
              FYcost = FYcost + "; "
              if(thisGrant[j][19] !== ""){ FYcost = FYcost + thisGrant[j][19] }
              if(thisGrant[j][22] !== ""){ FYcost = FYcost + ": $" + thisGrant[j][22] }
           }
           FYcost = FYcost.replace(/^;/,"")
           grantSpan = grantSpan +  grantTitle +"<br>"+Org+ "<br>"+Funder+ " ("+FYcost+") <br/><br/>"
         }
        } //grant
        grantSpan = grantSpan + "</span>"
        if(typeof seenIndices !== "undefined") numGrants = seenIndices.length
        
         var pubIDs = "^"+row[0][26].split(";").join("$|^") + "$";
        if(pubIDs.length >2){

         pubRef.fnFilter(pubIDs, 0, true, false); //searches all columns (null) using RegEx (true)
         var pubs = pubRef._('tr', {"filter":"applied"});   
         pubRef.fnFilter("",0)

         pubs = pubs.sort(function (a, b) { return a[7] < b[7] ? 1 : a[7] > b[7] ? -1 : 0; });
         for(var i=0;i<pubs.length; i++){

           var Authors = "", pubTitle = "",Citation="", Year="", PMID="";
           if(pubs[i][4] !== ""){ Authors = pubs[i][4] }
           if(pubs[i][5] !== ""){ pubTitle = pubs[i][5] }
           if(pubs[i][6] !== ""){ Citation = pubs[i][6] }
           if(pubs[i][7] !== ""){ Year = pubs[i][7] }
           if(pubs[i][8] !== ""){ PMID = "PMID: " + pubs[i][8] }
           pubSpan = pubSpan  + Authors +".'"+pubTitle+ "' "+Citation+ " ("+Year+") "+ PMID + "<br/><br/>"
         }
         numPubs = row[0][26].split(";").length
        }
         pubSpan = pubSpan + "</span>"

         
         var trialIDs = "^"+row[0][28].split(";").join("$|^") + "$";
        if(trialIDs.length >2){
         trialRef.fnFilter(trialIDs, 0, true, false); //searches all columns (null) using RegEx (true)
         var trials = trialRef._('tr', {"filter":"applied"});   
         trialRef.fnFilter("",0)

         trials = trials.sort(function (a, b) { return a[6] < b[6] ? 1 : a[6] > b[6] ? -1 : 0; });
         for(var i=0;i<trials.length; i++){

           var Org = "", trialTitle = "",Phase="", Age="",  TumorType="";
           if(trials[i][2] !== ""){ trialTitle = trials[i][2]  }
           if(trials[i][10] !== ""){ trialTitle = trialTitle + " ("+trials[i][11] +")<br/>"}
           if(trials[i][1] !== ""){ Org = trials[i][1] }
           if(trials[i][7] !== ""){ Org = Org + ", "+trials[i][7] }
           if(trials[i][6] !== ""){ Phase = "; "+trials[i][6] }
           if(trials[i][11] !== ""){ TumorType = "; "+trials[i][12] }
           if(trials[i][9] !== ""){ Age = "<br/>Age: " + trials[i][10] }
           trialSpan = trialSpan +trialTitle+Org+ " "+Phase+ " "
                       + TumorType + Age + "<br/><br/>";
         }
        numTrials = row[0][28].split(";").length
        }
        trialSpan = trialSpan + "</span>"
             
         $("#Profile_"+RowIdx).append(
              "<div id=Profile_"+RowIdx+"_edit          onclick='EditProfile(this)' class='Profile_editPencil';><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span><br></div>"
            + "<div id=Profile_"+RowIdx+"_toggleContent onclick='FullProfile(this)' class='toggleProfileContent toExpand'>&gt;</div>"
            + "<div id=Profile_"+RowIdx+"_Info       class='ProfileInfo'>"+ Name + "<br>"+Title+Contact+"</div>"
            + "<div id=Profile_"+RowIdx+"_Bio        class='hideContent ProfileBio'></div>"
            + "<div id=Profile_"+RowIdx+"_Grants> <div style='font-style:italic; cursor:pointer; clear:both;padding-left:8px' onclick='ExpandList(this)' class='toExpandlist'><span style= 'color:#60a8fa; text-decoration:none; font-style:normal;min-width:35px;float:left'>("+numGrants+")</span><span style='float:left'>Grants</span></div>"+ grantSpan +"</div>"
            + "<div id=Profile_"+RowIdx+"_Pubs>   <div style='font-style:italic; cursor:pointer; clear:both;padding-left:8px' onclick='ExpandList(this)' class='toExpandlist'><span style= 'text-decoration:none; font-style:normal;color:#60a8fa;min-width:35px;float:left'>("+numPubs+")</span><span style='float:left'>Publications</span></div>"+ pubSpan +"</div>"
            + "<div id=Profile_"+RowIdx+"_Trials> <div style='font-style:italic; cursor:pointer; clear:both;padding-left:8px' onclick='ExpandList(this)' class='toExpandlist'><span style= 'text-decoration:none; font-style:normal;color:#60a8fa;min-width:35px;float:left'>("+numTrials+")</span><span style='float:left'>Clinical Trials</span></div>"+ trialSpan +"</div>"
            + "<div id=Profile_"+RowIdx+"_addtlPos   class='fullProfile hangingIndent' style='margin-top:5px;'></div>"
            + "<div id=Profile_"+RowIdx+"_keywords   class='fullProfile hangingIndent' ></div>"
            + "<div id=Profile_"+RowIdx+"_Disease    class='fullProfile hangingIndent' ></div>"
            + "<div id=Profile_"+RowIdx+"_website    class='fullProfile' style='margin-top:5px;'></div>")
     
  
          var addtlPos = [7,16];
          var AddedPos = ""
          for(var j=0; j<addtlPos.length; j++){
             if(row[0][addtlPos[j]] != "" & row[0][addtlPos[j]] != "NA"){
                AddedPos = AddedPos + row[0][addtlPos[j]] + ";"
             }           
          }
          if(AddedPos != ""){
             AddedPos = "<b style='padding-right:5px'>Additional Positions </b>" + ArrayToStringSpan(AddedPos, ";", ["", "#"], "<br>") 
             $("#Profile_"+RowIdx+"_addtlPos").append(AddedPos)
             $("#Profile_"+RowIdx+"_addtlPos").css("margin-bottom","5px")
          }
 
          if(row[0][14] !== "" & row[0][14] !== "NA"){ 
             var Disease = "<b style='padding-right:38px'>Disease type </b>"
             Disease = Disease+ ArrayToStringSpan(row[0][14].replace(/#/g,""), ";", ["", "#"], "; ")
             $("#Profile_"+RowIdx+"_Disease").append(Disease + "<br>")
             $("#Profile_"+RowIdx+"_Disease").css("margin-bottom","5px")
          }
            var Websites = ""
          if(row[0][12] !== "" & row[0][12] !== "NA"){ 
            var sites= row[0][12]
            var siteArray = sites.split(/[; ]+/); 
            if(siteArray != null){
              j=siteArray.length;
              while(j--){ siteArray[j] = "<a href='"+siteArray[j]+"' target='_blank'>"+siteArray[j]+"</a><br>"}
              Websites = siteArray.join("")
            }
            $("#Profile_"+RowIdx+"_website").append(Websites + "<br>")
          }

          var Keywords = [], Specialty = [];
          if(row[0][24] !== "" & row[0][24] !== "NA"){ Specialty = row[0][24].toLowerCase().replace(/; /g,";").split(";")}
          if(row[0][25] !== "" & row[0][25] !== "NA"){ Keywords  = row[0][25].toLowerCase().replace(/; /g,";").split(";")}
          var Allkeywords = Keywords.concat(Specialty)
          if(Allkeywords.length){
            var UniqueKeywords = [];
            for(kw=0;kw<Allkeywords.length;kw++){
              if(UniqueKeywords.indexOf(Allkeywords[kw])== -1 & Allkeywords[kw] != "na")
                 UniqueKeywords.push(Allkeywords[kw])}
            UniqueKeywords = ArrayToStringSpan(UniqueKeywords.join(";"), ";", ["", "#"], "; ")  + "<br>"
            $("#Profile_"+RowIdx+"_keywords").append("<b style='padding-right:54px'>Keywords </b>" + UniqueKeywords)
            $("#Profile_"+RowIdx+"_keywords").css("margin-bottom","5px")
          }

          var Bio = ""
          if(row[0][11] !== "" & row[0][11] !== "NA"){
             Bio = row[0][11].replace(new RegExp('@', 'g'), "<br>") + "<br>";}
           $("#Profile_"+RowIdx+"_Bio").append(Bio)
        
          
      } // createProfilesFromTable
  //----------------------------------------------------------------------------------------------------
	  function setProfilePicture(ImageDiv, file){
        $.ajax({
             url:'/images/Photos/'+file,
             type:'HEAD',
             error: function()    { //file does not exist
                     $(ImageDiv).append("<img title='ProfilePicture' alt='ProfilePic' class='lazy' style='max-height:75px; max-width:50px' data-src='/images/Photos/Photo Coming Soon.jpg' src='/images/Photos/Photo Coming Soon.jpg'>")
             },
             success: function()  { //file exists
                     $(ImageDiv).append("<img title='ProfilePicture' alt='ProfilePic' class='lazy' style='max-height:75px; max-width:50px' src='/images/Photos/"+ file + "' data-src='/images/Photos/Photo Coming Soon.jpg'>")
             }
       });
      }

  //----------------------------------------------------------------------------------------------------
	  function setProfilePicture_redo(ImageDiv, file){
          var img = $("<img />").attr('data-src', 'images/blank.gif').attr('src', '/images/Photos/'+ file ).attr('style','max-height:75px; max-width:50px')
             .load(function() {
                 if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                   $(ImageDiv).append("<img style='max-height:75px; max-width:50px' data-src='images/blank.gif' src='/images/Photos/Photo Coming Soon.jpg'>")
                 } else {
                   $(ImageDiv).append(img);
                 }
              });
    }
 
 //----------------------------------------------------------------------------------------------------
     function getCounts(arrayList, required) {
        var frequency = {};

        for (var i=0;i<arrayList.length; i++) { frequency[arrayList[i]] = 0; };

        var uniques = arrayList.filter(function(value) { return ++frequency[value] == 1; })
        
        var CountMap = [];
        for (var i=0;i<uniques.length; i++) { CountMap.push({Name: uniques[i], count: frequency[uniques[i]]}); }

        required.forEach(function(d) {
           if(uniques.indexOf(d) == -1) { CountMap.push({Name: d, count: 0})  } });
        
        return CountMap
    };
//----------------------------------------------------------------------------------------------------
   function ascending_groupName(a,b) {
        if (a.Name < b.Name)
            return -1;
        if (a.Name > b.Name)
            return 1;
        return 0;
    }

//----------------------------------------------------------------------------------------------------
  function updateGroupOptions()
  {  
        var f = document.getElementById("PlotFeature");
        var Feature = f.options[f.selectedIndex].text;
        
        var Group = document.getElementById("PlotGroup")
        removeOptions(Group);
        var GroupList = []
        
        if(Feature == "Members"){
           GroupList = ["Degrees", "Department","Institute", "None"]
        } else if(Feature == "Publications"){
           GroupList = ["Author Order", "Year","Institute", "None"]
        } else if(Feature == "Grants"){
           GroupList = ["Sponsor", "Activity", "Year","Institute", "None"]
        } else if(Feature == "Trials"){
           GroupList = ["Phase", "Sponsor","Institute", "None"]
        }

        for(var i=0;i<GroupList.length;i++){
          var option = document.createElement("option");
          option.text = GroupList[i];
          Group.add(option, Group[0]);
        }

       updateActiveContent()
  }
//----------------------------------------------------------------------------------------------------
  function removeOptions(selectbox)
  {  //removeOptions(document.getElementById("mySelectObject"));
    var i;
    for(i=selectbox.options.length-1;i>=0;i--)
    {
        selectbox.remove(i);
    }
   }
//----------------------------------------------------------------------------------------------------
function generateBarplotArray(data, Colmn, grpCol, memCol, reqd){
         
          var values = [], LookUpProfiles = [], uniqueGroups = [];
  
//          var seenIndices = []         
 
          for(var row=0;row<data.length; row++){
//           if(seenIndices.indexOf(data[row][0]) !== -1) continue;
//            seenIndices.push(data[row][0])
            
            var featType = data[row][Colmn]
            if(featType == "" |  featType == "NA") featType = "not reported"
            var featArray = uniqueArray(featType.split(";").clean(""))
            values= values.concat(featArray)  

            var groupArray = []
            if(grpCol !== -1){
               var groupType = data[row][grpCol]
               if(groupType == "" |  groupType == "NA") groupType = "not reported"
               groupArray = uniqueArray(groupType.split(";").clean(""))
               uniqueGroups = uniqueGroups.concat(groupArray)
            } else{
                uniqueGroups = groupArray = ["All"]
            }
            if(featArray.length ){
             
 //             var DivideResult = featArray.length * groupArray.length 
              var DivideResult =1
              var memIDs = data[row][memCol].split(";") 
              for(var j =0;j<featArray.length;j++){
                 if (typeof LookUpProfiles[featArray[j]] === "undefined") {          // not found
                          LookUpProfiles[featArray[j]] ={Name: featArray[j], count: 1, Index:  [memIDs[0]], groups:[] }   // add Field name and populate array of indices
                          
                          for( var k=0;k<groupArray.length; k++){
                               LookUpProfiles[featArray[j]][groupArray[k]] = 1/DivideResult
                               LookUpProfiles[featArray[j]].groups[groupArray[k]] = [memIDs[0]]
                               for(var m=1;m<memIDs.length;m++) {
                                   LookUpProfiles[featArray[j]].groups[groupArray[k]].push( memIDs[m])
                               }
                          }
                } else {  // Field already defined
                               LookUpProfiles[featArray[j]].count += 1
                               LookUpProfiles[featArray[j]].Index.push( data[row][memCol].split(";")[0])
                               for( var k=0;k<groupArray.length; k++){
                                  if(typeof LookUpProfiles[featArray[j]][groupArray[k]] === "undefined"){
                                          LookUpProfiles[featArray[j]][groupArray[k]]  = 1/DivideResult
                                          LookUpProfiles[featArray[j]].groups[groupArray[k]] = [memIDs[0]]
                                  } else {LookUpProfiles[featArray[j]][groupArray[k]] += 1/DivideResult 
                                          LookUpProfiles[featArray[j]].groups[groupArray[k]].push( memIDs[0])
                                  }
                                 
                                  for(var m=1;m<memIDs.length;m++) {
                                     LookUpProfiles[featArray[j]].groups[groupArray[k]].push( memIDs[m])
                                  }
                               }
                        } 
                        
              }
            } 
         }
         var uniqueFeatures = uniqueArray(values)
         uniqueGroups = uniqueArray(uniqueGroups).sort()
         
        reqd.forEach(function(d) {
           if(uniqueFeatures.indexOf(d) == -1) { uniqueFeatures.push(d)  } 
           if(typeof LookUpProfiles[d] == "undefined") LookUpProfiles[d] = {Name: d, count: 0, Index:  [], groups:[] }
        });

         
         return([LookUpProfiles, uniqueFeatures, uniqueGroups])
    }

 
  //----------------------------------------------------------------------------------------------------
   function drawBarplot(){
 
        d3.select("#MainGraph").select("svg").remove();
        $("#MainGraph")[0].innerHTML = "";
        $("#VizSubtitle")[0].innerHTML = "";
        $("#VizAddendum")[0].innerHTML = ""
        $("#VizResults")[0].innerHTML = "";
        $("#SEARCHdiv")[0].style.display = "none"
//        $("#DataToExport").scrollView();
        scrollView("DataToExport")
        
        var data = tableRef._('tr', {"filter":"applied"}); 
        var margin  = {top: 50, right: 20, bottom: 300, left: 40, leftY:30},
             width  = $(window).width() - 600 - margin.left - margin.right - margin.leftY,
             height = 700 - margin.top - margin.bottom;
        
        if(data.length == 0){
           $("#MainGraph").append("<p><br/>Your search did not match any profiles.</p>")
           return;
        }
        $("#MainGraphCanvas").css("width", width)

        var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);        
        var y = d3.scale.linear().range([height, 0]);
        var xAxis = d3.svg.axis().scale(x).orient("bottom");
        var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format("d"))

        var tip = d3.tip().attr('class', 'd3-tip').offset([-5, 0]).html(function(d) {
                    return "<strong>"+ d.name + ":</strong> <span style='color:brown'>" + d.count + "</span>";
                  })

        var svg = d3.select("#MainGraph").append("svg")
                    .attr("width", width + margin.left + margin.right + margin.leftY)
                    .attr("height", height + margin.top + margin.bottom).append("g")
                    .attr("transform", "translate(" + (margin.left + margin.leftY) + "," + margin.top + ")");

           svg.call(tip);

          
        var e = document.getElementById("PlotCategory");
        var Category = e.options[e.selectedIndex].text;
        var f = document.getElementById("PlotFeature");
        var Feature = f.options[f.selectedIndex].text;
        var g = document.getElementById("PlotGroup");
        var Group = g.options[g.selectedIndex].text;

  
     var Colmn, grpCol =-1;
  
        var selectedFieldarray = []
       $("#FilterDisease :checkbox:checked").each(function() 
       	{ selectedFieldarray.push($(this).val().split(";") ) });         // get all selected options within group
        selectedFieldarray = [].concat.apply([],selectedFieldarray)
        var filterDisease_String = selectedFieldarray.join("|");
selectedFieldarray = []
       $("#FilterYear :checkbox:checked").each(function() 
       	{ selectedFieldarray.push($(this).val().split(";") ) });         // get all selected options within group
        selectedFieldarray = [].concat.apply([],selectedFieldarray)
        var filterYear_String = selectedFieldarray.join("|");
selectedFieldarray = []
       $("#FilterInstitution :checkbox:checked").each(function() 
       	{ selectedFieldarray.push($(this).val().split(";") ) });         // get all selected options within group
        selectedFieldarray = [].concat.apply([],selectedFieldarray)
        var filterInst_String = selectedFieldarray.join("|");

// Members [ Index, Full.Name, Last.Name, First.Name, Degrees, Job.Title, Primary.Organization, Other..Practice..Affiliations., Department, Phone.Number, Email, Bio, Websites, Videos, Tumor.Type.s., Designation, Institutional.Affiliation, Focus.Areas, Member.Photos, FH.Primary, Departments.and.Divisions, Converis.ID, STTR.member, omicsField, specialty, keywords, PubList, GrantList, TrialList]
//Grants  [ Serial.Number,Project.Title,Tumor.Type.s.,Administering..IC,Application.ID,Project.Number,Type,Activity,IC,Support.Year,Suffix,Subproject.Number,Contact.PI..Person.ID,Contact.PI...Project.Leader,PI.Trim,MemberID,Other.PI.or.Project.Leader.s.,Organization.Name,ARRA.Indicator,FY,FY.Total.Cost,FY.Total.Cost...Sub.Projects.,FY.Total]
//trials [ Index,Inst, Title, PI, LocalPI, MemberID,	Phase,	Sponsor,	Sponsor Type,	Type,	Age,	Trial IDs,	Tumor Type],
//pubs [ Index,Author, MemberID, AuthorOrder, Authors, Title,	Citation,	Year,	PMID,	Tumor Type", "sWidth": '50px'}],
 
  var LookUpProfiles = [], uniqueFeatures = [], uniqueGroups = [], reqd = []
 
  if(Feature == "Members"){  
     if (Category == "Institute"){ 
       Colmn = 6; $("#FilterInstitution :checkbox:checked").each(function() {  reqd.push($(this).val()) })}
     else if (Category == "DiseaseType"){
       Colmn = 14; $("#FilterDisease :checkbox:checked").each(function() {  reqd.push($(this).val()) })}
       
     if(Group == "Degrees"){         grpCol = 4}   
     else if(Group == "Department"){ grpCol = 8}   
     else if(Group == "Institute"){  grpCol = 6}   
    
    plotTables = generateBarplotArray(data, Colmn, grpCol, 0, reqd)
    LookUpProfiles = plotTables[0], uniqueFeatures = plotTables[1], uniqueGroups = plotTables[2]
    
   } else if(Feature ==  "Publications"){
         
     pubRef.fnFilter(filterDisease_String, 9, true, false);    
     pubRef.fnFilter(filterYear_String, 7, true, false);    
     var pubs = pubRef._('tr', {"filter":"applied"}); 
     pubRef.fnFilter("", 9);    
     pubRef.fnFilter("", 7);    

     if(Group == "Year"){              grpCol = 7}   
     else if(Group == "Author Order"){ grpCol = 3}   
     else if(Group == "Institute"){  grpCol = 10}   

     if      (Category == "Institute")  {Colmn = 10; $("#FilterInstitution :checkbox:checked").each(function() {  reqd.push($(this).val()) })} 
     else if (Category == "DiseaseType"){Colmn = 9;  $("#FilterDisease :checkbox:checked").each(function() {      reqd.push($(this).val()) })}
 
    plotTables = generateBarplotArray(pubs, Colmn, grpCol, 2, reqd)
    LookUpProfiles = plotTables[0], uniqueFeatures = plotTables[1], uniqueGroups = plotTables[2]

   } else if(Feature ==  "Grants"){
         
     grantRef.fnFilter(filterDisease_String, 2, true, false);    
     grantRef.fnFilter(filterYear_String, 19, true, false);    
     var grants = grantRef._('tr', {"filter":"applied"}); 
     grantRef.fnFilter("", 2);    
     grantRef.fnFilter("", 19);    
         
     if (Category == "Institute"){ Colmn = 17; $("#FilterInstitution :checkbox:checked").each(function() {       reqd.push($(this).val()) })}
     else if (Category == "DiseaseType"){    Colmn = 2; $("#FilterDisease :checkbox:checked").each(function() {  reqd.push($(this).val()) })}
        
     if(Group == "Year"){          grpCol = 19}   
     else if(Group == "Activity"){ grpCol = 7}   
     else if(Group == "Sponsor"){  grpCol = 3}   
     else if(Group == "Institute"){grpCol = 17}   
    
    plotTables = generateBarplotArray(grants, Colmn, grpCol, 15, reqd)
    LookUpProfiles = plotTables[0], uniqueFeatures = plotTables[1], uniqueGroups = plotTables[2]

   } else if(Feature ==  "Trials"){
         
     trialRef.fnFilter(filterDisease_String, 12, true, false);    
     var trials = trialRef._('tr', {"filter":"applied"}); 
     trialRef.fnFilter("", 12);    

     if      (Category == "Institute"){  Colmn = 1;  $("#FilterInstitution :checkbox:checked").each(function() {  reqd.push($(this).val()) })} 
     else if (Category == "DiseaseType"){Colmn = 12; $("#FilterDisease :checkbox:checked").each(function() {      reqd.push($(this).val()) })} 
   
     if(Group == "Phase"){         grpCol = 6}   
     else if(Group == "Sponsor"){  grpCol = 7}   
     else if(Group == "Institute"){  grpCol = 1}   
     
    plotTables = generateBarplotArray(trials, Colmn, grpCol, 5, reqd)         
    LookUpProfiles = plotTables[0], uniqueFeatures = plotTables[1], uniqueGroups = plotTables[2]

   }
  
   var color = d3.scale.ordinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
   color.domain(uniqueGroups);
  
   if(uniqueFeatures.length == 0){
        d3.select("#MainGraph").select("svg").remove();
        $("#MainGraph")[0].innerHTML = "";
        $("#VizSubtitle")[0].innerHTML = "";
        return;
       }        


  uniqueFeatures.forEach(function(d) {
    var y0 = 0;
    LookUpProfiles[d].yGroup = color.domain().map(function(name) { 
       if(typeof LookUpProfiles[d][name] !== "undefined") 
             return {name: name, y0: y0, y1: y0 += +LookUpProfiles[d][name], count:+LookUpProfiles[d][name], Index: LookUpProfiles[d].groups[name] };
       return {name: name, y0: y0, y1: y0 += 0, count:0, Index: LookUpProfiles[d].groups[name]};   });
    LookUpProfiles[d].total = LookUpProfiles[d].yGroup[LookUpProfiles[d].yGroup.length - 1].y1;
  }); 
        
  if(document.getElementById("fil_NA").checked){ uniqueFeatures = uniqueFeatures.filter(function(d) { return d != "not reported" }) }
  uniqueFeatures.sort()

          $("#VizSubtitle").append("<span style='color:brown; text-align:right'>Note: Multiple memberships are duplicated among groups</span")    
    
//        if(TooSmall.length){
//
//          $("#VizAddendum").append("<div style='color:brown; text-align:center;font-size:1.3em;'>Categories with < 3 hits: <br/></div>")
//          $("#VizAddendum").append("<span id='SmallCategories' style='color:brown'></span>")
//            for(var j=0;j<TooSmall.length;j++){
//               $("#SmallCategories").append("<span class='smallCategory ActiveWords' style='cursor:pointer'>" + TooSmall[j].Name + "</span><br/>") 
//            }
//        }
//        $(".smallCategory").click(function(){
//          toggleWaitCursor()
//          ShowPlotProfiles(LookUpProfiles[this.innerHTML])})

         var maxFreq = d3.max(uniqueFeatures, function(d){return LookUpProfiles[d].total});

           x.domain(uniqueFeatures)
           y.domain([0, maxFreq]);

           var legend = svg.selectAll('.legend')
                            .data(color.domain().slice())
                            .enter()
                            .append('g')
                            .attr('class', 'legend')
                            .attr('transform', function(d, i) {
//                               return 'translate(' + (width/2+i*100-100) + ',-40)';
                               return 'translate(' + ((i%3)*175) + ','+(-60+20*(Math.floor(i/3)+1))+')';
                            });
           legend.append('rect')
                 .attr('width', 10)
                 .attr('height', 10)
                 .style('fill', function(d){ return color(d)})
                 .style('stroke', function(d){ return color(d)});

           legend.append('text')
                 .attr('x', 12)
                 .attr('y', 10)
                 .text(function(d) { return d; });

           svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + (height+20*(Math.floor(uniqueGroups.length/3)+1)) + ")")
              .call(xAxis)
              .selectAll("text")  
                 .style("text-anchor", "end")
                 .attr("dx", "-.8em")
                 .attr("dy", ".15em")
                 .attr("transform", function(d) {
                    return "rotate(-65)" 
                  });;

           svg.append("g")
              .attr("class", "y axis")
              .attr("transform", "translate(0," + (20*(Math.floor(uniqueGroups.length/3)+1)) + ")")
              .call(yAxis)
              .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", -1*margin.leftY)
              .attr("x", -1*(height-margin.top)/2 )
              .attr("dy", "-.71em")
              .style("text-anchor", "end")
              .text("counts");

   var Ygroups = svg.selectAll(".bar")
      .data(uniqueFeatures)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x(LookUpProfiles[d].Name) + ","+(20*(Math.floor(uniqueGroups.length/3)+1))+")"; });

  Ygroups.selectAll("rect")
      .data(function(d) { return LookUpProfiles[d].yGroup; })
    .enter().append("rect")
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.y1); })
      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
      .style("fill", function(d) { return color(d.name); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .on('mouseup', function(d){ ShowPlotProfiles(d)})
      .on('mousedown', function(){ $('body').toggleClass('wait');})
;



} //end drawBarplot
//----------------------------------------------------------------------------------------------------	
  function exportResults(){

        if(activeContent == "SearchSpan"){
           sendProfilesToPDF()
        } else {
           var canvas = document.getElementById('MainGraphCanvas');
           var content = $('#MainGraph').html().trim();
           canvg(canvas,content);      // Draw svg on canvas
           var theImage = canvas.toDataURL('image/jpg');      // Change img to SVG representation
           
           sendImageToPDF(theImage, canvas.clientWidth, canvas.clientHeight);
           sendTableToCSV(content)
        }
  }	
  
  //----------------------------------------------------------------------------------------------------
  function CSV(array) {
    // Use first element to choose the keys and the order
    var keys = [];
    for (var k in array[0]) keys.push(k);

    // Build header
    var result = keys.join(",") + "\n";

    // Add the rows
    array.forEach(function(obj){
        keys.forEach(function(k, ix){
            if (ix) result += ",";
            result += obj[k];
        });
        result += "\n";
    });

    return result;
}

  //----------------------------------------------------------------------------------------------------
  function sendTableToCSV(content){
 
     var data = CSV(graphResults)
     var csvContent = "data:text/csv;charset=utf-8," +  data;
  
     var encodedUri = encodeURI(csvContent);
//     window.open(encodedUri);
     
     var link = document.createElement("a");
     link.setAttribute("href", encodedUri);
     link.setAttribute("download", "STTRconnect.csv");
     link.click();
  }
 //----------------------------------------------------------------------------------------------------
  function sendImageToPDF(ImageURL, w, h){

     //----------------------------------------------------------------------------------------------------
       var centeredText = function(text, y) {
                 var textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                 var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
                 doc.text(textOffset, y, text);
            }
     //----------------------------------------------------------------------------------------------------
       var getImageFromUrl = function(url, callback) {
	         var img = new Image();
             img.onError = function() {
                alert('Cannot load image: "'+url+'"');
             };
             img.onload = function() {
                callback(img);
             };
             img.src = url;
         }
     //----------------------------------------------------------------------------------------------------
       var createPDF = function(imgData) {         
            var ImgWidth = w/96; var ImgHeight = h/96;
            var scaleFactor = 1
            if(ImgWidth > 7.5){ 
              scaleFactor= 7.5/ImgWidth;
              ImgWidth *= scaleFactor
              ImgHeight *= scaleFactor }

             doc.addImage(imgData, 'JPEG',0.3, 1.3, ImgWidth, ImgHeight); 
             doc.save('STTRconnect.pdf');
	     };

    var doc = new jsPDF('p','in'), size= 12, verticalOffset = 0.8; 
        doc.setFontSize(34);
        doc.setTextColor(96,168,250)   // light blue color
        doc.setFontType("bold");
        centeredText("STTRconnect.org", 0.8)  //add title
        
        doc.setFontType("normal");     doc.setFontSize(size);
        doc.setLineWidth(0.05);
        doc.line( 0.5,0.9, 8,0.9); // horizontal line

        var innerText = $("#ReportSearchFilterDiv")[0].innerHTML.replace(/<.+?>/g,"").replace(/\r|\n/g,"").replace(/\s+/g," ")

        lines = doc.splitTextToSize(innerText, 7.5)
		doc.text(0.5, verticalOffset+0.1 + size / 72, lines)
		verticalOffset += (lines.length + 0.5 ) * size / 72
        doc.setTextColor(0,0,0);  
        doc.setLineWidth(0);
        
        getImageFromUrl(ImageURL, createPDF);

  } // end export Results
  
//----------------------------------------------------------------------------------------------------
	function sendProfilesToPDF(){
	
          var rows = tableRef._('tr', {"filter":"applied"});   
          var doc = new jsPDF('p','in'), 
          size = 12, lines, verticalOffset = 0.8; // inches on a 8.5 x 11 inch sheet.

           //----------------------------------------------------------------------------------------------------
            var centeredText = function(text, y) {
                 var textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                 var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
                 doc.text(textOffset, y, text);
            }
            //----------------------------------------------------------------------------------------------------
            function addPDFcontent(content){
                 
               lines = doc.splitTextToSize(content, 7.5)
		       var testOffset = verticalOffset + (lines.length *1.15) * size / 72
               if (testOffset >= 11){
                   doc.addPage();
                   verticalOffset = 0.5 // Restart height position
               }

		       doc.text(0.5, verticalOffset + size / 72, lines)
		       verticalOffset += (lines.length *1.15) * size / 72
            }
           //----------------------------------------------------------------------------------------------------

         doc.setFontSize(34); doc.setTextColor(96,168,250)
         doc.setFontType("bold");
         centeredText("STTRconnect.org", 0.8)

         doc.setFontType("normal");   doc.setFontSize(size);
         doc.setLineWidth(0.05);
         doc.line( 0.5,0.9, 8,0.9); // horizontal line

        var innerText = $("#ReportSearchFilterDiv")[0].innerHTML.replace(/<.+?>/g,"").replace(/\r|\n/g,"").replace(/\s+/g," ")
         lines = doc.splitTextToSize(innerText, 7.5)
		 doc.text(0.5, verticalOffset+0.1 + size / 72, lines)
		 verticalOffset += (lines.length + 0.5 ) * size / 72
         doc.setTextColor(0,0,0); 
             
         for(var i=0; i < rows.length; i++){   // then reveals ones that haven't been filtered
            var RowIdx = rows[i][0]
 
            var Name = rows[i][3] + " " + rows[i][2] + ", " + rows[i][4]
            var email = rows[i][21]
            var Title = rows[i][5] + ", " + rows[i][6]
            var Bio = rows[i][22].replace(/@/g,"\r\n")
            var AddtlPos   = ""
            var ContactFor = ""
            var Disease    = ""
            var Omics      = ""

            if($("#Profile_"+RowIdx)[0].className.match("ProfileNotYetLoaded")){
               var addtlPos = [8,11,14,17];
               var AddedPos = ""
               for(var j=0; j<addtlPos.length; j++){
                 if(rows[0][addtlPos[j]] != "" & rows[0][addtlPos[j]] != "NA"){
                    AddedPos = AddedPos + rows[0][addtlPos[j]] + ", " + rows[0][addtlPos[j]+1] + ": " + rows[0][addtlPos[j]+2] + ";"
                 }           
               }
               AddtlPos = AddedPos
 
               if(rows[0][25] !== "" & rows[0][25] !== "NA"){ Disease =  rows[0][25].replace(/#/g,"") }
               if(rows[0][41] !== "" & rows[0][41] !== "NA"){ Omics = rows[0][41] }   
               if(rows[0][45] !== "" & rows[0][45] !== "NA"){ ContactFor = rows[0][45]}
           }else{
                AddtlPos   = $("#Profile_"+RowIdx+"_addtlPos")[0].innerHTML.replace(/<.+?>/g,"").replace(/[\r|\n]$/,"")
                ContactFor = $("#Profile_"+RowIdx+"_ContactFor")[0].innerHTML.replace(/<.+?>/g,"").replace(/\r|\n/g,"")
                Disease    = $("#Profile_"+RowIdx+"_Disease")[0].innerHTML.replace(/<.+?>/g,"").replace(/\r|\n/g,"").replace(/; $/,"")
                Omics      = $("#Profile_"+RowIdx+"_Omics")[0].innerHTML.replace(/<.+?>/g,"").replace(/\r|\n/g,"").replace(/; $/,"")
           }
                      
            verticalOffset += 0.2
            doc.setFontType("bold");   addPDFcontent(Name)
            doc.setFontType("normal"); addPDFcontent(email)
            doc.setFontType("italic"); addPDFcontent(Title)
            if(AddtlPos != ""){
               AddtlPos = AddtlPos.replace(/Additional Positions [\r\n]*/, "")
                addPDFcontent(AddtlPos)
            }

           doc.setFontType("normal"); doc.setTextColor(150);
           var previousText = false; var CategoryText = ""
            if(ContactFor != ""){
               CategoryText = ContactFor.replace(/Contact for /, "").replace(/; $/,"")
               previousText = true;
            }
            if(Disease != ""){  
               Disease = Disease.replace(/Disease type /, "").replace(/&amp;/g, "&")
               if(previousText) Disease = " / " + Disease
               CategoryText  = CategoryText + Disease
               previousText = true;
            }if(Omics != ""){  
               Omics = Omics.replace(/Computational field /, "")
               if(previousText) Omics = " / " + Omics
               CategoryText  = CategoryText + Omics
            }
           if(CategoryText != "")
               addPDFcontent(CategoryText)

           doc.setFontType("normal"); doc.setTextColor(0,0,0);
            verticalOffset += 0.1
           addPDFcontent(Bio)

        }  
       doc.save('STTRconnect.pdf');
    }
