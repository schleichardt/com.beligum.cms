package com.beligum.cms.url;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import models.Page;
import play.i18n.Lang;

import com.avaje.ebean.Ebean;
import com.beligum.cms.I18.Language;
import com.beligum.cms.managers.PageManager;
import com.beligum.cms.repository.BlockRepository;

public class UrlRouter
{
    // -----CONSTANTS-----

    // -----VARIABLES-----

    private static Map<Long, String> idToUrlName = null;
    private static Map<String, Long> longUrlToMasterId = null;
    private static Map<Long, Map<String, String>> masterIdToLongUrls = null;
    private static Map<Long, Map<String, Long>> masterToTranslation = null;
    private static Map<Long, Long> translationToMaster = null;
    private static Map<Long, Long> parentForMasterId = null;

    // private static Map<Long, String> idToLongUrl = null;

    // -----CONSTRUCTORS-----

    private static void createUrlMaps()
    {
	if (idToUrlName == null ||
	    longUrlToMasterId == null || masterIdToLongUrls == null || masterToTranslation == null || translationToMaster == null ||
	    parentForMasterId == null) {
	    // find all pages
	    idToUrlName = new HashMap<Long, String>();
	    longUrlToMasterId = new HashMap<String, Long>();
	    masterIdToLongUrls = new HashMap<Long, Map<String, String>>();
	    masterToTranslation = new HashMap<Long, Map<String, Long>>();
	    translationToMaster = new HashMap<Long, Long>();
	    parentForMasterId = new HashMap<Long, Long>();

	    List<Page> allPages = Ebean.find(Page.class).findList();

	    List<Page> masterPages = new ArrayList<Page>();

	    for (Page page : allPages) {
		idToUrlName.put(page.getId(), page.getUrlName());
		if (page.getMasterPage() == null) {
		    masterToTranslation.put(page.getId(), new HashMap<String, Long>());
		    // add translation master language to master language
		    // -> is easy when we want to get all languages without
		    // checking for master language
		    masterToTranslation.get(page.getId()).put(page.getLanguage(), page.getId());
		    translationToMaster.put(page.getId(), page.getId());
		    masterPages.add(page);
		} else {
		    if (masterToTranslation.get(page.getMasterPage()) == null) {
			masterToTranslation.put(page.getMasterPage(), new HashMap<String, Long>());
		    }
		    masterToTranslation.get(page.getMasterPage()).put(page.getLanguage(), page.getId());
		    translationToMaster.put(page.getId(), page.getMasterPage());
		}

	    }

	    for (Page page : masterPages) {
		String[] ids = PageManager.removeTrailingSlashes(page.getAbsolutePath()).split("/");
		Map<String, StringBuilder> translatedUrlsBuilder = new HashMap<String, StringBuilder>();
		// prepare translated urls for all languages
		for (Lang lang : Lang.availables()) {
		    translatedUrlsBuilder.put(lang.language(), new StringBuilder().append("/").append(lang.language()));
		}

		// create urls for all languages for this masterpage
		Long parentId = null;
		for (String sId : ids) {
		    Long id = Long.parseLong(sId);
		    Map<String, Long> translationIds = masterToTranslation.get(id);
		    for (Lang lang : Lang.availables()) {
			String translatedUrlName = idToUrlName.get(translationIds.get(lang.language()));
			if (translatedUrlName == null) {
			    translatedUrlName = idToUrlName.get(id); // Set to
								     // UrlName
								     // master
								     // page
			}
			translatedUrlsBuilder.get(lang.language()).append("/").append(translatedUrlName);
		    }
		    parentForMasterId.put(id, parentId);
		    parentId = id;
		}
		// build urls and add to cache
		Map<String, String> translatedUrls = new HashMap<String, String>();
		for (Lang lang : Lang.availables()) {
		    longUrlToMasterId.put(translatedUrlsBuilder.get(lang.language()).toString(), page.getId());
		    translatedUrls.put(lang.language(), translatedUrlsBuilder.get(lang.language()).toString());

		}
		masterIdToLongUrls.put(page.getId(), translatedUrls);

	    }

	}

    }

    public static void resetUrlMaps()
    {
	idToUrlName = null;
	longUrlToMasterId = null;
	UrlRouter.createUrlMaps();
    }

    // -----PUBLIC FUNCTIONS-----

    public static Long getMasterIdForUrl(String url)
    {
	UrlRouter.createUrlMaps();
	return longUrlToMasterId.get(url);
    }

    public static Long getMasterIdForTranslatedId(Long id)
    {
	UrlRouter.createUrlMaps();
	return translationToMaster.get(id);
    }

    public static Long getTranslatedIdForMasterId(Long id, String language)
    {
	UrlRouter.createUrlMaps();
	Long retVal = null;
	Map<String, Long> test = masterToTranslation.get(id);
	if (test != null) {
	    retVal = test.get(language);
	}
	return retVal;
    }

    public static String getUrlForMasterId(Long id, String language)
    {
	UrlRouter.createUrlMaps();
	return masterIdToLongUrls.get(translationToMaster.get(id)).get(language);
    }

    public static List<Page> findMasterParentPagesByUrlName(String url)
    {
	UrlRouter.createUrlMaps();
	List<Page> retVal = new ArrayList<Page>();
	Lang l = Language.getPreferredLanguageForUrl(url);
	url = Language.getUrlWithoutLanguage(url);
	url = PageManager.removeTrailingSlashes(url);
	String longurl = "/" + l.language() + "/" + url;
	Long id = UrlRouter.longUrlToMasterId.get(longurl);
	if (id == null) {
	    longurl = "/" + Language.getMasterLanguage().language() + "/" + url;
	    id = UrlRouter.longUrlToMasterId.get(longurl);
	}

	if (id != null) {
	    retVal = UrlRouter.findMasterParentPagesById(id);
	}

	return retVal;

    }

    public static List<Page> findMasterParentPagesById(Long id)
    {
	UrlRouter.createUrlMaps();
	List<Page> retVal = new ArrayList<Page>();
	Long parent = UrlRouter.translationToMaster.get(id);
	while (parent != null) {
	    retVal.add(BlockRepository.findPageById(parent));
	    parent = UrlRouter.parentForMasterId.get(parent);
	}
	return retVal;
    }

    public static List<Page> findTranslatedParentPagesByMasterId(Long id, String language)
    {
	UrlRouter.createUrlMaps();
	List<Page> retVal = new ArrayList<Page>();
	Long parent = UrlRouter.parentForMasterId.get(id);
	retVal.add(BlockRepository.findPageById(id));
	while (parent != null) {
	    retVal.add(0, BlockRepository.findPageById(UrlRouter.masterToTranslation.get(parent).get(language)));
	    parent = UrlRouter.parentForMasterId.get(parent);
	}
	
	return retVal;
    }

    public static List<Page> findTranslationsForMasterId(Long id)
    {
	UrlRouter.createUrlMaps();
	List<Page> retVal = new ArrayList<Page>();
	List<Long> ids = new ArrayList<Long>(UrlRouter.masterToTranslation.get(id).values());
	for (Long tId : ids) {
	    retVal.add(BlockRepository.findPageById(tId));
	}
	return retVal;
    }

    public static Boolean findChildPagesForId(Long id)
    {
	UrlRouter.createUrlMaps();
	Long masterId = UrlRouter.translationToMaster.get(id);
	return UrlRouter.parentForMasterId.containsValue(masterId);
    }

    // -----PROTECTED FUNCTIONS-----

    // -----PRIVATE FUNCTIONS-----
}
