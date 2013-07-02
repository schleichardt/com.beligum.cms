package com.beligum.cms.controllers.admin;

import play.Logger;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;


import com.beligum.core.data.Login;
import com.beligum.core.models.User;
import com.beligum.core.repositories.UserRepository;
import com.beligum.core.utils.security.UserManager;

public class AccountController extends Controller
{
    //-----CONSTANTS-----

    //-----VARIABLES-----

    //-----CONSTRUCTORS-----
    
    //-----PUBLIC FUNCTIONS-----
    

    public static Result login()
    {
	Form<Login> loginForm = Form.form(Login.class);
	
	return ok(com.beligum.cms.views.html.login.render(loginForm));
    }

    public static Result logout()
    {
	Result retVal = null;
	Form<Login> loginForm = Form.form(Login.class);
	UserManager.logout();
	String referer = Http.Context.current().request().getHeader("referer");
	if (referer != null) {
	    retVal = redirect(referer);
	} else {
	    //TODO!
	    retVal = redirect(referer);
	}
	return retVal;
    }

    public static Result authenticate()
    {
	Result retVal = null;
	try {
	    String email = Form.form().bindFromRequest().get("email");
	    String password = Form.form().bindFromRequest().get("password");

	    User user = UserRepository.findByEmail(email);
	    Form<Login> loginForm = Form.form(Login.class).bindFromRequest();
	    
	    //TODO: login always works for now!
	    retVal = ok();
	    Logger.info("PERFORMED FAKE LOG-IN, THIS DOES NOTHING???");
	    
	    /*
	    if (!loginForm.hasErrors()) {
		//TODO: where to?
		retVal = ok();
	    } else {
		retVal = badRequest(com.beligum.cms.views.html.login.render(loginForm));
	    }
	    */

	} catch (Exception e) {

	}
	return retVal;
    }

    //-----PROTECTED FUNCTIONS-----

    //-----PRIVATE FUNCTIONS-----
}
