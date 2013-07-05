CKEDITOR.plugins
		.add(
				'htmlsnippet',
				{
					init : function(editor) {

						editor
								.addCommand('insertHtmlSnippet',
										new CKEDITOR.dialogCommand(
												'htmlSnippetDialog'));
						// editor.addCommand('insertHtmlSnippet', {
						// exec : function(editor) {
						// var timestamp = new Date();
						// editor.insertHtml('The current date and time is:
						// <em>'
						// + timestamp.toString() + '</em>');
						// }
						// });

						editor.ui.addButton('htmlSnippetButton', {
							label : 'Insert Html Snippet',
							command : 'insertHtmlSnippet',
							icon : this.path + 'icons/icon-tag.png'
						});

						CKEDITOR.dialog
								.add(
										'htmlSnippetDialog',
										function(editor) {
											return {
												title : 'Insert Html',
												minWidth : 400,
												minHeight : 100,
												contents : [ {
													id : 'general',
													label : 'Settings',
													elements : [
															{
																type : 'html',
																html : 'Insert some html at the location of the cursor:'
															},
															{
																type : 'textarea',
																id : 'snippet',
																label : 'Your html:',
																validate : CKEDITOR.dialog.validate
																		.notEmpty('The Displayed Text field cannot be empty.'),
																required : true,
																commit : function(data) {
																	data.snippet = this.getValue();
																}
															}
															]
												} ],
												
												onOk : function()
												{
													// The code that will be executed when the user accepts the changes.
													var dialog = this,
													data = {};
													this.commitContent( data );
								 
													editor.insertHtml(data.snippet);
								 
												}
											};
										});

					} //Init

				});
