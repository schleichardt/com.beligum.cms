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

import javax.persistence.Entity;
import javax.persistence.Id;

import com.beligum.core.models.BasicModel;


@Entity
public class Template extends BasicModel
{
    //-----CONSTANTS-----

    //-----VARIABLES-----
    @Id
    private long id;
    private String name;
    private String template;

    //-----CONSTRUCTORS-----
    public Template()
    {
    }
    
    public Template(String name, String template) {
	this.name = name;
	this.template = template;
    }

    public long getId()
    {
        return id;
    }

    public void setId(long id)
    {
        this.id = id;
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public String getTemplate()
    {
        return template;
    }

    public void setTemplate(String template)
    {
        this.template = template;
    }

    //-----PUBLIC FUNCTIONS-----
    
    

    //-----PROTECTED FUNCTIONS-----

    //-----PRIVATE FUNCTIONS-----
}
