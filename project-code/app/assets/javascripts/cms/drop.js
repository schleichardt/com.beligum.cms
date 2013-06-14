
var cms = cms || {};
var cms = (function(e){var t = e || {};

t.dropModule = new (Class.extend
({
		// DROP METHODS
		// On drop, send the dragged object to the right drop object
		addBlock: function() {
			cms.coreModule.dropObject = cms.coreModule.saveDropObjectForAnimation;
			cms.coreModule.dropSide = cms.coreModule.saveDropSideForAnimation;
			var toClean = cms.coreModule.draggedObject.parent();
			if ((cms.coreModule.dropSide == cms.configModule.SIDE_TOP || cms.coreModule.dropSide == cms.configModule.SIDE_BOTTOM) && 
					(cms.coreModule.dropObject.hasClass(cms.configModule.CLASS_ROW))) {
				cms.dropModule.addBlockVerticalToRow(cms.coreModule.draggedObject, cms.coreModule.dropSide);
			} else if ((cms.coreModule.dropSide == cms.configModule.SIDE_RIGHT || cms.coreModule.dropSide == cms.configModule.SIDE_LEFT) && 
					(cms.coreModule.dropObject.hasClass(cms.configModule.CLASS_COLUMN))) {
				cms.dropModule.addBlockSideToColumn(cms.coreModule.draggedObject, cms.coreModule.dropSide);
			} else if ((cms.coreModule.dropSide == cms.configModule.SIDE_TOP || cms.coreModule.dropSide == cms.configModule.SIDE_BOTTOM) && 
					(cms.coreModule.dropObject.hasClass(cms.configModule.CLASS_CONTENT))) {
				cms.dropModule.addBlockVerticalToContent(cms.coreModule.draggedObject, cms.coreModule.dropSide);
			} else if ((cms.coreModule.dropSide == cms.configModule.SIDE_RIGHT || cms.coreModule.dropSide == cms.configModule.SIDE_LEFT) && 
					(cms.coreModule.dropObject.hasClass(cms.configModule.CLASS_CONTENT))) {
				cms.dropModule.addBlockSideToContent(cms.coreModule.draggedObject, cms.coreModule.dropSide);
			} else if ((cms.coreModule.dropSide == cms.configModule.SIDE_TOP || cms.coreModule.dropSide == cms.configModule.SIDE_BOTTOM) && 
					(cms.coreModule.dropObject.hasClass(cms.configModule.CLASS_WINDOW))) {
				cms.dropModule.addBlockVerticalToColumn(cms.coreModule.draggedObject, cms.coreModule.dropSide);
			}
			
			// Now Clean oldParent from where we took the dragged element
			cms.cleanModule.cleanEmptyElements();

			cms.coreModule.clearDropObject();
			// Now clean the stack where we droppend the draggedObject
			//dragcms.dropModule.cleanNestedRows(cms.coreModule.draggedObject);
			
			// And init the page like before the drag, we do this here, after the animation
			cms.coreModule.draggedObject.show(cms.configModule.ANIMATION_SHOW_SPEED, 
					function() {
						cms.dropModule.finishDrop();
					});
		},
		
		addBlockVerticalToRow: function(draggedContent, position) {
			
			var oldParent = draggedContent.parent();
			var newRow = cms.blockModule.createRow();
			var columnWithNewContent = cms.blockModule.createColumn();
			
			columnWithNewContent.append(draggedContent);
			newRow.append(columnWithNewContent);
			if (position == cms.configModule.SIDE_TOP) {
				cms.coreModule.dropObject.before(newRow);
				Logger.debug("Row: Added block before row vertical position: " + position);
			} else {
				cms.coreModule.dropObject.after(newRow);
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
			if (cms.coreModule.dropObject.hasClass(cms.configModule.CLASS_WINDOW)) {
				// Alles wrappen en een nieuwe Columm toevoegen
				var children = cms.configModule.LAYOUT_WINDOW.children('.' + cms.configModule.CLASS_BLOCK);
				var newRow = cms.blockModule.createRow();
				var columnWithOldContent = cms.blockModule.createColumn();
				var columnWithNewContent = cms.blockModule.createColumn();
				columnWithOldContent.append(children);
				columnWithNewContent.append(draggedContent);
				newRow.append(columnWithOldContent);
				cms.blockModule.addColumnToColumn(columnWithOldContent, columnWithNewContent, position);
				cms.configModule.LAYOUT_WINDOW.append(newRow);
				Logger.debug('Column: added dragged block to column on side: ' + position);
			} else {
				var columnWithNewContent = cms.blockModule.createColumn();
				columnWithNewContent.append(draggedContent);
				cms.blockModule.addColumnToColumn(cms.coreModule.dropObject, columnWithNewContent, position);
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
			if (cms.coreModule.dropObject.hasClass(cms.configModule.CLASS_WINDOW)) {
				var newRow = cms.blockModule.createRow();
				var columnWithNewContent = cms.blockModule.createColumn();
				columnWithNewContent.append(draggedContent);
				newRow.append(columnWithNewContent);
				if (position == cms.configModule.SIDE_TOP) {
					cms.coreModule.dropObject.children().first().before(newRow);
				} else {
					cms.coreModule.dropObject.children().last().after(newRow);
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
			var currentColumn = cms.coreModule.dropObject.parent();
			
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
			if (currentColumn.children("." + cms.configModule.CLASS_CONTENT).length == 1) {
				var newColumn = cms.blockModule.createColumn();
				newColumn.append(draggedContent);
				cms.blockModule.addColumnToColumn(currentColumn, newColumn, position);
				
			} else {
				
				var previousContent = cms.coreModule.dropObject.prevAll("." + cms.configModule.CLASS_CONTENT);
				var nextContent = cms.coreModule.dropObject.nextAll("." + cms.configModule.CLASS_CONTENT);
				
				var newRowPrevious = null;
				var newRowNext = null;
				if (previousContent.length > 0) {
					newRowPrevious = cms.blockModule.createRow();
					var newColumnPrevious = cms.blockModule.createColumn();
					newColumnPrevious.append(previousContent);
					newRowPrevious.append(newColumnPrevious);
				}
				if (nextContent.length > 0) {
					var newRowNext = cms.blockModule.createRow();
					var newColumnNext = cms.blockModule.createColumn();
					newColumnNext.append(nextContent);
					newRowNext.append(newColumnNext);
				}
							
				var newRowCurrent = cms.blockModule.createRow();
				var newColumnCurrentWithOldContent = cms.blockModule.createColumn();
				var newColumnCurrentWithDraggedContent = cms.blockModule.createColumn();
				newColumnCurrentWithOldContent.append(cms.coreModule.dropObject);
				newRowCurrent.append(newColumnCurrentWithOldContent);
				newColumnCurrentWithDraggedContent.append(draggedContent);
				cms.blockModule.addColumnToColumn(newColumnCurrentWithOldContent, newColumnCurrentWithDraggedContent, position);
				
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
			
			if (position == cms.configModule.SIDE_TOP) {
				cms.coreModule.dropObject.before(draggedContent);
			} else {
				cms.coreModule.dropObject.after(draggedContent);
			}
			
		},
		
		removeBlock: function(block) {
			var toClean = block.parent();
			
			if(!cms.blockModule.isLastBlockInWindow(block)) {
			
				block.hide(cms.configModule.ANIMATION_HIDE_SPEED, function() {
					block.remove();
					if (toClean.children().length == 0) 
					{
						cms.cleanModule.cleanEmptyElements();
					}
					cms.managerModule.setMode();
				})
			}
		},
		
		finishDrop: function() {
			cms.managerModule.setMode();
		}
		
		
		
	}


));

return t;})(cms);