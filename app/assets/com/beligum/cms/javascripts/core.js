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

t.core = new (Class.extend
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
		dropSide : cms.config.SIDE_UNKNOWN,
		saveDropObjectForAnimation: null,
		saveDropSideForAnimation: null,
		

		setContentId : function(element) {
			element.attr("id", "layout-content-"
					+ cms.core.contentCount);
			cms.core.contentCount += 1;
		},

		disableEditorInstances : function() {
			// remove all CKEditor instances so we can not edit
			for ( var key in CKEDITOR.instances) {
				var editor = CKEDITOR.instances[key];
				retVal = editor.focusManager.blur();
				editor.destroy();
			}
			$("." + cms.config.CLASS_CONTENT).removeAttr(
					"contenteditable", "false");
		},

		enableEditorInstances : function() {
			// remove all CKEditor instances so we can not edit
			cms.core.disableEditorInstances();
			$("." + cms.config.CLASS_CONTENT).each(function() {
				$(this).attr("contenteditable", "true");
				cms.core.createEditorInstance($(this));
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
			cms.config.LAYOUT_WINDOW = null;
			while (!block.parent().hasClass(cms.config.CLASS_WINDOW)) {
				block = block.parent();
			}
			cms.config.LAYOUT_WINDOW = block.parent();
		},

		modeIsLayout : function() {
			var retVal = false;
			if (cms.core.mode == cms.config.LAYOUT_MODE) {
				retVal = true;
			}
			return retVal;
		},

		modeIsText : function() {
			var retVal = false;
			if (cms.core.mode == cms.config.TEXT_MODE) {
				retVal = true;
			}
			return retVal;
		},
		

		clearDropObject : function() {
			if (cms.core.dropObject) {
				Logger.debug('Clear drop object');
				cms.core.dropSide = cms.config.SIDE_UNKNOWN;
				cms.core.dropObject = null;
			}
		},


		// Called when clicked on a content Block
		// Then for the drag the layoutWindow is set to parent window of this
		// object
		setLayoutWindow : function(contentBlock) {
			retVal = false;
			while (!contentBlock.hasClass(cms.config.CLASS_WINDOW)
					&& contentBlock.prop('tagName') != 'BODY'
					&& !contentBlock != undefined) {
				contentBlock = contentBlock.parent();
			}
			if (contentBlock.hasClass(cms.config.CLASS_WINDOW)) {
				cms.config.LAYOUT_WINDOW = contentBlock;
				retVal = true;
			}
			return retVal;

		},
		
		// -----PUBLIC FUNCTIONS-----

		fillColumnWithLastContent : function() {
			// for each row find the talles column
			// set height for other columns in that row to the same height
			$("." + cms.config.CLASS_ROW).height("auto");
			$("." + cms.config.CLASS_COLUMN).height("auto");
			$("." + cms.config.CLASS_CONTENT).height("auto");

			$("." + cms.config.CLASS_WINDOW).each(function() {
				cms.core.stretchBlocksToMaxHeight($(this));
			});

		},

		stretchBlocksToMaxHeight : function(element) {
			if (element.hasClass(cms.config.CLASS_CONTENT)
					&& element.next('.' + cms.config.CLASS_CONTENT).length == 0) {
				cms.core._matchHeightWithParent(element);
			} else if (element.hasClass(cms.config.CLASS_COLUMN)) {
				cms.core._matchHeightWithParent(element);
			} else if (element.hasClass(cms.config.CLASS_ROW)
					&& element.next('.' + cms.config.CLASS_ROW).length == 0) {
				cms.core._matchHeightWithParent(element);
			}

			var children = element.children('.'
					+ cms.config.CLASS_BLOCK);
			children.each(function() {
				cms.core.stretchBlocksToMaxHeight($(this));
			})

		},

		_matchHeightWithParent : function(element) {
			if (element.parent().hasClass(cms.config.CLASS_WINDOW)
					|| element.hasClass(cms.config.CLASS_WINDOW)) {
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