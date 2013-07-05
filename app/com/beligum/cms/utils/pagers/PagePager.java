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
package com.beligum.cms.utils.pagers;

import java.util.Map;


import com.beligum.cms.models.Block;
import com.beligum.core.utils.pagers.AbstractPagerImplementation;




public class PagePager extends AbstractPagerImplementation<Block>
{
    //-----CONSTANTS-----

    //-----VARIABLES-----

    //-----CONSTRUCTORS-----
    public PagePager(com.avaje.ebean.PagingList<Block> pagingList, Integer page, Map<String, Object> query)
    {
	super(pagingList, page, query);
    }

    //-----PUBLIC FUNCTIONS-----

    //-----PROTECTED FUNCTIONS-----
    
    protected String getUrl(Integer page) {

   	// return controllers.routes.ReservationController.listReservations(search, after, before, page).url();
	return "";
    }

    //-----PRIVATE FUNCTIONS-----
    
   
}
