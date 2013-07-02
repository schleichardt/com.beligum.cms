package com.beligum.cms.models;

import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.beligum.core.models.BasicModel;


@Entity
@Table(name = "cms_block")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type", discriminatorType = DiscriminatorType.STRING)
@DiscriminatorValue("block")
public abstract class Block extends BasicModel
{
    //-----CONSTANTS-----

    //-----VARIABLES-----
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;
    @Column(name = "url_name")
    protected String urlName;
    @Column(name = "parent_path")
    protected String parentPath;

    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(name="template_id")
    protected Template template;
    @Column(columnDefinition="TEXT")
    protected String html;
    protected Boolean visible;
    

   
    //-----CONSTRUCTORS-----
    public Block() 
    {
	setParentPath("");
    }
    
    public Block(String urlName)
    {
	this();
	this.urlName = urlName;
    }
    
    public Block(Block parentBlock) 
    {
	this();
	this.setParentPath(parentBlock.getAbsolutePath());
    }
    
    public Block(Block parentBlock, String urlName) 
    {
	this(urlName);
	if (parentBlock != null) {
	    this.setParentPath(parentBlock.getAbsolutePath());
	}
	this.urlName = urlName;
    }


    //-----PUBLIC FUNCTIONS-----
    
    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }


    public void setParentPath(String parentPath)
    {
        this.parentPath = parentPath;
    }
    
    public String getParentPath()
    {
        return parentPath;
    }
    
    public String getAbsolutePath()
    {
	return parentPath + "/" + id;
    }

    public String getUrlName()
    {
        return urlName;
    }

    public void setUrlName(String urlName)
    {
        this.urlName = urlName;
    }

    public Boolean getVisible()
    {
        return visible;
    }

    public void setVisible(Boolean visible)
    {
        this.visible = visible;
    }

    public String getHtml()
    {
        return html;
    }

    public void setHtml(String html)
    {
        this.html = html;
    }


    public Template getTemplate()
    {
        return template;
    }


    public void setTemplate(Template template)
    {
        this.template = template;
    }
    
    


    //-----PROTECTED FUNCTIONS-----

    //-----PRIVATE FUNCTIONS-----

}
