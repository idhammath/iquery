// Interface Query
// Version : 1.1
// Author : Trix 
// Url : http://e-infotainment.com/projects/interface-query/
(function ($, undefined) {

    // Get the existing Interface Query object or create new 
    $.iq = $.iq || {};

    var $iq = $.iq,
		$styles = $('<style rel="stylesheet" type="text/css"/>').appendTo('head'), // $styles used for function name hooks - $iq.fnHooks
        $input = $("<input/>"); // Used to determine support 

    $iq.version = "1.1";

    /**************** Extend JQuery ****************/

    $.extend($.fn, {
        scrollParent: function () {
            var $this = this,
                $scrollParents,
                $thisPosition = $this.css('position'),
                $scrollParent;

            if ($thisPosition !== "fixed" || !$.support.fixedPosition) {
                $scrollParents = $this.parents();

                if ($thisPosition === "absolute" && !$.support.overflowWithAbsolute) {
                    $scrollParents.each(function () {
                        if (/(relative|absolute|fixed)/.test($.curCSS(this, 'position', 1)) && /(auto|scroll)/.test($.curCSS(this, 'overflow', 1) + $.curCSS(this, 'overflow-y', 1) + $.curCSS(this, 'overflow-x', 1))) {
                            $scrollParent = $(this);
                            return false;
                        }
                    });
                }
                else {
                    $scrollParents.each(function () {
                        if (/(auto|scroll)/.test($.curCSS(this, 'overflow', 1) + $.curCSS(this, 'overflow-y', 1) + $.curCSS(this, 'overflow-x', 1))) {
                            $scrollParent = $(this);
                            return false;
                        }
                    });
                }
            }
            return !$scrollParent ? $(document) : $scrollParent;
        },
        cssX: function (styleProps) {
            /// <summary>
            /// $(elem).cssX(styleProps) - Returns css values for the given style properties for the element
            /// Note: This method doesn't improve performance over multiple css calls. 			
            /// </summary>
            /// <param name="styleProps">	       
            /// Array of properties for which styles has to be returned
            /// </param>
            ///	<returns>
            /// An associated array of style values for the element
            /// </returns>              
            var retVals = {},
				$this = this;
            if ($.isArray(styleProps)) {
                $.each(styleProps, function (index, prop) {
                    retVals[prop] = $.css($this[0], prop);
                });
                return retVals;
            }
            return $this.css.apply($this, arguments);
        },
		/*animateX: function (propertiesMap) {
            /// <summary>
            /// $(elem).animateX(propertiesMap) - Similar to cssX, it runs the animate method individually so that they finish the animations at the same time.
			/// Usage : $(elem).animateX( properties [, options] )
			/// 		$(elem).animateX( properties [, duration] [, easing] [, complete] )
			/// Note: This method may impact performance over using animate directly. 
            /// </summary>
            /// <param name="propertiesMap">	       
            /// Properties to be animated. 
            /// </param>			
            var $this = this,
				options = Array.prototype.slice.call(arguments, 1) || [];
            if (propertiesMap) {
                $.each(propertiesMap, function (prop, value) {
					var obj = {};
					obj[prop] = value;
                    $this.animate.apply($this, [obj].concat(options));										
                });                
            }
            return $this;
        },*/
        editClass: function (c1, c2) {
            /// <summary>
            /// $(elem).editClass(c1, c2) - Removes class c1 and adds class c2. 
            /// Note: This method adds class c2 even if c1 doesn't exists
            /// </summary>
            /// <param name="c1">	       
            /// Class to be removed from the element
            /// </param>
            /// <param name="c2">	       
            /// Class to be added to the element
            /// </param>
            return this.removeClass(c1).addClass(c2);
        },
        swapClass: function (c1, c2) {
            /// <summary>
            /// Swap given two classes. Will remove c1 and add c2 only if c1 exists. Else Will remove c2 and add c1 only if c2 exists
            /// </summary>
            /// <param name="c1">	       
            /// Class to be removed from the element
            /// </param>
            /// <param name="c2">	       
            /// Class to be added to the element
            /// </param>            
            return this.each(function () {
                var $this = $(this);
                if ($this.hasClass(c1)) {
                    $this.removeClass(c1).addClass(c2);
                }
                else if ($this.hasClass(c2)) {
                    $this.removeClass(c2).addClass(c1);
                }
            });

        },
        focusClass: function (c1, eventSuffix) {
            /// <summary>
            /// $(selector).focusClass(c1) - Adds a class 'c1' when an element is focused. Removes the class when blurred. Event Suffix is optional
            /// $(selector).focusClass(c1, 'iq-example') - Adds a class 'c1' when an element is focused. Removes the class when blurred. Event Sufffix will be used when binding focus and blur events.
            /// </summary>
            /// <param name="c1">	       
            /// Class to be added to the element when an element is focused
            /// </param>
            /// <param name="eventSuffix">	       
            /// Will be used when binding focus and blur events.
            /// </param>
            eventSuffix = eventSuffix ? '.' + eventSuffix : '';

            return this.bind('focus' + eventSuffix, function () {
                $(this).addClass(c1);
            }).bind('blur' + eventSuffix, function () {
                $(this).removeClass(c1);
            });
        },

        hoverClass: function (c1, eventSuffix) {
            /// <summary>
            /// $(selector).hoverClass(c1) - Adds a class 'c1' when an element is hovered. Removes the class when moved out. Event Suffix is optional
            /// $(selector).hoverClass(c1, 'iq-example') - Adds a class 'c1' when an element is focused. Removes when blurred. Event Sufffix will be used when binding mouseenter and mouseleave events.
            /// </summary>
            /// <param name="c1">	       
            /// Class to be added to the element when an element is focused
            /// </param>
            /// <param name="eventSuffix">	       
            /// Will be used when binding mouseenter and mouseleave events.
            /// </param>
            eventSuffix = eventSuffix ? '.' + eventSuffix : '';

            return this.bind('mouseenter' + eventSuffix, function () {
                $(this).addClass(c1);
            }).bind('mouseleave' + eventSuffix, function () {
                $(this).removeClass(c1);
            });
        },
        outerHtml: function (replaceHtml) {
            /// <summary>
            /// $(selector).outerHtml() - Gets the html including the element selected. This differs from $(selector).html() where only the html inside the element selected will be fetched.
            /// </summary>

            var elem, outerHtml;
            return replaceHtml ? this.replaceWith(htmlString) :
								((elem = this[0]) ? ((outerHtml = elem.outerHTML) ?
									outerHtml : $('<p/>').append(this.clone()).remove().html()) : null);
        },
        isChildOf: function (parent) {
            /// <summary>
            /// $(selector).isChildOf(parentSelector) - Returns true if the element is a child of parent element
            /// </summary>
            parent = $(parent)[0];
            for (var childParents = this.eq(0).parents(), i = childParents.length; i; ) {
                if (childParents[--i] === parent) {
                    return true;
                }
            }
            return false;
        }
    });

    // JQuery Support
    $.support.decompileFn = /xyz/.test(function () { var xyz; });
    $.support.selection = ($input[0].selectionStart !== undefined);
    //$input = null;

    $(document).ready(function () {

        var $outerDiv = $("<div id='Something' style='width:30px; height:30px; margin-top:-100px; margin-left:-100px; border:solid 1px black; overflow:scroll'><div style='width:1px; height:1px; border:solid 1px black; position:fixed; top:100px;'/></div>").appendTo("body"),
			$inner = $outerDiv.find("div");

        // Not sure of the correct way to find out, hence 
        if ($.support.fixedPosition === undefined) {
            $.support.fixedPosition = $inner[0].offsetTop == 100;
        }

        $inner.css('position', 'absolute');
        $.support.overflowWithAbsolute = ($outerDiv[0].scrollHeight > 30);
        $outerDiv.remove();

    });

    /**************** Interface Query Utilities ****************/

    var $iqFnHooks = {},

    /* Inheritance Base Class */
        $iqClass = $iq.Class = function () {
            if (this._base) {
                this._base.call(this, "", arguments);
            }
        };

    $iqClass.create = $iqClass.extend = function (childClass, proto) {
        proto && $.extend(childClass.prototype, proto);
        return $iq.inherit(this, childClass);
    };




    // Regular expressions and Constants
    $.extend($iq, {
        formats: {
            daysLong: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            daysMedium: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            daysShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            monthsLong: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthsMedium: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        },
        keys: {
            asterisk: 106,
            down: 40,
            end: 35,
            enter: 13,
            escape: 27,
            f2: 113,
            home: 36,
            left: 37,
            pagedown: 34,
            pageup: 33,
            right: 39,
            space: 32,
            tab: 9,
            up: 38,
            a: 65
        },
        regex: {

            // $.iq.trimStart, $.iq.trimEnd
            whitespace: ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000',

            // Treeview, Accordion and other plugins
            noLink: /^(|#)$/,

            // CSS Rule Plugin
            splitRule: /^([^{]+)(\{([^}]*)\})?/m,
            splitStyles: /([^:]+):([^;}]+)/,

            // Restrict Text Plugin
            numeric: /^-?[0-9]*$/,
            alphabetic: /^[A-Za-z]*$/,
            alphanumeric: /^[0-9A-Za-z]*$/,
            decimal: /^-?[0-9]*(.[0-9]*)?$/,
            hex: /^[A-Fa-f0-9]{0,6}$/

            //evtsHtml = /^(scroll|resize|load|unload|abort|error)$/,
            //evtsMouse = /^(click|dblclick|mousedown|mouseup|mouseover|mouseout|contextmenu|mousenter|mouseleave)$/,
            //evtsUI = /^(focus|blur|select|change|reset|keypress|keydown|keyup)$/
        },
        parsers: {
            json: {   /* Requires jquery.json plugin */
                to: function (str) {
                    return $.secureEvalJSON(str);
                },
                from: function (obj) {
                    return $.toJSON(obj);
                }
            },
            date: {
                to: function (str, opts) {
                    return new Date(str);
                },
                from: function (obj, opts) {
                    return opts.format.replace(/(yyyy|yy|y|MMMM|MMM|MM|M|dddd|ddd|dd|d|HH|H|hh|h|mm|m|ss|s|t)/gi, function ($1) {
                        switch ($1) {
                            case 'yyyy': return obj.getFullYear();
                            case 'yy': return $iq.prepend0(obj.getFullYear() % 100, 2);
                            case 'y': return (obj.getFullYear() % 100);
                            case 'MMMM': return $iq.monthsLong[obj.getMonth()];
                            case 'MMM': return $iq.monthsMedium[obj.getMonth()];
                            case 'MM': return $iq.prepend0(obj.getMonth() + 1, 2);
                            case 'M': return (obj.getMonth() + 1);
                            case 'dddd': return $iq.daysLong[obj.getDay()];
                            case 'ddd': return $iq.daysMedium[obj.getDay()];
                            case 'dd': return $iq.prepend0(obj.getDate(), 2);
                            case 'd': return obj.getDate();
                            case 'HH': return $iq.prepend0(obj.getHours(), 2);
                            case 'H': return obj.getHours();
                            case 'hh': return $iq.prepend0((h = obj.getHours() % 12) ? h : 12, 2);
                            case 'h': return ((h = obj.getHours() % 12) ? h : 12);
                            case 'mm': return $iq.prepend0(obj.getMinutes(), 2);
                            case 'm': return obj.getMinutes();
                            case 'ss': return $iq.prepend0(obj.getSeconds(), 2);
                            case 's': return obj.getSeconds();
                            case 't': return obj.getHours() < 12 ? 'A.M.' : 'P.M.';
                        }
                        return retVal;
                    });
                }
            }
        }
    });

    // Function Hooks - TODO : better approach required
    $iq.fnHooks = $iqFnHooks;
    $iqFnHooks.sheet = $styles[0].sheet ? 'sheet' : 'styleSheet';
    $iqFnHooks.rules = $styles[0][$iqFnHooks.sheet].rules ? 'rules' : 'cssRules';
    // AddRule/InsertRule, parameter varies
    $iqFnHooks.deleteRule = $styles[0][$iqFnHooks.sheet].deleteRule ? 'deleteRule' : 'removeRule';
    $styles.remove();


    $iq.curStyle = function (element, styleProp, options) { //from ppk's quirksmode
        options = options || {};
        var $elem = $(element).eq(0),
            elem, value,
            hide = options.hide;
        if ($elem.length > 0) {

            // Don't forget to add the css to hide the element
            // Fix for getting percentage value for width in firefox
            if (hide) {
                $elem.addClass("iq-hide");
            }

            elem = $elem[0];
            if (elem.currentStyle)
                value = elem.currentStyle[styleProp];
            else if (window.getComputedStyle)
                value = document.defaultView.getComputedStyle(elem, null).getPropertyValue(styleProp);

            if (hide) {
                $elem.removeClass("iq-hide");
            }

            return value;

        }
    }

    $iq.ret1 = function () {
        /// <summary>
        /// Function that returns true
        /// </summary>
        return true;
    }

    $iq.ret0 = function () {
        /// <summary>
        /// Function that returns false
        /// </summary>
        return false;
    }

    $iq.indexOf = function (value, array, fromIndex, ignoreCase) {
        /// <summary>
        /// Checks whether the given value is present in the given array. If found returns the index at which it is found
        /// This method is an alternative for $.inArray to make case insensitive search
        /// </summary>
        /// <param name="value">	       
        /// Value to be searched
        /// </param>
        /// <param name="value">	       
        /// Input array to be searched
        /// </param>
        /// <param name="fromIndex">	       
        /// Optional parameter to specify the index at which to start the search.
        /// </param>
        /// <param name="ignoreCase">	       
        /// Optional boolean value to specify whether to make case insensitive search. Applicable only for string search.
        /// </param>

        var typeOfFromIndex = typeof fromIndex;
        if (array) {
            if (typeof ignoreCase === undefined) {
                if (typeOfFromIndex === undefined) {
                    ignoreCase = false;
                }
                else if (typeOfFromIndex !== "number") {
                    ignoreCase = fromIndex && (typeof value === "string");
                    fromIndex = undefined;
                }
            }
            if (ignoreCase) {
                var len = array.length;
                fromIndex = fromIndex ? fromIndex < 0 ? Math.max(0, len + fromIndex) : fromIndex : 0;

                for (; fromIndex < len; fromIndex++) {
                    if (array[fromIndex].toLowerCase() === value.toLowerCase()) {
                        return fromIndex;
                    }
                }
                return -1;
            }
            else {
                return $.inArray(value, array, fromIndex);
            }
        }
    }

    $iq.circularShift = function (array, count) {
        /// <summary>
        /// Shifts given array to left (negative count) or right (positive count)
        /// </summary>
        /// <param name="array">	       
        /// Array to be shifted
        /// </param>
        /// <param name="count">	       
        /// Number of places to be shifted
        /// </param>
        if (count < 0) {
            for (var i = Math.abs(count); i--; ) {
                array.push(array.shift());
            }
        }
        else {
            for (var i = Math.abs(count); i--; ) {
                array.unshift(array.pop());
            }
        }
        return array;
    }

    $iq.prepend0 = function (number, length) {
        /// <summary>
        /// Prepend zero to the given number        
        /// </summary>
        /// <param name="number">	       
        /// number to which 0 should be prepended
        /// </param>
        /// <param name="length">	       
        /// Max length of the returned number
        /// </param>
        length -= number.toString().length;
        for (var i = length; i--; )
            number = "0" + number;
        return number;
    }

    $iq.rand = function (start, end) {
        /// <summary>
        /// Shorthand for Math.random(). If max is given, generates a random number between 0 and max.
        /// </summary>
        /// <param name="max">	       
        /// When max number is given generates a random number between 0 and max.
        /// </param>		
        var random = Math.random(),
			startNo = start;
        if (!end) {
            end = start || 1;
            startNo = 0;
        }
        return start === undefined ? random : (Math.floor(random * (end - startNo + 1)) + startNo);
    }

    $iq.parse = function (str, options) {
        /// <summary>
        /// Converts given string to specified type (options.type)
        /// </summary>
        /// <param name="str">	       
        /// String to be parsed.
        /// </param>
        /// <param name="options">	       
        /// Options that required while parsing the string
        /// </param>

        options = options || {};

        var type = String.prototype.toLowerCase.apply(options.type || ""),
            parser = type ? $iq.parsers[type] : undefined;
        return parser ? parser.to(str, options) : "";
    }

    $iq.stringify = function (obj, options) {
        /// <summary>
        /// Converts given object of specified type (options.type) to a string
        /// </summary>
        /// <param name="obj">	       
        /// String to be parsed.
        /// </param>
        /// <param name="options">	       
        /// Options that required while converting the given object to string
        /// </param>
        options = options || {};

        var type = String.prototype.toLowerCase.apply(options.type || ""),
            parser = type ? $iq.parsers[type] : undefined;

        return parser ? parser.from(obj, options) : "";
    }

    $iq.trim = function (inputString, trimChar, trimWhiteSpace) {
        /// <summary>
        /// Trim's given string. Optionally trims character and optionally trims white space with it. 
        /// </summary>
        /// <param name="inputString">	       
        /// Input string to be trimmed.
        /// </param>
        /// <param name="trimChar">	       
        /// When trim char is given, removes the character from the start and end of the string.
        /// </param>
        /// <param name="trimWhiteSpace">	       
        /// When set to true, the string will be first trimmed and then the character given will be removed from the string
        /// </param>
        return trimChar ? $iq.trimEnd($iq.trimStart(inputString, trimChar, trimWhiteSpace), trimChar, trimWhiteSpace) : $.trim(inputString);
    }

    $iq.trimStart = function (inputString, trimChar, trimWhiteSpace) {
        /// <summary>
        /// Trim's given string only in the start. Optionally trims character and optionally trims white space with it. 
        /// </summary>
        /// <param name="inputString">	       
        /// Input string to be trimmed.
        /// </param>
        /// <param name="trimChar">	       
        /// When trim char is given, removes the character from the start of the string.
        /// </param>
        /// <param name="trimWhiteSpace">	       
        /// When set to true, the string will be first trimmed and then the character given will be removed from the string
        /// </param>
        if (inputString) {
            // trim whitespaces
            if (trimWhiteSpace || !trimChar) {
                for (var i = 0, length = inputString.length, whitespaceRegEx = $iq.regex.whitespace; i < length; i++) {
                    if (whitespaceRegEx.indexOf(inputString.charAt(i)) === -1) {
                        inputString = inputString.substring(i);
                        break;
                    }
                }
            }

            // trim character 
            if (trimChar) {
                for (var i = 0, length = inputString.length; i < length; i++) {
                    if (inputString.charAt(i) != trimChar) {
                        inputString = inputString.substring(i);
                        break;
                    }
                }
            }
        }
        return inputString;
    }

    $iq.trimEnd = function (inputString, trimChar, trimWhiteSpace) {
        /// <summary>
        /// Trim's given string only in the end. Optionally trims character and optionally trims white space with it. 
        /// </summary>
        /// <param name="inputString">	       
        /// Input string to be trimmed.
        /// </param>
        /// <param name="trimChar">	       
        /// When trim char is given, removes the character from the end of the string.
        /// </param>
        /// <param name="trimWhiteSpace">	       
        /// When set to true, the string will be first trimmed and then the character given will be removed from the string
        /// </param>
        if (inputString) {
            // trim whitespaces
            if (trimWhiteSpace || !trimChar)
                for (var i = inputString.length, whitespaceRegEx = $iq.regex.whitespace; i--; ) {
                    if (whitespaceRegEx.indexOf(inputString.charAt(i)) === -1) {
                        inputString = inputString.substring(0, i + 1);
                        break;
                    }
                }

            // trim character 
            if (trimChar)
                for (var i = inputString.length; i--; ) {
                    if (inputString.charAt(i) != trimChar) {
                        inputString = inputString.substring(0, i + 1);
                        break;
                    }
                }
        }
        return inputString;
    }

    $iq.keyValue = function (obj, stringPath, value) {
        /// <summary>
        /// Gets or sets value for the given key.
        /// TODO : In future stringpath will take object and value as a callback parameter and a boolean can be specified to make deep copy
        /// </summary>
        /// <param name="obj">	       
        /// Target input object to be used for getting/setting value for the given key.
        /// </param>
        /// <param name="stringPath">	       
        /// Input string to identify the key. 
        /// eg i) "key1" 
        /// eg ii) "path1.path2.key3"
        /// </param>
        /// <param name="value">	       
        /// Optional parameter. Value to be set for the given key
        /// </param>
        ///	<returns>
        /// i) Value for the given key (or)
        /// ii) Previous value when a new value is set for the given key
        /// </returns>   

        /* Internal Use 
        var deepCopy = false;
        if(typeof args[0] === boolean){
        deepCopy = obj;
        obj = stringPath,
        stringPath = value,
        value = arguments[3];
        }*/

        if (typeof stringPath === "string") {
            var keyPaths = stringPath.split('.'),
			    actualKey = keyPaths.pop(),
			    actualValue,
			    pathLength = keyPaths.length,
			    tempObj = obj;

            if (value === undefined) {
                for (var i = 0; (i < pathLength) && tempObj; i++) {
                    tempObj = tempObj[keyPaths[i]];
                }
                return tempObj ? tempObj[actualKey] : undefined;
            }

            for (var i = 0, key; i < pathLength; i++) {
                key = keyPaths[i];
                tempObj[key] = tempObj[key] || {};
                tempObj = tempObj[key];
            }

            actualValue = tempObj[actualKey];
            tempObj[actualKey] = value;

            return actualValue;
        }
        else {
            // stringPath is object
            $.each(stringPath, function (key, value) {
                obj[key] = value;
            });
        }
    }

    $iq.Event = function (event, type, overrideProps) {
        var $event = $.Event(event);
        $event.type = type;

        for (var eventProps = $.event.props, i = eventProps.length, eventProp; i; ) {
            eventProp = eventProps[--i];
            $event[eventProp] = event[eventProp];
        }

        if (overrideProps) {
            $.each(overrideProps, function (prop, value) {
                $event[prop] = value;
            });
        }

        return $event;
    }

    /**************** Interface Query Inheritance ****************/

    // Function that extends a class with the given base class
    // based on http://ejohn.org/blog/simple-javascript-inheritance/
    $iq.inherit = function (baseClass, childClass) {

        var basePrototype = $.isFunction(baseClass) ? baseClass.prototype : baseClass,
            childPrototype = $.isFunction(childClass) ? childClass.prototype : childClass,
            _callBaseMethod = function (methodName) {
                var args = Array.prototype.slice.call(arguments, 1);
                return methodName ? basePrototype[methodName].apply(this, args)
                        : baseClass.apply(this, args);
            },
            proxy = function (childMethod, args) {
                // temporarily back up the _base prop/method if it is already existing
                var self = this,
                    temp = self._base,
					retVal;

                // Add a new _base method which is used for accessing base class methods                        
                self._base = _callBaseMethod;

				// The method only need to be bound temporarily, so we
                // remove it when we're done executing
				
				try { 
                retVal = childMethod.apply(self, args);				
                } 
				catch(err){
					$.error(err);
				}
                /*finally { */
				
					// restore the backed up _base/prop
					self._base = temp;
                
				/* } */

                return retVal;
            },
            childClassConstructor = $.isFunction(childClass) ? childPrototype.constructor : function () { },
            childClassPrototype;

        baseClass.__constructing = true;
        childClassPrototype = new baseClass();
        delete baseClass.__constructing;

        // Make the base class methods available in the methods of child class
        // Loop through all the properties in the child class
        $.each(childPrototype, function (key, value) {

            childClassPrototype[key] = $.isFunction(value) && (!$.support.decompileFn || /\b_base\b/.test(value)) ?
            //(function () {
            // if function, assign a new method which allows accessing the base class functions
                    function () {						
                        return proxy.call(this, value, arguments);
                    }
            //})()
                : value;
        });

        childClass = $.extend(function () {
            if (!childClass.__constructing) {
                return baseClass === $iqClass ? childClassConstructor.call(this, arguments) :
                        proxy.call(this, childClassConstructor, arguments);
            }
        }, baseClass);

        childClass.prototype = childClassPrototype;
        childClass.prototype.constructor = childClass;

        return childClass;
    };

    /********************* Interface Query Plugin Pattern ********************/
    /**************** Big Thanks to JQuery UI Widget Factory *****************/

    $iq.Plugin = $iqClass.extend({
        pluginName: "plugin",
        namespace: "iq",
        eventSuffix: ".plugin",
        eventPrefix: "plugin",
        element: null,
        _onElement: null,

        options: {
            enabled: true
        },

        option: function (key, value) {
            var instance = this,
                options = instance.options,
                typeOfKey = typeof key;
            if (key === undefined) {
                return $.extend({}, options);
            }
            if (typeOfKey === "string") {
                if (value === undefined)
                    return $iq.keyValue(options, key);
                instance._optionChanged(key, value, $iq.keyValue(options, key, value));
            }
            else {
                if (typeOfKey !== 'boolean') {
                    value = key;
                    key = false;
                }

                // Key is the boolean specifying whether to do deep copy
                // options is the plugin options, that has to be updated - target
                // value is the actual options object to update
                instance._option(key, options, value);
            }
        },

        _option: function (deep, target, options, path) {
            var instance = this;
            if (target === undefined) {
                options = deep;
                target = this.options;
            }

            path = (path && path != "") ? (path + ".") : "";

            for (var actualKey in options) {
                var newValue = options[actualKey];

                if (deep && $.isPlainObject(target[actualKey]) && $.isPlainObject(newValue)) {
                    target[actualKey] = target[actualKey] || {};
                    instance._option(deep, target[actualKey], options[actualKey], path + actualKey);
                }
                else {
                    var oldValue = target[actualKey];
                    target[actualKey] = newValue
                    instance._optionChanged(path + actualKey, newValue, oldValue);
                }
            }
        },

        _optionChanged: function (key, newValue/*, oldValue */) {
            if (key === "enabled") {
                this.element.toggleClass("iq-disabled", !newValue);
            }
        },

        enable: function () {
            return this.option("enabled", true);
        },

        disable: function () {
            return this.option("enabled", false);
        },
        _on: function (element, selector, data, handlers) {
            var instance = this;
            $.each(handlers, function (eventName, handlerFn) {
                var handlerProxy = function () {
                    if (instance.options.enabled === false || $(this).hasClass("iq-disabled")) {
                        return;
                    }
                    return (typeof handlerFn === "string" ? instance[handlerFn] : handlerFn).apply(instance, arguments);
                };

                if (selector) {
                    //if(data){
                    element.delegate(selector, eventName, data || {}, handlerProxy);
                    //}
                    //else {
                    //element.delegate(selector, eventName, handlerProxy);
                    //}					
                } else {
                    //if(data){
                    element.bind(eventName, data || {}, handlerProxy);
                    //}
                    //else {
                    //element.bind(eventName, handlerProxy);
                    //}
                }
            });
        },
        _delegate: function (element, selector, eventName, data, handler) {
            var instance = this,
				handlers = {};
            if (handler) {
                // _delegate(element, selector, eventName, data, handler)
                handlers[eventName] = handler;
                instance._on(element, selector, data, handlers);
            }
            else if (data) {
                if (typeof eventName === "string") {
                    // _delegate(element, selector, eventName, handler)
                    handlers[eventName] = data;
                    instance._on(element, selector, undefined, handlers);
                }
                else {
                    // _delegate(selector, eventName, data, handler)
                    handlers[selector] = data;
                    instance._on(instance.element, element, eventName, handlers);
                }
            }
            else if (eventName) {
                if ($.isPlainObject(eventName)) {
                    if (typeof selector === "string") {
                        // _delegate(element, selector, handlers)
                        instance._on($(element), selector, undefined, eventName);
                    }
                    else {
                        // _delegate(selector, data, handlers)
                        instance._on(instance.element, element, selector, eventName);
                    }
                }
                else {
                    // _delegate(selector, eventName, handler)
                    handlers[selector] = eventName;
                    instance._on(instance.element, element, undefined, handlers);
                }
            }
            else {
                // _delegate(selector, handlers)
                instance._on(instance.element, element, undefined, selector);
            }
        },
        _bind: function (element, eventName, data, handler) {
            var instance = this,
				handlers = {};
            if (handler) {
                // _bind(element, eventName, data, handler)				
                handlers[eventName] = handler;
                instance._on($(element), undefined, data, handlers);
            } else if (data) {
                if ($.isPlainObject(data)) {
                    // _bind(element, data, handlers)
                    instance._on($(element), undefined, eventName, data);
                }
                else if (typeof eventName === "string") {
                    // _bind(element, eventName, handler)	
                    handlers[eventName] = data;
                    instance._on($(element), undefined, undefined, handlers);
                }
                else {
                    // _bind(eventName, data, handler)
                    handlers[eventName] = data;
                    instance._on(instance.element, undefined, eventName, handlers);
                }
            }
            else if (eventName) {
                if ($.isPlainObject(eventName)) {
                    // _bind(element, handlers)
                    instance._on($(element), undefined, undefined, eventName);
                }
                else if (typeof element === "string") {
                    // _bind(eventName, handler)
                    handlers[element] = eventName;
                    instance._on(instance.element, undefined, undefined, handlers);
                }
                else {
                    // _bind(data, handlers)
                    instance._on(instance.element, undefined, data, eventName);
                }
            }
            else {
                // _bind(handlers)
                instance._on(instance.element, undefined, undefined, element);
            }
        },
        _callback: function (callbackName, event, data) {
            var instance = this,
                callback = instance.options[callbackName];
            if ($.isFunction(callback))
                return callback.apply(this.element[0], data ? ($.isArray(data) ? [event].concat(data) : [event, data]) : [event]);
        },

        _triggerOptions: {
            doCallback: true,
            stopOriginalEvent: false,
            prependEventPrefix: true,
            disableStopOriginalEvent: false
        },

        _trigger: function (eventType, event, data) {
            var instance = this,
                originalEvent,
                $event, type, retVal, triggerCallback;

            eventType = $.extend({}, instance._triggerOptions, (typeof eventType === "string" ? { type: eventType} : eventType));

            type = eventType.type;
            $event = $.Event(event);
            $event.type = ((eventType.prependEventPrefix && type.indexOf(instance.eventPrefix) != 0) ? instance.eventPrefix + type : type).toLowerCase();
            data = data || {};

            if (originalEvent = $event.originalEvent) {
                for (var eventProps = $.event.props, i = eventProps.length, eventProp; i; ) {
                    eventProp = eventProps[--i];
                    $event[eventProp] = originalEvent[eventProp];
                }
            }

            if (eventType.properties) {
                $.each(eventType.properties, function (prop, value) {
                    $event[prop] = value;
                });
            }

            $event.originalEvent = null;

            if (!eventType.disableStopOriginalEvent) {
                $event.stopOriginalEvent = function () {
                    if (!$event.isOriginalEventStopped()) {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        event.returnValue = false;
                        $event.isOriginalEventStopped = $iq.ret1;
                    }
                }
                $event.isOriginalEventStopped = $iq.ret0;
                if (eventType.stopOriginalEvent) {
                    $event.stopOriginalEvent();
                }
            }

            this.element.trigger($event, data);
            triggerCallback = !$event.isImmediatePropagationStopped() && eventType.doCallback;
            if (triggerCallback) {
                retVal = this._callback(type, $event, data);
            }
            $event.originalEvent = originalEvent;

            return (triggerCallback && (retVal !== undefined)) ? retVal : !$event.isDefaultPrevented();
        },
        _preInit: function (element, options) {
            var instance = this;
            instance.options = $.extend(true, {}, instance.options, options);
            instance.element = $(element).eq(0);
			instance._applyCss(element);
			instance._init();
			
            return instance.element;
        },
		_applyCss: function(element){
			$(element).addClass($iq.plugin.css);
		},
		
		destroy : function(){
			var instance = this;
			if(instance._destroy){
				instance._destroy(arguments);
			}
		},
		
		remove : function(){
			var instance = this;						
			if(instance._remove){			
				instance._remove(arguments);
			}			
			instance.element.remove();
		},

        _init: $.noop
    });

    $iq.plugin = function (pluginName, basePlugin, pluginPrototype) {
        /// <summary>
        /// 1: $(pluginName, pluginPrototype) - Creates a plugin with the given plugin name. If a plugin with same name is present, extends the plugin
        /// 2: $(pluginName, basePlugin, pluginPrototype) - Creates a plugin with given plugin name and it inherits from the given base plugin.
        /// </summary>
        /// <param name="pluginName">
        /// Name of the plugin to be created. If namespace is not given, defaults to 'iq'
        /// </param>
        /// <param name="pluginPrototype">
        /// Function prototype for the plugin. 
        /// Reserved method names: _preInit, _trigger, _callback, _delegate, _on, _bind, _option, _base
        /// Methods that has to be overriden: _optionChanged, _init
        /// </param>

        // Split the name to get Plugin Name and Namespace
        // Defaults namespace to 'iq' if namespace is not specified
        var pluginNameSplitted = pluginName.split('.'),
            pluginNamespace = pluginNameSplitted.length > 1 ? pluginNameSplitted.shift() : "iq",
			pluginFullName = pluginNamespace + "-" + pluginName,
            existingPlugin;

        pluginName = pluginNameSplitted[0];

        // Check if namespace exists
        $[pluginNamespace] = $[pluginNamespace] || {};

        // Shift the arguments if there is no base plugin provided
        if (!pluginPrototype) {
            pluginPrototype = basePlugin;

            // Use $.iq.Plugin as base plugin
            basePlugin =  $iq.Plugin;
        }

        // create selector for plugin
        $.expr[":"][pluginFullName] = function (elem) {
            return !!$.data(elem, pluginFullName);
        };

        // Initialize plugin parameters and options
        pluginPrototype = $.extend(true, {
            namespace: pluginNamespace,
            pluginName: pluginName,
            eventSuffix: "." + pluginName,
            eventPrefix: pluginName,
            options: $.extend({}, basePlugin.prototype.options),
            _triggerOptions: $.extend({}, basePlugin.prototype._triggerOptions)
        }, pluginPrototype);

        // Create constructor for plugin function
        // Extend the plugin to inherit the base class methods
        existingPlugin = $[pluginNamespace][pluginName] = basePlugin.extend(function (element, options) {

            // avoid using new 
            if (!this._preInit)
                return new $[pluginNamespace][pluginName](element, options);

            // initialize the plugin for the given element and options
            arguments.length && this._preInit(element, options);
        }, pluginPrototype);

        existingPlugin.version = $iq.version;

        // Create the plugin
        $iq.plugin.create(pluginName, existingPlugin);
    }
	
	$iq.plugin.css = "iq-plugin";
	
    $iq.plugin.create = function (pluginName, object) {
        $.fn[pluginName] = function (method) {
            var isMethodCall = typeof method === "string",
                args = Array.prototype.slice.call(arguments, 1),
                objPrototype = object.prototype || object,
                pluginNamespace = objPrototype.namespace,
                dataName = (pluginNamespace ? pluginNamespace + "-" : "") + pluginName,
                returnValue = this;

            // TODO : allow multiple options hash. Really required ?

            if (isMethodCall) {
                this.each(function () {
                    var instance = $.data(this, dataName),
                        methodValue;
                    if (!instance) {
                        if (!object._autoInstantiate) {
                            return $.error("Cannot call method '" + method + "' of uninitialized plugin " + pluginName);
                        }

                        // auto instantiate the plugin for first time use
                        $(this)[pluginName]({});
                        instance = $.data(this, dataName);
                    }
                    if (!$.isFunction(instance[method]) || method.charAt(0) === "_") {
                        return $.error("Method '" + method + "' not defined in plugin " + pluginName);
                    }
                    methodValue = instance[method].apply(instance, args);
                    if (methodValue !== undefined && methodValue !== instance) {
                        returnValue = methodValue.jquery ? returnValue.pushStack(methodValue.get()) : methodValue;
                        return false;
                    }
                });
            }
            else {
                this.each(function () {
                    var domElem = this,
						instance = $.data(domElem, dataName),
                        onElement;
                    if (instance) {						
                        instance.option(method || {});
                    }
                    else {
                        onElement = objPrototype._onElement;
                        if (onElement) {
                            if (!$(domElem).is(onElement)) {
                                $.error("Plugin '" + pluginName + "' can only be initialized on '" + onElement + "' elements");
                            }
                        }

                        if ($.isFunction(object)) {							
                            instance = new object(domElem, method);
                        }
                        else {
                            instance = object;
                            instance._init && instance._init(domElem, method);
                        }
                        $.data(domElem, dataName, instance);
                    }
                });
            }

            return returnValue;
        }
    }

})(jQuery);
