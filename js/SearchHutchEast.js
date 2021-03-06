var tableRef;
var activeContent = "SearchSpan";
//DataTable columns: LastName:2, FirstName:3, Degree:4, Job Title, Organization Dept
//Inst: 6 
//Field: 25 (Organ Site) 41 (omics) 
//Focus: 28, 42-45: specialty, keywords, software, contact
//Picture: 31
//Bio: 22
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
	
    var ColumnTitle = [ {"sTitle": "Index", "sWidth": '50px'},{"sTitle": "Project Title", "sWidth": '50px'}, {"sTitle": "Tumor Type", "sWidth": '50px'}, {"sTitle": "Administering  IC", "sWidth": '50px'}, {"sTitle": "Application ID", "sWidth": '50px'}, {"sTitle": "Project Number", "sWidth": '50px'}, {"sTitle": "Type", "sWidth": '50px'}, {"sTitle": "Activity", "sWidth": '50px'}, {"sTitle": "IC", "sWidth": '50px'}, {"sTitle": "Support Year", "sWidth": '50px'}, {"sTitle": "Suffix", "sWidth": '50px'}, {"sTitle": "Subproject Number ", "sWidth": '50px'}, {"sTitle": "Contact PI  Person ID", "sWidth": '50px'}, {"sTitle": "Project Leader", "sWidth": '50px'}, {"sTitle": "PI Trim", "sWidth": '50px'}, {"sTitle": "MemberID", "sWidth": '50px'}, {"sTitle": "Other PI or Project Leader(s)", "sWidth": '50px'}, {"sTitle": "Organization Name", "sWidth": '50px'}, {"sTitle": "ARRA Indicator", "sWidth": '50px'}, {"sTitle": "FY", "sWidth": '50px'}, {"sTitle": "FY Total Cost ", "sWidth": '50px'}, {"sTitle": "FY Total Cost  (Sub Projects)", "sWidth": '50px'}, {"sTitle": "FY Total", "sWidth": '50px'}]

 		 $("#DataTable").dataTable({
       		  "aoColumns": ColumnTitle,
         })   // dataTable
         .fnAdjustColumnSizing(); 
         ;


 	tableRef = $("#DataTable").dataTable();

	d3.json("data/HutchEast/HutchEast_GrantDescriptionProjNum_7-8-15_json.txt", function(json){

		 var DataTable=json
		 tableRef.fnAddData(DataTable);
         tableRef.fnSort([2, "asc"])  //move non-STTR or survey people to end
         var rows = tableRef._('tr', {"filter":"applied"})
         var uniqueIDs = uniqueArray(rows.map(function(value,index) { return value[0]; }))
 
        document.getElementById("NumberOfResultsDiv").innerHTML = uniqueIDs.length
        document.getElementById("SearchStringDiv").innerHTML = "(all HutchEast)";

        createProfileContainerFromTable();  //loads divs for each of the RowIdx, but not any data (set class to ProfileNotYetLoaded)
        resetPagingSystem()         //checks if profiles being show are in class ProfileNotYetLoaded and calls function

        // only called once to generate profiles - id set as "Profile_"+idx where idx = row[][0]

	});  //end json


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
           elem.className = elem.className.replace("toExpand", "toContract");
     } else {
        content.className= content.className.replace("showContent", "hideContent");
           elem.className = elem.className.replace("toContract","toExpand");
     } ;
  };

 //----------------------------------------------------------------------------------------------------	
 // respond to SideNav selections for filtering
	function toggle_selection(group){
	
        if(group == "fil_inst"){
           tableRef.fnFilter("", 17);  
           Filter_Selection("FilterInstitution", "ReportInstFilterSpan",17, "<i> from </i>")
        } else if(group == "fil_disease"){        
           tableRef.fnFilter("", 2); 
           Filter_Selection("FilterDisease", "ReportDiseaseFilterSpan",2, "<i> researching </i>")
        }    updateActiveContent();
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
      tableRef.fnFilter("", 17);  // clear Inst filter
      tableRef.fnFilter("", 2); // clear field filter

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
        
        Filter_Selection("FilterInstitution", "ReportInstFilterSpan",17, "<i> from </i>")
        Filter_Selection("FilterDisease", "ReportDiseaseFilterSpan",2, "<i> specializing in </i>")
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
                $("#edit_institution").val(row[0][17])
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
         toggleContent(elem, elem.parentNode.children[4])
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
        + "<div style='text-align:center; font-size:1.3em'><strong>"+ IndexArray.count+" results for "+IndexArray.Name+"</strong><br/></div></div>");

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
           tableRef.fnFilter(FilterString, 0, true, false); //searches index column for Profile Index
           var row = tableRef._('tr', {"filter":"applied"});   
           tableRef.fnFilter("",0)
           
         var Name =  row[0][7]+ " " + row[0][3] ;
          if(row[0][2] !== ""){ Name= Name.concat(", " + row[0][2]); }
         var Title = "";
           if(row[0][1] !== ""){ Title = "<b>"+row[0][1] + "</b>"}
         var Org = "";
           if(row[0][17] !== ""){ Org = row[0][17] }
         var PI = "";
           if(row[0][14] !== ""){ PI = row[0][14] }
 
         var FYcost = "";
         row = row.sort(function (a, b) {
              return a[19] < b[19] ? -1 : a[19] > b[19] ? 1 : 0;
           });

         for(var i=0;i<row.length; i++){
          FYcost = FYcost + "; "
           if(row[i][19] !== ""){ FYcost = FYcost + row[i][19] }
            if(row[i][22] !== ""){ FYcost = FYcost + ": $" + row[i][22] }
        }
       FYcost = FYcost.replace(/^;/,"")

          $("#Profile_"+RowIdx).append(
              "<div id=Profile_"+RowIdx+"_toggleContent onclick='FullProfile(this)' class='toggleProfileContent toExpand'>&gt;</div>"
            + "<div id=Profile_"+RowIdx+"_Info    >"+ Title +"<br>"+PI+"<br>"+Org+ "<br>"+Name+ " ("+FYcost+") </div>"
          )
     
        
          
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
                    return "<strong>"+ d.Name + ":</strong> <span style='color:brown'>" + d.count + "</span>";
                  })

        var svg = d3.select("#MainGraph").append("svg")
                    .attr("width", width + margin.left + margin.right + margin.leftY)
                    .attr("height", height + margin.top + margin.bottom).append("g")
                    .attr("transform", "translate(" + (margin.left + margin.leftY) + "," + margin.top + ")");

           svg.call(tip);

          
        var e = document.getElementById("PlotFeature");
        var Feature = e.options[e.selectedIndex].text;
        var values = [], reqd = [], LookUpProfiles = []
  
     var Colmn;
    if(Feature == "keywords"){ Colmn = 49 }
    else if (Feature == "Institute"){ 
       Colmn = 17; $("#FilterInstitution :checkbox:checked").each(function() {  reqd.push($(this).val()) })}
     else if (Feature == "DiseaseType"){
       Colmn = 2; $("#FilterDisease :checkbox:checked").each(function() {  reqd.push($(this).val()) })}
  
    var seenIndices = []
          for(var row=0;row<data.length; row++){
            if(seenIndices.indexOf(data[row][0]) !== -1) continue;
            seenIndices.push(data[row][0])
            
            var featType = data[row][Colmn]
            if(featType == "" |  featType == "NA") featType = "not reported"
            var featArray = uniqueArray(featType.split(";").clean(""))
            if(featArray.length){
             values= values.concat(featArray)  
              for(var j =0;j<featArray.length;j++){
                 if (typeof LookUpProfiles[featArray[j]] === "undefined") {          // not found
                               LookUpProfiles[featArray[j]] ={Name: featArray[j], count: 1, Index: [data[row][0]]}   // add Field name and populate array of indices
                        } else {  // Field already defined
                               LookUpProfiles[featArray[j]].count += 1
                               LookUpProfiles[featArray[j]].Index.push( data[row][0])
                        } 
              }
            }
         }
      
        var groups = getCounts(values, reqd)
        var TooSmall = groups.filter(function(d){ return reqd.indexOf(d.Name) == -1 & d.count <=2 })
        groups = groups.filter(function(d){ return reqd.indexOf(d.Name) != -1 | d.count >2 })
        groups.sort(ascending_groupName )
        
        if(TooSmall.length){
          $("#VizSubtitle").append("<span style='color:brown; text-align:right'>*Categories with < 3 hits listed below graph</span")
          $("#VizAddendum").append("<div style='color:brown; text-align:center;font-size:1.3em;'>Categories with < 3 hits: <br/></div>")
          $("#VizAddendum").append("<span id='SmallCategories' style='color:brown'></span>")
            for(var j=0;j<TooSmall.length;j++){
               $("#SmallCategories").append("<span class='smallCategory ActiveWords' style='cursor:pointer'>" + TooSmall[j].Name + "</span><br/>") 
            }
        }
        $(".smallCategory").click(function(){
          toggleWaitCursor()
          ShowPlotProfiles(LookUpProfiles[this.innerHTML])})

       if(groups.length == 0){
        d3.select("#MainGraph").select("svg").remove();
        $("#MainGraph")[0].innerHTML = "";
        $("#VizSubtitle")[0].innerHTML = "";
        return;
       }        
         var maxFreq = d3.max(groups, function(d){return d.count});

           x.domain(groups.map(function(d) { return d.Name; }))
           y.domain([0, maxFreq]);

           var legend = svg.selectAll('.legend')
                            .data([{Name:"Filtered by", color:"lightblue"},{Name: "Additional", color:"steelblue"}])
                            .enter()
                            .append('g')
                            .attr('class', 'legend')
                            .attr('transform', function(d, i) {
                               return 'translate(' + (width/2+i*100-100) + ',-40)';
                            });
           legend.append('rect')
                 .attr('width', 10)
                 .attr('height', 10)
                 .style('fill', function(d){ return d.color})
                 .style('stroke', function(d){ return d.color});

           legend.append('text')
                 .attr('x', 12)
                 .attr('y', 10)
                 .text(function(d) { return d.Name; });

           svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
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
              .call(yAxis)
              .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", -1*margin.leftY)
              .attr("x", -1*(height-margin.top)/2)
              .attr("dy", "-.71em")
              .style("text-anchor", "end")
              .text("counts");

           svg.selectAll(".bar")
              .data(groups)
              .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d.Name); })
              .attr("width", x.rangeBand())
              .attr("y", function(d) { return y(d.count); })
              .attr("height", function(d) { return height - y(d.count); })
              .attr("fill", function(d){ 
                 if(reqd.indexOf(d.Name) != -1){ 
                   return "lightblue"}
                 return "steelblue";
                })
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide)
              .on('mouseup', function(d){ ShowPlotProfiles(LookUpProfiles[d.Name])})
              .on('mousedown', function(){ $('body').toggleClass('wait');})

     function type(d) {
          d.count = +d.count;
          return d;
       }

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
        }
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
