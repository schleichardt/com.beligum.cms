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

t.manager = new (Class.extend
({
	init: function() {
		$(document).ready(function() {
			Logger.debug("Init cms");
			cms.manager.initEditor();
			cms.manager.activateManager();
			cms.admin.initAdminPanel(-1);
		});
	},
	

		initEditor : function() {
			CKEDITOR.disableAutoInline = true;
			CKEDITOR.config.allowedContent = true;

			CKEDITOR.config.extraPlugins = 'justify,htmlsnippet';

			CKEDITOR.config.toolbar = [
					{
						name : 'basicstyles',
						groups : [ 'basicstyles', 'cleanup' ],
						items : [ 'Bold', 'Italic', 'Strike', '-',
								'RemoveFormat' ]
					},
					{
						name : 'paragraph',
						groups : [ 'list', 'indent', 'blocks', 'align' ],
						items : [ 'NumberedList', 'BulletedList' ]
					},
					{
						name : 'justify',
						items : [ 'JustifyLeft', 'JustifyCenter',
								'JustifyRight', 'JustifyBlock' ]
					},
					{
						name : 'styles',
						items : [ 'Styles' ]
					},
					'/',
					{
						name : 'clipboard',
						groups : [ 'clipboard', 'undo' ],
						items : [ 'Cut', 'Copy', 'Paste', 'PasteText', '-',
								'Undo', 'Redo' ]
					},
					{
						name : 'links',
						items : [ 'Link', 'Unlink', 'Anchor' ]
					},
					{
						name : 'insert',
						items : [ 'Image', 'Table', 'HorizontalRule',
								'SpecialChar' ]
					}, {
						name : 'htmlsnippet',
						items : [ 'htmlSnippetButton' ]
					} ];

			$(window).blur(function() {
				// TODO: this function is also called on left click so we cannot
				// see the context menu of the editor
				// Logger.debug("Window blurs");
				// cms.manager.textMode();
			})
		},

		activateManager : function() {
			Logger.debug("Active manager")
			cms.registering.registerKeys();
			$("." + cms.config.CLASS_CONTENT).each(function() {
				cms.core.setContentId($(this));
				cms.registering.registerDragDrop($(this));
			});
			cms.manager.textMode();

			$("." + cms.config.CLASS_EMPTY).removeClass(
					cms.config.CLASS_EMPTY);

			// When on mac change ctrl key to alt
			// http://stackoverflow.com/questions/2527011/how-do-i-check-if-the-browser-is-running-on-a-mac
			if (navigator.userAgent.indexOf("Mac OS X") != -1) {
				cms.config.LAYOUT_KEY = 18;
			}

			Logger.debug("Layout Manager: init elements");
		},

		deactiveateManager : function() {
			Logger.debug("Deactive manager")
			cms.registering.unregisterKeys();
			cms.manager.textMode();
			cms.core.disableEditorInstances();
			$("." + cms.config.CLASS_CONTENT).removeAttr("style");
			$("." + cms.config.CLASS_EMPTY).removeClass(
					cms.config.CLASS_EMPTY);
			$("." + cms.config.CLASS_CONTENT).each(
					function() {
						cms.registering.unregisterDragDrop($(this));
						// Add class to empty blocks so we can identify
						// them
						if ($.trim($(this).html()) == "") {
							$(this).addClass(cms.config.CLASS_EMPTY);
							// check if parent column is empty
							var parent = $(this).parent();
							while (parent.children("."
									+ cms.config.CLASS_BLOCK).length == 1) {
								parent.addClass(cms.config.CLASS_EMPTY);
								parent = parent.parent();
							}
						}
					});

		},

		setMode : function() {
			Logger.debug("Set mode");
			$("body").removeClass(cms.config.CLASS_BODY_LAYOUT_MODE);
			$("body").removeClass(cms.config.CLASS_BODY_TEXT_MODE);

			if (cms.core.layoutKeyPressed && !cms.core.isEditing()) {
				cms.manager.layoutMode();

			} else if (!cms.core.layoutKeyPressed && !cms.core.isDragging
					&& !cms.core.isEditing()) {
				cms.manager.textMode();

			}
		},

		// We can add, drag, remove blocks
		layoutMode : function() {
			Logger.debug("Going in layout mode");
			cms.core.mode = cms.config.LAYOUT_MODE;
			cms.core.disableEditorInstances();
			cms.registering.createDropData();
			cms.core.fillColumnWithLastContent();
			cms.handle.createDropHandles();
			cms.handle.createResizeHandles();
			cms.handle.addContentBtns();
			cms.registering.registerContentButtons();
			$("." + cms.config.CLASS_CONTENT).css('cursor', 'move');
			$("." + cms.config.CLASS_CONTENT).draggable("enable");

			$("body").addClass(cms.config.CLASS_BODY_LAYOUT_MODE);
		},

		// We can edit the text
		textMode : function() {
			Logger.debug("Going in text mode");
			cms.core.mode = cms.config.TEXT_MODE;
			cms.handle.removeResizeHandles();
			cms.handle.removeDropHandles();
			cms.handle.removeContentBtns();
			cms.core.enableEditorInstances();
			$("." + cms.config.CLASS_CONTENT).css('cursor', 'auto');
			$("." + cms.config.CLASS_CONTENT).draggable("disable");
			$("." + cms.config.CLASS_BLOCK).css('height', '');
			$("body").addClass(cms.config.CLASS_BODY_TEXT_MODE);
		},

		_logLocations1 : function(e) {

			var top = this.dropObject.position().top == this.dropObject
					.offset().top ? this.dropObject.offset().top
					: this.dropObject.offset().top
							+ this.dropObject.position().top
			var left = this.dropObject.position().left == this.dropObject
					.offset().left ? this.dropObject.offset().left
					: this.dropObject.offset().left
							+ this.dropObject.position().left

			var yMiddle = (top + this.dropObject.height() * 0.5) - e.pageY;
			var xMiddle = (left + this.dropObject.width() * 0.5) - e.pageX;

			closeToBorderY = Math.abs((this.dropObject.height() * 0.5)
					- Math.abs(yMiddle));
			closeToBorderX = Math.abs((this.dropObject.width() * 0.5)
					- Math.abs(xMiddle));
			Logger.debug("closeX: " + closeToBorderX + "  closeY: "
					+ closeToBorderY + "xMiddle: " + xMiddle + "  yMiddle: "
					+ yMiddle);

		}

	}

));

return t;})(cms);