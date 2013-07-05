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
