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

t.drag = new (Class.extend
({

				// -----CONSTANTS-----

				// -----VARIABLES-----

				// -----CONSTRUCTORS-----

				startDrag : function(event, ui, block) {

					if (cms.core.modeIsText()
							|| cms.block.isLastBlockInWindow(block)) {
						return false;
					}
					$("body").css("cursor", "move");
					// Move the draghelper to the body so absolute position is always absolute to page
					$("body").append($("#drag-helper"));
					cms.core.isDragging = true;
					cms.core.setLayoutWindowForBlock(block);
					if (cms.config.LAYOUT_WINDOW.find("."
							+ cms.config.CLASS_CONTENT).length == 1) {
						// if this is the only element then you can not drop it
						$("#drag-helper").html("You can not drag this block");
					} else {
						$("#drag-helper").html(
								"This block will be dropped on the blue line");
					}
					
					cms.core.hoverObject = block;
					cms.handle.removeResizeHandles();
				},

				stopDrag : function(event, ui, block) {
					$("body").css("cursor", "auto");
					cms.core.draggedObject = block;
					cms.core.saveDropObjectForAnimation = cms.core.dropObject;
					cms.core.saveDropSideForAnimation = cms.core.dropSide;
					cms.drag._removeCSSWhileDragging();
					cms.core.draggedObject.hide(
							cms.config.ANIMATION_SHOW_SPEED, function() {
								cms.drop.addBlock()
							});
					cms.core.isDragging = false;
				},

				overDroppable : function(event, ui, me) {
					cms.core.hoverObject = me;
					cms.core.setLayoutWindowForBlock(me);
				},

				startResize : function(event, ui, me) {
					cms.core.isDragging = true;
					var resizer = $(ui.helper); // resizer element
					$("body").css("cursor", "col-resize");
					// Remove all resizers except this one
					resizer.addClass('isCurrentResizer');
					$(
							'.' + cms.config.CLASS_RESIZE_HANDLE
									+ ':not(.isCurrentResizer)').remove();
					resizer.removeClass('isCurrentResizer');

					// Calculate basic values
					// grid is the width of 1 column. the draggable stays on the
					// grid
					var rightColumn = resizer.data('column');
					var leftColumn = rightColumn.prev();
					var gutterWidth = parseFloat(rightColumn.css('marginLeft'));
					var colWidth = (rightColumn.parent().outerWidth() - (gutterWidth * 11)) / 12;
					var grid = colWidth + gutterWidth; //
					Logger.debug(me.data("draggable"));
					var draggable = me.data("draggable");

					// set containment Left and right to absolute numbers
					var minLeft = resizer.position().left
							- (grid * (cms.block
									.getWidthFromColumn(leftColumn.get(0)) - 1));
					var maxRight = resizer.position().left
							+ (grid * (cms.block
									.getWidthFromColumn(rightColumn.get(0)) - 1));
					draggable.containment[0] = minLeft;
					draggable.containment[2] = maxRight;

					$(ui.helper).draggable("option", "oldPosition",
							resizer.offset().left);
					$(ui.helper).draggable("option", "grid", [ grid, grid ]);
				},

				doResize : function(event, ui, me) {
					var resizer = $(ui.helper);
					var rightColumn = resizer.data('column');
					if (resizer.offset().left != resizer.draggable("option",
							"oldPosition")) {
						Logger
								.debug('resizer Left: '
										+ resizer.position().left);
						var columnsMoved = Math
								.round((resizer.offset().left - resizer
										.draggable("option", "oldPosition"))
										/ resizer.draggable("option", "grid")[0]);
						cms.block.resizeTwoColumns(rightColumn.prev(),
								rightColumn, columnsMoved);

						$(ui.helper).draggable("option", "oldPosition",
								resizer.offset().left);
					}
				},

				stopResize : function(event, ui, me) {
					$("body").css("cursor", "col-auto");
					cms.core.isDragging = false;
					cms.manager.setMode();
				},

				// On hover while dragging, calculate the dropsidde and the
				// correct drop object
				calculateDropLocation : function(e) {
					Logger.debug("Calculate drop location");
					var oldDropSide = cms.core.dropSide;
					var labelText = "";
					var percentBigX = 20;
					var percentBigY = 20;
					var percentSmallX = 5;
					var percentSmallY = 5;

					var top = cms.core.hoverObject.offset().top;
					var left = cms.core.hoverObject.offset().left;
					var width = cms.core.hoverObject.outerWidth();
					var height = cms.core.hoverObject.outerHeight();

					// calculate how far the cursor is from the middle of the
					// block

					var yMiddle = (top + height * 0.5) - e.pageY; // negative
																	// if closer
																	// to bottom
					var xMiddle = (left + width * 0.5) - e.pageX; // negative
																	// if closer
																	// to right

					// calculate how close we are from the border of the block
					closeToBorderY = (height * 0.5) - Math.abs(yMiddle);
					closeToBorderX = (width * 0.5) - Math.abs(xMiddle);

					// position of our window
					wLeft = cms.config.LAYOUT_WINDOW.offset().left;
					wRight = wLeft + cms.config.LAYOUT_WINDOW.outerWidth();
					wTop = cms.config.LAYOUT_WINDOW.offset().top;
					wBottom = wTop + cms.config.LAYOUT_WINDOW.outerHeight();

					Logger.debug("Windw: " + wLeft + " < " + e.pageX + " < "
							+ wRight + " - Vert -  " + wTop + " < " + e.pageY
							+ " < " + wBottom);
					Logger.debug("Block: " + left + " < " + e.pageX + " < "
							+ (left + width) + " - Vert -  " + top + " < "
							+ e.pageY + " < " + (top + height));

					// if outside the window, show outer drop handles
					if ((wLeft > e.pageX) || (wRight < e.pageX)
							|| (wTop > e.pageY) || (wBottom < e.pageY)) {
						cms.core.dropObject = cms.config.LAYOUT_WINDOW;
						if (wLeft > e.pageX) {
							labelText = 'New column';
							cms.core.dropSide = cms.config.SIDE_LEFT;
						} else if (wRight < e.pageX) {
							labelText = 'New column';
							cms.core.dropSide = cms.config.SIDE_RIGHT;
						} else if (wTop > e.pageY) {
							labelText = 'New row';
							cms.core.dropSide = cms.config.SIDE_TOP;
						} else if (wBottom < e.pageY) {
							labelText = 'New row';
							cms.core.dropSide = cms.config.SIDE_BOTTOM;
						}
						Logger.debug('Manager: outside layout-window');
					} else {
						Logger.debug('Manager: inside layout-window');

						if (closeToBorderX < percentBigX) {

							if (xMiddle > 0) {
								labelText = 'Insert column';
								cms.core.dropSide = cms.config.SIDE_LEFT;
								cms.core.dropObject = cms.core.hoverObject
										.data(cms.core.dropSide);
								Logger
										.debug('Manager: calculated close to left');
							} else {
								labelText = 'Insert column';
								cms.core.dropSide = cms.config.SIDE_RIGHT;
								cms.core.dropObject = cms.core.hoverObject
										.data(cms.core.dropSide);
								Logger
										.debug('Manager: calculated close to right');
							}

							// Very close to the border
							if (closeToBorderX < percentSmallX) {
								Logger
										.debug('Manager: calculated VERY close to vertical border');
								labelText = 'New column';
								cms.core.dropObject = cms.core.hoverObject
										.data(cms.core.dropSide + '-extra');
							}

						} else if (closeToBorderY < percentBigY) {
							if (yMiddle > 0) {
								labelText = 'Insert row';
								cms.core.dropSide = cms.config.SIDE_TOP;
								cms.core.dropObject = cms.core.hoverObject
										.data(cms.core.dropSide);
								Logger
										.debug('Manager: calculated close to top');
							} else {
								labelText = 'Insert row';
								cms.core.dropSide = cms.config.SIDE_BOTTOM;
								cms.core.dropObject = cms.core.hoverObject
										.data(cms.core.dropSide);
								Logger
										.debug('Manager: calculated close to bottom');
							}

							// Very close to the border
							if (closeToBorderY < percentSmallY) {
								labelText = 'New row';
								Logger
										.debug('Manager: calculated VERY close to horizontal border');
								cms.core.dropObject = cms.core.hoverObject
										.data(cms.core.dropSide + '-extra');

							}
						}
					}

					Logger.debug("dropobject: ", cms.core.dropObject);
					Logger.debug("dropside: ", cms.core.dropSide);
					if (!(cms.core.dropObject == null || cms.core.dropObject == undefined)) {
						if (cms.core.dropSide != oldDropSide
								|| !cms.core.dropObject
										.hasClass(cms.config.CLASS_DROP_OBJECT)) {
							cms.drag._setCSSWhileDragging();
							var selectDropHandle = cms.handle
									.createSelectRuler();
							cms.handle.createLabel(selectDropHandle,
									labelText);
						}
					}

				},

				// DRAG METHODS
				// this function creates the handle that indicates where a
				// object will be dropped

				_setCSStartDrag : function() {
					cms.core.draggedObject
							.addClass(cms.config.CLASS_DRAGGED_OBJECT);
					$("body").css('cursor', 'move');
				},

				_setCSSEndDrag : function() {
					$('.' + cms.config.CLASS_DRAGGED_OBJECT).removeClass(
							cms.config.CLASS_DRAGGED_OBJECT);
					this._removeCSSWhileDragging();
					$("body").css('cursor', 'auto');
				},

				_setCSSWhileDragging : function() {
					cms.drag._removeCSSWhileDragging();
					cms.core.dropObject
							.addClass(cms.config.CLASS_DROP_OBJECT);
					cms.core.dropObject.parent().addClass(
							cms.config.CLASS_IMPACT_OBJECT);
				},

				_removeCSSWhileDragging : function() {
					$('.' + cms.config.CLASS_DROP_OBJECT).removeClass(
							cms.config.CLASS_DROP_OBJECT);
					$('.' + cms.config.CLASS_IMPACT_OBJECT).removeClass(
							cms.config.CLASS_IMPACT_OBJECT);
				}

			}

));

return t;})(cms);