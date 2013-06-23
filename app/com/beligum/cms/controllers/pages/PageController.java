package com.beligum.cms.controllers.pages;

import play.api.templates.Html;
import play.i18n.Lang;
import play.mvc.Controller;
import play.mvc.Result;

import com.beligum.cms.I18.Language;
import com.beligum.cms.managers.PageManager;
import com.beligum.cms.managers.PageRenderer;

public class PageController extends Controller
{
    // -----CONSTANTS-----

    // -----VARIABLES-----

    // -----PUBLIC FUNCTIONS-----

    public static Result show(String url)
    {
	Result retVal = badRequest(com.beligum.cms.views.html.error.fatal_error.render());
	Lang lang = Language.getLanguageForUrl(url);

	if (url == null || url.trim().equals("")) {
	    retVal = redirect("/");
	} else if (lang != null) {

	    // Get the correct page for this url in the correct language
	    PageRenderer pageRenderer = new PageRenderer(url);
	    Html content = pageRenderer.render();
	    if (content != null) {
		retVal = ok(content);
	    } else {
		retVal = ok(com.beligum.cms.views.html.error.fatal_error.render());
	    }
	} else {
	    // Redirect to url with language included
	    String newUrl = "/" + Language.getMasterLanguage().language() + "/" + PageManager.removeTrailingSlashes(Language.getUrlWithoutLanguage(url));
	    retVal = redirect(newUrl);
	}
	return retVal;

    }
    
   

    // -----PROTECTED FUNCTIONS-----

    // -----PRIVATE FUNCTIONS-----
}
