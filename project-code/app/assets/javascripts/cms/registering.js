
var cms = cms || {};
var cms = (function(e){var t = e || {};

t.registeringModule = new (Class.extend
({
					
				// We register the shift button to show the drop handles
				// Called on init page

				unregisterKeys : function() {
					$(document).unbind("keydown");
					$(document).unbind("keyup");
				},

				registerKeys : function() {
					Logger.debug("Registering Shift");
					$(document).keydown(function(e) {
						if (e.keyCode == cms.configModule.LAYOUT_KEY) {
							cms.actionsModule.layoutKeyDown();
						}

						if (e.keyCode == cms.configModule.ESC_KEY) {
							cms.actionsModule.escKeyPressed();
						}

					});

					$(document).keyup(function(e) {
						if (e.keyCode == cms.configModule.LAYOUT_KEY) {
							cms.actionsModule.layoutKeyUp();
						}
					});

				},

				registerContentButtons : function() {
					Logger.debug("Registering content buttons")
					$("." + cms.configModule.CLASS_REMOVE_CONTENT).on("click",
							function() {
								cms.actionsModule.removeBlockBtnClicked($(this));
							});

					$("." + cms.configModule.CLASS_ADD_CONTENT).on("click",
							function() {
								cms.actionsModule.addBlockBtnClicked($(this));

							});

					$("." + cms.configModule.CLASS_SAVE_CONTENT).on("click",
							function() {
								cms.adminModule.save();
							});

				},

				unregisterDragDrop : function(element) {
					element.draggable("destroy");
					element.droppable("destroy");
				},

				registerDragDrop : function(element) {
					Logger.debug("Registering content element for DragandDrop");
					element.draggable({
						helper : function() {
							return $("<div />").attr("id", "drag-helper")
									.addClass("badge badge-info");
						},
						// helper: "clone",
						// revert: true,
						cursorAt : {
							left : 0,
							top : 0
						},
						start : function(event, ui) {
							cms.dragModule.startDrag(event, ui, $(this));
						},

						drag : function(event, ui) {
							cms.dragModule.calculateDropLocation(event);
						},

						stop : function(event, ui) {
							cms.dragModule.stopDrag(event, ui, $(this));
						}
					});

					element.droppable({
						tolerance : "pointer",
						accept : "." + cms.configModule.CLASS_CONTENT,

						over : function(event, ui) {
							cms.dragModule.overDroppable(event, ui, $(this));
						}

					});
				},

				registerResizerHandle : function(resizer) {
					Logger.debug("register resizer handles");

					resizer.draggable({
						axis : "x",
						containment : 'parent',
						start : function(event, ui) {
							cms.dragModule.startResize(event, ui, $(this));
						},
						drag : function(event, ui) {
							cms.dragModule.doResize(event, ui, $(this));
						},
						stop : function(event, ui) {
							cms.dragModule.stopResize(event, ui, $(this));
						}
					});

				},

				// registerPaddingHandle: function(handle) {
				// Logger.debug("register padding handle");
				//		
				// handle.draggable({
				// axis: "y",
				// containment: 'parent',
				// start: function( event, ui ) {
				// var resizer = $( ui.helper); // resizer element
				// // Remove all resizers except this one
				// handle.addClass('isCurrentResizer');
				// $('.' + cms.configModule.CLASS_PADDING_HANDLE +
				// ':not(.isCurrentResizer)').remove();
				// resizer.removeClass('isCurrentResizer');
				// var draggable = $(this).data("draggable");
				// if (handle.hasClass(cms.configModule.CLASS_PADDING_HANDLE_LEFT)
				// || handle.hasClass(cms.configModule.CLASS_PADDING_HANDLE_RIGHT))
				// {
				// draggable.options.axis = "x";
				// }
				//				
				//			
				// $( ui.helper ).draggable( "option", "oldPosition",
				// resizer.offset().left);
				// },
				// drag: function(event, ui) {
				// var handle = $( ui.helper );
				// var block = handle.data("block");
				// Logger.debug("position : " + handle.position().top);
				// if (handle.hasClass(cms.configModule.CLASS_PADDING_HANDLE_TOP)) {
				// block.css('paddingTop', (handle.position().top -
				// block.position().top));
				// } else if
				// (handle.hasClass(cms.configModule.CLASS_PADDING_HANDLE_LEFT)) {
				// block.css('paddingLeft', (handle.position().left -
				// block.position().left));
				// } else if
				// (handle.hasClass(cms.configModule.CLASS_PADDING_HANDLE_RIGHT)) {
				// block.css('paddingRight', (block.outerWidth() -
				// handle.position().left));
				// Logger.debug("Padding right: " + (block.outerWidth() -
				// handle.position().left))
				// }
				//				
				//
				// },
				//			
				//		
				// });
				//		
				// },
				//	

				stop : function(event, ui) {
					var block = handle.data("block");
					// Hide and show block to force padding-right
					if (block.next().length > 0) {
						var nextBlock = block.next();
						block.remove();
						nextBlock.before(block);
					} else if (block.prev().length > 0) {
						var prevBlock = block.prev();
						block.remove();
						prevBlock.after(block);
					} else {
						var parent = block.parent();
						block.remove();
						parent.append(block);
					}
				},

				createDropData : function() {
					this.removeDropData();
					this._addDropData();

				},

				removeDropData : function() {
					$("." + cms.configModule.CLASS_CONTENT).removeData(
							cms.configModule.SIDE_LEFT);
					$("." + cms.configModule.CLASS_CONTENT).removeData(
							cms.configModule.SIDE_RIGHT);
					$("." + cms.configModule.CLASS_CONTENT).removeData(
							cms.configModule.SIDE_TOP);
					$("." + cms.configModule.CLASS_CONTENT).removeData(
							cms.configModule.SIDE_BOTTOM);

					$("." + cms.configModule.CLASS_CONTENT).removeData(
							cms.configModule.SIDE_LEFT + '-extra');
					$("." + cms.configModule.CLASS_CONTENT).removeData(
							cms.configModule.SIDE_RIGHT + '-extra');
					$("." + cms.configModule.CLASS_CONTENT).removeData(
							cms.configModule.SIDE_TOP + '-extra');
					$("." + cms.configModule.CLASS_CONTENT).removeData(
							cms.configModule.SIDE_BOTTOM)
							+ '-extra';

					$('.' + cms.configModule.CLASS_CONTENT).css('height', 'auto');
				},

				_addDropData : function() {

					$('.' + cms.configModule.CLASS_CONTENT)
							.each(
									function() {
										// Last content in column fill column
										element = $(this);

										element.data(cms.configModule.SIDE_LEFT,
												element);
										element.data(cms.configModule.SIDE_RIGHT,
												element);
										element.data(cms.configModule.SIDE_TOP,
												element);
										element.data(cms.configModule.SIDE_BOTTOM,
												element);

										element.data(cms.configModule.SIDE_LEFT
												+ '-extra', element);
										element.data(cms.configModule.SIDE_RIGHT
												+ '-extra', element);
										element.data(cms.configModule.SIDE_TOP
												+ '-extra', element);
										element.data(cms.configModule.SIDE_BOTTOM
												+ '-extra', element);

										// Define where to drop our dragged
										// object

										// If content element is only element in
										// column then
										// left and right added to parentColumn
										// If element is in the outer left
										// column then add to
										// parent column
										// If element is in the outer right
										// column then add to
										// parent column
										if (element.prevAll('.'
												+ cms.configModule.CLASS_CONTENT).length == 0
												&& element
														.nextAll('.'
																+ cms.configModule.CLASS_CONTENT).length == 0) {
											element.data(
													cms.configModule.SIDE_LEFT,
													element.parent());
											element.data(
													cms.configModule.SIDE_RIGHT,
													element.parent());
											element.data(cms.configModule.SIDE_LEFT
													+ '-extra', element
													.parent());
											element.data(
													cms.configModule.SIDE_RIGHT
															+ '-extra', element
															.parent());

										} else {
											element.data(cms.configModule.SIDE_LEFT
													+ '-extra', element
													.parent());
											element.data(
													cms.configModule.SIDE_RIGHT
															+ '-extra', element
															.parent());
										}

										if (element.parent().prevAll().length == 0
												&& !element
														.parent()
														.hasClass(
																cms.configModule.CLASS_WINDOW)) {
											element
													.data(
															cms.configModule.SIDE_LEFT
																	+ '-extra',
															element.parent()
																	.parent()
																	.parent());
										} else if (element.nextAll().length == 0) {
											element.data(
													cms.configModule.SIDE_RIGHT
															+ '-extra', element
															.parent().parent()
															.parent());
										}

										// If dropobject is first in column then
										// add to top of
										// parent row
										// If dropobject is last in column then
										// add to bottom of
										// parent row
										if (element.parent().parent().hasClass(
												cms.configModule.CLASS_ROW)) {
											if (element
													.prevAll('.'
															+ cms.configModule.CLASS_CONTENT).length == 0) {
												element.data(
														cms.configModule.SIDE_TOP
																+ '-extra',
														element.parent()
																.parent())
											} else if (element
													.nextAll('.'
															+ cms.configModule.CLASS_CONTENT).length == 0) {
												element
														.data(
																cms.configModule.SIDE_BOTTOM
																		+ '-extra',
																element
																		.parent()
																		.parent());
											}
										}

									});

				}

			}

));

return t;})(cms);
