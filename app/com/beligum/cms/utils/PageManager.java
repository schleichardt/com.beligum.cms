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
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import play.Logger;
import play.api.Play;
import play.api.templates.Html;
import play.i18n.Lang;

import com.avaje.ebean.Ebean;
import com.beligum.cms.exception.CmsException;
import com.beligum.cms.models.Block;
import com.beligum.cms.models.Page;
import com.beligum.cms.models.PageBlock;
import com.beligum.cms.models.Template;
import com.beligum.cms.repositories.BlockRepository;
import com.beligum.cms.repositories.PageCacheRepository;
import com.beligum.cms.utils.templating.Content;
import com.beligum.core.repositories.BasicRepository;
import com.beligum.core.utils.Cacher;

public class PageManager
{
    // -----CONSTANTS-----

    // -----VARIABLES-----

    // -----CONSTRUCTORS-----
    public PageManager()
    {
    }

    // -----PUBLIC FUNCTIONS-----

    public static Page create(String url)
    {
	Page retVal = null;
	if (url != null && url.trim().length() > 0) {
	    // check if this page exists in the master language.
	    
	    String longurl = PageManager.createValidUrl(url);
	    Lang lang = Language.getPreferredLanguageForUrl(longurl);
	   
	    
	    List<String> pagesToCreate = new ArrayList<String>();
	    if (!lang.language().equals(Language.getMasterLanguage().language())) {
		throw new CmsException("Can not create a page that is not in the master language");
	    }

	    Long masterId = UrlRouter.getMasterIdForUrl(PageManager.createValidUrl(url));
	    if (masterId == null) {
		
		url = Language.getUrlWithoutLanguage(longurl);
		url = PageManager.removeTrailingSlashes(url);
		String[] arrayUrlPath = url.split("/");
		List<String> urlPath = new ArrayList<String>(Arrays.asList(arrayUrlPath));
		while (masterId == null && urlPath.size() > 0) {
		    int removeAtIndex = urlPath.size() - 1;
		    String urlName = urlPath.remove(removeAtIndex); // remove
									 // last
									 // element
									 // from
									 // path
		    masterId = UrlRouter.getMasterIdForUrl(PageManager.createUrlFromPath(urlPath, lang.language()));
		    pagesToCreate.add(0, urlName);
		}

		// masterId contains the last parentPage
		// pagesToCreate contains all the urlNames for the pages we have
		// to create
		
	    }
	    
	    Template template = PageManager.getPreferredTemplateForUrl(url);
	    
	    Page existingPage = null;
		if (masterId == null) {
		    // create the first page
		    existingPage = new Page(pagesToCreate.remove(0));
		    existingPage.setTemplate(template);
		    existingPage.setLanguage(lang.language());
		    existingPage = BlockRepository.savePage(existingPage);

		} else {
		    existingPage = BlockRepository.findPageById(masterId);
		    // set Template to template of parent
		    for (Page tPage : UrlRouter.findMasterParentPagesById(masterId)) {
			if (tPage.getTemplate() != null) {
			    template = tPage.getTemplate();
			}
		    }
		}

		for (String urlName : pagesToCreate) {
		    existingPage = new Page(existingPage, urlName);
		    existingPage.setTemplate(template);
		    existingPage.setLanguage(lang.language());
		    existingPage = BlockRepository.savePage(existingPage);
		}
		if (existingPage != null && existingPage.getSubblocks().size() == 0) {
		    PageBlock newBlock = new PageBlock(existingPage);
		    newBlock.setUrlName("");
		    Content e = new Content();
		    newBlock.setHtml(e.write());
		    BasicRepository.save(newBlock);

		}

	}
	UrlRouter.resetUrlMaps();
	Cacher.flushApplicationCache();
	return retVal;
    }

    // public static Page getPageForLanguage(String url, String language)
    // {
    // // Find
    // Page page = BlockRepository.findPageByUrlName(url, language);
    //
    // // Check if this page is the master page or the correct translated page
    // if (page != null && !page.getLanguage().equals(language)) {
    // Page t_page = PageManager.getSlavePage(page, language);
    // if (t_page != null) {
    // page = t_page;
    // } else if (UserManager.getCurrentUser() != null &&
    // UserManager.getCurrentUser().getRoles().contains(UserRoles.forName(UserRoles.ADMIN)))
    // {
    // // No translation found but we are admin so give us the
    // // opportunity to create this page
    // Template template = page.getTemplate();
    // page = new PageNotFoundPage(page,
    // "Translation not found. If you want, you can create this page in the admin section.");
    // page.setTemplate(template);
    // }
    // }
    //
    // // Page not found?
    // if (page == null || page.getSubblocks().size() == 0) {
    // String pageNotFoundMessage = "Page not found";
    // if (UserManager.getCurrentUser() != null &&
    // UserManager.getCurrentUser().getRoles().contains(UserRoles.forName(UserRoles.ADMIN)))
    // {
    // pageNotFoundMessage =
    // "Page not found. If you want, you can create this page in the admin section.";
    // }
    //
    // page = new PageNotFoundPage(null, pageNotFoundMessage);
    //
    // // Try to set this page to the correct template
    // List<Page> pagesInUrl = BlockRepository.findMasterPagesByUrlName(url,
    // language);
    // for (Page tPage : pagesInUrl) {
    // if (tPage.getTemplate() != null) {
    // page.setTemplate(tPage.getTemplate());
    // }
    // }
    // }
    // return page;
    // }

    public static Page savePage(Page updatedPage)
    {
	Page masterPage = BlockRepository.findPageById(UrlRouter.getMasterIdForTranslatedId(updatedPage.getId()));
	String language = updatedPage.getLanguage();
	// TODO: CHech if valif language
	
	// When we save a page, we save all the subblocks
	// Depending on the template it's possible that blocks were added or
	// deleted
	//
	if (masterPage != null) {

	    // loop through all the blocks for this page
	    // update existing blocks
	    // save new blocks
	    // finally remove existing blocks that weren't updated -> those
	    // are removed from the page
	    Page oldSavedPage = null;
	    if (UrlRouter.getTranslatedIdForMasterId(masterPage.getId(), updatedPage.getLanguage()) != null) {
		oldSavedPage =  BlockRepository.findPageById(UrlRouter.getTranslatedIdForMasterId(masterPage.getId(), updatedPage.getLanguage()));
	    }
	    // We did not found a translated Page in this language
	    if (oldSavedPage == null) {
		
		List<Page> masterPages = UrlRouter.findMasterParentPagesById(UrlRouter.getMasterIdForTranslatedId(updatedPage.getId()));
		Page translatedPage = null;
		Long lastTranslatedId = null;
		for (int i = masterPages.size() - 1; i>= 0; i--) {
		    Page mPage = masterPages.get(i);
		    // check for translated Page
		    lastTranslatedId = UrlRouter.getTranslatedIdForMasterId(mPage.getId(), language);
		    if (lastTranslatedId == null) {
			// create this page;
			translatedPage = new Page(translatedPage, mPage.getUrlName());
			translatedPage.setMasterPage(mPage.getId());
			translatedPage.setLanguage(Language.getCurrentLanguage());
			BlockRepository.savePage(translatedPage);
			lastTranslatedId = translatedPage.getId();
		    } else {
			translatedPage = BlockRepository.findPageById(lastTranslatedId);
		    }
		}
		oldSavedPage = BlockRepository.findPageById(lastTranslatedId);
	    }
	    
	    Map<Long, PageBlock> oldSavedBlocks = BlockRepository.findBlocksForPage(oldSavedPage);
	    Map<Long, PageBlock> newSavedBlocks = new HashMap<Long, PageBlock>();

	    // Loop throug all the blocks on the current page
	    for (PageBlock updatedBlock : updatedPage.getSubblocks()) {
		PageBlock savedBlock = oldSavedBlocks.get(updatedBlock.getId());
		if (savedBlock == null) {
		    savedBlock = new PageBlock(oldSavedPage);
		    savedBlock.setHtml(updatedBlock.getHtml());
		    savedBlock.setUrlName(updatedBlock.getUrlName());
		    savedBlock = BasicRepository.save(savedBlock);
		    newSavedBlocks.put(savedBlock.getId(), savedBlock);
		} else {
		    savedBlock.setHtml(updatedBlock.getHtml());
		    savedBlock = BasicRepository.update(savedBlock);
		    savedBlock.setUrlName(updatedBlock.getUrlName());
		    newSavedBlocks.put(savedBlock.getId(), oldSavedBlocks.remove(savedBlock.getId()));
		}
	    }
	    
	    for (Block b : oldSavedBlocks.values()) {
		BasicRepository.delete(b);
	    }
	    
	    // And restore the stored blocks
	    PageCacheRepository.storeBlocks(oldSavedPage.getId(), newSavedBlocks);

	}
	UrlRouter.resetUrlMaps();
	return masterPage;
    }
    // Render the template
    // . We instantiate the template by classname
    // then run the render method which takes a Page object as parameter
    public static Html renderPage(Page page)
    {
	Class[] args1 = new Class[1];
	args1[0] = Page.class;

	try {
	    Class defaultTemplate = null;

	    String templatePackage = (String) play.Play.application().configuration().getString("com.beligum.cms.template.package");
	    String template = (String) play.Play.application().configuration().getString("com.beligum.cms.template.default");
	    if (page.getTemplate() != null) {
		template = page.getTemplate().getTemplate();
	    }
	    try {
		defaultTemplate = Play.current().classloader().loadClass(templatePackage + "." + template);

	    } catch (ClassNotFoundException e) {
		e.printStackTrace();
	    }

	    Method renderTemplateMethod = defaultTemplate.getMethod("render", args1);
	    Html q = (Html) renderTemplateMethod.invoke(null, page);
	    return q;
	} catch (Exception e) {
	    Logger.debug("Error while rendering page:" + page, e);
	    return null;
	}
    }

    public static void deletePage(Page page, boolean fullPage)
    {
	// get Slave Pages
	if (page.getMasterPage() == null) {
	    // get Slave Pages and delete them
	    List<Page> slavePages = UrlRouter.findTranslationsForMasterId(page.getId());
	    for (Page p : slavePages) {
		if (!p.getId().equals(page.getId())) {
		    PageManager.deletePage(p, fullPage);
		}
	    }
	}

	// delete Blocks
	List<PageBlock> blocks = page.getSubblocks();
	Ebean.delete(blocks);


	// Do not only remove the blocks but also the page itself
	if (fullPage) {

	    // delete page
	    Ebean.delete(page);
	}

    }

    
    public static Template getPreferredTemplateForUrl(String url)
    {
	Template retVal = null;
	// find all existing pages in an url, and check if they contain a template
	// if they do, return this template
	String language = Language.getPreferredLanguageForUrl(url).language();
	url = Language.getUrlWithoutLanguage(url);
	url = PageManager.removeTrailingSlashes(url);
	String[] arrayUrlPath = url.split("/");
	List<String> urlPath = new ArrayList<String>(Arrays.asList(arrayUrlPath));
	Long masterId = null;
	Long translatedId = null;
	Page page = null;
	while (retVal == null && urlPath.size() > 0) {
	    int removeAtIndex = urlPath.size() - 1;
	    String urlName = urlPath.remove(removeAtIndex); // remove
								 // last
								 // element
								 // from
								 // path
	    masterId = UrlRouter.getMasterIdForUrl(PageManager.createUrlFromPath(urlPath, language));
	    translatedId = UrlRouter.getTranslatedIdForMasterId(masterId, language);
	    // We first look for a template in the translated parent page
	    // Else check the masterPage
	    if (translatedId != null) {
		page = BlockRepository.findPageById(translatedId);
		if (page != null) {
		    retVal = page.getTemplate();
		}
	    }
	    if (masterId != null && retVal == null) {
		page = BlockRepository.findPageById(masterId);
		if (page != null) {
		    retVal = page.getTemplate();
		}
	    }
	}
	
	return retVal;
    }
    
    public static String createValidUrl(String url)
    {

	Lang l = Language.getPreferredLanguageForUrl(url);
	String retVal = Language.getUrlWithoutLanguage(url);
	retVal = PageManager.removeTrailingSlashes(retVal);
	return "/" + l.language() + "/" + retVal;
    }

    public static String createValidUrl(String url, String language)
    {
	String retVal = Language.getUrlWithoutLanguage(url);
	retVal = PageManager.removeTrailingSlashes(retVal);
	return "/" + language + "/" + retVal;
    }

    public static String createUrlFromPath(List<String> urlNames, String language)
    {
	// String seperator = "/";
	StringBuilder sb = new StringBuilder();
	sb.append("/").append(language);
	String sep = "/";
	for (String s : urlNames) {
	    sb.append(sep).append(s);
	}
	return sb.toString();
    }

    public static String removeTrailingSlashes(String url)
    {
	url = url.trim();
	if (url.length() > 0) {
	    int i = 0;
	    while (i < url.length() && url.substring(i, i + 1).equals("/")) {
		i++;
	    }
	    url = url.substring(i);
	    i = url.length();
	    while (i > 0 && url.substring(i - 1, i).equals("/")) {
		i--;
	    }
	    url = url.substring(0, i);
	}
	// url = utils.Toolkit.urlize(url);
	return url;
    }

    public static String addRootSlash(String url)
    {
	url = url.trim();
	if (url.length() > 0) {
	    if (!url.substring(0, 1).equals("/")) {
		url = "/" + url;
	    }
	}
	// url = utils.Toolkit.urlize(url);
	return url;
    }

    // -----PROTECTED FUNCTIONS-----

    // -----PRIVATE FUNCTIONS-----
}
