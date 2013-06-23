package com.beligum.cms.pagers;

import java.util.Map;

import models.Block;

import com.beligum.core.pagers.AbstractPagerImplementation;




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
