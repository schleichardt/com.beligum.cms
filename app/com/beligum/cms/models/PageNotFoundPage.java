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
package com.beligum.cms.models;

import com.beligum.cms.utils.templating.ErrorContent;

public class PageNotFoundPage extends Page
{
    //-----CONSTANTS-----

    //-----VARIABLES-----

    //-----CONSTRUCTORS-----
    public PageNotFoundPage(Page masterPage, String title)
    {
	super("page-not-found");
	this.setTitle(title);
	//this.setMasterPage(masterPage.getId());
	Template template = new Template("Page not found", (String) play.Play.application().configuration().getString("com.beligum.cms.template.page_not_found"));
	this.setTemplate(template);
	PageBlock errorBlock = new PageBlock(this);
	ErrorContent errorContent = new ErrorContent(title);
	errorBlock.setHtml(errorContent.write());
	this.getSubblocks().add(errorBlock);
	
    }

    //-----PUBLIC FUNCTIONS-----

    //-----PROTECTED FUNCTIONS-----

    //-----PRIVATE FUNCTIONS-----
}
