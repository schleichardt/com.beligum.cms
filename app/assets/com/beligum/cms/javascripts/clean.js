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

t.clean = new (Class.extend
({
		cleanEmptyElements: function() {
			$("." + cms.config.CLASS_WINDOW).each(function() {
				cms.clean.cleanEmptyElement($(this));
			});

			cms.clean.cleanBlocks();

		},

		// After drop we clean the parent element of the dragged object so no empty rows or columns remain
		cleanEmptyElement: function(parent) {
			// get all children.
			// check each child if empty
			// if empty remove child
			// else check this child for empty children
			// if removed child was column, redistribute column width
			
			var children = parent.children("." + cms.config.CLASS_BLOCK);
			var flagColumn = false;
			children.each(function() {
				var child = $(this);
				if (child.children("." + cms.config.CLASS_BLOCK).length == 0 && !child.hasClass(cms.config.CLASS_CONTENT)) {
					child.remove();
					Logger.debug("Cleaning: removing empty element");
					if (child.hasClass(cms.config.CLASS_COLUMN)) {
						cms.block.distributeWidthColumns(parent);
					}
				} else {
					cms.clean.cleanEmptyElement(child);
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
			
			$("." + cms.config.CLASS_ROW).each(function() {
				var parent = $(this);
				var column = parent.children("." + cms.config.CLASS_COLUMN)
				// this row has 1 column
				if (column.length == 1) {
					var content = column.children("." + cms.config.CLASS_BLOCK);
					// this column has 1 element as content
					if (content.length == 1) {
						// if the content of the column is a content block
						// add this content to our parent column
						// only if our current row is the only row in the parent column 
						if (content.hasClass(cms.config.CLASS_CONTENT)) {
							var upperColumn = parent.parent();
							if (upperColumn.children("." + cms.config.CLASS_ROW).length == 1) {
								// eliminate ourselve
								Logger.debug("Cleaning: removing nested row with content");
								upperColumn.append(content);
								parent.remove();
							}
						// if the content of the column is a row block
						// replace our current row with this row
						} else if (content.hasClass(cms.config.CLASS_ROW)) {
							var newContent = content.children("." + cms.config.CLASS_BLOCK);
							Logger.debug("Cleaning: removing nested row with row");
							parent.append(newContent);
							column.remove();
						}
					}			
				}	
			}); // end each class_row
			
			// if we have a column with multiple rows
			// and each row has a column with only content
			
			$("." + cms.config.CLASS_COLUMN).each(function() {
				var column = $(this);
				var rows = column.children("." + cms.config.CLASS_ROW);
				var onlyContent = true;
				var newContent = $("<div />");
				
				if (rows.length > 0) {
					rows.each(function() {
						var row = $(this);
						var columnInRow = row.children("." + cms.config.CLASS_COLUMN);
						if (columnInRow.length == 1) {
							var contentInColumn = columnInRow.children("." + cms.config.CLASS_CONTENT)
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
							var columnInRow = row.children("." + cms.config.CLASS_COLUMN);
							var contentInColumn = columnInRow.children("." + cms.config.CLASS_CONTENT)
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