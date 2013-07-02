package com.beligum.cms.utils.templating;

import com.hp.gagawa.java.elements.Div;

public class Content
{
    //-----CONSTANTS-----

    //-----VARIABLES-----

    protected Div content;
    //-----CONSTRUCTORS-----
    
    
    public Content()
    {
	this.resetContent();
	
	
	StringBuilder t = new StringBuilder();
	t.append("<h1>Your content here</h1>");
	t.append("<p>Click on this block to edit its content.</p>");
	t.append("<p>If hou hover over this block you see buttons to remove this block or add a new block under this blok.</p>");
	t.append("<p>If you hold shift you can drag blocks around or change the width of a blok.</p>");
	content.appendText(t.toString());
    }
    
    
    public Content(String message)
    {
	this.resetContent();
	this.addContent(message);
    }
    
    protected void addContent(String text)
    {
	content.appendText(text);
    }
    
    protected void newContent(String text)
    {
	this.resetContent();
	addContent(text);
    }
    
    
    public String write() 
    {

	return content.write();
    }

    //-----PUBLIC FUNCTIONS-----

    //-----PROTECTED FUNCTIONS-----

    //-----PRIVATE FUNCTIONS-----
    protected void resetContent() {
	content = new Div();
	content.setCSSClass("layout-content layout-basic-block layout-content-editor");
    }
}
