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
