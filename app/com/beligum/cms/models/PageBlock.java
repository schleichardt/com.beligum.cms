package com.beligum.cms.models;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

import com.beligum.cms.utils.templating.Content;

@Entity
@DiscriminatorValue("cms_page_block")
public class PageBlock extends Block
{
    //-----CONSTANTS-----

    //-----VARIABLES-----

    //-----CONSTRUCTORS-----
    
    public PageBlock(Page page)
    {
	super(page);
	Content content = new Content();
	this.setHtml(content.write());
	//page.getSubblocks().add(this);
    }

    //-----PUBLIC FUNCTIONS-----

    //-----PROTECTED FUNCTIONS-----

    //-----PRIVATE FUNCTIONS-----
}
