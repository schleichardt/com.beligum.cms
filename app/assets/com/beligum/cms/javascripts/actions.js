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

t.actions = new (Class.extend
({

		layoutKeyDown : function() {
			// xxx
			Logger.debug("Shift Clicked");
			cms.core.layoutKeyPressed = true;
			cms.manager.setMode();
		},

		layoutKeyUp : function() {
			Logger.debug("Shift Released");
			cms.core.layoutKeyPressed = false;
			cms.manager.setMode();
		},

		escKeyPressed : function() {
			Logger.debug("Esc pressed");
			cms.core.escEditorInstance();
		},

		removeBlockBtnClicked : function(block) {
			cms.modal.confirmContentDelete(block.closest("."
					+ cms.config.CLASS_CONTENT), cms.drop.removeBlock);
			Logger.debug("Manager: mouse down on content block. Delete block");
		},

		addBlockBtnClicked : function(block) {
			cms.core.dropObject = block.closest("."
					+ cms.config.CLASS_CONTENT);
			cms.core.dropSide = cms.config.SIDE_BOTTOM;
			cms.core.draggedObject = cms.block.createContent(null);
			cms.drop.addBlockVerticalToContent(cms.core.draggedObject,
					cms.core.dropSide);
			cms.core.clearDropObject();
			// Now clean the stack where we dropped the draggedObject
			cms.clean.cleanEmptyElements();

			setTimeout(function() {
				if (cms.core.draggedObject.effect) {
					cms.core.draggedObject.effect("highlight", {
						color : cms.config.COLOR_ADD_CONTENT_HIGHLIGHT
					}, 1500);
				}
			}, 0);

			// And init the page like before the drag, we do this here, after
			// the animation
			cms.core.draggedObject.show(cms.config.ANIMATION_SHOW_SPEED,
					function() {
						cms.manager.setMode();
					});
		}

	}

));

return t;})(cms);