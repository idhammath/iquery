$(function(){
	
	function ClearConsole(){
		if(console && console.clear){
			console.clear();
		}
	}			
	function LogConsole(message){
		if(console && console.log){
			console.log(message);
		}
	}
	function ClearLog(element){
		if(element){
			$(element).html("");
		}
		else {
			ClearConsole();
		}
	}
	function Log(element, message, enableCount){
		if(message){			
			if(enableCount){
				var count = $(element).data("LogCount");
				if(!count)
					count = 0;
				$(element).html(count++ + " --> " + message + "<br />" + $(element).html()).data("LogCount", count); 
			}
			else{
				$(element).html(message + "<br />" + $(element).html()); 
			}
		}
		else {
			LogConsole(element);
		}
	}
	function GetElementInfo(element){
		var $element = $(element);
		 if ($element[0].tagName) {
			return $element[0].tagName.toLowerCase()
					+ ($element.attr('id') ? ('#' + $element.attr('id')) : '')
					+ ($element.attr('class') ? '.' + $element.attr('class').replace(/ /g, '.') : '');
		}
		else {
			return $element[0].nodeName;
		}
	}
	
	/* Forward Mouse Events */
	$("#ForwardEventsOverlay").forwardMouseEvents();
	$("#ForwardEventsElement1,#ForwardEventsElement2").bind('mouseover mouseout click dblclick mouseup mousedown',function (e) {				
		
		// Skip events that moves to/from overlay elements
		if(e.type == 'mouseout' && e.relatedTarget === $("#ForwardEventsOverlay")[0]) 
			return;
		if(e.type == 'mouseover' && e.relatedTarget === $("#ForwardEventsOverlay")[0])
			return;
		Log("#ForwardEventsLog", e.type + " "+ $(e.target).attr('id') + 
				" --> ClientX :  " + e.clientX + " | ClientY : " + e.clientY + 
				" | PageX : " + e.pageX + " | PageY : " + e.pageY + 
				" | CurrentTarget : "+ $(e.currentTarget).attr('id') + " | RelatedTarget : " + $(e.relatedTarget).attr('id'), true);
	});
	
	/* Movable */
	var $movableContainer = $(".MovableContainer"),
		maxWidth = $movableContainer.innerWidth() -  2 * $(".MovableElement:eq(0)").outerWidth(),
		maxHeight = $movableContainer.innerHeight() -  4 * $(".MovableElement:eq(0)").outerHeight();
	$movableContainer.selectable({
		filter : ".MovableElement"
	}).movable({
		filter : ".iq-selectable-selected"             
	}).find(".MovableElement").each(function(){
		$(this).css('top', $.iq.rand(maxHeight)).css('left', $.iq.rand(maxWidth));
	});
	
	/* No Select */
	$("#NoSelectExample").noSelect();
	
	/* Resizable */
	$("#ResizableElementBottomRight").resizable({
		bottom : true,
		right : true,
		minWidth : 75,
		minHeight : 75,
		maxWidth : 225,
		maxHeight : 125
	});
	 
	$("#ResizableElementTopLeft").resizable({
		top : true,
		left : true,
		minWidth : 75,
		minHeight : 75,
		maxWidth : 225,
		maxHeight : 125
	});
	
	/* Restrict Text */
	$("#NumericInput").restrictText({ filter: "numeric" });
	$("#AlphaNumericInput").restrictText({ filter: "alphanumeric" });
	$("#DecimalInput").restrictText({ filter: "decimal" });
	$("#HexInput").restrictText({ filter: "hex" });
	$("#HexInputWithHash").restrictText({ filter: /^#[A-Fa-f0-9]{0,6}$/ });	 
	$("#TextOnly").restrictText({ filter: "alphabetic" });
	
	/* Scrollable */
	$("#ScrollableExample").scrollable({
		autoReset : true 
		/* autoReset is required because if the element is not visible during the page load, scrollbars will not be appearing. 
		Or manually reset function has to be callsed */
	});
	
	/* Set Cookie */
	var cookieId = $.cookie("CookieCount") || 1;
	$("#setCookie").click(function(){
		$.cookie("Cookie"+cookieId, "CookieValue"+cookieId);
		$.cookie("CookieCount", cookieId);
		cookieId++;
	});
	 
	$("#getCookie").click(function(){
		if(cookieId > 1){
			var id = $.iq.rand(1, cookieId-1);
			alert($.cookie("Cookie"+ id));
		}
		else {
			alert("No cookies are set");
		}		
	});
	 
	$("#getAllCookie").click(function(){
		var cookies = $.cookie();
		$.each(cookies, function(key,value){
			alert(key + " " + value);
		});
	});
		
	/* CSS Rule */
	var $link = $("link[href*='/demos.css']");
 
	$("#btnSetBG").click(function () {
		$link.cssRule("rule", "#CssRuleExampleElement", 'background', '#EEEEEE');
	});
	 
	$("#btnGetBG").click(function () {
		alert($link.cssRule("rule", "#CssRuleExampleElement", 'background'));
	});
	
	$("#btnDeleteStyle").click(function () {
		$link.cssRule("deleteStyle", "#CssRuleExampleElement", ['background','width']);
	});
	
	$("#btnAddRule1").click(function(){
		$link.cssRule("rule", ".CssRuleAddRule1{ border: solid 1px black}");
	});
	
	$("#btnDeleteRule").click(function () {
		$link.cssRule("deleteRule", "#CssRuleExampleElement");
	});
	 
	$("#btnCleanRule").click(function () {
		$link.cssRule("clean", ".CssRuleAddRule1");
	});
	
	/* Class Utilities */
	$("#btnEditClass1").click(function () {
		$("#EditClass1").editClass("BackgroundClass", "BorderClass");
	});	 
	$("#btnEditClass2").click(function () {
		$("#EditClass2").editClass("BackgroundClass", "BorderClass");
	});
	
	$("#btnSwapClass1").click(function () {
		$("#SwapClass1").swapClass("BackgroundClass", "BorderClass");
	});	 
	$("#btnSwapClass2").click(function () {
		$("#SwapClass2").swapClass("BackgroundClass", "BorderClass");
	});
	
	$("#FocusClass1").focusClass("BackgroundClass");
	$("#FocusClass2").focusClass("BackgroundClass", "iq-example");
	
	$("#HoverClass1").hoverClass("BackgroundClass");
	$("#HoverClass2").hoverClass("BackgroundClass", "iq-example");
	
	/* Outer Html */
	$("#GetOuterHtml").click(function(){
		alert($("#OuterHtmlExample").outerHtml());
	});
	
	/* Is Child Of */
	$("#GetIsChildOf").click(function(){
		alert($("#IsChildOfExampleSubSubElement").isChildOf("#IsChildOfExample"));
	});
	
	/* Prepend 0 */
	$("#PrependZeroOutput").text($.iq.prepend0(678, 6));
	
	/* Random Numbers */
	$("#Random1").click(function () {          
    var randomNumbers = '<table border="1" cellpadding="2" cellspacing="0"><tbody><tr><td>Random Number</td><td>' +
								$.iq.rand() +
							'</td></tr><tr><td>Random Number between 0 and 2</td><td>' +
								$.iq.rand(2) +
							'</td></tr><tr><td>Random Number between 5 and 10</td><td>' +
								$.iq.rand(5, 10) +
							'</td></tr></tbody></table>';
		$("#divRandom1").html(randomNumbers);
	}).click();
	
	/* Trim */
	$("#Trim1").click(function () {
		alert("'" + $.iq.trim("    SomeString    ") + "'");
	});
	$("#Trim2").click(function () {
		alert("'" + $.iq.trim("||||SomeString||||", '|') + "'");
	});
	$("#Trim3").click(function () {
		alert("'" + $.iq.trim("    ||||SomeString||||    ", '|', true) + "'");
	});  
	
	/* Trim Start */
	$("#TrimStart1").click(function () {
		alert("'" + $.iq.trimStart("    SomeString    ") + "'");
	});
	$("#TrimStart2").click(function () {
		alert("'" + $.iq.trimStart("||||SomeString||||", '|') + "'");
	});
	$("#TrimStart3").click(function () {
		alert("'" + $.iq.trimStart("    ||||SomeString||||    ", '|', true) + "'");
	});
	
	/* Trim End */
	$("#TrimEnd1").click(function () {
		alert("'" + $.iq.trimEnd("    SomeString    ") + "'");
	});
	$("#TrimEnd2").click(function () {
		alert("'" + $.iq.trimEnd("||||SomeString||||", '|') + "'");
	});
	$("#TrimEnd3").click(function () {
		alert("'" + $.iq.trimEnd("    ||||SomeString||||    ", '|', true) + "'");
	});
	
	/* Key Value */
	var inputObj = {
			Parent1: {
				Child1: {
					SubChild11: 'SubChild11Value',
					SubChild12: 'SubChild12Value',
					SubChild13: 'SubChild13Value'
				},
				Child2: {
					SubChild21: 'SubChild21Value'
				}
			},
			Parent2: 'Parent2Value'
		},
		updateKeyValueSpan = function () {
			$("#KeyValueSpan").text($.toJSON(inputObj));
		};
 
	updateKeyValueSpan();
	 
	$("#KeyValue1").click(function () {
		alert($.iq.keyValue(inputObj, "Parent1.Child1.SubChild13"));
	});
	 
	$("#KeyValue2").click(function () {
		var newValue = "Parent1.Child1.SubChild13Value" + $.iq.rand(100),
			oldValue = $.iq.keyValue(inputObj, "Parent1.Child1.SubChild13", newValue);
		alert("'Parent1.Child1.SubChild13' value changed from '" + oldValue + "' to '" + newValue + "'");
		updateKeyValueSpan();
	});
	 
	$("#KeyValue3").click(function () {
		alert($.iq.keyValue(inputObj, "Parent3.Child1.SubChild31"));
	});
	 
	$("#KeyValue4").click(function () {
		var newValue = "Parent3.Child1.SubChild31Value" + $.iq.rand(100),
			oldValue = $.iq.keyValue(inputObj, "Parent3.Child1.SubChild31", newValue);
		alert("'Parent3.Child1.SubChild31' value changed from '" + oldValue + "' to '" + newValue + "'");
		updateKeyValueSpan();
	});
	 
	$("#KeyValue5").click(function () {
		var newValue = { Child1: { SubChild21: 'SubChild21Value'} },
			oldValue = $.iq.keyValue(inputObj, "Parent2", newValue);
		alert("'Parent2' value changed from '" + oldValue + "' to '" + newValue + "'");
		updateKeyValueSpan();
	});
	
	/* Circular Shift */
	var arr = ["1", "2", "3", "4", "5"],
		updateCircularShiftSpan = function () {
			$("#CircularShiftSpan").text($.toJSON(arr));
		};
	updateCircularShiftSpan();
	 
	$("#CircularShift1").click(function () {
		$.iq.circularShift(arr, -2);
		updateCircularShiftSpan();
	});
	 
	$("#CircularShift2").click(function () {
		$.iq.circularShift(arr, 3);
		updateCircularShiftSpan();
	});
	
	/* Inheritance */
	function InheritanceTrace(str) {
		$("#InheritanceTrace").html($("#InheritanceTrace").html() + "<br>" + str);
	}
	 
	(function () {
		// Base Class
		var baseClass = $.iq.Class.create(function () {
			InheritanceTrace("In Base Class Constructor. Static Property: " + baseClass.className);
		}, {
			setText: function (txt) {
				this.text = txt;
			},
			getText: function () {
				return this.text;
			}
		});
		baseClass.className = 'baseClass';
	 
		// Child Class
		var childClass1 = baseClass.extend(function () {
			this._base("");             // Calls constructor. Give first parameter as method name if needed to call a method
			InheritanceTrace("In Child Class1 Constructor. Static Property: " + childClass1.className);
		});
		childClass1.className = 'childClass1';
	 
		// Temporary Class - Not in inheritance chain
		var tempObj = $.iq.Class.create(function () {
			this._base("");
			InheritanceTrace("In tempObj Constructor. Static Property: " + tempObj.className);
		});
		tempObj.className = 'tempObj';
	 
		// Child Class 2
		var childClass2 = $.iq.inherit(childClass1, tempObj);
		childClass2.className = 'childClass2';
	 
		var childClass2Obj = new childClass2();
		childClass2Obj.setText("Some Text");
		InheritanceTrace("Text Value is '" + childClass2Obj.getText() + "' <br>");
		InheritanceTrace("childClass2Obj instance of $.iq.Class - " + (childClass2Obj instanceof $.iq.Class));
		InheritanceTrace("childClass2Obj instance of childClass2 - " + (childClass2Obj instanceof childClass2));
		InheritanceTrace("childClass2Obj instance of tempObj - " + (childClass2Obj instanceof tempObj));
		InheritanceTrace("childClass2Obj instance of childClass1 - " + (childClass2Obj instanceof childClass1));
		InheritanceTrace("childClass2Obj instance of baseClass - " + (childClass2Obj instanceof baseClass));
	})();
	
	/* Multiview */
	$("#HorizontalMultiview").multiview({
		selectedIndex: 1
	});
	$("#VerticalMultiview").multiview({
		selectedIndex: 3,
		animate: true
	});
	 
	$("#Multiview1").click(function () {
		$("#HorizontalMultiview, #VerticalMultiview").multiview("activeView", 0);
	});
	 
	$("#Multiview2").click(function () {
		$("#HorizontalMultiview, #VerticalMultiview").multiview("activeView", 1);
	});
	 
	$("#Multiview3").click(function () {
		$("#HorizontalMultiview").multiview("activeView", $("#HorizontalMultiview>div:eq(2)"));
		$("#VerticalMultiview").multiview("activeView", $("#VerticalMultiview>div:eq(2)"));               
	});
	 
	$("#Multiview4").click(function () {
		$("#HorizontalMultiview, #VerticalMultiview").multiview("activeView", 3);
	});
	
	/* Position */
	$("#PositionMyLeft, #PositionMyTop, #PositionAtLeft, #PositionAtTop, #PositionOffsetLeft, #PositionOffsetTop").change(function(){
		$("#PositionElement2").position({
			my : $("#PositionMyLeft").val() + " "+ $("#PositionMyTop").val(),
			at : $("#PositionAtLeft").val() + " "+ $("#PositionAtTop").val(),
			of : $("#PositionElement1"),
			offset : {
				left : $("#PositionOffsetLeft").val(),
				top : $("#PositionOffsetTop").val()
			}
		});		
	});
	
	/* Scroll Parent */
	$("div[id^='ScrollParentElement']").each(function(){
		Log("#ScrollParentTrace", "Scroll parent of '" + $(this)[0].id + "' is '" + GetElementInfo($(this).scrollParent()) + "'");
	});
	
	/* Scroll To */
	var numberOfScrollElements = 100;
 
	for (var i = numberOfScrollElements; i >= 1; i--) {
		$(".ScrollToExampleContainer").prepend('<div id="ScrollToElement' + i + '" class="ScrollToElement">' + i + '</div>');
	}
	 
	$("#txtScrollTo").change(function () {
		$(".ScrollToExample").scrollTo("#ScrollToElement" + $(this).val(), 500, 'linear', function () {
			//alert("scroll complete");
		});
	});
	 
	$("#btnScrollTo").bind("click", function () {
	 
		var scrollToElement = $.iq.rand(numberOfScrollElements - 1);
		$("#ScrollingTo").val(scrollToElement + 1);
		$(".ScrollToElement:eq(" + scrollToElement + ")").scrollTo({
			duration: 500,
			easing: 'swing',
			axis: 'xy',
			complete: function () {
			   // alert("scroll complete");
			}
		});
	});
	 
	$("#btnScrollToElement").bind("click", function () {
		var scrollToElement = $.iq.rand(1, numberOfScrollElements);
		$("#ScrollingTo").val(scrollToElement);	 
		$(".ScrollToExample").scrollTo(document.getElementById("ScrollToElement" + scrollToElement), 500, 'swing', function () {
			//alert("scroll complete");
		});
	});
	 
	$("#btnScrollToSelector").bind("click", function () {
		var scrollToElement = $.iq.rand(1, numberOfScrollElements);
		$("#ScrollingTo").val(scrollToElement);
	 
		$(".ScrollToExample").scrollTo("#ScrollToElement" + scrollToElement, 500, 'swing', function () {
			//alert("scroll complete");
		});
	});
	 
	 
	$("#btnScrollToJQuery").bind("click", function () {
		var scrollToElement = $.iq.rand(1, numberOfScrollElements);
		$("#ScrollingTo").val(scrollToElement);
	
		$(".ScrollToExample").scrollTo($("#ScrollToElement" + scrollToElement), 500, 'swing', function () {
			//alert("scroll complete");
		});
	
	}); 	
	
	/* Selectable */
	var $selectableContainer = $("#SelectableExample"),
        selectableMaxWidth = $selectableContainer.innerWidth() - 2 * $(".SelectableElement:eq(0)").outerWidth(),
        selectableMaxHeight = $selectableContainer.innerHeight() - 2 * $(".SelectableElement:eq(0)").outerHeight();
        
	$("#ClearSelectableTrace").click(function(){
        ClearLog("#SelectableTrace");
    });
 
    $("#RandomSelectable").click(function(){
        $selectableContainer.find(".SelectableElement").each(function(){
            $(this).css('top', $.iq.rand(selectableMaxHeight)).css({
                left : $.iq.rand(selectableMaxWidth),
                "float" : 'none',
                position : 'absolute'
            });
        });
    });
    $("#OrderedSelectable").click(function(){
        $selectableContainer.find(".SelectableElement").each(function(){
            $(this).css({
                position:'static',
                "float":'left',
                left : '0px'                       
            });
        });
    }).click();
 
 
    $selectableContainer.movable({filter :".iq-selectable-selected"});
 
    // noSelect is a plugin for not allowing text select during dragging
    $selectableContainer.noSelect().selectable({
        filter: '.SelectableElement'
    }).bind("selecting", function(event, data){
        Log("#SelectableTrace","Selecting '"+ $(data.target).text() +"'", true);
    }).bind("selectstart", function(event){
        Log("#SelectableTrace","Starting selection", true);
    }).bind("selected", function(event, data){
        Log("#SelectableTrace","Selected '"+ $(data.target).text() +"'", true);
    }).bind("deselecting", function(event, data){
        Log("#SelectableTrace","Deselecting '"+ $(data.target).text() +"'", true);
    }).bind("deselected", function(event, data){
        Log("#SelectableTrace","Deselected '"+ $(data.target).text() +"'", true);
    }).bind("selectend", function(event){
        Log("#SelectableTrace","Selection ended", true);
    });
	
	
	/* Drag Event */
	var $dragHelper = $("#DragHelper"); 
	$("#DragExample").dragstart(function(){
		$dragHelper.show();
	}).drag(function(event, data){
	 
		// get the mouse start position and the current positions
		var x1 = data.start.pageX,
			x2 = data.current.pageX,
			y1 = data.start.pageY,
			y2 = data.current.pageY,
			parentOffset = $("#DragHelper").offsetParent().position(),
			tmp;
	 
		// Make a proper rectangle with available points
		if(x1 > x2){ tmp = x1; x1 = x2; x2 = tmp };
		if(y1 > y2){ tmp = y1; y1 = y2; y2 = tmp };
	 
		// set the helper box
		$dragHelper.css({ left: x1 - parentOffset.left, top: y1 - parentOffset.top, width: x2 - x1, height: y2 - y1 });
	 
	}).dragend(function(){
		$dragHelper.hide().width(0).height(0);
	});
	
	/* Mousewheel */
	$("#MousewheelExample").mousewheel(function(event, delta){
		var dir = delta > 0 ? 'Up' : 'Down',
			vel = Math.abs(delta);
		$(this).text(dir + ' at a velocity of ' + vel);
		return false;
	});

	/* Property Change Example */
	var $propertyChangeElement = $("#PropertyChangeExample"),
		propertyChangeBG = "#FAFAFA"; 
	$("#btnChangeWidth").click(function (e) {
		var width = $propertyChangeElement.width() == 125 ? 100 : 125;
		$propertyChangeElement.width(width);
	});
	 
	$("#btnChangeHeight").click(function (e) {
		var height = $propertyChangeElement.height() == 125 ? "100px" : "125px";
		$propertyChangeElement[0].style.height = height;
	});
	 
	$("#btnChangeTitle").click(function (e) {
		$propertyChangeElement[0].title = "Some random title - " + Math.round(Math.random() * 100);
	});
	 
	$("#btnChangeBackground").click(function (e) {
		propertyChangeBG = (propertyChangeBG == "#FAFAFA")? "#EEEEEE" : "#FAFAFA";
		$propertyChangeElement.css("background-color", propertyChangeBG);
	});
	 
	$propertyChangeElement.bind("propchange",["width", "height", "title", "background-color"], function (e, changedProps) {
		var str = "";
		$.each(changedProps, function (key, prop) {
			str += "Property '" + key + "' for element '" + $propertyChangeElement.attr('id') + "' changed from '" + prop.oldValue + "' to '" + prop.newValue + "'</br>";
		});
		ClearLog("#PropertyChangeLog");
		Log("#PropertyChangeLog",str);
	});
	
	/* Resize */
	var $resizeElement = $("#ResizeExample");
	$("#btnResizeWidth").click(function (e) {
		var width = $resizeElement.width() == 125 ? 150 : 125;
		$resizeElement.width(width);
	});
	 
	$("#btnResizeHeight").click(function (e) {
		var height = $resizeElement.height() == 125 ? 150 : 125;
		$resizeElement.height(height);
	});
	 
	$("#btnResizeBoth").click(function (e) {
		var width = $resizeElement.width() == 125 ? 150 : 125,
			height = $resizeElement.height() == 125 ? 150 : 125;
		$resizeElement.width(width).height(height);
	});
	
	$resizeElement.resize(function (e, changedProps) {
		var str = "";
		$.each(changedProps, function (key, prop) {
			str += "Property '" + key + "' for element '" + $resizeElement.attr('id') + "' changed from '" + prop.oldValue + "' to '" + prop.newValue + "'<br/>";
		});
		ClearLog("#ResizeLog");
		Log("#ResizeLog", str);
	});
	
	/* Accordion */
	$("#InterfaceQueryPlugins").accordion({
		defaultState: 'Collapsed'
	});
	
	$("#HelperUtilities").accordion({
		mode : "single",
		defaultState: 'Collapsed',
		animate: true
	});
	
	$("#AccordionExample").accordion({
		defaultState: 'Collapsed'
	});
	
	/* Breadrcumb */
	var sitemapNodes = [{
			name: 'Home',
			href: 'http://e-infotainment.com/',			
			nodes: [{
				name: 'Applications',
				href: 'http://e-infotainment.com/applications/',				
				nodes: [{
					name: 'Interface Query',
					href: 'http://e-infotainment.com/projects/interface-query/'
				},{
					name: 'Build Automation',
					href: 'http://e-infotainment.com/projects/build-automation/'
				},{
					name: 'Blogger Template Generator',
					href: 'http://e-infotainment.com/applications/blogger-template-generator/'
				},{
					name: 'Thirukural Widget',
					href: 'http://e-infotainment.com/applications/thirukural-widget/'
				},{
					name: 'Friendship Calculator',
					href: 'http://e-infotainment.com/applications/friendship-calculator/'
				},{
					name: 'Flames',
					href: 'http://e-infotainment.com/applications/flames/'
				},{
					name: 'Sharepoint Tool',
					href: 'http://e-infotainment.com/applications/sharepoint-tool/'
				},{
					name: 'C# Excel Library',
					href: 'http://e-infotainment.com/applications/csharp-excel-library/'
				}]
			}]
		}];
	$("#Breadcrumb").breadcrumb({
		rawData: sitemapNodes,
		searchMode: 'name',
		defaultName: 'Interface Query'
	});
	
	$("#BreadcrumbExample").breadcrumb({
		rawData: sitemapNodes,
		searchMode: 'href',
		defaultHref: 'http://e-infotainment.com/applications/'
	});
	
	/* Context Menu */
	$("#ContextMenu").contextMenu({
	    bindings: [{ id: '1', elements: '#ContextMenuExample'}]
	});
	
	/* Menu */
	$("#MenuExample").menu();
	$("#MenuExampleData").menu({
		orientation: 'vertical',
		trigger: 'hover',
		data: [{
			name: 'Home',
			href: 'http://e-infotainment.com/'
		}, {
			name: 'Applications',
			href: 'http://e-infotainment.com/applications/',
			nodes: [{
				name: 'Interface Query',
				href: 'http://e-infotainment.com/projects/interface-query/'
			}, {
				name: 'Blogger Template Generator',
				nodes: [{
					name: 'Version2'
				},{
					name: 'Version1'
				}]
			}, {
				name: 'Hex color code generator'
			}, {
				name: 'Friendship Calculator'
			}]
		}, {
			name: 'Blogs',
			nodes: [{
				name: 'LFEM'
			}, {
				name: 'Mathelogic'
			}]
		}]
	});
	
	/* Tabs */
	$("#BehaviourPlugins").tabs();				
	$("#Utilities").tabs({	
		orientation: "VerticalLeft",
		tabstrip2: ">div:eq(1)",
		multiview: ">div:eq(2)"
	});
	$("#Events").tabs({
		orientation: "VerticalLeft"
	});
	$("#Controls").tabs({
		orientation: "VerticalRight"
	});
	$("#Menus").tabs({
		orientation: "HorizontalBottom",
		tabstrip: ">div:eq(1)",
		multiview: ">div:eq(0)"
	});
	$("#ClassUtilities").tabs(); // nested tabs
	$("#TabsExample").tabs({	
		orientation: "HorizontalTop",
		tabstrip2: ">div:eq(2)"
	});
	
	/* Tabstrip */
	$("#TabstripExample").tabstrip();	
	
	/* TreeView */
	$(".EINavigation").treeview({
		defaultState: "collapsed"
	}); 	
	
	$("#TreeviewExample").treeview({
		defaultState: "collapsed",
		edit: {
			enabled : true
		}
	});
	
	
	/* Inputs */
	$("input[type='button'], a.demoButton, button.demoButton").button();
	$("input[type='text']").not("#DatePicker, #ColorPickerTextbox, #FocusClass1, #FocusClass2").textbox();
	$("select").combobox();
	$("#ColorPickerTextbox").textbox({	type : 'colorpicker' });
	
	$("#ButtonExamples .iq-button").click(function(){
		alert("Clicked '" + ($(this).text() || $(this).val()) + "'");
	});
	
	/* Calendar */
	$("#Calendar").calendar();
	$("#Colorpicker").colorpicker();
	$("#DatePicker").datepicker();
	
	/* Dialog */
	$("#DialogExample").dialog({
		autoOpen: false,
		modal: true,
		resizable: true,
		movable: true,
		allowMinimize: true,
		allowMaximize: true,
		minWidth: 200,
		minHeight: 150,
		title: "Modal Window"
	}).appendTo("body");
			
	$("#btnModalWindow").click(function () {
		// true will reset the width and height of the window to 0, useful to create animation effect
		$("#DialogExample").dialog("open", {
			reset: true
		});
	});
	
	
	/* Grid */
	var gridData = [{ type : 'combobox', cellOptions : { options : { inherit : "", fixed : "Fixed", scroll : "Scroll"}  } },
				   { type : 'colorpicker' },
				   { type : 'label'},
				   { type : 'label' },
				   { type : 'combobox', cellOptions : { options : { inherit : "", "no-repeat" : "Don't Repeat", "repeat-x" : "Repeat Horizontally", "repeat-y" : "Repeat Vertically", repeat:"Repeat in both Directions" }  } }];
	$("#GridExample").grid({
		data: [["Background Attachment",""],
                   ["Background Color",""],
                   ["Background Image",""],
                   ["Background Position",""],
                   ["Background Repeat",""]],
		columns: [{ name: 'Property', readonly: true, css : 'twd-property-label' }, { name: 'Value', type: 'dynamic'}],
		showHeader: true,
		getDynamicType: function ($td, rowIndex, colIndex) {
			return  gridData[rowIndex];
		}
	});
			
});
		
		
