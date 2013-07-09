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

t.registering = new (Class.extend
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
						if (e.keyCode == cms.config.LAYOUT_KEY) {
							cms.actions.layoutKeyDown();
						}

						if (e.keyCode == cms.config.ESC_KEY) {
							cms.actions.escKeyPressed();
						}

					});

					$(document).keyup(function(e) {
						if (e.keyCode == cms.config.LAYOUT_KEY) {
							cms.actions.layoutKeyUp();
						}
					});

				},

				registerContentButtons : function() {
					Logger.debug("Registering content buttons")
					$("." + cms.config.CLASS_REMOVE_CONTENT).on("click",
							function(event) {
								cms.actions.removeBlockBtnClicked($(this));
							});

					$("." + cms.config.CLASS_ADD_CONTENT).on("click",
							function(event) {
								cms.actions.addBlockBtnClicked($(this));

							});

					$("." + cms.config.CLASS_SAVE_CONTENT).on("click",
							function() {
								cms.admin.save();
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
							left : -15,
							top : 0
						},
						start : function(event, ui) {
							return cms.drag.startDrag(event, ui, $(this));
						},

						drag : function(event, ui) {
							cms.drag.calculateDropLocation(event);
						},

						stop : function(event, ui) {
							cms.drag.stopDrag(event, ui, $(this));
						}
					});

					element.droppable({
						tolerance : "pointer",
						accept : "." + cms.config.CLASS_CONTENT,

						over : function(event, ui) {
							cms.drag.overDroppable(event, ui, $(this));
						}

					});
				},

				registerResizerHandle : function(resizer) {
					Logger.debug("register resizer handles");

					resizer.draggable({
						axis : "x",
						containment : 'parent',
						start : function(event, ui) {
							cms.drag.startResize(event, ui, $(this));
						},
						drag : function(event, ui) {
							cms.drag.doResize(event, ui, $(this));
						},
						stop : function(event, ui) {
							cms.drag.stopResize(event, ui, $(this));
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
				// $('.' + cms.config.CLASS_PADDING_HANDLE +
				// ':not(.isCurrentResizer)').remove();
				// resizer.removeClass('isCurrentResizer');
				// var draggable = $(this).data("draggable");
				// if (handle.hasClass(cms.config.CLASS_PADDING_HANDLE_LEFT)
				// || handle.hasClass(cms.config.CLASS_PADDING_HANDLE_RIGHT))
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
				// if (handle.hasClass(cms.config.CLASS_PADDING_HANDLE_TOP)) {
				// block.css('paddingTop', (handle.position().top -
				// block.position().top));
				// } else if
				// (handle.hasClass(cms.config.CLASS_PADDING_HANDLE_LEFT)) {
				// block.css('paddingLeft', (handle.position().left -
				// block.position().left));
				// } else if
				// (handle.hasClass(cms.config.CLASS_PADDING_HANDLE_RIGHT)) {
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
					$("." + cms.config.CLASS_CONTENT).removeData(
							cms.config.SIDE_LEFT);
					$("." + cms.config.CLASS_CONTENT).removeData(
							cms.config.SIDE_RIGHT);
					$("." + cms.config.CLASS_CONTENT).removeData(
							cms.config.SIDE_TOP);
					$("." + cms.config.CLASS_CONTENT).removeData(
							cms.config.SIDE_BOTTOM);

					$("." + cms.config.CLASS_CONTENT).removeData(
							cms.config.SIDE_LEFT + '-extra');
					$("." + cms.config.CLASS_CONTENT).removeData(
							cms.config.SIDE_RIGHT + '-extra');
					$("." + cms.config.CLASS_CONTENT).removeData(
							cms.config.SIDE_TOP + '-extra');
					$("." + cms.config.CLASS_CONTENT).removeData(
							cms.config.SIDE_BOTTOM)
							+ '-extra';

					//$('.' + cms.config.CLASS_CONTENT).css('height', 'auto');
				},

				_addDropData : function() {

					$('.' + cms.config.CLASS_CONTENT)
							.each(
									function() {
										// Last content in column fill column
										element = $(this);

										element.data(cms.config.SIDE_LEFT,
												element);
										element.data(cms.config.SIDE_RIGHT,
												element);
										element.data(cms.config.SIDE_TOP,
												element);
										element.data(cms.config.SIDE_BOTTOM,
												element);

										element.data(cms.config.SIDE_LEFT
												+ '-extra', element);
										element.data(cms.config.SIDE_RIGHT
												+ '-extra', element);
										element.data(cms.config.SIDE_TOP
												+ '-extra', element);
										element.data(cms.config.SIDE_BOTTOM
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
												+ cms.config.CLASS_CONTENT).length == 0
												&& element
														.nextAll('.'
																+ cms.config.CLASS_CONTENT).length == 0) {
											element.data(
													cms.config.SIDE_LEFT,
													element.parent());
											element.data(
													cms.config.SIDE_RIGHT,
													element.parent());
											element.data(cms.config.SIDE_LEFT
													+ '-extra', element
													.parent());
											element.data(
													cms.config.SIDE_RIGHT
															+ '-extra', element
															.parent());

										} else {
											element.data(cms.config.SIDE_LEFT
													+ '-extra', element
													.parent());
											element.data(
													cms.config.SIDE_RIGHT
															+ '-extra', element
															.parent());
										}

										if (element.parent().prevAll().length == 0
												&& !element
														.parent()
														.hasClass(
																cms.config.CLASS_WINDOW)) {
											element
													.data(
															cms.config.SIDE_LEFT
																	+ '-extra',
															element.parent()
																	.parent()
																	.parent());
										} else if (element.nextAll().length == 0) {
											element.data(
													cms.config.SIDE_RIGHT
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
												cms.config.CLASS_ROW)) {
											if (element
													.prevAll('.'
															+ cms.config.CLASS_CONTENT).length == 0) {
												element.data(
														cms.config.SIDE_TOP
																+ '-extra',
														element.parent()
																.parent())
											} else if (element
													.nextAll('.'
															+ cms.config.CLASS_CONTENT).length == 0) {
												element
														.data(
																cms.config.SIDE_BOTTOM
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
