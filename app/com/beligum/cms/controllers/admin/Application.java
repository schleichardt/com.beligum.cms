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
package com.beligum.cms.controllers.admin;

import play.Routes;
import play.mvc.Controller;
import play.mvc.Result;

import com.beligum.cms.utils.PageRenderer;

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
