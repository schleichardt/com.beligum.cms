
var cms = cms || {};
var cms = (function(e){var t = e || {};

t.config = new (Class.extend
({
    //Do setup work here

    	//-----CONSTANTS-----
    	LAYOUT_WINDOW: null,				// Window that contains all rows
    	CLASS_BODY_LAYOUT_MODE: "layout-mode",
    	CLASS_BODY_TEXT_MODE: "text-mode",
    	
    	// Class names of the basic blocks
    	// A row contains one or more columns
    	// A column contains 1 or more content elements
    	// A content element contains the html from the user
    	// All basic blocks need to have css position relative
    	
    	CLASS_BLOCK: "layout-basic-block",
    	CLASS_ROW: "layout-row",
    	CLASS_COLUMN: "layout-column",
    	CLASS_WINDOW: "layout-window",
    	CLASS_CONTENT: "layout-content",
    	CLASS_CONTENT_EDITOR: "layout-content-editor",
    	CLASS_CONTENT_TEMPLATE: "layout-content-template",
    	CLASS_EMPTY: "layout-empty",
    	
    	
    	
    	// Handles define the lines between the basic blocks (rows, column, content)
    	// DROP_HANDLE appears while dragging an object or when SHIFT is pressed. 
    	// They show the outlines from the columns and the rows so you know where you can drop an object
    	// DROP_SELECT_HANDLE appears while dragging and shows the exact 
    	// location where the dragged object will be dropped when the mouse is released
    	// RESIZE_HANDLE appears between two columns and you can drag them left or right to change the column size
    	
    	CLASS_DROP_SELECT_HANDLE: "layout-drophandle-select",
    	CLASS_RESIZE_HANDLE: "layout-resizer",
    	CLASS_DROP_HANDLE: "layout-drophandle",
    	CLASS_DROP_HANDLE_LEFT: "layout-drophandle-left",
    	CLASS_DROP_HANDLE_RIGHT: "layout-drophandle-right",
    	CLASS_DROP_HANDLE_TOP: "layout-drophandle-top",
    	CLASS_DROP_HANDLE_BOTTOM: "layout-drophandle-bottom",
    	CLASS_PADDING_HANDLE: "layout-paddinghandle",
    	CLASS_PADDING_HANDLE_LEFT: "layout-paddinghandle-left",
    	CLASS_PADDING_HANDLE_RIGHT: "layout-paddinghandle-right",
    	CLASS_PADDING_HANDLE_TOP: "layout-paddinghandle-top",
    	CLASS_PADDING_HANDLE_BOTTOM: "layout-paddinghandle-bottom",
    	
    	CLASS_CONTENT_BTN_TOOLBAR: "layout-content-btn-tool",
    	CLASS_REMOVE_CONTENT: "layout-content-remove-btn",
    	CLASS_ADD_CONTENT: "layout-content-add-btn",
    	CLASS_SAVE_CONTENT: "layout-content-save-btn",
    	COLOR_ADD_CONTENT_HIGHLIGHT: "rgba(135, 206, 255, 0.4)",
    	
    	CLASS_DROP_HANDLE_SELECT_LABEL: "layout-drophandle-select-label",
    	CLASS_DROP_HANDLE_LABEL: "layout-drophandle-label",
    	
    	CLASS_DROP_OBJECT: "layout-drop-object",
    	CLASS_IMPACT_OBJECT: "layout-impact-object",	// the object which content will be impacted eg column added inside
    	CLASS_DRAGGED_OBJECT: "layout-dragged-object",
    	
    	CLASS_TOOLBAR: "layout-toolbar",
    	
    	// The width of the specific handles
    	DROP_HANDLE_WIDTH: 1,
    	RESIZE_HANDLE_WIDTH: 5,
    	DROP_SELECT_HANDLE_WIDTH: 5,
    	PADDING_HANDLE_WIDTH: 1,
    	
    	// Speed of animation
    	ANIMATION_HIDE_SPEED: 200,
    	ANIMATION_SHOW_SPEED: 200,
    	
    	TOOLBAR_HEIGHT: 30,
    	
    	// Defines a side
    	// this must be a string
    	SIDE_UNKNOWN: "SIDE_UNKNOWN",
    	SIDE_LEFT: "SIDE_LEFT",
    	SIDE_TOP: "SIDE_TOP",
    	SIDE_RIGHT: "SIDE_RIGHT",
    	SIDE_BOTTOM: "SIDE_BOTTOM",
    	
    	TEXT_MODE: "TEXT_MODE",
    	LAYOUT_MODE: "LAYOUT_MODE",
    	PADDING_MODE: "PADDING_MODE",
    	
    	LAYOUT_KEY: 17,  // 17
    	ESC_KEY: 27
    }
));

return t;})(cms);
