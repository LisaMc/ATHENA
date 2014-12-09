var tableRef;

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
$(document).ready(function() {

//     var ColumnTitle = [{"sTitle": "Name", "sWidth": '50px'}, {"sTitle": "Education", "sWidth": '50px'}, {"sTitle": "JobTitle", "sWidth": '50px'}, {"sTitle": "Institution", "sWidth": '50px'}, {"sTitle": "Department", "sWidth": '50px'}, {"sTitle": "Site", "sWidth": '25px'}, {"sTitle": "Tumor.Type.Disease", "sWidth": '50px'}, {"sTitle": "keywords", "sWidth": '200px'}, {"sTitle": "Field", "sWidth": '50px'}, {"sTitle": "Title", "sWidth": '50px'}, {"sTitle": "Notes", "sWidth": '1000px'}]
	 var ColumnTitle = [{"sTitle":  "Last Name", "sWidth": '50px'}, {"sTitle": "First Name", "sWidth": '50px'}, {"sTitle": "Full Name", "sWidth": '50px'}, {"sTitle": "Degrees", "sWidth": '50px'}, {"sTitle": "Job Title 1", "sWidth": '50px'}, {"sTitle": "Primary Organization", "sWidth": '50px'}, {"sTitle": "Department 1", "sWidth": '50px'}, {"sTitle": "Job Title 2", "sWidth": '50px'}, {"sTitle": "Organization 2", "sWidth": '50px'}, {"sTitle": "Department 2", "sWidth": '50px'}, {"sTitle": "Job Title 3", "sWidth": '50px'}, {"sTitle": "Organization 3", "sWidth": '50px'}, {"sTitle": "Department 3", "sWidth": '50px'}, {"sTitle": "Job Title 4", "sWidth": '50px'}, {"sTitle": "Organization 4", "sWidth": '50px'}, {"sTitle": "Department 4", "sWidth": '50px'}, {"sTitle": "Job Title 5", "sWidth": '50px'}, {"sTitle": "Organization 5", "sWidth": '50px'}, {"sTitle": "Department 5", "sWidth": '50px'}, {"sTitle": "Phone Number", "sWidth": '50px'}, {"sTitle": "Email Address", "sWidth": '50px'}, {"sTitle": "", "sWidth": '50px'}, {"sTitle": "Websites", "sWidth": '50px'}, {"sTitle": "Videos", "sWidth": '50px'}, {"sTitle": "Organ Site", "sWidth": '50px'}, {"sTitle": "Designation", "sWidth": '50px'}, {"sTitle": "Institutional Affiliation", "sWidth": '50px'}, {"sTitle": "Focus Areas", "sWidth": '50px'}, {"sTitle": "Modified", "sWidth": '50px'}, {"sTitle": "Modified By", "sWidth": '50px'}, {"sTitle": "Member Photos", "sWidth": '50px'}, {"sTitle": "FH Primary", "sWidth": '50px'}, {"sTitle": "Departments and Divisions", "sWidth": '50px'}, {"sTitle": "Converis ID", "sWidth": '50px'}, {"sTitle": "Item Type", "sWidth": '50px'}, {"sTitle": "Path", "sWidth": '50px'}]
 		 $("#DataTable").dataTable({
       		  "aoColumns": ColumnTitle,
         })   // dataTable
         .fnAdjustColumnSizing(); 
         ;

 	tableRef = $("#DataTable").dataTable();
    $("img").unveil(200);
    
//	d3.json("data/PeopleDataTable_5-14-14.json", function(json){
	d3.json("data/RAINIER_members_11-20-14.json", function(json){
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
             createProfileTemplate();
           })
        $("#VisualizeSpan").click(function(){ 
             toggle_visibility("VisualizeSpan", "VISUALIZEdiv");

             $('.SliderThumbnails').slick({
               infinite: true,
               slidesToShow: 3,
               slidesToScroll: 1
             });
             
//             $("#BarplotThumb").click(drawBarplot)
           })
       $("#HomeSpan").click(function(){ 
             toggle_visibility("", "HOMEdiv");
           })
         
       
        tableRef.fnSetColumnVis( 2, false );
        for(i=7;i<36;i++){
           tableRef.fnSetColumnVis( i, false );
        }
        
        document.getElementById("NumberOfResultsDiv").innerHTML = tableRef._('tr', {"filter":"applied"}).length
        document.getElementById("SearchStringDiv").innerHTML = " results for: " + "(all people)";
        
	});  //end json
	

		
}); //document.ready

//----------------------------------------------------------------------------------------------------
 window.onload = function() {
 
      var FreeForm = document.getElementById("QueryFreeForm");
      var FieldForm = $("#FilterField");
      var InstitutionForm = $("#FilterInstitution");
    
      FieldForm.chosen({max_selected_options: 17});
      FieldForm.chosen().change(SearchAndFilterResults);
      InstitutionForm.chosen({max_selected_options: 3});
      InstitutionForm.chosen().change(SearchAndFilterResults);

      //----------------------------------------------------------------------------------------------------
      FreeForm.onsubmit = function(e) {
        e.preventDefault();
        SearchAndFilterResults() 
        return false;
      }
   } //window.onload 
	
  //----------------------------------------------------------------------------------------------------	
	function toggle_visibility(activeSpanID, activeDivID){
        var els = document.getElementsByClassName('MainFrameDiv');
        for(var i=0; i<els.length; ++i){     //set all displays to none
            els[i].style.display =  'none';
        };

        $(".sidebar_nav_selected").attr("class", "sidebar_nav_not_selected")  //deselect active nav
        
        document.getElementById(activeDivID).style.display = 'block'  //then activate a single div
        if(activeSpanID != "") document.getElementById(activeSpanID).className = "sidebar_nav_selected" //and select the navigation span

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
      tableRef.fnFilter("", 5);  // clear Inst filter
      tableRef.fnFilter("", 24); // clear field filter

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
         var rows = tableRef._('tr', {"filter":"applied"});   
       
        if(wordArray.length == 0){
           document.getElementById("SearchStringDiv").innerHTML = " results for: " + "(all people)";
        }else{
           document.getElementById("SearchStringDiv").innerHTML = " results for: " + searchString;
           SearchTableByStrings(wordArray); 
        }  
        
        FilterInstitution_Selection();
        FilterField_Selection();
  
        createProfilesFromTable();

   }

  //----------------------------------------------------------------------------------------------------
   function createProfileTemplate(){
   
        $("#ProfileTemplate").append("<div id='TemplateBio' style='background:#fff;color:#000;height:100%; overflow-x:auto'></div>")
        var TemplateBio = $("#TemplateBio")
        TemplateBio.append("<form id='Profile_template' action='MAILTO:lmcferri@fredhutch.org?subject=Updated ATHENA Profile'' method='post' enctype='text/plain' style='clear:both;margin-bottom:5px;border: solid black 2px; border-left:none; border-right:none; width:100%;height:100%; overflow-x:auto; line-height:2em  '>")
          $("#Profile_template").append("<div id=Profile_template_Picture style='float:left; min-width:10%;margin-left:5px;margin-right:5px;margin-top:5px';></div>")
          $("#Profile_template").append("<div id=Profile_template_Info style='float:left; width:25%;margin-top:5px'></div>")
          $("#Profile_template").append("<div id=Profile_template_Bio style='float:right; width:60%; position:relative; text-align:justify; margin-right:10px; height:100%'></div>")
          $("#Profile_template").append("<input type='submit' class='SubmitProfile' value='Send' style='float:right;margin-right:5px; margin-top:5px;margin-bottom:5px' >")
          $("#Profile_template").append("<input type='reset' class='SubmitProfile' value='Reset' style='float:right;margin-right:5px; margin-top:5px;margin-bottom:5px' >")
          TemplateBio.append("</form>")  //end individual profile

          setProfilePicture("#Profile_template_Picture", "Photo Coming Soon.jpg")

          var Name = "<b>First Name*<input value='' class='TemplateBioSearchbox' name='First name' required style='width:50%;float:right' placeholder='Grace'><br/> Last Name* <input value=''class='TemplateBioSearchbox' name='Last name' style='width:50%;float:right' required placeholder='Hopper'></b><br/>Degrees<input value='' class='TemplateBioSearchbox' name='Degrees'  style='width:50%;float:right' placeholder='PhD, MD'><br/>";
          $("#Profile_template_Info").append(Name + "<br>")
          
          var Title = "Institution<input value='' class='TemplateBioSearchbox' name='Institution' style='width:50%;float:right' placeholder='Yale'><br/>Title<input value='' name='Title' class='TemplateBioSearchbox'  style='width:50%;float:right' placeholder='Associate Professor'>"
          $("#Profile_template_Info").append(Title)
          
          var Bio = "Bio<textarea class='TemplateBioSearchbox' value='' type='text' name='Bio' style='width:90%;float:right; min-height:150px;margin-top:5px' placeholder='Dr. Hopper was an American computer scientist and invented the first compiler for a computer programming language.  She is credited for popularizing the term debugging for fixing computer glitches, inspired by an actual moth removed from the computer (from Wikipedia).'></textarea><br>"
           $("#Profile_template_Bio").append(Bio)
              

   }

  //----------------------------------------------------------------------------------------------------
	  function createProfilesFromTable(){
        var rows = tableRef._('tr', {"filter":"applied"});   
        $('#SearchResults').html('')
        $("#SearchResults").append("<div id='ProfileResults' style='background:#fff;color:#000;height:100%; overflow-x:auto'></div>")
        var ProfileResults = $("#ProfileResults")
      
        document.getElementById("NumberOfResultsDiv").innerHTML = rows.length

        if(rows.length == 0){
           ProfileResults.append("Your search did not match any profiles.")
           return;
        }
        
        //ALTER FOR LAZY LOADING or pagination
        for(var i=0; i < rows.length; i++){
          ProfileResults.append("<div id=Profile_"+ i+ " style='clear:both;margin-bottom:5px;border: solid black 2px; border-left:none; border-right:none; width:100%;height:100%; overflow-x:auto  '>")
          $("#Profile_"+i).append("<div id=Profile_"+i+"_Picture style='float:left; min-width:10%;margin-left:5px;margin-right:5px;margin-top:5px';></div>")
          $("#Profile_"+i).append("<div id=Profile_"+i+"_Info style='float:left; width:25%;margin-top:5px'></div>")
          $("#Profile_"+i).append("<div id=Profile_"+i+"_Bio style='float:right; width:60%; position:relative; text-align:justify; margin-right:10px'></div>")
     
          ProfileResults.append("</div>")  //end individual profile

          setProfilePicture("#Profile_"+i+"_Picture", rows[i][30])

          var Name = "<b>" + rows[i][1]+ " " + rows[i][0] + "</b>";
          if(rows[i][3] !== ""){ Name= Name.concat(", " + rows[i][3]); }
          $("#Profile_"+i+"_Info").append(Name + "<br>")
          
          var Title = ""
          if(rows[i][4] !== ""){ Title = rows[i][4] + "<br>"}
          if(rows[i][5] !== ""){ Title = Title + rows[i][5] + "<br>"}
          $("#Profile_"+i+"_Info").append(Title)
          
          var Bio = ""
          if(rows[i][21] !== ""){
             Bio = rows[i][21].replace(new RegExp('@', 'g'), "<br>") + "<br>";}
           $("#Profile_"+i+"_Bio").append(Bio)
            
        }
        
      } // createProfilesFromTable

  //----------------------------------------------------------------------------------------------------
	  function setProfilePicture(ImageDiv, file){
        $.ajax({
             url:'/images/Photos/'+file,
             type:'HEAD',
             error: function()    { //file does not exist
                     $(ImageDiv).append("<img title='ProfilePicture' alt='ProfilePic' class='rsImg' style='max-height:125px; max-width:100px' src='/images/Photos/Photo Coming Soon.jpg'>")
             },
             success: function()  { //file exists
                     $(ImageDiv).append("<img title='ProfilePicture' alt='ProfilePic' class='rsImg' style='max-height:125px; max-width:100px' src='/images/Photos/"+ file + "' data-src='/images/Photos/Photo Coming Soon.jpg'>")
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
    function FilterField_Selection(){

       var selectedFieldarray = []
       var e = document.getElementById("FilterField");
       for (var i = 0; i < e.options.length; i++) {
           if(e.options[i].selected ==true){
               selectedFieldarray.push(e.options[i].value)
             }
        }
  
        if(selectedFieldarray.length == 0){
         document.getElementById("ReportFieldFilterSpan").innerHTML = "";
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

      document.getElementById("ReportFieldFilterSpan").innerHTML = "<i> specializing in </i>" + printedString 

      tableRef.fnFilter(filterField_String, 24, true, false);  //searches "Organ Site" column (24) using RegEx (true) without smart filtering (false)
    
    }
  //----------------------------------------------------------------------------------------------------
    function FilterInstitution_Selection(){
 
       var selectedInstitutionarray = []
       var e = document.getElementById("FilterInstitution");
        for (var i = 0; i < e.options.length; i++) {
           if(e.options[i].selected ==true){
               selectedInstitutionarray.push(e.options[i].value)
             }
        }

        if(selectedInstitutionarray.length == 0){
         document.getElementById("ReportInstFilterSpan").innerHTML = "";
         return;
        }
        
        var filterInstitution_String = selectedInstitutionarray.join("|");
        var printedString = "";
        if(selectedInstitutionarray.length == 1){
           printedString = selectedInstitutionarray.pop()
        }else{
           var lastWord= selectedInstitutionarray.pop()
           printedString = selectedInstitutionarray.join(", ")
           printedString += ", or " + lastWord
        } 
 
       document.getElementById("ReportInstFilterSpan").innerHTML = "<i> from </i>" + printedString 

       tableRef.fnFilter(filterInstitution_String, 5, true, false);  //searches "Primary Institution" column (5) using RegEx (true) without smart filtering

}    

 //----------------------------------------------------------------------------------------------------
    function drawBarplot(){
  
        var margin = {top: 40, right: 20, bottom: 30, left: 40},
             width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var formatPercent = d3.format(".0%");

        var x = d3.scale.ordinal()
                  .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
                  .range([height, 0]);

        var xAxis = d3.svg.axis()
                      .scale(x)
                      .orient("bottom");

        var yAxis = d3.svg.axis()
                      .scale(y)
                      .orient("left")
                      .tickFormat(formatPercent);

//        var tip = d3.tip()
//                    .attr('class', 'd3-tip')
//                    .offset([-10, 0])
//                    .html(function(d) {
//                    return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
//                  })

        var svg = d3.select("MainGraph").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//           svg.call(tip);

        var data = tableRef._('tr', {"filter":"applied"});   

           x.domain(data.map(function(d) { return d.Degrees; }));
           y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

           svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

           svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
              .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Frequency");

           svg.selectAll(".bar")
              .data(data)
              .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d.letter); })
              .attr("width", x.rangeBand())
              .attr("y", function(d) { return y(d.frequency); })
              .attr("height", function(d) { return height - y(d.frequency); })
//              .on('mouseover', tip.show)
//              .on('mouseout', tip.hide)

       

      function type(d) {
          d.frequency = +d.frequency;
          return d;
       }

}