
var cms = cms || {};
var cms = (function(e){var t = e || {};

t.drop = new (Class.extend
({
		// DROP METHODS
		// On drop, send the dragged object to the right drop object
		addBlock: function() {
			cms.core.dropObject = cms.core.saveDropObjectForAnimation;
			cms.core.dropSide = cms.core.saveDropSideForAnimation;
			var toClean = cms.core.draggedObject.parent();
			if ((cms.core.dropSide == cms.config.SIDE_TOP || cms.core.dropSide == cms.config.SIDE_BOTTOM) && 
					(cms.core.dropObject.hasClass(cms.config.CLASS_ROW))) {
				cms.drop.addBlockVerticalToRow(cms.core.draggedObject, cms.core.dropSide);
			} else if ((cms.core.dropSide == cms.config.SIDE_RIGHT || cms.core.dropSide == cms.config.SIDE_LEFT) && 
					(cms.core.dropObject.hasClass(cms.config.CLASS_COLUMN))) {
				cms.drop.addBlockSideToColumn(cms.core.draggedObject, cms.core.dropSide);
			} else if ((cms.core.dropSide == cms.config.SIDE_TOP || cms.core.dropSide == cms.config.SIDE_BOTTOM) && 
					(cms.core.dropObject.hasClass(cms.config.CLASS_CONTENT))) {
				cms.drop.addBlockVerticalToContent(cms.core.draggedObject, cms.core.dropSide);
			} else if ((cms.core.dropSide == cms.config.SIDE_RIGHT || cms.core.dropSide == cms.config.SIDE_LEFT) && 
					(cms.core.dropObject.hasClass(cms.config.CLASS_CONTENT))) {
				cms.drop.addBlockSideToContent(cms.core.draggedObject, cms.core.dropSide);
			} else if ((cms.core.dropSide == cms.config.SIDE_TOP || cms.core.dropSide == cms.config.SIDE_BOTTOM) && 
					(cms.core.dropObject.hasClass(cms.config.CLASS_WINDOW))) {
				cms.drop.addBlockVerticalToColumn(cms.core.draggedObject, cms.core.dropSide);
			}
			
			// Now Clean oldParent from where we took the dragged element
			cms.clean.cleanEmptyElements();

			cms.core.clearDropObject();
			// Now clean the stack where we droppend the draggedObject
			//dragcms.drop.cleanNestedRows(cms.core.draggedObject);
			
			// And init the page like before the drag, we do this here, after the animation
			cms.core.draggedObject.show(cms.config.ANIMATION_SHOW_SPEED, 
					function() {
						cms.drop.finishDrop();
					});
		},
		
		addBlockVerticalToRow: function(draggedContent, position) {
			
			var oldParent = draggedContent.parent();
			var newRow = cms.block.createRow();
			var columnWithNewContent = cms.block.createColumn();
			
			columnWithNewContent.append(draggedContent);
			newRow.append(columnWithNewContent);
			if (position == cms.config.SIDE_TOP) {
				cms.core.dropObject.before(newRow);
				Logger.debug("Row: Added block before row vertical position: " + position);
			} else {
				cms.core.dropObject.after(newRow);
				Logger.debug("Row: Added block after row vertical position: " + position);
			}
			
			
		},
		
		
		addBlockSideToColumn: function(draggedContent, position) {
			// Contentblock naast Row
			// View wordt eem column
			// Nieuwe Row maken met column en twee kolommen
			// Column 1 is our draggedColumn
			// Column 2 contains all the old rows inside the window
			Logger.debug("Add block to column vertical position: " + position);
			// Save for later to clean this up
			var oldParent = draggedContent.parent();
			
			//Get count content boxes for this column
			// if 1 then just add new column before this column
			// if more (stacked) then add row and two columns with both contents
			if (cms.core.dropObject.hasClass(cms.config.CLASS_WINDOW)) {
				// Alles wrappen en een nieuwe Columm toevoegen
				var children = cms.config.LAYOUT_WINDOW.children('.' + cms.config.CLASS_BLOCK);
				var newRow = cms.block.createRow();
				var columnWithOldContent = cms.block.createColumn();
				var columnWithNewContent = cms.block.createColumn();
				columnWithOldContent.append(children);
				columnWithNewContent.append(draggedContent);
				newRow.append(columnWithOldContent);
				cms.block.addColumnToColumn(columnWithOldContent, columnWithNewContent, position);
				cms.config.LAYOUT_WINDOW.append(newRow);
				Logger.debug('Column: added dragged block to column on side: ' + position);
			} else {
				var columnWithNewContent = cms.block.createColumn();
				columnWithNewContent.append(draggedContent);
				cms.block.addColumnToColumn(cms.core.dropObject, columnWithNewContent, position);
				Logger.debug('Column: added dragged block to column on side: ' + position);
			}
		
		},
		
		addBlockVerticalToColumn: function(draggedContent, position) {
			// Contentblock naast Row
			// View wordt eem column
			// Nieuwe Row maken met column en twee kolommen
			// Column 1 is our draggedColumn
			// Column 2 contains all the old rows inside the window
			Logger.debug("Add block to column vertical position: " + position);
			// Save for later to clean this up
			var oldParent = draggedContent.parent();
			
			// Layout window is the only column where we can add blocks to top of bottom
			// If top add before first row (child of layout window)
			// If bottom add after last row (child of layout Window
			if (cms.core.dropObject.hasClass(cms.config.CLASS_WINDOW)) {
				var newRow = cms.block.createRow();
				var columnWithNewContent = cms.block.createColumn();
				columnWithNewContent.append(draggedContent);
				newRow.append(columnWithNewContent);
				if (position == cms.config.SIDE_TOP) {
					cms.core.dropObject.children().first().before(newRow);
				} else {
					cms.core.dropObject.children().last().after(newRow);
				}
					
			} else {
				Logger.error('Column: we can not add blocks to top of bottom of column');
			}
		
		},
		

		addBlockSideToContent: function(draggedContent, position) {
			//Contentblock naast Contentblock
			// Column 1 is our draggedColumn
			// Column 2 contains all the old rows inside the window
			Logger.debug("Add block to content side: " + position);
			// Save for later to clean this up
			var oldParent = draggedContent.parent();
			
			//Get count content boxes for this column
			// if 1 then just add new column before this column
			// if more (stacked) then add row and two columns with both contents
			var currentColumn = cms.core.dropObject.parent();
			
			// if currect column is parent of the content block we dropped on
			// if current column has only 1 child
			// Then we add our draage block before or after this column
			// => we expand the existing table
			//
			// if current column has 2+ children
			// then wrap all the content blocks inside current column in a new column
			// wrap draggedObject in a new column
			// wrap these 2 columns in a new row
			// and add this row to the current column
			// => we make a new table inside our existing table
			if (currentColumn.children("." + cms.config.CLASS_CONTENT).length == 1) {
				var newColumn = cms.block.createColumn();
				newColumn.append(draggedContent);
				cms.block.addColumnToColumn(currentColumn, newColumn, position);
				
			} else {
				
				var previousContent = cms.core.dropObject.prevAll("." + cms.config.CLASS_CONTENT);
				var nextContent = cms.core.dropObject.nextAll("." + cms.config.CLASS_CONTENT);
				
				var newRowPrevious = null;
				var newRowNext = null;
				if (previousContent.length > 0) {
					newRowPrevious = cms.block.createRow();
					var newColumnPrevious = cms.block.createColumn();
					newColumnPrevious.append(previousContent);
					newRowPrevious.append(newColumnPrevious);
				}
				if (nextContent.length > 0) {
					var newRowNext = cms.block.createRow();
					var newColumnNext = cms.block.createColumn();
					newColumnNext.append(nextContent);
					newRowNext.append(newColumnNext);
				}
							
				var newRowCurrent = cms.block.createRow();
				var newColumnCurrentWithOldContent = cms.block.createColumn();
				var newColumnCurrentWithDraggedContent = cms.block.createColumn();
				newColumnCurrentWithOldContent.append(cms.core.dropObject);
				newRowCurrent.append(newColumnCurrentWithOldContent);
				newColumnCurrentWithDraggedContent.append(draggedContent);
				cms.block.addColumnToColumn(newColumnCurrentWithOldContent, newColumnCurrentWithDraggedContent, position);
				
				if (newRowPrevious != null) {
					currentColumn.append(newRowPrevious);
				}
				
				currentColumn.append(newRowCurrent)
				
				if (newRowNext != null) {
					currentColumn.append(newRowNext);
				}
				
				
			}
			
		},

		// We insert a blok on top or after the content block we droppped on
		addBlockVerticalToContent: function(draggedContent, position) {
			Logger.debug("Add block to content vertical position: " + position);
			var oldParent = draggedContent.parent();
			
			if (position == cms.config.SIDE_TOP) {
				cms.core.dropObject.before(draggedContent);
			} else {
				cms.core.dropObject.after(draggedContent);
			}
			
		},
		
		removeBlock: function(block) {
			var toClean = block.parent();
			
			if(!cms.block.isLastBlockInWindow(block)) {
			
				block.hide(cms.config.ANIMATION_HIDE_SPEED, function() {
					block.remove();
					if (toClean.children().length == 0) 
					{
						cms.clean.cleanEmptyElements();
					}
					cms.manager.setMode();
				})
			}
		},
		
		finishDrop: function() {
			cms.manager.setMode();
		}
		
		
		
	}


));

return t;})(cms);