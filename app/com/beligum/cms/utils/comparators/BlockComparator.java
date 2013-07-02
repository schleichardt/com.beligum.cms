package com.beligum.cms.utils.comparators;

import java.util.Comparator;

import com.beligum.cms.models.Block;







public class BlockComparator implements Comparator<Block>
{


    //-----PUBLIC FUNCTIONS-----
    @Override
    public int compare(Block s1, Block s2)
    {
	return s1.getAbsolutePath().compareTo(s2.getAbsolutePath());
    }

}
