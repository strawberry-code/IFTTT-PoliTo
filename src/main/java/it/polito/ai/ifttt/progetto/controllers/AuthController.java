package it.polito.ai.ifttt.progetto.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

import it.polito.ai.ifttt.progetto.services.LoginManager;

@Controller
// @RequestMapping("/")
public class AuthController {

	@Autowired
	LoginManager loginManager;

	@RequestMapping(value = "/index", method = RequestMethod.GET)
	public String main() {

		System.out.println(SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString());

		return "index";
	}

//	@RequestMapping(value = "authpage", method = RequestMethod.POST)
//	public String loginDone(@RequestParam("username") String username,
//
//			@RequestParam("password") String password, RedirectAttributes attributes) {
//
//		int code = loginManager.login(username, password);
//		if (code == 0) {
//			attributes.addFlashAttribute("msg", "User Logged In");
//		} else if (code == 1) {
//			attributes.addFlashAttribute("msg", "Wrong combination uername/password");
//		} else if (code == 2) {
//			attributes.addFlashAttribute("msg", "User not activated");
//		} else if (code == -1) {
//			attributes.addFlashAttribute("msg", "Some Errors (database)");
//		}
//
//		return "redirect:/api/authpage.html";
//	}

	// @RequestMapping(value = "registration", method = RequestMethod.GET)
	// public String register() {
	// return "registration";
	// }
	//
	// @RequestMapping(value = "registration", method = RequestMethod.POST)
	// public String registerDone(@RequestParam("username") String user,
	// @RequestParam("password") String pws1,
	// @RequestParam("email") String email, RedirectAttributes attributes) {
	//
	// Integer i = loginManager.register(user, pws1, email);
	// if (i == 0) {
	// attributes.addFlashAttribute("msg", "Andato a buon fine, email sent");
	// } else if (i == 1) {
	// attributes.addFlashAttribute("msg", "User exist");
	// } else if (i == 2) {
	// attributes.addFlashAttribute("msg", "Email exist");
	// } else if (i == 3) {
	// attributes.addFlashAttribute("msg", "Email not valid");
	// } else if (i == 4) {
	// attributes.addFlashAttribute("msg", "Password too short");
	// } else if (i == 5) {
	// attributes.addFlashAttribute("msg", "Username too short");
	// } else if (i == -1) {
	// attributes.addFlashAttribute("msg", "Some errors");
	// }
	//
	// return "redirect:/api/index.html";
	// }

	@RequestMapping(value = "/activation", method = RequestMethod.GET)
	public RedirectView activationDone(@RequestParam(required = false, value = "id") Integer id,
			@RequestParam(required = false, value = "url") String url, RedirectAttributes attributes) {
		/*
		 * if(id==null && url == null) { return "activation"; } else {
		 */
		int code = loginManager.activate(id, url);
//		if (code == 0) {
//			attributes.addFlashAttribute("msg", "Activation Done");
//		} else if (code == -1) {
//			attributes.addFlashAttribute("msg", "Some Errors occured");
//		} else if (code == 1) {
//			attributes.addFlashAttribute("msg", "User already Registered");
//		}
//		return "redirect:/";
		return new RedirectView("http://localhost:8080/progetto/#/hiddenPageRegistration");
		// }

		// TODO: gestire il parametro di ritorno al client!!!
	}
}
