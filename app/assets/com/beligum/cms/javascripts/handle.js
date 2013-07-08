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

var cms = cms || {};
var cms = (function(e){var t = e || {};

t.handle = new (Class.extend
({
	
	//-----CONSTANTS-----

	//-----VARIABLES-----		


	//-----PUBLIC-----
	
	// this function creates the handle between two columns to resize them
	createResizeHandles: function() {
		this.removeResizeHandles();
		this._addResizeHandle(cms.config.LAYOUT_WINDOW);
		Logger.debug('Handle: Create resize handles');
	},
	
	createPaddingHandles: function() {
		cms.handle.removePaddingHandles();
		cms.handle._addPaddingHandles();
	},
	
	removeResizeHandles: function(element) {
		Logger.debug("Removing resize Handles");
		$('.' + cms.config.CLASS_RESIZE_HANDLE).remove();
	},
	
	// this function creates the handles that guides the user where he can drop his blocks
	createDropHandles: function() {
		Logger.debug("Creating Drop Handles");
		this.removeDropHandles();
	
		this._addDropHandle(cms.config.LAYOUT_WINDOW);
		Logger.debug('Handle: Create drop handles');
	},
	

	removeDropHandles: function() {
		Logger.debug("Removing drophandles");
		$('.' + cms.config.CLASS_DROP_HANDLE_LEFT).remove();
		$('.' + cms.config.CLASS_DROP_HANDLE_RIGHT).remove();
		$('.' + cms.config.CLASS_DROP_HANDLE_TOP).remove();
		$('.' + cms.config.CLASS_DROP_HANDLE_BOTTOM).remove();
		$("." + cms.config.CLASS_DROP_SELECT_HANDLE).remove();
		// $('.' + cms.config.CLASS_CONTENT).css('height', 'auto');
	},
	
	removePaddingHandles: function() {
		$('.' + cms.config.CLASS_PADDING_HANDLE).remove();
	},

	removeContentBtns: function(content) {
		Logger.debug("Removing content buttons");
		$('.' + cms.config.CLASS_CONTENT_BTN_TOOLBAR).remove();
		//$('.' + cms.config.CLASS_CONTENT).removeAttr('id');
	},
	
	addContentBtns: function() {
		
		cms.handle.removeContentBtns();
		cms.core.contentCount = 0;
		$('.' + cms.config.CLASS_CONTENT).each(function() {
			// set id of content div and add remove button
			var content = $(this);
			content.attr('id', 'content' + cms.core.contentCount);
			cms.core.contentCount += 1;
			
			var buttonToolbar = $('<div class="btn-toolbar"/>').addClass(cms.config.CLASS_CONTENT_BTN_TOOLBAR);
			var buttonGrp = $('<div class="btn-group"/>');
			var addContentBtn = $('<a href="javascript:void(0);" title="Split block" class="btn btn-mini"/>').addClass(cms.config.CLASS_ADD_CONTENT).html("<i class='icon-asterisk'></i>");
			var removeContentBtn = $('<a href="javascript:void(0);" title="Delete block" class="btn btn-mini"/>').addClass(cms.config.CLASS_REMOVE_CONTENT).html("<i class='icon-trash'></i>");
			buttonGrp.append(addContentBtn);
			buttonGrp.append(removeContentBtn);
			buttonToolbar.append(buttonGrp);
			$(this).append(buttonToolbar);
		})
		Logger.debug("Creating content buttons");
		
	},
	
	createSelectRuler: function() {
		$('.' + cms.config.CLASS_DROP_SELECT_HANDLE).remove();
		var ruler = this._createBasicHandle(cms.core.dropObject, cms.core.dropSide, cms.config.DROP_SELECT_HANDLE_WIDTH, 0);
		ruler.addClass(cms.config.CLASS_DROP_SELECT_HANDLE);
		cms.core.dropObject.append(ruler);
		return ruler;
	},
	

	createLabel: function(handle, text) {
		var label = $('<div/>').addClass('label').html(text);
		label.css('position', 'absolute');
		label.css('left', '0px');
		label.css('top', '0px');
		handle.append(label);
		// if handle is horizontal, shift top
		if (handle.width() > handle.height()) {
			label.css('top', ((handle.outerHeight()/2) - (label.outerHeight()/2)) + "px");
		}
		
	},
	
	
	//-----PRIVATE-----

	
	_addResizeHandle: function(element) {
		// add resizeBars BETWEEN columns, so every column that has a column on his left gets a resizer
		// So perform function on all columns but not the layout window
		$('.' + cms.config.CLASS_COLUMN + ':not(.' + cms.config.CLASS_WINDOW + ')').each(
				function() {
					var element = $(this);
					if (element.prev().length > 0) {

						Logger.debug("Handle: Add resizer");
						
						var resizer = cms.handle._createBasicHandle(element, cms.config.SIDE_LEFT, cms.config.RESIZE_HANDLE_WIDTH, 0);
						resizer.addClass(cms.config.CLASS_RESIZE_HANDLE);
						

						// We have to recalculate the left because we append the handle to the parent element (row)
						// The column widths will change while dragging, but our handle stays at the same position
						// Save the column connected to the resizer in the dom data
						resizer.data('column', element);
						var columnLeft = element.position().left ;
						var columnMarginLeft = (parseFloat(element.css('marginLeft')) * 0.5) - (cms.config.RESIZE_HANDLE_WIDTH * 0.5);
						resizerLeft = columnLeft + columnMarginLeft;
						resizer.css('left', resizerLeft);
						
						element.parent().append(resizer);

						cms.registering.registerResizerHandle(resizer);			
					}
				});
	},
	
	_addPaddingHandles: function() {
		$('.' + cms.config.CLASS_CONTENT).each(
			function() {
				var offsetTop = parseFloat($(this).css('paddingTop')) ;
				var offsetBottom = parseFloat($(this).css('paddingBottom'));
				var offsetLeft = parseFloat($(this).css('paddingLeft'));
				var offsetRight = parseFloat($(this).css('paddingRight'));
				var paddingHandleTop = cms.handle._createBasicHandle($(this), cms.config.SIDE_TOP, cms.config.PADDING_HANDLE_WIDTH, offsetTop);
				
				paddingHandleTop.addClass(cms.config.CLASS_PADDING_HANDLE).addClass(cms.config.CLASS_PADDING_HANDLE_TOP).appendTo($(this).parent());
				cms.registering.registerPaddingHandle(paddingHandleTop);
				
				var paddingHandleBottom = cms.handle._createBasicHandle($(this), cms.config.SIDE_BOTTOM, cms.config.PADDING_HANDLE_WIDTH, 0);
				//paddingHandleBottom.addClass(cms.config.CLASS_PADDING_HANDLE).addClass(cms.config.CLASS_PADDING_HANDLE_BOTTOM).appendTo($(this).parent());
				
				var paddingHandleLeft = cms.handle._createBasicHandle($(this), cms.config.SIDE_LEFT, cms.config.PADDING_HANDLE_WIDTH, offsetLeft);
				paddingHandleLeft.addClass(cms.config.CLASS_PADDING_HANDLE).addClass(cms.config.CLASS_PADDING_HANDLE_LEFT).appendTo($(this).parent());
				cms.registering.registerPaddingHandle(paddingHandleLeft);
				var paddingHandleRight = cms.handle._createBasicHandle($(this), cms.config.SIDE_RIGHT, cms.config.PADDING_HANDLE_WIDTH, offsetRight);
				paddingHandleRight.addClass(cms.config.CLASS_PADDING_HANDLE).addClass(cms.config.CLASS_PADDING_HANDLE_RIGHT).appendTo($(this).parent());
				cms.registering.registerPaddingHandle(paddingHandleRight);
				
				// top is top parent + paddingTop + marginTop
				//paddingHandleTop.css("top", $(this).position().top + offsetTop);
				var height = $(this).height();
				var width = $(this).width();
				paddingHandleLeft.height(height);
				paddingHandleRight.height(height);
				paddingHandleLeft.css('top', $(this).position().top + offsetTop);
				paddingHandleRight.css('top', $(this).position().top + offsetTop);
				paddingHandleTop.css('top', $(this).position().top + offsetTop);
				//paddingHandleBottom.css('top', $(this).position().top + offsetTop);
				
				paddingHandleTop.width(width);
				paddingHandleBottom.width(width);
				paddingHandleTop.css('left', $(this).position().left + offsetLeft);
				paddingHandleBottom.css('left', $(this).position().left + offsetLeft);
				paddingHandleLeft.css('left', $(this).position().left + offsetLeft);
				//paddingHandleRight.css('left', $(this).position().left + offsetLeft);
				
				paddingHandleTop.data("block", $(this));
				paddingHandleLeft.data("block", $(this));
				paddingHandleRight.data("block", $(this));
				paddingHandleBottom.data("block", $(this));
				Logger.debug("offsetTop: " + offsetTop);
				
			});
	},

	
	_addDropHandle: function(element) {
		
		// Add handle to the left of columns that have a column before them
		$('.' + cms.config.CLASS_COLUMN).each(
				function() {
					if ($(this).prev().length > 0) {
						// border left
						cms.handle._drawDropHandle($(this), cms.config.SIDE_LEFT);
						Logger.debug('Add drophandle to left of column');
					}
				});
		// Add handle to the top of rows that have a row before them
		$('.' + cms.config.CLASS_ROW).each(
				function() {
					if ($(this).prev().length > 0) {
						// border left
						cms.handle._drawDropHandle($(this), cms.config.SIDE_TOP);
						Logger.debug('Add drophandle to top row');
					}
				});
		
		// Add handle to the top of content blocks that have a content before them
		$('.' + cms.config.CLASS_CONTENT).each(
				function() {
					if ($(this).prev().length > 0) {
						// border left
						cms.handle._drawDropHandle($(this), cms.config.SIDE_TOP);
						Logger.debug('Add drophandle to top content');
					}
				});
		
		// Add handle to all sides of the layout window
		$('.' + cms.config.CLASS_WINDOW).each(
				function() {
					cms.handle._drawDropHandle($(this), cms.config.SIDE_LEFT);
					cms.handle._drawDropHandle($(this), cms.config.SIDE_RIGHT);
					cms.handle._drawDropHandle($(this), cms.config.SIDE_TOP);
					cms.handle._drawDropHandle($(this), cms.config.SIDE_BOTTOM);
				});
		
		
	},


	
	_drawDropHandle: function(element, sideClass) {
		
		var ruler = this._createBasicHandle(element, sideClass, cms.config.DROP_HANDLE_WIDTH, 0);
		
		if (sideClass == cms.config.SIDE_LEFT) {
			ruler.addClass(cms.config.CLASS_DROP_HANDLE_LEFT);
		} else if(sideClass == cms.config.SIDE_RIGHT) {
			ruler.addClass(cms.config.CLASS_DROP_HANDLE_RIGHT);
		} else if(sideClass == cms.config.SIDE_TOP) {
			ruler.addClass(cms.config.CLASS_DROP_HANDLE_TOP);
		} else if(sideClass == cms.config.SIDE_BOTTOM) {
			ruler.addClass(cms.config.CLASS_DROP_HANDLE_BOTTOM);
		}

		element.append(ruler);
	
	},
	

	
	
	// Used by drawDropHandle and drawSelectRuler
	// Creates a basic handle and calculates position based on witdth and side
	_createBasicHandle: function(element, sideClass, handleWidth, offset) {

		var top = parseFloat(element.css('marginTop'));
		var left = parseFloat(element.css('marginLeft'));
		var width = element.outerWidth();
		var height = element.outerHeight();
		
		// Because columns are seperated with margins (on the left) and we want our handles exactly in the middle between columns
		// we have to take special care for handles on the left and right of columns
		// We make sure the handle takes the height of the parent row
		// calculate the middle between two columns
		if (element.hasClass(cms.config.CLASS_COLUMN) && sideClass == cms.config.SIDE_LEFT) {
			height = element.parent().outerHeight();
			left = parseFloat(element.css('marginLeft'));
			if (element.prev().length > 0) {
				left += parseFloat(element.prev().css('marginRight'));
				left = left / 2 + handleWidth / 2;
			}
		} else if (element.hasClass(cms.config.CLASS_COLUMN) && sideClass == cms.config.SIDE_RIGHT) {
			height = element.parent().outerHeight();
			left = parseFloat(element.css('marginRight'));
			if (element.next().length > 0) {
				left += parseFloat(element.next().css('marginLeft'));
				left = left / 2 - handleWidth / 2;
			}
		}
		

		var ruler = $('<div />');	
		if (sideClass == cms.config.SIDE_LEFT) {
			ruler.css('left', (-left + offset) + "px");
			ruler.css('top', "0px");
			ruler.css('height',  height + "px");
			ruler.css('width',  handleWidth + "px");
		} else if (sideClass == cms.config.SIDE_RIGHT) {	
			ruler.css('left', (width + left - offset) + "px");
			ruler.css('top',  "0px");
			ruler.css('height',  height + "px");
			ruler.css('width',  handleWidth + "px");
		} else if (sideClass == cms.config.SIDE_TOP) {	
			ruler.css('left', "0px");
			ruler.css('top', (-top + offset) + "px");
			ruler.css('height',  handleWidth + "px");
			ruler.css('width',  width+ "px");
		} else if (sideClass == cms.config.SIDE_BOTTOM) {	
			ruler.css('left', "0px");
			ruler.css('top', (height + top - offset) + "px");
			ruler.css('height',  handleWidth + "px");
			ruler.css('width',  width + "px");
		} 
		
		return ruler;

	}
	}


));

return t;})(cms);