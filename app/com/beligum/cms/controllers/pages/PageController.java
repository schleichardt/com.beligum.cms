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
package com.beligum.cms.controllers.pages;

import play.api.templates.Html;
import play.i18n.Lang;
import play.mvc.Controller;
import play.mvc.Result;

import com.beligum.cms.data.Language;
import com.beligum.cms.utils.PageManager;
import com.beligum.cms.utils.PageRenderer;

public class PageController extends Controller
{
    // -----CONSTANTS-----

    // -----VARIABLES-----

    // -----PUBLIC FUNCTIONS-----

    public static Result show(String url)
    {
	Result retVal = badRequest(com.beligum.cms.views.html.error.fatal_error.render());
	Lang lang = Language.getLanguageForUrl(url);

	if (url == null) {
	    url = "";
	}
	url = url.trim();
	if (lang != null) {

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
