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
package com.beligum.cms.repositories;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.PersistenceException;

import play.Logger;

import com.avaje.ebean.Ebean;
import com.beligum.cms.exception.CmsException;
import com.beligum.cms.models.Block;
import com.beligum.cms.models.Page;
import com.beligum.cms.models.PageBlock;

public class BlockRepository
{
    // -----CONSTANTS-----

    public static String sqlPath = "Select Distinct t2.id, t2.parent_path, t1.id as parentid from cms_block t1, cms_block t2, cms_block t3, cms_block t4 WHERE "
				   + "((t3.master_page = t1.id AND t3.url_name = :urlParent) OR (t3.master_page is null AND t1.url_name = :urlParent)) AND "
				   + "((t4.master_page = t2.id AND t4.url_name IN (:urlPath)) OR (t4.master_page is null AND t2.url_name IN (:urlPath))) AND "
				   + "((t3.language = :language OR t3.language = :masterlanguage) AND t1.language = :masterlanguage) AND ((t4.language = :language OR t4.language = :masterlanguage) AND t2.language = :masterlanguage) AND "
				   + "concat(concat(concat(t2.parent_path, '/'), t2.id), '/') LIKE concat(concat(concat(t1.parent_path, '/'), t1.id), '/%') ORDER BY parent_path DESC";

    // -----VARIABLES-----

    // -----CONSTRUCTORS-----

    // -----PUBLIC FUNCTIONS-----

//    private static List<SqlRow> findUrlSegmentsForPage(String[] urlPath, String language)
//    {
//	List<SqlRow> retVal = null;
//	try {
//	    Logger.debug("find Url segments in DB");
//	    // t1 is child in the masterlanguage, t2 is parent in the master
//	    // language, t3 is child in the other language and t4 is parent in
//	    // teh other language
//	    SqlQuery pathQuery = Ebean.createSqlQuery(BlockRepository.sqlPath);
//	    pathQuery.setParameter("urlParent", urlPath[0]);
//	    pathQuery.setParameter("language", language);
//	    pathQuery.setParameter("masterlanguage", Language.getMasterLanguage().language());
//
//	    String allSegments = "";
//	    int i = 0;
//	    while (i < urlPath.length - 1) {
//		allSegments += "'" + urlPath[i] + "', ";
//		i++;
//	    }
//	    allSegments += "'" + urlPath[urlPath.length - 1] + "'";
//	    // List of all segments
//	    // first is child, last is first parent
//
//	    pathQuery.setParameter("urlPath", Arrays.asList(urlPath));
//	    retVal = pathQuery.findList();
//
//	} catch (Exception e) {
//	    e.printStackTrace();
//	    Logger.debug("Child page for this url is not found");
//	}
//	return retVal;
//    }

    // returns all the id's of the MASTERPAGES in the urlPath
//    private static List<Long> findMasterIdsForPage(String[] urlPath, String language)
//    {
//	List<Long> retVal = PageCacheRepository.fetchUrl(urlPath, language);
//	if (retVal == null) {
//	    List<SqlRow> rows = BlockRepository.findUrlSegmentsForPage(urlPath, language);
//	    retVal = new ArrayList<Long>();
//	    for (SqlRow r : rows) {
//		retVal.add(r.getLong("id"));
//	    }
//
//	    if (retVal.size() == urlPath.length) {
//		PageCacheRepository.storeUrl(urlPath, language, retVal);
//	    }
//	}
//	return retVal;
//    }

    // private static List<String> findParentPathsForPage(String[] urlPath,
    // String language) {
    // List<String> retVal = new ArrayList<String>();
    // List<SqlRow> rows = BlockRepository.findUrlSegmentsForPage(urlPath,
    // language);
    //
    // for (SqlRow r: rows) {
    // retVal.add(r.getString("parent_path"));
    // }
    // return retVal;
    // }

//    public static Page findPageByUrlName(String url, String language) throws PersistenceException
//    {
//	Page retVal = null;
//	try {
//	    if (url != null && !url.trim().equals("")) {
//		url = PageManager.removeTrailingSlashes(url);
//		String[] urlPath = url.split("/");
//		List<Long> ids = BlockRepository.findMasterIdsForPage(urlPath, language);
//		if (ids != null && ids.size() == urlPath.length) {
//		    retVal = PageCacheRepository.fetchPage(ids.get(0), language);
//		    if (retVal == null) {
//
//			if (!language.equals(Language.getMasterLanguage().language())) {
//			    retVal = Ebean.find(Page.class).where().eq("masterPage.id", ids.get(0)).eq("language", language).findUnique();
//			    if (retVal != null) {
//				PageCacheRepository.storeTranslatedPage(retVal, ids.get(0));
//			    }
//			}
//
//			if (language.equals(Language.getMasterLanguage().language()) || retVal == null) {
//			    retVal = Ebean.find(Page.class, ids.get(0));
//			    if (retVal != null) {
//				PageCacheRepository.storePage(retVal);
//			    }
//			}
//		    }
//		}
//	    }
//	} catch (Exception e) {
//
//	}
//
//	return retVal;
//    }

    // public static Page findClosestPageByUrlName(String url, String language)
    // throws PersistenceException
    // {
    // Page retVal = null;
    // try {
    // if (url != null && !url.trim().equals("")) {
    // url = com.beligum.cms.models.Page.removeTrailingSlashes(url);
    // String[] urlPath = url.split("/");
    // List<Long> ids = BlockRepository.findIdsForPage(urlPath, language);
    // if (ids != null) {
    // if (!language.equals(Language.getMasterLanguage().language())) {
    // retVal = Ebean.find(Page.class).where().eq("masterPage.id",
    // ids.get(0)).eq("language", language)
    // .findUnique();
    // }
    // if (language.equals(Language.getMasterLanguage().language()) || retVal ==
    // null) {
    // retVal = Ebean.find(Page.class, ids.get(0));
    // }
    // }
    // }
    // } catch (Exception e) {
    //
    // }
    //
    // return retVal;
    // }

    // For a given url, find all pages in the master language that are in the
    // tree
//    public static List<Page> findMasterPagesByUrlName(String url, String language) throws PersistenceException
//    {
//	List<Page> retVal = null;
//	try {
//	    if (url != null && !url.trim().equals("")) {
//		url = PageManager.removeTrailingSlashes(url);
//		String[] urlPath = url.split("/");
//		List<Long> ids = BlockRepository.findMasterIdsForPage(urlPath, language);
//		if (ids != null) {
//		    retVal = PageCacheRepository.fetchPages(ids, Language.getMasterLanguage().language());
//		    if (retVal == null) {
//			retVal = Ebean.find(Page.class).where().in("id", ids).findList();
//			if (retVal != null) {
//			    Collections.sort(retVal, new BlockComparator());
//
//			    Page parentPage = null;
//			    // Store in Cache
//			    for (Page page : retVal) {
//				// List<Page> translatedPages =
//				// BlockRepository.findTranslatedPagesForMasterPage(page);
//				// page.setTranslatedPages(translatedPages);
//				page.setParentPage(parentPage);
//				PageCacheRepository.storePage(page);
//				parentPage = page;
//			    }
//			}
//
//		    }
//		}
//
//	    }
//	} catch (Exception e) {
//
//	}
//
//	return retVal;
//    }
//
//    public static List<Page> findTranslatedPagesByUrlName(String url, String language) throws PersistenceException
//    {
//	List<Page> retVal = null;
//	try {
//	    if (url != null && !url.trim().equals("")) {
//		url = PageManager.removeTrailingSlashes(url);
//		String[] urlPath = url.split("/");
//		List<Long> ids = BlockRepository.findMasterIdsForPage(urlPath, language);
//		if (ids != null) {
//		    retVal = PageCacheRepository.fetchPages(ids, language);
//		    if (retVal == null) {
//			retVal = Ebean.find(Page.class).fetch("masterPage").where().in("masterPage.id", ids).eq("language", language).findList();
//			if (retVal != null) {
//			    Collections.sort(retVal, new BlockComparator());
//
//			    Page parentPage = null;
//			    // Store in Cache
//			    for (Page page : retVal) {
//				page.setParentPage(parentPage);
//				PageCacheRepository.storeTranslatedPage(page, page.getMasterPage().getId());
//				parentPage = page;
//			    }
//			}
//
//		    }
//		}
//	    }
//	} catch (Exception e) {
//
//	}
//	return retVal;
//    }
//    public static List<Page> findMasterPagesForPage(Page page) throws PersistenceException
//    {
//	List<Page> retVal = null;
//	try {
//	    if (page.getMasterPage() == null) {
//		retVal = PageCacheRepository.fetchParentPages(page);
//		if (retVal == null) {
//		    retVal = Ebean.find(Page.class)
//				  .where()
//				  .raw("? like concat(concat(concat(parent_path, '/'), id),'/%')",
//				       page.getParentPath() + "/" + page.getId() + "/")
//				  .eq("language", Language.getMasterLanguage().language()).findList();
//		    for (Page p : retVal) {
//			PageCacheRepository.storePage(p);
//		    }
//		}
//	    } else {
//		retVal = PageCacheRepository.fetchParentPages(page.getMasterPage());
//		if (retVal == null) {
//		    retVal = Ebean.find(Page.class)
//				  .where()
//				  .raw("? like concat(concat(concat(parent_path, '/'), id),'/%')",
//				       page.getMasterPage().getParentPath() + "/" + page.getMasterPage().getId() + "/")
//				  .eq("language", Language.getMasterLanguage().language()).findList();
//		    for (Page p : retVal) {
//			PageCacheRepository.storePage(p);
//		    }
//		}
//	    }
//
//	    if (retVal != null) {
//		Collections.sort(retVal, new BlockComparator());
//	    }
//
//	} catch (Exception e) {
//	    Logger.debug("Exception while getting Masterpages for poage from DB");
//	}
//
//	return retVal;
//    }
//
//    public static List<Page> findParentPagesForPage(Page page) throws PersistenceException
//    {
//	List<Page> retVal = null;
//	try {
//	    retVal = PageCacheRepository.fetchParentPages(page);
//	    if (retVal == null) {
//		retVal = Ebean.find(Page.class)
//			      .where()
//			      .raw("? like concat(concat(concat(parent_path, '/'), id),'/%')",
//				   page.getParentPath() + "/" + page.getId() + "/").eq("language", page.getLanguage()).findList();
//		boolean isMasterPage = page.getMasterPage() == null ? true : false;
//		for (Page p : retVal) {
//		    if (isMasterPage) {
//			PageCacheRepository.storePage(p);
//		    } else {
//			PageCacheRepository.storeTranslatedPage(page, null);
//		    }
//		}
//
//	    }
//	    if (retVal != null) {
//		Collections.sort(retVal, new BlockComparator());
//	    }
//	} catch (Exception e) {
//
//	}
//
//	return retVal;
//    }
//
//    public static List<Page> findChildPagesForPage(Page page)
//    {
//	Page masterPage = page;
//	if (page.getMasterPage() != null) {
//	    masterPage = page.getMasterPage();
//	}
//	return Ebean.find(Page.class).where().ilike("parentPath", masterPage.getAbsolutePath() + "/%").findList();
//    }
//
//    // public static List<Page> findSlavePagesforMaster(Page master)
//    // {
//    // return Ebean.find(Page.class).where().eq("masterPage",
//    // master).findList();
//    // }
//
//    public static Page findMasterPageByUrlName(String url, String language) throws PersistenceException
//    {
//	Page page = null;
//	try {
//
//	    if (url != null && !url.trim().equals("")) {
//		url = PageManager.removeTrailingSlashes(url);
//		String[] urlPath = url.split("/");
//		int nrOfPages = urlPath.length;
//
//		String subQuery = "'/'";
//		if (nrOfPages > 1) {
//		    subQuery = "(select concat(concat('/', id),'/') from cms_block where parent_path = '' and url_name = :urlpath0)";
//		    int pageNr = 1;
//		    while (pageNr < nrOfPages - 1) {
//			subQuery = "(select concat(concat(concat(parent_path, '/'), id),'/') from cms_block where concat(parent_path, '/') = " +
//				   subQuery + "  and url_name = :urlpath" + pageNr + ")";
//
//			pageNr++;
//		    }
//		}
//		subQuery = "select id from cms_block where concat(parent_path, '/') = " +
//			   subQuery + "  and url_name = :urlpath" + (nrOfPages - 1);
//		SqlQuery sqlQuery = Ebean.createSqlQuery(subQuery);
//		for (int i = 0; i < nrOfPages; i++) {
//		    sqlQuery.setParameter("urlpath" + i, urlPath[i]);
//		}
//
//		SqlRow row = sqlQuery.findUnique();
//		if (row != null) {
//		    page = Ebean.find(com.beligum.cms.models.Page.class).where().eq("id", row.getLong("id")).eq("language", language)
//				.findUnique();
//		}
//
//	    }
//	} catch (Exception e) {
//	    Logger.error("Caught error while searching a page", e);
//	    throw new PersistenceException(e);
//	}
//	return page;
//    }
//
//    public static Page findPageByMasterPageId(Long masterId, String language) throws PersistenceException
//    {
//	try {
//	    // String sql =
//	    // "select * from section s1, section s2 where s1.url_name = :urlName or s2.parent_path LIKE CONCAT(CONCAT(CONCAT(s1.parent_path, '/'), s1.id), '/%')";
//	    // SqlQuery sqlQuery = Ebean.createSqlQuery(sql);
//	    // sqlQuery.setParameter("urlName", "urlName");
//	    Page page = PageCacheRepository.fetchPage(masterId, language);
//	    if (page == null) {
//		page = Ebean.find(com.beligum.cms.models.Page.class).where().eq("language", language).eq("masterPage.id", masterId)
//			    .findUnique();
//		if (page != null) {
//		    PageCacheRepository.storeTranslatedPage(page, masterId);
//		}
//
//	    }
//	    return page;
//	} catch (Exception e) {
//	    Logger.error("Caught error while searching a page", e);
//	    throw new PersistenceException(e);
//	}
//    }

    public static Page findPageById(Long id) throws PersistenceException
    {
	try {
	    // String sql =
	    // "select * from section s1, section s2 where s1.url_name = :urlName or s2.parent_path LIKE CONCAT(CONCAT(CONCAT(s1.parent_path, '/'), s1.id), '/%')";
	    // SqlQuery sqlQuery = Ebean.createSqlQuery(sql);
	    // sqlQuery.setParameter("urlName", "urlName");
	    Page page = PageCacheRepository.fetchPage(id);
	    if (page == null) {
		page = Ebean.find(com.beligum.cms.models.Page.class, id);
		if (page != null) {
		    PageCacheRepository.storePage(page);
		}
	    }
	    return page;
	} catch (Exception e) {
	    Logger.error("Caught error while searching a page", e);
	    throw new PersistenceException(e);
	}
    }

    public static Map<Long, PageBlock> findBlocksForPage(Page page)
    {
	Map<Long, PageBlock> retVal = PageCacheRepository.fetchBlocks(page.getId());
	try {
	    
	    if (retVal == null) {
		List<PageBlock> blocks = Ebean.find(PageBlock.class).where().like("concat(parent_path, '/')", page.getAbsolutePath() + "/").orderBy("id")
			.findList();
		retVal = new HashMap<Long, PageBlock>();
		for (PageBlock b: blocks) {
		    retVal.put(b.getId(), b);
		}
		PageCacheRepository.storeBlocks(page.getId(), retVal);
	    }
	} catch (Exception e) {
	    Logger.error("Caught error while searching subsections", e);
	    e.printStackTrace();
	    throw new PersistenceException(e);
	}
	return retVal;
    }

    public static com.beligum.cms.utils.pagers.PagePager findPage(int page, int pageSize, String search)
    {
	try {
	    search = "%" + search + "%";
	    return new com.beligum.cms.utils.pagers.PagePager(Ebean.find(Block.class).findPagingList(pageSize), page, null);

	} catch (Exception e) {
	    Logger.error("Caught error while searching for a page of pages", e);
	    throw new PersistenceException(e);
	}
    }

    public static Page savePage(Page page)
    {
	try {
	    Ebean.save(page);
	    PageCacheRepository.storePage(page);
	} catch (Exception e) {
	    Logger.debug("Exception while saving page");
	    throw new CmsException("Problem while saving page.");
	}
	return page;
    }

    // -----PROTECTED FUNCTIONS-----

    // -----PRIVATE FUNCTIONS-----
}
