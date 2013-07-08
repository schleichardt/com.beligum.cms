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
package com.beligum.cms.utils;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import play.Logger;
import play.api.Play;
import play.api.templates.Html;
import play.i18n.Lang;
import play.i18n.Messages;
import play.mvc.Http;

import com.beligum.cms.models.Block;
import com.beligum.cms.models.Page;
import com.beligum.cms.models.PageBlock;
import com.beligum.cms.models.PageNotFoundPage;
import com.beligum.cms.repositories.BlockRepository;
import com.beligum.cms.utils.templating.LayoutWindow;
import com.beligum.core.accounts.UserManager;
import com.beligum.core.utils.security.UserRoles;

public class PageRenderer
{
    // -----CONSTANTS-----

    // -----VARIABLES-----
    private Lang currentLanguage;
    private Page masterPage;
    private Page translatedPage;
    private List<PageBlock> contentBlocks;
    private int blockIterator;

    // -----CONSTRUCTORS-----
    public PageRenderer(String url)
    {
	// Set the language and get url with language code
	// Language.setCurrentlanguageForUser(url);
	currentLanguage = Language.getPreferredLanguageForUrl(url);
	
	Language.setCurrentLanguageForUser(currentLanguage.language());
	url = PageManager.removeTrailingSlashes(Language.getUrlWithoutLanguage(url));
	url = "/" + currentLanguage.language() + "/" + url;

	// Get master page
	Long masterId = UrlRouter.getMasterIdForUrl(url);
	if (masterId != null) {
	    masterPage = BlockRepository.findPageById(masterId);
	}
	if (masterPage != null && masterPage.getSubblocks().size() > 0) {

	    Long translatedId = UrlRouter.getTranslatedIdForMasterId(masterId, currentLanguage.language());
	    if (translatedId != null) {
		translatedPage = BlockRepository.findPageById(translatedId);
	    }
	} else {
	    this.setAsPageNotFound(url);
	}

	blockIterator = 0;
    }

    public PageRenderer(Long id, String language)
    {
	// Get master page
	Long masterId = UrlRouter.getMasterIdForTranslatedId(id);
	if (masterId != null) {
	    masterPage = BlockRepository.findPageById(masterId);
	    Long translatedId = UrlRouter.getTranslatedIdForMasterId(masterId, currentLanguage.language());
	    if (translatedId != null) {
		translatedPage = BlockRepository.findPageById(translatedId);
	    }
	} else {
	    this.setAsPageNotFound(null);
	}

	blockIterator = 0;
    }

    // -----PUBLIC FUNCTIONS-----

    public String getTitle()
    {
	String retVal = "";
	if (translatedPage != null) {
	    retVal = translatedPage.getTitle();
	} else if (masterPage != null) {
	    retVal = masterPage.getTitle();
	}
	return retVal;
    }
    
    public Page getPage() {
	Page retVal = masterPage;
	if (translatedPage == null) {
	    retVal = masterPage;
	}
	return retVal;
    }

    public Long getId()
    {
	Long retVal = -1L;
	retVal = masterPage.getId();
	return retVal;
    }

    public String getLanguage()
    {
	String retVal = Language.getMasterLanguage().language();
	if (translatedPage != null) {
	    retVal = translatedPage.getLanguage();
	}
	return retVal;
    }

    public static String getUrl(String url)
    {
	return PageRenderer.getTranslatedUrlForCurrentLang(url);
    }

    public String getLongUrlForLanguage(String language)
    {
	String retVal = "";
	if (masterPage.getClass() != PageNotFoundPage.class) {
	    retVal = UrlRouter.getUrlForMasterId(masterPage.getId(), language);
	} else {
	    retVal = Http.Context.current().request().path();
	    retVal = Language.getUrlWithoutLanguage(retVal);
	    retVal = PageManager.addRootSlash(retVal);
	    retVal = "/" + language + retVal;
	}
	return retVal;
    }

    public List<Html> getTranslatedUrls()
    {
	List<Html> retVal = new ArrayList<Html>();
	for (Lang lang : Lang.availables()) {
	    StringBuilder link = new StringBuilder();
	    link.append("<a ");
	    if (lang.language().equals(Language.getCurrentLanguage())) {
		link.append("class=\"active\" ");
	    }
	    link.append("href=\"");
	    link.append(this.getLongUrlForLanguage(lang.language()));
	    link.append("\" title=\"");
	    link.append(lang.language());
	    link.append("\">");
	    link.append(lang.language());
	    link.append("</a>");
	    retVal.add(Html.apply(link.toString()));
	}
	return retVal;
    }

    public static String getTranslatedUrlForUrl(String url, String language)
    {
	String retVal = "";
	url = Language.getUrlWithoutLanguage(url);
	url = PageManager.addRootSlash(url);
	url = "/" + Language.getMasterLanguage().language() + url;
	Long masterId = UrlRouter.getMasterIdForUrl(url);
	if (masterId != null) {
	    retVal = UrlRouter.getUrlForMasterId(masterId, language);
	} else {
	    url = Language.getUrlWithoutLanguage(url);
	    url = PageManager.addRootSlash(url);
	    retVal = "/" + language + url;
	}
	return retVal;
    }

    public static String getTranslatedUrlForCurrentLang(String url)
    {
	String retVal = "";
	String currentLanguage = Http.Context.current().lang().language();
	url = Language.getUrlWithoutLanguage(url);
	url = PageManager.addRootSlash(url);
	url = "/" + Language.getMasterLanguage().language() + url;
	Long masterId = UrlRouter.getMasterIdForUrl(url);
	if (masterId != null) {
	    retVal = UrlRouter.getUrlForMasterId(masterId, currentLanguage);
	} else {
	    url = Language.getUrlWithoutLanguage(url);
	    url = PageManager.addRootSlash(url);
	    retVal = "/" + currentLanguage + url;
	}
	return retVal;
    }

    public static Html link(String url, String message)
    {
	return PageRenderer.link(url, message, null);
    }

    public static Html link(String url, String message, String classes)
    {
	return PageRenderer.link(url, message, classes, null);
    }

    public static Html link(String url, String message, String classes, String attributes)
    {
	message = Messages.get(message);
	if (url.startsWith("/")) {
	    url = PageRenderer.getUrl(url);
	}
	String path = Http.Context.current().request().path();
	StringBuilder link = new StringBuilder();
	link.append("<a ");
	if (path.startsWith(url)) {
	    link.append("class=\"active ");
	    if (classes != null) {
		link.append(classes);
	    }
	    link.append("\" ");
	} else if (classes != null) {
	    link.append("class=\"").append(classes).append("\" ");
	}
	if (attributes != null) {
	    link.append(" ").append(attributes).append(" ");
	}
	link.append("href=\"");
	link.append(url);
	link.append("\" title=\"");
	//TODO: quick fix; no html tags in the attribute
	link.append(message.replaceAll("\\<.*?\\>", ""));
	link.append("\">");
	link.append(message);
	link.append("</a>");
	return Html.apply(link.toString());
    }

    public Html render()
    {
	Class[] args1 = new Class[1];
	args1[0] = PageRenderer.class;

	try {
	    // String templatePackage = "views.html.cms.templates." + template;
	    // String templatePackage = "views.html.cms.templates.test";

	    // Class template = Class.forName(templatePackage);
	    // Class templateClass =
	    // templatePackage.getPackage(this.template).getClass();
	    // Class templateClass =
	    // templatePackage.getPackage(this.template).getClass();
	    // Class templateClass =
	    // Http.Context.current().getClass().getClassLoader().getSystemClassLoader().loadClass("views.html.cms.templates.test");
	    Class defaultTemplate = null;
	    Page currentPage = translatedPage == null ? masterPage : translatedPage;
	    String templatePackage = (String) play.Play.application().configuration().getString("com.beligum.cms.template.package");
	    String template = (String) play.Play.application().configuration().getString("com.beligum.cms.template.default");
	    if (currentPage.getTemplate() != null) {
		template = currentPage.getTemplate().getTemplate();
	    } else if (masterPage.getTemplate() != null) {
		template = masterPage.getTemplate().getTemplate();
	    }
	    try {
		defaultTemplate = Play.current().classloader().loadClass(templatePackage + "." + template);

	    } catch (ClassNotFoundException e) {
		e.printStackTrace();
	    }

	    Method renderTemplateMethod = defaultTemplate.getMethod("render", args1);
	    Html q = (Html) renderTemplateMethod.invoke(null, this);
	    return q;
	} catch (Exception e) {
	    Logger.debug("Error while rendering page", e);
	    return null;
	}
    }
    
    public Html renderBlock()
    {
	return this.renderBlock(null);
    }

    public Html renderBlock(String className)
    {
	// search block
	Block block = null;
	contentBlocks = this.getContentBlocks();
	if (blockIterator < this.getContentBlocks().size()) {
	    block = this.getContentBlocks().get(blockIterator);
	} else {
	    Page page = translatedPage == null ? masterPage : translatedPage;
	    block = new PageBlock(page);
	}
	blockIterator++;
	block.setUrlName(className);

	LayoutWindow window = new LayoutWindow(block);
	window.append(block.getHtml());
	String content = window.write();
	return Html.apply(content);
    }

    // -----PROTECTED FUNCTIONS-----

    // -----PRIVATE FUNCTIONS-----

    private List<PageBlock> getContentBlocks()
    {
	try {
	    if (contentBlocks == null) {
		if (translatedPage != null) {
		    Map<Long, PageBlock> tempBlocks = BlockRepository.findBlocksForPage(translatedPage);

		    contentBlocks = tempBlocks == null ? new ArrayList<PageBlock>() : new ArrayList<PageBlock>(tempBlocks.values());
		    // contentBlocks = (List<PageBlock>)
		    // BlockRepository.findBlocksForPage(translatedPage).values();
		}
		// NO else if!
		if (contentBlocks == null || contentBlocks.size() == 0 && masterPage != null) {
		    Map<Long, PageBlock> tempBlocks = BlockRepository.findBlocksForPage(masterPage);

		    contentBlocks = tempBlocks == null ? new ArrayList<PageBlock>() : new ArrayList<PageBlock>(tempBlocks.values());

		    // contentBlocks = (List<PageBlock>)
		    // BlockRepository.findBlocksForPage(masterPage).values();
		}

		if (contentBlocks == null || contentBlocks.size() == 0) {
		    contentBlocks = new ArrayList<PageBlock>();
		}
	    }
	} catch (Exception e) {
	    e.printStackTrace();
	}
	return contentBlocks;
    }
    
    private void setAsPageNotFound(String url)
    {
	 // Page Not Found
	    String pageNotFoundMessage = "Page not found";
	    if (UserManager.getCurrentUser() != null &&
		UserManager.getCurrentUser().getRoles().contains(UserRoles.forName(UserRoles.ADMIN))) {
		pageNotFoundMessage = "Page not found. If you want, you can create this page in the admin section.";
	    }
	    masterPage = new PageNotFoundPage(null, pageNotFoundMessage);
	    if (url != null) {
		 masterPage.setTemplate(PageManager.getPreferredTemplateForUrl(url));
	    }
	    contentBlocks = masterPage.getSubblocks();
    
    }

}
