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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Transient;

import com.beligum.cms.repositories.BlockRepository;

@Entity
@DiscriminatorValue("cms_page")
public class Page extends com.beligum.cms.models.Block
{
    // -----CONSTANTS-----

    private static Set<Class<?>> templates;

    // -----VARIABLES-----
    @Transient
    List<PageBlock> contentBlocks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "master_page")
    private Long masterPage;

    // @OneToMany(mappedBy = "masterPage", cascade = CascadeType.ALL)
    // private List<Page> slavePages;

    protected String language;
    protected String title;

    // -----CONSTRUCTORS-----
    public Page(String urlName)
    {
	super(urlName);

    }

    public Page(Page parentPage, String urlName)
    {
	super(parentPage, urlName);
    }

    // -----PUBLIC FUNCTIONS-----

    public List<PageBlock> getSubblocks()
    {
	if (contentBlocks == null) {
	    Map<Long, PageBlock> tempBlocks = BlockRepository.findBlocksForPage(this);

	    contentBlocks = tempBlocks == null ? new ArrayList<PageBlock>()
					      : new ArrayList<PageBlock>(tempBlocks.values());

	}
	return contentBlocks;
    }

    public void setSubblocks(List<PageBlock> subblocks)
    {
	this.contentBlocks = subblocks;
    }

    public String getTitle()
    {
	return title;
    }

    public void setTitle(String title)
    {
	this.title = title;
    }

    public String getLanguage()
    {
	return language;
    }

    public void setLanguage(String language)
    {
	this.language = language;
    }

    public static void setTemplates(Set<Class<?>> templates)
    {
	Page.templates = templates;
    }

    // -----PROTECTED FUNCTIONS-----

    // -----PRIVATE FUNCTIONS-----

    public Long getMasterPage()
    {

	return masterPage;
    }

    public void setMasterPage(Long masterPageId)
    {
	this.masterPage = masterPageId;
    }

}
