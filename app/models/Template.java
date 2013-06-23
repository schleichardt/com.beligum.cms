package models;

import javax.persistence.Entity;
import javax.persistence.Id;


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
