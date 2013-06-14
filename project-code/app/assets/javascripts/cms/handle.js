
var cms = cms || {};
var cms = (function(e){var t = e || {};

t.handleModule = new (Class.extend
({
	
	//-----CONSTANTS-----

	//-----VARIABLES-----		


	//-----PUBLIC-----
	
	// this function creates the handle between two columns to resize them
	createResizeHandles: function() {
		this.removeResizeHandles();
		this._addResizeHandle(cms.configModule.LAYOUT_WINDOW);
		Logger.debug('Handle: Create resize handles');
	},
	
	createPaddingHandles: function() {
		cms.handleModule.removePaddingHandles();
		cms.handleModule._addPaddingHandles();
	},
	
	removeResizeHandles: function(element) {
		Logger.debug("Removing resize Handles");
		$('.' + cms.configModule.CLASS_RESIZE_HANDLE).remove();
	},
	
	// this function creates the handles that guides the user where he can drop his blocks
	createDropHandles: function() {
		Logger.debug("Creating Drop Handles");
		this.removeDropHandles();
	
		this._addDropHandle(cms.configModule.LAYOUT_WINDOW);
		Logger.debug('Handle: Create drop handles');
	},
	

	removeDropHandles: function() {
		Logger.debug("Removing drophandles");
		$('.' + cms.configModule.CLASS_DROP_HANDLE_LEFT).remove();
		$('.' + cms.configModule.CLASS_DROP_HANDLE_RIGHT).remove();
		$('.' + cms.configModule.CLASS_DROP_HANDLE_TOP).remove();
		$('.' + cms.configModule.CLASS_DROP_HANDLE_BOTTOM).remove();
		$("." + cms.configModule.CLASS_DROP_SELECT_HANDLE).remove();
		$('.' + cms.configModule.CLASS_CONTENT).css('height', 'auto');
	},
	
	removePaddingHandles: function() {
		$('.' + cms.configModule.CLASS_PADDING_HANDLE).remove();
	},

	removeContentBtns: function(content) {
		Logger.debug("Removing content buttons");
		$('.' + cms.configModule.CLASS_CONTENT_BTN_TOOLBAR).remove();
		//$('.' + cms.configModule.CLASS_CONTENT).removeAttr('id');
	},
	
	addContentBtns: function() {
		
		cms.handleModule.removeContentBtns();
		cms.coreModule.contentCount = 0;
		$('.' + cms.configModule.CLASS_CONTENT).each(function() {
			// set id of content div and add remove button
			var content = $(this);
			content.attr('id', 'content' + cms.coreModule.contentCount);
			cms.coreModule.contentCount += 1;
			
			var buttonToolbar = $('<div class="btn-toolbar"/>').addClass(cms.configModule.CLASS_CONTENT_BTN_TOOLBAR);
			var buttonGrp = $('<div class="btn-group"/>');
			var addContentBtn = $('<a href="javascript:void(0);" title="Split block" class="btn btn-mini"/>').addClass(cms.configModule.CLASS_ADD_CONTENT).html("<i class='icon-asterisk'></i>");
			var removeContentBtn = $('<a href="javascript:void(0);" title="Delete block" class="btn btn-mini"/>').addClass(cms.configModule.CLASS_REMOVE_CONTENT).html("<i class='icon-trash'></i>");
			buttonGrp.append(addContentBtn);
			buttonGrp.append(removeContentBtn);
			buttonToolbar.append(buttonGrp);
			$(this).append(buttonToolbar);
		})
		Logger.debug("Creating content buttons");
		
	},
	
	createSelectRuler: function() {
		$('.' + cms.configModule.CLASS_DROP_SELECT_HANDLE).remove();
		var ruler = this._createBasicHandle(cms.coreModule.dropObject, cms.coreModule.dropSide, cms.configModule.DROP_SELECT_HANDLE_WIDTH, 0);
		ruler.addClass(cms.configModule.CLASS_DROP_SELECT_HANDLE);
		cms.coreModule.dropObject.append(ruler);
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
		$('.' + cms.configModule.CLASS_COLUMN + ':not(.' + cms.configModule.CLASS_WINDOW + ')').each(
				function() {
					var element = $(this);
					if (element.prev().length > 0) {

						Logger.debug("Handle: Add resizer");
						
						var resizer = cms.handleModule._createBasicHandle(element, cms.configModule.SIDE_LEFT, cms.configModule.RESIZE_HANDLE_WIDTH, 0);
						resizer.addClass(cms.configModule.CLASS_RESIZE_HANDLE);
						

						// We have to recalculate the left because we append the handle to the parent element (row)
						// The column widths will change while dragging, but our handle stays at the same position
						// Save the column connected to the resizer in the dom data
						resizer.data('column', element);
						var columnLeft = element.position().left ;
						var columnMarginLeft = (parseFloat(element.css('marginLeft')) * 0.5) - (cms.configModule.RESIZE_HANDLE_WIDTH * 0.5);
						resizerLeft = columnLeft + columnMarginLeft;
						resizer.css('left', resizerLeft);
						
						element.parent().append(resizer);

						cms.registeringModule.registerResizerHandle(resizer);			
					}
				});
	},
	
	_addPaddingHandles: function() {
		$('.' + cms.configModule.CLASS_CONTENT).each(
			function() {
				var offsetTop = parseFloat($(this).css('paddingTop')) ;
				var offsetBottom = parseFloat($(this).css('paddingBottom'));
				var offsetLeft = parseFloat($(this).css('paddingLeft'));
				var offsetRight = parseFloat($(this).css('paddingRight'));
				var paddingHandleTop = cms.handleModule._createBasicHandle($(this), cms.configModule.SIDE_TOP, cms.configModule.PADDING_HANDLE_WIDTH, offsetTop);
				
				paddingHandleTop.addClass(cms.configModule.CLASS_PADDING_HANDLE).addClass(cms.configModule.CLASS_PADDING_HANDLE_TOP).appendTo($(this).parent());
				cms.registeringModule.registerPaddingHandle(paddingHandleTop);
				
				var paddingHandleBottom = cms.handleModule._createBasicHandle($(this), cms.configModule.SIDE_BOTTOM, cms.configModule.PADDING_HANDLE_WIDTH, 0);
				//paddingHandleBottom.addClass(cms.configModule.CLASS_PADDING_HANDLE).addClass(cms.configModule.CLASS_PADDING_HANDLE_BOTTOM).appendTo($(this).parent());
				
				var paddingHandleLeft = cms.handleModule._createBasicHandle($(this), cms.configModule.SIDE_LEFT, cms.configModule.PADDING_HANDLE_WIDTH, offsetLeft);
				paddingHandleLeft.addClass(cms.configModule.CLASS_PADDING_HANDLE).addClass(cms.configModule.CLASS_PADDING_HANDLE_LEFT).appendTo($(this).parent());
				cms.registeringModule.registerPaddingHandle(paddingHandleLeft);
				var paddingHandleRight = cms.handleModule._createBasicHandle($(this), cms.configModule.SIDE_RIGHT, cms.configModule.PADDING_HANDLE_WIDTH, offsetRight);
				paddingHandleRight.addClass(cms.configModule.CLASS_PADDING_HANDLE).addClass(cms.configModule.CLASS_PADDING_HANDLE_RIGHT).appendTo($(this).parent());
				cms.registeringModule.registerPaddingHandle(paddingHandleRight);
				
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
		$('.' + cms.configModule.CLASS_COLUMN).each(
				function() {
					if ($(this).prev().length > 0) {
						// border left
						cms.handleModule._drawDropHandle($(this), cms.configModule.SIDE_LEFT);
						Logger.debug('Add drophandle to left of column');
					}
				});
		// Add handle to the top of rows that have a row before them
		$('.' + cms.configModule.CLASS_ROW).each(
				function() {
					if ($(this).prev().length > 0) {
						// border left
						cms.handleModule._drawDropHandle($(this), cms.configModule.SIDE_TOP);
						Logger.debug('Add drophandle to top row');
					}
				});
		
		// Add handle to the top of content blocks that have a content before them
		$('.' + cms.configModule.CLASS_CONTENT).each(
				function() {
					if ($(this).prev().length > 0) {
						// border left
						cms.handleModule._drawDropHandle($(this), cms.configModule.SIDE_TOP);
						Logger.debug('Add drophandle to top content');
					}
				});
		
		// Add handle to all sides of the layout window
		$('.' + cms.configModule.CLASS_WINDOW).each(
				function() {
					cms.handleModule._drawDropHandle($(this), cms.configModule.SIDE_LEFT);
					cms.handleModule._drawDropHandle($(this), cms.configModule.SIDE_RIGHT);
					cms.handleModule._drawDropHandle($(this), cms.configModule.SIDE_TOP);
					cms.handleModule._drawDropHandle($(this), cms.configModule.SIDE_BOTTOM);
				});
		
		// Expand the height of the content blocks so they fill the full column
		cms.coreModule.fillColumnWithLastContent($(this));
		
	},


	
	_drawDropHandle: function(element, sideClass) {
		
		var ruler = this._createBasicHandle(element, sideClass, cms.configModule.DROP_HANDLE_WIDTH, 0);
		
		if (sideClass == cms.configModule.SIDE_LEFT) {
			ruler.addClass(cms.configModule.CLASS_DROP_HANDLE_LEFT);
		} else if(sideClass == cms.configModule.SIDE_RIGHT) {
			ruler.addClass(cms.configModule.CLASS_DROP_HANDLE_RIGHT);
		} else if(sideClass == cms.configModule.SIDE_TOP) {
			ruler.addClass(cms.configModule.CLASS_DROP_HANDLE_TOP);
		} else if(sideClass == cms.configModule.SIDE_BOTTOM) {
			ruler.addClass(cms.configModule.CLASS_DROP_HANDLE_BOTTOM);
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
		if (element.hasClass(cms.configModule.CLASS_COLUMN) && sideClass == cms.configModule.SIDE_LEFT) {
			height = element.parent().outerHeight();
			left = parseFloat(element.css('marginLeft'));
			if (element.prev().length > 0) {
				left += parseFloat(element.prev().css('marginRight'));
				left = left / 2 + handleWidth / 2;
			}
		} else if (element.hasClass(cms.configModule.CLASS_COLUMN) && sideClass == cms.configModule.SIDE_RIGHT) {
			height = element.parent().outerHeight();
			left = parseFloat(element.css('marginRight'));
			if (element.next().length > 0) {
				left += parseFloat(element.next().css('marginLeft'));
				left = left / 2 - handleWidth / 2;
			}
		}
		

		var ruler = $('<div />');	
		if (sideClass == cms.configModule.SIDE_LEFT) {
			ruler.css('left', (-left + offset) + "px");
			ruler.css('top', "0px");
			ruler.css('height',  height + "px");
			ruler.css('width',  handleWidth + "px");
		} else if (sideClass == cms.configModule.SIDE_RIGHT) {	
			ruler.css('left', (width + left - offset) + "px");
			ruler.css('top',  "0px");
			ruler.css('height',  height + "px");
			ruler.css('width',  handleWidth + "px");
		} else if (sideClass == cms.configModule.SIDE_TOP) {	
			ruler.css('left', "0px");
			ruler.css('top', (-top + offset) + "px");
			ruler.css('height',  handleWidth + "px");
			ruler.css('width',  width+ "px");
		} else if (sideClass == cms.configModule.SIDE_BOTTOM) {	
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