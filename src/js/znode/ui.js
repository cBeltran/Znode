$(function(){
  
  var graph = new NodeGraph();
  
  // consider moving to NodeGraph
  $("#canvas").mouseup(function(e){
     if (openWin.css("display") == "none"){
       var children = $(e.target).children();
       if (children.length > 0){
         var type = children[0].tagName;
         if (type == "desc" || type == "SPAN"){
           graph.addNodeAtMouse();
         }
       }
     }
  });
  
  // ui code
  var openWin = $("#openWin");
  openWin.hide();
  //CB
  $(document).ready(function () 
  {
	// preload the files list for global view 
	var glbList = $("#glbFiles");
	glbList.html("<div>loading...<\/div>");
	glbList.load("json/sourcefiles.php?"+Math.random()*1000000);
  });

  var sourceWin = $("#sourceWin");
  sourceWin.hide();
  var inhWin = $("#inhWin");
  inhWin.hide();
  var compWin = $("#compWin");
  compWin.hide();
  var glblWin = $("#glblWin");
  glblWin.hide();
 
  $(".btn").mouseenter(function(){
    $(this).animate({"backgroundColor" : "white"}, 200);
  }).mouseleave(function(){
    $(this).animate({"backgroundColor" : "#efefef"});
  });
  $("#clear").click(function(){
    graph.clearAll();
  });
  $("#help").click(function(){
    window.open("http://www.zreference.com/znode", "_blank");
  });
  
  $("#save").click(saveFile);
  // CB
  $("#znodeV").click(function(){
	openWin.fadeOut();
	sourceWin.fadeOut();
	inhWin.fadeOut();
	compWin.fadeOut();
	glblWin.fadeOut();
  });
  $("#sourceV").click(function(){
  	openWin.fadeOut();
	compWin.fadeOut();
	glblWin.fadeOut();
	inhWin.fadeOut();
    var fileList =  $("#srcFiles");
    fileList.html("<div>loading...<\/div>");
	sourceWin.fadeIn();
    fileList.load("json/sourcefiles.php?"+Math.random()*1000000);

  });
  $("#inheritanceV").click(function(){
	openWin.fadeOut();
	sourceWin.fadeOut();
	compWin.fadeOut();
	glblWin.fadeOut();
	var inhFileList =  $("#inhFiles");
    inhFileList.html("<div>loading...<\/div>");
	inhWin.fadeIn();
    inhFileList.load("json/sourcefiles.php?"+Math.random()*1000000);
  });
  $("#compositionV").click(function(){
  	openWin.fadeOut();
	sourceWin.fadeOut();
	inhWin.fadeOut();
	glblWin.fadeOut();
	//var compList;
	//compList.load("json/sourcefiles.php?"+Math.random()*1000000);//,function(data){
	//	alert(compList);
	//});
	compWin.fadeIn();
	var temp = $("#glbFiles .srcFile");
	temp.parent().each(function(){
		var className = $(this).text();
		alert(className);
	});
  });
  $("#globalV").click(function(){
	openWin.fadeOut();
	sourceWin.fadeOut();
	inhWin.fadeOut();
	compWin.fadeOut();
	
	//var glbList = $("#glbFiles");
	//glbList.html("<div>loading...<\/div>");
	//glbList.load("json/sourcefiles.php?"+Math.random()*1000000);
	//glblWin.fadeIn();
	//glblWin.fadeOut();
	
	var temp = $("#glbFiles .srcFile");
	//var temp = $(".srcFile").parents("#glbFiles").text();
	//var temp = $(".srcFile");
	temp.siblings().each(function(){
		// go into each file and search for globals
		var name = $(this).text();
		//alert(name);
		jQuery.get("source/" + name + ".js",function(data){
			 var indexOfPotVar = new Array();
			 indexOfPotVar[0] = 0;
			 var count = 0;
			 var prevCount = 0;
			 var lengthMinusOne = 0;
			 var indexOfFunction = data.indexOf("function");
			 //var tempy = data.indexOf("var");
			 //alert("var " + tempy);
			 //alert("function = " + indexOfFunction);
			do{
				lengthMinusOne = indexOfPotVar.length - 1;
				var length = indexOfPotVar.length;
				//alert("array len = " +  lengthMinusOne);
				//var indexStart = indexOfPotVar['length']+1;
				var indexStart = indexOfPotVar.pop();
				indexOfPotVar.push(indexStart);
				indexStart++;
				var tempIndexOfVar = data.indexOf("var",indexStart);
				//alert("index start= " + indexStart);
				//indexOfPotVar['count'] = tempIndexOfVar;
				indexOfPotVar.push(tempIndexOfVar);
				//prevCount = count;
				count = count + 1;
				//alert("var " + tempIndexOfVar);
				//alert("var = " + indexOfPotVar[length]);
				//alert("count = " + count);
				if(tempIndexOfVar < indexOfFunction && tempIndexOfVar != -1)
				{
					// get index of equals
					var indexEquals = data.indexOf("=",tempIndexOfVar);
					var glbAtrName = data.slice(tempIndexOfVar+3,indexEquals-1);
					//alert("add this elem to tree" + glbAtrName);
					//$(this).after(glbAtrName);
					//$("#glbFiles .srcFile").append(glbAtrName);
					//$("#glbFiles .srcFile").append(function(){
					$("#glbFiles .srcFile").each(function(){
						var temps = $(this).text();
						//var temps = $("#glbFiles .srcFile").text();
						//alert(temps);
						if (temps == name)
						{
							alert(name);
							//$(this).add(glbAtrName,document);
							//$(this).append(glbAtrName);
							//$(this).append(glbAtrName);
							
							var cloned = $(this).clone().append(glbAtrName);
							$(this).after(cloned);
							
							//$(this).attr('id',HELP);

							//.append(glbAtrName);
							//this.srcFile = this.srcFile.add(glbAtrName);
						}
						else
						{
							//$(this).remove();
						}
						//return ' 4';
					});
					//jQuery(this).append(glbAtrName);
					//name.append(glbAtrName);
				}
				// ELSE IF didnt find any globals
				else if (tempIndexOfVar == -1)
				{
					$("#glbFiles .srcFile").each(function(){
						var temps = $(this).text();
						if (temps == name)
						{
							// remove element
							$(this).remove();
						}
					});
				}
			}while(tempIndexOfVar != -1);
			//var indexOfFunction = data.indexOf("function");
			//var indexOfPotVar = data.indexOf("var");
			//alert(indexOfFunction);
			//alert(indexOfPotVar);
			// IF found variables AND it is before the Function declaration
			/*if(indexOfPotVar > 0 && indexOfPotVar < indexOfFunction)
			{
				// add to tree and eventually delete file name
				
				//var superClassName = data.slice(indexOfSuperClass+16,data.length-1);
				alert("Add to Tree");
			}
			else
			{

			}*/
		});
	});
	
	glblWin.fadeIn();
	//alert("HI");
	//alert(temp.siblings());
	//alert(glbList.find(".srcFiles").next().text());
	//alert(glbList.text());
	//alert(glbList.siblings().text());
  });  
  
  
  function saveFile(){
    var name = filename.val();
    if (name == "" || name == nameMessage){
      alert("Please Name Your File");
      filename[0].focus();
      return;
    }
    $.post("json/save.php", {data:graph.toJSON(), name:name}, function(data){
      alert("Your file was saved.");
    });
  }
  
  $("#canvas").mousedown(function(){
    openWin.fadeOut();
  });
  
  $("#open").click(function(){
    var fileList =  $("#files");
    fileList.html("<div>loading...<\/div>");
    openWin.fadeIn();
    fileList.load("json/files.php?"+Math.random()*1000000);
  });
  
  var nameMessage = "Enter your file name";
  var filename = $("#filename").val(nameMessage);

  filename.focus(function(){
    if ($(this).val() == nameMessage){
      $(this).val("");
    }
  }).blur(function(){
    if ($(this).val() == ""){
      $(this).val(nameMessage);
    }
  });
  
  $("#nameForm").submit(function(e){
    e.preventDefault();
    saveFile();
  });
  
  $(".file").live('click', function() {
    var name = $(this).text();
    $.getJSON("files/" + name + ".json", {n:Math.random()}, function(data){
       graph.fromJSON(data);
       filename.val(name);
    });
  }).live('mouseover', function(){
    $(this).css({"background-color": "#ededed"});
  }).live("mouseout", function(){
    $(this).css({"background-color": "white"});
  });
  
  //CB
  var loadedPanel = 0;
  var selectedForInh = 0;
  $(".srcFile").live('click', function() {
    var name = $(this).text();
	// try to toggle, doesnt load bc there is a next
	//if($("[id^=srcViewCode]").parent().next().length == 0) {
	//$("#srcViewCode1").load("source/" + name + ".js");}
	if ($(this).parent().is('#srcFiles'))
	{
		if(loadedPanel == 0)
		{
			$("[id^=srcViewCode]").first().load("source/" + name + ".js");
			loadedPanel = 1;
		}
		else
		{
			$("[id^=srcViewCode]").last().load("source/" + name + ".js");
			loadedPanel = 0;
		}
	}
	else if ($(this).parent().is('#inhFiles'))
	{
		// make previously clicked white, doesnt work
		/*if(selectedForInh != name)
		{
			$(selectedForInh).css({"background-color": "white"});
			alert(selectedForInh);
		}*/
		selectedForInh = name;
		$(this).css({"background-color": "#ededed"});
		
		// process for SUPERCLASS
		$("#superClass").empty();
		$("#superClass").text("SuperClass for " + selectedForInh + ":");
		//$("#superClass").append("SuperClass23:");
		
		//$("#superClass").append().load("source/" + name + ".js");
		// load hangs the rest
		//$.load("source/" + name + ".js"),function(data){	};
		
		//var superClassName = $(loadedFile).contents().find("prototype = new");
		//var superClassName = $("loadedFile:contains('new')");
		//var superClassName = $("loadedFile").find("prototype");
		//var superClassName = loadedFile.find('prototype');
		//$("#superClass").append("FOUND");
		/*var index = 1;//loadedFile.text.indexOf("prototype");
		if(index != -1) {
			$("#superClass").append("FOUND");
		}
		else
		{
			$("#superClass").append("NOTFOUND");
		}*/
		
		jQuery.get("source/" + name + ".js",function(data){
		//alert(data);
		//var superClassName = $('data:contains("prototype = new")');
		//var superClassName = $(data).search(/prototype = new/);
		//returns nothing
		//var superClassName = $(data).find('prototype = new').text();
		var indexOfSuperClass = data.indexOf("prototype = new");
		//alert(indexOfSuperClass);
		if(indexOfSuperClass > 0)
		{
			var superClassName = data.slice(indexOfSuperClass+16,data.length-1);
			//alert(superClassName);
		//$("#superClass").append("HI");
			$("#superClass").append("<br />" + superClassName);
		//$("#superClass").append("HI2");
		}
		else
		{
			// selected has no super classes
			$("#superClass").append("<br /> NONE");
		}
		});
		
		// ************************process for SUBCLASS
		$("#subClass").empty();
		$("#subClass").text("SubClasses for " + selectedForInh + ":");
		var inhFileList =  $("#inhFiles");
		
		// show first text line SuperClass ...
		//alert(inhFileList.next().text());
		
		// shows all siblings not including self
		//alert($(this).siblings().text());
		var emptySubClasses = 0;
		var found = 0;
		$(this).siblings().each(function(){
			
			//returns each name
			var className = $(this).text();
			//found = 1;
			$.get("source/" + className + ".js",function(data){
				var indexOfSubClass = data.indexOf("prototype = new " + name);
				//alert(data);
				// IF found
				if(indexOfSubClass > 0)
				{
					found = 1;
					emptySubClasses = 100;
					//alert(emptySubClasses);
					//var superClassName = data.slice(indexOfSuperClass+16,data.length-1);
					//alert(className);
				//$("#superClass").append("HI");
					$("#subClass").append("<br />" + className);
				//$("#superClass").append("HI2");
				}

			});
			//alert(emptySubClasses);
		});
		//alert("2 " + emptySubClasses);
		if(emptySubClasses < 100)
		{
			// TODO doesnt work, always puts 'NONE'
			// selected has no super classes
			//$("#subClass").append("<br /> NONE");
			//alert($(this).text());
		}
		//alert(emptySubClasses);
	}
		else if ($(this).parent().is('#glbFiles'))
	{
		alert(name);
	}
  }).live('mouseover', function(){
		$(this).css({"background-color": "#ededed"});
  }).live("mouseout", function(){
	if (selectedForInh != $(this).text())
	{
		$(this).css({"background-color": "white"});
	}
  });
  
  // might not be needed
  $(".inhList").live('click', function() {
    var name = $(this).text();
	// try to toggle, doesnt load bc there is a next
	//if($("[id^=srcViewCode]").parent().next().length == 0) {
	// why not showing in correct element?
	$("#superClass").load("source/" + name + ".js");
  }).live('mouseover', function(){
    $(this).css({"background-color": "#ededed"});
  }).live("mouseout", function(){
    $(this).css({"background-color": "white"});
  });
  
});