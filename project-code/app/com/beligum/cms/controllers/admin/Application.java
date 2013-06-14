package com.beligum.cms.controllers.admin;

import play.Routes;
import play.mvc.Controller;
import play.mvc.Result;

import com.beligum.cms.managers.PageRenderer;

public class Application extends Controller
{

    
    public static Result adminPanel()
    {


	PageRenderer page = new PageRenderer("/test/adminPanel");
	return ok(com.beligum.cms.views.html.admin_panel.render(page));
    }

    public static Result javascriptRoutes()
    {
	response().setContentType("text/javascript");
	return ok(Routes.javascriptRouter("jsRoutes",
					  // Routes for Projects
					  com.beligum.cms.controllers.admin.routes.javascript.PageAdminController.save(),
					  com.beligum.cms.controllers.admin.routes.javascript.PageAdminController.create(),
					  com.beligum.cms.controllers.admin.routes.javascript.PageAdminController.deletePage(),
					  com.beligum.cms.controllers.admin.routes.javascript.PageAdminController.changeTitleDialog(),
					  com.beligum.cms.controllers.admin.routes.javascript.PageAdminController.changeUrlDialog(),
					  com.beligum.cms.controllers.admin.routes.javascript.PageAdminController.changeTemplateDialog(),
					  com.beligum.cms.controllers.admin.routes.javascript.PageAdminController.changeTitle(),
					  com.beligum.cms.controllers.admin.routes.javascript.PageAdminController.changeUrl(),
					  com.beligum.cms.controllers.admin.routes.javascript.PageAdminController.changeTemplate()

	));
    }

}
