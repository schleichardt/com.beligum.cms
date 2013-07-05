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
