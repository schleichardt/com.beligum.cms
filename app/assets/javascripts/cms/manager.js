
var cms = cms || {};
var cms = (function(e){var t = e || {};

t.managerModule = new (Class.extend
({
	init: function() {
		$(document).ready(function() {
			Logger.debug("Init cms");
			cms.managerModule.initEditor();
			cms.managerModule.activateManager();
			cms.adminModule.initAdminPanel(-1);
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
				// cms.managerModule.textMode();
			})
		},

		activateManager : function() {
			Logger.debug("Active manager")
			cms.registeringModule.registerKeys();
			$("." + cms.configModule.CLASS_CONTENT).each(function() {
				cms.coreModule.setContentId($(this));
				cms.registeringModule.registerDragDrop($(this));
			});
			cms.managerModule.textMode();

			$("." + cms.configModule.CLASS_EMPTY).removeClass(
					cms.configModule.CLASS_EMPTY);

			// When on mac change ctrl key to alt
			// http://stackoverflow.com/questions/2527011/how-do-i-check-if-the-browser-is-running-on-a-mac
			if (navigator.userAgent.indexOf("Mac OS X") != -1) {
				cms.configModule.LAYOUT_KEY = 18;
			}

			Logger.debug("Layout Manager: init elements");
		},

		deactiveateManager : function() {
			Logger.debug("Deactive manager")
			cms.registeringModule.unregisterKeys();
			cms.managerModule.textMode();
			cms.coreModule.disableEditorInstances();
			$("." + cms.configModule.CLASS_CONTENT).removeAttr("style");
			$("." + cms.configModule.CLASS_EMPTY).removeClass(
					cms.configModule.CLASS_EMPTY);
			$("." + cms.configModule.CLASS_CONTENT).each(
					function() {
						cms.registeringModule.unregisterDragDrop($(this));
						// Add class to empty blocks so we can identify
						// them
						if ($.trim($(this).html()) == "") {
							$(this).addClass(cms.configModule.CLASS_EMPTY);
							// check if parent column is empty
							var parent = $(this).parent();
							while (parent.children("."
									+ cms.configModule.CLASS_BLOCK).length == 1) {
								parent.addClass(cms.configModule.CLASS_EMPTY);
								parent = parent.parent();
							}
						}
					});

		},

		setMode : function() {
			Logger.debug("Set mode");
			$("body").removeClass(cms.configModule.CLASS_BODY_LAYOUT_MODE);
			$("body").removeClass(cms.configModule.CLASS_BODY_TEXT_MODE);

			if (cms.coreModule.layoutKeyPressed && !cms.coreModule.isEditing()) {
				cms.managerModule.layoutMode();

			} else if (!cms.coreModule.layoutKeyPressed && !cms.coreModule.isDragging
					&& !cms.coreModule.isEditing()) {
				cms.managerModule.textMode();

			}
		},

		// We can add, drag, remove blocks
		layoutMode : function() {
			Logger.debug("Going in layout mode");
			cms.coreModule.mode = cms.configModule.LAYOUT_MODE;
			cms.coreModule.disableEditorInstances();
			cms.registeringModule.createDropData();
			cms.coreModule.fillColumnWithLastContent();
			cms.handleModule.createDropHandles();
			cms.handleModule.createResizeHandles();
			cms.handleModule.addContentBtns();
			cms.registeringModule.registerContentButtons();
			$("." + cms.configModule.CLASS_CONTENT).css('cursor', 'move');
			$("." + cms.configModule.CLASS_CONTENT).draggable("enable");

			$("body").addClass(cms.configModule.CLASS_BODY_LAYOUT_MODE);
		},

		// We can edit the text
		textMode : function() {
			Logger.debug("Going in text mode");
			cms.coreModule.mode = cms.configModule.TEXT_MODE;
			cms.handleModule.removeResizeHandles();
			cms.handleModule.removeDropHandles();
			cms.handleModule.removeContentBtns();
			cms.coreModule.enableEditorInstances();
			$("." + cms.configModule.CLASS_CONTENT).css('cursor', 'auto');
			$("." + cms.configModule.CLASS_CONTENT).draggable("disable");
			$("." + cms.configModule.CLASS_BLOCK).css('height', '');
			$("body").addClass(cms.configModule.CLASS_BODY_TEXT_MODE);
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