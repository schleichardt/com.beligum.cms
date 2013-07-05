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
package com.beligum.cms.data;

import java.util.Locale;

import play.i18n.Lang;
import play.mvc.Http;

import com.beligum.cms.utils.PageManager;

public class Language
{
    // -----CONSTANTS-----
    public static String SESSION_KEY_LANGUAGE = "USER_LANG";

    // -----VARIABLES-----

    private static Lang masterLanguage;

    static {

	String masterLang = play.Play.application().configuration().getString("com.beligum.cms.default_language");
	if (masterLang != null) {
	    masterLanguage = Lang.forCode(masterLang);
	} else {
	    throw new RuntimeException("No default language found in application.conf");
	}
    }

    // -----PUBLIC FUNCTIONS-----
    public Language()
    {
    }
    
    public static Boolean isMasterLanguage(String language)
    {

	return Language.masterLanguage.language().equals(new Locale(language).getLanguage());
    }

    public static Boolean isSupportedLanguage(String language)
    {
	Lang lang = play.i18n.Lang.forCode(language);
	return Lang.availables().contains(lang);

    }

    public static Lang getLanguageForUrl(String url)
    {
	Lang retVal = null;
	if (url != null) {
	    url = PageManager.removeTrailingSlashes(url);
	    String[] urlPath = url.split("/");
	    if (urlPath.length > 0) {
		Lang lang = Lang.forCode(urlPath[0]);
		if (Lang.availables().contains(lang)) {
		    retVal = lang;
		}
	    }
	}

	return retVal;
    }
    
    public static Lang getPreferredLanguageForUrl(String url) {
	Lang retVal = Language.getLanguageForUrl(url);
	if (retVal == null) {
	    retVal = Language.getMasterLanguage();
	}
	return retVal;
    }

    // If the first part of our url is a language code -> remove this code
    // /nl/winkel/home wordt winkel/home/
    public static String getUrlWithoutLanguage(String url)
    {
	String retVal = url;
	url = PageManager.removeTrailingSlashes(url);
	String[] urlPath = url.split("/");
	if (urlPath.length > 0) {
	    if (Language.isSupportedLanguage(urlPath[0])) {
		int i = 1;
		retVal = "";
		while (i < urlPath.length) {
		    retVal += "/" + urlPath[i];
		    i++;
		}
	    }
	}
	return retVal;
    }

    // public static Set<String> getSlaveLanguages()
    // {
    // return slaveLanguages;
    // }
    //
    // public static void setSlaveLanguages(Set<String> slaveLanguages)
    // {
    // Language.slaveLanguages = slaveLanguages;
    // }

    public static Lang getMasterLanguage()
    {
	return masterLanguage;
    }

    public static void setMasterLanguage(Lang masterLanguage)
    {
	Language.masterLanguage = masterLanguage;
    }

    public static void setCurrentLanguageForUser(String language)
    {
	if (language != null) {
	    if (Http.Context.current().lang().language() != language) {
		if (!Http.Context.current().changeLang(language)) {
		    Http.Context.current().changeLang(Language.getMasterLanguage().language());
		    language = Language.getMasterLanguage().language();
		}
	    }
	}
    }
    
    public static String getCurrentLanguage() {
	return Http.Context.current().lang().language();
    }

    public static void setCurrentlanguageForUserByUrl(String url)
    {
	Lang lang = Language.getLanguageForUrl(url);
	if (lang == null) {
	    lang = Language.getMasterLanguage();
	}
	Language.setCurrentLanguageForUser(lang.language());
    }

    // -----PROTECTED FUNCTIONS-----

    // -----PRIVATE FUNCTIONS-----
}
