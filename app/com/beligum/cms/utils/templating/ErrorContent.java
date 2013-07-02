package com.beligum.cms.utils.templating;

public class ErrorContent extends Content
{
    //-----CONSTANTS-----

    //-----VARIABLES-----

    //-----CONSTRUCTORS-----
    public ErrorContent(String title)
    {
	super();
	this.resetContent();
	this.newContent("<div class='alert alert-warning'>" + title + "</div>");
    }

    //-----PUBLIC FUNCTIONS-----

    //-----PROTECTED FUNCTIONS-----

    //-----PRIVATE FUNCTIONS-----
}
