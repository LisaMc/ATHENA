var tableRef;
var activeContent = "SEARCHdiv";
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
       var c = $("#SideNav").height();
       var d = $(window).height();
        var f = $("#footer_element").offset().top - 20;  // margin
        
        if (f-b<d) {
           $("#SideNav").css("height", f-b -150)
           $("#RightBar").css("height", f-b -150)
        } else {
           $("#SideNav").css("height", $(window).height() -150)
           $("#RightBar").css("height", $(window).height() -150)
        }

}

//----------------------------------------------------------------------------------------------------
$(document).scroll(checkOffset);

window.onresize = function() {
    $("#SideNav").css("height", $(window).height() - 150)
   $("#RightBar").css("height", $(window).height() - 150)

};	

//----------------------------------------------------------------------------------------------------
$(document).ready(function() {

    document.getElementById("mainContent").style.background = "#F1F1F1"
    document.getElementById("mainContent").style.color = "#000"
	      
    var ColumnTitle = [ {"sTitle": "Index", "sWidth": '50px'}, {"sTitle": "Full.Name", "sWidth": '50px'}, {"sTitle": "Last.Name", "sWidth": '50px'}, {"sTitle": "First.Name", "sWidth": '50px'}, {"sTitle": "Degrees", "sWidth": '50px'}, {"sTitle": "Job.Title.1", "sWidth": '50px'}, {"sTitle": "Primary.Organization", "sWidth": '50px'}, {"sTitle": "Department.1", "sWidth": '50px'}, {"sTitle": "Job.Title.2", "sWidth": '50px'}, {"sTitle": "Organization.2", "sWidth": '50px'}, {"sTitle": "Department.2", "sWidth": '50px'}, {"sTitle": "Job.Title.3", "sWidth": '50px'}, {"sTitle": "Organization.3", "sWidth": '50px'}, {"sTitle": "Department.3", "sWidth": '50px'}, {"sTitle": "Job.Title.4", "sWidth": '50px'}, {"sTitle": "Organization.4", "sWidth": '50px'}, {"sTitle": "Department.4", "sWidth": '50px'}, {"sTitle": "Job.Title.5", "sWidth": '50px'}, {"sTitle": "Organization.5", "sWidth": '50px'}, {"sTitle": "Department.5", "sWidth": '50px'}, {"sTitle": "Phone.Number", "sWidth": '50px'}, {"sTitle": "Email.Address", "sWidth": '50px'}, {"sTitle": "Bio", "sWidth": '50px'}, {"sTitle": "Websites", "sWidth": '50px'}, {"sTitle": "Videos", "sWidth": '50px'}, {"sTitle": "Organ.Site", "sWidth": '50px'}, {"sTitle": "Designation", "sWidth": '50px'}, {"sTitle": "Institutional.Affiliation", "sWidth": '50px'}, {"sTitle": "Focus.Areas", "sWidth": '50px'}, {"sTitle": "Modified", "sWidth": '50px'}, {"sTitle": "Modified.By", "sWidth": '50px'}, {"sTitle": "Member.Photos", "sWidth": '50px'}, {"sTitle": "FH.Primary", "sWidth": '50px'}, {"sTitle": "Departments.and.Divisions", "sWidth": '50px'}, {"sTitle": "Converis.ID", "sWidth": '50px'}, {"sTitle": "Item.Type", "sWidth": '50px'}, {"sTitle": "Path", "sWidth": '50px'}, {"sTitle": "sttr", "sWidth": '50px'}, {"sTitle": "Notes", "sWidth": '50px'}, {"sTitle": "Send", "sWidth": '50px'}, {"sTitle": "Responded", "sWidth": '50px'}, {"sTitle": "omicsField", "sWidth": '50px'}, {"sTitle": "specialty", "sWidth": '50px'}, {"sTitle": "keywords", "sWidth": '50px'}, {"sTitle": "software", "sWidth": '50px'}, {"sTitle": "contact", "sWidth": '50px'}, {"sTitle": "comment", "sWidth": '50px'}]
 		 $("#DataTable").dataTable({
       		  "aoColumns": ColumnTitle,
         })   // dataTable
         .fnAdjustColumnSizing(); 
         ;

      $.fn.dataTableExt.afnFiltering.push(function (settings, data, index) {
         var selectedFieldarray = []
               $("#FilterInstitution :checkbox:checked").each(function() 
         	{ selectedFieldarray.push($(this).val())  });
         if(selectedFieldarray.length){
            var filterField_String = selectedFieldarray.join("|");
            var TableColumn = [6,9,12,15,18]
            for (var i=0; i < TableColumn.length; i++) {
               if (data[TableColumn[i]].match(filterField_String)) return true;
            }
           return false;
         } else { return true;}
      });

 	tableRef = $("#DataTable").dataTable();

//    $("img.lazy").lazyload({ 
//         effect: "fadeIn" 
//    })

//     $(document).ajaxStop(function(){
//       $("img.lazy").lazyload({ 
//        effect: "fadeIn" 
//     }).removeClass("lazy");
//    });

//    $("img.lazy").unveil();
    
	d3.json("data/AthenaRainier_merged_byIndex_draft_12-18-14.json", function(json){

		 var DataTable=json
		 tableRef.fnAddData(DataTable);

        document.getElementById("NumberOfResultsDiv").innerHTML = tableRef._('tr', {"filter":"applied"}).length
        document.getElementById("SearchStringDiv").innerHTML = " results for: " + "(all people)";

        createProfilesFromTable()

	});  //end json

   	$(".toExpand").click(function(){toggleContent(this, this.parentNode) })
    $(".toContract").click(function(){toggleContent(this, this.parentNode) })
     		
    $("#PlotType").chosen().change()
    $("#PlotFeature").chosen().change(updateActiveContent())

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
           })
        $(".VisualizeSpan").click(function(){ 
             toggle_visibility("", "VISUALIZEdiv");})

        $("#HomeSpan").click(function(){ 
//             toggle_visibility("Home", "HOMEdiv");
             toggle_visibility("SearchSpan", "SEARCHdiv");
             if( document.getElementById("ProfileResults") == null){
                SearchAndFilterResults()
             }

           })

	$('.filterOptions :checkbox').click(function(){ 
	    toggle_selection(this.className); });	
		

    $(".barPlot").click(function(){
      toggle_visibility("barplot", "VISUALIZEdiv") })


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
         SearchAndFilterResults()
//        toggle_visibility("SearchSpan", "SEARCHdiv");
        updateActiveContent();
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
//          $.fn.dataTableExt.afnFiltering = [];
           tableRef.fnFilter("", 6);  tableRef.fnFilter("", 9);  
           tableRef.fnFilter("", 12);  tableRef.fnFilter("", 15);  
           tableRef.fnFilter("", 18);  
           Filter_Selection("FilterInstitution", "ReportInstFilterSpan",null, "<i> from </i>")
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
 
      
        updateActiveContent();
        

    }
//----------------------------------------------------------------------------------------------------
    function updateActiveContent(){

        document.getElementById("NumberOfResultsDiv").innerHTML =  tableRef._('tr', {"filter":"applied"}).length
        
       if(activeContent == "SearchSpan"){
//          createProfilesFromTable();
          getProfilesFromTable();
        }
        else if (activeContent == "barplot"){
            drawBarplot();
        }
       
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

      if(TableColumn)
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
         
        updateActiveContent();


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
      
      $.fn.dataTableExt.afnFiltering = [];
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
        
        Filter_Selection("FilterInstitution", "ReportInstFilterSpan",null, "<i> from </i>")
        Filter_Selection("FilterDisease", "ReportDiseaseFilterSpan",25, "<i> specializing in </i>")
        Filter_Selection("FilterOmics", "ReportOmicsFilterSpan",41, "<i> specializing in </i>")
        Filter_Selection("FilterContactFor", "ReportContactForFilterSpan",45, "<i> for </i>")

  
//        updateActiveContent();

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

           if(elem.id == ""){
                $("#edit_firstname").val("")
                $("#edit_lastname").val("")
                $("#edit_degrees").val("")
                $("#edit_bio").val("")
                $("#edit_institution").val("")
                $("#edit_title").val("")
                $("#edit_website").val("")
                $("#edit_disease").val("")
                $("#edit_omics").val("")
                $("#edit_contact").val("")
                $("#edit_keywords").val("")  

           }
           else{
              var RowIdx = elem.id.match(/\d+/)[0]
              var FilterString = "^"+RowIdx+"$"
                  tableRef.fnFilter(FilterString, 0, true, false); //searches index column for Profile Index
              var row = tableRef._('tr', {"filter":"applied"});   
 
                $("#edit_firstname").val(row[0][3])
                $("#edit_lastname").val(row[0][2])
                $("#edit_degrees").val(row[0][4])
                $("#edit_bio").val(row[0][22])
                $("#edit_institution").val(row[0][6])
                $("#edit_title").val(row[0][5])
                $("#edit_website").val(row[0][23])
                $("#edit_disease").val(row[0][25])
                $("#edit_omics").val(row[0][41])
                $("#edit_contact").val(row[0][45])
                $("#edit_keywords").val(row[0][28])  

            tableRef.fnFilter("", 0); // clear index filter
           }
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
	  function getProfilesFromTable(){

          var rows = tableRef._('tr', {"filter":"applied"});   
         
      $('.ActiveProfileContent').toggleClass("FilteredProfileContent", true)
//        for(var i=0; i<els.length; ++i){     //temporarily hides all profiles
//            els[i].className = 'FilteredProfileContent';
//        };

         for(var i=0; i < rows.length; i++){   // then reveals ones that haven't been filtered
            var RowIdx = rows[i][0]
           $("#Profile_"+RowIdx).toggleClass("FilteredProfileContent", false)
        }
    
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
        $("#SearchResults").append("<div id='ProfileResults' style='line-height:normal;background:#F1F1F1;color:#000;height:100%; padding-bottom:10px'></div>")
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
        var RowIdx = rows[i][0]
          ProfileResults.append("<div id=Profile_"+RowIdx+ " class='ActiveProfileContent' style='opacity:"+opacity+";position:relative;clear:both;margin-bottom:5px;border: solid black 2px; border-left:none; border-right:none; border-bottom:none; width:100%;height:100%; font-size:0.8em  '>")
          $("#Profile_"+RowIdx).append("<div id=Profile_"+RowIdx+"_edit          onclick='EditProfile(this)'   style='float:right; color:#60a8fa;right:10px;margin-top:5px; text-align:center; cursor:pointer' ;><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span><br></div>")
          $("#Profile_"+RowIdx).append("<div id=Profile_"+RowIdx+"_toggleContent onclick='FullProfile(this)' class='toExpand' style='float:left; position:absolute;font-size:1.5em; right:25px; color:#60a8fa;text-align:end;cursor:pointer;'>&gt</div>")
          $("#Profile_"+RowIdx).append("<div id=Profile_"+RowIdx+"_Picture style='float:left; min-width:5%;margin-left:5px;margin-right:5px;margin-top:5px';></div>")
          $("#Profile_"+RowIdx).append("<div id=Profile_"+RowIdx+"_Info style='float:left; width:30%;margin-top:5px'></div>")
          $("#Profile_"+RowIdx).append("<div id=Profile_"+RowIdx+"_Bio class='hideContent' style='float:left; width:55%; text-align:justify; margin-top:5px; margin-bottom:5px'></div>")
          $("#Profile_"+RowIdx).append("<div id=Profile_"+RowIdx+"_addtlPos  class='fullProfile' style='clear:both;float:left;margin-top:5px; width:90%;display:none'></div>")
          $("#Profile_"+RowIdx).append("<div id=Profile_"+RowIdx+"_website  class='fullProfile' style='clear:both;float:left;margin-top:5px; width:90%;display:none'></div>")
          $("#Profile_"+RowIdx).append("<div id=Profile_"+RowIdx+"_Disease class='fullProfile hangingIndent' style='clear:both;float:left; width:82%;display:none'></div>")
          $("#Profile_"+RowIdx).append("<div id=Profile_"+RowIdx+"_Omics class='fullProfile hangingIndent' style='clear:both;float:left; width:82%;display:none'></div>")
          $("#Profile_"+RowIdx).append("<div id=Profile_"+RowIdx+"_Specialty  class='fullProfile hangingIndent' style='clear:both;clear:both;float:left; width:82%;display:none'></div>")
          $("#Profile_"+RowIdx).append("<div id=Profile_"+RowIdx+"_ContactFor  class='fullProfile hangingIndent' style='clear:both;float:left; width:82%;display:none'></div>")
     
          ProfileResults.append("</div>")  //end individual profile

          var picFile = rows[i][31]
          if(picFile == "NA") picFile = "Photo Coming Soon.jpg"
          setProfilePicture("#Profile_"+RowIdx+"_Picture", picFile)

          var Name = "<b>" + rows[i][3]+ " " + rows[i][2] + "</b>";
          if(rows[i][4] !== ""){ Name= Name.concat(", " + rows[i][4]); }
          $("#Profile_"+RowIdx+"_Info").append(Name + "<br>")
          
          var Title = "", Contact="";
          if(rows[i][5] !== ""){ Title = rows[i][5] + "<br>"}
          if(rows[i][6] !== ""){ Title = Title + rows[i][6] + "<br>"}
          if(rows[i][7] !== ""){ Title = Title + rows[i][7] + "<br>"}
//          if(rows[i][20] !== ""){ Contact = rows[i][20] + "<br>"}
          if(rows[i][21] !== ""){ Contact = Contact + rows[i][21] + "<br>"}
          $("#Profile_"+RowIdx+"_Info").append(Title+Contact)
          
          var addtlPos = [8,11,14,17];
          var AddedPos = ""
          for(var j=0; j<addtlPos.length; j++){
             if(rows[i][addtlPos[j]] != "" & rows[i][addtlPos[j]] != "NA"){
                AddedPos = AddedPos + rows[i][addtlPos[j]] + ", " + rows[i][addtlPos[j]+1] + ": " + rows[i][addtlPos[j]+2] + ";"
             }           
          }
          if(AddedPos != ""){
             AddedPos = "<b>Additional Positions </b><br>" + ArrayToStringSpan(AddedPos, ";", ["", "#"], "<br>") 
             $("#Profile_"+RowIdx+"_addtlPos").append(AddedPos)
             $("#Profile_"+RowIdx+"_addtlPos").css("margin-bottom","5px")
          }
 
          if(rows[i][25] !== "" & rows[i][25] !== "NA"){ 
             var Disease = "<b style='min-width:50px'>Disease type </b>"
             Disease = Disease+ ArrayToStringSpan(rows[i][25].replace(/#/g,""), ";", ["", "#"], "; ")
             $("#Profile_"+RowIdx+"_Disease").append(Disease + "<br>")
             $("#Profile_"+RowIdx+"_Disease").css("margin-bottom","5px")
          }
          if(rows[i][41] !== "" & rows[i][41] !== "NA"){ 
             var Omics = "<b style='padding-right:8px'>-omics field </b>"
             Omics = Omics + ArrayToStringSpan(rows[i][41], ";", ["", "#"], "; ") 
             $("#Profile_"+RowIdx+"_Omics").append(Omics + "<br>")
             $("#Profile_"+RowIdx+"_Omics").css("margin-bottom","5px")
          }
          
          if(rows[i][45] !== "" & rows[i][45] !== "NA"){ 
             var ContactFor = "<b style='padding-right:9px'>Contact for </b>"
             ContactFor = ContactFor + ArrayToStringSpan(rows[i][45], ";", ["", "#"], "; ")  
             $("#Profile_"+RowIdx+"_ContactFor").append(ContactFor + "<br>")
             $("#Profile_"+RowIdx+"_ContactFor").css("margin-bottom","5px")
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
            $("#Profile_"+RowIdx+"_website").append(Websites + "<br>")
          }
 
//          var Specialty = "" 
//          var Keywords = ""
//          if(rows[i][28] !== "" & rows[i][28] !== "NA"){ Specialty = "<i style='padding-bottom:5px'>" + ArrayToStringSpan(rows[i][28], ";", ["", "#"], "; ")  + "</i><br>"}
//          if(rows[i][43] !== "" & rows[i][43] !== "NA"){ Keywords = ArrayToStringSpan(rows[i][43], ";", ["", "#"], "; ")  + "<br>"}
//            $("#Profile_"+i+"_Specialty").append(Specialty + Keywords)
          
          var Bio = ""
          if(rows[i][22] !== "" & rows[i][22] !== "NA"){
             Bio = rows[i][22].replace(new RegExp('@', 'g'), "<br>") + "<br>";}
           $("#Profile_"+RowIdx+"_Bio").append(Bio)
            
        }
       
      } // createProfilesFromTable
  //----------------------------------------------------------------------------------------------------
	  function setProfilePicture(ImageDiv, file){
        $.ajax({
             url:'/images/Photos/'+file,
             type:'HEAD',
             error: function()    { //file does not exist
                     $(ImageDiv).append("<img title='ProfilePicture' alt='ProfilePic' class='rsImg lazy' style='max-height:75px; max-width:50px' data-src='/images/Photos/Photo Coming Soon.jpg' src='/images/Photos/Photo Coming Soon.jpg'>")
             },
             success: function()  { //file exists
                     $(ImageDiv).append("<img title='ProfilePicture' alt='ProfilePic' class='rsImg lazy' style='max-height:75px; max-width:50px' src='/images/Photos/"+ file + "' data-src='/images/Photos/Photo Coming Soon.jpg'>")
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
	  function getCurrentFilteredRows(){
        var rows = tableRef._('tr', {"filter":"applied"});   
        var currentIDs = []
        for(var i=0; i < rows.length; i++) 
          currentIDs.push(rows[i][0]);

        return(currentIDs)

      } // currentSelectedIDS

 
 //----------------------------------------------------------------------------------------------------
    function drawBarplot(){
  
        d3.select("#MainGraph").select("svg").remove();
        var margin = {top: 40, right: 20, bottom: 300, left: 40, leftY:30},
             width = $(window).width() - 550 - margin.left - margin.right - margin.leftY,
            height = 700 - margin.top - margin.bottom;

        var formatPercent = d3.format(".0%");

        var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);        
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

//        var values = data.map(function(d){
//                          return d[6]})

        var temp = $("#PlotFeature")

          var Insts = [6,9,12,15,18]
          var values = []
       for (var row=0;row<data.length;row++){
          var Appts = []
          for(var i=0;i<Insts.length;i++){
            var inst = data[row][Insts[i]]
            if(inst != "" &  inst != "NA"){
              if(Appts.indexOf(inst) == -1) Appts.push(inst)
            }
          }
          if(Appts.length) values= values.concat(Appts)  
       }
      
        function getCounts(arrayList) {
             var frequency = {};

            for (var i=0;i<arrayList.length; i++) {
               frequency[arrayList[i]] = 0; };

             var uniques = arrayList.filter(function(value) {
               return ++frequency[value] == 1; })
           
           
               var CountMap = [];
               for (var i=0;i<uniques.length; i++) {
                 CountMap.push({Name: uniques[i], count: frequency[uniques[i]]});
              }
               $("#FilterInstitution :checkbox:checked").each(function() {
               if(uniques.indexOf($(this).val()) == -1) { CountMap.push({Name: $(this).val(), count: 0})  } });
        
               return CountMap
          //   return uniques.sort(function(a, b) {
         //       return frequency[b] - frequency[a];
         //   });
        };
        
        var groups = getCounts(values)
        
         var maxFreq = d3.max(groups, function(d){return d.count});

           x.domain(groups.map(function(d) { return d.Name; }))
           y.domain([0, maxFreq]);

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
//              .on('mouseover', tip.show)
//              .on('mouseout', tip.hide)

       

      function type(d) {
          d.count = +d.count;
          return d;
       }

}