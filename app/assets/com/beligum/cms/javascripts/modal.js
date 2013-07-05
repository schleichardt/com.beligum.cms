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

t.modal = new (Class.extend
({

		//-----PUBLIC METHODS-----
		confirmDelete : function(deleteText, url, onDone) {
			var modal = this.createModal('Confirm delete',
					'Are you sure you want to delete this page?', 'Yes', 'No');
			modal.find('.btn-modal-yes').on('click', function() {

				$.post(url, function() {
					if (onDone == undefined || onDone == null) {

					} else {
						onDone();
					}
				}, "json");
			});

		},

		confirmContentDelete : function(content, onYes) {

			var modal = this.createModalWithFunctions('Confirm remove',
					'Are you sure you want to remove this block?', 'Yes', 'No',
					function() {
						onYes(content)
					}, null);

		},

		error : function(message) {
			var modal = this.createModal('Error', message, 'Ok', null);
		},

		success : function(message) {
			var modal = this.createModal('Success', message, 'Ok', null);

		},

		//-----PRIVATE METHODS-----

		createModalWithFunctions : function(title, text, yes, no, yesFunction,
				noFunction) {
			var modal = $("<div/>").attr("id", "modal-cms").addClass("modal")
					.css("display", 'block');
			var modalHeader = $("<div />").addClass("modal-header").append(
					$("<h3 />").html(title));
			var closeButton = $("<a />").attr("href", "#").addClass("close")
					.html("&times;");
			var modalBody = $("<div />").addClass("modal-body").html(text);
			var modalFooter = $("<div />").addClass("modal-footer");
			var btnYes = $("<span />")
					.addClass("btn btn-primary btn-modal-yes").html(yes);

			modalHeader.prepend(closeButton);
			modalFooter.append(btnYes);

			if (no != null && no != undefined) {
				var btnNo = $("<span />")
						.addClass("btn secondary btn-modal-no").html(no);
				modalFooter.append(btnNo);

				btnNo.on('click', noFunction, function(event) {
					$('#modal-cms').modal('hide');
					$('#modal-cms').remove();
					if (event.data != null && event.data != undefined) {
						event.data();
					}
				});
			}

			btnYes.on('click', yesFunction, function(event) {
				$('#modal-cms').modal('hide');
				$('#modal-cms').remove();
				if (event.data != null && event.data != undefined) {
					event.data();
				}
			});

			modal.append(modalHeader).append(modalBody).append(modalFooter);
			$('body').append(modal);
			$('#modal-cms').modal('show');
		},

		createModal : function(title, text, yes, no) {
			cms.modal.createModalWithFunctions(title, text, yes, no, null, null);
		}

	}


));

return t;})(cms);