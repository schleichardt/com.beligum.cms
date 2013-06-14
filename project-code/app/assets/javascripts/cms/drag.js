
var cms = cms || {};
var cms = (function(e){var t = e || {};

t.dragModule = new (Class.extend
({

				// -----CONSTANTS-----

				// -----VARIABLES-----

				// -----CONSTRUCTORS-----

				startDrag : function(event, ui, block) {

					if (cms.coreModule.modeIsText()
							|| cms.blockModule.isLastBlockInWindow(block)) {
						return false;
					}
					$("body").css("cursor", "move");
					cms.coreModule.isDragging = true;
					cms.coreModule.setLayoutWindowForBlock(block);
					if (cms.configModule.LAYOUT_WINDOW.find("."
							+ cms.configModule.CLASS_CONTENT).length == 1) {
						// if this is the onnly element then you can not drop it
						$("#drag-helper").html("You can not drag this block");
					} else {
						$("#drag-helper").html(
								"This block will be dropped on the blue line");
					}
					cms.coreModule.hoverObject = block;
					cms.handleModule.removeResizeHandles();
				},

				stopDrag : function(event, ui, block) {
					$("body").css("cursor", "auto");
					cms.coreModule.draggedObject = block;
					cms.coreModule.saveDropObjectForAnimation = cms.coreModule.dropObject;
					cms.coreModule.saveDropSideForAnimation = cms.coreModule.dropSide;
					cms.dragModule._removeCSSWhileDragging();
					cms.coreModule.draggedObject.hide(
							cms.configModule.ANIMATION_SHOW_SPEED, function() {
								cms.dropModule.addBlock()
							});
					cms.coreModule.isDragging = false;
				},

				overDroppable : function(event, ui, me) {
					cms.coreModule.hoverObject = me;
					cms.coreModule.setLayoutWindowForBlock(me);
				},

				startResize : function(event, ui, me) {
					cms.coreModule.isDragging = true;
					var resizer = $(ui.helper); // resizer element
					$("body").css("cursor", "col-resize");
					// Remove all resizers except this one
					resizer.addClass('isCurrentResizer');
					$(
							'.' + cms.configModule.CLASS_RESIZE_HANDLE
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
							- (grid * (cms.blockModule
									.getWidthFromColumn(leftColumn.get(0)) - 1));
					var maxRight = resizer.position().left
							+ (grid * (cms.blockModule
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
						cms.blockModule.resizeTwoColumns(rightColumn.prev(),
								rightColumn, columnsMoved);

						$(ui.helper).draggable("option", "oldPosition",
								resizer.offset().left);
					}
				},

				stopResize : function(event, ui, me) {
					$("body").css("cursor", "col-auto");
					cms.coreModule.isDragging = false;
					cms.managerModule.setMode();
				},

				// On hover while dragging, calculate the dropsidde and the
				// correct drop object
				calculateDropLocation : function(e) {
					Logger.debug("Calculate drop location");
					var oldDropSide = cms.coreModule.dropSide;
					var labelText = "";
					var percentBigX = 20;
					var percentBigY = 20;
					var percentSmallX = 5;
					var percentSmallY = 5;

					var top = cms.coreModule.hoverObject.offset().top;
					var left = cms.coreModule.hoverObject.offset().left;
					var width = cms.coreModule.hoverObject.outerWidth();
					var height = cms.coreModule.hoverObject.outerHeight();

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
					wLeft = cms.configModule.LAYOUT_WINDOW.offset().left;
					wRight = wLeft + cms.configModule.LAYOUT_WINDOW.outerWidth();
					wTop = cms.configModule.LAYOUT_WINDOW.offset().top;
					wBottom = wTop + cms.configModule.LAYOUT_WINDOW.outerHeight();

					Logger.debug("Windw: " + wLeft + " < " + e.pageX + " < "
							+ wRight + " - Vert -  " + wTop + " < " + e.pageY
							+ " < " + wBottom);
					Logger.debug("Block: " + left + " < " + e.pageX + " < "
							+ (left + width) + " - Vert -  " + top + " < "
							+ e.pageY + " < " + (top + height));

					// if outside the window, show outer drop handles
					if ((wLeft > e.pageX) || (wRight < e.pageX)
							|| (wTop > e.pageY) || (wBottom < e.pageY)) {
						cms.coreModule.dropObject = cms.configModule.LAYOUT_WINDOW;
						if (wLeft > e.pageX) {
							labelText = 'New column';
							cms.coreModule.dropSide = cms.configModule.SIDE_LEFT;
						} else if (wRight < e.pageX) {
							labelText = 'New column';
							cms.coreModule.dropSide = cms.configModule.SIDE_RIGHT;
						} else if (wTop > e.pageY) {
							labelText = 'New row';
							cms.coreModule.dropSide = cms.configModule.SIDE_TOP;
						} else if (wBottom < e.pageY) {
							labelText = 'New row';
							cms.coreModule.dropSide = cms.configModule.SIDE_BOTTOM;
						}
						Logger.debug('Manager: outside layout-window');
					} else {
						Logger.debug('Manager: inside layout-window');

						if (closeToBorderX < percentBigX) {

							if (xMiddle > 0) {
								labelText = 'Insert column';
								cms.coreModule.dropSide = cms.configModule.SIDE_LEFT;
								cms.coreModule.dropObject = cms.coreModule.hoverObject
										.data(cms.coreModule.dropSide);
								Logger
										.debug('Manager: calculated close to left');
							} else {
								labelText = 'Insert column';
								cms.coreModule.dropSide = cms.configModule.SIDE_RIGHT;
								cms.coreModule.dropObject = cms.coreModule.hoverObject
										.data(cms.coreModule.dropSide);
								Logger
										.debug('Manager: calculated close to right');
							}

							// Very close to the border
							if (closeToBorderX < percentSmallX) {
								Logger
										.debug('Manager: calculated VERY close to vertical border');
								labelText = 'New column';
								cms.coreModule.dropObject = cms.coreModule.hoverObject
										.data(cms.coreModule.dropSide + '-extra');
							}

						} else if (closeToBorderY < percentBigY) {
							if (yMiddle > 0) {
								labelText = 'Insert row';
								cms.coreModule.dropSide = cms.configModule.SIDE_TOP;
								cms.coreModule.dropObject = cms.coreModule.hoverObject
										.data(cms.coreModule.dropSide);
								Logger
										.debug('Manager: calculated close to top');
							} else {
								labelText = 'Insert row';
								cms.coreModule.dropSide = cms.configModule.SIDE_BOTTOM;
								cms.coreModule.dropObject = cms.coreModule.hoverObject
										.data(cms.coreModule.dropSide);
								Logger
										.debug('Manager: calculated close to bottom');
							}

							// Very close to the border
							if (closeToBorderY < percentSmallY) {
								labelText = 'New row';
								Logger
										.debug('Manager: calculated VERY close to horizontal border');
								cms.coreModule.dropObject = cms.coreModule.hoverObject
										.data(cms.coreModule.dropSide + '-extra');

							}
						}
					}

					Logger.debug("dropobject: ", cms.coreModule.dropObject);
					Logger.debug("dropside: ", cms.coreModule.dropSide);
					if (!(cms.coreModule.dropObject == null || cms.coreModule.dropObject == undefined)) {
						if (cms.coreModule.dropSide != oldDropSide
								|| !cms.coreModule.dropObject
										.hasClass(cms.configModule.CLASS_DROP_OBJECT)) {
							cms.dragModule._setCSSWhileDragging();
							var selectDropHandle = cms.handleModule
									.createSelectRuler();
							cms.handleModule.createLabel(selectDropHandle,
									labelText);
						}
					}

				},

				// DRAG METHODS
				// this function creates the handle that indicates where a
				// object will be dropped

				_setCSStartDrag : function() {
					cms.coreModule.draggedObject
							.addClass(cms.configModule.CLASS_DRAGGED_OBJECT);
					$("body").css('cursor', 'move');
				},

				_setCSSEndDrag : function() {
					$('.' + cms.configModule.CLASS_DRAGGED_OBJECT).removeClass(
							cms.configModule.CLASS_DRAGGED_OBJECT);
					this._removeCSSWhileDragging();
					$("body").css('cursor', 'auto');
				},

				_setCSSWhileDragging : function() {
					cms.dragModule._removeCSSWhileDragging();
					cms.coreModule.dropObject
							.addClass(cms.configModule.CLASS_DROP_OBJECT);
					cms.coreModule.dropObject.parent().addClass(
							cms.configModule.CLASS_IMPACT_OBJECT);
				},

				_removeCSSWhileDragging : function() {
					$('.' + cms.configModule.CLASS_DROP_OBJECT).removeClass(
							cms.configModule.CLASS_DROP_OBJECT);
					$('.' + cms.configModule.CLASS_IMPACT_OBJECT).removeClass(
							cms.configModule.CLASS_IMPACT_OBJECT);
				}

			}

));

return t;})(cms);