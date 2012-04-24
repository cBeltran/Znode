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
	
	compWin.fadeIn();
  });
  $("#globalV").click(function(){
	openWin.fadeOut();
	sourceWin.fadeOut();
	inhWin.fadeOut();
	compWin.fadeOut();
	
	var temp = $("#glbFiles .srcFile");

	temp.siblings().each(function(){
		// go into each file and search for globals
		var name = $(this).text();
		//alert(name);
		jQuery.get("MainMenu/" + name + ".js",function(data){
			 var indexOfPotVar = new Array();
			 indexOfPotVar[0] = 0;
			 var indexOfFunction = data.indexOf("function");

			do{
				var length = indexOfPotVar.length;
				//var indexStart = indexOfPotVar['length']+1;
				var indexStart = indexOfPotVar.pop();
				indexOfPotVar.push(indexStart);
				indexStart++;
				var tempIndexOfVar = data.indexOf("var",indexStart);
				indexOfPotVar.push(tempIndexOfVar);

				if(tempIndexOfVar < indexOfFunction && tempIndexOfVar != -1)
				{
					// get index of equals
					var indexEquals = data.indexOf("=",tempIndexOfVar);
					var glbAtrName = data.slice(tempIndexOfVar+3,indexEquals-1);

					$("#glbFiles .srcFile").each(function(){
						var temps = $(this).text();
						//var temps = $("#glbFiles .srcFile").text();
						//alert(temps);
						if (temps == name)
						{							
							var cloned = $(this).clone().append(glbAtrName);
							$(this).after(cloned);
							
						}
						else
						{
							// cant remove here
							//$(this).remove();
						}

					});
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
		});
	});
	
	glblWin.fadeIn();
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
	if ($(this).parent().is('#srcFiles'))
	{
		if(loadedPanel == 0)
		{
			$("[id^=srcViewCode]").first().load("MainMenu/" + name + ".js");
			loadedPanel = 1;
		}
		else
		{
			$("[id^=srcViewCode]").last().load("MainMenu/" + name + ".js");
			loadedPanel = 0;
		}
	}
	else if ($(this).parent().is('#inhFiles'))
	{
		selectedForInh = name;
		$(this).css({"background-color": "#ededed"});
		
		// process for SUPERCLASS
		$("#superClass").empty();
		$("#superClass").text("SuperClass for " + selectedForInh + ":");
		
		jQuery.get("MainMenu/" + name + ".js",function(data){

		var indexOfSuperClass = data.indexOf("prototype = new");
		//alert(indexOfSuperClass);
		if(indexOfSuperClass > 0)
		{
			var superClassName = data.slice(indexOfSuperClass+16,data.length-1);
			$("#superClass").append("<br />" + superClassName);
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
		
		var emptySubClasses = 0;
		var found = 0;
		$(this).siblings().each(function(){
			
			//returns each name
			var className = $(this).text();
			//found = 1;
			$.get("MainMenu/" + className + ".js",function(data){
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
					$("#subClass").append("<br />" + className);
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
		// TODO handle the clicked event for globals
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
});