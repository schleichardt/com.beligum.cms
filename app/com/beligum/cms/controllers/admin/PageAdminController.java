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

import static play.libs.Json.toJson;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.JsonNode;

import play.data.Form;
import play.mvc.Controller;
import play.mvc.Http.Request;
import play.mvc.Result;
import be.objectify.deadbolt.java.actions.Dynamic;

import com.beligum.cms.models.Page;
import com.beligum.cms.models.Template;
import com.beligum.cms.repositories.BlockRepository;
import com.beligum.cms.utils.PageManager;
import com.beligum.cms.utils.UrlRouter;
import com.beligum.core.utils.security.UserRoles;
import com.beligum.core.models.User;
import com.beligum.core.repositories.BasicRepository;
import com.beligum.core.utils.Cacher;

@Dynamic(UserRoles.ADMIN)
public class PageAdminController extends Controller
{

    // Take the path as input
    // create all subpages if necessary
    // create this page with a block (cf template)
    public static Result create()
    {
	Map<String, Object> jsonObject = new HashMap<String, Object>();

	try {
	    String url = Form.form().bindFromRequest().get("path");
	    Page page = PageManager.create(url);
	    jsonObject.put("ok", true);
	    jsonObject.put("url", url);

	} catch (Exception e) {
	    jsonObject.put("ok", false);
	    jsonObject.put("message", e.getMessage());
	}
	return ok(toJson(jsonObject));
    }

    public static Result save()
    {
	Request request = play.mvc.Controller.request();
	JsonNode jsonNode = request.body().asJson();
	Map<String, Object> jsonObject = new HashMap<String, Object>();
	Result retVal = checkDemoMode("Saving is not supported.");
	try {
	    if (retVal == null) {
		Page updatedPage = play.libs.Json.fromJson(jsonNode, Page.class);
		Page savedPage = PageManager.savePage(updatedPage);
		jsonObject.put("ok", true);

		retVal = ok(toJson(jsonObject));
	    }
	} catch (Exception e) {
	    jsonObject.put("ok", false);
	    jsonObject.put("error", "An error occured. Page could not be saved: " + e.getMessage());
	    retVal = ok(toJson(jsonObject));
	}
	return retVal;
    }

    public static Result deletePage(Long id)
    {
	Result retVal = checkDemoMode("Delete is not supported.");
	Map<String, Object> jsonObject = new HashMap<String, Object>();
	try {
	    if (retVal == null) {
		Cacher.flushApplicationCache();
		// fetch page

		String language = Form.form().bindFromRequest().get("language");
		Long pageId = UrlRouter.getTranslatedIdForMasterId(id, language);
		if (pageId != null) {
		    Page page = BlockRepository.findPageById(pageId);
		    boolean fullPage = !UrlRouter.findChildPagesForId(page.getId());
		    PageManager.deletePage(page, fullPage);
		}

		jsonObject.put("ok", true);
		retVal = ok(toJson(jsonObject));
	    }
	} catch (Exception e) {
	    jsonObject.put("error", "An error occured. Page could not be deleted: " + e.getMessage());
	    jsonObject.put("ok", false);
	    retVal = ok(toJson(jsonObject));
	}
	UrlRouter.resetUrlMaps();
	Cacher.flushApplicationCache();
	return retVal;
    }

    public static Result changeTitleDialog(Long id)
    {
	Page page = BlockRepository.findPageById(id);
	return ok(com.beligum.cms.views.html.modal.change_title.render(page));
    }

    public static Result changeTitle(Long id)
    {
	Map<String, Object> jsonObject = new HashMap<String, Object>();
	Result retVal = checkDemoMode("You can not change the title.");
	try {
	    if (retVal == null) {
		String language = Form.form().bindFromRequest().get("language");
		id = UrlRouter.getTranslatedIdForMasterId(id, language);
		Page page = BlockRepository.findPageById(id);
		String title = Form.form().bindFromRequest().get("title");
		page.setTitle(title);
		BasicRepository.update(page);
		jsonObject.put("ok", true);
		jsonObject.put("status", "Title updated.");
		retVal = ok(toJson(jsonObject));
	    }

	} catch (Exception e) {
	    jsonObject.put("error", "Error: Title could not be saved.");
	    retVal = ok(toJson(jsonObject));
	}
	return retVal;
    }

    public static Result changeUrlDialog(Long id)
    {
	// Page page = BlockRepository.findPageById(id);
	String language = Form.form().bindFromRequest().get("language");
	List<Page> parentPages = UrlRouter.findTranslatedParentPagesByMasterId(id, language);

	return ok(com.beligum.cms.views.html.modal.change_url.render(parentPages));
    }

    public static Result changeUrl(Long id)
    {
	Request request = play.mvc.Controller.request();
	// JsonNode jsonNode = request.body().asJson();
	Map<String, Object> jsonObject = new HashMap<String, Object>();
	Result retVal = checkDemoMode("You can not change the url.");
	try {
	    if (retVal == null) {
		Page page = BlockRepository.findPageById(id);
		String url = Form.form().bindFromRequest().get("url");
		String language = Form.form().bindFromRequest().get("language");
		// parse array
		JsonNode jsonNode = play.libs.Json.parse(url);
		String[] newUrlPath = play.libs.Json.fromJson(jsonNode, String[].class);
		String oldUrl = PageManager.removeTrailingSlashes(UrlRouter.getUrlForMasterId(id, language));
		String[] oldUrlPath = oldUrl.split("/");

		List<Page> parentPages = UrlRouter.findTranslatedParentPagesByMasterId(page.getId(), language);
		if (parentPages.size() == newUrlPath.length) {
		    for (int i = 0; i < parentPages.size(); i++) {
			Page pageToUpdate = parentPages.get(i);
			pageToUpdate.setUrlName(newUrlPath[i]);
			BasicRepository.update(pageToUpdate);
		    }
		}
		UrlRouter.resetUrlMaps();
		jsonObject.put("ok", true);
		jsonObject.put("status", "Url updated.");
		jsonObject.put("url", UrlRouter.getUrlForMasterId(id, language));
		retVal = ok(toJson(jsonObject));
	    }

	} catch (Exception e) {
	    jsonObject.put("error", "Error: Url could not be changed.");
	    retVal = ok(toJson(jsonObject));
	}
	return retVal;
    }

    public static Result changeTemplateDialog(Long id)
    {
	Page page = BlockRepository.findPageById(id);
	List<Template> templates = BasicRepository.findAll(Template.class);

	return ok(com.beligum.cms.views.html.modal.change_template.render(page, templates));
    }

    public static Result changeTemplate(Long id)
    {
	Map<String, Object> jsonObject = new HashMap<String, Object>();
	Result retVal = checkDemoMode("You can not change the template.");
	try {
	    if (retVal == null) {
		String language = Form.form().bindFromRequest().get("language");
		id = UrlRouter.getTranslatedIdForMasterId(id, language);
		Page page = BlockRepository.findPageById(id);
		Long templateId = Long.parseLong(Form.form().bindFromRequest().get("templateid"));
		Template template = BasicRepository.find(Template.class, templateId);
		page.setTemplate(template);
		BasicRepository.update(page);
		jsonObject.put("ok", true);
		jsonObject.put("status", "Template updated.");
		retVal = ok(toJson(jsonObject));
	    }

	} catch (Exception e) {
	    jsonObject.put("error", "Error: Template could not be saved.");
	    retVal = ok(toJson(jsonObject));
	}
	return retVal;
    }

    public static Result resetCache()
    {
	Cacher.flushApplicationCache();
	UrlRouter.resetUrlMaps();
	return ok("");
    }

    private static Result checkDemoMode(String message)
    {
	Result retVal = null;
	boolean demo = false;
	try {
	    demo = play.Play.application().configuration().getBoolean("com.beligum.cms.demo");
	} catch (Exception e) {
	    demo = false;
	}

	if (demo && User.getCurrentUser().getEmail().toLowerCase().equals("demo")) {
	    Map<String, Object> jsonObject = new HashMap<String, Object>();
	    jsonObject.put("ok", false);
	    jsonObject.put("error", "This is a demo version. " + message);
	    retVal = ok(toJson(jsonObject));
	}
	return retVal;
    }

}
