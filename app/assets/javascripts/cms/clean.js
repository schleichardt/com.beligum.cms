
var cms = cms || {};
var cms = (function(e){var t = e || {};

t.cleanModule = new (Class.extend
({
		cleanEmptyElements: function() {
			$("." + cms.configModule.CLASS_WINDOW).each(function() {
				cms.cleanModule.cleanEmptyElement($(this));
			});

			cms.cleanModule.cleanBlocks();

		},

		// After drop we clean the parent element of the dragged object so no empty rows or columns remain
		cleanEmptyElement: function(parent) {
			// get all children.
			// check each child if empty
			// if empty remove child
			// else check this child for empty children
			// if removed child was column, redistribute column width
			
			var children = parent.children("." + cms.configModule.CLASS_BLOCK);
			var flagColumn = false;
			children.each(function() {
				var child = $(this);
				if (child.children("." + cms.configModule.CLASS_BLOCK).length == 0 && !child.hasClass(cms.configModule.CLASS_CONTENT)) {
					child.remove();
					Logger.debug("Cleaning: removing empty element");
					if (child.hasClass(cms.configModule.CLASS_COLUMN)) {
						cms.blockModule.distributeWidthColumns(parent);
					}
				} else {
					cms.cleanModule.cleanEmptyElement(child);
				}
			});
			
				
		},
		

		
		cleanBlocks: function() {		
			// 1 child with only 1 child 
			// And child of child is not a contentblock
			// element = column
			// children = 1 row
			// childrenOfChild = 1 column
			// childrenOfChildOfChild = 3 content blocks
			
			// element = row
			// children = 1 column
			// childrenOfChild = 1 row
			// childrenOfChildOfChild = 3 columns
			
			// element = row
			// children = 1 column
			// childrenOfChild = 3 content blocks ==> Do not move!!! 
			
			
			// check all rows
			// if 1 column
			// if column has 1 element
			// move this element
			// 		-> if this element is a row with a column
			// 		-> if this element is a contentblock, add content to our parent column if we are the only child of the parent
			Logger.debug("Cleaning: trying to clean nested blocks");
			
			$("." + cms.configModule.CLASS_ROW).each(function() {
				var parent = $(this);
				var column = parent.children("." + cms.configModule.CLASS_COLUMN)
				// this row has 1 column
				if (column.length == 1) {
					var content = column.children("." + cms.configModule.CLASS_BLOCK);
					// this column has 1 element as content
					if (content.length == 1) {
						// if the content of the column is a content block
						// add this content to our parent column
						// only if our current row is the only row in the parent column 
						if (content.hasClass(cms.configModule.CLASS_CONTENT)) {
							var upperColumn = parent.parent();
							if (upperColumn.children("." + cms.configModule.CLASS_ROW).length == 1) {
								// eliminate ourselve
								Logger.debug("Cleaning: removing nested row with content");
								upperColumn.append(content);
								parent.remove();
							}
						// if the content of the column is a row block
						// replace our current row with this row
						} else if (content.hasClass(cms.configModule.CLASS_ROW)) {
							var newContent = content.children("." + cms.configModule.CLASS_BLOCK);
							Logger.debug("Cleaning: removing nested row with row");
							parent.append(newContent);
							column.remove();
						}
					}			
				}	
			}); // end each class_row
			
			// if we have a column with multiple rows
			// and each row has a column with only content
			
			$("." + cms.configModule.CLASS_COLUMN).each(function() {
				var column = $(this);
				var rows = column.children("." + cms.configModule.CLASS_ROW);
				var onlyContent = true;
				var newContent = $("<div />");
				
				if (rows.length > 0) {
					rows.each(function() {
						var row = $(this);
						var columnInRow = row.children("." + cms.configModule.CLASS_COLUMN);
						if (columnInRow.length == 1) {
							var contentInColumn = columnInRow.children("." + cms.configModule.CLASS_CONTENT)
							if (contentInColumn.length == 0) {
								onlyContent = false;
							}
						} else {
							onlyContent = false;
						}
					})
				} else {
					onlyContent = false;
				}
				
				if (onlyContent) {
					Logger.debug("Cleaning: removing rows (with only content) in column");
					if (rows.length > 0) {
						rows.each(function() {
							var row = $(this);
							var columnInRow = row.children("." + cms.configModule.CLASS_COLUMN);
							var contentInColumn = columnInRow.children("." + cms.configModule.CLASS_CONTENT)
							column.append(contentInColumn);						
						});
					}
					rows.remove();
				}
				
			});
			
		}
	}
));

return t;})(cms);