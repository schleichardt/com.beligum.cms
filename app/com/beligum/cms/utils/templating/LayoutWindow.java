package com.beligum.cms.utils.templating;




import com.beligum.cms.models.Block;
import com.hp.gagawa.java.elements.Div;

public class LayoutWindow
{
    //-----CONSTANTS-----

    //-----VARIABLES-----
    private Div window;
    private Div row;

    //-----CONSTRUCTORS-----
    public LayoutWindow(Block block)
    {
	row = new Div();
	window = new Div();
	if (block.getUrlName() != null) {
	    window.setId(block.getUrlName());
	}
	window.setCSSClass("span12 layout-window layout-column layout-basic-block");
	if (block.getId() != null) {
	    window.setAttribute("data-id", block.getId().toString());
	} else {
	    window.setAttribute("data-id", "-1");
	}
	    
	row.setCSSClass("row-fluid");
	
    }

    //-----PUBLIC FUNCTIONS-----
    
    public void append(String content)
    {
	window.appendText(content);
    }

    public String write() 
    {
	row.appendChild(window);
	return row.write();
    }
    //-----PROTECTED FUNCTIONS-----

    //-----PRIVATE FUNCTIONS-----
}
