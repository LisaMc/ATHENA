var tableRef;
var GoogleMap;
var MarkerHash;
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
 
        $('html, body').animate({
            scrollTop: $("#"+elem).offset().top - 105 - $("#DisplaySettingsDiv").height() - 15 //header offset by 105px + ReportFilter text -10 for padding - defined in css
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
 //    $("#DisplaySettingsDiv").css("width", $("#DataToExport").width())
     $("#DisplaySettingsDiv").css("width", $("#SEARCHdiv").width()+ 5)
     $("#DataToExport").css("top",  $("#DisplaySettingsDiv").height() + 10)
}


//----------------------------------------------------------------------------------------------------
// resize side frames based on window height and header/footer position of scroll
   window.onresize = function() { 
      checkOffset(); 
      if(activeContent !== "SearchSpan" && activeContent !== "googleMap") updateActiveContent();
      if(typeof GoogleMap !== "undefined"){
        google.maps.event.trigger(GoogleMap, "resize");
        GoogleMap.setCenter(GoogleMap.getCenter()); 
      }
   };	
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
	
    var ColumnTitle = [ {"sTitle": "Index", "sWidth": '50px'}, {"sTitle": "Cancer Type", "sWidth": '50px'}, {"sTitle": "Resource Type", "sWidth": '50px'}, {"sTitle": "Resource", "sWidth": '50px'}, {"sTitle": "Resource Description", "sWidth": '50px'}, {"sTitle": "Resource Organization", "sWidth": '50px'}, {"sTitle": "Resource Link", "sWidth": '50px'}, {"sTitle": "Organization Phone Number", "sWidth": '50px'}, {"sTitle": "Email", "sWidth": '50px'}, {"sTitle": "City/County", "sWidth": '50px'}, {"sTitle": "Address", "sWidth": '50px'}, {"sTitle": "Cost", "sWidth": '50px'}, {"sTitle": "Location", "sWidth": '50px'}, {"sTitle": "Latitude", "sWidth": '50px'}, {"sTitle": "Longitude", "sWidth": '50px'}, {"sTitle": "Comment", "sWidth": '50px'}, {"sTitle": "Questionable", "sWidth": '50px'}]
//"Index", "Cancer Type", "Resource Type", "Resource", "Resource Description", "Resource Organization", "Resource Link", "Organization Phone Number", "Email", "City/County", "Address", "Cost"										
 		 $("#DataTable").dataTable({
       		  "aoColumns": ColumnTitle,
         })   // dataTable
         .fnAdjustColumnSizing(); 
         ;


 	tableRef = $("#DataTable").dataTable();

	d3.json("data/All_Cancer_Patient_Resources_6-8-15_json.txt", function(json){

		 var DataTable=json
		 tableRef.fnAddData(DataTable);
         tableRef.fnSort([3, "asc"])  // sort by resource name

        document.getElementById("NumberOfResultsDiv").innerHTML = tableRef._('tr', {"filter":"applied"}).length
        document.getElementById("SearchStringDiv").innerHTML = "(National/WWAMI Resources)";

        createProfileContainerFromTable();  //loads divs for each of the RowIdx, but not any data (set class to ProfileNotYetLoaded)
        resetPagingSystem()         //checks if profiles being show are in class ProfileNotYetLoaded and calls function
        drawGoogleMap()

        // only called once to generate profiles - id set as "Profile_"+idx where idx = row[][0]

	});  //end json


   	$(".toExpand").click(function(){toggleContent(this, this.parentNode) })
    $(".toContract").click(function(){toggleContent(this, this.parentNode) })
    // toggle short vs long profile view - parentNode references Profile_idx
     		
    $(".PopularSearch").click(function(){
        var SearchTerms = this.innerHTML
//        if(SearchTerms.match("Yoga")) { SearchTerms = "Yoga" }
        if(SearchTerms.match("Nutrition")){SearchTerms = "Nutrition Diet Supplements Eat Food Meals Groceries"}
        else if(SearchTerms.match("Summer Activities")){SearchTerms = "Yoga Camp Hike Hiking Walk fishing outdoor garden kayak climb"}
        else if(SearchTerms.match("College Scholarships")){SearchTerms = "College Collegiate academic \"Educational scholarship\" \"scholarship program\""}
        
        else{SearchTerms = "\""+SearchTerms+"\""}
//        SearchTerms = "\""+SearchTerms+"\""
        document.getElementById("QueryFreeInput").value = SearchTerms;
        $(".toClear").each(function(){ 
          var tes2 = this
          clearSelection(this, this.parentNode) })
        SearchAndFilterResults()
        updateActiveContent();

      })
     // run canned search based on query text
    
        $("#SearchSpan").click(function(){            
             if( document.getElementById("ProfileResults") == null)
                SearchAndFilterResults()
             toggle_visibility("SearchSpan", "SEARCHdiv");          });
        $("#ProfileSpan").click(function(){ 
             toggle_visibility("ProfileSpan", "PROFILEdiv");        });
        $(".ListSpan").click(function(){ 
             toggle_visibility("SearchSpan", "SEARCHdiv");                 });
        $(".Disclaimer").click(function(){ 
             toggle_visibility("Disclaimer", "DISCLAIMERdiv");                 });
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

//    $(".mapPlot").click(function(){  toggle_visibility("map", "VISUALIZEdiv") })
//    $(".googleMap").click(function(){  toggle_visibility("googleMap", "VISUALIZEdiv") })
    
    $("#userLocation").keydown(function(){ $('#currentLocationCheckbox')[0].checked = false; })
    $("#locate").click(function(){  searchByLocation() })
	$('#currentLocationCheckbox').click(function(){  useCurrentLocation(); });	
     $('#zoom').multiselect({maxHeight:200, buttonWidth: '150px', nonSelectedText: 'Zoom Level'});

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
     FreeForm.onkeyup = function(e) {
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
           tableRef.fnSort([3, "desc"])  //sort by resource name
        }else {
           elem.children[0].className = elem.children[0].className.replace("glyphicon-arrow-up", "glyphicon-arrow-down")
           elem.children[0].className = elem.children[0].className.replace("sortDescending", "sortAscending")
           tableRef.fnSort([3, "asc"])  //sort by resource name
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
         if(activeContent == "list"){
           activeContent = "SearchSpan"
           toggle_visibility("SearchSpan", "SEARCHdiv");
         } else if (activeContent == "map"){
           toggle_visibility("map", "VISUALIZEdiv")
         } else if (activeContent == "googleMap"){
           toggle_visibility("googleMap", "VISUALIZEdiv")
         } else if (activeContent == "barplot"){
           toggle_visibility("barplot", "VISUALIZEdiv")
         }        
  }	
//----------------------------------------------------------------------------------------------------
    function updateActiveContent(){

        document.getElementById("NumberOfResultsDiv").innerHTML =  tableRef._('tr', {"filter":"applied"}).length
      if(activeContent != "ProfileSpan" & activeContent != "Disclaimer"){
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

          $("#DisplaySettings").text("list")
//          document.getElementById("selectedDisplayProfiles").className = "selectedDisplay"
          getProfilesFromTable();
          resetPagingSystem();
          drawGoogleMap()

        }
        
        else if (activeContent == "Disclaimer"){
           $("#SearchDisplayOptions")[0].style.display = "none"
           $("#ReportSearchFilterDiv")[0].style.display = "none"
           $("#ReturnToSearch")[0].style.display = "block"

//          $("#DisplaySettings").text("Disclaimer")
//          document.getElementById("selectedDisplayDisclaimer").className = "selectedDisplay"
            
        }
           
        checkOffset(); 
    }

 //----------------------------------------------------------------------------------------------------	
 // Expand and Contract Profile views 
  function toggleContent(elem, content){
               
     if(content.className.match("hideContentPtRes") != null){
        content.className = content.className.replace("hideContentPtRes", "showContent")
           elem.className = elem.className.replace("toExpand", "toContract");
     } else {
        content.className= content.className.replace("showContent", "hideContentPtRes");
           elem.className = elem.className.replace("toContract","toExpand");
     } ;
  };

 //----------------------------------------------------------------------------------------------------	
 // respond to SideNav selections for filtering
	function toggle_selection(group){
	
        if(group == "fil_location"){
           tableRef.fnFilter("", 12);  
           Filter_Selection("FilterLocation", "ReportLocationFilterSpan",12, "<i> from </i>")
        } else if(group == "fil_resource"){
           tableRef.fnFilter("", 2); 
           Filter_Selection("FilterResource", "ReportResourceFilterSpan",2, "<i> providing </i>")
        } else if(group == "fil_disease"){        
           tableRef.fnFilter("", 1); 
           Filter_Selection("FilterDisease", "ReportDiseaseFilterSpan",1, "<i> with cancer focus: </i>")
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
       	{ selectedFieldarray.push($(this).val().split(",") ) });         // get all selected options within group
        
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

      tableRef.fnFilter(filterString, null, true, false); //searches all columns (null) using RegEx (true) without smart filtering (false) [tries to allow words to match across a whole string, rather than in sequence]
   }
  //----------------------------------------------------------------------------------------------------
   function showAllRows() {
      
      tableRef.fnFilter("");
      tableRef.fnFilter("", 1);  // clear disease filter
      tableRef.fnFilter("", 2); // clear resource filter
      tableRef.fnFilter("", 12);  // clear location filter

      tableRef.fnDraw()
   }
  //----------------------------------------------------------------------------------------------------
   function SearchAndFilterResults(){
        var searchString = document.getElementById("QueryFreeInput").value
        var wordArray = searchString.match(/[\w.\-]+|"(?:\\"|[^"])+"/g)
        if(wordArray == null) wordArray = [""]
        
        wordArray.clean("")
        var i = wordArray.length;
        while(i--){  
           wordArray[i] = wordArray[i].replace(/"/g,"");
           wordArray[i] = "\\s+" + wordArray[i];
        }
        	// STILL NEED TO HANDLE: ANDs!!!
        
        showAllRows();
       
        if(wordArray.length == 0){
           document.getElementById("SearchStringDiv").innerHTML = "(National/WWAMI Resources)";
        }else{
           document.getElementById("SearchStringDiv").innerHTML = searchString;
           SearchTableByStrings(wordArray); 
        }  
        
//        Filter_Selection("FilterLocation", "ReportLocationFilterSpan",12, "<i> from </i>")
        Filter_Selection("FilterDisease", "ReportDiseaseFilterSpan",1, "<i> specializing in </i>")
        Filter_Selection("FilterResource", "ReportResourceFilterSpan",2, "<i> specializing in </i>")
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
           
     $('#edit_disease').multiselect({numberDisplayed: 3, maxHeight:200, buttonWidth: '250px'});
     $('#edit_resource').multiselect({numberDisplayed: 3, maxHeight:200, buttonWidth: '250px'});

          if(elem.id == ""){

                $("#edit_name").val("")
                $("#edit_organization").val("")
                $("#edit_website").val("")
                $("#edit_description").val("")
                $("#edit_phone").val("")
                $("#edit_email").val("")
                $("#edit_address").val("")
                var selectedDisease = $('#edit_disease option:selected');
                var selectedResource = $('#edit_resource option:selected');
           }
           else{
              var RowIdx = elem.id.match(/\d+/)[0]
              var FilterString = "^"+RowIdx+"$"
                  tableRef.fnFilter(FilterString, 0, true, false); //searches index column for Profile Index
              var row = tableRef._('tr', {"filter":"applied"});   
                $("#edit_name").val(row[0][3])
                $("#edit_organization").val(row[0][5])
                $("#edit_website").val(row[0][6])
                $("#edit_description").val(row[0][4])
                $("#edit_phone").val(row[0][7])
                $("#edit_email").val(row[0][8])
                $("#edit_address").val(row[0][10])
                $("#edit_disease").val(row[0][1])
                $("#edit_resource").val(row[0][2])
                $("#edit_cost").val(row[0][11])

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
           var ItemsPerPage = 10
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
           $('#SearchPageSelectionBottom .pagination').html(navigation_html);
           $('#SearchPageSelectionBottom .pagination .page:first').addClass('active');

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
          var show_per_page = 10
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
          $('#SearchPageSelectionBottom .pagination .active').removeClass('active')
          $('.page[longDesc=' + page_num + ']').addClass('active');
          
          $(".displayPageNumber").removeClass("displayPageNumber").addClass("hidePageNumber")
          var start = Math.max(Math.min(page_num-2, number_of_pages-5), 0)
          var end = Math.min(number_of_pages,start+5)
          for(var i=start; i<end;i++){
             $('.page[longDesc=' + i + ']').removeClass("hidePageNumber").addClass('displayPageNumber');
              
          }
          toggleWaitCursor()
          scrollView("DataToExport")

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
                
        $('#ProfileResults').html('')
        var ProfileResults = $("#ProfileResults")
      
        document.getElementById("NumberOfResultsDiv").innerHTML = rows.length
        
        if(rows.length == 0){
           ProfileResults.append("Sorry, your search did not match any resources.")
           return;
        }
        
         var ProfileContainers = ""
        for(var i=0; i < rows.length; i++){
          var RowIdx = rows[i][0]
          ProfileContainers += "<div id=Profile_"+RowIdx+ " class='ActiveProfileContent ProfileContainer ProfileNotYetLoaded'></div>"
        }
         ProfileResults.append(ProfileContainers)
    }
    
    //----------------------------------------------------------------------------------------------------
 function ShowPlotProfiles(IndexArray){

     $("#VizResults")[0].innerHTML = "";
     $("#VizResults").append("<div id='VizResultsHeader'><div id='scrollToTop' style='text-align:right;color:#60a8fa;font-size:0.9em; cursor:pointer'>back to top</div>"
        + "<div style='text-align:center; font-size:1.3em'><strong>"+ IndexArray.count+" results with "+IndexArray.Name+"</strong><br/></div></div>");

     getProfilesFromArray(IndexArray.Index)  //sets Index values to ProfileActive
     resetPagingSystem()                     // displays first set of profiles to 

     $("#SEARCHdiv").css("position", "absolute")
     $("#SEARCHdiv").css("top", $("#VizResults")[0].offsetTop + $("#VizResultsHeader")[0].offsetHeight)
     $("#SEARCHdiv")[0].style.display = "block"
     
     $("#VizResults").css("height",$("#SEARCHdiv")[0].clientHeight)

     toggleWaitCursor() 
//     scrollView("VizResults")
     $("#scrollToTop").click( function(){
        scrollView("DataToExport")
      })
  }

   //----------------------------------------------------------------------------------------------------        
    function createIndividualProfile(RowIdx){
//DataTable columns: LastName:2, FirstName:3, Degree:4, Job Title, Organization Dept
//Inst: 6 
//website: 23
//Field: 25 (Organ Site) 41 (omics) 
//Focus: 28, 42-45: specialty, keywords, software, contact
//Picture: 31
//Bio: 22
//sttr : 37

           var FilterString = "^"+RowIdx+"$";
           tableRef.fnFilter(FilterString, 0, true, false); //searches index column for Profile Index
           var row = tableRef._('tr', {"filter":"applied"});   
           tableRef.fnFilter("",0)
           
         var Name = "<b style='font-size:1.2em'>"+ row[0][3] + "</b>";
          var Organization = "", Contact="", website = "";
           if(row[0][5] !== ""){ Organization = row[0][5] + "<br>"}
           if(row[0][6] !== ""){  website = "<a style='color:#60a8fa; margin-right:10px' href='"+row[0][6] + "' target='_blank'>website</a>"} 
           if(row[0][7] !== "" & row[0][7] !== "NA"){ 
             phone = ArrayToStringSpan(row[0][7], ";", ["", "#"], ", ")
             phone = phone.replace(/, <\/span>$/,"</span>")
             Contact = Contact + phone + "<br/>";
           }

//           if(row[0][7] !== ""){ Contact = Contact + row[0][7] + "<br>"}
           if(row[0][8] !== "" & row[0][8].match(/@/) != null){ Contact = Contact + row[0][8] + "<br>"}
           if(row[0][10] !== ""){ 
              if(row[0][13] !== "" && row[0][14] !== ""){
                  Contact = Contact + "<a href='javascript:void(0)' onclick='locateMarker("+RowIdx+")'><b class='glyphicon glyphicon-map-marker' style='color:#60a8fa; font-size:0.75em; padding-right:3px'></b></a>"
                                                    + "<span style='width:50px'>" + row[0][10] + "</span><br>"
              } else{ Contact = Contact + "<span style='width:50px'>" + row[0][10] + "</span><br>"        }
              
            }
          $("#Profile_"+RowIdx).append(
              "<div class='ResourceMainInfo'>"
            + "<div id=Profile_"+RowIdx+"_Name         >"+Name + "</div>"
            + "<div class>"+Organization+"</div>"
            + "<div id=Profile_"+RowIdx+"_Description  style='margin-top:5px'></div></div>"
            + "<div id=Profile_"+RowIdx+"_Info         class='ResourceContact'>"+ website +"<br/>"+Contact+"</div>"
             )
     
          var Desc = ""
          if(row[0][4] !== "" & row[0][4] !== "NA"){
             Desc = row[0][4].replace(new RegExp('@', 'g'), "<br>") + "<br>";}
           $("#Profile_"+RowIdx+"_Description").append(Desc)
           $("#Profile_"+RowIdx+"_Description").append("<div id=Profile_"+RowIdx+"_Category     style='clear:both;'></div>")

         if(row[0][1] !== "" & row[0][1] !== "NA"){ 
             var Disease = "<text style='text-decoration:underline; padding-right:1px'>(focus:</text>"
             Disease = Disease+ ArrayToStringSpan(row[0][1].replace(/#/g,""), ",", ["", "#"], ", ")
             Disease = Disease.replace(/, <\/span>$/,"</span>")
             $("#Profile_"+RowIdx+"_Category").append(Disease)
          }
          if(row[0][2] !== "" & row[0][2] !== "NA"){ 
             var Resource = "<text style='padding-left:5px;padding-right:1px; text-decoration:underline'>type:</text>"
             Resource = Resource + ArrayToStringSpan(row[0][2], /\/\s*/, ["", "#"], ", ") 
             Resource = Resource.replace(/, <\/span>$/,"</span>")
             $("#Profile_"+RowIdx+"_Category").append(Resource + ")<br>")
          }
          
            
        
          
      } // createProfilesFromTable
  
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
   function init_map(){

       var mapCanvas = document.getElementById('googleMapDiv');
       var mapOptions = {
         center: new google.maps.LatLng(39.50, -98.35),
         zoom: 2,  //0 farthest, 22 closest
         mapTypeId: google.maps.MapTypeId.ROADMAP  //ROADMAP, SATELLITE, HYBRID, or TERRAIN
       }
       GoogleMap = new google.maps.Map(mapCanvas, mapOptions);

       var input = document.getElementById('userLocation');
       var options = {  bounds: GoogleMap.getBounds(), componentRestrictions: {country: 'US'}};
//       var options = {  bounds: GoogleMap.getBounds(),  types: ['(regions)', '(cities)'], componentRestrictions: {country: 'us'} };

       autocomplete = new google.maps.places.Autocomplete(input, options);

    var data = tableRef._('tr', {"filter": "none"}); 
       MarkerHash = {}; // New object
       MarkerLatLongHash = {}
 
     for(var row=0;row<data.length; row++){
           if(data[row][13] !== "" && data[row][14] !== ""){
              MarkerHash[data[row][0]] = {}
              if(typeof MarkerLatLongHash[data[row][13]+","+data[row][14]] == "undefined"){
                 MarkerLatLongHash[data[row][13]+","+data[row][14]] = [data[row][0]]
                 MarkerHash[data[row][0]].marker = new google.maps.Marker({map: GoogleMap,position: new google.maps.LatLng(+data[row][13], +data[row][14])});
                 MarkerHash[data[row][0]].infowindow = new google.maps.InfoWindow({content:"<b>"+data[row][5]+"</b><br/>"+data[row][10]+"<br/><a href='"+data[row][6]+"' target='_blank'>"+data[row][3]+"</a>"} );
                 google.maps.event.addListener(MarkerHash[data[row][0]].marker, 'click', function(innerKey) {  
                      return function() { MarkerHash[innerKey].infowindow.open(GoogleMap, MarkerHash[innerKey].marker); } }(data[row][0]));
              } else {
                 idxArray =MarkerLatLongHash[data[row][13]+","+data[row][14]]
                 MarkerHash[data[row][0]].marker = MarkerHash[idxArray[0]].marker
                 var newInfo = MarkerHash[idxArray[0]].infowindow
                 newInfo.content = newInfo.content + "<br/><a href='"+data[row][6]+"' target='_blank'>"+data[row][3]+"</a>"
                 MarkerHash[data[row][0]].infowindow = newInfo
                 
                 MarkerLatLongHash[data[row][13]+","+data[row][14]].push(data[row][0])
                 
              }
              google.maps.event.addListener(MarkerHash[data[row][0]].marker, 'click', function(innerKey) {  
                      return function() { MarkerHash[innerKey].infowindow.open(GoogleMap, MarkerHash[innerKey].marker); } }(data[row][0]));
           }
       }


   }

//----------------------------------------------------------------------------------------------------	
function drawGoogleMap(){

    var data = tableRef._('tr', {"filter":"applied"}); 
    var LookupProfiles = []
        LookupProfiles["Location"] = {Name: "Location", count: 0, Index: []} 
    
    if(typeof GoogleMap ==="undefined")
       init_map()
      
      for(k in MarkerHash){ 
        MarkerHash[k].marker.setVisible(false);
        MarkerHash[k].infowindow.close()
      } 
      for(var row=0;row<data.length; row++){
           if(data[row][13] !== "" && data[row][14] !== ""){
              MarkerHash[data[row][0]].marker.setVisible(true);
              LookupProfiles["Location"].count += 1
              LookupProfiles["Location"].Index.push( data[row][0])
            }
      }

 //     toggleWaitCursor()
 //     ShowPlotProfiles(LookupProfiles["Location"])
}


//----------------------------------------------------------------------------------------------------	
function locateMarker(idx){

     var FilterString = "^"+idx+"$";
     tableRef.fnFilter(FilterString, 0, true, false); //searches index column for Profile Index
     var row = tableRef._('tr', {"filter":"applied"});   
     tableRef.fnFilter("",0)
  
     $("#userLocation").val(row[0][10])
     var radius = Number($("#zoom").val())
     if(radius == 0) radius = 16093;

     zoomTo(row[0][13], row[0][14], radius)
     MarkerHash[idx].infowindow.open(GoogleMap, MarkerHash[idx].marker);

}
//----------------------------------------------------------------------------------------------------	
function useCurrentLocation(){

   var browserSupportFlag =  new Boolean();
   var initialLocation;

   function handleNoGeolocation(errorFlag) {
      if (errorFlag == true) {
        alert("Geolocation service failed.");
      } else {
        alert("Sorry, your browser doesn't support geolocation");
      }
    }

   if($("#currentLocationCheckbox")[0].checked){  
     $("#userLocation").val("getting current location...")
     $("#locate").prop("disabled",true);
     // Try W3C Geolocation (Preferred)
     if(navigator.geolocation) {
        browserSupportFlag = true;
        navigator.geolocation.getCurrentPosition(function(position) {
//          "https://maps.googleapis.com/maps/api/geocode/json?latlng="+position.coords.latitude+","+position.coords.longitude+"&key=API_KEY"
          $("#userLocation").val(position.coords.latitude.toFixed(6)+","+position.coords.longitude.toFixed(6))
          $("#locate").prop("disabled",false);

        }, function(error) {
             switch(error.code) {
               case error.PERMISSION_DENIED:
                 alert("Please accept the request for Geolocation to use this feature.")
                 break;
               case error.POSITION_UNAVAILABLE:
                 alert("Location information is unavailable.")
                 break;
               case error.TIMEOUT:
                 alert("The request to get user location timed out.")
                 break;
               case error.UNKNOWN_ERROR:
                 alert("An unknown error occurred.")
                 break;
            }
          handleNoGeolocation(browserSupportFlag);
        }, {frequency:5000,maximumAge: 0, timeout: 10000, enableHighAccuracy:true});
     } else {    // Browser doesn't support Geolocation
       browserSupportFlag = false;
       handleNoGeolocation(browserSupportFlag);
     }
  } else{    $("#userLocation").val("")} //allow user to enter a location (not based on GPS)
}

//----------------------------------------------------------------------------------------------------	
function zoomTo(latitude, longitude, radius){

       var Location = new google.maps.LatLng(latitude,longitude);
       var circleOptions = { center: Location, fillOpacity: 0,  strokeOpacity:0,  map: GoogleMap, radius: radius}
       var myCircle = new google.maps.Circle(circleOptions);
       GoogleMap.fitBounds(myCircle.getBounds());
       
//       ShowPlotProfiles(LookupProfiles["Location"])


}
//----------------------------------------------------------------------------------------------------	
function searchByLocation(){

    var startLocation = $("#userLocation").val()
    var radius = Number($("#zoom").val())
  
    if(radius == 0) radius = 16093  //100 miles
  
    if(startLocation.match(/\-*\d+\.*\d*\,\-*\d+\.*\d*/)){
       var LatLong = startLocation.split(",")
       zoomTo(LatLong[0],LatLong[1], radius);

//       GoogleMap.setCenter(initialLocation);
//       GoogleMap.setZoom(radius)
    }
    else if(startLocation !== "") {
        
        function callback(results, status) {
           if (status == google.maps.places.PlacesServiceStatus.OK) {
             if(results.length >= 1){
                zoomTo(results[0].geometry.location.lat(),results[0].geometry.location.lng(), radius)
             }
           }
        }

        var request = { location: GoogleMap.getCenter(), radius: radius, query: startLocation }
  
        service = new google.maps.places.PlacesService(GoogleMap);
        service.textSearch(request, callback);
    }
    
  
}


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

         doc.setFontSize(34); doc.setTextColor(255)
         doc.setFontType("bold"); 
         doc.rect(0.5,0.2, 7.5,0.7, "F")
         centeredText("STTRconnect.org", 0.8)

         doc.setFillColor(1); doc.setTextColor(96,168,250)
         doc.setFontType("normal");   doc.setFontSize(size);
         doc.setLineWidth(0.05);
         doc.line( 0.5,0.9, 8,0.9); // horizontal line

        verticalOffset += 0.1
        var innerText = $("#ReportSearchFilterDiv")[0].innerHTML.replace(/<.+?>/g,"").replace(/\r|\n/g,"").replace(/\s+/g," ")
         lines = doc.splitTextToSize(innerText, 7.5)
		 doc.text(0.5, verticalOffset+0.1 + size / 72, lines)
		 verticalOffset += (lines.length + 0.5 ) * size / 72
         doc.setTextColor(0,0,0); 
             
         for(var i=0; i < rows.length; i++){   // then reveals ones that haven't been filtered
            var RowIdx = rows[i][0]
 
            var Name = rows[i][3] 
            var email = rows[i][8]
            var website = rows[i][6]
            var Organization = rows[i][5] 
            var Bio = rows[i][4]
            var Resource   = "Resource type: " +rows[i][2]
            var Disease    = "Cancer focus: " +rows[i][1]
            
            
                      
            verticalOffset += 0.2
            doc.setLineWidth(0.025);
            doc.line( 0.5,verticalOffset, 8,verticalOffset); // horizontal line

            doc.setFontType("bold");   addPDFcontent(Name)
            doc.setFontType("italic"); addPDFcontent(Organization)
            doc.setFontType("normal"); addPDFcontent(email)
            addPDFcontent(Disease + "  " + Resource)
            
            doc.setTextColor(150);
            addPDFcontent(website)
            
            doc.setFontType("normal"); doc.setTextColor(0,0,0);
            verticalOffset += 0.1
            addPDFcontent(Bio)

        }  
       doc.save('STTRconnect.pdf');
    }
