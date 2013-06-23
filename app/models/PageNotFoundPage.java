package models;

import com.beligum.cms.templating.ErrorContent;

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
	Template template = new Template("Page not found", (String) play.Play.application().configuration().getString("beligum.cms.template.page_not_found"));
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
