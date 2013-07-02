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
