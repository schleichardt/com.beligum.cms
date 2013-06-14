var cms = cms || {};
var cms = (function(e){var t = e || {};

t.adminModule = new (Class.extend
({

			
	// -----CONSTANTS-----
	PANEL_STATE_COOKIE_KEY: "admin_panel_state",
	
	
	initAdminPanel: function() {
		var pageId = $("#cms-pageId").val();
		
		// Check if pageId is defined
		if (!(!pageId || 0 === pageId.length)) {
			cms.coreModule.pageId = parseInt(pageId);
		}
		cms.coreModule.language = $("#cms-language").val();
		
		if (cms.coreModule.pageId != null) {
			// Show save button ipv create button
			// show Page Settings
			// check if page id is present
			$(".layouter-create-btn").hide();
			$(".layouter-save-btn").show();
			$(".layouter-save-btn").on("click", function(){
				cms.adminModule.savePage();
			})
		} else {
			$(".layouter-create-btn").show();
			$(".layouter-save-btn").hide();
			$(".layouter-create-btn").on("click", function(){
				cms.adminModule.createPage();
			})
		}
		
		var panel = $('#layouter-admin-panel');
		var panelState = this.readCookie(this.PANEL_STATE_COOKIE_KEY);
		if (panelState=='true' && !panel.is(":visible")) {
			this.showAdminPanel('show', true);
		}
		else if (panelState=='false' && panel.is(":visible")) {
			this.showAdminPanel('hide', true);
		}
		
		$(".layouter-admin-toggle-btn").on("click", function(){
			cms.adminModule.toggleAdminPanel();
		})
		
		$(".layouter-change-title-btn").on("click", function(){
			cms.adminModule.showChangeTitleDialog();
		})
		$(".layouter-change-url-btn").on("click", function(){
			cms.adminModule.showChangeUrlDialog();
		})
		$(".layouter-change-template-btn").on("click", function(){
			cms.adminModule.showChangeTemplateDialog();
		})
	},
	
	toggleAdminPanel: function() {
		// $("#layouter-admin-panel").toggle()
		this.showAdminPanel('toggle');
	},
	showAdminPanel: function(showHideToggleStr, noAnim) {
		var toggleBtn = $('#layouter-admin-toggle i');
		
		var _this = this;
		toggleBtn.hide();
		$('#layouter-admin-panel').animate({
			height: showHideToggleStr
		}, noAnim?0:200, function(){
			var visible = $(this).is(":visible");
			if (!$(this).is(":visible")) {
				toggleBtn.fadeIn(noAnim?0:500);
			}			
			_this.createCookie(_this.PANEL_STATE_COOKIE_KEY, visible?true:false);
		});
	},
	
	
	// -----PRIVATE FUNCTIONS-----
	
	// -----PUBLIC FUNCTIONS-----
	
	showChangeTitleDialog: function() {
		$("#admin-dialog-window").empty();
		$("#admin-dialog-window").load(jsRoutes.com.beligum.cms.controllers.admin.PageAdminController.changeTitleDialog(cms.coreModule.pageId).absoluteURL(), function() {
			$(".modal").modal("show");
		});
	},
	
	changeTitle: function() {
		var title = $("#layout-title").val();
		$.post(jsRoutes.com.beligum.cms.controllers.admin.PageAdminController.changeTitle(cms.coreModule.pageId).absoluteURL(), {title: title, language: cms.coreModule.language})
		.done(function(data) { 
			$(".modal").modal("hide"); 
			document.title = title
			});
	},
	
	showChangeUrlDialog: function() {
		$("#admin-dialog-window").empty();
		$("#admin-dialog-window").load(jsRoutes.com.beligum.cms.controllers.admin.PageAdminController.changeUrlDialog(cms.coreModule.pageId).absoluteURL() + "?language=" + cms.coreModule.language, function() {
			$(".modal").modal("show");
		});
	},
	
	changeUrl: function() {
		var url = [];
		$(".layouter-urlNames").each(function(index, field) {
			url.push($(field).val())
		});
		var path = url.join("/");
		$.post(jsRoutes.com.beligum.cms.controllers.admin.PageAdminController.changeUrl(cms.coreModule.pageId).absoluteURL(), {url: JSON.stringify(url), language: cms.coreModule.language})
		.done(function(data) { 
			$(".modal").modal("hide");
			document.location.href = data.url;
			});
	},
	
	showChangeTemplateDialog: function() {
		$("#admin-dialog-window").empty();
		$("#admin-dialog-window").load(jsRoutes.com.beligum.cms.controllers.admin.PageAdminController.changeTemplateDialog(cms.coreModule.pageId).absoluteURL(), function() {
			$(".modal").modal("show");
		});
	},
	
	changeTemplate: function() {
		var templateid = $("#layouter-template-select").val();
		$.post(jsRoutes.com.beligum.cms.controllers.admin.PageAdminController.changeTemplate(cms.coreModule.pageId).absoluteURL(), {templateid: templateid, language: cms.coreModule.language})
		.done(function(data) { 
			$(".modal").modal("hide");
			document.location.reload();
			});
	},
	
	savePage: function() {
		var page = {};
		page.id = cms.coreModule.pageId;
		page.language = cms.coreModule.language;
		// page.urlName = $("#urlName").val();
		
		cms.managerModule.deactiveateManager();
		
		page.subblocks = [];
		$("." + cms.configModule.CLASS_WINDOW).each(function() {
			var block = {};
			block.urlName = $(this).attr("id");
			block.id = $(this).attr("data-id")
			block.html = $(this).html();
			page.subblocks.push(block);
		});
		
		
		$.ajax({
			  contentType: 'application/json',
			  url: jsRoutes.com.beligum.cms.controllers.admin.PageAdminController.save().absoluteURL(),
			  data: JSON.stringify(page),
			  type: 'POST',
			  dataType: 'json',
			  success: function(data) {
				  cms.modalModule.success("Page is successfully saved.")
			  },
			  error: function(data) {
				  cms.modalModule.error(data.error);
			  }
			});
		Logger.debug('Manager: save page')
		cms.managerModule.activateManager();
		
	},
	
	createPage: function() {
		// post path and refresh
		var path = location.pathname;
		$.ajax({
			  url: jsRoutes.com.beligum.cms.controllers.admin.PageAdminController.create().absoluteURL(),
			  data: {path: path},
			  type: 'POST',
			  dataType: 'json'
			}).done(function(data) {
				if (data.ok) {
					location.reload(true);
				} else {
					cms.modalModule.createModal("Error", data.message, "Ok", null);
				}
			});
	},
	
	deletePage: function() {
		cms.modalModule.createModalWithFunctions("Delete page", "Are you sure you want to delete this page?", "Yes", "No", function() {
			$.ajax({
				  url: jsRoutes.com.beligum.cms.controllers.admin.PageAdminController.deletePage(cms.coreModule.pageId).absoluteURL(),
				  data: {language: cms.coreModule.language},
				  type: 'POST',
				  dataType: 'json'
				}).done(function(data) {
					if (data.ok) {
						location.reload(true);
					} else {
						cms.modalModule.createModal("Error", data.error, "Ok", null);
					}
				});
		}, null);
	},
	
	// pasted from http://www.quirksmode.org/js/cookies.html
	createCookie: function(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	},
	readCookie: function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	},
	eraseCookie: function(name) {
		createCookie(name,"",-1);
	}

	}



));

return t;})(cms);
