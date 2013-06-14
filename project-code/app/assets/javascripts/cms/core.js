
var cms = cms || {};
var cms = (function(e){var t = e || {};

t.coreModule = new (Class.extend
({
		// -----VARIABLES-----
		pageId : null,
		language: null,
		draggedObject : null,
		hoverObject : null,
		contentCount : 0, // We use this to make a unique id for each content
							// element
		layoutKeyPressed : false,
		isDragging : false,
		mode : null,

		// When a dragged item is released, these variables contain the element
		// where the dragged element will be dropped and the side of this
		// element
		dropObject : null,
		dropSide : cms.configModule.SIDE_UNKNOWN,
		saveDropObjectForAnimation: null,
		saveDropSideForAnimation: null,
		

		setContentId : function(element) {
			element.attr("id", "layout-content-"
					+ cms.coreModule.contentCount);
			cms.coreModule.contentCount += 1;
		},

		disableEditorInstances : function() {
			// remove all CKEditor instances so we can not edit
			for ( var key in CKEDITOR.instances) {
				var editor = CKEDITOR.instances[key];
				retVal = editor.focusManager.blur();
				editor.destroy();
			}
			$("." + cms.configModule.CLASS_CONTENT).removeAttr(
					"contenteditable", "false");
		},

		enableEditorInstances : function() {
			// remove all CKEditor instances so we can not edit
			cms.coreModule.disableEditorInstances();
			$("." + cms.configModule.CLASS_CONTENT).each(function() {
				$(this).attr("contenteditable", "true");
				cms.coreModule.createEditorInstance($(this));
			});
		},

		isEditing : function() {
			var retVal = true;
			if (CKEDITOR.currentInstance == null
					|| CKEDITOR.currentInstance.focusManager.hasFocus == false) {
				retVal = false;
			}
			return retVal;
		},

		createEditorInstance : function(element) {
			/*
			 * Note: the ckeditor.js file was changed to remove the title
			 * (search for 'a.changeAttr("title",c);') This seems to be accepted
			 * as a config file for the future:
			 * http://dev.ckeditor.com/ticket/10042
			 */
			CKEDITOR.inline(element.attr('id'));
		},

		escEditorInstance : function(element) {
			if (CKEDITOR.currentInstance != null) {
				CKEDITOR.currentInstance.focusManager.blur(0);
				$(CKEDITOR.currentInstance.element.$).blur();
			}

		},

		setLayoutWindowForBlock : function(block) {
			cms.configModule.LAYOUT_WINDOW = null;
			while (!block.parent().hasClass(cms.configModule.CLASS_WINDOW)) {
				block = block.parent();
			}
			cms.configModule.LAYOUT_WINDOW = block.parent();
		},

		modeIsLayout : function() {
			var retVal = false;
			if (cms.coreModule.mode == cms.configModule.LAYOUT_MODE) {
				retVal = true;
			}
			return retVal;
		},

		modeIsText : function() {
			var retVal = false;
			if (cms.coreModule.mode == cms.configModule.TEXT_MODE) {
				retVal = true;
			}
			return retVal;
		},
		

		clearDropObject : function() {
			if (cms.coreModule.dropObject) {
				Logger.debug('Clear drop object');
				cms.coreModule.dropSide = cms.configModule.SIDE_UNKNOWN;
				cms.coreModule.dropObject = null;
			}
		},


		// Called when clicked on a content Block
		// Then for the drag the layoutWindow is set to parent window of this
		// object
		setLayoutWindow : function(contentBlock) {
			retVal = false;
			while (!contentBlock.hasClass(cms.configModule.CLASS_WINDOW)
					&& contentBlock.prop('tagName') != 'BODY'
					&& !contentBlock != undefined) {
				contentBlock = contentBlock.parent();
			}
			if (contentBlock.hasClass(cms.configModule.CLASS_WINDOW)) {
				cms.configModule.LAYOUT_WINDOW = contentBlock;
				retVal = true;
			}
			return retVal;

		},
		
		// -----PUBLIC FUNCTIONS-----

		fillColumnWithLastContent : function() {
			// for each row find the talles column
			// set height for other columns in that row to the same height
			$("." + cms.configModule.CLASS_ROW).height("auto");
			$("." + cms.configModule.CLASS_COLUMN).height("auto");
			$("." + cms.configModule.CLASS_CONTENT).height("auto");

			$("." + cms.configModule.CLASS_WINDOW).each(function() {
				cms.coreModule.stretchBlocksToMaxHeight($(this));
			});

		},

		stretchBlocksToMaxHeight : function(element) {
			if (element.hasClass(cms.configModule.CLASS_CONTENT)
					&& element.next('.' + cms.configModule.CLASS_CONTENT).length == 0) {
				cms.coreModule._matchHeightWithParent(element);
			} else if (element.hasClass(cms.configModule.CLASS_COLUMN)) {
				cms.coreModule._matchHeightWithParent(element);
			} else if (element.hasClass(cms.configModule.CLASS_ROW)
					&& element.next('.' + cms.configModule.CLASS_ROW).length == 0) {
				cms.coreModule._matchHeightWithParent(element);
			}

			var children = element.children('.'
					+ cms.configModule.CLASS_BLOCK);
			children.each(function() {
				cms.coreModule.stretchBlocksToMaxHeight($(this));
			})

		},

		_matchHeightWithParent : function(element) {
			if (element.parent().hasClass(cms.configModule.CLASS_WINDOW)
					|| element.hasClass(cms.configModule.CLASS_WINDOW)) {
				return;
			}

			var parentHeight = element.parent().height()
					- (parseFloat(element.css("marginTop")) + parseFloat(element
							.css("marginBottom")))
			if (element.position().top + element.height() < parentHeight) {
				var elementBottom = element.position().top + element.height();
				var parentBottom = parentHeight;
				var diffHeight = parentBottom - elementBottom;
				diffHeight -= (parseFloat(element.css("marginTop")) + parseFloat(element
						.css("marginBottom")));

				if (diffHeight > 0) {
					element.height(element.height() + diffHeight);
				}
			}
		}

	}

));

return t;})(cms);