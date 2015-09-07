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

})(jQuery);(function ($, undefined) {
    var $iqEvent = $.iq.event = function (eventName, eventPrototype) {

        // Create a function so that one can use $("element").eventname() for binding and triggering
        // Create only if createFn option is either undefined, or true.
        // Defaults to true
        if (eventPrototype.createFn !== false)
            $iqEvent.createFn(eventName);

        // Extend Event Prototype with defaults
        // This extending eventPrototype occurs only once, 
        // and also the setup, teardown, add, remove methods occurs during binding/unbinding only hence should not affect performance
        // TODO : This method is only a starting point, and better things will be implemented here as and when requirement arises
        eventPrototype = $.event.special[eventName] = $.extend(true, {
            eventSuffix: "." + eventName, // Will be used to internally bind to browser events
            dataNamespace: 'iq',    // $(element).data("dataNamespace.dataname") - holds the options for the elements
            dataName: eventName
        }, eventPrototype, {

            // Default option for bind count on the element
            options: { bindCount: 0 },

            // Backup setup method to _setup and create a new setup method
            _setup: eventPrototype.setup,
            setup: function (eventData, namespaces, eventHandle) {
                var instance = this,
					dataName = eventPrototype.dataNamespace + "." + eventPrototype.dataName,
					data = $.data(instance, dataName);

                if (data) {
                    $.extend(data, eventPrototype.options);
                } else {
                    data = $.extend({}, eventPrototype.options);
                    $.data(instance, dataName, data);
                }

                if (eventPrototype._setup) {
                    return eventPrototype._setup.call(instance, eventData, namespaces, eventHandle, data);
                }
            },

            // Backup teardown method to _teardown and create a new teardown method
            _teardown: eventPrototype.teardown,
            teardown: function () {
                var instance = this;
					extendedData = $.data(instance, eventPrototype.dataNamespace + "." + eventPrototype.dataName);
					
                if (eventPrototype._teardown) {
                    return eventPrototype._teardown.call(instance, extendedData);
                }
				$.removeData(instance, eventPrototype.dataNamespace + "." + eventPrototype.dataName);

            },

            // Backup add method to _add and create a new add method
            _add: eventPrototype.add,
            add: function (handleObj) {
                var instance = this,
					extendedData = $.data(instance, eventPrototype.dataNamespace + "." + eventPrototype.dataName);
                extendedData.bindCount += 1;

                // TODO : handle better way to maintain state for each binding
                // This overrides the global options for the event type
                $.extend(true, extendedData, handleObj.data || {});

                if (eventPrototype._add) {
                    return eventPrototype._add.call(instance, handleObj, extendedData);
                }
            },

            // Backup remove method to _remove and create a new remove method
            _remove: eventPrototype.remove,
            remove: function (handleObj) {
                var instance = this,
                    extendedData = $.data(this, eventPrototype.dataNamespace + "." + eventPrototype.dataName);
                
                if (eventPrototype._remove) {
                    return eventPrototype._remove.call(instance, handleObj, extendedData);
                }
				
				extendedData.bindCount -= 1;
            }
        });

    }

    $iqEvent.createFn = function (eventName) {
        $.fn[eventName] = function (options, fn) {

            // If fn is not provided and 
            // If options is function, 
            // Set fn to options
            if (fn === undefined && $.isFunction(options))
                fn = options

            // Default options to empty array if not given
            options = options || {};

            // if function is defined, it is bind
            // else it is trigger
            return fn ? this.bind(eventName, options, fn) : this.trigger(eventName, options);
        };
    }

})(jQuery);// Based on Caret Plugin - http://www.jquery-plugin.buss.hk/my-plugins/jquery-caret-plugin
// There is only very slight modification made to the original plugin. Hence full credit goes to the original Caret Plugin
(function ($, len, undefined) {
    $.fn.caret = function (options, option2) {
        var $this = this,
			domElem = $this[0],
			start,
			end;

        if (options !== undefined) {
            if (options.start) {
                start = options.start;
                end = options.end;
            } else if (option2) {
                start = options;
                end = option2;
            } else {
				var optionsType = $.type(options);
				if (optionsType === "string") {
					if ((start = domElem.value.indexOf(options)) > -1)
						end = start + options[len];
					else
						start = null;
				} else if (optionsType === "regexp" && (option2 = options.exec(domElem.value)) != null) {
					start = option2.index;
					end = start + option2[0][len];
				}
			}
        }

        if (start === undefined) {
			if ($.support.selection) {
                start = domElem.selectionStart,
				end = domElem.selectionEnd;
            }
            else {
                var range = document.selection["createRange"](),
					stored_range = range["duplicate"]();
                if (domElem.tagName.toLowerCase() != "textarea") {

                    var val = $this.val();
                    stored_range.moveEnd("character", val[len]);
                    start = stored_range.text == "" ? val[len] : val.lastIndexOf(stored_range.text);

                    stored_range = range["duplicate"]();
                    stored_range.moveStart("character", -val[len]);
                    end = stored_range.text[len];

                } else {
                    stored_range.moveToElementText(domElem);
                    stored_range.setEndPoint('EndToEnd', range);

                    start = stored_range.text[len] - range.text[len],
                    end = start + range.text[len]
                }
            }

            return {
                start: start,
                end: end,
                text: domElem.value.substring(start, end),
                replace: function (st) {
                    var domElemVal = domElem.value;
                    return domElemVal.substring(0, start) + st + domElemVal.substring(end, domElemVal[len])
                }
            }            
        }
		
		if ($.support.selection) {
			domElem.selectionStart = start;
			domElem.selectionEnd = end;			
		} else {
			var selRange = domElem.createTextRange();
			selRange.collapse(true);
			selRange.moveStart('character', start);
			selRange.moveEnd('character', end - start);
			selRange.select();
		}
		domElem.focus();
        return $this;

    }
})(jQuery, "length");// Based on the JQuery.Cookie plugin - http://plugins.jquery.com/files/jquery.cookie.js.txt
// and https://github.com/carhartl/jquery-cookie/blob/master/jquery.cookie.js
(function ($, undefined) {

    var $iq = $.iq;

    $.cookie = function (name, value, options) {

        // If name is defined and if it is not a string,
        // We have multiple cookies to be set 
        if (name && typeof name != "string") {
            // Read the associated array and set the cookie based on the key value pairs
            // value variable will hold the options 
            $.each(name, function (key, keyValue) {
                $.cookie(key, keyValue, value);
            });
        }
        // If value is not defined
        // If name is given, we have to return the cookie value
        // else we have to return all the cookies present as an associated array
        else if (value === undefined) {

            options = options || {};

            var cookies = document.cookie,
				doParse = $iq && $iq.parse && options.parse,
				retValues = {};

            if (cookies) {
                if (name) {
                    retValues = new RegExp('(?:^|; )' + encodeURIComponent(name) + '=([^;]*)').exec(cookies);
                    retValues = retValues ? (options.raw ? retValues[1] : decodeURIComponent(retValues[1])) : null;
                    return (retValues && doParse) ? $iq.parse(retValues, doParse) : retValues;
                }

                // below code doesn't replace anything, 
                // just used for splitting the cookie and creating an associated array out of it
                // based on http://ejohn.org/blog/search-and-dont-replace
                cookies.replace(/([^=;]+)=([^;]*)/g, function (m, key, value) {
                    value = options.raw ? value : decodeURIComponent(value);
                    retValues[key] = doParse ? $iq.parse(value, doParse) : value;
                });

                return retValues;
            }
        }

        // Set the cookie with the given name and value
        else {
            options = options || {};

            // If value is null, remove the cookie
            if (value == null) {
                value = "";
                options.expires = -1;
            }

            var expiresDate = options.expires,
				days;

            // Get the expiration date
            if (typeof expiresDate === 'number') {
                days = expiresDate;
                expiresDate = new Date();
                expiresDate.setDate(expiresDate.getDate() + days);
            }

            // convert the object value to string based on the type given type(options.parse.type)
            if ($iq && $iq.stringify && options.parse && options.parse.type)
                value = $iq.stringify(value, options.parse);

            // Set the cookie
            return (document.cookie = [encodeURIComponent(name), '=',
							 (options.raw ? value : encodeURIComponent(value)), // value
							 (expiresDate ? ';expires=' + expiresDate.toUTCString() : ""), // expires
							 (options.path ? ';path=' + options.path : ''), // path
							 (options.domain ? ';domain=' + options.domain : ''), // domain
							 (options.secure ? ';secure' : '') // secure
					].join(''));
        }
    };

    $.cookie.get = function (name, getOptions, parseOptions) {
        if (getOptions) {
            getOptions.parse = parseOptions;
        }
        return $.cookie(name, undefined, getOptions);
    }

    $.cookie.set = function (name, value, cookieOptions, parseOptions) {
        if (cookieOptions) {
            cookieOptions.parse = parseOptions;
        }
        $.cookie(name, value, cookieOptions);
    }

})(jQuery);(function ($, undefined) {

    var $iq = $.iq,
		$iqFnHooks = $iq.fnHooks,
		rules = $iqFnHooks.rules,
		sheet = $iqFnHooks.sheet,
		deleteRule = $iqFnHooks.deleteRule,
        classes;

    function cssRule(element, options) {

        var $this = this.element = $(element);

        // store cssSheet, as we will be using this mostly
        this.cssSheet = $this[0][sheet];

        if (!$this.is("link,style")) {
            $.error("cssRule plugin can be used only for link and style tags");
        }
    }

    cssRule._autoInstantiate = true;

    $.extend(cssRule.prototype, {

        _searchRule: function (selectors, matchCallback, unavailableCallback) {

            var selectorsLength,
				globalSearch = false;

            if (selectors) {
                if ($.isFunction(selectors)) {
                    matchCallback = selectors;
                    selectors = undefined;
                    globalSearch = true;
                }
                // make selectors an array if not an array						 
                else {
                    if (!$.isArray(selectors)) {
                        selectors = [selectors];
                    }
                    selectorsLength = selectors.length;
                }
            }
            else {
                globalSearch = true;
            }

            var retMatchedRules = [],
				matchedIndices = [],
				cssRules = this.cssSheet[rules],
				remainingCount = selectorsLength,
				i = cssRules.length,
				cssRule,
				searchIndex;

            // Iterate through the css rules, until all css rules are checked or until all given selectors are processed
            for (; i && (remainingCount || globalSearch); ) {

                // Get the css rule
                cssRule = cssRules[--i];

                // Do case insensitive search of selector in selectors array
                // 0 explicitly introduced just to speed up the indexOf function				
                if (globalSearch || (searchIndex = $iq.indexOf(cssRule.selectorText.toLowerCase(), selectors, 0, true)) > -1) {

                    if (!globalSearch) {
                        matchedIndices[searchIndex] = true;

                        // Decrement the total number of selectors that are processed
                        // Just for speeding up the for loop
                        remainingCount--;
                    }

                    retMatchedRules.push(cssRule);

                    // process the rule
                    // i --> index in css rules
                    if (matchCallback && (matchCallback(i, cssRule) === false)) {
                        break;
                    }
                }
            }

            // Trigger callback for all selectors that are not available
            if (!globalSearch && unavailableCallback) {
                for (; selectorsLength; ) {
                    if (!matchedIndices[--selectorsLength]) {
                        unavailableCallback(selectors[selectorsLength]);
                    }
                }
            }

            return retMatchedRules;
        },
        rule: function (selectors, style, value, addIfNotExist) {
            var instance = this,
                styles = {},
                matchCallback = function (i, cssRule) {
                    $.each(styles, function (cssStyle, styleValue) {
                        cssRule.style[$.trim(cssStyle)] = $.trim(styleValue);
                    });
                };

            if (selectors) {
                if (selectors.indexOf('{') > -1) {

                    // cssRule('rule', '#element{background:#ffffff; color: #000000;}')					
                    instance._cssText(selectors, function (selector, cssRules) {

                        // value variable holds boolean value 'addIfNotExist'
                        instance.rule(selector, cssRules, value);

                    });
                }
                else if (style) {
                    if (typeof style === "string") {
                        if (style.indexOf(':') > -1) {

                            // cssRule('rule', '#element', 'background:#ffffff; color: #000000;')
                            $.each(style.split(';'), function (index, cssStyle) {
                                var cssProp = cssStyle.split(":");
                                styles[cssProp[0]] = cssProp[1];
                            });

                        }
                        else if (value) {
                            // cssRule('rule', '#element', 'background', '#ffffff')
                            styles[style] = value;
                        }
                        else {
                            // return property value
                            // cssRule('rule', '#element', 'background')	
                            var cssRule = instance.rule(selectors);
                            if (cssRule && cssRule.length > 0) {
                                return cssRule[cssRule.length - 1].style[$.trim(style)];
                            }
                        }
                    }
                    else {
                        // cssRule('rule', '#element', {background:#ffffff, color: #000000})
                        styles = style;
                    }

                    // Search for all the selectors
                    // if match is found, apply all rules - matchCallback
                    // if match is not found add the rule and then call "matchCallback" for the newly added rule
                    instance._searchRule(selectors, matchCallback, function (selector) {
                        instance.addRule(selector);

                        var cssRule = instance.rule(selector);

                        if (cssRule && cssRule.length > 0) {
                            // we are not going to do anything with the index - hence passing undefined
                            matchCallback(undefined, cssRule[cssRule.length - 1]);
                        }
                    });
                }
                else {
                    // return rule for given selector
                    // cssRule('rule', '#element')
                    return instance._searchRule(selectors);
                }
            }
            else {
                // return all rules
                // cssRule('rule');		
                return instance._searchRule();
            }
        },
        addRule: function (selector, prop) {
            var cssSheet = this.cssSheet;
            if (cssSheet.addRule)
                cssSheet.addRule(selector, prop || ';');
            else if (cssSheet.insertRule)
                cssSheet.insertRule(selector + '{' + prop + '}', cssSheet[rules].length);
        },
        deleteRule: function (selectors) {

            var instance = this;
            instance._searchRule(selectors, function (i) {
                // If match is found, delete the rule
                instance.cssSheet[deleteRule](i);
            });

        },
        clean: function (selectors) {
            var instance = this,
				style;
            if (selectors) {
                instance._searchRule(selectors, function (i, cssRule) {

                    style = cssRule.style;

                    // Delete all the properties
                    for (var key in style) {

                        // TODO : Any possibility to refine this check ?
                        if (style.removeProperty) {
                            style.removeProperty(key);
                        }
                        else
                            style.removeAttribute($.camelCase(key));
                    }
                });
            }
            else {
                // iterate through all the rules and delete them
                for (var cssSheet = instance.cssSheet, i = cssSheet[rules].length; i; ) {
                    cssSheet[deleteRule](--i);
                }
            }
        },
        deleteStyle: function (selectors, styles) {

            if (!$.isArray(styles)) {
                styles = [styles];
            }

            this._searchRule(selectors, function (i, cssRule) {
                for (var cssStyle = cssRule.style, i = styles.length; i--; ) {

                    // TODO : Any possibility to refine this check ?
                    if (cssStyle.removeProperty)
                        cssStyle.removeProperty(styles[i]);
                    else
                        cssStyle.removeAttribute($.camelCase(styles[i]));
                }
            });
        },
        _cssText: function (cssText, callback) {
            if (cssText && callback) {
                var regexRule = $iq.regex.splitRule,
					cssRules = $.map(cssText.split('}'), function (str) {
					    if (str)
					        return str + '}';
					});
                for (var i = cssRules.length, cssRule; i; ) {
                    cssRule = regexRule.exec(cssRules[--i]);
                    callback(cssRule[1], cssRule[3]);
                }
            }
        },
        cssText: function (mode, cssText) {
            // mode - "clean", "new", "append"

            if (!cssText) {
                mode = "append";
                cssText = mode;
            }

            if (cssText) {

                var instance = this,
                    newRule = (mode == "clean" || mode == "new");

                // Delete all rules 
                if (mode == "clean") {
                    instance.clean();
                }
                                
                instance._cssText(cssText, function (selector, cssRules) {
                    instance[newRule ? "addRule" : "rule"](selector, cssRules);
                });
            }
        }
    });

    $iq.plugin.create("cssRule", cssRule);

})(jQuery);(function ($, undefined) {
    var $iq = $.iq,
        classes;

    $iq.plugin("multiview", {
        options: {
            animateMode: "margin",  // applicable only if animate is set to true
            selectedIndex: 0,
            filter: ">*",
            animate: false,
            duration: 'fast'
        },
        eventPrefix: 'tab',
        _activeView: null,
		_previousAnimatedIndex : 0,
		_previousAnimated: false,
        activeView: function (index, dontAnimate /* used internally */) {

            var instance = this,
				$this = instance.element,
				$activeView = instance._activeView,
				options = instance.options,
				$selectedView;
            if (index !== undefined && !instance._animating) {
                if (typeof index == "number") {
                    $selectedView = instance._pages.eq(index);
                }
                else {
                    $selectedView = index;
					index = instance._pages.index($selectedView[0]);
                }

                if (options.animate && options.animateMode == "margin") {
					if($this.is(":visible")){		
						
						if(!instance._previousAnimated){		
							instance._previousAnimated = true; 
							
							$this.addClass(classes.animate);
							options.animate = false;
							instance.activeView(instance._previousAnimatedIndex);
							options.animate = true;
							instance.activeView(instance._pages.index($activeView[0]), true);				
							
							
						}
						instance._previousAnimatedIndex = index;
						var endOffset = $selectedView.offset(),
							startMarginTop = parseInt($this.css("marginTop")) || 0,
							startMarginLeft = parseInt($this.css("marginLeft")) || 0,
							startOffset = $activeView.offset();
							
						$this.stop(false, true).animate({
							marginTop: (startMarginTop + startOffset.top - endOffset.top),
							marginLeft: (startMarginLeft + startOffset.left - endOffset.left)
						}, {
							duration: dontAnimate ? 0 : options.duration,
							easing: options.easing
						});
					}
					else {
						$this.removeClass(classes.animate);
						instance._previousAnimated = false;						
					}
                }


                $activeView.removeClass(classes.viewSelected);
                instance._activeView = $selectedView.addClass(classes.viewSelected);
                return instance;
            }
            return $activeView;
        },

        _init: function () {
            var instance = this,
                $this = instance.element.addClass(classes.container),
				options = instance.options;

            instance._pages = $this.find(options.filter).addClass(classes.view);
            instance._activeView = instance._pages.eq(0).addClass(classes.viewSelected);

            if (options.selectedIndex) {
                instance.activeView(options.selectedIndex || 0, true);
            }

            return $this;
        }
    });

    classes = $.iq.multiview.classes = {
        container: "iq-multiview", 		// tabs container
        animate: "iq-multiview-animate",

        view: "iq-multiview-view",

        viewSelected: "iq-multiview-view-selected"
    }

})(jQuery);
// Based on jQuery UI Position - http://jqueryui.com/demos/position/
// Big thanks for the wonderful plugin and naming conventions for options
(function ($, undefined) {

    var _position = $.fn.position,
        regLCR = /(left)|(center)|(right)/,
        regTCB = /(top)|(center)|(bottom)/,
		collision;

    function windowSize(wh) {
        var element = window,
            documentNode = element.document,
            docElemProp = documentNode.documentElement["client" + wh],
            body = documentNode.body;
        return documentNode.compatMode === "CSS1Compat" && docElemProp || body && body["client" + name] || docElemProp;
    }

    function getSplitPosition(pos) {
        var positionSplit = pos ? $.trim(pos).split(" ") : ["50%", "50%"];

        if (positionSplit.length == 1) {
            positionSplit = /(top|bottom)/i.exec(positionSplit[0]) ? ["50%", positionSplit[0]] : [positionSplit[0], "50%"];
        }
        return positionSplit;
    }
    function getPosition(myPos, wh, hvPos) {

        var xy,
            temp = /((-?[\d]+)%)|((-?[\d]+)px)/.exec(myPos),
            percentage;

        if (temp) {
            if (temp[2] !== undefined && temp[2] !== "") {
                percentage = temp[2];
            }
            else {
                xy = temp[4];
            }
        }
        else {
            temp = hvPos.exec(myPos);
            percentage = temp ? (temp[1] ? 0 : temp[2] ? 50 : temp[3] ? 100 : 50) : 50;
        }

        if (percentage !== undefined) {
            xy = wh * percentage / 100;
        }
        return parseInt(xy);
    }

    $.fn.position = function (options) {

        if (!options || !options.of) {
            return _position.apply(this, arguments);
        }

        options = $.extend({}, {
            fixed: false
        }, options);

				
        var $this = this.css({ left: "0px", top: "0px" }),
			displayValue = $this.css("display"),
            $target = $(options.of),
            isWindow = $target[0] === window,
            $targetOffset = isWindow ? { left: 0, top: 0} : $target.offset(),
			$thisOffset = $this.show().offset(),
            marginLeft = isWindow ? 0 : parseInt($target.css("margin-left")),
            marginTop = isWindow ? 0 : parseInt($target.css("margin-top")),
            myPositionSplit = getSplitPosition(options.my),
            atPositionSplit = getSplitPosition(options.at),
            offset = options.offset,
            isWithinTarget = isWindow || $this.parents().filter($target[0]).length;

		$this.css("display", displayValue);
		//- (isWithinTarget ? parseInt(isWindow ? 0 : $target.css("border-left-width")) : 0) 
		//- (isWithinTarget ? parseInt(isWindow ? 0 : $target.css("border-top-width")) : 0) 
		//console.log($target.scrollTop());
		$this.css({
            left: -$thisOffset.left + $targetOffset.left + getPosition(atPositionSplit[0], isWindow ? windowSize("Width") : $target.outerWidth(), regLCR) - getPosition(myPositionSplit[0], $this.outerWidth(), regLCR) - (parseInt($this.css("margin-left")) || 0) + (parseInt(marginLeft) || 0) + (offset ? (parseInt(offset.left) || 0) : 0),// + (isWithinTarget ? $target.scrollLeft() : 0),
            top: -$thisOffset.top + $targetOffset.top + getPosition(atPositionSplit[1], isWindow ? windowSize("Height") : $target.outerHeight(), regTCB) - getPosition(myPositionSplit[1], $this.outerHeight(), regTCB) - (parseInt($this.css("margin-top")) || 0) + (parseInt(marginLeft) || 0) + (offset ? (parseInt(offset.top) || 0) : 0) //+ (isWithinTarget ? $target.scrollTop() : 0)
        });


        // internally used condition to avoid multiple binds - though not a problem
        if (options.disableFix !== true) {

            var $targetParent = isWindow ? $(document) : $target.scrollParent(),
                positionedElements;

            // Bind events under the below conditions
            //    - If element has to be fixed and (position is not fixed or browser doesn't support fixed) and (target is window or element to be positioned is contained within the target)
            if ((options.fixed && (!$.support.fixedPosition || $this.css("position") != "fixed") && isWithinTarget)
                || options.autoPosition) {

                if ($targetParent[0] === document)
                    $targetParent = $(window);

                options.fixed = true;
                options.disableFix = true;
                positionedElements = $targetParent.data("iq-position-elements");

                if (!positionedElements) {

                    positionedElements = [$this.data("iq-position", options)[0]];
                    $targetParent.data("iq-position-elements", positionedElements).bind("scroll resize", function () {
                        for (var elements = $targetParent.data("iq-position-elements"), i = elements.length, $element; i--; ) {
                            $element = $(elements[i]);
                            $element.position($element.data("iq-position"));
                        }
                    });
                }
                else {

                    var found;
                    for (var $targetParents = $targetParent.data("iq-position-elements"), i = $targetParents.length; i--; ) {
                        if ($targetParents[i] === $this[0]) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        positionedElements.push($this.data("iq-position", options)[0]);
                    }
                }
            }
        }
        return $this;
    }
	collision = $.iq.position = {
		flip : {
			x : {
			},
			y : {
			}		
		},
		fit : {
			x : {
			},
			y : {
			}
		},
		flipfit : {
			x : {
			},
			y : {
			}
		}		
	}
})(jQuery);(function ($) {

    $.fn.scrollTo = function (element, duration, easing, complete) {

        // TODO : handle scrollTo for multiple elements in $this

        var $this = this,
			options,
            $scrollParent,
            scrollProperties = {};

        if (typeof element == "number" || (!(element instanceof $) && $.isPlainObject(element))) {			
            options = $.speed(element, duration, easing);
            element = this.eq(0);
            $scrollParent = element.scrollParent();			
        } else {
            options = $.speed(duration, easing, complete)
            $scrollParent = $this;
            element = $(element, this).eq(0);
			
        }

        options = $.extend({
            axis: 'xy',
            easing: "linear",
            duration: 0,
            includeMargin: true,
            queue: false
        }, options);

        if (element.length) {            
            if (options.axis.indexOf('x') >= 0) {
                $scrollParent.animate({
                    scrollLeft: (($scrollParent.is("html,body") ? 0 : $scrollParent.scrollLeft()) + (element.position().left - ($scrollParent.is("html,body") ? 0 : $scrollParent.position().left) + (options.includeMargin ? 0 : (parseInt(element.css("marginLeft")) || 0))))
                }, options);
            }

            if (options.axis.indexOf('y') >= 0) {
                $scrollParent.animate({
                    scrollTop: (($scrollParent.is("html,body") ? 0 : $scrollParent.scrollTop()) + (element.position().top - ($scrollParent.is("html,body") ? 0 : $scrollParent.position().top) + (options.includeMargin ? 0 : (parseInt(element.css("marginTop")) || 0))))
                }, options);
            }
        }
    };

})(jQuery);
// Based on JQuery UI Selectable
// With added options for shift select, keyboard select including select all option	
(function ($, undefined) {
    var $iq = $.iq,
	    classes;

	// TODO : keyboard select is too slow, requires revisit
    $iq.plugin("selectable", {
        options: {
            filter: '>*',
            helperParent: '',
            tolerance: 'touch', // touch - if the helper box has to just touch the element for selecting it
            distance: 100, 		// fit - if the helper box needs to completely encloses the element for selecting it
            autoRefresh: true	// TODO : Add option for cancel 
                                // TODO : distance
        },
        _triggerOptions: {
            prependEventPrefix: false
        },
        refresh: function () {
            var instance = this;

            // Refresh datas of all the selectees
            instance.selectees = $(instance.options.filter, instance.element).addClass(classes.selectee).each(function () {
                var $this = $(this),
					offset = $this.offset();
                $this.data("iq.selectee", {                    
                    left: offset.left,
                    top: offset.top,
                    right: offset.left + $this.outerWidth(),
                    bottom: offset.top + $this.outerHeight(),
                    selected: $this.hasClass(classes.selected),
                    selecting: $this.hasClass(classes.selecting),
                    deselecting: $this.hasClass(classes.deselecting)
                });
            });
        },       
        _getMid: function ($selectee) {
            var selecteeData = $selectee.jquery ? $selectee.data("iq.selectee") : $selectee;
            return { x: selecteeData.left + (selecteeData.right - selecteeData.left) / 2,
                y: selecteeData.top + (selecteeData.bottom - selecteeData.top) / 2
            }
        },
		_select : function($selectees, event, selectOnOrOff, triggerMode){
			//triggerMode : 0 or undefined- trigger both events, 1 - trigger pre event alone, 2 - trigger post event alone
			var instance = this,
				selectMethod = selectOnOrOff ? "selectItem" : "deselectItem",
				selecting = selectOnOrOff ? "selecting" : "deselecting",
				selectingClass = classes[selecting],
				selected = selectOnOrOff ? "selected" : "deselected",
				$selectee,
				selectee;
				
			$selectees.each(function () {
			
                $selectee = $(this);
				selectee = $selectee.data("iq.selectee");
				selectee[selecting] = true;
				
                // Trigger selecting/deselecting event
                if (triggerMode == 2 || instance._trigger(selecting, event, { target: $selectee.addClass(selectingClass)[0] })){
					if(triggerMode != 1){
						
						$selectee.removeClass(selectingClass);
						selectee[selecting] = false;
						
						// Select/Deselect the item 
						instance[selectMethod]($selectee);

						// Trigger selected event
						instance._trigger(selected, event, { target: $selectee[0] });
					}
                }
				else {
					$selectee.removeClass(selectingClass);
					selectee[selecting] = true;
				}
            });
		},        
        _getItems: function ($selectee1, $selectee2, callback) {
            if ($selectee2) {
                
				// Get mid points for the two selectees				
                var instance = this,
					mid1 = instance._getMid($selectee1),
					mid2 = instance._getMid($selectee2),
					midX1 = mid2.x,
					midX2 = mid1.x,  // Intentional.... to reduce code size
					midY1 = mid1.y, 
					midY2 = mid2.y,
					retArray = [];
                
				if (midY1 > midY2) {
					midY1 = midY2;					
					midY2 = mid1.y;										
				}
				else if(midY1 != midY2 || midX2 < midX1){
					midX1 = midX2;
					midX2 = mid2.x;
				}
					
                // Loop through all the selectees, and select all items that fall between the two selectees
                this.selectees.each(function () {
                    var $selectee = $(this),
						selectee = $selectee.data("iq.selectee"),
						hit = true;
                    if (selectee.bottom > midY1 && selectee.top < midY2) {
						if(midY1 == midY2) {
                            hit = selectee.right > midX1 && selectee.left < midX2;
                        }
						else {
							mid1 = instance._getMid(selectee);
							if ((mid1.y - midY1) < (midY2 - mid1.y)){									
								if(selectee.right < midX1) {
									hit = selectee.top > midY1;
								}
								else if (selectee.left > midX2) {
									hit = selectee.bottom < midY2;
								}
							}
							else if (mid1.y == midY1) {
								hit = selectee.right > midX1;
							}
							else if (mid1.y == midY2) {
								hit = selectee.left < midX2;
							}
						}
                        if (hit) {
							retArray.push($selectee[0]);
                            if(callback){
								callback($selectee, selectee);
							}
                        }
                    }
                });
            }
            else {
				retArray.push($selectee1[0]);
				if(callback){
					callback($selectee1, $selectee1.data("iq.selectee"));
				}
            }
			return $(retArray);
        },
        selectItem: function ($selectee1, $selectee2) {
            var instance = this,
                selectee;

            // If only one selectee is given, just select that item
            if ($selectee2 && $selectee1[0] !== $selectee2[0]) {
                instance._getItems($selectee1, $selectee2, function ($selectee) {
                    instance.selectItem($selectee);
                });
            }
            else {
				selectee = $selectee1.removeClass(classes.deselecting + " " + classes.selecting).addClass(classes.selected).data("iq.selectee");
                selectee.selecting = false;
                selectee.selected = true;
            }
        },
        deselectItem: function ($selectee) {
            if ($selectee && $selectee.length) {
				$selectee.each(function(){
					var selectee = $(this).removeClass(classes.deselecting + " " + classes.selected).data("iq.selectee");
					selectee.deselecting = false;
					selectee.selected = false;
				});
            }
        },
        toggleSelection: function ($selectee, toggleOnOrOff) {
            $selectee.toggleClass(classes.selected, toggleOnOrOff).data("iq.selectee").selected = toggleOnOrOff;
        },
        getSelected: function () {
            return this.selectees && this.selectees.filter('.' + classes.selected);
        },
        _lastSelectee: null,
        _init: function () {
            var instance = this,
				options = instance.options,
				helperParent = options.helperParent || 'body',
				deselect;

            // Refresh the selectees
            instance.refresh();

            // Create the helper
            instance.helper = $("<div class='" + classes.helper + "'/>");

            instance.element.dragstart(function (event, data) {
                // occurs when the mouse is down			
                var $selectees;

				deselect = true;
				
                // Refresh the selectees during mouse down
                if (options.autoRefresh)
                    instance.refresh();

                // Append the helper to the document
                // and reset the helper
                instance.helper.appendTo(helperParent).css({
                    left: data.start.pageX,
                    top: data.start.pageY,
                    width: 0,
                    height: 0,
                    display: 'block'
                });
				
				instance._trigger("selectstart", event);

                // Iterate through all parents and get the $selectee object
                $(data.target).parents().andSelf().each(function () {
                    var $this = $(this),
						selectee = $this.data("iq.selectee");

                    if (selectee) {
                        if (event.shiftKey) {
                            
							// deselect all existing items
							instance._select(instance.getSelected(), event, false, 0);
							
							// prepare the elements for selecting all items between given two items                            
							// trigger - selecting event
                            instance._lastSelectee = instance._lastSelectee || instance.closest();
                            instance._select(instance._getItems($this, instance._lastSelectee), event, true, 1);
                        }
                        else if (selectee.selected) {
						
                            // if ctrl is pressed, prepare for deselecting the item
                            // Don't deselect here, as the item can also be dragged
                            if (event.metaKey) {
                                instance._select($selectee, event, false, 1);
                            }
							else {
								// Deselect all existing items only if the current selectee is not selected
								// This is important while dragging selected items
								// If this check is not there, dragging will be a problem on the selected item						
								deselect = false;
							}
                        }
                        else {
                            // Get all selectees for deselecting
                            // We have to get it here itself, to avoid excluding the newly selected selectee
                            $selectees = instance.getSelected();

                            // select the item
                             instance._select($this, event, true, 1);
                        }
                        return false;
                    }
                });

                // If shift key is not pressed, and 
                // If control key is not pressed, and if can deselect
                // deselect all the selected items
                if (!event.shiftKey && !event.metaKey && deselect) {

                    // Incase clicked outside of all selectees, and within the container, 
                    // $selectees will be undefined and hence we will deselect all the elements
                    instance._select($selectees || instance.getSelected(), event, false, 0);
                }

            }).drag(function (event, data) {

				if(deselect){
					// occurs when the mouse is dragged

					// get the mouse start position and the current positions
					var x1 = data.start.pageX,
						x2 = data.current.pageX,
						y1 = data.start.pageY,
						y2 = data.current.pageY, 
						tmp;
					
					// Make a proper rectangle with available points
					if(x1 > x2){ tmp = x1; x1 = x2; x2 = tmp };
					if(y1 > y2){ tmp = y1; y1 = y2; y2 = tmp };
					
					// set the helper box
					instance.helper.css({ left : x1, top: y1, width: x2 - x1, height: y2 - y1 });

					// iterate through all the selectees and see check if each selectee falls within the rectangle
					instance.selectees.each(function () {
						var $this = $(this),
							selectee = $this.data("iq.selectee"),
							hit = false;

						// in touch mode, hit will be true, if any part of the selectee falls within the rectangle
						// in fit mode, hit will be true, if the full selectee element falls within the rectangle
						if (options.tolerance == 'touch') {
							hit = !(selectee.left > x2 || selectee.right < x1 || selectee.top > y2 || selectee.bottom < y1);
						} else if (options.tolerance == 'fit') {
							hit = (selectee.left > x1 && selectee.right < x2 && selectee.top > y1 && selectee.bottom < y2);
						}

						// If the selectee falls within the rectangle
						if (hit) {

							// If it is already selected, prepare for deselecting
							if (selectee.selected) {
								if (!selectee.deselecting) {
									instance._select($this, event, false, 1);
								}
							}
							else if (!selectee.selecting) {
								instance._select($this, event, true, 1);
							}
						}
						else {
							if (selectee.selecting) {
								selectee.selecting = false;
								$this.removeClass(classes.selecting);
							}
							else if (selectee.deselecting) {
								selectee.deselecting = false;
								$this.removeClass(classes.deselecting);
							}
						}
					});
				}
            }).dragend(function (event) {
                instance.helper.remove();
                instance.selectees.each(function () {

                    var $selectee = $(this),
                        data = $selectee.data("iq.selectee");

                    // If prepared for deselecting, deselect it
                    if (data.deselecting) {

                        // Deselect the item 
                        instance._select($selectee, event, false, 2);
                    }
                    else if (data.selecting) {

                        if (!data.selected) {
                            // Select the item 
                            instance._select($selectee, event, true, 2);
                        }
                        else {
                            data.selecting = false;
                        }
                    }
                });
				
				instance._trigger("selectend", event);
            });
        }
    });

    classes = $.iq.selectable.classes = {
        helper: 'iq-selectable-helper',
        selectee: 'iq-selectable-selectee',
        selected: 'iq-selectable-selected',
        selecting: 'iq-selectable-selecting',
        deselecting: 'iq-selectable-deselecting'
    }
})(jQuery);
(function ($) {
    var $iq = $.iq,
        classes = $iq.selectable.classes,
		keys = $iq.keys;

    $.extend(classes, {
        focused: 'iq-sel-focused'
    });

    $iq.plugin("selectable",$iq.selectable, {
        options: {
            keyboard: {
                enabled: false
            }
        },
        focusItem: function ($li) {
            $li && $li.trigger("focus");
        },
        blurItem: function ($li) {
            $li && $li.trigger("blur");
        },
        closest: function (direction) {
            // direction 1 - Top, 2 - Right, 3 - Bottom, 4 - Left
            var instance = this,
				$closest,
				closestDistance,
				midX,
				midY,
				mid;

            if (instance.focusedItem) {
                mid = instance._getMid(instance.focusedItem),
				midX = mid.x;
                midY = mid.y;
            }
            else {
                midX = midY = 0;
                direction = 3;
            }

            if (instance.selectees) {
                instance.selectees.each(function () {
                    var $this = $(this),
						distance,
						selecteeMid = instance._getMid($this);
						selecteeX = selecteeMid.x,
						selecteeY = selecteeMid.y,
						relativeX = selecteeX - midX,
						relativeY = midY - selecteeY;

                    if ((direction == 1 && selecteeY < midY && (Math.abs(relativeX) < relativeY)) ||
					    (direction == 2 && selecteeX > midX && (Math.abs(relativeY) < relativeX)) ||
						(direction == 3 && selecteeY > midY && (Math.abs(relativeX) < -relativeY)) ||
						(direction == 4 && selecteeX < midX && (Math.abs(relativeY) < -relativeX))) {

                        distance = Math.sqrt(Math.pow(relativeX, 2) + Math.pow(relativeY, 2));
                        if (!closestDistance || distance < closestDistance) {
                            closestDistance = distance;
                            $closest = $this;
                        }
                    }
                });
            }

            return $closest || instance.focusedItem || $([]);

        },
        _lastFocused: null,
        focusedItem: null,
        _init: function () {
            var instance = this,
				options = instance.options;

            instance._base("_init");

            if (options.keyboard.enabled) {

                instance.element.bind("keydown" + instance.eventSuffix, function (event) {
                    var keyCode = event.which,
                        direction,
                        $closest,
						$lastSelectee;
					
                    if (keyCode == keys.space) {
						instance._trigger("selectstart", event);
                        if (!event.metaKey || event.shiftKey) {
                            instance._select(instance.getSelected(), event, false, 0);
                        }
                        if (event.shiftKey) {
							instance._select(instance.focusedItem, event, true, 0);                            
                        }
                        else {
							instance._select(instance.focusedItem, event, !instance.focusedItem.data("iq.selectee").selected, 0);
                            //instance.toggleSelection(instance.focusedItem, !event.metaKey || !instance.focusedItem.hasClass(classes.selected));
                        }
						//instance._trigger("selectend", event);
                        return false;
                    }
                    else {
						instance._trigger("selectstart", event);
                        direction = keyCode == keys.up ? 1 : (keyCode == keys.right ? 2 : (keyCode == keys.down ? 3 : (keyCode == keys.left ? 4 : 0)));
                        if (direction && ($closest = instance.closest(direction))) {


                            if (event.shiftKey) {
                                $lastSelectee = instance._lastFocused || instance.focusedItem;
                                instance._select(instance.getSelected(), event, false, 0);
                                instance._select(instance._getItems($closest, $lastSelectee), event, true, 0);
                            }

                            instance.focusedItem.attr("tabIndex", -1);
                            instance.blurItem(instance.focusedItem);
                            instance.focusItem($closest);

                            instance._lastFocused = $lastSelectee;

                        }
						else {
							if(event.metaKey && keyCode == keys.a){
								instance._select(instance.getSelected(), event, false, 0);
								instance._select(instance.selectees, event, true, 0);
							}
						}
						//instance._trigger("selectend", event);
                        return false;
                    }
					
                });
				
                instance.selectees.attr('tabIndex', -1).bind('focus', function (e) {					
					var $this = $(this);
					
					// Refresh the selectees when any one of the selectees gets focused for the first time
					if($this.attr("tabIndex") == 0){						
						instance.refresh(); 
					}
					
					instance._lastFocused = instance.focusedItem = $this.attr("tabIndex", 0).addClass(classes.focused);
					
                    e.stopPropagation();
                }).bind('blur', function () {
                    $(this).removeClass(classes.focused);
                });
                instance.closest().attr('tabIndex', 0);
            }
        }
    });


})(jQuery);
// Based on the JQuery.Cookie plugin - http://plugins.jquery.com/files/jquery.cookie.js.txt
(function ($) {
    var $iq = $.iq,
		setupDrag = function (eventData, namespaces, eventHandle, extendedData) {
		    bindMousedown(this, extendedData);
		},
		teardownDrag = function (extendedData) {
		    unbindMousedown(this, extendedData);
		},
		bindMousedown = function (element, extendedData) {
		    if (!extendedData.dragBound) {
		        extendedData.dragBound = true;
		        $(element).bind("mousedown", extendedData, mousedown);
		    }
		},
		unbindMousedown = function (element, extendedData) {
		    if (!extendedData.bindCount) {
		        extendedData.dragBound = false;
		        $(element).unbind("mousedown", mousedown);				
		    }
		},
		mousedown = function (event) {
		    var domElem = this,
				$this = $(domElem),
				extendedData = event.data,
				allowedHandles = extendedData.handle,
				cancelElements = extendedData.cancel,
				eventTarget = event.target,
				$container = extendedData.container,
                $event,
				retVal;
			// Cancel drag if the target is one of the disallowed elements
		    if (cancelElements && (typeof cancelElements == "string" ?
											$(eventTarget).parents().andSelf().filter(cancelElements).length
										:
											$.isFunction(cancelElements) ?
												cancelElements.call($this, eventTarget)
											:
												false)) {
		        return;
		    }

		    // Allow drag only if the target is one of the allowed elements
		    if (allowedHandles && !(typeof allowedHandles == "string" ?
										$(eventTarget).parents().andSelf().filter(allowedHandles).length
									:
										$.isFunction(allowedHandles) ?
											allowedHandles.call($this, eventTarget)
										:
											true)) {
		        return;
		    }

		    $event = $iq.Event(event, 'dragstart');

		    // Set more properties related to drag
		    extendedData.start = {
		        x: event.clientX,
		        y: event.clientY,
		        pageX: event.pageX,
		        pageY: event.pageY,
		        left: (parseInt($this.css('left') == 'auto' && $this.css('position') == 'absolute' ? $this[0].offsetLeft : $this.css('left')) || 0),
		        top: (parseInt($this.css('top') == 'auto' && $this.css('position') == 'absolute' ? $this[0].offsetTop : $this.css('top')) || 0)
		    }

		    if ($container) {
		        var $elemOffset = $this.offset(),
					$containerOffset = $container.offset(),
                    offset = $.extend({
                        x1: 0, 
                        y1: 0,
                        x2: 0,
                        y2: 0
                    }, extendedData.offset),
		            minLeft = $containerOffset.left - $elemOffset.left +
							(parseInt($this.css('left') == 'auto' && $this.css('position') == 'absolute' ? $this[0].offsetLeft : $this.css('left')) || 0) +
							(parseInt($container.css("border-left-width")) || 0) + (parseInt($this.css("marginLeft")) || 0) -
							(parseInt($this.css('margin-left')) || 0),

					minTop = $containerOffset.top - $elemOffset.top +
							(parseInt($this.css('top') == 'auto' && $this.css('position') == 'absolute' ? $this[0].offsetTop : $this.css('top')) || 0) +
							(parseInt($container.css("border-top-width")) || 0) + (parseInt($this.css("marginTop")) || 0) -
							(parseInt($this.css('margin-top')) || 0),
                    relativeWidth = $container.innerWidth() - (extendedData.zoneWrap ? $this.outerWidth() : 0),
                    relativeHeight = $container.innerHeight() - (extendedData.zoneWrap ? $this.outerHeight() : 0);
		        extendedData.bounds = {
		            x1: minLeft + offset.x1,
		            y1: minTop + offset.y1,
		            x2: minLeft + (relativeWidth < 0 ? 0 : relativeWidth) + offset.x2,
		            y2: minTop + (relativeHeight < 0 ? 0 : relativeHeight) + offset.y2
		        }
		    }

		    extendedData.target = event.target; // jQuery lower versions replaces the target while triggering the events
		    $this.trigger($event, extendedData);
		    retVal = !$event.isDefaultPrevented();

		    if (extendedData.dragEnabled && retVal) {
		        extendedData.$element = $this;
		        $(document).bind('mousemove', extendedData, mousemove).bind('mouseup', extendedData, mouseup);
		    }

		    return false;
		},
		mousemove = function (event) {
		    var extendedData = event.data;
		    $event = $iq.Event(event, 'drag');
		    extendedData.current = {
		        x: event.clientX,
		        y: event.clientY,
		        pageX: event.pageX,
		        pageY: event.pageY
		    };
		    extendedData.relative = {
		        x: event.clientX - extendedData.start.x,
		        y: event.clientY - extendedData.start.y
		    };
		    extendedData.$element.trigger($event, extendedData);
		    return false;
		},
		mouseup = function (event) {
		    var extendedData = event.data;
		    $(document).unbind('mousemove', mousemove).unbind('mouseup', mouseup);
		    $event = $iq.Event(event, 'dragend');
		    extendedData.$element.trigger($event, extendedData);
		    return false;
		};

    $iq.event("dragstart", {
        dataName: "drag",
        options: {
            cancel: ':input'
        },
        setup: setupDrag,
        teardown: teardownDrag
    });

    $iq.event("drag", {
        dataName: "drag",
        options: {
            dragEnabled: true
        },
        setup: setupDrag,
        teardown: teardownDrag
    });

    $iq.event("dragend", {
        dataName: "drag",
        options: {
    },
    setup: setupDrag,
    teardown: teardownDrag
});

})(jQuery);// Full credits goes to original resize plugin - http://benalman.com/projects/jquery-resize-plugin/
(function ($) {
	var timerId,
		timerInterval = 50,		
		propsToCheck = ['width','height'],
		$boundElems = $([]),		
		checkChanges = function(){					
			for(var elemsCount = $boundElems.length; elemsCount--;){
			
				var $elem = $($boundElems[elemsCount]),
					cssProps = $elem.data('iq.resize').properties,
					changedProps = {},
					fireEvent = false,
					propsCount=2;
				
				while(propsCount--){
					var prop = propsToCheck[propsCount],						
						tempCssProp = $elem.css(prop);
                    if (tempCssProp != cssProps[prop]) {
						changedProps[prop] = { oldValue: cssProps[prop], newValue: tempCssProp };
                        cssProps[prop] = tempCssProp;
                        fireEvent = true;
                    }					
				}
				
				if(fireEvent){
					$elem.trigger("resize", changedProps);				
				}
			}
			timerId = setTimeout(checkChanges, timerInterval)
		};
	
	$.iq.event("resize",{		
		setup : function(eventData, namespaces, eventHandle, extendedData){					
			
			if(this["setTimeout"] ) { 
				return false; 
			}
			
			var $this = $(this);						
			$boundElems = $boundElems.add($this);				
			extendedData.properties = {
				width : $this.css('width'),
				height : $this.css('height')
			}				
			if($boundElems.length == 1){
				checkChanges();
			}
		},
		teardown : function(handleObj){
			var $this = $(this);						
			$boundElems.not($this.removeData("iq.resize"));						
			
			if(!$boundElems.length){
				clearTimeout(timerId);
			}
		}
	});
})(jQuery); // Based on resize plugin - http://benalman.com/projects/jquery-resize-plugin/
// Full credits goes to its original author
(function ($) {
	var timerId,
		timerInterval = 50,	
		boundElems = [],		
		getPropertyValue = function (domElem, $elem, prop) {
			return $.isFunction($elem[prop]) ? $elem[prop].call($elem) :
						domElem[prop] ? domElem[prop] : $elem.css(prop);
        },
		checkChanges = function(){					
			for(var elemsCount = boundElems.length; elemsCount--;){
			
				var currentBinding = boundElems[elemsCount],
					domElem = currentBinding[0],
					$elem = $(domElem),
					cssProps = $elem.data('iq.propchange').properties,
					changedProps = {},
					fireEvent = false,
					propsToCheck = currentBinding[1],
					propsCount= propsToCheck.length;
					
				while(propsCount--){
					var prop = propsToCheck[propsCount],						
						tempCssProp = getPropertyValue(domElem, $elem, prop);
                    if (tempCssProp != cssProps[prop]) {
						changedProps[prop] = { oldValue: cssProps[prop], newValue: tempCssProp };
                        cssProps[prop] = tempCssProp;
                        fireEvent = true;
                    }					
				}
				
				if(fireEvent){
					$elem.trigger("propchange", changedProps);				
				}
			}
			timerId = setTimeout(checkChanges, timerInterval)
		};
	
	$.iq.event("propchange",{		
		setup : function(eventData, namespaces, eventHandle, extendedData){			
			var domElem = this,
				$this = $(domElem),
				properties = extendedData.properties = {};						
			
			// Initialize properties for the element
			boundElems.push([domElem, eventData]);
			for(var i=eventData.length; i--;){
                properties[eventData[i]] = getPropertyValue(domElem, $this, eventData[i]);
            }			
			
			if(boundElems.length == 1){
				checkChanges();
			}
		},
		teardown : function(handleObj){			
			for(var i=boundElems.length; i--;){
				if(this === boundElems[i][0]){				
					boundElems.splice(i,1);
					break;
				}
			}
			if(!boundElems.length)
				clearTimeout(timerId);
		}
	});
})(jQuery); // Based on http://brandonaaron.net/code/mousewheel/demos
// Full credits goes to its original author.
(function ($) {	
	var types = ['DOMMouseScroll', 'mousewheel'];	
	
	function handler(event) {
		var args = [].slice.call( arguments, 1 ), 
			delta = 0, 
			tmp;
		
		event = $.event.fix(event || window.event);
		event.type = "mousewheel";
		
		if ( tmp = event.wheelDelta ) {
			delta = tmp/120;
		}
		
		if ( tmp = event.detail){
			delta = -tmp/3;
		}
		
		// Add event and delta to the front of the arguments
		args.unshift(event, delta);

		return $.event.handle.apply(this, args);
	}

	$.iq.event("mousewheel",{		
		setup: function() {
			if (this.addEventListener ){
				for (var i=types.length; i;)
					this.addEventListener( types[--i], handler, false );
			}
			else{
				this.onmousewheel = handler;
			}
		},
		teardown: function() {
			if (this.removeEventListener){
				for ( var i=types.length; i; ){
					this.removeEventListener( types[--i], handler, false );
				}
			}
			else{
				this.onmousewheel = null;
			}
		}
	});
})(jQuery); (function ($) {

    function trigger($elem, eventType, event, relatedTarget) {
        var originalType = event.type,
			originalEvent = event.originalEvent,
			originalTarget = event.target,
			originalRelatedTarget = event.relatedTarget;

        event.target = $elem[0];
        event.type = eventType;
        event.originalEvent = null;

        if (relatedTarget)
            event.relatedTarget = relatedTarget;

        $elem.trigger(event);

        event.type = originalType;
        event.originalEvent = originalEvent;
        event.target = originalTarget;
        event.relatedTarget = originalRelatedTarget;
    }

    $.iq.plugin("forwardMouseEvents", {
        options: {
            enableMousemove: false,
            dblClickThreshold: 500
        },
        //_suspended: false,        
        _init: function () {
            var instance = this,
                options = instance.options,
				$this = instance.element,
                xy, lastT,
				clickX, clickY,
                clicks = 0,
                lastClick = 0;

            $this.bind('mouseout', function (e) {
                if (lastT) {
                    trigger(lastT, 'mouseout', e, $this[0]);
                    //lastT = null;
                }
            }).bind('mousemove mousedown mouseup mousewheel', function (e) {

                //if (!instance._suspended)
                if (options.enabled && $this.is(':visible')) {

                    //instance._suspended = true;

                    var be = e.originalEvent,
                        et = be.type,
                        mx = be.clientX,
                        my = be.clientY,
                        t;

                    e.stopPropagation();
                    $this.hide();
                    t = $(document.elementFromPoint(mx, my));                    
                    $this.show();
					console.log(lastT);
					
                    if (!t) {
                        trigger(lastT, 'mouseout', e);
                        lastT = t;						
                        //instance._suspended = false;
                        return;
                    }

                    if (options.enableMousemove || et !== 'mousemove') {
                        trigger(t, et, e);
                    }
					
                    if (lastT && (t[0] === lastT[0])) {	
						if (et == 'mouseup') {

                            // using document.elementFromPoint in mouseup doesn't trigger dblclick event on the overlay
                            // hence we have to manually check for dblclick
                            if (clickX != mx || clickY != my || (e.timeStamp - lastClick) > options.dblClickThreshold) {
                                clicks = 0;
                            }

                            clickX = mx;
                            clickY = my;
                            lastClick = e.timeStamp;
                            trigger(t, 'click', e);

                            if (++clicks == 2) {
                                trigger(t, 'dblclick', e);
                                clicks = 0;
                            }
                        }
                    } else {
						
						clicks = 0;
                        if (lastT) {		
							trigger(lastT, 'mouseout', e, t[0]);
                        }
						trigger(t, 'mouseover', e, lastT ? lastT[0] : $this[0]);
                    }
					lastT = t;
                    //instance._suspended = false;
                }
            });
        }
    });

})(jQuery);
(function ($, undefined) {
    var $iq = $.iq,
		classes;

    $iq.plugin("movable", {
        options: {
            handle: null,            
            container: '',
            moved: $iq.ret1,
            axis: 'xy',
            /*offset : {
                x1 : 0,
                y1 : 0
                x2 : 0,
                y2 : 0                
            },*/
            zoneWrap: true,
            start: $iq.ret1,
            end: $iq.ret1,

            movestart: $.noop,
            moveend : $.noop,
            moving : $.noop
        },

        _triggerOptions: {           
            prependEventPrefix: false
        },

        _init: function () {
			
            var instance = this,
				options = instance.options,
				$this = instance.element,
				$container = options.container ? $(options.container) : $this.parent();

            $this.dragstart({
                handle: options.handle,
                container: $container,
                cancel: options.cancel,
                zoneWrap: options.zoneWrap,
                offset: options.offset
            }, function(event, extendedData){				
                instance._trigger("movestart", event, extendedData);
            }).drag(function (event, extendedData) {
                var relativeData = extendedData.relative,
					startData = extendedData.start,
					bounds = extendedData.bounds,
                    newX,
                    newY;
                if (bounds) {
                    if (options.axis.indexOf('x') >= 0) {
                        newX = relativeData.x + startData.left;
                        newX = bounds.x1 < newX ? bounds.x2 > newX ? newX : bounds.x2 : bounds.x1;
                        $this.css('left', newX);
                    }
                    if (options.axis.indexOf('y') >= 0) {
                        newY = relativeData.y + startData.top;
                        newY = bounds.y1 < newY ? bounds.y2 > newY ? newY : bounds.y2 : bounds.y1;
                        $this.css('top', newY);
                    }
                    if (newX !== undefined || newY !== undefined) {
                        extendedData.current.left = newX;
                        extendedData.current.top = newY;
                        instance._trigger("moving", event, extendedData)
                    }
                }
                return false;
            }).dragend(function(event, extendedData){
                instance._trigger("moveend", event, extendedData)
            });
        }
    });

    classes = $.iq.movable.classes = {

	}

})(jQuery);(function ($) {
    var $iq = $.iq,
		classes = $.iq.movable.classes;

    $iq.plugin("movable", $iq.movable, {
        options: {
            filter: "",
            autoRefresh: true
        },
        movables: $([]),

        refresh: function () {
            var instance = this,
				$this = instance.element;
            filter = instance.options.filter
            instance.movables = $.isFunction(filter) ? filter.call($this[0]) : $this.find(filter);
        },
        _init: function () {
			
            var instance = this,
				$this = instance.element,
				options = instance.options,
				filter = options.filter,
				$movables,
				allowDrag;
            if (filter) {

                $this.dragstart(function (event, extendedData) {

                    allowDrag = false;

                    if (options.autoRefresh) {
                        instance.refresh();
                    }

                    if (instance.movables.filter(extendedData.target).length) {

                        allowDrag = true;

                        var $containerOffset = $this.offset();

                        $movables = instance.movables.each(function () {
                            var $elem = $(this),
							    $elemOffset = $elem.offset(),
							    minLeft = $containerOffset.left - $elemOffset.left +
								    (parseInt($elem.css('left') == 'auto' && $elem.css('position') == 'absolute' ? $elem[0].offsetLeft : $elem.css('left')) || 0) +
								    (parseInt($this.css("border-left-width")) || 0) + (parseInt($elem.css("marginLeft")) || 0)
								    - (parseInt($elem.css('margin-left')) || 0);
                            minTop = $containerOffset.top - $elemOffset.top +
									    (parseInt($elem.css('top') == 'auto' && $elem.css('position') == 'absolute' ? $elem[0].offsetTop : $elem.css('top')) || 0) +
									    (parseInt($this.css("border-top-width")) || 0) + (parseInt($elem.css("marginTop")) || 0)
									    - (parseInt($elem.css('margin-top')) || 0);

                            $elem.data("iq.movable.multi", {
                                start: {
                                    left: parseInt($elem.css("left")),
                                    top: parseInt($elem.css("top"))
                                },
                                bounds: {
                                    x1: minLeft,
                                    y1: minTop,
                                    x2: minLeft + $this.innerWidth() - (options.zoneWrap ? $elem.outerWidth() : 0),
                                    y2: minTop + $this.innerHeight() - (options.zoneWrap ? $elem.outerHeight() : 0)
                                }
                            });
                        });
                    }

                }).drag(function (event, extendedData) {

                    if (allowDrag && $movables && $movables.length) {
                        $movables.each(function () {
                            var $elem = $(this)
                            relativeData = extendedData.relative,
								startData = $elem.data("iq.movable.multi").start,
								bounds = $elem.data("iq.movable.multi").bounds;

                            if (options.axis.indexOf('x') >= 0) {
                                var newX = relativeData.x + startData.left;
                                newX = bounds.x1 < newX ? bounds.x2 > newX ? newX : bounds.x2 : bounds.x1;
                                $elem.css('left', newX);
                            }
                            if (options.axis.indexOf('y') >= 0) {
                                var newY = relativeData.y + startData.top;
                                newY = bounds.y1 < newY ? bounds.y2 > newY ? newY : bounds.y2 : bounds.y1;
                                $elem.css('top', newY);
                            }
                        });
                    }
                });
            }
            else {
                instance._base("_init");
            }
        }
    });
})(jQuery);(function ($, undefined) {
    var $iq = $.iq,
		classes = $.iq.movable.classes;

    classes.elementClone = 'iq-movable-clone';
    classes.placeholder = 'iq-movable-placeholder';

    $iq.plugin("movable", $iq.movable, {
        options: {
            domMove: {
                enabled: false, // If not enabled, normal move happens
                cloned: false,  // If cloned, a new object will be created, and that will be moved. Actual element will exist in the same place
                moveAfterDrop: false, // If true, existing element will persist, a clone will be created, and after drop, the element will be moved. Not applicable when cloned is true. 
                usePlaceHolder: true, // If true, an invisible element will be placed at the point where the element will be inserted. The dimensions will be set similar to moving element
                getClone: null, // Applicable only if cloned is true. This method can be used if you want some functionality like toolbox, where you will drag the control name, but when dropping you will have to insert someother element.
                getPlaceHolder: null, // Applicable even if useplaceholder is false. The element will be inserted at the place where the element will be inserted. But dimensions will not be set.

                helperParent: "parent",
				
				/* Events */
				//canInsert : null,
				
                mode: 'xy',  // xy - top / left / bottom / right
                // y - top or bottom alone
                // x - left or right alone    

                after: null,
                before: null,
                firstOf: null,
                lastOf: null,
                childOf: "parent",
				inside: null, 				

                notAfter: null,
                notBefore: null,
                notFirstOf: null,
                notLastOf: null,
                notChildOf: null,
				notInside: null
            }
        },
        _clone: null,
        _dragging: false,
        _init: function () {
			
            var instance = this,
				$this = instance.element,
				options = instance.options,
                domMoveOptions = options.domMove,
				canInsert = domMoveOptions.canInsert,
                $movingElements, $movingElement, $placeHolder, $parent,
                modeX, modeY, modeXY, movingElementOffsets,
                $movables,
                dragEnabled,
				wasValidInsert,
				stopMove = function(event){
					$("body").unbind("keydown.movable");
					
					$movingElements.css("position", "");
										
					if(event && wasValidInsert){
						$movingElements.insertBefore($placeHolder);
					}
					else {
						$movingElements.remove();
					}
					
					$placeHolder.remove();

					if(event){
						instance._trigger("moveEnd", event);
					}
				};
				

            if (domMoveOptions && domMoveOptions.enabled) {				
				
                $this.dragstart(function (event, data) {
					
                    dragEnabled = false;
					wasValidInsert = false;
                    if (domMoveOptions.enabled) {

                        $movables = options.getMovingElements ? options.getMovingElements(event, { target : data.target}) :
										options.filter ? $this.find(options.filter) : $this;
						
                        if ($movables.filter(data.target).length) {

                            dragEnabled = true;

                            modeX = domMoveOptions.mode.indexOf('x') >= 0;
                            modeY = domMoveOptions.mode.indexOf('y') >= 0;
                            modeXY = modeX && modeY;


                            var getClone = domMoveOptions.cloned && $.isFunction(domMoveOptions.getClone),
                                $draggedElement = $(data.target),
                                $movable, $clone, i = 0;

                            movingElementOffsets = [];
                            $movingElements = $([]);

							instance._trigger("moveInit", event, { target : data.target} );

                            // this is the element that will be moved
                            $movables.each(function () {
                                $movable = $(this);
                                $clone = (getClone ? domMoveOptions.getClone.call(this) : $movable.clone())
                                    .appendTo(domMoveOptions.helperParent == "parent" ? $movable.parent() : $(domMoveOptions.helperParent))
                                    .css({
                                        position: "absolute",
                                        left: $movable.position().left,
                                        top: $movable.position().top
                                    });
                                $movingElements = $movingElements.add($clone);
                                movingElementOffsets[i++] = $movable.position();
                                if (this === data.target) {
                                    $movingElement = $clone;
                                }
                            });


                            // Get the place holder that will be used 
                            $placeHolder = ((domMoveOptions.usePlaceHolder && $.isFunction(domMoveOptions.getPlaceHolder)) ? domMoveOptions.getPlaceHolder.call($this[0]) :
                                                $draggedElement.clone().css('visibility', 'hidden')).addClass(classes.placeholder); //.insertBefore($draggedElement);

                            // Possible Parents
                            if (domMoveOptions.childOf) {
                                $parent = domMoveOptions.childOf == "parent" ? $movables.parent() : $(domMoveOptions.childOf);
                            }

                            // hide the element only if move after drop is false and if not a cloned move
                            if (!domMoveOptions.cloned && !domMoveOptions.moveAfterDrop) {
                                $movables.detach();
                            }
							
							
							
							$("body").bind("keydown.movable", function(event){
								if(event.which == $iq.keys.escape){
									dragEnabled = false;
									stopMove();									
								}							
							});

                            instance._trigger("moveStart", event, { movingElement: $movingElement });
                        }
                    }
					
					

                }).drag(function (event, data) {

                    if (dragEnabled && $movables && $movables.length) {
                        $movingElements.hide();
                        var elementUnderMouse = document.elementFromPoint(event.clientX, event.clientY),
							$elementUnderMouse = $(elementUnderMouse),
							parents;
                        $movingElements.show();
						
						if($elementUnderMouse.is("body,html") || elementUnderMouse === document)
							return;
						
						$parents = $elementUnderMouse.parents();
                        $movingElements.each(function (index) {
                            $(this).css({
                                top: movingElementOffsets[index].top + data.relative.y,
                                left: movingElementOffsets[index].left + data.relative.x
                            });
                        });
						
						
						if ((canInsert && (canInsert(event, $movingElements, $elementUnderMouse, $parents) === false)) ||
							(elementUnderMouse === $placeHolder[0]) ||							 
							($parent && ($parents[0] !== $parent[0])) || // childOf
							(domMoveOptions.notInside && $parents.filter(domMoveOptions.notInside).length) // notInside
						){
                            return;
                        }
												
                        if (offset = $elementUnderMouse.offset()) {

                            var mouseX = event.clientX,
                                mouseY = event.clientY,
                                elementMidX = offset.left + $elementUnderMouse.outerWidth() / 2,
                                elementMidY = offset.top + $elementUnderMouse.outerHeight() / 2,
                                relativeX = mouseX - elementMidX,
						        relativeY = elementMidY - mouseY;
								
                            if (mouseY <= elementMidY && ((modeXY && (Math.abs(relativeX) < relativeY)) || (!modeXY && modeY))) {
                                // Top
								$placeHolder.insertBefore(elementUnderMouse);
								wasValidInsert = true;
								
                            }
                            else if (mouseX <= elementMidX && ((modeXY && (Math.abs(relativeY) < -relativeX)) || (!modeXY && modeX))) {
                                // Left
								$placeHolder.insertBefore(elementUnderMouse);
								wasValidInsert = true;
								//debugger;
                            }
                            else if (mouseX >= elementMidX && ((modeXY && (Math.abs(relativeY) < relativeX)) || (!modeXY && modeX))) {
                                // Right
                                $placeHolder.insertAfter(elementUnderMouse);
								wasValidInsert = true;
								//debugger;
                            }
                            else if (mouseY >= elementMidY && ((modeXY && (Math.abs(relativeX) < -relativeY)) || (!modeXY && modeY))) {
                                // Bottom
                                $placeHolder.insertAfter(elementUnderMouse);
								wasValidInsert = true;
								//debugger;
                            }
                        }
                    }

                }).dragend(function (event) {
                    if (dragEnabled) {
                        stopMove(event);
                    }
                });
            }
            else {
                instance._base("_init");
            }
        }
    });

})(jQuery);(function ($) {

    /* Light Weight Version - without dependencies*/

    //    var selectstart = 'selectstart', mousedown = 'mousedown',
    //    MozUserSelect = 'MozUserSelect', unselectable = 'unselectable',
    //    returnFalse = function () {
    //        return !1;
    //    };
    //    $.fn.noSelect = function (option) {
    //        return this.each(function () {
    //            var $this = $(this),
    //    allowSelect = option == undefined ? !0 : option;
    //            allowSelect && $this.bind(selectstart + " " + mousedown, returnFalse).css(MozUserSelect, 'none').attr(unselectable, 'on');
    //            !allowSelect && $this.unbind(selectstart + " " + mousedown).css(MozUserSelect, 'inherit').removeAttr(unselectable, 'on');
    //        });
    //    };

    /* Depends on Interface Query */
    $.iq.plugin("noSelect", {
        _init: function () {
            var instance = this,
                $this = instance.element;
            if (instance.options.enabled) {
                $this.bind("selectstart.noselect mousedown.noselect", $.iq.ret0).css('MozUserSelect', 'none').attr('unselectable', 'on');
            }
            else {
                $this.unbind("selectstart.noselect mousedown.noselect").css('MozUserSelect', 'inherit').removeAttr('unselectable', 'on');
            }
        },
        _optionChanged: function () {
            this._init();
        }
    });

    $.iq.noSelect._autoInstantiate = true;

})(jQuery);
(function ($, undefined) {
    var $iq = $.iq,
		classes;

    $iq.plugin("resizable", {
        _enableCorners: function (dir, dir1, dir2) {
            var directions = this.options;
            if (directions[dir] == undefined) {
                directions[dir] = directions[dir1] && directions[dir2];
            }
        },
        _directions: { TR: 'topRight', TL: 'topLeft', BR: 'bottomRight', BL: 'bottomLeft', T: 'top', R: 'right', B: 'bottom', L: 'left' },

        _init: function () {

            var instance = this,
				options = instance.options,
				directions = instance._directions,
				$this = instance.element;

            instance._enableCorners(directions.TR, directions.T, directions.R);
            instance._enableCorners(directions.TL, directions.T, directions.L);
            instance._enableCorners(directions.BR, directions.B, directions.R);
            instance._enableCorners(directions.BL, directions.B, directions.L);

            $.each(directions, function (key, resizeDir) {
                if (options[resizeDir]) {
                    $('<div class="' + classes[resizeDir] + '"/>').prependTo($this).mousedown(function (mousedownEvent) {
                        if (options.enabled) {
                            var handleElement = this,
								mouseX = mousedownEvent.clientX,
								mouseY = mousedownEvent.clientY,
								height = $this.height(),
								width = $this.width(),
								top = (resizeDir.toLowerCase().indexOf(directions.T) >= 0),
								right = (resizeDir.toLowerCase().indexOf(directions.R) >= 0),
								bottom = (resizeDir.toLowerCase().indexOf(directions.B) >= 0),
								left = (resizeDir.toLowerCase().indexOf(directions.L) >= 0),
								minX = options.minWidth,
								maxX = options.maxWidth,
								minY = options.minHeight,
								maxY = options.maxHeight;
                            instance._trigger("resizeStart", mousedownEvent);
                            $(document).bind("mousemove" + instance.eventSuffix, function (event) {
                                var y = event.clientY,
									x = event.clientX,
									value,
                                    data = {};
                                if (top || bottom) {
                                    value = (top ? (mouseY - y) : (y - mouseY)) + height;
                                    if (minY) {
                                        if (value < minY) {
                                            value = minY;
                                            data.minHeight = true;
                                        }
                                    }
                                    if (maxY) {
                                        if (value > maxY) {
                                            value = maxY;
                                            data.maxHeight = true;
                                        }
                                    }
                                    if (value != $this.height()) {
                                        $this.height(value);
                                        data.height = value;
                                    }
                                }
                                if (left || right) {
                                    value = (left ? (mouseX - x) : (x - mouseX)) + width;
                                    if (minX) {
                                        if (value < minX) {
                                            value = minX;
                                            data.minWidth = true;
                                        }
                                    }
                                    if (maxX) {
                                        if (value > maxX) {
                                            value = maxX;
                                            data.maxWidth = true;
                                        }
                                    }
                                    if (value != $this.width()) {
                                        $this.width(value);
                                        data.width = value;
                                    }
                                }

                                if (data.height !== undefined || data.width !== undefined) {
                                    data.handle = handleElement
                                    instance._trigger("resizing", event, data);
                                }
                            }).bind("mouseup" + instance.eventSuffix, function (event) {
                                $(document).unbind("mousemove" + instance.eventSuffix).unbind("mouseup" + instance.eventSuffix);
                                instance._trigger("resizeEnd", event);
                            });
                            return false;
                        }
                    });
                }
            });
        }
    });

    classes = $.iq.resizable.classes = {
        container: 'iq-resizable-container',

        top: 'iq-resizable-top',
        right: 'iq-resizable-right',
        bottom: 'iq-resizable-bottom',
        left: 'iq-resizable-left',

        topLeft: 'iq-resizable-top-left',
        topRight: 'iq-resizable-top-right',
        bottomLeft: 'iq-resizable-bottom-left',
        bottomRight: 'iq-resizable-bottom-right'
    }

})(jQuery);(function ($) {
    $.iq.plugin("restrictText", {
        
        _init: function () {
            var instance = this,
                $this = instance.element,
                options = instance.options,
				filter = options.filter || 'alphanumeric',
                regExp = typeof filter === "string" ? $.iq.regex[filter] : filter;
            
            $this.bind('keydown.restrictText paste.restrictText', function () {
				if(options.enabled){
					var caret = $this.caret(),
						position = $this.position(),
						val = $this.val(),                    
						$clonedElem = $this.clone().css({ position: 'absolute', left: position.left, top: position.top }).appendTo($this.parent()),
						tempVal;
					
					setTimeout(function () {
						tempVal = $this.val();
						if (regExp.test(tempVal) || tempVal == ""){
							$this.val(tempVal)
						}
						else{
							$this.val(val).caret(caret);
						}
						$clonedElem.remove();
					}, 0);
				}
            });
        }
    });
})(jQuery);
(function ($) {	
    var $iq = $.iq,
		classes;

    $iq.plugin("scrollable", {
        options: {
            autoReset: true
        },
		_applyCss : $.noop,		
        _validateScrollTop: function (scrollTop) {
			var maxScrollTop = parseInt(this.element[0].scrollHeight) - this.element.innerHeight();
			return scrollTop <0 ? 0 :(scrollTop > maxScrollTop )?maxScrollTop : scrollTop;
        },
        _validateScrollLeft: function (scrollLeft) {
			var maxScrollLeft = parseInt(this.element[0].scrollWidth) - this.element.innerWidth();
			return scrollLeft <0 ? 0 :(scrollLeft > maxScrollLeft )?maxScrollLeft : scrollLeft;
        },
        _resetScrollPosition: function (scrollTop, scrollLeft) {
        },
        scrollTop: function (relativeTop) {
			var instance = this,
				hasScroll = instance._hideAndGetHasScrollInfo(),
				$this = instance.element,			
				scrollTop = $this.scrollTop(),
				newScrollTop = instance._validateScrollTop(relativeTop+scrollTop);
			instance._showScrollBars(hasScroll.x, hasScroll.y);
			$this.scrollTop(newScrollTop);
			instance.reset();						
        },
        scrollLeft: function (relativeLeft) {
			var instance = this,
				hasScroll = instance._hideAndGetHasScrollInfo(),
				$this = instance.element,			
				scrollLeft = $this.scrollLeft(),
				newScrollLeft = instance._validateScrollLeft(relativeLeft+scrollLeft);
			instance._showScrollBars(hasScroll.x, hasScroll.y);
			$this.scrollLeft(newScrollLeft);
			instance.reset();			
        },
		_resetPositionY : function(){			
			
		},
		_showScrollBars : function(toggleX, toggleY){
			if(toggleY === undefined)
				toggleY = toggleX;
			this._xScrollBar.toggle(toggleX);
			this._yScrollBar.toggle(toggleY);
		},
		_hasScrollX : function(){
			return parseInt(this.element[0].scrollWidth) > (this.element.is("body") ? $("html")[0].clientWidth : this.element.outerWidth());
		},
		_hasScrollY : function(){
			return parseInt(this.element[0].scrollHeight) > (this.element.is("body") ? $("html")[0].clientHeight : this.element.outerHeight());
		},
		_hideAndGetHasScrollInfo : function(){
			this._showScrollBars(false);
			var retVal = {x : this._hasScrollX(), y : this._hasScrollY()};
			return retVal;
		},
		
		_resetting : false,
        reset: function () {
			var instance = this;
			if(!instance._resetting){
				instance._resetting = true;
				instance._showScrollBars(false);
				
				var $this = instance.element,
					hasScroll = instance._hideAndGetHasScrollInfo(true),
					scrollWidth = $this[0].scrollWidth,
					scrollHeight = $this[0].scrollHeight;
									
				instance._showScrollBars(hasScroll.x, hasScroll.y);
				
				if(hasScroll.x){
				
					instance._xWrapper.css('width', Math.floor($this.innerWidth() - instance._xLeft.outerWidth() - instance._xRight.outerWidth() - instance._xyScrollBar.outerWidth()));
					
					var containerWidth = instance._xWrapper.innerWidth();
					instance._xScrollBar.width($this.innerWidth()).position({
						my : "0px 100%",
						at : "0px 100%",
						of : $this,
						offset : {
							left : parseInt($this.css("border-left-width")),
							top : -parseInt($this.css("border-top-width"))
						}
					});					
					
					instance._xHandle.css("width", Math.floor(containerWidth * $this.outerWidth() / (scrollWidth)))
									 .css("left", Math.floor($this.scrollLeft() * (containerWidth - instance._xHandle.outerWidth()) / (scrollWidth - $this.outerWidth())));					
				}
				
				if(hasScroll.y){
					instance._yWrapper.css('height', Math.floor($this.innerHeight() - instance._yTop.outerHeight() - instance._yBottom.outerHeight() - instance._yxScrollBar.outerHeight()));					
					var containerHeight = instance._yWrapper.height();
					instance._yScrollBar.position({
						my : "100% 0px",
						at : "100% 0px",
						of : $this,
						offset : {
							top : parseInt($this.css("border-top-width")),
							left : -parseInt($this.css("border-left-width"))
						}
					});					
					instance._yHandle.css("height", Math.floor(containerHeight * $this.outerHeight() / (scrollHeight)))
									 .css("top", Math.floor($this.scrollTop() * (containerHeight - instance._yHandle.outerHeight()) / (scrollHeight - $this.outerHeight())));
					
				}
				instance._resetting = false;
			}
        },
		
        _init: function () {
			
            var instance = this,
				$this = instance.element,
				temp;
			
            instance._overflow = { x: $this.css("overflow-x"), y: $this.css("overflow-y") };			
            $this.addClass(classes.container);
			
            if ($this.is("body"))
                $("html").addClass(classes.containerBody);

            var $scrollBarX = instance._xScrollBar = $('<div class="' + classes.xScrollBar + '"><div class="' + classes.arrowLeft + '"/><div class="' + classes.xHandleContainer + '"><div class="' + classes.xHandle + '"/></div><div class="' + classes.arrowRight + '"/><div class="' + classes.xyScrollbar + '"/></div>').appendTo($this),
				$scrollBarY = instance._yScrollBar = $('<div class="' + classes.yScrollBar + '"><div class="' + classes.arrowTop + '"/><div class="' + classes.yHandleContainer + '"><div class="' + classes.yHandle + '"/></div><div class="' + classes.arrowBottom + '"/><div class="' + classes.xyScrollbar + '"/></div>').appendTo($this);

			instance._xyScrollBar = $scrollBarX.find("." + classes.xyScrollbar);
            instance._yxScrollBar = $scrollBarY.find("." + classes.xyScrollbar);

            instance._xHandle = $scrollBarX.find("." + classes.xHandle).movable({
                axis: 'x',
                moving: function (event, data) {                    
					
					var hasScroll = instance._hideAndGetHasScrollInfo(true),
						scrollWidth = $this[0].scrollWidth,
						leftValue = Math.floor(data.current.left * (scrollWidth - $this.innerWidth()) / (instance._xWrapper.outerWidth() - instance._xHandle.outerWidth())),
						paddingLeft = parseInt($this.css("padding-left"));					
					
					instance._showScrollBars(hasScroll.x, hasScroll.y);					
					
					// Fix for jump in IE when using different Doctype - Put the scrollLeft line after setting CSS
					$this.scrollLeft(leftValue);
					$scrollBarX.css("left", leftValue - paddingLeft);
                    $scrollBarY.css("left", leftValue + $this.innerWidth() - instance._yScrollBar.innerWidth() - paddingLeft);                    
					
                }
            });

            instance._yHandle = $scrollBarY.find("." + classes.yHandle).movable({
                axis: 'y',
				movestart : function(){
					temp = $this.scrollTop();
				},
                moving: function (event, data) {
					var hasScroll = instance._hideAndGetHasScrollInfo(true),
						scrollHeight = $this[0].scrollHeight,						
						topValue = Math.ceil(data.current.top * (scrollHeight - $this.innerHeight()) / (instance._yWrapper.innerHeight() - instance._yHandle.outerHeight())),
						scrollTop = $this.scrollTop();
						
                    instance._showScrollBars(hasScroll.x, hasScroll.y);
				
					// Fix for jump in IE when using different Doctype - Put the scrollLeft line after setting CSS
					$this.scrollTop(topValue);
					$scrollBarX.css("top", parseInt($scrollBarX.css("top")) + (topValue - scrollTop));					
                    $scrollBarY.css("top", parseInt($scrollBarY.css("top")) + (topValue - scrollTop));
                }
            });

            instance._yTop = $scrollBarY.find("." + classes.arrowTop).mousedown(function () {
                instance.scrollTop(-30);
                return false;
            });

            instance._yBottom = $scrollBarY.find("." + classes.arrowBottom).mousedown(function () {
                instance.scrollTop(30);
                return false;
            });

            instance._xLeft = $scrollBarX.find("." + classes.arrowLeft).mousedown(function () {
                instance.scrollLeft(-30);
                return false;
            });

            instance._xRight = $scrollBarX.find("." + classes.arrowRight).mousedown(function () {
                instance.scrollLeft(30);
                return false;
            });

            instance._yWrapper = $scrollBarY.find("." + classes.yHandleContainer).click(function (e) {
                var positionY = e.pageY,
					scrollerHandlePosition = instance._yHandle.offset().top,
					elemHeight = $this.innerHeight();
                if (positionY > (scrollerHandlePosition + instance._yHandle.height())) {
                    instance.scrollTop(elemHeight - 50);
                    return false;
                }
                if (positionY < scrollerHandlePosition) {
                    instance.scrollTop(-elemHeight + 50);
                    return false;
                }
            });

            instance._xWrapper = $scrollBarX.find("." + classes.xHandleContainer).click(function (e) {
                var positionX = e.pageX,
					scrollerHandlePosition = instance._xHandle.offset().left,
					elemWidth = $this.innerWidth();
                if (positionX > (scrollerHandlePosition + instance._xHandle.innerWidth())) {
                    instance.scrollLeft(elemWidth - 50);
                    return false;
                }
                if (positionX < scrollerHandlePosition) {
                    instance.scrollLeft(-elemWidth + 50);
                    return false;
                }
            });

            $this.mousewheel(function (e, delta) {				
                instance.scrollTop(-delta * 30);
				// TODO : handle return value based on max scroll
                return false;
            });

            if (instance.options.autoReset) {
                $this.bind("propchange", ["scrollHeight", "scrollWidth", "offsetHeight"], function () {
                    instance.reset();
                });
            }

            instance.reset();

        }
    });

    classes = $.iq.scrollable.classes = {
        container: 'iq-scrollable',
        containerBody: 'iq-scrollable-body',

        xScrollBar: 'iq-scrollable-x',
        arrowLeft: 'iq-scrollable-x-arrow-left',
        arrowRight: 'iq-scrollable-x-arrow-right',
        xHandle: 'iq-scrollable-x-handle',
        xHandleContainer: 'iq-scrollable-x-handle-container',

        yScrollBar: 'iq-scrollable-y',
        arrowTop: 'iq-scrollable-y-arrow-top',
        arrowBottom: 'iq-scrollable-y-arrow-bottom',
        yHandle: 'iq-scrollable-y-handle',
        yHandleContainer: 'iq-scrollable-y-handle-container',

        xyScrollbar: 'iq-scrollable-xy'
    }

})(jQuery);
(function ($) {
    var $iq = $.iq,
        classes;

    $iq.plugin("accordion", {
        options: {
            mode: 'single', // single, multiple
            defaultState: 'Expanded',
            animate: false,
            duration: 100,
            easing: 'linear',
            arrowWithoutContent: false
        },
        selectedItem: null,
        _toggleItem: function (index, slideDir, addClass, removeClass) {
			
            var instance = this,
				options = instance.options,
				endToggle = function () {
				    $content.addClass(classes["content" + addClass]).removeClass(classes["content" + removeClass]);
				    index.addClass(classes["header" + addClass]);
				},
				$content,
				$arrow,
				$selectedItem = instance.selectedItem;

            if (typeof index === "number") {
                index = $this.find(">h3:eq(" + index + ")");
            }

            if (options.mode != "single" || !$selectedItem || $selectedItem[0] != index[0]) {

                if (slideDir == "slideToggle") {
                    if (index.hasClass(classes.headerExpanded)) {
                        addClass = "Collapsed";
                        removeClass = "Expanded";
                    }
                    else {
                        addClass = "Expanded";
                        removeClass = "Collapsed";
                    }
                }

                $content = index.next().filter("div");

                if ($selectedItem) {
                    $selectedItem.removeClass(classes.headerSelected);

                    if (options.mode == "single" && $content.length) {
                        instance.selectedItem = null;
                        instance.collapseItem($selectedItem);
                    }
                }



                if (slideDir != "slideUp") {
                    instance.selectedItem = index.addClass(classes.headerSelected);
                    $content.addClass(classes.contentSelected);
                }

                if ($content.length || options.arrowWithoutContent) {
                    index.removeClass(classes["header" + removeClass]);
                    $arrow = index.find("."+classes.arrow).removeClass(classes["arrow" + removeClass]).addClass(classes["arrow" + addClass]);

                    if (options.animate && $content.length) {
                        $content[slideDir](options.duration, options.easing, endToggle);
                    }
                    else {
                        endToggle();
                    }
                }

            }
        },
        expandItem: function (index) {
            this._toggleItem(index, "slideDown", "Expanded", "Collapsed");
        },

        toggleItem: function (index) {
            this._toggleItem(index, "slideToggle");
        },

        collapseItem: function (index) {
            this._toggleItem(index, "slideUp", "Collapsed", "Expanded");
        },
        _setupItem: function ($h3) {
            var instance = this,
                options = instance.options,
                defaultState = "Collapsed",
				$content;

            if (options.mode != "single" || !instance._singleItemSelected) {
                if ((options.defaultState == 'Collapsed' && $h3.hasClass(classes.headerExpanded)) ||
					(options.defaultState != 'Collapsed' && !$h3.hasClass(classes.headerCollapsed))) {
                    defaultState = "Expanded";

                    instance.selectedItem = $h3;
                    $content = $h3.removeClass(classes.headerCollapsed).removeClass(classes.headerExpanded).next().filter("div");
                    if ($content.length || options.arrowWithoutContent) {
                        instance._singleItemSelected = true;
                        $content.removeClass(classes.contentCollapsed).removeClass(classes.contentExpanded);
                    }

                }
            }

            $h3.addClass(classes.header).hoverClass(classes.headerHover).find(">a").addClass(classes.headerAnchor);
            $content = $h3.next().filter("div");

            if ($content.length || options.arrowWithoutContent) {
                $content.addClass(classes.content).addClass(classes["content" + defaultState])
                $h3.hoverClass(classes.arrowHover).find(">a").prepend($("<span class='" + classes.arrow + " " + classes["arrow" + defaultState] + "'><span/></span>"));
            }
            $h3.addClass($content.length ? classes["header" + defaultState] : classes.headerCollapsed)

        },
        _init: function () {
			
            var instance = this,
                $this = instance.element.addClass(classes.container);

            $this.find(">h3").each(function () {				
                instance._setupItem($(this));
            });

            delete instance._singleItemSelected;

            instance._delegate("." + classes.headerAnchor, "click", function (event) {
                var $target = $(event.target),
					isArrow = !$target.is("."+classes.headerAnchor),
					$a = $(event.currentTarget),
					$item = $a.parent(),
					data = {
					    target: $item,
					    index: $item.prev("h3").length
					},
					isExpanded = $item.hasClass(classes.headerExpanded),
					expanding = isExpanded ? "Collapsing" : "Expanding",
					expanded = isExpanded ? "Collapsed" : "Expanded",
					hasLink = false;
				
				if(!isArrow){
					hasLink = !$iq.regex.noLink.test($a.attr('href'));
				}				
				if(!hasLink || isArrow){
					if (instance._trigger("item" + expanding, event, data)) {
						instance.toggleItem($item);
						instance._trigger("item" + expanded, event, data);
					}
				}					
				if(isArrow || !hasLink){
					return false;
				}				
            });

            return $this;
        }
    });

    classes = $.iq.accordion.classes = {
        container: "iq-accordion", 		// tabs container

        header: "iq-accordion-header",
        headerHover: "iq-accordion-header-hover",
        headerExpanded: "iq-accordion-header-expanded",
        headerCollapsed: "iq-accordion-header-collapsed",
        headerActive: "iq-accordion-header-active",
        headerAnchor: "iq-accordion-header-a",
        headerSelected: "iq-accordion-header-selected",

        arrow: "iq-accordion-header-arrow",
        arrowHover: "iq-accordion-header-arrow-hover",
        arrowCollapsed: "iq-accordion-header-arrow-collapsed",
        arrowExpanded: "iq-accordion-header-arrow-expanded",

        content: "iq-accordion-content",
        contentExpanded: "iq-accordion-content-expanded",
        contentCollapsed: "iq-accordion-content-collapsed",
        contentActive: "iq-accordion-content-active",
        contentSelected: "iq-accordion-content-selected"
    }

})(jQuery);(function ($, undefined) {
    var $iq = $.iq,
        classes,
        createMenuUl = function (nodes) {
            var $ul = $("<ul/>"), $li, $a, length = nodes.length - 1;

            $(nodes).each(function (index, value) {
                var node = this;
                if ($.isArray(node)) {
                    createMenuUl(node);
                }
                else {
                    $li = $("<li/>").append($("<a href='#'/>").append($("<span />").text(node.name)));
                    $a = $li.find("a");

                    node.option && $li.attr('option', node.option);
                    node.css && $li.addClass(node.css);
                    node.img && $a.prepend($("<img />").addClass(classes.image).attr('src', node.img));
                    node.href && $a.attr('href', node.href);
                    node.nodes && $li.append($("<div/>").append(createMenuUl(node.nodes)));

                    $li.appendTo($ul);
                }
            });
            return $ul;
        };

    $iq.plugin("menu", {
        options: {
            selectedIndex: 0,
            orientation: 'Horizontal',
            clicking: $.noop,
            clicked: $.noop,
            animate: true,
            duration: 'fast',
            closeDelay: 0,
            open: $.noop,
            close: $.noop,
            trigger: 'click',
            triggerToggleEvents: false,
            arrowAlways: false,
            enableIcons: false,
            enableGrouping: false
        },
        eventPrefix: 'menu',
        _itemOpened: null,


        _mouseEnter: function (event, target, forceToggle) {
            event.stopImmediatePropagation();
            var instance = this,
                $menu = $(event.currentTarget).addClass(classes.itemHover);
            $menu.prev().addClass(classes.itemHoverPrev);
            $menu.next().addClass(classes.itemHoverNext);
            $menu.find(">a").addClass(classes.itemAnchorHover);

            if (!$menu.hasClass(classes.itemOpened)) {
                if ($menu.hasClass(classes.itemClosing) || $menu.parents("." + classes.itemClosing).length) {
                    return false;
                }
                else if (forceToggle || instance.options.trigger == "hover") {
                    instance._toggle($menu, event, true);
                }
            }
        },
        _mouseLeave: function (event, target, forceToggle) {
            var instance = this,
                currentTarget = target || event.currentTarget,
                $menu;
            if (!$(event.relatedTarget).parents("." + classes.item).filter(currentTarget).length) {
                $menu = $(currentTarget);
                $menu.find(">a").removeClass(classes.itemAnchorHover);
                if (forceToggle || instance.options.trigger == "hover") {
                    instance._toggle($menu, event, false);
                }
                $menu.removeClass(classes.itemHover).prev().removeClass(classes.itemHoverPrev);
                $menu.next().removeClass(classes.itemHoverNext);

            }
        },
        _click: function (event) {
            var instance = this,
                domElem = event.currentTarget,
                $li = $(domElem),
				$a = $li.find(">a"),
				$target = $(event.target),
				isArrow = $target.is("." + classes.itemArrow) || $target.parent().is("." + classes.itemArrow),
				hasLink = false;

            $li.parent().parent().find("." + classes.itemOpened).not($li[0]).each(function () {
                instance._mouseLeave(event, this, true);
            });

            if (!isArrow) {
                hasLink = !$iq.regex.noLink.test($a.attr('href'));
            }
            if (!hasLink || isArrow) {
                if (instance._trigger("clicking", event, { target: domElem })) {
                    instance._toggle($li, event);
                    instance._trigger("clicked", event, { target: domElem });
                }
            }
            if (!isArrow) {
                event.stopImmediatePropagation();
            }
            if (!hasLink) {
                return false;
            }
        },
        _toggle: function ($menu, event, toggleOn) {

            toggleOn = toggleOn === undefined ? !$menu.hasClass(classes.itemOpened) : toggleOn;

            var instance = this,
                options = instance.options,
                preEvent = toggleOn ? "opening" : "closing",
                postEvent = toggleOn ? "opened" : "closed",
                animateProps = {},
                $menuDiv, height,
                $container, isParentMenu = false,
                complete = function () {
                    $menu.prev("." + classes.item).toggleClass(classes.itemOpenedPrev, toggleOn);
                    $menu.next("." + classes.item).toggleClass(classes.itemOpenedNext, toggleOn);
                    $menu.toggleClass(classes.itemOpened + " " + classes.itemSelected, toggleOn).find(">div")[toggleOn ? "show" : "hide"]();
                    $menu.find(">a").toggleClass(classes.itemAnchorOpened + " " + classes.itemAnchorSelected, toggleOn);
                    if (!toggleOn) {
                        $menu.removeClass(classes.itemClosing);
                    }

                    if (isParentMenu) {
                        $container.toggleClass(classes.containerActive, toggleOn);
                    }
                };

            if (!options.triggerToggleEvents || instance._trigger(preEvent, event, { target: $menu[0] })) {

                $menuDiv = $menu.toggleClass(classes.itemClosing, !toggleOn).find(">div");

                $container = $menu.parent().parent();
                isParentMenu = $container.hasClass(classes.container);

                if (options.animate && $menuDiv.length) {

                    if (toggleOn) {
                        complete();
                    }

                    if (options.orientation != "Vertical" && isParentMenu) {
                        // setting the width again is a fix for IE width behaviour during height animate
                        height = $menuDiv.show().css({
							"width" : $menuDiv.width(),
							"height" : ""
						}).height();
						
						if(toggleOn){
							$menuDiv.height(0);
							animateProps['height'] = height;
						}
						else {
							$menuDiv.height(height);
							animateProps['height'] = 0;
						}
                    } else {
                        animateProps['width'] = toggleOn ? 'show' : 'hide';
                    }


                    $menuDiv.stop(false, true).animate(animateProps, options.duration || 0, options.easing, complete);
                }
                else {
                    complete();
                    $menuDiv.toggle(toggleOn);
                }

                if (instance.options.triggerToggleEvents)
                    instance._trigger(postEvent, event, { target: $menu[0] });
            }
        },
        _clickOutside: function (event) {

            var instance = this;

            instance.element.find(">ul").find("." + classes.itemOpened).each(function () {
                instance._mouseLeave(event, this, true);
            });
        },
        _bindEvents: function () {
            var instance = this;

            instance._delegate("." + classes.item, {
                mouseenter: "_mouseEnter",
                mouseleave: "_mouseLeave"
            });

            if (instance.options.trigger == "click") {

                instance._delegate("." + classes.item, {
                    click: "_click"
                });

                instance.element.find(">ul").bind('clickoutside', function (event) {
                    instance._clickOutside(event);
                });
            }
        },

        _initItem: function ($li, noIcon) {
            var instance = this,
                $ul = $li.find(">div:not(" + classes.itemTemplate + ")").addClass(classes.itemsWrapper).hide().find(">ul"),
                $a = $li.find(">a").addClass(classes.itemAnchor),
				isSeparator = $a.length == 0,
                $span, addArrow = instance.options.arrowAlways, hasChild,
                enableIcons = instance.options.enableIcons;

            $li.addClass(classes.item + " " + (isSeparator ? classes.itemSeparator : ""));

            if (isSeparator) {
                $li.find(">span").addClass(classes.itemSeparatorSpan).append("<span/>").toggleClass(classes.itemSeparatorNoIcon, noIcon || !enableIcons);

            }
            else {
                if ($ul.length > 0) {
                    $a.addClass(classes.itemAnchorHasChild);
                    hasChild = addArrow = true;
                    instance._initItems($ul);
                }

                if (!noIcon && enableIcons) {
                    $a.addClass(classes.itemAnchorHasIcon);
                    $("<span class='" + classes.itemIcon + "'><span/></span>").prependTo($a);
                }

                if (addArrow) {
                    $span = $("<span class='" + classes.itemArrow + "'><span/></span>").prependTo($a);

                    if (hasChild) {
                        $span.addClass(classes.itemArrowHasChild)
                    }
                }
            }
        },

        _initItems: function ($ul) {
            var instance = this,
                noIcon = $ul.hasClass(classes.itemsNoIcon),
                $items = $ul.addClass(classes.items).find(">li").each(function () {
                    instance._initItem($(this), noIcon);
                });

            $items.eq(0).addClass(classes.itemFirst);
            $items.last().addClass(classes.itemLast);
        },


        _initMenu: function () {
            var instance = this,
                options = instance.options, $ul,
                $this = instance.element;

            if (options.data) {
                $iq.menu.create($this, options.data);
            }

            $ul = $this.find(">ul").toggleClass(classes.itemsHasGroups, options.enableGrouping);

            instance._initItems($ul);

            if (options.selectedIndex >= 0) {
                $ul.find(">li").eq(options.selectedIndex).addClass(classes.itemSelected);
            }

        },
        _init: function () {
            var instance = this,
                $this = instance.element.addClass(classes.container).addClass(classes[instance.options.orientation.toLowerCase() || "horizontal"]);

            instance._initMenu();
            instance._bindEvents();

        }
    });


    $iq.menu.create = function ($div, elementData) {
        var id = $div.attr("id");
        if ((elementData.id || elementData.randomId) && !id) {
            $div.attr("id", elementData.id ? elementData.id : (elementData.randomId ? "iq-menu-" + $iq.rand(10000) : ""));
        }
        return $div.append(createMenuUl(elementData));
    };

    classes = $.iq.menu.classes = {
        container: "iq-menu",
        containerActive: "iq-menu-active",

        horizontal: "iq-menu-horizontal",
        vertical: "iq-menu-vertical",

        items: "iq-menu-items",
        itemsNoIcon: "iq-menu-items-no-icon",
        itemsHasGroups: "iq-menu-items-has-groups",

        itemsWrapper: "iq-menu-items-wrapper",
        item: "iq-menu-item",
        itemArrow: "iq-menu-item-arrow",
        itemArrowHasChild: "iq-menu-item-arrow-has-child",

        itemIcon: "iq-menu-item-icon",


        itemFirst: "iq-menu-item-first",
        itemLast: "iq-menu-item-last",
        itemAnchor: "iq-menu-item-a",
        itemAnchorHover: "iq-menu-item-a-hover",
        itemAnchorOpened: "iq-menu-item-a-opened",
		itemAnchorSelected: "iq-menu-item-a-selected",
		
        itemSeparator: "iq-menu-item-seperator",
        itemSeparatorSpan: "iq-menu-item-seperator-span",
        itemSeparatorNoIcon: "iq-menu-item-seperator-no-icon",
        itemAnchorHasIcon: "iq-menu-item-a-has-icon",
        itemAnchorHasChild: "iq-menu-item-a-has-child",

        itemHover: "iq-menu-item-hover",
        itemHoverPrev: "iq-menu-item-hover-previous",
        itemHoverNext: "iq-menu-item-hover-next",

        itemOpened: "iq-menu-item-opened",
        itemOpenedPrev: "iq-menu-item-opened-previous",
        itemOpenedNext: "iq-menu-item-opened-next",
        itemTemplate: "iq-menu-item-template",

        itemClosing: "iq-menu-item-closing",
        itemOpening: "iq-menu-item-opening",

        itemSelected: "iq-menu-item-selected",
        itemSelectedPrevious: "iq-menu-item-selected-previous",
        itemSelectedNext: "iq-menu-item-selected-next"
    }

})(jQuery);(function ($) {
    var $iq = $.iq,
        classes;

    $iq.plugin("breadcrumb", $.iq.menu, {
        options: {
            arrowText: '',
            searchMode: 'title', // href - Matches node with the current location (if defaultHref is not given)
            // title - Matches node with the page title
            // path - Matches node with the xpath, separated by value in the searchSeparator (uses defaultPath initially)
            // name - Matches node with the name in the data (uses defaultName initally)
            searchSeparator: "/",
            defaultPath: "",
            defaultName: "",
            defaultHref: ""
        },
        /*_toggle: function ($subMenu, event) {
            var instance = this;
            if ($(event.target).hasClass(classes.itemArrow) || $subMenu.hasClass(classes.itemOpened) || $iq.regex.noLink.test($subMenu.find(">a").attr('href'))) {
                event.stopImmediatePropagation();
                instance._base("_toggle", $subMenu, event);
            }
        },*/
        _setData: function (searchVal) {
            var instance = this,
                options = instance.options,
                $this,
                paths = [];

            options.arrowAlways = true;
            instance.element.empty();
            instance._search(options.rawData, options.searchMode, searchVal, paths, 0);
            options.data = paths;

        },
        select: function (searchVal) {
            var instance = this;

            if (options.rawData) {
                instance._setData(searchVal);
                instance._base("_initMenu");
            }
        },
        _search: function (data, searchMode, searchVal, paths, pathIndex) {
            var instance = this,
                retVal,
                tempPath,
                addPathCss = function (searchMode, nodes, val) {
                    $.each(nodes, function (index, currentNode) {
                        if ((searchMode == "path" && currentNode.name == val) || currentNode.name == val.name) {
                            currentNode.css = (currentNode.css || "") + " " + classes.itemSelected;
                        }
                        delete currentNode.nodes;
                    });
                },
                searchAttribute = searchMode == "title" ? "name" : searchMode;
            $(data).each(function (index) {
                var node = this;
                if (searchMode == "path") {
                    if (node.name == searchVal[pathIndex]) {
                        tempPath = $.extend(true, {}, node);
                        paths.push(tempPath);
                        pathIndex++;
                        if (pathIndex < searchVal.length) {
                            if (tempPath.nodes) {
                                addPathCss(searchMode, tempPath.nodes, searchVal[pathIndex]);
                            }
                        }
                        else {
                            return false;
                        }
                    }
                }
                else if (node[searchAttribute] == searchVal) {
                    retVal = $.extend({}, node);
                    if (retVal.nodes) {
                        $.each(retVal.nodes, function (index, currentNode) {
                            delete currentNode.nodes;
                        });
                    }
                    paths.unshift(retVal);
                    return false;
                }

                if (node.nodes) {
                    if (retVal = instance._search(node.nodes, searchMode, searchVal, paths, pathIndex)) {
                        tempPath = $.extend(true, {}, node);
                        addPathCss(searchMode, tempPath.nodes, retVal);
                        paths.unshift(retVal = tempPath);
                        return false;
                    }
                }
            });

            return retVal;
        },
        _init: function () {
            var instance = this,
                options = instance.options,
                searchMode = options.searchMode;

            options.trigger = "click";
            options.orientation = "Horizontal";

            instance._setData(
                    searchMode == "href" ? options.defaultHref || window.location.href :
                    searchMode == "title" ? document.title || "" :
                    searchMode == "name" ? options.defaultName || "" :
                    searchMode == "path" ? options.defaultPath.split(options.searchSeparator) : ""
            );
            instance._base("_init");
            instance.element.addClass(classes.container).find(">ul>li>a>." + classes.itemArrow+" span").text(options.arrowText || '');
        }
    });

    classes = $.iq.breadcrumb.classes = $.extend({}, $.iq.breadcrumb.classes, {
        container: "iq-breadcrumb",
        breadcrumbPath: "iq-breadcrumb-path"
    });

})(jQuery);(function ($, undefined) {
    var $iq = $.iq,
		classes;

    $iq.plugin("contextMenu", $.iq.menu, {
        options: {
            //bindings : [
            //{ id : '', elements: doc, menuOpening : $iq.ret1, menuClicked: $iq.ret1 }
            //]	
            enableIcons: true,
            enableGrouping: true
        },
        _allBindings: [],
        _activeBinding: null,
        _activeElement: null,
        _getBinding: function (id) {
            var retBinding = null;
            if (id) {
                // Loop through each bindings and get the one requested
                $(this._allBindings).each(function () {
                    var binding = this;
                    if (binding.id === id) {
                        retBinding = binding;
                        return false;
                    }
                });
            }
            return retBinding;
        },
        _clickOutside: function () {
            this._base("_clickOutside", arguments);
            this.element.hide();
        },
        close: function () {
            instance.element.hide();
        },
        _open: function (options) {
            var instance = this,
				$this = instance.element,
				$ul = $this.find(">ul");

            $this.addClass(classes.opened).css({ left: options.left, top: options.top, visibility: 'hidden' }).show();
            //instance._setSubMenusWidth($ul);
            $this.css('visibility', 'visible');
        },
        open: function (options) {
            var instance = this,
				activeBinding = options.binding || instance._getBinding(options.id);
            element = options.element || (activeBinding ? activeBinding.elements : null);

            if (activeBinding && activeBinding.menuOpening === undefined || activeBinding.menuOpening.call(instance.element, element)) {
                instance._activeBinding = activeBinding;
                instance._activeElement = element;
                instance._open(options);
                activeBinding.menuOpened && activeBinding.menuOpened($this, element)
            }

            return instance.element;
        },
        addBindings: function (bindings) {

            if (bindings) {

                var instance = this;

                // Loop through each bindings
                $(bindings).each(function () {
                    var currentBinding = this;

                    instance._allBindings.push(currentBinding);

                    // Loop through each elements in the bindings
                    $(currentBinding.elements).each(function () {

                        // Attach context menu for the element
                        $(this).bind('contextmenu', function (e) {

                            var parentOffset = $(this).offsetParent().position();

                            // Open the context menu for the current binded element
                            instance.open({
                                left: -parentOffset.left + e.pageX + 5,
                                top: -parentOffset.top + e.pageY + 3,
                                binding: currentBinding,
                                element: $(this)
                            });

                            // Disable browser default
                            return false;
                        });
                    });
                });
            }
        },
        _init: function () {

            var instance = this,
                options = instance.options,
                searchMode = options.searchMode;

            options.trigger = "click";
            options.orientation = "Vertical";

            instance._base("_init");
            instance.element.addClass(classes.container).find(">ul>li>a>." + classes.itemArrow + " span").text(options.arrowText || '');



            if (options.bindings) {
                instance.addBindings(options.bindings);
            }

        }
    });

    classes = $.iq.contextMenu.classes = $.extend({}, $.iq.contextMenu.classes, {
        container: "iq-context"
    });

})(jQuery);(function ($) {
    var $iq = $.iq,
        classes = $.iq.contextMenu.classes,
        keys = $iq.keys;

    $.extend(classes, {
		hiddenLink : 'iq-context-hiddenlink',
		hidden : 'iq-hidden'
    });

    $iq.plugin("contextMenu",$iq.contextMenu, {
        options: {
            
        },
		
		_getParentNode : function($li){
			var $parentNode = $li.parent();
            if ($parentNode.hasClass(classes.menus)) {
                $parentNode = $parentNode.parent();
                if ($parentNode.hasClass(classes.menu)) 
					return $parentNode;
			}
			return null;
		},        
        getNextMenu: function ($li) {
			var $lastLi = $li.next("li:visible:eq(0)");
            return $lastLi.length > 0 ? $lastLi : $li;		
        },
        getPrevMenu: function ($li) {
            var $nextLi = $li.prev("li:visible:eq(0)");
            return $nextLi.length > 0 ? $nextLi : $li;		
        },
		_focusItem : function($li){
			this.focusedItem = $li.attr("tabindex", 0);
            $li.find(">." + classes.item).addClass(classes.itemFocused);
		},
		_blurItem : function($li){
			$li.find(">." + classes.item).removeClass(classes.itemFocused);			
		},		
        focusItem: function ($li) {
            $li && $li.trigger("focus" + this.eventSuffix);
        },
        blurItem: function ($li) {
            $li && $li.trigger("blur" + this.eventSuffix);
        },
        _setupMenu: function ($li) {
            var instance = this;
            instance._base("_setupMenu", $li);
            $li.attr("tabindex", -1).bind("focus" + instance.eventSuffix, function (e) {
                instance._focusItem($li);
                e.stopPropagation();
            }).bind("blur" + instance.eventSuffix, function () {
                instance._blurItem($li);
            }).find("." + classes.item + ":eq(0)").attr("tabindex", -1);
        },
		_open : function(options){
			var instance = this;
			
			instance._base("_open", options);
			instance.focusedItem = null;
			instance.element.find("."+classes.hiddenLink).focus();						
			
			return instance.element;
		},
		_close : function(){
			var instance = this, $li;
			instance._base("_close");
			
			instance.element.find("."+classes.itemFocused).each(function(){
				$li = $(this).parent();
				instance.hideSubMenu($li);
				instance._blurItem(instance.focusedItem);
			});
			
			if(instance.focusedItem)
				instance.blurItem(instance.focusedItem);
		},
        _init: function () {
            var instance = this,
                $this = instance.element,
				$tempLi;
				
            instance._base("_init");

            $this.bind("keydown" + instance.eventSuffix, function (e) {
                switch (e.which) {
                    case keys.down:						
                        if(instance.focusedItem){
							$tempLi = instance.getNextMenu(instance.focusedItem);
							if($tempLi){
								instance.focusedItem.attr("tabindex", -1);							
								instance._blurItem(instance.focusedItem);
								instance.focusItem($tempLi);
							}
						}
						else 
							instance.focusItem($this.find(">ul>li:visible:first"));                        
                        break;
                    case keys.up:
                        instance.focusedItem.attr("tabindex", -1);
                        instance._blurItem(instance.focusedItem);
                        instance.focusItem(instance.getPrevMenu(instance.focusedItem));
                        break;
                    case keys.left:
					case keys.escape:
						if(e.which == keys.escape)
						{										
							if(!instance.focusedItem || instance.focusedItem.data('iq-context-path-index').split('|').length == 1){
								instance.close();
								break;
							}
						}
						if(instance.focusedItem && ($tempLi = instance._getParentNode(instance.focusedItem)))
						{
							instance._blurItem(instance.focusedItem);
							instance.hideSubMenu($tempLi);							
							instance.focusItem($tempLi);										
						}
						break;
                    case keys.right:
						if(instance.focusedItem){
						    $tempLi = instance.focusedItem
							instance.showSubMenu($tempLi);							
							instance.focusItem($tempLi.find(">ul:visible:first>li:visible:first"))
							setTimeout(function(){$tempLi.find(">." + classes.item).addClass(classes.itemFocused);},0);
						}
                        break;
                    case keys.tab:
                        instance.focusedItem.attr("tabindex", 0);
						break;
                    default:
                        return !0;
                }
                return !1;
            }).find(">li:eq(0)").attr("tabindex", 0);		

			$this.prepend("<a href='#' class='"+ classes.hiddenLink +" "+classes.hidden + "'/>");
        }
    });
})(jQuery);(function ($) {
    var $iq = $.iq,
        classes;

    $iq.plugin("tabstrip", {
        options: {
            selectedIndex: 0,
            orientation: 'HorizontalTop',
            selected: function (event, data) {
                if ($iq.regex.noLink.test($(data.target).find(">a").attr('href'))) {
                    event.preventDefault();
                }
            }
        },
        eventPrefix: 'tab',
        selectedTab: null,

        selectTab: function (index) {
            var instance = this,
				$tabs = instance.element.find(">ul>li"),
				$selectedLi = [instance.selectedTab],
				operation = ["remove", "add"],
				i = 0;

            if (typeof index == "number") {
                $selectedLi[1] = $tabs.eq(index);
            }
            else {
                $selectedLi[1] = index;
            }

            while (i < 2) {
				if($selectedLi[i] != null){
					$selectedLi[i][operation[i] + "Class"](classes.tabSelected);
					$selectedLi[i].prev()[operation[i] + "Class"](classes.tabSelectedPrevious);
					$selectedLi[i].next()[operation[i] + "Class"](classes.tabSelectedNext)					
				}
				i++;
            }
            instance.selectedTab = $selectedLi[1];
        },

        _init: function () {
            var instance = this,
                $this = instance.element.addClass(classes.container),
				$ul = $this.find(">ul").addClass(classes.tabs),
				orientation = instance.options.orientation,
				$li = $ul.find(">li").addClass(classes.tab),
				selectedIndex = instance.options.selectedIndex;

            $.each(['horizontal', 'vertical', 'top', 'left', 'bottom', 'right'], function (index, value) {
                if (orientation.toLowerCase().indexOf(value) >= 0) {
                    $this.addClass(classes[value]);
                }
            })

			if(selectedIndex != null && selectedIndex != undefined){
				instance.selectedTab = $li.eq(selectedIndex).addClass(classes.tabSelected);
			}

            instance._delegate($ul, "li", {
				click : function (event) {
					var domElem = event.currentTarget;
					if (instance._trigger("selecting", event, { target: domElem })) {
						instance.selectTab($(domElem));
						instance._trigger("selected", event, { target: domElem });
					}
				},
				hover : function(event){
					$(event.currentTarget).toggleClass(classes.tabHover);
				}				
			});

            $li.last().addClass(classes.tabLast);
            $li.first().addClass(classes.tabFirst);

            return $this;
        }
    });

    classes = $.iq.tabstrip.classes = {
        container: "iq-tabstrip", 		// tabs container

        horizontal: "iq-tabstrip-horizontal",
        vertical: "iq-tabstrip-vertical",

        top: "iq-tabstrip-top",
        bottom: "iq-tabstrip-bottom",
        left: "iq-tabstrip-left",
        right: "iq-tabstrip-right",

        tabs: "iq-tabstrip-tabs",
        tab: "iq-tabstrip-tab",
        tabFirst: "iq-tabstrip-tab-first",
        tabLast: "iq-tabstrip-tab-last",

        tabSelected: "iq-tabstrip-tab-selected",
        tabSelectedPrevious: "iq-tabstrip-tab-selected-previous",
        tabSelectedNext: "iq-tabstrip-tab-selected-next",
		
		tabHover : "iq-tabstrip-tab-hover"
    }

})(jQuery);(function ($) {
    var $iq = $.iq,
        classes;

    $iq.plugin("tabs", {
        options: {
            selectedIndex: 0,
            orientation: 'HorizontalTop',
            tabstrip: ">div:eq(0)",
            multiview: ">div:eq(1)",
			tabstrip2: ""
        },
        eventPrefix: "tab",
		_$tabstrip1 : null,
		_$tagstrip2 : null,
        selectTab: function (index) {
			var instance = this,
				tabsCountInFirst = instance._$tabstrip1.find("li").length,
				selectInFirst = (!instance._$tabstrip2 || index < tabsCountInFirst);
			instance._$tabstrip1.tabstrip('selectTab', selectInFirst ? index : null );
			if(instance._$tabstrip2){
				instance._$tabstrip2.tabstrip('selectTab', selectInFirst ? null : (index - tabsCountInFirst));
			}
			
            $(".iq-multiview:eq(0)", this.element).multiview("activeView", index);
        },
        _init: function () {
			
            var instance = this,
                options = instance.options,
                $this = instance.element.addClass(classes.container),
				orientation = instance.options.orientation,
				selectedIndex = options.selectedIndex,				
				selectInFirst, tabsCountInFirst,
				$multiview = $(options.multiview, $this).addClass(classes.multiviewContainer).find(">div:eq(0)").multiview({
                    selectedIndex: selectedIndex					
                });
			
			instance._$tabstrip1 = $(options.tabstrip, $this);
			instance._$tabstrip2 = options.tabstrip2 ? $(options.tabstrip2, $this) : null;
			tabsCountInFirst = instance._$tabstrip1.find("li").length
			selectInFirst = selectedIndex < tabsCountInFirst;


			$.each(['horizontal', 'vertical', 'top', 'left', 'bottom', 'right'], function (index, value) {
                if (orientation.toLowerCase().indexOf(value) >= 0) {
                    $this.addClass(classes[value]);
                }
            });
			
            instance._$tabstrip1.tabstrip({
                selectedIndex: selectInFirst ? selectedIndex : null,
                orientation: orientation,
                selected: function (event, data) {
                    var selectedIndex = $(data.target).prevAll().length;
                    $multiview.multiview("activeView", selectedIndex);
                    if ($iq.regex.noLink.test($(data.target).find(">a").attr('href'))) {
                        event.stopOriginalEvent();
                    }
					if(instance._$tabstrip2){
						instance._$tabstrip2.tabstrip('selectTab', null);
					}
                    instance._trigger("selected", event, { target: data.target, selectedIndex: selectedIndex, tabPage: $multiview.find(">div:eq(" + selectedIndex + ")") });
                }
            });
			
			if(instance._$tabstrip2){
				var opposite = { Top : "Bottom", Bottom: "Top", Left : "Right", Right : "Left" };
				$.each(opposite, function(key,value){
					if(orientation.indexOf(key) >= 0){
						orientation = orientation.replace(key, value);
						return false;
					}
				});
				instance._$tabstrip2.tabstrip({
					selectedIndex: selectInFirst ? null : (selectedIndex - tabsCountInFirst),
					orientation: orientation,
					selected: function (event, data) {
						var selectedIndex = $(data.target).prevAll().length;
						$multiview.multiview("activeView", instance._$tabstrip1.find("li").length + selectedIndex);
						if ($iq.regex.noLink.test($(data.target).find(">a").attr('href'))) {
							event.stopOriginalEvent();
						}
						instance._$tabstrip1.tabstrip('selectTab', null);
						instance._trigger("selected", event, { target: data.target, selectedIndex: selectedIndex, tabPage: $multiview.find(">div:eq(" + selectedIndex + ")") });
					}
				});
			}
			
            return $this;
        }
    });

    classes = $.iq.tabs.classes = {
        container: "iq-tabs", 		// tabs container
		horizontal: "iq-tabs-horizontal",
        vertical: "iq-tabs-vertical",

        top: "iq-tabs-top",
        bottom: "iq-tabs-bottom",
        left: "iq-tabs-left",
        right: "iq-tabs-right",

        multiviewContainer: "iq-multiview-container"
		
    }

})(jQuery);(function ($) {
    var $iq = $.iq,       
        classes;

    $iq.plugin("treeview", {
        options: {
            defaultState: "expanded",
            
			selecting: $iq.ret1,
            selected: function(event, data){
				var $li = $(data.target);
				return !$iq.regex.noLink.test($li.find(">div>a").attr('href'));
			}
        },
		
		eventPrefix : "treenode",
		focusedNode: null,
		hoveredNode : null,
		selectedNode : null,
		
		unselectNode : function($li){
			$li.toggleClass(classes.nodeSelected).find(">div>a." + classes.itemAnchor+":eq(0)").removeClass(classes.itemAnchorSelected);
			selectedNode = null;
            return this.element;
		},
        selectNode: function ($li) {
            var instance = this;
            instance.getSelected().toggleClass(classes.nodeSelected).find(">div>a." + classes.itemAnchor+":eq(0)").removeClass(classes.itemAnchorSelected);
            $li.toggleClass(classes.nodeSelected).find(">div>a." + classes.itemAnchor+":eq(0)").addClass(classes.itemAnchorSelected).removeClass(classes.itemHover);
			selectedNode = $li;          
        },
        getSelected: function () {
            var instance = this,
                $ul = instance.element.find(">ul"),
                selected = "." + classes.nodeSelected;
            return $ul.find(">li" + selected).add($ul.find("li>ul>li" + selected));
        },
        _expandAnimate: function ($ul) {
            $ul.animate({ height: 'toggle'},50);
        },
		_collapseAnimate: function($ul){
			$ul.animate({ height: 'toggle'},50);
		},
		expandNode : function($li){
			var instance = this;
			instance._expandAnimate($li.editClass(classes.nodeCollapsed, classes.nodeExpanded).find(">ul"));
			$li.find(">div>." + classes.arrow + ":eq(0)").editClass(classes.arrowPlus, classes.arrowMinus);
			return instance.element;
		},
		collapseNode : function($li){
			var instance = this;
			instance._collapseAnimate($li.editClass(classes.nodeExpanded, classes.nodeCollapsed).find(">ul"));
			$li.find(">div>." + classes.arrow + ":eq(0)").editClass(classes.arrowMinus, classes.arrowPlus);
			return instance.element;
		},
        toggleNode: function ($li) {
            var instance = this;
            $li.hasClass(classes.nodeExpanded) ? instance.collapseNode($li) : instance.expandNode($li);
            return instance.element;
        },
        _setupParentNode: function ($li) {
            var instance = this,
                options = instance.options,
                $nextUl = $li.find(">ul").show(),
                defaultArrow = classes.arrowMinus,
                defaultState = classes.nodeExpanded;
            if ((options.defaultState == 'expanded' && $li.hasClass(classes.nodeCollapsed)) ||
                                           (options.defaultState != 'expanded' && !$li.hasClass(classes.nodeExpanded))) {
                defaultState = classes.nodeCollapsed;
                defaultArrow = classes.arrowPlus;
                $li.removeClass(classes.nodeCollapsed).removeClass(classes.nodeExpanded);
                $nextUl.hide();
            }
            $li.addClass(defaultState).find(">div").prepend($("<span class='"+classes.arrow + " " + defaultArrow+"'><span/></span>"));
            return instance.element;
        },

        _setupInnerNode: $.noop,

        _setupNode: function ($li) {
            var instance = this,
                $nextUl = $li.addClass(classes.node).find(">ul"),
                innerUlLength = $nextUl.length;

            if (innerUlLength == 1)
                instance._setupParentNode($li);
            else if (innerUlLength == 0)
                instance._setupInnerNode($li);

            ($li.prevAll().length == 0) && $li.addClass(classes.nodeFirst);
            if($li.nextAll().length == 0){
				$li.prev().removeClass(classes.nodeLast);
				$li.addClass(classes.nodeLast);
			}
	
			$li.find(">div").addClass(classes.item).not("."+ classes.nodeTemplate).find(">a").addClass(classes.itemAnchor);
            
            return instance.element;
        },			
		_initTree : function($ul){					
			var instance = this, $li,
				$parentLi = $ul.parent(),
				hasPathInfo = $parentLi.hasClass(classes.node),
				xPathIndex =  hasPathInfo ? $parentLi.data("iq-treeview-path-index") : "",
				xPathNames = hasPathInfo ? $parentLi.data("iq-treeview-path-names") : "";
			
			xPathIndex = xPathIndex ? xPathIndex + "|" : "";
			xPathNames = xPathNames ? xPathNames + "|" : "";
			
			$ul.addClass(classes.nodes).find(">li").each(function(index){
				$li = $(this);
				instance._setupNode($li.data("iq-treeview-path-index",xPathIndex + index).data("iq-treeview-path-names", xPathNames + $li.find(">div>a").text()));
				instance._initTree($li.find(">ul"));
			});		
			
		},
        _init: function () {
            var instance = this,
				options = instance.options,
                $this = instance.element.addClass(classes.container),
                $ul = $this.find(">ul").addClass(classes.nodes);               

			instance._initializing = true;
            instance._initTree($ul);
			instance._initializing = false;

            if ($this.find(">h3").addClass(classes.heading).length > 0) {
                $ul.find(">li:eq(0)").addClass(classes.nodeHead);
                $ul.addClass(classes.nodesHead);
            }
			
			instance._delegate($ul, "." + classes.item, "hover", function(event){
			    $(event.currentTarget).toggleClass(classes.itemHover);
			});
			
			instance._delegate($ul, "." + classes.itemAnchor, {
				hover : function(event){
				    $(event.currentTarget).toggleClass(classes.itemAnchorHover);
				},
				click : function(event){
				    var $li = $(event.currentTarget).closest("li");
					if (instance._trigger("selecting", event, {target : $li[0]})) {
						instance.selectNode($li);
						return instance._trigger("selected", event, {target : $li[0]});
					}					
					return false;
				}
			});
			instance._delegate($ul, "." + classes.arrow, "click", function(event){
			    var $li = $(event.currentTarget).closest("li");
				
				// Close exisitng nodes if already open
				if(options.expandMode == 'single')
					instance.toggleNode($li.siblings(classes.nodeExpanded));
					
                instance.toggleNode($li);
			});
			
            return $this;
        }
    });

    classes = $.iq.treeview.classes = {
        container: "iq-treeview",			// tree view container
        heading: "iq-treeview-heading",		// tree view heading
        
		// ul
		nodes: "iq-treeview-nodes",		// nodes collection
		nodesRoot: "iq-treeview-nodes-root", // root of tree view
        nodesHead: "iq-treeview-nodes-with-head", // root of tree view (if header is enabled)
        
		// li
		node: "iq-treeview-node",	// node item
		nodeFirst: "iq-treeview-node-first", // first node item in nodes collection
        nodeHead: "iq-treeview-node-with-head", // first node item with header        
        nodeLast: "iq-treeview-node-last", // last node item in nodes collection
        nodeSelected: "iq-treeview-node-selected",
        nodeCollapsed: "iq-treeview-node-collapsed",
        nodeExpanded: "iq-treeview-node-expanded",
		nodeTemplate: "iq-treeview-node-template",
		
		// div
        item : "iq-treeview-item",
        itemHover: "iq-treeview-item-hover",
		itemSelected: "iq-treeview-item-selected",
		itemFocused: "iq-treeview-item-selected",
		
		// div a
        itemAnchor: "iq-treeview-item-a",
        itemAnchorHover: "iq-treeview-item-a-hover",
        itemAnchorSelected: "iq-treeview-item-a-selected",
		itemAnchorFocused: "iq-treeview-item-a-focused",		
		
		// arrow
        arrow: "iq-treeview-arrow",
        arrowPlus: "iq-treeview-arrow-plus",
        arrowMinus: "iq-treeview-arrow-minus"
    }

})(jQuery);(function ($) {
    var $iq = $.iq,
        classes = $.iq.treeview.classes,
        keys = $iq.keys;
	
    $.extend(classes, {
		// tree css
        skipLinkTree: "iq-treeview-skiplink",
		
		// base css
        skipLink: "iq-skiplink",
        skipLinkFocus: "iq-skiplink-focus"		
    });
	
	$iq.plugin("treeview",$iq.treeview, {
        options: {
            skip: { 
				enabled: true, 
				id: '', 
				external: false, 
				randomId: true,
				text: "Skip Navigation" 
			}
        },

        _getNextParent: function ($li) {
            var $nextLi = $li.next("li:visible:first");
            if ($nextLi.length > 0)
                return $nextLi;

            $parentNode = $li.parent();
            if ($parentNode.hasClass(classes.nodes)) {
                $parentNode = $parentNode.parent();
                if ($parentNode.hasClass(classes.node)) {
                    $nextLi = $parentNode.next("li:visible");
                    if ($nextLi.length > 0)
                        return $nextLi;
                    else {
                        $nextLi = this._getNextParent($parentNode);
                        return $nextLi ? $nextLi : $li;
                    }
                }
            }

            return null;
        },
        _getLastChild: function ($li) {
            var $lastLi = $li.find(">ul:visible:last>li:visible:last");
            if ($lastLi.length > 0 && $lastLi.find("." + classes.itemAnchor + ":eq(0)").length > 0) {
                $lastLi = this._getLastChild($lastLi);
                if ($lastLi && $lastLi.length > 0)
                    return $lastLi;
            }
            return $li;
        },
        getNextNode: function ($li) {

            var $nextLi = $li.find(">ul:visible:first>li:visible:first");

            if ($nextLi.length > 0 && $nextLi.find("." + classes.itemAnchor + ":eq(0)").length > 0)
                return $nextLi;

            $nextLi = this._getNextParent($li);

            return $nextLi || $li;

        },
        getPrevNode: function ($li) {
            var instance = this,
                $prevLi, $parentNode;

            $prevLi = $li.prev("li:visible:first");
            if ($prevLi.length > 0)
                return instance._getLastChild($prevLi);

            $parentNode = $li.parent();
            if ($parentNode.hasClass(classes.nodes)) {
                $parentNode = $parentNode.parent();
                if ($parentNode.hasClass(classes.node))
                    return $parentNode;
            }

            return $li;
        },
        focusNode: function ($li) {
            $li && $li.trigger("focus" + this.eventSuffix);
        },
        blurNode: function ($li) {
            $li && $li.trigger("blur" + this.eventSuffix);
        },
        _setupNode: function ($li) {
            var instance = this;
            instance._base("_setupNode", $li);
            $li.attr("tabindex", -1).bind("focus" + instance.eventSuffix, function (e) {
                instance.focusedNode = $li.attr("tabindex", 0);
                $li.find("." + classes.itemAnchor + ":eq(0)").addClass(classes.itemAnchorFocused);
                e.stopPropagation();
            }).bind("blur" + instance.eventSuffix, function () {
                $li.find("." + classes.itemAnchor + ":eq(0)").removeClass(classes.itemAnchorFocused);
            }).find("." + classes.itemAnchor + ":eq(0)").attr("tabindex", -1);
        },
        _init: function () {
            var instance = this,
                $this = instance.element,
                skipOptions = instance.options.skip,
                skipId;
            instance._base("_init");

            $this.find(">ul").bind("keydown" + instance.eventSuffix, function (e) {				
                switch (e.which) {
                    case keys.down:
                        instance.focusedNode.attr("tabindex", -1);
                        instance.blurNode(instance.focusedNode);
                        instance.focusNode(instance.getNextNode(instance.focusedNode));
                        break;
                    case keys.up:
                        instance.focusedNode.attr("tabindex", -1);
                        instance.blurNode(instance.focusedNode);
                        instance.focusNode(instance.getPrevNode(instance.focusedNode));
                        break;
                    case keys.left:
                    case keys.right:
                        instance.toggleNode(instance.focusedNode);
                        break;
                    case keys.tab:
                        instance.focusedNode.attr("tabindex", 0);
                    default:
                        return !0;
                }
                return !1;
            }).find(">li:eq(0)").attr("tabindex", 0);

            if (skipOptions.enabled) {
                skipId = skipOptions.external ? skipOptions.id : skipOptions.id ? skipOptions.id : ("SkipNavigation" + (skipOptions.randomId ? $iq.rand(10000) : ""));
                $this.prepend($("<a href='#" + skipId + "' class='" + classes.skipLink + " " + classes.skipLinkTree + "' />").text(skipOptions.text).focusClass(classes.skipLinkFocus));

                if (!skipOptions.external)
                    $this.append("<a name='" + skipId + "' />");
            }
        }
    });
})(jQuery);(function ($) {
    var $iq = $.iq,
		classes = $iq.treeview.classes;

	$iq.plugin("treeview",$iq.treeview, {		
		options : {
			cookie : { 
				enabled : false, 
				name : '', 
				path : '/', 
				expires : '', 
				useIndex : true 
			}
		},		
		_expandedState : null,
		
		_setExpandedState : function($li, value){
		
			var instance =this,
				xPaths = $li.data("iq-treeview-path-index").split("|");
				
			if(xPaths){
				var xPathsLength = xPaths.length - 1,												
					expandedState = instance._expandedState || {},
					currentNodeState = expandedState,
					currentIndex;
					
				$(xPaths).each(function(index){
					currentIndex = this;
					currentNodeState = expandedState[currentIndex];		
					if(!currentNodeState)
						currentNodeState = expandedState[currentIndex] = [1,{}];
							
					if(index < xPathsLength){														
						if(currentNodeState.length <=1)
							currentNodeState[1] = {};
						currentNodeState = currentNodeState[1];
					}
					else{
						if(value == 0 && (currentNodeState.length <= 1 || $.isEmptyObject(currentNodeState[1])))
							delete expandedState[currentIndex];							
						else 
							currentNodeState[0] = value;							
						instance._saveExpandedStateCookie();							
					}		
					expandedState= currentNodeState;
				});
			}
		},		
		expandNode : function($li){
			var instance =this;			
			instance._base("expandNode", $li);			
			if(!instance._initializing)
				instance._setExpandedState($li,1);
		},
		collapseNode : function($li){
			var instance =this;			
			instance._base("collapseNode", $li);
			
			if(!instance._initializing)
				instance._setExpandedState($li,0);
		},		
		_isInExpandedState : function(expandedState, xPath){
		
			xPath = $iq.trim(xPath, "|", true);
			
			var instance = this,
				returnVal = !1,
				currentIndex,
				subNodeState,
				subNodeStateLength,
				xPaths = xPath.split("|");
				
			if(expandedState && xPaths && xPaths.length > 0){
			
				currentIndex = xPaths[0];
				subNodeState =  expandedState[currentIndex];
				
				if(subNodeState){
					var tempPath = xPaths.slice(1);
					if(tempPath.length > 0){
						returnVal = subNodeState.length > 0 ? instance._isInExpandedState(subNodeState[1], tempPath.join("|")) : !1;
					}
					else{
						returnVal = subNodeState[0] == 1 ? !0 : !1;						
					}
				}
			}
			return returnVal;
		},
		_getExpandedStates : function($ul, expandedState){
			
			var instance = this;
			
			expandedState = expandedState || {};
			$ul.find(">li").each(function(index){
				var $li = $(this),
					isExpanded = $li.hasClass(classes.nodeExpanded),
					subNodeExpandedStates = instance._getExpandedStates($li.find(">ul"));
				
				if(isExpanded || subNodeExpandedStates.length > 0)
					expandedState[index] = [isExpanded ? 1 : 0, subNodeExpandedStates];				
			});

			return expandedState;			
		},
		_saveExpandedStateCookie : function(){
			var instance = this,
				cookieOptions = instance.options.cookie; 
				
			// Save expanded state to cookie
			$.cookie.set(cookieOptions.name, instance._expandedState, {path : cookieOptions.path, expires : cookieOptions.expires}, {type :'json'});
		},
		_saveExpandedStates : function(){
		
			var instance = this;
			
			// Get expanded state
			instance._expandedState = instance._getExpandedStates(instance.element.find(">ul"));
			
			instance._saveExpandedStateCookie();
		},
		
		_setupNode : function($li, xPathIndex, xPathNames){
		
			var instance = this, isExpanded, xPathIndex,
				expandedState = instance._expandedState;
				
			if(expandedState){
			
				xPathIndex = $li.data("iq-treeview-path-index");
				
				// Set the classes to specify expansion of nodes, based on the cookie expanded state object
				if(instance.options.cookie.useIndex && xPathIndex){								
					isExpanded = instance._isInExpandedState(expandedState, xPathIndex);					 
					$li.editClass( isExpanded ? classes.nodeCollapsed : classes.nodeExpanded, 
										isExpanded ? classes.nodeExpanded : classes.nodeCollapsed);
					
				}
			}			
					
			instance._base("_setupNode", $li, xPathIndex, xPathNames);
		},	
		
		_init : function(){
			var instance = this,				
				cookieOptions = instance.options.cookie,				
				expandedState,
				cookieEnabled = cookieOptions.enabled;								
			
			if(cookieEnabled){
				if(!cookieOptions.name)
					cookieOptions.name = instance.element.attr('id') || 'iq-treeview-cookie';
				
				//	Get the stored cookie
				instance._expandedState = $.cookie.get(cookieOptions.name, {type:'json'});
			}
			
			// Initialize the tree
			instance._base("_init");
			
			if(cookieEnabled){
				// If cookie is not available
				// Store the current expanded state in cookie
				if(typeof instance._expandedState != "object")
					instance._saveExpandedStates();			
			}
		}		
    });
})(jQuery);(function ($) {
    var $iq = $.iq,
		classes = $iq.treeview.classes;

    $.extend(classes, {
        nodeChecked: 'iq-treeview-node-checked',
        nodeUnchecked: 'iq-treeview-node-unchecked'
    });

    $iq.plugin("treeview",$iq.treeview, {
        options: {
            checkbox: {
                enabled: false,
                triState: false,	// TODO : needs to be implemented
                defaultState: "unchecked",
				stateChanging : $iq.ret1,
				stateChanged : $iq.ret1
            }
        },
		setCheck : function($li, bCheckState){			
			return bCheckState ? this.checkNode($li) : this.uncheckNode($li);			
		},
		toggleCheck: function($li){
			return $li.find("input[type='checkbox']").eq(0).attr('checked') ?  this.uncheckNode($li) : this.checkNode($li);			
		},
		uncheckNode: function($li){
			$li.editClass(classes.nodeChecked, classes.nodeUnchecked).find("input[type='checkbox']").eq(0).attr("checked", !1);				
			return this.elements;
		},
		checkNode: function ($li){
			$li.editClass(classes.nodeUnchecked, classes.nodeChecked).find("input[type='checkbox']").eq(0).attr("checked", !0);				
			return this.elements;
		},
        _setupNode: function ($li) {
            var instance = this,				
                checkboxOptions = instance.options.checkbox,
                defaultState = classes.nodeUnchecked,
                isChecked = false;

            instance._base("_setupNode", $li);

            if (checkboxOptions.enabled) {
                if ((checkboxOptions.defaultState == 'unchecked' && $li.hasClass(classes.nodeChecked)) ||
                    (checkboxOptions.defaultState != 'unchecked' && !$li.is("." + classes.nodeUnchecked))) {
                    defaultState = classes.nodeChecked;
                    isChecked = true;
                    $li.removeClass(classes.nodeUnchecked).removeClass(classes.nodeChecked);
                }
                $li.find("." + classes.itemAnchor).before($("<input type='checkbox' />").attr('tabindex',-1).bind('click'+instance.eventSuffix, 
					function(){
						if(checkboxOptions.stateChanging.call($li))
						{
							//instance.toggleCheck($li);
							return checkboxOptions.stateChanged.call($li);														 
						}
					})
				);
				
				instance.setCheck($li, isChecked);
				
				$li.bind("keydown" + instance.eventSuffix, function (e) {
					if(e.which == $iq.keys.space) {
						instance.toggleCheck($li);
						return !1;
					}					
				});				
            }
        }
    });
})(jQuery);(function ($, undefined) {
    var $iq = $.iq,
        classes,
        isEventBinded, buttonManager;


    $iq.plugin("button", {

        _onElement: "input, a, button",
        _init: function () {
			
            var instance = this,
                options = instance.options,
				$this = instance.element,
                width, $parent,
                $container, tabIndex;

            if ($this.is("input")) {
                tabIndex = $this.attr('tabindex');
                $container = $this.addClass(classes.input).attr('tabindex', '-1').wrap("<a class='" + classes.container + "' href='#'/>").parent().click(function (event) {
									
                    if (event.target === $container[0]) {
                        $(this).find(">input").click();
						
                        return false;
                    }	
					event.preventDefault();
					
                }).attr('tabindex', tabIndex);

                width = $.trim($iq.curStyle($this, "width", { hide: true }));
                if (/[\d]+%/.test(width)) {
                    $parent = $this.parent().addClass("iq-button-block");

                    if (width !== "100%") {
                        $parent.css("width", width);						
                    }
                }
            }
            else {
                $container = $this.addClass(classes.container);

                $this.contents().wrap("<span class='" + classes.text + "'/>");
               
            }

            

            buttonManager.bindEvents();

        }
    });


    classes = $iq.button.classes = {
        container: "iq-button",
        input: "iq-button-input",
        text: "iq-button-text",

        hover: "iq-button-hover",
        focus: "iq-button-focus"

    }

    buttonManager = $iq.button.manager = {
        bindEvents: function () {
            if (!isEventBinded) {
                $(document).delegate(".iq-button", {
                    hover: function (event) {
                        $(this).toggleClass(classes.hover);
                    },
                    focus: function (event) {
                        $(this).addClass(classes.focus);
                    },
                    blur: function (event) {
                        $(this).removeClass(classes.focus);
                    }
                });
                isEventBinded = true;
            }
        }
    }


})(jQuery);(function ($, undefined) {
    var $iq = $.iq,
        classes,
		resetCss = { width: "", height: "",
			top: "",
			left: "",
			position :"",
			fontSize:"",
			opacity: "",
			lineHeight:"",
			marginLeft: "",
			marginTop: ""
		};

    $iq.plugin("calendar", {
        options: {
            daysFormat: "daysShort",
            monthsFormat: "monthsMedium",
            weekHeader: 'Wk',
            firstDay: 0,
            pickerCount: 1,
            textPrev: '',
            textNext: '',
            dateFormat: "dd-MM-yyyy",
			
			slideDuration: 'fast',
			inOutDuration : 250,
			/*slideEasing: 'linear' */
			/*inOutEasing: 'linear' */
			
            // callbacks
            selecting: $iq.ret1,
            selected: $iq.ret1
        },
		eventPrefix : "date",
        daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        selectedDate: null,
        _currentPage: 0,
		_animating : false,
		_animateOut : function($current, $previous, prevWidth, prevHeight, prevFontSize, $a){
			this._animating = true;
				
			var options = this.options,
				$td = $a.parent(),
				col = $td.prevAll().length,
				row = $td.parent().prevAll().length,
				$currentTable = $current.find("table"),				
				tdPosition = $td.position(),
				$prevTable = $previous.show().find("table"),
				prevWidth = $previous.width(),
				prevHeight = $previous.height(),
				prevFontSize = $previous.css("font-size"),
				prevLineHeight = $previous.css("line-height"),
				nextWidth = $previous.css({ width: "", height : "", fontSize:"", lineHeight: ""}).width(),
				nextHeight = $previous.height(),
				nextFontSize = $previous.css("font-size"),
				nextLineHeight = $previous.css("line-height");						
			
			$previous.show().css({
				top: tdPosition.top,
				left: tdPosition.left,				
				width: prevWidth,
				height: prevHeight,
				fontSize: prevFontSize,
				lineHeight: prevLineHeight
			});
			
			$previous.animate({
				width: nextWidth + "px",
				height: nextHeight + "px",				
				left: "0px",
				top: "0px",
				opacity: "1",
				fontSize: nextFontSize,
				lineHeight : nextLineHeight
			}, {
				duration : options.inOutDuration,
				easing : options.inOutEasing,
				complete : function () {
					$previous.css(resetCss);
				}
			});
			
			$currentTable.addClass(classes.selectorsAnimate);
			properties = {
				width: $currentTable.width()+ "px",
				height: $currentTable.height()+ "px",
				fontSize: $currentTable.css("fontSize"),
				marginLeft: -$td.position().left+ "px",
				marginTop : -$td.position().top+ "px",
				opacity: 0.2
			}			
			$currentTable.removeClass(classes.selectorsAnimate);
			
			$currentTable.animate(properties, {
				duration : options.inOutDuration,
				easing : options.inOutEasing,
				complete : function () {
					$currentTable.hide().css(resetCss);
					this._animating = false;
				}
			});			
		},
		_animateIn : function($current, $nextTable, $nextTd,  nextPosition, nextRows, nextCols){
			this._animating = true;
			$nextTable.show();
			var nextTdPosition = $nextTd.position(),				
				nextFontSize = $nextTable.css("fontSize"),
				nextTdWidth = $nextTd.width(),
				nextTdHeight = $nextTd.height(),
				nextWidth = $nextTable.outerWidth(),
				nextHeight = $nextTable.outerHeight(),
				nextLeft = parseInt($nextTd.css("marginLeft")),
				nextTop = parseInt($nextTd.css("marginTop"));
			$nextTable.addClass(classes.selectorsAnimate).show().css({
				width: $nextTable.width(),
				height: $nextTable.height(),
				fontSize: $nextTable.css("fontSize"),
				marginLeft: -$nextTd.position().left,
				marginTop : -$nextTd.position().top,
				opacity: 0.2
			}).removeClass(classes.selectorsAnimate).animate({
				marginLeft: ((!nextLeft || nextLeft == "auto" )? 0 : nextLeft)+"px",
				marginTop: ((!nextTop || nextTop == "auto" )? 0 : nextTop)+"px",
				width: nextWidth +"px",
				height: nextHeight+"px",
				fontSize: nextFontSize, 
				opacity: 1
			},{
				queue : false,
				duration: 350,
				complete : function(){
					$nextTable.css(resetCss);
				}
			});
			$current.animate({
				height: nextTdWidth + "px",				
				width: nextTdHeight + "px",
				left: nextTdPosition.left+"px",
				top: nextTdPosition.top+"px",
				fontSize:"1px",
				lineHeight: (nextTdHeight / $current.find("table tr").length) + "px"
			},{
				duration: 350,
				queue : false,
				complete: function(){					
					$current.hide();
					this._animating = false;
				}
			});
		},
		_generateDaySelectors: function($table, date){
			var instance = this,
                options = instance.options,
				selectedDate = instance.selectedDate,
				headerHtml = "<tr>",
				bodyHtml = "",
				daysInMonth = instance.daysInMonth,
				prevMonth = getPreviousMonth(new Date(date)),
				currentMonth = date.getMonth(),
				currentYear = date.getFullYear(),
				numberOfDaysInPreviousMonth = (prevMonth.getMonth() == 1 && isLeapYear(prevMonth.getFullYear())) ? 29 : daysInMonth[prevMonth.getMonth()],
				numberOfDaysInCurrentMonth = (currentMonth == 1 && isLeapYear(currentYear)) ? 29 : daysInMonth[currentMonth],
				currentMonthFirstDay = new Date(currentYear, currentMonth, 1).getDay(),
				currentDay = 1,
				isCurrentMonth = true,
				firstRow = true,
				daysInPreviousMonthClass = classes.daysPrevMonth,
				daysInCurrentMonthClass = classes.daysCurrentMonth,
				today = new Date(),
				selectedDay = selectedDate ? selectedDate.getDate() : -1;

			$.each($iq.circularShift($.extend({}, $iq.formats[options.daysFormat]), options.firstDay), function () {
				headerHtml += "<td>" + this + "</td>";
			});

			for (var count = 6; count--; ) {
				bodyHtml += "<tr>";
				for (var i = 0, val; i < 7; i++) {
					if (firstRow && i < (currentMonthFirstDay - options.firstDay))
						val = "<a href='#' class='" + daysInPreviousMonthClass + "'>" + (numberOfDaysInPreviousMonth - currentMonthFirstDay + 1 + i) + "</a>";
					else
						val = "<a href='#' class='" + daysInCurrentMonthClass +
									((isCurrentMonth && date.getMonth() == today.getMonth() && currentDay == today.getDate()) ? " " + classes.today : "") +
									((isCurrentMonth && currentDay == selectedDay) ? " " + classes.daySelected : "") +
							   "' >" + currentDay++ + "</a>";
					
					bodyHtml += "<td>" + val + "</td>";
					
					if (currentDay > numberOfDaysInCurrentMonth) {
						isCurrentMonth = false;
						currentDay = 1;
						daysInCurrentMonthClass = classes.daysNextMonth;
					}
				}
				firstRow = false;
				bodyHtml += "</tr>";
			}
			$table.find("thead").html(headerHtml + "</tr>");
			$table.find("tbody").html(bodyHtml);
		},		
        _generateCalendar: function ($calendar, date) {
            var instance = this,
                options = instance.options,
                titleHtml,
                year = date.getFullYear(),
                currentPage = instance._currentPage,
                start,
                selectedDate = instance.selectedDate;

            if (currentPage == 0) {				
                titleHtml = $iq.formats[options.monthsFormat][date.getMonth()] + ", " + year;
                instance._generateDaySelectors($calendar.find("." + classes.daySelectors+" table"), date);
                //$monthHtml.find("a").hoverClass(classes.dayHovered);
            }
            else if (currentPage == 1) {
                titleHtml = year;
				var i = 0,
					selectedMonth = selectedDate ? selectedDate.getMonth() : -1,
					yearHtml = "";
                for (; i < 3; i++) {
                    yearHtml += "<tr>";
                    for (var j = 0, month; j < 4; j++) {
                        month = i * 4 + j;
                        yearHtml += "<td><a href='#' class='" + classes.monthsCurrentYear + (month == selectedMonth ? " " + classes.monthSelected : "") + "'>" + $iq.formats[options.monthsFormat][month] + "</a></td>";
                    }
					yearHtml += "</tr>";
                }
				
				$calendar.find("." + classes.monthSelectors + " tbody").html(yearHtml);
                //$yearHtml.find("a").hoverClass(classes.monthHovered);
            }
            else if (currentPage == 2) {
                start = getDecadeStart(year),
                titleHtml = start + "-" + (start + 9);

                for (var i = 0,
                        year = start - 1,                        
                        selectedYear = selectedDate ? selectedDate.getFullYear() : -1,
						decadeHtml = ""; i < 3; i++) {
                    decadeHtml += "<tr>";
                    for (var j = 0; j < 4; j++) {
                        decadeHtml += "<td><a href='#' class='" + ((i == 0 && j == 0) ? classes.yearsPrevDecade : (i == 2 && j == 3) ? classes.yearsNextDecade : classes.yearsCurrentDecade) + (year == selectedYear ? " " + classes.yearSelected : "") + "'>" + year++ + "</a></td>";
                    }
					decadeHtml += "</tr>";
                }
				
				$calendar.find("." + classes.yearSelectors + " tbody").html(decadeHtml);
                //$decadeHtml.find("a").hoverClass(classes.yearHovered);
            }
            else if (currentPage == 3) {
                start = getCenturyStart(year),
                titleHtml = start + "-" + (start + 99);

                for (var i = 0,
                        decade = start - 10,                        
                        selectedDecade = selectedDate ? getDecadeStart(selectedDate.getFullYear()) : -1,
						centuryHtml = ""; i < 3; i++) {
                    centuryHtml += "<tr>";
                    for (var j = 0; j < 4; j++) {
                        centuryHtml += "<td><a href='#' class='" + ((i == 0 && j == 0) ? classes.decadesPrevCentury : (i == 2 && j == 3) ? classes.decadesNextCentury : classes.decadesCurrentCentury) + (decade == selectedDecade ? " " + classes.decadeSelected : "") + "'>" + decade + "- " + (decade + 9) + "</a></td>";
                        decade += 10;
                    }
					centuryHtml += "</tr>";
                }
				
				$calendar.find("." + classes.decadeSelectors + " tbody").html(centuryHtml);
                //$centuryHtml.find("a").hoverClass(classes.decadeHovered);
            }			
            $calendar.find("." + classes.title).html("<span>"+ titleHtml +"</span>");
        },
        setDate: function (date) {
            var instance = this;
			instance._temp = instance.selectedDate = date;
            instance._generateCalendar(instance.element.find("." + classes.group), date);			
        },
        show: function () {
            this.instance.element.show();
        },
		selectedDate : null,
		_temp : null,		
        _init: function () {
			
            var instance = this,
                options = instance.options,
                $this = instance.element.addClass(classes.container),
                calendar = "<div class='" + classes.group + "'>" +
                                "<div class='" + classes.header + "'>" +
                                    "<a href='#' class='" + classes.previous + "'><span /></a>" +
                                    "<a href='#' class='" + classes.next + "'><span /></a>" +
                                    "<a href='#' class='" + classes.title + "'></a>" +
                                "</div>" +
                                "<div class='" + classes.selectors + "'>" +
                                    "<div class='" + classes.daySelectors + "'><table cellpadding='0' cellspacing='0'><thead /><tbody /></table></div>" +
                                    "<div class='" + classes.monthSelectors + "'><table cellpadding='0' cellspacing='0'><thead /><tbody /></table></div>" +
                                    "<div class='" + classes.yearSelectors + "'><table cellpadding='0' cellspacing='0'><thead /><tbody /></table></div>" +
                                    "<div class='" + classes.decadeSelectors + "'><table cellpadding='0' cellspacing='0'><thead /><tbody /></table></div>" +                                    
                                "</div>" +
                           "</div>";
				instance._temp = new Date();
				
			$this.append(calendar);
			
            instance.setDate(instance.selectedDate || (new Date()));
			
			var $group = instance.element.find("." + classes.group),
				$dateSelector = $group.find("."+classes.daySelectors),
				$monthSelector = $group.find("."+classes.monthSelectors),
				$yearSelector = $group.find("."+classes.yearSelectors),
				$decadeSelector = $group.find("."+classes.decadeSelectors),
				$dateSelectorTable = $dateSelector.find("table:eq(0)"), 
				$monthSelectorTable = $monthSelector.find("table:eq(0)"),
				$yearSelectorTable = $yearSelector.find("table:eq(0)"), 
				$decadeSelectorTable = $decadeSelector.find("table:eq(0)"), 
				dateSelectorWidth = $dateSelectorTable.outerWidth(),
                dateSelectorHeight = $dateSelectorTable.outerHeight(),				
				monthSelectorWidth = $monthSelectorTable.outerWidth(),
                monthSelectorHeight = $monthSelectorTable.outerHeight(),		
				yearSelectorWidth = $yearSelectorTable.outerWidth(),
                yearSelectorHeight = $yearSelectorTable.outerHeight(),		
				datefontSizeValue = $dateSelector.css("fontSize"), 
				monthfontSizeValue = $monthSelector.css("fontSize"), 
				yearfontSizeValue = $yearSelector.css("fontSize"),
				selectedDate;
				
			$dateSelector.delegate("a", {
				click : function (event) {
					var $day = $(this),
						tempDate = new Date(instance._temp);
					if($day.hasClass(classes.daysNextMonth))
						tempDate = getNextMonth(tempDate);
					if($day.hasClass(classes.daysPrevMonth))
						tempDate = getPreviousMonth(tempDate);
					tempDate.setDate($(this).text());
					
					if (instance._trigger("selecting", event, { newDate : tempDate } )) {
						 instance.setDate(tempDate);
						 instance._trigger("selected", event, { newDate : tempDate } );
					}
					
					return false;
				},
				hover : function(event){
					if(!instance._animating){
						$(event.currentTarget).toggleClass(classes.dayHovered);
					}
				}
			})
			
			$monthSelector.delegate("a", {
				click : function(event){
					$monthSelector.find("."+classes.monthSelected).removeClass(classes.monthSelected);
					var tempDate = instance._temp,
						$a = $(event.currentTarget).addClass(classes.monthSelected);
					
					tempDate.setMonth($.inArray($a.text(), $iq.formats[options.monthsFormat]));
					instance._selectedDate = instance._temp = tempDate;
					instance._currentPage--;
					instance._generateCalendar($group, tempDate);
					instance._animateOut(
						$monthSelector,							
						$dateSelector,
						dateSelectorWidth,
						dateSelectorHeight,
						datefontSizeValue,					
						$a			
					);	
					return false;
				}, 
				hover : function(event){
					if(!instance._animating){
						$(event.currentTarget).toggleClass(classes.monthHovered);
					}
				}
			});
		
			
			$yearSelector.delegate("a", {
				click : function(event){
					$yearSelector.find("."+classes.yearSelected).removeClass(classes.yearSelected);
					var tempDate = instance._temp,
						$a = $(event.currentTarget).addClass(classes.yearSelected);					
						
					tempDate.setYear($a.text());				
					instance._selectedDate = instance._temp = tempDate;					
					instance._currentPage--;
					instance._generateCalendar($group, tempDate);
					instance._animateOut(
						$yearSelector,							
						$monthSelector,
						monthSelectorWidth,
						monthSelectorHeight,
						monthfontSizeValue,					
						$a					
					);	
					return false;
				}, 
				hover : function(event){
					if(!instance._animating){
						$(event.currentTarget).toggleClass(classes.yearHovered);
					}
				}
			});
			
			$decadeSelector.delegate("a", {
				click : function(event){
					$decadeSelector.find("."+classes.decadeSelected).removeClass(classes.decadeSelected);
					var tempDate = instance._temp,
						$a = $(event.currentTarget).addClass(classes.decadeSelected);					
						
					tempDate.setYear(parseInt($a.text().split("-")[0]) + tempDate.getFullYear() % 10);				
					instance._selectedDate = instance._temp = tempDate;					
					instance._currentPage--;
					instance._generateCalendar($group, tempDate);
					instance._animateOut(
						$decadeSelector,							
						$yearSelector,
						yearSelectorWidth,
						yearSelectorHeight,
						yearfontSizeValue,					
						$a					
					);	
					return false;
				}, 
				hover : function(event){
					if(!instance._animating){
						$(event.currentTarget).toggleClass(classes.decadeHovered);
					}
				}
			});
			
			$this.find("." + classes.title).bind("click", function(event){
				var currentPage = instance._currentPage;
				if (currentPage != 3) {
					
					var tempDate = instance.selectedDate;
					instance._currentPage++;
					instance._generateCalendar($group, tempDate);
					
					if (currentPage == 0) {					
						instance._animateIn(
							$dateSelector,							
							$monthSelectorTable,
							$monthSelector.show().find("td:contains('" + $iq.formats[options.monthsFormat][tempDate.getMonth()] + "')"),
							$monthSelector.position(),3,4
						);
					}
					else if(currentPage == 1){
						instance._animateIn(
							$monthSelector,							
							$yearSelectorTable,
							$yearSelector.show().find("td:contains('" + tempDate.getFullYear() + "')"),
							$yearSelector.position(),3, 4
						);
					}
					else if(currentPage == 2){
						var decade = getDecadeStart(tempDate.getFullYear());
						
						instance._animateIn(
							$yearSelector,							
							$decadeSelectorTable,
							$decadeSelector.show().find("td:contains('" + decade + "- " + (decade + 9) + "')"),
							$decadeSelector.position(),3, 4
						);
					}
				}
				return false;
			});
			
			$this.find("."+classes.next).click(function(){
				$dateSelector.stop(false, true);
				
				instance._temp = instance.selectedDate = getNextMonth(instance.selectedDate);
			 	var $dateSelectorTable = $dateSelector.find("table"),
					tableWidth = Math.ceil($dateSelectorTable.outerWidth(true)),
					tableHeight = Math.ceil($dateSelectorTable.outerHeight(true)),
					$nextTable = $("<table cellpadding='0' cellspacing='0'><thead /><tbody /></table>").insertAfter($dateSelectorTable);
				$dateSelector.width(tableWidth*2);
				$dateSelector.height(tableHeight);
				//$dateSelector.parent().width(tableWidth);
				instance._generateDaySelectors($nextTable , instance.selectedDate);
				
				var endOffset = $nextTable.offset(),
					startMarginTop = parseInt($dateSelector.css("marginTop")) || 0,
					startMarginLeft = parseInt($dateSelector.css("marginLeft")) || 0,
					startOffset = $dateSelectorTable.offset();
					
				$dateSelector.animate({
					marginTop: (startMarginTop + startOffset.top - endOffset.top),
					marginLeft: (startMarginLeft + startOffset.left - endOffset.left)
				}, {
					duration: options.slideDuration,
					easing: options.slideEasing,
					complete : function(){
						$dateSelector.css({
							width : "",
							height : "",
							marginLeft : startMarginLeft,
							marginTop : startMarginTop
						});
						$dateSelector.parent().css("width","");				
						$dateSelectorTable.remove();
						instance._generateCalendar($group, instance.selectedDate);
					}
				});
						
				return false;
			});
			
			$this.find("."+classes.previous).click(function(){
				$dateSelector.stop(false, true);
				
				instance._temp = instance.selectedDate = getPreviousMonth(instance.selectedDate);
			 	var $dateSelectorTable = $dateSelector.find("table"),
					tableWidth = Math.ceil($dateSelectorTable.outerWidth(true)),
					tableHeight = Math.ceil($dateSelectorTable.outerHeight(true)),
					$nextTable = $("<table cellpadding='0' cellspacing='0'><thead /><tbody /></table>").insertBefore($dateSelectorTable);
				$dateSelector.width(tableWidth*2);
				$dateSelector.height(tableHeight);
				$dateSelector.parent().width(tableWidth);
				instance._generateDaySelectors($nextTable , instance.selectedDate);
				
				var endOffset = $dateSelectorTable.offset(),
					startMarginTop = parseInt($dateSelector.css("marginTop")) || 0,
					startMarginLeft = parseInt($dateSelector.css("marginLeft")) || 0,
					startOffset = $dateSelector.offset();
				
				$dateSelector.css({
					marginTop: (startMarginTop + startOffset.top - endOffset.top),
					marginLeft: (startMarginLeft + startOffset.left - endOffset.left)
				}).animate({
					marginTop : startMarginTop,
					marginLeft: startMarginLeft 
				}, {
					duration: options.duration,
					easing: options.easing,
					complete : function(){
						$dateSelector.css({
							width : "",
							height : "",
							marginLeft : startMarginLeft,
							marginTop : startMarginTop
						});
						$dateSelector.parent().css("width","");				
						$dateSelectorTable.remove();
						instance._generateCalendar($group, instance.selectedDate);
					}
				});
						
				return false;
			});
        }
    });


    classes = $iq.calendar.classes = {
        container: 'iq-calendar',

        header: 'iq-calendar-header',
        previous: 'iq-calendar-previous',
        next: 'iq-calendar-next',
        title: 'iq-calendar-title',

        group: 'iq-calendar-group',
        selectors: 'iq-calendar-selectors',
		selectorsAnimate: 'iq-calendar-selectors-animate',

        today: 'iq-calendar-today',
        daySelectors: 'iq-calendar-day-selectors',
        daySelected: 'iq-calendar-day-selected',
        daysPrevMonth: 'iq-calendar-days-prev-month',
        daysNextMonth: 'iq-calendar-days-next-month',
        daysCurrentMonth: 'iq-calendar-days-current-month',
        dayHovered: 'iq-calendar-day-hovered',

        monthSelectors: 'iq-calendar-month-selectors',
        monthSelected: 'iq-calendar-month-selected',
        monthHovered: 'iq-calendar-month-hovered',
        monthsCurrentYear: 'iq-calendar-months-current-year',

        yearSelectors: 'iq-calendar-year-selectors',
        yearSelected: 'iq-calendar-year-selected',
        yearsPrevDecade: 'iq-calendar-years-prev-decade',
        yearsNextDecade: 'iq-calendar-years-next-decade',
        yearsCurrentDecade: 'iq-calendar-years-current-decade',
        yearHovered: 'iq-calendar-year-hovered',

        decadeSelectors: 'iq-calendar-decade-selectors',
        decadeSelected: 'iq-calendar-decade-selected',
        decadeHovered: 'iq-calendar-decade-hovered',
        decadesPrevCentury: 'iq-calendar-decades-prev-century',
        decadesNextCentury: 'iq-calendar-decades-prev-century',
        decadesCurrentCentury: 'iq-calendar-decades-current-century',

        clearFloat: 'iq-clear'
    }

    function getDecadeStart(year) {
        return Math.floor(year / 10) * 10;
    }
    function getCenturyStart(year) {
        return Math.floor(year / 100) * 100;
    }
    function getNextCentury(date) {
        date.setYear(getCenturyStart(date.getFullYear() + 100));
        return date;
    }
    function getPreviousCentury(date) {
        date.setYear(getCenturyStart(date.getFullYear() - 100));
        return date;
    }
    function getNextDecade(date) {
        date.setYear(getDecadeStart(date.getFullYear() + 10));
        return date;
    }
    function getPreviousDecade(date) {
        date.setYear(getDecadeStart(date.getFullYear() - 10));
        return date;
    }
    function getNextYear(date) {
        date.setYear(date.getFullYear() + 1);
        return date;
    }
    function getPreviousYear(date) {
        date.setYear(date.getFullYear() - 1);
        return date;
    }
    function getNextMonth(date) {
        date.setMonth(date.getMonth() + 1);
        return date;
    }
    function getPreviousMonth(date) {
        date.setMonth(date.getMonth() - 1);
        return date;
    }
    function isLeapYear(year) {
        return year % 4 == 0 ? year % 100 == 0 && year % 400 != 0 ? false : true : false;
    }

})(jQuery);(function ($, undefined) {
    var $iq = $.iq,
        classes, templates, sections, $iqColorNames,
        $iqColor = $.iq.color = {
            getAll: function (color) {
                var hex, rgb, hsl, hsv;
                if (color) {
                    if (typeof (color) == 'string') {
                        hex = "#" + color.replace("#", "");
                        rgb = $iqColor.hex2rgb(color);
                        hsl = $iqColor.rgb2hsl(rgb);
                        hsv = $iqColor.hsl2hsv(hsl);
                    }
                    else if (color.r != undefined) {
                        rgb = { r: parseInt(color.r), g: parseInt(color.g), b: parseInt(color.b) };
                        hex = $iqColor.rgb2hex(rgb);
                        hsl = $iqColor.rgb2hsl(rgb);
                        hsv = $iqColor.hsl2hsv(hsl);
                    }
                    else if (color.l != undefined) {
                        hsl = { h: parseInt(color.h), s: parseInt(color.s), l: parseInt(color.l) };
                        rgb = $iqColor.hsl2rgb(hsl);
                        hsv = $iqColor.hsl2hsv(hsl);
                        hex = $iqColor.rgb2hex(rgb);

                    }
                    else if (color.v != undefined) {
                        hsv = { h: parseInt(color.h), s: parseInt(color.s), v: parseInt(color.v) };
                        hsl = $iqColor.hsv2hsl(hsv);
                        rgb = $iqColor.hsl2rgb(hsl);
                        hex = $iqColor.rgb2hex(rgb);
                    }
                }

                return {
                    hex: hex.toUpperCase(),
                    rgb: rgb,
                    hsl: hsl,
                    hsv: hsv
                }
            },
            hex2rgb: function (hex) {
                hex = hex.replace('#', '');
                return { r: parseInt(hex.substr(0, 2), 16), g: parseInt(hex.substr(2, 2), 16), b: parseInt(hex.substr(4, 2), 16) };
            },
            hex2hsl: function (hex) {
                return $iqColor.rgb2hsl($iqColor.hex2rgb(hex.replace('#', '')));
            },
            hex2hsv: function (hex) {
                return $iqColor.hsl2hsv($iqColor.hex2hsl(hex.replace('#', '')));
            },
            hsv2hex: function (hsv) {
                return $iqColor.rgb2hex($iqColor.hsl2rgb($iqColor.hsv2hsl(hsv)));
            },
            rgb2hex: function (rgb) {
                var r = parseInt(rgb.r),
                    g = parseInt(rgb.g),
                    b = parseInt(rgb.b);
                return "#" + (r > 15 ? "" : "0") + r.toString(16) + (g > 15 ? "" : "0") + g.toString(16) + (b > 15 ? "" : "0") + b.toString(16);
            },
            rgb2hsl: function (rgb) {
                var r = rgb.r / 255,
                    g = rgb.g / 255,
                    b = rgb.b / 255,
                    min = Math.min(Math.min(b, g), r),
                    max = Math.max(Math.max(r, g), b),
                    d = max - min,
                    s = 0,
                    l = (max + min) / 2,
                    h = 0;
                if (d) {
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    switch (max) {
                        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                        case g: h = (b - r) / d + 2; break;
                        case b: h = (r - g) / d + 4; break;
                    }
                    h /= 6;
                }
                h = Math.round(h * 360);
                if (h == 360)
                    h = 0;
                return { h: h, s: Math.round(s * 100), 'l': Math.round(l * 100) };
            },
            hsl2rgb: function (hsl) {
                var h = hsl.h / 360,
                    s = hsl.s / 100,
                    l = hsl.l / 100,
                    r, g, b, p, q,
                    hue2rgb = function (P, Q, T) {
                        if (0 > T) (T += 1);
                        if (1 < T) (T -= 1);
                        return T < 1 / 6 ? P + 6 * (Q - P) * T : 0.5 > T ? Q : T < 2 / 3 ? P + 6 * (Q - P) * (2 / 3 - T) : p;
                    };

                if (s == 0) {
                    r = g = b = l;
                } else {
                    q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                    p = 2 * l - q;

                    r = hue2rgb(p, q, h + 1 / 3);
                    g = hue2rgb(p, q, h);
                    b = hue2rgb(p, q, h - 1 / 3);
                }
                return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
            },
            hsl2hsv: function (hsl) {
                var ll = hsl.l * 2 / 100,
                    ss = hsl.s * ((ll <= 1) ? ll : 2 - ll) / 100,
                    v = (ll + ss) / 2,
					s = (2 * ss) / (ll + ss);

                if (isNaN(s)) {
                    s = 0;
                }
                return { h: hsl.h, s: Math.round(s * 100), v: Math.round(v * 100) };
            },
            hsv2hsl: function (hsv) {
                var s = hsv.s / 100,
                    v = hsv.v / 100,
                    hh = hsv.h,
                    ll = (2 - s) * v,
                    ss = s * v / (1 >= ll ? ll : 2 - ll);
                ll /= 2;
                if (isNaN(ss))
                    ss = 0;
                return { 'h': hh, 's': Math.round(ss * 100), 'l': Math.round(ll * 100) };
            },
            getScheme: function (schemeType, hex) {
                return $iqColorSchemes[schemeType](hex);
            }

        },
        $iqColorNames = $iqColor.colorNames = {
            Maroon: "800000",
            Red: "ff0000",
            Orange: "ffA500",
            Yellow: "ffff00",
            Olive: "808000",
            Green: "008000",
            Purple: "800080",
            Fuchsia: "ff00ff",
            Lime: "00ff00",
            Teal: "008080",
            Aqua: "00ffff",
            Blue: "0000ff",
            Navy: "000080",
            Black: "000000",
            Gray: "808080",
            Silver: "c0c0c0",
            White: "ffffff"

        },
        $iqColorPalettes = $iqColor.palettes = {
            WebSafe: {
                css: 'iq-colorpicker-palette-websafe',
                rows: 6,
                cols: 36,
                display: 'Web safe colors',
                get: function () {
                    var safe = ["00", "33", "66", "99", "CC", "FF"], i, j, k, websafeColors = [], count = 0;
                    for (i = 6; i--; ) {
                        for (j = 6; j--; ) {
                            for (k = 6; k--; ) {
                                websafeColors[count++] = safe[i] + safe[j] + safe[k];
                            }
                        }
                    }
                    return websafeColors;
                }
            }
        },
        $iqColorSchemes = $iqColor.schemes = {
            Monochrome: {
                css: 'iq-colorpicker-scheme-monochrome',
                rows: 2,
                cols: 3,
                get: function (hex) {
                    var hsv = $iqColor.hex2hsv(hex.replace('#', '')),
                        hsv2hex = $iqColor.hsv2hex;
                    return [hsv2hex({ h: hsv.h, s: hsv.s / 2, v: 100 - (100 - hsv.v) / 2 }),
                         hsv2hex({ h: hsv.h, s: hsv.s, v: hsv.v * 0.7 }),
                         hsv2hex({ h: hsv.h, s: hsv.s / 4, v: 100 - (100 - hsv.v) / 4 }),
                         hsv2hex({ h: hsv.h, s: hsv.s * 2 / 3, v: hsv.v / 3 }),
                         hsv2hex({ h: hsv.h, s: hsv.s / 4, v: hsv.v - (hsv.v - 50) / 4 }),
                         hsv2hex({ h: hsv.h, s: hsv.s / 2, v: hsv.v - (hsv.v - 50) / 2 })];
                }
            },
            VaryingHue: {
                css: 'iq-colorpicker-scheme-varyinghue',
                rows: 2,
                display: 'Varying Hue',
                cols: 3,
                get: function (hex) {
                    var hsv = $iqColor.hex2hsv(hex.replace('#', '')),
                        hsv2hex = $iqColor.hsv2hex;
                    return [hsv2hex({ h: (hsv.h + 315) % 360, s: hsv.s, v: hsv.v }),
	                        hsv2hex({ h: (hsv.h + 270) % 360, s: hsv.s, v: hsv.v }),
	                        hsv2hex({ h: (hsv.h + 225) % 360, s: hsv.s, v: hsv.v }),
	                        hsv2hex({ h: (hsv.h + 180) % 360, s: hsv.s, v: hsv.v }),
	                        hsv2hex({ h: (hsv.h + 135) % 360, s: hsv.s, v: hsv.v }),
   	                        hsv2hex({ h: (hsv.h + 90) % 360, s: hsv.s, v: hsv.v })];
                }
            },
            ContrastPair: {
                css: 'iq-colorpicker-scheme-contrastpair',
                rows: 2,
                display: 'Contrast Pair',
                cols: 3,
                get: function (hex) {
                    var hsv = $iqColor.hex2hsv(hex.replace('#', '')),
                        hsv2hex = $iqColor.hsv2hex;
                    return [hsv2hex({ h: (hsv.h + 0) % 360, s: hsv.s, v: hsv.v }),
	                       hsv2hex({ h: (hsv.h + 30) % 360, s: hsv.s, v: hsv.v }),
	                       hsv2hex({ h: (hsv.h + 330) % 360, s: hsv.s, v: hsv.v }),
	                       hsv2hex({ h: (hsv.h + 180) % 360, s: hsv.s, v: hsv.v }),
	                       hsv2hex({ h: (hsv.h + 210) % 360, s: hsv.s, v: hsv.v }),
   	                       hsv2hex({ h: (hsv.h + 150) % 360, s: hsv.s, v: hsv.v })];
                }
            },
            Pentadic: {
                css: 'iq-colorpicker-scheme-pentadic',
                rows: 2,
                cols: 3,
                get: function (hex) {
                    var hsv = $iqColor.hex2hsv(hex.replace('#', '')),
                        hsv2hex = $iqColor.hsv2hex;
                    return [hsv2hex({ h: (hsv.h + 0) % 360, s: hsv.s, v: hsv.v }),
	                       hsv2hex({ h: (hsv.h + 288) % 360, s: hsv.s, v: hsv.v }),
	                       hsv2hex({ h: (hsv.h + 216) % 360, s: hsv.s, v: hsv.v }),
	                       hsv2hex({ h: (hsv.h + 144) % 360, s: hsv.s, v: hsv.v }),
	                       hsv2hex({ h: (hsv.h + 72) % 360, s: hsv.s, v: hsv.v })];
                }
            }
        };


    $iq.plugin("colorpicker", {
        options: {
            offsetCircle: { x1: -4, y1: -4, x2: 4, y2: 5 },
            offsetTriangle: { y1: -3, y2: 5 },
            mode: "FullCompact",
            defaultColor: "#FF0000",

            changing: $iq.ret1,
            changed: $iq.ret1
        },
        _previous: null,
        _color: null,
        _previous: null,
        _gradientBG: null,
        eventPrefix: "color",
        get: function () {
            return this._color;
        },

        set: function (color) {
            this._set(color, false, true, true);
        },
        _set: function (color, triggerEvent, updateCircle, updateTriangle) {
            var instance = this,
                $this = instance.element,
                colors = $iqColor.getAll(color),
                inputs = instance._inputs,
                hsl, rgb, hsv, hex, eventObj;

            triggerEvent = triggerEvent === undefined || triggerEvent !== false;

            if (colors.hex) {
                eventObj = $.Event();
                //if (!triggerEvent || instance._trigger("changing", eventObj, { newValue: colors, oldValue: instance._color })) {

                rgb = colors.rgb;
                hsl = colors.hsl;
                hsv = colors.hsv;

                inputs.rgbR.val(rgb.r);
                inputs.rgbG.val(rgb.g);
                inputs.rgbB.val(rgb.b);

                inputs.hslH.val(hsl.h);
                inputs.hslS.val(hsl.s);
                inputs.hslL.val(hsl.l);

                inputs.hsbH.val(hsv.h);
                inputs.hsbS.val(hsv.s);
                inputs.hsbB.val(hsv.v);

                hex = colors.hex.replace("#", "").toUpperCase();

                inputs.hex.val(hex);
                inputs.preview.css("background", colors.hex).attr('title', "#" + hex);

                inputs.colorNames.attr('selectedIndex', -1);
                inputs.colorNames.val(hex);

                inputs.gradient.css("background-color", $iqColor.rgb2hex($iqColor.hsl2rgb({ h: hsl.h, s: hsl.s, l: 50 })));
                instance._template.updateSelectors($this, instance.options, colors, updateCircle, updateTriangle);

                if (triggerEvent) {
                    instance._trigger("changed", eventObj, { newValue: colors, oldValue: instance._color });
                }

                instance._previous = $.extend({}, instance._color);
                instance._color = colors;
                //}
            }
        },

        eventPrefix: "color",

        _init: function () {
			
            var instance = this,
                options = instance.options,
                $this = instance.element.addClass(classes.container),
                templateName = options.mode,
                selectedTemplate = instance._template = templates[templateName],
                $template = $(selectedTemplate.template).appendTo($this.empty()),
                $inputsTable = $this.find(".iq-colorpicker-inputs"),
                inputs;

            selectedTemplate.init($this, options);
            inputs = instance._inputs = {
                rgbR: $this.find("." + classes.rgbR).restrictText({ filter: /^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$/ }),
                rgbG: $this.find("." + classes.rgbG).restrictText({ filter: /^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$/ }),
                rgbB: $this.find("." + classes.rgbB).restrictText({ filter: /^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$/ }),

                hslH: $this.find("." + classes.hslH).restrictText({ filter: /^([012]?[0-9]?[0-9]|3[0-5][0-9])$/ }),
                hslS: $this.find("." + classes.hslS).restrictText({ filter: /^([0]?[0-9]?[0-9]|100)$/ }),
                hslL: $this.find("." + classes.hslL).restrictText({ filter: /^([0]?[0-9]?[0-9]|100)$/ }),

                hsbH: $this.find("." + classes.hsbH).restrictText({ filter: /^([012]?[0-9]?[0-9]|3[0-5][0-9])$/ }),
                hsbS: $this.find("." + classes.hsbS).restrictText({ filter: /^([0]?[0-9]?[0-9]|100)$/ }),
                hsbB: $this.find("." + classes.hsbB).restrictText({ filter: /^([0]?[0-9]?[0-9]|100)$/ }),

                hex: $this.find("." + classes.hex).restrictText({ filter: 'hex' }),
                colorNames: $this.find("." + classes.colorNames),

                gradient: $this.find("." + classes.lightnessGradient),
                preview: $this.find("." + classes.preview)
            };

            $inputsTable.delegate("input", "change", function (event) {
                var $current = $(this);
                if (!$current.val()) {
                    $current.val("0");
                }
                if ($current.is("." + classes.rgbR + ",." + classes.rgbG + ",." + classes.rgbB)) {
                    instance._set({ r: inputs.rgbR.val(), g: inputs.rgbG.val(), b: inputs.rgbB.val() });
                }
                else if ($current.is("." + classes.hslH + ",." + classes.hslS + ",." + classes.hslL)) {
                    instance._set({ h: inputs.hslH.val(), s: inputs.hslS.val(), l: inputs.hslL.val() });
                }
                else if ($current.is("." + classes.hsbH + ",." + classes.hsbS + ",." + classes.hsbB)) {
                    instance._set({ h: inputs.hsbH.val(), s: inputs.hsbS.val(), v: inputs.hsbB.val() });
                }
            });

            inputs.hex.change(function () {
                var $current = $(this),
                    val = $current.val();
                if (!val || val.length < 6) {
                    $current.val(val = options.defaultColor);
                }
                instance._set(val);
            });

            $this.find("." + classes.select).click(function (event) {
                sections.recent.add($this, options, instance._color.hex);
                instance._trigger("select", event, { selectedValue: instance._color });
            });

            $this.find("." + classes.cancel).click(function (event) {
                if (instance._previous) {
                    instance._set(instance._previous.hex, false)
                }
                instance._trigger("cancel", event, { selectedValue: instance._color });
            });

            instance._set(options.defaultColor, false);
        }
    });


    classes = $iq.colorpicker.classes = {
        container: 'iq-colorpicker',
        spectrum: 'iq-colorpicker-spectrum',
        colorGradient: 'iq-colorpicker-color-gradient',
        lightnessGradient: 'iq-colorpicker-lightness-gradient',

        circle: 'iq-colorpicker-circle',
        triangle: 'iq-colorpicker-triangle',

        selectPanel: 'iq-colorpicker-select-panel',

        inputs: 'iq-colorpicker-inputs',
        inputTd: 'iq-colorpicker-input-td',

        rgbR: 'iq-colorpicker-rgbR',
        rgbG: 'iq-colorpicker-rgbG',
        rgbB: 'iq-colorpicker-rgbB',

        hslH: 'iq-colorpicker-hslH',
        hslS: 'iq-colorpicker-hslS',
        hslL: 'iq-colorpicker-hslL',

        hsbH: 'iq-colorpicker-hsbH',
        hsbS: 'iq-colorpicker-hsbS',
        hsbB: 'iq-colorpicker-hsbB',

        hex: 'iq-colorpicker-hex',
        preview: 'iq-colorpicker-preview',
        previewBg: 'iq-colorpicker-preview-bg',
        previewBgEnabled: 'iq-colorpicker-preview-bg-enabled',
        colorNames: 'iq-colorpicker-color-names',

        schemeSelect: 'iq-colorpicker-scheme-select',
        schemeColors: 'iq-colorpicker-scheme-colors',

        paletteSelect: 'iq-colorpicker-palette-select',
        paletteColors: 'iq-colorpicker-palette-colors',

        select: 'iq-colorpicker-select',
        cancel: 'iq-colorpicker-cancel'
    };

    sections = $iq.colorpicker.sections = {
        picker: {
            template: "<div>" +
                    "<div class='" + classes.spectrum + "'>" +
                        "<span class='" + classes.colorGradient + "'><span class='" + classes.circle + "'/></span>" +
                        "<span class='" + classes.lightnessGradient + "'><span class='" + classes.triangle + "'/></span>" +
                    "</div>" +
                    "<div class='" + classes.selectPanel + "'>" +
                        "<table cellpadding='0' cellspacing='0'>" +
                            "<tr>" +
                                "<td rowspan='3'>" +
                                    "<table class='" + classes.inputs + "' cellspacing='0' cellpadding='0'>" +
                                        "<tbody>" +
                                            "<tr>" +
                                                "<td>R</td>" +
                                                "<td class='" + classes.inputTd + "'><input type='text' class='" + classes.rgbR + "'/></td>" +
                                                "<td>G</td>" +
                                                "<td class='" + classes.inputTd + "'><input type='text' class='" + classes.rgbG + "'/></td>" +
                                                "<td>B</td>" +
                                                "<td class='" + classes.inputTd + "'><input type='text' class='" + classes.rgbB + "'/></td>" +
                                            "</tr>" +
                                            "<tr>" +
                                                "<td>H</td>" +
                                                "<td class='" + classes.inputTd + "'><input type='text' class='" + classes.hslH + "'/> &deg;</td>" +
                                                "<td>S</td>" +
                                                "<td class='" + classes.inputTd + "'><input type='text' class='" + classes.hslS + "'/> %</td>" +
                                                "<td>L/I</td>" +
                                                "<td class='" + classes.inputTd + "'><input type='text' class='" + classes.hslL + "'/> %</td>" +
                                            "</tr>" +
                                            "<tr>" +
                                                "<td>H</td>" +
                                                "<td class='" + classes.inputTd + "'><input type='text' class='" + classes.hsbH + "'/> &deg;</td>" +
                                                "<td>S</td>" +
                                                "<td class='" + classes.inputTd + "'><input type='text' class='" + classes.hsbS + "'/> %</td>" +
                                                "<td>V/B</td>" +
                                                "<td class='" + classes.inputTd + "'><input type='text' class='" + classes.hsbB + "'/> %</td>" +
                                            "</tr>" +
                                        "</tbody>" +
                                    "</table>" +
                                "</td>" +
                                "<td>#</td>" +
                                "<td><input class='" + classes.hex + "'type='text'/></td>" +
                                "<td><select class='" + classes.colorNames + "'/> " +
                            "</tr>" +
                            "<tr>" +
                                "<td rowspan='2'></td>" +
                                "<td rowspan='2'><div class='" + classes.previewBg + "'><div class='" + classes.preview + "'/></div></td>" +
                                "<td><input class='" + classes.select + "'type='button' value='Select'/></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td><input class='" + classes.cancel + "' type='button' value='Cancel'/></td>" +
                            "</tr>" +
                        "</table>" +
                    "</div>" +
                "</div>",
            init: function ($this, options) {
                var $colorNameSelect = $this.find("." + classes.colorNames), optionsHtml = "";

                $.each($iqColorNames, function (key, value) {
                    optionsHtml += "<option value='" + value.toUpperCase() + "'>" + key + "</option>";
                });
                $colorNameSelect.html(optionsHtml).change(function () {
                    var val = $colorNameSelect.val();
                    if (val) {
                        $iq.colorpicker.prototype._set.call($this.data("iq-colorpicker"), "#" + val);
                    }
                });

                $this.find("." + classes.colorGradient).click(function (event) {
                    var $circle = $this.find("." + classes.circle),
                        elemPosition = $(this).offset();
                    $iq.colorpicker.prototype._set.call($this.data("iq-colorpicker"), {
                        h: event.pageX - elemPosition.left - Math.floor($circle.outerWidth() / 2) - options.offsetCircle.x1,
                        s: 100 - event.pageY + elemPosition.top + Math.floor($circle.outerHeight() / 2) + options.offsetCircle.y1,
                        l: $this.colorpicker("get").hsl.l
                    }, true, true, false);
                });
                $this.find("." + classes.lightnessGradient).click(function (event) {
                    var hsl = $this.colorpicker("get").hsl;

                    $iq.colorpicker.prototype._set.call($this.data("iq-colorpicker"), {
                        h: hsl.h,
                        s: hsl.s,
                        l: 100 - event.pageY + $(this).offset().top + Math.floor($this.find("." + classes.triangle).outerHeight() / 2) + options.offsetTriangle.y1
                    }, true, false, true);

                });

                $this.find("." + classes.circle).movable({
                    offset: options.offsetCircle,
                    moving: function (event, eventData) {						
                        var current = eventData.current;

                        $iq.colorpicker.prototype._set.call($this.data("iq-colorpicker"), {
                            h: current.left - eventData.offset.x1,
                            s: 100 - current.top + eventData.offset.y1,
                            l: $this.colorpicker("get").hsl.l
                        }, true, false, false);
                    }
                });
                $this.find("." + classes.triangle).movable({
                    axis: 'y',
                    offset: options.offsetTriangle,
                    moving: function (event, eventData) {
                        var current = eventData.current,
                            hsl = $this.colorpicker("get").hsl;

                        $iq.colorpicker.prototype._set.call($this.data("iq-colorpicker"), {
                            h: hsl.h,
                            s: hsl.s,
                            l: 100 - current.top + eventData.offset.y1
                        }, true, false, false);
                    }
                });
            }
        },
        schemes: {
            template: "<div class='iq-colorpicker-schemes'>" +
							"<div class='iq-colorpicker-scheme-select-panel'>"+
								"<span class='iq-colorpicker-scheme-select-text'>Select Scheme</span>" +
								"<select class='" + classes.schemeSelect + "'/>" +
                            "</div>" +
							"<div class='iq-colorpicker-scheme-colors-panel'>"+
								"<div class='iq-colorpicker-current'>" +
									"<div><input type='text' class='iq-colorpicker-current-hex' readonly='readonly'/></div>" +
									"<div class='iq-colorpicker-current-color'/>" +
								"</div>" +
								"<div class='iq-colorpicker-schemes-wrapper'>" +
									"<table class='" + classes.schemeColors + "' cellspacing='0' cellpadding='0'></table>" +
								"</div>" +
							"</div>"+
                       "</div>",
            refresh: function ($this, options) {
                var colorTds = "",
                    selectedValue = $this.find("." + classes.schemeSelect).val(),
                    colors = $this.colorpicker("get"), hex;
                if (selectedValue) {
                    var colorScheme = $iqColorSchemes[selectedValue],
                        $schemeColors = $this.find("." + classes.schemeColors),
                        $tds, colors, $td, schemeColors;

                    for (var i = colorScheme.rows; i--; ) {
                        colorTds += "<tr>";
                        for (var j = colorScheme.cols; j--; ) {
                            colorTds += "<td><input type='text' readonly='readonly' class='iq-colorpicker-scheme-hex'/><a href='#' class='iq-colorpicker-scheme-color'/></td>";
                        }
                        colorTds += "</tr>";
                    }
                    $schemeColors.removeClass().addClass("iq-colorpicker-scheme-colors " + colorScheme.css).html(colorTds);
                    $tds = $schemeColors.find("td");

                    if (schemeColors = $iqColorSchemes[selectedValue].get(colors.hex)) {
                        $.each(schemeColors, function (index, value) {
                            $td = $tds.eq(index);
                            hex = value.replace("#", "").toUpperCase();
                            $td.find(".iq-colorpicker-scheme-hex").val(hex);
                            $td.find(".iq-colorpicker-scheme-color").css("background", value).attr('title', "#" + hex);
                        });
                    }
                }

                hex = colors.hex.replace("#", "").toUpperCase();

                $this.find(".iq-colorpicker-current-hex").val(hex);
                $this.find(".iq-colorpicker-current-color").css("background", colors.hex).attr('title', "#" + hex);

            },
            init: function ($this, options) {
                var optionsHtml = "";

                $.each($iqColorSchemes, function (key, value) {
                    optionsHtml += "<option value='" + key + "'>" + (value.display || key) + "</option>";
                })

                $this.find("." + classes.schemeSelect).change(function () {
                    sections.schemes.refresh($this, options);
                }).html(optionsHtml);

                $this.delegate(".iq-colorpicker-scheme-color", "click", function () {
                    $this.colorpicker('set', $(this).attr('title'));
                    $this.tabs('selectTab', 0);
                    return false;
                });
            }
        },
        palettes: {
            template: "<div class='iq-colorpicker-palettes'><div class='iq-colorpicker-palettes-wrapper'>" +
                            "<select class='" + classes.paletteSelect + "'/>" +
                            "<table class='" + classes.paletteColors + "' cellspacing='0' cellpadding='0'></table>" +
                        "</div></div>",
            refresh: function ($this, option) {
                var colorTds = "",
                    selectedValue = $this.find("." + classes.paletteSelect).val();
                if (selectedValue) {
                    var colorPalette = $iqColorPalettes[selectedValue],
                        $paletteColors = $this.find("." + classes.paletteColors),
                        $tds, paletteColors;

                    for (var i = colorPalette.rows; i--; ) {
                        colorTds += "<tr>";
                        for (var j = colorPalette.cols; j--; ) {
                            colorTds += "<td><a href='#' class='iq-colorpicker-palette-color'/></td>";
                        }
                        colorTds += "</tr>";
                    }
                    $paletteColors.removeClass().addClass("iq-colorpicker-palette-colors " + colorPalette.css).html(colorTds);
                    $tds = $paletteColors.find("a");

                    if (paletteColors = $iqColorPalettes[selectedValue].get()) {
                        $.each(paletteColors, function (index, value) {
                            $tds.eq(index).css("background", "#" + value).attr('title', "#" + value);
                        });
                    }
                }
            },
            init: function ($this, options) {
                var optionsHtml = "";

                $.each($iqColorPalettes, function (key, value) {
                    optionsHtml += "<option value='" + key + "'>" + (value.display || key) + "</option>";
                });
                $this.find("." + classes.paletteSelect).change(function () {
                    sections.palettes.refresh($this, options);
                }).html(optionsHtml);

                $this.delegate(".iq-colorpicker-palette-color", "click", function () {
                    $this.colorpicker('set', $(this).attr('title'));
                    $this.tabs('selectTab', 0);
                    return false;
                });
            }
        },
        recent: {
            rows: 6,
            cols: 6,
            template: "<div class='iq-colorpicker-recent'><div class='iq-colorpicker-recent-wrapper'>" +
                            "<table class='iq-colorpicker-recent-colors' cellspacing='0' cellpadding='0'></table>" +
                        "</div></div>",
            _selectedIndex: 0,
            _select: function ($this, newIndex) {
                var recent = sections.recent,
                    $recentColors = $this.find(".iq-colorpicker-recent-color");
                if (newIndex == (recent.rows * recent.cols)) {
                    newIndex = 0;
                }
                $recentColors.eq(recent._selectedIndex).removeClass("iq-colorpicker-recent-color-selected");
                $recentColors.eq(recent._selectedIndex = newIndex).addClass("iq-colorpicker-recent-color-selected")
            },
            add: function ($this, options, hex) {
                var recent = sections.recent,
                    $recentColors = $this.find(".iq-colorpicker-recent-color"),
                    colorList = [], color;
                hex = hex.toUpperCase();
                $recentColors.eq(recent._selectedIndex).css("background", hex).attr('title', hex);
                recent._select($this, recent._selectedIndex + 1);

                if ($.cookie && $.cookie.set) {
                    $recentColors.each(function () {
                        if (color = $(this).attr('title')) {
                            colorList.push(color);
                        }
                    });
                    $.cookie.set("iq-colorpicker-recent-list", colorList, {}, { type: "json" });
                }
            },
            init: function ($this, options) {
                var tdHtml = "", i, j,
                    recent = sections.recent,
                    colorList, color;
                for (i = sections.recent.rows; i--; ) {
                    tdHtml += "<tr>";
                    for (j = sections.recent.cols; j--; ) {
                        tdHtml += "<td><a href='#' class='iq-colorpicker-recent-color'/></a></td>";
                    }
                    tdHtml += "</tr>";
                }

                recent._$currentSelected = $this.find(".iq-colorpicker-recent-colors").html(tdHtml).delegate("a", "click", function (event) {
                    var $a = $(event.currentTarget);
                    recent._select($this, recent.cols * $a.closest('tr').index() + $a.parent().index());
                    return false;
                }).delegate("a", "dblclick", function (event) {
                    $this.colorpicker('set', $(event.currentTarget).attr('title'));
                    $this.tabs('selectTab', 0);
                    return false;
                }).find("a:eq(0)").addClass("iq-colorpicker-recent-color-selected");

                if ($.cookie && $.cookie.get) {
                    colorList = $.cookie.get("iq-colorpicker-recent-list", {}, { type: "json" });
                    if (colorList) {
                        $this.find(".iq-colorpicker-recent-color").each(function (index) {
                            if (color = colorList[index]) {
                                $(this).css("background", color).attr('title', color);								
                            }
                        });						
						recent._select($this, colorList.length);
                    }
                }

            }
        }
    };

    templates = $iq.colorpicker.templates = {
        FullCompact: {
            css: "iq-colorpicker-full",
            template: "<div>" +
                            "<div>" +
                                sections.picker.template +
                                sections.schemes.template +
                                sections.palettes.template +
                                sections.recent.template +
                            "</div>" +
                        "</div>" +
                        "<div>" +
                            "<ul>" +
                                "<li><a href='#'>Color Picker</a></li>" +
                                "<li><a href='#'>Schemes</a></li>" +
                                "<li><a href='#'>Palletes</a></li>" +
                                "<li><a href='#'>Recent Picks</a></li>" +
                            "</ul>" +
                        "</div>",
            init: function ($this, options) {
                $this.addClass("iq-colorpicker-full-compact").tabs({
                    orientation: "HorizontalBottom",
                    tabstrip: ">div:eq(1)",
                    multiview: ">div:eq(0)",
                    selected: function (event, data) {
                        sections.schemes.refresh($this, options);
                        sections.palettes.refresh($this, options);
                    }
                });

                sections.picker.init($this, options);
                sections.schemes.init($this, options);
                sections.palettes.init($this, options);
                sections.recent.init($this, options);
            },
            updateSelectors: function ($this, options, colors, updateCircle, updateTriangle) {
                var hsl = colors.hsl;
                if (updateCircle === undefined || updateCircle !== false) {
                    $this.find("." + classes.circle).css({
                        left: hsl.h + options.offsetCircle.x1,
                        top: 100 - hsl.s + options.offsetCircle.y1
                    });
                }
                if (updateTriangle === undefined || updateTriangle !== false) {
                    $this.find("." + classes.triangle).css('top', 100 + options.offsetTriangle.y1 - hsl.l);
                }
            }
        }
    };


})(jQuery);(function ($, undefined) {
    var $iq = $.iq,
        classes;


    $iq.plugin("combobox", {
        options: {
            readonly: true,
			parent: 'body'
        },
		_comboboxItems : null,
        _combobox: null,
        _onElement: "select",
        _tabIndex: -1,
        _data: null,
        _getData: function ($options, data) {
            var instance = this,
                optGroup;
            $options.each(function () {
                var $option = $(this);
                if ($option.is("option")) {
                    data.push({ text: $option.attr('text'), value: $option.val() });
                }
                else if ($option.is("optgroup")) {
                    optGroup = { text: $option.attr('label'), data: [] }
                    data.push(optGroup);
                    instance._getData($option.children(), optGroup.data);
                }
            });
        },
        _renderOptions: function (data, isSub) {
            var instance = this,
                itemsHtml = "",
                itemClass = classes.item + (isSub ? (" " + classes.itemSub) : "");
            $.each(data, function (index, option) {
                if (option.data) {
                    itemsHtml += "<li class='" + classes.item + " " + classes.itemGroup + "'><span>" + option.text + "</span></li>";
                    itemsHtml += instance._renderOptions(option.data, true);
                }
                else {
                    itemsHtml += "<li class='" + itemClass + "'><a href='#' class='" + classes.itemAnchor + "'>" + option.text + "</a></li>";
                }
            });
            return itemsHtml;
        },
        _positionDropdown: function ($ul) {
            var instance = this,
                $combobox = instance._combobox,
                position = $.extend({
                    my: "left top",
                    at: "left bottom",
                    offset: { top: -1 },
                    of: $combobox
                }, instance.options.position || {}),
                comboboxWidth = $combobox.width();

            if ($ul.width() < comboboxWidth) {
                $ul.width(comboboxWidth);
            }
            $ul.position(position);
        },
        _renderSelect: function ($ul) {
            var instance = this,
                $this = instance.element,                
                $combobox = $this.parent(),
                itemsHtml = "",
                data = instance._data = [];

            instance._getData($this.children(), data);
            $ul.html(instance._renderOptions(data));

            

        },
        _closeDropdown: function () {
			var instance = this;
            instance._comboboxItems.hide().appendTo(instance._combobox.find("."+classes.inner));
            instance._isOpen = false;
        },
        _isOpen: false,
        _init: function () {
			
            var instance = this,
                $this = instance.element,
                options = instance.options,
                $combobox = $this.addClass(classes.select).wrap("<div class='" + classes.container + "'/>").parent(),
                width, $ul, $input;

            instance._combobox = $combobox.append("<div class='" + classes.wrapper + "'><div class='" + classes.inner + "'><input type='text' class='" + classes.input + "' tabindex='" + (instance._tabIndex = $this[0].tabIndex) + "'/><a href='#' tabindex='-1' class='" + classes.arrow + "'><span/></a><ul class='" + classes.items + "'/></div></div>");

            $this[0].tabIndex = -1;
			$input = $this.parent().find("." + classes.input);
            if (options.readonly) {
                $input.attr("readonly", "readonly");
            }
			$input.val($this.find("option:selected").text());

            width = $.trim($iq.curStyle($this, "width", { hide: true }));
            if (/[\d]+%/.test(width)) {
                $combobox.addClass("iq-combobox-block");
                // perform auto resize : bind("resize", function () {}); 
                if (width !== "100%") {
                    $combobox.css("width", width);
                }
            }
			
			instance._comboboxItems = $ul = $this.parent().find("." + classes.items);
            instance._renderSelect($ul);
			
			$ul.delegate("." + classes.itemAnchor, "click", function (event) {
				var currentItem = this
					value = $(currentItem).text();
				$combobox.find("." + classes.input).focus().val(value)				
				$this.find("option:eq("+$ul.find("."+ classes.item).index($(currentItem).closest("li")[0])+")").attr("selected","selected").change();				
				instance._closeDropdown();
                return false;
            }).delegate("." + classes.item, "hover", function (event) {
                $(this).toggleClass(classes.itemHover);
            });
			
            $combobox.bind("hover", function () {
                $(this).toggleClass(classes.inputHover);
            }).find("." + classes.input).bind({
                focus: function (event) {
                    $(this).parent().parent().parent().addClass(classes.inputFocus);
                },
                blur: function (event) {					
                    if (instance._isOpen) {
                        // Blur on textbox occurs before click on drop down items
                        // if no set time out, hiding the drop down will not trigger click event
                        setTimeout(function () {							
                            instance._closeDropdown();
                            instance._combobox.removeClass(classes.inputFocus);
                        }, 300);
                    }
                    else {
                        instance._combobox.removeClass(classes.inputFocus);
                    }
                }
            });

            $combobox.find("a." + classes.arrow).bind("click", function (event) {
                var $items = instance._comboboxItems;				
                if (instance._isOpen) {
                    $items.hide();
                    instance._isOpen = false;
                }
                else {					
                    $items.show().appendTo(options.parent);					
					$combobox.find("." + classes.input).focus();
					instance._positionDropdown($ul);
                    instance._isOpen = true;
                }
                return false;
            });
        }
    });


    classes = $iq.combobox.classes = {
        container: "iq-combobox",
        wrapper: "iq-combobox-wrapper",
        select: "iq-combobox-select",
        inner: "iq-combobox-inner-wrapper",

        input: "iq-combobox-input",
        arrow: "iq-combobox-arrow",
        items: "iq-combobox-items",
        item: "iq-combobox-item",
        itemSub: "iq-combobox-sub-item",
        itemHover: "iq-combobox-item-hover",
        itemFocus: "iq-combobox-item-focus",
        itemAnchor: "iq-combobox-item-anchor",
        itemGroup: "iq-combobox-item-group",

        inputHover: "iq-combobox-hover",
        inputFocus: "iq-combobox-focus"

    }

})(jQuery);(function ($, undefined) {
    var $iq = $.iq,
        classes;

    $iq.plugin("datepicker", {
        options: {
            triggerOnFocus: false,
            calendar: null,
            extendTextbox : true,
            dateFormat: 'dd-MM-yyyy'
        },
		$container : null,
        calendar: null,
        image: null,
        show: function () {
            var instance = this,
                $this = instance.element,
                position = $this.offset();
            instance.calendar.show().bind("clickoutside" + instance.eventSuffix, function (event) {
                if (event.target !== instance.element[0]) {
                    instance.hide();
                }
            }).position({
				my : 'left top',
				at : 'left bottom',				
				of : $container
			});
        },
        hide: function () {
            var instance = this;
            instance.calendar.hide().unbind("clickoutside" + instance.eventSuffix);
        },
        _init: function () {
            var instance = this,
				$this = instance.element,
				options = instance.options,
				trigger = options.trigger,
				$calendar;

            if (options.calendar) {
                $calendar = $(options.calendar);
            }		

            if (!$calendar) {
                $calendar = $("#iq-calendar");

                if (!$calendar.length)
                    $calendar = $("<div id='iq-calendar'/>").calendar();
            }

            instance.calendar = $calendar.appendTo("body").hide().bind("dateselected", function (event, eventData) {
                instance.element.val($iq.stringify(eventData.newDate, {
                    type: 'date',
                    format: options.dateFormat
                }));
                instance.hide();
            }).addClass(classes.calendar);

            if (options.triggerOnFocus) {
                $this.bind("focus", function () {
                    instance.show();
                });
            }

            if (options.extendTextbox) {
				$container = $this.textbox().parent().parent().addClass(classes.container);
                instance.image = $("<a href='#' class='" + classes.image + "'><span/></a>").insertAfter($this).bind("click",function () {
                    instance.show();
					return false;
                });
            }
			else {
				$container = $this;
			}
			
			

        }
    });


    classes = $iq.datepicker.classes = {
		container : 'iq-datepicker',
        image: 'iq-datepicker-icon',
		calendar: 'iq-datepicker-calendar'

    }

})(jQuery);(function ($) {
    var $iq = $.iq,
        classes;

    $iq.plugin("dialog", {
        options: {
            animate: true,
            animateOpen: true,
            animateSpeed: 'fast',
            autoResize: true,
            modal: false,
            showTopBar: true,
            autoOpen: false,
            closeOnOverlayClick: false,
            minWidth: 160,
            minHeight: 120,
            marginMaximized: 20,
            textClose: '',
            textMaximize: '',
            title: '',

            movable: false,
            resizable: false,
            allowClose: true,
            allowMaximize: false,
            allowMinimize: false,

            minimizing: $iq.ret1,
            maximizing: $iq.ret1,
            restoring: $iq.ret1,
            open: $iq.ret1,
            closing: $iq.ret1,
            close: $iq.ret1
        },
        eventPrefix: "dialog",
        state: "restored",
        _maximized: false,
        _overlay: null,
        _showOverlay: function () {
            var html = $('html')[0];
            this._overlay.appendTo("body").height(html.scrollHeight).width(html.scrollWidth);
        },
        _box: null,
        _maxHover: '',
        _minimize: function () {
            var instance = this,
				$this = instance.element.addClass(classes.minimized),
				$topBar = $this.find('.' + classes.topBar).one('click', function () {
				    $this.removeClass(classes.minimized);
				    return instance._changeState(1);
				}),
				height = $topBar.height();

            instance.state = "minimized";

            $this.animate({
                width: "100px",
                height: height + "px",
                top: $(window).height() - height - ($this.outerHeight() - $this.height()), left: 0
            }, instance.options.animateSpeed);
        },
        _maximize: function () {
            var instance = this,
				options = instance.options,
				$this = instance.element.addClass(classes.maximized),
				marginMaximized = options.marginMaximized;

            instance._maximized = true;
            instance.state = "maximized";
            instance._maxHover = classes.restoreHover;

            $this.animate({
                width: ($(window).width() - marginMaximized * 2) + "px",
                height: ($(window).height() - marginMaximized * 2) + "px",
                top: marginMaximized,
                left: marginMaximized
            }, instance.options.animateSpeed);

            $this.find('.' + classes.maximize).removeClass(classes.maximize + " " + classes.maximizeHover).addClass(classes.restore);
        },
        _restore: function ($this) {
            var instance = this,
				$this = instance.element.removeClass(classes.maximized);
            instance.state = "restored";
            instance._maxHover = classes.restoreHover;
            $this.animate(instance._box, instance.options.animateSpeed);
            $this.find('.' + classes.restore).removeClass(classes.restore + " " + classes.restoreHover).addClass(classes.maximize);
        },
        _changeState: function (state) {
            var instance = this,
				$this = instance.element.show(),
				currentState = instance.state,
				maximizedState = instance._maximized;
            if (currentState == "restored") {
                instance._box = {
                    left: $this.css('left'),
                    top: $this.css('top'),
                    width: $this.css('width'),
                    height: $this.css('height')
                };
            }

            if (currentState == "minimized") {
                if (state == 1 && maximizedState) {
                    instance._maximize();
                }
                else {
                    instance._restore();
                }
            }
            else if (state == 1) {
                instance._restore();
            }
            else if (state == 2) {
                instance._maximize();
            }
            else if (state == 0) {
                instance._maximized = maximizedState;
                instance._minimize();
            }

        },
        minimize: function () {
            this._changeState(0);
        },
        restore: function () {
            this._changeState(1);
        },
        maximize: function () {
            this._changeState(2);
        },
        close: function () {
            this.element.fadeOut();
            this._overlay.remove();
            //this.element.remove();
        },
        open: function (openOptions) {

            openOptions = openOptions || {};

            var instance = this,
				$this = instance.element,
				options = instance.options,
				cssProps = $this.cssX(["width", "height", "left", "top"]),
                positionOptions;

            if (options.modal) {
                instance._showOverlay();
            }

            if (openOptions.reset) {
                positionOptions = {
                    of: window
                };
                if (options.modal) {
                    positionOptions.fixed = true;
                }

                cssProps = $this.show().position(positionOptions).cssX(["width", "height", "left", "top"]);

                $this.css({ width: "0px", height: "0px" }).position(positionOptions);
            }

            $this.show().animate(cssProps, (openOptions.animate !== true && !options.animateOpen) ? 0 : options.animateSpeed, function () {
                if (options.modal) {
                    instance._showOverlay();
                }
            });
        },
        _init: function () {
			
            var instance = this,
				options = instance.options,
				$this = instance.element.addClass(classes.container),
				$content = $this.find(">div:eq(0)").addClass(classes.content),
				title, $topBar;

            instance._maxHover = classes.maximizeHover;

            if (options.showTopBar) {

                title = options.title || $this.attr('title');
                $topBar = $("<div class='" + classes.topBar + "'><div class='" + classes.title + "'>" + (title || "") + "</div><div class='" + classes.controllers + "' /></div>").prependTo($this);

                if (options.allowMinimize) {
                    $("<a href='#' class='" + classes.minimize + "' href='#'><span>" + (options.textMinimize || "") + "</span></a>")
						.appendTo($topBar.find("." + classes.controllers))
						.click(function (event) {
						    if (instance._trigger("minimizing", event)) {
						        instance._changeState(0);
						        instance._trigger("minimized", event);
						    }
						    return false;
						}).hoverClass(classes.minimizeHover);
                }

                if (options.allowMaximize) {
                    function restoreMaximize(event) {
                        var restored = instance.state == "restored";
                        if (instance._trigger(restored ? "maximizing" : "restoring", event)) {
                            instance._changeState(restored ? 2 : 1);
                            instance._trigger(restored ? "maximized" : "restored", event);
                        }
                        return false;
                    }
                    $("<a href='#' class='" + classes.maximize + "' href='#'><span>" + (options.textMaximize || "") + "</span></a>")
						.appendTo($topBar.find("." + classes.controllers))
						.click(restoreMaximize)
						.mouseover(function () {
						    $(this).addClass(instance._maxHover);
						}).mouseout(function () {
						    $(this).removeClass(instance._maxHover);
						});

                    $topBar.bind('dblclick', restoreMaximize);
                }

                if (options.allowClose) {
                    $("<a href='#' class='" + classes.close + "' href='#'><span>" + (options.textClose || "") + "</span></a>")
						.appendTo($topBar.find("." + classes.controllers))
						.bind('click', function (event) {
						    if (instance._trigger("closing", event)) {
						        instance.close();
						        instance._overlay.remove();
						    }
						    return !1;
						})
						.hoverClass(classes.closeHover);
                }

                if (options.movable) {
                    $this.movable({
                        container: 'body',
                        handle: '.' + classes.topBar
                    });
                }
            }

            instance._overlay = $("." + classes.overlay);

            if (options.autoOpen) {
                instance.open({ reset: true });
            }

            if (options.autoResize) {
                $('body').bind('resize', function (e) {
                    if (instance.state != "minimized") {
                        $this.css({
                            left: ($(document).width() - $this.outerWidth()) / 2,
                            top: ($(document).height() - $this.outerHeight()) / 2
                        });
                    }
                });
            }

            if (options.resizable) {
                $this.resizable({
                    bottom: true,
                    right: true,
                    minWidth: options.minWidth,
                    minHeight: options.minHeight,
                    resizing: function (event, data) {
                        $content.height(data.height - instance.showTopBar ? $topBar.outerHeight() : 0);
                    }
                });
            }

            if (!instance._overlay.length) {
                instance._overlay = $("<div class='" + classes.overlay + "'/>").appendTo("body");
            }

        }
    });


    classes = $iq.dialog.classes = {
        container: 'iq-dialog',
        content: 'iq-dialog-content',
        minimized: 'iq-dialog-minimized',
        maximized: 'iq-dialog-maximized',

        topBar: 'iq-dialog-topbar',
        title: 'iq-dialog-title',
        controllers: 'iq-dialog-controllers',

        minimize: 'iq-dialog-minimize',
        minimizeHover: 'iq-dialog-minimize-hover',
        maximize: 'iq-dialog-maximize',
        maximizeHover: 'iq-dialog-maximize-hover',
        restore: 'iq-dialog-restore',
        restoreHover: 'iq-dialog-restore-hover',
        close: 'iq-dialog-close',
        closeHover: 'iq-dialog-close-hover',

        overlay: 'iq-dialog-overlay'
    }

})(jQuery);(function ($, undefined) {
    var $iq = $.iq;

    $iq.plugin("grid", {
        options: {

            showHeader: true,
            headerTemplate: 'label',

            cellEdited: $.noop,
            data: null

        },
        _editing: null,
        _renderCell: function ($td, row, col, renderOptions) {
            renderOptions = $.extend({ mode: 'display' }, renderOptions);
            var instance = this,
                options = instance.options,
                isInEditMode = $td.hasClass(classes.cellEdit),
                setEditMode = renderOptions.mode == "edit";
            if (isInEditMode !== setEditMode) {
                var column = options.columns[col],
                    colType = column.type,
                    cellTemplate,
                    editing = instance._editing,
                    value,
                    cellOptions;

                if (colType) {
                    if (colType == "dynamic") {
                        colType = options.getDynamicType ? options.getDynamicType($td, row, col) : "label";
                        if (typeof colType !== "string") {
                            cellOptions = colType.cellOptions;
                            colType = colType.type;
                        }
                    }
                }
                else {
                    colType = "label";
                }

                cellTemplate = cellTemplates[colType];

                if (editing && (row != editing.row || col != editing.col)) {
                    instance._stopEdit();
                }

                if (!(setEditMode && column.readonly)) {

                    column.css && $td.addClass(column.css);

                    if (setEditMode) {
                        value = instance.options.data[row][col];	
						cellTemplate.edit($td.addClass(classes.cellEdit), value, cellOptions);
                    }
                    else {
                        value = cellTemplate.val($td);
                        if (isInEditMode) {
                            instance.options.data[row][col] = value;							
                        }
                        cellTemplate.display($td.removeClass(classes.cellEdit), value, cellOptions);
                    }

                    instance._editing = { cell: $td, row: row, col: col };

                    if (!setEditMode) {
                        instance._trigger("celledited", { target: $td });
                    }
                }
            }
        },
        _editCell: function ($td) {
            this._renderCell($td, $td.parent().prevAll().length, $td.prevAll().length, { mode: 'edit' });
        },
        _stopEdit: function () {
            var instance = this,
                editing = instance._editing,
                value;
            if (editing) {
                instance._renderCell(editing.cell, editing.row, editing.col);
                instance._editing = null;
            }
        },
        _contentTable: function () {
            return this.element.find("." + classes.content + ">table");
        },
        getCell: function (row, col) {
            return (row >= 0 && col >= 0) ? instance._contentTable().find("tr:eq(" + row + "td:eq(" + col + ")") : null;
        },
        cellValue: function (row, col, val) {
            var retVal = cellTemplates[columns[col].type].val(this.getCell(row, col), val);
            return val === undefined ? retVal : this;
        },
        _init: function () {
			
            var instance = this,
				options = instance.options,
				$this = instance.element.addClass(classes.container);

            if (options.data) {
                $iq.grid.create($this, options);
            }

            var $table = $this.find(">div").addClass(classes.content).find(">table").addClass(classes.contentTable),
                $rows = $table.find(">tbody>tr").addClass(classes.row);

            $table.find(">tbody>tr:odd").addClass(classes.altRow);
			$rows.find(">td").addClass(classes.cell);
			
            if (!options.showHeader) {
                $table.find(">thead").hide();
            }

            instance._delegate("." + classes.row + ">td", "dblclick", function (event) {
                instance._editCell($(event.currentTarget));
                event.preventDefault();
                event.stopPropagation();
            })

            $this.bind("clickoutside", function () {
				
                instance._stopEdit();
            });
        }
    });

    function getStrValue(options, key) {
        return typeof options == "string" ? options : (options ? options[key] || "" : "");
    }

    $iq.grid.create = function ($this, options) {
        var $tbody = $("<tbody/>"),
            $thead = $("<thead/>"),
            $row,
            columns = options.columns;

        if (options.columns) {
            //$headerContainer = $("<div><table cellpadding='0' cellspacing='0'/></div>").addClass(classes.header).prependTo($this),
            $row = $("<tr/>");
            $.each(options.columns, function (index, headerOptions) {
                var headerType = headerOptions.type,
                    headerTemplate,
                    $headerCell = $("<th/>");
                headerType = (headerType && headerTemplates[headerType]) ? headerType : 'label';
                headerTemplate = headerTemplates[headerType];
                headerOptions.css && $headerCell.addClass(headerOptions.css);
                headerTemplate.display($headerCell, headerOptions);
                $row.append($headerCell);
            });

            //$headerContainer.find("table").append($thead);

            $thead.append($row);
        }
        if (options.data) {
            columns = columns || {};
            $.each(options.data, function (index, rowData) {
                $row = $("<tr/>");
                $.each(rowData, function (index, cellData) {
                    var column = columns[index] || {},
                        $cell = $("<td/>"),
                        colType,
                        cellOptions = {},
                        cellTemplate;

                    if (colType) {
                        if (colType == "dynamic") {
                            colType = options.getDynamicType ? options.getDynamicType($cell, row, col) : "label";
                            if (typeof colType !== "string") {
                                cellOptions = colType;
                                colType = colType.type;
                            }
                        }
                    }
                    else {
                        colType = "label";
                    }

                    column.css && $cell.addClass(column.css);

                    cellTemplate = cellTemplates[colType];

                    cellTemplate.display($cell, cellData);
                    $row.append($cell);
                });
                $tbody.append($row);
            });
        }
        $("<div><table cellpadding='0' cellspacing='0'/></div>").appendTo($this.empty()).find("table").append($thead).append($tbody);

    }


    var cellTemplates = $iq.grid.cellTemplates =
        {
            label: {
                display: function ($td, options) {
                    $td.html('<div class="iq-grid-label">' + getStrValue(options, "text") + '</div>');
                },
                edit: function ($td, options) {
                    $td.html('<div class="iq-grid-label iq-grid-label-edit"><input type="text" class="iq-textbox-input" value="' + getStrValue(options, "text") + '"/></div>').find("input").textbox();
                },
                val: function ($td, value) {
                    if (value === undefined) {
                        return $td.hasClass(classes.cellEdit) ? $td.find('.iq-grid-label input').val() : $td.find('.iq-grid-label').text()
                    }
                    else {
                        value = value.text || value;
                        $td.hasClass(classes.cellEdit) ? $td.find('.iq-grid-label input').val(value) : $td.find('.iq-grid-label').text(value);
                    }
                }
            }
        },
        headerTemplates = $iq.grid.headerTemplates = {
            label: {
                display: function ($th, options) {
                    $th.removeClass(classes.headerEdit).html('<div class="iq-grid-header-label">' + getStrValue(options, "name") + '</div>');
                },
                edit: function ($th, options) {
                    $th.addClass(classes.headerEdit).html('<div class="iq-grid-header-label iq-grid-header-label-edit"><input type="text" value="' + getStrValue(options, "name") + '"/></div>');
                },
                val: function ($th, value) {
                    if (value === undefined) {
                        return $td.hasClass(classes.headerEdit) ? $td.find('.iq-grid-header-label input').val() : $td.find('.iq-grid-header-label').text()
                    }
                    else {
                        value = value.text || value.name || value;
                        $td.hasClass(classes.headerEdit) ? $td.find('.iq-grid-header-label input').val(value) : $td.find('.iq-grid-header-label').text(value);
                    }
                }
            }
        },
        classes = $iq.grid.classes = {
            container: "iq-grid",

            header: "iq-grid-header",
            headerEdit: "iq-grid-header-edit",

            content: "iq-grid-content",
            contentTable: "iq-grid-content-table",

            cell: "iq-grid-cell",
            cellEdit: "iq-grid-cell-edit",

            row: "iq-grid-row",
            altRow: "iq-grid-alt-row"
        };

})(jQuery);
(function ($, undefined) {

    function getStrValue(options, key) {
        return typeof options == "string" ? options : (options ? options[key] || "" : "");
    }

    var $grid = $.iq.grid,
        classes = $grid.classes;
    $.extend($grid.cellTemplates, {
        combobox: {
            display: function ($td, value, options) {
				var $combobox = $td.find("select");
				if($combobox.length){					
					$combobox.combobox("remove");
				}
                $td.removeClass(classes.cellEdit).html($('<div class="iq-grid-label"/>').text(getStrValue(value, "text")));
            },
            edit: function ($td, value, options) {
                var $select = $td.html('<div class="iq-grid-combobox iq-grid-combobox-edit"><select/></div>').find("select"),
                    selOptions,
                    selOptionsHtml = "";
                if (options && (selOptions = options.options)) {
                    $.each(selOptions, function (key, value) {
                        selOptionsHtml += "<option value='" + key + "'>" + value + "</option>";
                    });
                    $select.append(selOptionsHtml).val(getStrValue(value, "value"));
                }

                $select.combobox();
            },
            val: function ($td, value) {
                var selectedOption;
                if (value === undefined) {
                    if ($td.hasClass("iq-grid-cell-edit")) {
                        selectedOption = $td.find('select option:selected');						
                        return {
                            text: selectedOption.text(),
                            value: selectedOption.val()
                        }						
                    }					
                    return $td.find('div').text();
                }
                else {					
                    value = getStrValue(value, "value");					
                    if ($td.hasClass("iq-grid-cell-edit")) {
                        var $select = $td.find('select');
                        selectedOption = $select.find('option:contains("' + value + '")');
                        if (selectedOption.length == 1)
                            selectedOption.attr('selected', 'selected');
                        else
                            select.val(value);
                    } else {
                        $td.find('div').text(value);
                    };
                }
            }
        },
        colorpicker: {
            display: function ($td, value, options) {
				var $colorpicker = $td.find(".iq-textbox-input");
				if($colorpicker.length){					
					$colorpicker.textbox("remove");
				}
                $td.html($('<div class="iq-grid-label"/>').text(getStrValue(value, "text")));
            },
            edit: function ($td, value, options) {
                var $colorpicker = $td.html('<div class="iq-grid-colorpicker"><input class="iq-textbox-input"/></div>').find("input");
                $colorpicker.textbox({
                    type : 'colorpicker',
                    colorpicker: {
                        parent: $colorpicker.parent(),
                        position : {
                            my: "left bottom",
                            at: "left top"							
                        }
                    }
                }).val(getStrValue(value, "text"));
            },
            val: function ($td, value) {
                var selectedOption,
					$colorpicker = $td.find(".iq-textbox-input");
                if (value === undefined) {
                    return  $colorpicker.length ? $colorpicker.val() : $td.find('div').text();                    
                }
                else {					
                    value = getStrValue(value, "text");
                    if ($colorpicker.length) {
                        $colorpicker.val(value);                        
                    } else {
                        $td.find('>div').text(value);
                    };
                }
            }
        }
    });



})(jQuery);
(function ($, undefined) {
    var $iq = $.iq,
        classes,
        isEventBinded, $colorpicker, $input, textboxManager;


    $iq.plugin("textbox", {
        //        options: {
        //            colorpicker: {
        //                parent : null
        //            }
        //        },		
        _onElement: "input",
		remove : function(){
			if($colorpicker && $input && $input[0] === this.element[0]){
				$colorpicker.appendTo("body").hide();			
			}
			this.element.parent().parent().remove();
		},
        _init: function () {
			
            var instance = this,
                options = instance.options,
				$this = instance.element,
                width, $parent,
                $container;

            width = $.trim($iq.curStyle($this, "width", { hide: true }));
            $this.addClass(classes.input);
            $container = $this.wrap("<div class='" + classes.container + "'><div class='" + classes.wrapper + "'/></div>").parent().parent();

            if (/[\d]+%/.test(width)) {
                $parent = $this.parent().parent().addClass("iq-textbox-block");

                if (width !== "100%") {
                    $parent.css("width", width);
                }
            }

            if (options.type == "colorpicker") {
                $container.addClass("iq-textbox-colorpicker")
                var colorpickerOptions = options.colorpicker,
                    $scrollParent;
				
				if (colorpickerOptions && colorpickerOptions.parent)
                        $scrollParent = $(colorpickerOptions.parent);
				else {
					$scrollParent = $container.scrollParent();
					if ($scrollParent[0] === document || $scrollParent[0] === window) {
						$scrollParent = "body";
					}
				}
					
                if (!$colorpicker) {
                    
                    $colorpicker = $("<div/>").appendTo("body").colorpicker({
                        select: function (event, data) {
                            $colorpicker.hide();
							$input.val(data.selectedValue.hex);							
                        },
                        cancel: function () {
                            $colorpicker.hide();							
                        }
                    }).css({
                        position: 'absolute',
                        display: 'none',
                        zIndex: '100000'
                    });
					
					$colorpicker.one("clickoutside", function () {					
                        $colorpicker.hide();
                    }).click(function(){
						return false;
					});
                }

                $("<a href='#' class='iq-textbox-colorpicker-icon'><span/></a>").insertAfter($this).click(function () {
                    $colorpicker.show().position($.extend({
                        my: "left top",
                        at: "left bottom",
                        of: $container
                    }, (colorpickerOptions ? colorpickerOptions.position || {} : {})));
					
					$input = $this;
                    
                    return false;
                });
            }

            textboxManager.bindEvents();
        }
    });


    classes = $iq.textbox.classes = {
        container: "iq-textbox",
        wrapper: "iq-textbox-wrapper",
        input: "iq-textbox-input",

        inputHover: "iq-textbox-hover",
        inputFocus: "iq-textbox-focus"

    }

    textboxManager = $iq.textbox.manager = {
        bindEvents: function () {
            if (!isEventBinded) {
                $(document).delegate("input.iq-textbox-input", {
                    hover: function (event) {
                        $(this).parent().parent().toggleClass(classes.inputHover);
                    },
                    focus: function (event) {
                        $(this).parent().parent().addClass(classes.inputFocus);
                    },
                    blur: function (event) {
                        $(this).parent().parent().removeClass(classes.inputFocus);
                    }
                });
                isEventBinded = true;
            }
        }
    }
})(jQuery);
