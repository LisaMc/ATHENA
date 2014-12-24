var tableRef;
//DataTable columns: LastName:2, FirstName:3, Degree:4, Job Title, Organization Dept
//Inst: 6 
//Field: 25 (Organ Site) 41 (omics) 
//Focus: 28, 42-45: specialty, keywords, software, contact
//Picture: 31
//Bio: 22
//----------------------------------------------------------------------------------------------------
// used to clean the search string of dubious characters or null text, eg ""
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
function checkOffset() {
       var b = $(window).scrollTop();
        var d = $("#scroller-anchor").offset().top;
        var f = $("#footer_element").offset().top;
        var c = $("#scroller");
        var h = $("#scroller").height() + 20; // margin

        if (b > d) {
            var myTop = b;
            if (b > f - h) myTop = f - h;
            c.css("top", myTop)

        } else {
          c.css("top", "")
        }

}
//----------------------------------------------------------------------------------------------------
function checkOffset2() {
       var b = $(window).scrollTop();
       var c = $("#SideNav").height()
        var f = $("#footer_element").offset().top;
        
        if (f-b<700) {
           $("#SideNav").css("height", f-b -150)
        } else {
           $("#SideNav").css("height", $(window).height() - 150)
        }

}

//----------------------------------------------------------------------------------------------------

//$(document).ready(checkOffset);
$(document).scroll(checkOffset2);

window.onresize = function() {
    $("#SideNav").css("height", $(window).height() - 150)
};	

$(document).ready(function() {

//     var ColumnTitle = [{"sTitle": "Name", "sWidth": '50px'}, {"sTitle": "Education", "sWidth": '50px'}, {"sTitle": "JobTitle", "sWidth": '50px'}, {"sTitle": "Institution", "sWidth": '50px'}, {"sTitle": "Department", "sWidth": '50px'}, {"sTitle": "Site", "sWidth": '25px'}, {"sTitle": "Tumor.Type.Disease", "sWidth": '50px'}, {"sTitle": "keywords", "sWidth": '200px'}, {"sTitle": "Field", "sWidth": '50px'}, {"sTitle": "Title", "sWidth": '50px'}, {"sTitle": "Notes", "sWidth": '1000px'}]
//	   var ColumnTitle = [{"sTitle":  "Last Name", "sWidth": '50px'}, {"sTitle": "First Name", "sWidth": '50px'}, {"sTitle": "Full Name", "sWidth": '50px'}, {"sTitle": "Degrees", "sWidth": '50px'}, {"sTitle": "Job Title 1", "sWidth": '50px'}, {"sTitle": "Primary Organization", "sWidth": '50px'}, {"sTitle": "Department 1", "sWidth": '50px'}, {"sTitle": "Job Title 2", "sWidth": '50px'}, {"sTitle": "Organization 2", "sWidth": '50px'}, {"sTitle": "Department 2", "sWidth": '50px'}, {"sTitle": "Job Title 3", "sWidth": '50px'}, {"sTitle": "Organization 3", "sWidth": '50px'}, {"sTitle": "Department 3", "sWidth": '50px'}, {"sTitle": "Job Title 4", "sWidth": '50px'}, {"sTitle": "Organization 4", "sWidth": '50px'}, {"sTitle": "Department 4", "sWidth": '50px'}, {"sTitle": "Job Title 5", "sWidth": '50px'}, {"sTitle": "Organization 5", "sWidth": '50px'}, {"sTitle": "Department 5", "sWidth": '50px'}, {"sTitle": "Phone Number", "sWidth": '50px'}, {"sTitle": "Email Address", "sWidth": '50px'}, {"sTitle": "", "sWidth": '50px'}, {"sTitle": "Websites", "sWidth": '50px'}, {"sTitle": "Videos", "sWidth": '50px'}, {"sTitle": "Organ Site", "sWidth": '50px'}, {"sTitle": "Designation", "sWidth": '50px'}, {"sTitle": "Institutional Affiliation", "sWidth": '50px'}, {"sTitle": "Focus Areas", "sWidth": '50px'}, {"sTitle": "Modified", "sWidth": '50px'}, {"sTitle": "Modified By", "sWidth": '50px'}, {"sTitle": "Member Photos", "sWidth": '50px'}, {"sTitle": "FH Primary", "sWidth": '50px'}, {"sTitle": "Departments and Divisions", "sWidth": '50px'}, {"sTitle": "Converis ID", "sWidth": '50px'}, {"sTitle": "Item Type", "sWidth": '50px'}, {"sTitle": "Path", "sWidth": '50px'}]
       var ColumnTitle = [ {"sTitle": "Index", "sWidth": '50px'}, {"sTitle": "Full.Name", "sWidth": '50px'}, {"sTitle": "Last.Name", "sWidth": '50px'}, {"sTitle": "First.Name", "sWidth": '50px'}, {"sTitle": "Degrees", "sWidth": '50px'}, {"sTitle": "Job.Title.1", "sWidth": '50px'}, {"sTitle": "Primary.Organization", "sWidth": '50px'}, {"sTitle": "Department.1", "sWidth": '50px'}, {"sTitle": "Job.Title.2", "sWidth": '50px'}, {"sTitle": "Organization.2", "sWidth": '50px'}, {"sTitle": "Department.2", "sWidth": '50px'}, {"sTitle": "Job.Title.3", "sWidth": '50px'}, {"sTitle": "Organization.3", "sWidth": '50px'}, {"sTitle": "Department.3", "sWidth": '50px'}, {"sTitle": "Job.Title.4", "sWidth": '50px'}, {"sTitle": "Organization.4", "sWidth": '50px'}, {"sTitle": "Department.4", "sWidth": '50px'}, {"sTitle": "Job.Title.5", "sWidth": '50px'}, {"sTitle": "Organization.5", "sWidth": '50px'}, {"sTitle": "Department.5", "sWidth": '50px'}, {"sTitle": "Phone.Number", "sWidth": '50px'}, {"sTitle": "Email.Address", "sWidth": '50px'}, {"sTitle": "Bio", "sWidth": '50px'}, {"sTitle": "Websites", "sWidth": '50px'}, {"sTitle": "Videos", "sWidth": '50px'}, {"sTitle": "Organ.Site", "sWidth": '50px'}, {"sTitle": "Designation", "sWidth": '50px'}, {"sTitle": "Institutional.Affiliation", "sWidth": '50px'}, {"sTitle": "Focus.Areas", "sWidth": '50px'}, {"sTitle": "Modified", "sWidth": '50px'}, {"sTitle": "Modified.By", "sWidth": '50px'}, {"sTitle": "Member.Photos", "sWidth": '50px'}, {"sTitle": "FH.Primary", "sWidth": '50px'}, {"sTitle": "Departments.and.Divisions", "sWidth": '50px'}, {"sTitle": "Converis.ID", "sWidth": '50px'}, {"sTitle": "Item.Type", "sWidth": '50px'}, {"sTitle": "Path", "sWidth": '50px'}, {"sTitle": "sttr", "sWidth": '50px'}, {"sTitle": "Notes", "sWidth": '50px'}, {"sTitle": "Send", "sWidth": '50px'}, {"sTitle": "Responded", "sWidth": '50px'}, {"sTitle": "omicsField", "sWidth": '50px'}, {"sTitle": "specialty", "sWidth": '50px'}, {"sTitle": "keywords", "sWidth": '50px'}, {"sTitle": "software", "sWidth": '50px'}, {"sTitle": "contact", "sWidth": '50px'}, {"sTitle": "comment", "sWidth": '50px'}]
 		 $("#DataTable").dataTable({
       		  "aoColumns": ColumnTitle,
         })   // dataTable
         .fnAdjustColumnSizing(); 
         ;

 	tableRef = $("#DataTable").dataTable();
//    $("img").unveil(200);
    
//	d3.json("data/PeopleDataTable_5-14-14.json", function(json){
//	d3.json("data/RAINIER_members_11-20-14.json", function(json){
	d3.json("data/AthenaRainier_merged_byIndex_draft_12-18-14.json", function(json){

		 var DataTable=json
		 tableRef.fnAddData(DataTable);
	      
       $("#SearchSpan").click(function(){ 
             toggle_visibility("SearchSpan", "SEARCHdiv");
             if( document.getElementById("ProfileResults") == null){
                SearchAndFilterResults()
             }
           });
        $("#TableSpan").click(function(){ 
             toggle_visibility("TableSpan", "TABLEdiv");
           })
        $("#ProfileSpan").click(function(){ 
             toggle_visibility("ProfileSpan", "PROFILEdiv");           
//             createProfileTemplate();
           })
        $(".VisualizeSpan").click(function(){ 
             toggle_visibility("", "VISUALIZEdiv");

             $('.SliderThumbnails').slick({
               slide: 'div',
               infinite: true,
               slidesToShow: 3,
               slidesToScroll: 1,
               vertical: true,
               focusOnSelect: true,
               
             });
//if(filtered === false) {
//    $('.filtering').slickFilter(':even');
//    $(this).text('Unfilter Slides');
//    filtered = true;
//  } else {
//    $('.filtering').slickUnfilter();
//    $(this).text('Filter Slides');
//    filtered = false;
//  }
             
//             $("#BarplotThumb").click(drawBarplot)
           })
      $("#FAQSpan").click(function(){ 
             toggle_visibility("FAQSpan", "FAQdiv");
           })

       $("#HomeSpan").click(function(){ 
             toggle_visibility("Home", "HOMEdiv");
           })
         
         
       
        tableRef.fnSetColumnVis( 0, false );
        tableRef.fnSetColumnVis( 1, false );
        var RemoveRows = []
        for(var i=0;i<47;i++){
           if(i<1 || i>8)
              tableRef.fnSetColumnVis( i, false );
        }
         
        document.getElementById("NumberOfResultsDiv").innerHTML = tableRef._('tr', {"filter":"applied"}).length
        document.getElementById("SearchStringDiv").innerHTML = " results for: " + "(all people)";
        
	});  //end json
		
	$('.filterOptions :checkbox').click(function(){ 
	    toggle_selection(this.className); });	
		
	$(".toExpand").click(function(){toggleContent(this, this.parentNode) })
    $(".toContract").click(function(){toggleContent(this, this.parentNode) })

    $(".barPlot").click(function(){
      drawBarplot() })


	$("#SideNav").css("height", $(window).height() - 150)

    $("#SideNav").mCustomScrollbar({
					theme:"minimal",
					scrollInertia: 10,
					autoExpandScrollbar: true,
					mouseWheel:{ preventDefault: true }
				});

   $("#RightBar").mCustomScrollbar({
					theme:"minimal",
					scrollInertia: 10,
					autoExpandScrollbar: true,
					mouseWheel:{ preventDefault: true }
				});


		
}); //document.ready

//----------------------------------------------------------------------------------------------------
 window.onload = function() {
 
      var FreeForm = document.getElementById("QueryFreeForm");

      //----------------------------------------------------------------------------------------------------
      FreeForm.onsubmit = function(e) {
        e.preventDefault();
        toggle_visibility("SearchSpan", "SEARCHdiv");
        SearchAndFilterResults() 
        return false;
      }
     
   } //window.onload 
	
  //----------------------------------------------------------------------------------------------------	
     function toggleContent(elem, content){
               
//               var $content = elem.parent().prev("div.content");
//               var content = elem.parentNode.children[4];
    
               if(content.className.match("hideContent") != null){
                  content.className = content.className.replace("hideContent", "showContent")
                  elem.className = "toContract";
               } else {
                  content.className= content.className.replace("showContent", "hideContent");
                  elem.className = "toExpand";
                } ;


       };

 //----------------------------------------------------------------------------------------------------	
	function toggle_selection(group){
	
        if(group == "fil_inst"){
           tableRef.fnFilter("", 6);  
           Filter_Selection("FilterInstitution", "ReportInstFilterSpan",6, "<i> from </i>")
        } else if(group == "fil_disease"){        
           tableRef.fnFilter("", 25); 
           Filter_Selection("FilterDisease", "ReportDiseaseFilterSpan",25, "<i> researching </i>")
        } else if(group == "fil_omics"){
           tableRef.fnFilter("", 41); 
           Filter_Selection("FilterOmics", "ReportOmicsFilterSpan",41, "<i> specializing in </i>")
        } else if (group == "fil_contact"){
           tableRef.fnFilter("", 45);
           Filter_Selection("FilterContactFor", "ReportContactForFilterSpan",45, "<i> available for </i>")
        }
        
        createProfilesFromTable();

    }
//----------------------------------------------------------------------------------------------------
  
    function Filter_Selection(ElementID, ReportSpan, TableColumn, connectingHTML){

       var selectedFieldarray = []
       $("#"+ElementID+" :checkbox:checked").each(function() 
       	{ selectedFieldarray.push($(this).val())  });
        
        if(selectedFieldarray.length == 0){
         document.getElementById(ReportSpan).innerHTML = "";
         return;
        }
        
        var filterField_String = selectedFieldarray.join("|");
        var printedString = "";
        if(selectedFieldarray.length == 1){
           printedString = selectedFieldarray.pop()
        }else{
           var lastWord= selectedFieldarray.pop()
           printedString = selectedFieldarray.join(", ")
           printedString += ", or " + lastWord
        } 

      document.getElementById(ReportSpan).innerHTML = connectingHTML + printedString 

      tableRef.fnFilter(filterField_String, TableColumn, true, false);  //searches "Organ Site" column (26) using RegEx (true) without smart filtering (false)
    
    }


  //----------------------------------------------------------------------------------------------------	
	function toggle_visibility(activeSpanID, activeDivID){
        var els = document.getElementsByClassName('MainFrameDiv');
        for(var i=0; i<els.length; ++i){     //set all displays to none
            els[i].style.display =  'none';
        };

//        $(".sidebar_nav_selected").attr("class", "sidebar_nav_not_selected")  //deselect active nav
        
        document.getElementById(activeDivID).style.display = 'block'  //then activate a single div
        if(activeSpanID != "Home"){ //not the home page
//          document.getElementById(activeSpanID).className = "sidebar_nav_selected" //and select the navigation span
             document.getElementById("mainContent").style.background = "#F1F1F1"
             document.getElementById("mainContent").style.color = "#000"
//          $(".sidebar_nav_not_selected").css("color", "black")
             
         }else{
             document.getElementById("mainContent").style.background = "#000"
             document.getElementById("mainContent").style.color = "#F1F1F1"
//          $(".sidebar_nav_not_selected").css("color",  "white")
         }

    }
  //----------------------------------------------------------------------------------------------------
   function SearchTableByStrings(wordArray) {
        filterString = wordArray[0];
        for(var i=1; i < wordArray.length; i++){
           filterString += "|" + wordArray[i]
        } // if more than one search word

      tableRef.fnFilter(filterString, null, true); //searches all columns (null) using RegEx (true)
   }
  //----------------------------------------------------------------------------------------------------
   function showAllRows() {
      tableRef.fnFilter("");
      tableRef.fnFilter("", 6);  // clear Inst filter
      tableRef.fnFilter("", 25); // clear field filter
      tableRef.fnFilter("", 41);  // clear omics filter
      tableRef.fnFilter("", 45); // clear contact filter

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
//          console.log(wordArray)
        
        showAllRows();
       
        if(wordArray.length == 0){
           document.getElementById("SearchStringDiv").innerHTML = " results for: " + "(all people)";
        }else{
           document.getElementById("SearchStringDiv").innerHTML = " results for: " + searchString;
           SearchTableByStrings(wordArray); 
        }  
        
        Filter_Selection("FilterInstitution", "ReportInstFilterSpan",6, "<i> from </i>")
        Filter_Selection("FilterDisease", "ReportDiseaseFilterSpan",25, "<i> specializing in </i>")
        Filter_Selection("FilterOmics", "ReportOmicsFilterSpan",41, "<i> specializing in </i>")
        Filter_Selection("FilterContactFor", "ReportContactForFilterSpan",45, "<i> for </i>")

  
        createProfilesFromTable();

   }

   //----------------------------------------------------------------------------------------------------
      function ArrayToStringSpan(wordString, splitChar, cleanChar, sepChar){
         var wordArray = wordString.split(splitChar)
         if(wordArray == null) wordArray = [""]
        
         var i = cleanChar.length
         while(i--){ wordArray.clean(cleanChar[i]) }
         var j = wordArray.length;
         while(j--){  wordArray[j] = "<span style='padding:0px 3px;border-radius:10px' class='ActiveWords'>"+wordArray[j]+sepChar+"</span>";}
         
         return wordArray.join("")

      }

   //----------------------------------------------------------------------------------------------------
      function EditProfile(elem){
               toggle_visibility("ProfileSpan", "PROFILEdiv");           
    
      }
      
    //----------------------------------------------------------------------------------------------------
     function FullProfile(elem){
      
      if(elem.className == "toExpand"){
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
	  function createProfilesFromTable(){
//DataTable columns: LastName:2, FirstName:3, Degree:4, Job Title, Organization Dept
//Inst: 6 
//website: 23
//Field: 25 (Organ Site) 41 (omics) 
//Focus: 28, 42-45: specialty, keywords, software, contact
//Picture: 31
//Bio: 22
//sttr : 37

        var rows = tableRef._('tr', {"filter":"applied"});   
        var TopRows = []  // either STTR or filled out Survey
        var OtherRows = [] // not STTR and haven't filled out survey
        
        for(var i=0; i < rows.length; i++){
           if(rows[i][37] == 1 || rows[i][43] != "NA") { 
                  TopRows.push(rows[i]) }
            else {OtherRows.push(rows[i])}
        }
        rows = TopRows.concat(OtherRows)
                
        $('#SearchResults').html('')
        $("#SearchResults").append("<div id='ProfileResults' style='line-height:normal;background:#F1F1F1;color:#000;height:100%; overflow-x:auto'></div>")
        var ProfileResults = $("#ProfileResults")
      
        document.getElementById("NumberOfResultsDiv").innerHTML = rows.length

        if(rows.length == 0){
           ProfileResults.append("Your search did not match any profiles.")
           return;
        }
        
        //ALTER FOR LAZY LOADING or pagination
        for(var i=0; i < rows.length; i++){
          var opacity = 1;
        if(i>=TopRows.length){ opacity= 0.2 }
          ProfileResults.append("<div id=Profile_"+ i+ " style='opacity:"+opacity+";position:relative;clear:both;margin-bottom:5px;border: solid black 2px; border-left:none; border-right:none; border-bottom:none; width:100%;height:100%; font-size:0.8em  '>")
          $("#Profile_"+i).append("<div id=Profile_"+i+"_edit          onclick='EditProfile(this)'   style='float:right; color:#60a8fa;right:5px;margin-top:5px; text-align:center; cursor:pointer' ;><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span><br></div>")
          $("#Profile_"+i).append("<div id=Profile_"+i+"_toggleContent onclick='FullProfile(this)' class='toExpand' style='float:left; position:absolute;font-size:1.5em; right:20px; color:#60a8fa;text-align:end;cursor:pointer;'>&gt</div>")
          $("#Profile_"+i).append("<div id=Profile_"+i+"_Picture style='float:left; min-width:5%;margin-left:5px;margin-right:5px;margin-top:5px';></div>")
          $("#Profile_"+i).append("<div id=Profile_"+i+"_Info style='float:left; width:30%;margin-top:5px'></div>")
          $("#Profile_"+i).append("<div id=Profile_"+i+"_Bio class='hideContent' style='float:left; width:55%; text-align:justify; margin-top:5px; margin-bottom:5px'></div>")
          $("#Profile_"+i).append("<div id=Profile_"+i+"_addtlPos  class='fullProfile' style='clear:both;float:left;margin-top:5px; width:90%;display:none'></div>")
          $("#Profile_"+i).append("<div id=Profile_"+i+"_website  class='fullProfile' style='clear:both;float:left;margin-top:5px; width:90%;display:none'></div>")
          $("#Profile_"+i).append("<div id=Profile_"+i+"_Disease class='fullProfile hangingIndent' style='clear:both;float:left; width:82%;display:none'></div>")
          $("#Profile_"+i).append("<div id=Profile_"+i+"_Omics class='fullProfile hangingIndent' style='clear:both;float:left; width:82%;display:none'></div>")
          $("#Profile_"+i).append("<div id=Profile_"+i+"_Specialty  class='fullProfile hangingIndent' style='clear:both;clear:both;float:left; width:82%;display:none'></div>")
          $("#Profile_"+i).append("<div id=Profile_"+i+"_ContactFor  class='fullProfile hangingIndent' style='clear:both;float:left; width:82%;display:none'></div>")
     
          ProfileResults.append("</div>")  //end individual profile

          setProfilePicture("#Profile_"+i+"_Picture", rows[i][31])

          var Name = "<b>" + rows[i][3]+ " " + rows[i][2] + "</b>";
          if(rows[i][4] !== ""){ Name= Name.concat(", " + rows[i][4]); }
          $("#Profile_"+i+"_Info").append(Name + "<br>")
          
          var Title = "", Contact="";
          if(rows[i][5] !== ""){ Title = rows[i][5] + "<br>"}
          if(rows[i][6] !== ""){ Title = Title + rows[i][6] + "<br>"}
          if(rows[i][7] !== ""){ Title = Title + rows[i][7] + "<br>"}
//          if(rows[i][20] !== ""){ Contact = rows[i][20] + "<br>"}
          if(rows[i][21] !== ""){ Contact = Contact + rows[i][21] + "<br>"}
          $("#Profile_"+i+"_Info").append(Title+Contact)
          
          var addtlPos = [8,11,14,17];
          var AddedPos = ""
          for(var j=0; j<addtlPos.length; j++){
             if(rows[i][addtlPos[j]] != "" & rows[i][addtlPos[j]] != "NA"){
                AddedPos = AddedPos + rows[i][addtlPos[j]] + ", " + rows[i][addtlPos[j]+1] + ": " + rows[i][addtlPos[j]+2] + ";"
             }           
          }
          if(AddedPos != ""){
             AddedPos = "<b>Additional Positions </b><br>" + ArrayToStringSpan(AddedPos, ";", ["", "#"], "<br>") 
             $("#Profile_"+i+"_addtlPos").append(AddedPos)
             $("#Profile_"+i+"_addtlPos").css("margin-bottom","5px")
          }
 
          if(rows[i][25] !== "" & rows[i][25] !== "NA"){ 
             var Disease = "<b style='min-width:50px'>Disease type </b>"
             Disease = Disease+ ArrayToStringSpan(rows[i][25].replace(/#/g,""), ";", ["", "#"], "; ")
             $("#Profile_"+i+"_Disease").append(Disease + "<br>")
             $("#Profile_"+i+"_Disease").css("margin-bottom","5px")
          }
          if(rows[i][41] !== "" & rows[i][41] !== "NA"){ 
             var Omics = "<b style='padding-right:8px'>-omics field </b>"
             Omics = Omics + ArrayToStringSpan(rows[i][41], ";", ["", "#"], "; ") 
             $("#Profile_"+i+"_Omics").append(Omics + "<br>")
             $("#Profile_"+i+"_Omics").css("margin-bottom","5px")
          }
          
          if(rows[i][45] !== "" & rows[i][45] !== "NA"){ 
             var ContactFor = "<b style='padding-right:9px'>Contact for </b>"
             ContactFor = ContactFor + ArrayToStringSpan(rows[i][45], ";", ["", "#"], "; ")  
             $("#Profile_"+i+"_ContactFor").append(ContactFor + "<br>")
             $("#Profile_"+i+"_ContactFor").css("margin-bottom","5px")
         }
          var Websites = ""
          if(rows[i][23] !== "" & rows[i][23] !== "NA"){ 
            var webPrefix = ["UW1: ", "UW2: ", "UW3: ", "UW4: ", "UW5: ","UW6: ","UW Lab: ", "FH1: ", "FH2: ","FH Lab: ", "SCCA: ", "SCCA1: ", "SCH1: ", "No profile page: Rostomily lab member: "];
            var j=webPrefix.length; var sites= rows[i][23]
            while(j--){ sites = sites.replace(webPrefix[j],"")}  //<a href:'url'>link text</a>") }
            var siteArray = sites.split(";"); 
            if(siteArray != null){
              j=siteArray.length;
              while(j--){ siteArray[j] = "<a href='"+siteArray[j]+"' target='_blank'>"+siteArray[j]+"</a><br>"}
              Websites = siteArray.join("")
            }
//            Websites = ArrayToStringSpan(sites, ";", ["", "#"], "<br>")  }
            $("#Profile_"+i+"_website").append(Websites + "<br>")
          }
 
//          var Specialty = "" 
//          var Keywords = ""
//          if(rows[i][28] !== "" & rows[i][28] !== "NA"){ Specialty = "<i style='padding-bottom:5px'>" + ArrayToStringSpan(rows[i][28], ";", ["", "#"], "; ")  + "</i><br>"}
//          if(rows[i][43] !== "" & rows[i][43] !== "NA"){ Keywords = ArrayToStringSpan(rows[i][43], ";", ["", "#"], "; ")  + "<br>"}
//            $("#Profile_"+i+"_Specialty").append(Specialty + Keywords)
          
          var Bio = ""
          if(rows[i][22] !== "" & rows[i][22] !== "NA"){
             Bio = rows[i][22].replace(new RegExp('@', 'g'), "<br>") + "<br>";}
           $("#Profile_"+i+"_Bio").append(Bio)
            
        }
       
      } // createProfilesFromTable
  //----------------------------------------------------------------------------------------------------
	  function setProfilePicture(ImageDiv, file){
        $.ajax({
             url:'/images/Photos/'+file,
             type:'HEAD',
             error: function()    { //file does not exist
                     $(ImageDiv).append("<img title='ProfilePicture' alt='ProfilePic' class='rsImg' style='max-height:75px; max-width:50px' src='/images/Photos/Photo Coming Soon.jpg'>")
             },
             success: function()  { //file exists
                     $(ImageDiv).append("<img title='ProfilePicture' alt='ProfilePic' class='rsImg' style='max-height:75px; max-width:50px' src='/images/Photos/"+ file + "' data-src='/images/Photos/Photo Coming Soon.jpg'>")
             }
       });
      }

  //----------------------------------------------------------------------------------------------------
	  function getCurrentFilteredRows(){
        var rows = tableRef._('tr', {"filter":"applied"});   
        var currentIDs = []
        for(var i=0; i < rows.length; i++) 
          currentIDs.push(rows[i][0]);

        return(currentIDs)

      } // currentSelectedIDS

 
 //----------------------------------------------------------------------------------------------------
    function drawBarplot(){
  
        var margin = {top: 40, right: 20, bottom: 30, left: 40, leftY:30},
             width = $(window).width() - 550 - margin.left - margin.right - margin.leftY,
            height = 500 - margin.top - margin.bottom;

        var formatPercent = d3.format(".0%");

        var x = d3.scale.linear().range([0, width]);

        var y = d3.scale.linear()
                  .range([height, 0]);

        var xAxis = d3.svg.axis()
                      .scale(x)
                      .orient("bottom");

        var yAxis = d3.svg.axis()
                      .scale(y)
                      .orient("left")

//        var tip = d3.tip()
//                    .attr('class', 'd3-tip')
//                    .offset([-10, 0])
//                    .html(function(d) {
//                    return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
//                  })

        var svg = d3.select("#MainGraph").append("svg")
                    .attr("width", width + margin.left + margin.right + margin.leftY)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + (margin.left + margin.leftY) + "," + margin.top + ")");

//           svg.call(tip);

        var data = tableRef._('tr', {"filter":"applied"});   

        var values = data.map(function(d){
                          return d[6]})
                                  
        function getCounts(array) {
             var frequency = {};

             array.forEach(function(value) { frequency[value] = 0; });

             var uniques = array.filter(function(value) {
               return ++frequency[value] == 1; })
           
           
               var CountMap = [];
               uniques.forEach(function(name){
                 CountMap.push({Name: name, count: frequency[name]});
              })
               return CountMap
          //   return uniques.sort(function(a, b) {
         //       return frequency[b] - frequency[a];
         //   });
        };
        
        var groups = getCounts(values)
         var maxFreq = d3.max(groups, function(d){return d.count});

           x.domain([0,groups.length]);
           y.domain([0, maxFreq]);

           svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

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
              .attr("x", function(d,i) { return x(i); })
              .attr("width", width/groups.length - 2)
              .attr("y", function(d) { return y(d.count); })
              .attr("height", function(d) { return height - y(d.count); })
//              .on('mouseover', tip.show)
//              .on('mouseout', tip.hide)

       

      function type(d) {
          d.count = +d.count;
          return d;
       }

}