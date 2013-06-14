var cms = cms || {};
var cms = (function(e){var t = e || {};

t.actionsModule = new (Class.extend
({

		layoutKeyDown : function() {
			// xxx
			Logger.debug("Shift Clicked");
			cms.coreModule.layoutKeyPressed = true;
			cms.managerModule.setMode();
		},

		layoutKeyUp : function() {
			Logger.debug("Shift Released");
			cms.coreModule.layoutKeyPressed = false;
			cms.managerModule.setMode();
		},

		escKeyPressed : function() {
			Logger.debug("Esc pressed");
			cms.coreModule.escEditorInstance();
		},

		removeBlockBtnClicked : function(block) {
			cms.modalModule.confirmContentDelete(block.closest("."
					+ cms.configModule.CLASS_CONTENT), cms.dropModule.removeBlock);
			Logger.debug("Manager: mouse down on content block. Delete block");
		},

		addBlockBtnClicked : function(block) {
			cms.coreModule.dropObject = block.closest("."
					+ cms.configModule.CLASS_CONTENT);
			cms.coreModule.dropSide = cms.configModule.SIDE_BOTTOM;
			cms.coreModule.draggedObject = cms.blockModule.createContent(null);
			cms.dropModule.addBlockVerticalToContent(cms.coreModule.draggedObject,
					cms.coreModule.dropSide);
			cms.coreModule.clearDropObject();
			// Now clean the stack where we dropped the draggedObject
			cms.cleanModule.cleanEmptyElements();

			setTimeout(function() {
				if (cms.coreModule.draggedObject.effect) {
					cms.coreModule.draggedObject.effect("highlight", {
						color : cms.configModule.COLOR_ADD_CONTENT_HIGHLIGHT
					}, 1500);
				}
			}, 0);

			// And init the page like before the drag, we do this here, after
			// the animation
			cms.coreModule.draggedObject.show(cms.configModule.ANIMATION_SHOW_SPEED,
					function() {
						cms.managerModule.setMode();
					});
		}

	}

));

return t;})(cms);