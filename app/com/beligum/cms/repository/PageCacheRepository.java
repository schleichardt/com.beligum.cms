package com.beligum.cms.repository;

import java.util.Map;

import models.Page;
import models.PageBlock;
import play.Logger;

import com.beligum.core.utils.Cacher;


public class PageCacheRepository
{
    // -----CONSTANTS-----
    public static final String PAGE_ID = "page-id-";
    public static final String PAGE_PATH = "page-path-";
    public static final String PAGE_URL = "page-url-";
    public static final String BLOCKS_ID = "blocks-id-";

    // -----VARIABLES-----

    // -----CONSTRUCTORS-----

    // -----PUBLIC FUNCTIONS-----

    public static void storePage(Page page)
    {

	    //Cacher.storeApplicationObject(PageCacheRepository.idKey(page.getId(), page.getLanguage()), page);
	    Cacher.storeApplicationObject(PageCacheRepository.basicIdKey(page.getId()), page);

    }
    
    public static void storeBlocks(Long id, Map<Long, PageBlock> blocks)
    {

	    Cacher.storeApplicationObject(PageCacheRepository.blocksKey(id), blocks);
    }


    // Paged is saved in the cache by:
    // - id
    // - id + language
    // (- masterid + language) -> if translated page
//    public static void storeTranslatedPage(Page page, Long masterPageId)
//    {
//
//	    PageCacheRepository.storePage(page);
//
//	    if (masterPageId != null) {
//		Cacher.storeApplicationObject(PageCacheRepository.idKey(masterPageId, page.getLanguage()), page);
//		// Check if masterPage exists in the Cache, set the masterobject
//		// in
//		// this page to the one in the cache
//		// to evade Optimistic Lock Exceptions
//		if (Cacher.containsApplicationObject(PageCacheRepository.idKey(masterPageId, Language.getMasterLanguage().language()))) {
//		    page.setMasterPage((Page) Cacher.fetchApplicationObject(PageCacheRepository.idKey(masterPageId,
//												      Language.getMasterLanguage()
//													      .language())));
//		} else {
//		    Page masterPage = page.getMasterPage();
//		    PageCacheRepository.storePage(masterPage);
//		}
//	    }
//
//
//    }

//    public static Page fetchPage(Long id, String language)
//    {
//	Page retVal = null;
//	if (Cacher.containsApplicationObject(PageCacheRepository.idKey(id, language))) {
//	    retVal = (Page) Cacher.fetchApplicationObject(PageCacheRepository.idKey(id, language));
//	    Logger.debug("Page fetched from cache by id");
//	}
//	return retVal;
//    }
//    
    public static Map<Long, PageBlock> fetchBlocks(Long id)
    {
	Map<Long, PageBlock> retVal = null;
	if (Cacher.containsApplicationObject(PageCacheRepository.blocksKey(id))) {
	    retVal = (Map<Long, PageBlock>) Cacher.fetchApplicationObject(PageCacheRepository.blocksKey(id));
	    Logger.debug("Page fetched from cache by id");
	}
	return retVal;
    }

    public static Page fetchPage(Long id)
    {
	Page retVal = null;
	if (Cacher.containsApplicationObject(PageCacheRepository.basicIdKey(id))) {
	    retVal = (Page) Cacher.fetchApplicationObject(PageCacheRepository.basicIdKey(id));
	    Logger.debug("Page fetched from cache by id");
	}
	return retVal;
    }

//    public static List<Page> fetchPages(List<Long> ids, String language)
//    {
//	Logger.debug("Trying to fetch pages for list of ids");
//	List<Page> retVal = new ArrayList<Page>();
//	for (Long id : ids) {
//	    Page p = PageCacheRepository.fetchPage(id, language);
//	    if (p != null) {
//		retVal.add(p);
//	    }
//	}
//	if (ids.size() != retVal.size()) {
//	    retVal = null;
//	    Logger.debug("Could not fetch all pages for list of ids");
//	}
//	return retVal;
//    }
//    
//    public static List<Page> fetchPages(List<Long> ids)
//    {
//	Logger.debug("Trying to fetch pages for list of ids");
//	List<Page> retVal = new ArrayList<Page>();
//	for (Long id : ids) {
//	    Page p = PageCacheRepository.fetchPage(id);
//	    if (p != null) {
//		retVal.add(p);
//	    }
//	}
//	if (ids.size() != retVal.size()) {
//	    retVal = null;
//	    Logger.debug("Could not fetch all pages for list of ids");
//	}
//	return retVal;
//    }
//
//    public static List<Page> fetchParentPages(Page page)
//    {
//	Logger.debug("Trying to fetch pages for parentpath");
//	List<Page> retVal = new ArrayList<Page>();
//	try {
//	    String parentPath = PageManager.removeTrailingSlashes(page.getAbsolutePath());
//	    String[] paths = parentPath.split("/");
//	    for (String pId : paths) {
//		Long id = Long.parseLong(pId);
//		Page p = PageCacheRepository.fetchPage(id, page.getLanguage());
//		if (p != null) {
//		    retVal.add(p);
//		}
//	    }
//
//	    if (paths.length != retVal.size()) {
//		retVal = null;
//		Logger.debug("Could not fetch all pages for parentpath");
//	    }
//
//	} catch (Exception e) {
//	    retVal = null;
//	}
//	return retVal;
//    }
//
//    public static void storeUrl(String[] urlPath, String language, List<Long> ids)
//    {
//
//	Cacher.storeApplicationObject(PageCacheRepository.urlKey(urlPath, language), ids);
//    }
//
//    public static List<Long> fetchUrl(String[] urlPath, String language)
//    {
//	List<Long> retVal = null;
//	if (Cacher.containsApplicationObject(PageCacheRepository.urlKey(urlPath, language))) {
//	    retVal = (List<Long>) Cacher.fetchApplicationObject(PageCacheRepository.urlKey(urlPath, language));
//	    Logger.debug("Fetching ids from cache");
//	}
//	return retVal;
//    }
//
//    public static void moveForUrl(String[] oldUrlPath, String[] newUrlPath, String language)
//    {
//	List<Long> retVal = null;
//	if (Cacher.containsApplicationObject(PageCacheRepository.urlKey(oldUrlPath, language))) {
//	    retVal = (List<Long>) Cacher.fetchApplicationObject(PageCacheRepository.urlKey(oldUrlPath, language));
//
//	    if (retVal != null) {
//		PageCacheRepository.storeUrl(newUrlPath, language, retVal);
//		PageCacheRepository.storeUrl(oldUrlPath, language, null);
//	    }
//	}
//    }
    
//    public static void removePageFromCache(Page page) {
//	//Cacher.storeApplicationObject(PageCacheRepository.idKey(page.getId(), page.getLanguage()), null);
//	Cacher.storeApplicationObject(PageCacheRepository.basicIdKey(page.getId()), null);
//    }
//    
//    public static void removeUrlFromCache(Page page) {
//	String url = PageManager.getLongUrl(page, page.getLanguage());
//	url = Language.getUrlWithoutLanguage(url);
//	String[] urlPath = PageManager.getUrlPath(url);
//	Cacher.storeApplicationObject(PageCacheRepository.urlKey(urlPath, page.getLanguage()), null);
//    }

    // -----PROTECTED FUNCTIONS-----

    // -----PRIVATE FUNCTIONS-----

    private static String idKey(Long id, String language)
    {
	return PageCacheRepository.PAGE_ID + id + language;
    }

    private static String basicIdKey(Long id)
    {
	return PageCacheRepository.PAGE_ID + id + "beligum";
    }

    private static String urlKey(String[] urlPath, String language)
    {
	String url = "";
	for (String u : urlPath) {
	    url += "/" + u;
	}
	url = language + '/' + url;
	return PageCacheRepository.PAGE_URL + url;
    }
    
    private static String blocksKey(Long id) {
	return PageCacheRepository.BLOCKS_ID + id;
    }
}
