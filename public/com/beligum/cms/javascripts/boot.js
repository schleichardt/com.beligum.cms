/*******************************************************************************
 * Copyright (c) 2013 Beligum b.v.b.a. (http://www.beligum.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Contributors:
 *     Beligum - initial implementation
 *******************************************************************************/
/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 * http://ejohn.org/blog/simple-javascript-inheritance/
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  this.Class = function(){};
  
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
    
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
    
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" && 
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
            
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
            
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
            
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
    
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
    
    // Populate our constructed prototype object
    Class.prototype = prototype;
    
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
    
    return Class;
  };
})();

/*
 * Note: for namespace details, see http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
 * or http://msdn.microsoft.com/en-us/magazine/gg578608.aspx (The Module Pattern)
 */


var Application = new (Class.extend
({
	//-----CONSTANTS-----
	LEVEL_DEBUG: 1,
	LEVEL_INFO: 2,
	LEVEL_WARN: 3,
	LEVEL_ERROR: 4,
	LEVEL_ASSERT: 5,
	
	//-----SETTINGS-----
	init: function()
	{
		this.APP_NAME = "Cindi";
		this.LOG_LEVEL = this.LEVEL_DEBUG;
	}
}));

var Logger = new (Class.extend
({
	//-----VARIABLES-----
	currentLevel: Application.LOG_LEVEL,
	
	//-----PUBLIC METHODS-----
	log: function(msg, level)
	{
		if (level && level>=this.currentLevel) {
			this._doLog(msg, level);
		}
		else {
			this._doLog(msg);
		}
	},
	debug: function(msg, objs)
	{
		this.log(msg, Application.LEVEL_DEBUG);
	},
	info: function(msg)
	{
		this.log(msg, Application.LEVEL_INFO);
	},
	warn: function(msg)
	{
		this.log(msg, Application.LEVEL_WARN);
	},
	error: function(msg)
	{
		this.log(msg, Application.LEVEL_ERROR);
	},
	assert: function(msg)
	{
		this.log(msg, Application.LEVEL_ASSERT);
	},
	dir: function(obj)
	{
		if (!typeof(console)=='undefined') {
			console.dir(obj);
		}
	},
	trace: function()
	{
		if (!typeof(console)=='undefined') {
			console.trace();
		}
	},
	setLevel: function(level)
	{
		this.currentLevel = level;
	},
	
	//-----PRIVATE METHODS-----
	_doLog: function(msg, level)
	{
		var prefix = "";
		
		var placeholderChar = "s";
		if (msg instanceof Object) {
			placeholderChar = "o";
		}
		
		var haveConsole = typeof(console)!='undefined';
		
		switch (level) {
		case Application.LEVEL_DEBUG:
			if (haveConsole && console.debug) {
				console.debug('DEBUG: %'+placeholderChar, msg);
			}
			break;
		case Application.LEVEL_INFO:
			if (haveConsole && console.info) {
				console.info('INFO: %'+placeholderChar, msg);
			}
			break;
		case Application.LEVEL_WARN:
			if (haveConsole && console.warn) {
				console.warn('WARN: %'+placeholderChar, msg);
			}
			break;
		case Application.LEVEL_ERROR:
			if (haveConsole && console.error) {
				console.error('ERROR: %'+placeholderChar, msg);
			}
			else {
				alert('ERROR: '+msg);
			}
			break;
		case Application.LEVEL_ASSERT:
			if (haveConsole && console.assert) {
				console.assert('ASSERT: %'+placeholderChar, msg);
			}
			break;
		default:
			if (haveConsole && console.log) {
				console.log(msg);
			}
			break;
		}
	}
}));

// from http://dracoblue.net/dev/javascript-new-exceptionnamemessage/96/
function Exception(msg)
{
    try {
        throw new Error("")
    } catch (e) {
    	lineNumber = -1;
    	stack = [];
    	try {
	        e.stack = e.stack.split("@"+e.fileName+":").join(":");
	        full_stack = e.stack.split("\\n");
	        stack[0] = "Exception: "+name+"(\""+msg+"\")"
	        for (var i=2;i<full_stack.length-3;i++) {
	            entry = full_stack[i];
	            entry_detailed = entry.split(":");
	            entry_detailed[1] = entry_detailed[1] - 4; // THIS is to
	            // mark, that we'll "move" the source 4 lines higher,
	            // ... because it's eval code executed. Remove that for
	            // clear values.
	            if (i==2) lineNumber = entry_detailed[1];
	            stack[i] = entry_detailed.join(":");
	        }
    	}
    	catch (e2) {}
    	
    	//note: this helps us a lot on older browsers
    	if (typeof(console)=='undefined') {
    		alert("Exception!\n"+msg);
    	}
    	
        return {
            name: 'Exception',
            message: msg,
            stack: stack.join("\\n"),
            lineNumber: lineNumber
        };
    }
}
