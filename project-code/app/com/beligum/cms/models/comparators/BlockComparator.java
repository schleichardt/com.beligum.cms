package com.beligum.cms.models.comparators;

import java.util.Comparator;

import models.Block;






public class BlockComparator implements Comparator<Block>
{


    //-----PUBLIC FUNCTIONS-----
    @Override
    public int compare(Block s1, Block s2)
    {
	return s1.getAbsolutePath().compareTo(s2.getAbsolutePath());
    }

}
