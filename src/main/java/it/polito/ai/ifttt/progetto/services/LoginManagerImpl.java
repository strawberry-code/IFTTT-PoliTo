package it.polito.ai.ifttt.progetto.services;

import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import it.polito.ai.ifttt.progetto.models.Recipes;
import it.polito.ai.ifttt.progetto.models.Roles;
import it.polito.ai.ifttt.progetto.models.Users;

public class LoginManagerImpl implements LoginManager {

	@Autowired
	SessionFactory sessionFactory;
	@Autowired
	javax.mail.Session sessionMail;
	@Autowired
	RecipesManager recipesManager;

	@SuppressWarnings({ "unchecked", "static-access" })
	public int register(String username, String password, String email, String timezone) {

		// open session
		Session session = sessionFactory.openSession();

		try {
			// begin transaction
			Transaction tx = session.beginTransaction();
			try {

				if (password.length() < 8) {
					return 4;
				}
				if (username.length() < 4) {
					return 5;
				}
				// compute hash (MD5) of the user password to store it in an
				// encrypted way
				String hashpass = this.computeMD5(password);

				// create and check the uniqueness of the string associated to
				// the user; string to send by email to activate the account
				Boolean unique = false;
				String url = UUID.randomUUID().toString();
				while (unique == false) {
					String hql2 = "from it.polito.ai.ifttt.progetto.models.Users u where u.urlactivate=:n";
					Query query2 = session.createQuery(hql2);
					query2.setString("n", url);
					List<Users> users = query2.list();
					if (users.size() == 0) {
						unique = true;
					} else {
						url = UUID.randomUUID().toString();
					}
				}

				// check if the provided username already exists
				String hql = "from it.polito.ai.ifttt.progetto.models.Users u where u.username=:n";
				Query query = session.createQuery(hql);
				query.setString("n", username);
				List<Users> users = query.list();
				if (users.size() != 0) {
					// user already exists --> 1
					return 1;
				}

				// check if the provided email has a valid format
//				if (email.indexOf('@') == -1) {
//					// email NOT valid --> 3
//					return 3;
//				}
				EmailValidator emailval = new EmailValidator(email);
				if(emailval.validate()==false) {
					return 3;
				}

				// check if the provided email already exists
				String hql1 = "from it.polito.ai.ifttt.progetto.models.Users u where u.email=:n";
				Query query1 = session.createQuery(hql1);
				query1.setString("n", email);
				List<Users> users1 = query1.list();
				if (users1.size() != 0) {
					// email already exists --> 2
					return 2;
				}

				// create a new user with valid information
				Users user = new Users();
				user.setUsername(username);
				user.setPassword(hashpass);
				user.setEmail(email);
				user.setUrlactivate(url);
				user.setTimezone(timezone);
				Roles r = new Roles();
				r.setName("ROLE_USER");
				user.getRoles().add(r);

				// save the new user in the db
				Integer id = (Integer) session.save(user);
				tx.commit();

				// send email with activation link
				try {

					Message message = new MimeMessage(sessionMail);
					message.setFrom(new InternetAddress("ifttt.ai2016@gmail.com"));
					message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
					message.setSubject("New Registration");
					message.setContent("<p>Dear <b>" + username + "</b>,</p><p>to complete the registration please click "
							+ "<a href=\"http://localhost:8080/progetto/api/activation.html?id=" + id + "&url=" + url
							+ "\">here</a>.</p><br><p>If you didn't try to register to our site "
							+ "(<a href=\"http://localhost:8080/progetto/\">IFTTT-polito</a>), please ignore this e-mail!</p>", "text/html");
					Transport.send(message);

				} catch (MessagingException e) {
					throw new RuntimeException(e);
				}
			} catch (Exception e) {
				// if some errors during the transaction occur,
				// rollback and return code -1
				tx.rollback();
				return -1;
			}
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		// user insertion: ok
		return 0;
	}

	public int activate(Integer id, String url) {

		Session session = sessionFactory.openSession();

		try {
			// begin transaction
			Transaction tx = session.beginTransaction();
			try {
				// retrieve the user with the correct id
				Users usr = session.get(Users.class, id);
				if (usr == null) {
					// user doesn't exist
					return -1;
				}
				if (usr.getEnabled()) {
					// user already activated
					return 1;
				}
				if (usr.getUrlactivate().compareTo(url) != 0) {
					// url wrong
					return -1;
				}

				// enable user and store it in the db
				usr.setEnabled(true);
				session.update(usr);
				tx.commit();
			} catch (Exception e) {
				// if some errors during the transaction occur, rollback
				tx.rollback();
				return -1;
			}
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}

		// everything is ok
		return 0;
	}

	@SuppressWarnings("unchecked")
	public Users findUserByUsername(String username) {
		Session session = sessionFactory.openSession();
		List<Users> users = null;
		try {
			String hql = "from it.polito.ai.ifttt.progetto.models.Users u where u.username=:n";
			Query query = session.createQuery(hql);
			query.setString("n", username);
			users = query.list();
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if (users.size() == 0) {
			return null;
		}
		return users.get(0);
	}

	@SuppressWarnings("unchecked")
	public List<Users> findAllUsers() {
		Session session = sessionFactory.openSession();
		List<Users> users = null;
		try {
			String hql = "from it.polito.ai.ifttt.progetto.models.Users";
			Query query = session.createQuery(hql);
			users = query.list();
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if (users.size() == 0) {
			return null;
		}
		return users;
	}

	public void setGoogleCredentials(Users user, String token, Long expire) {
		Session session = sessionFactory.openSession();
		try {
			user.setGoogleToken(token);
			user.setGoogleExpire(expire);
			session.update(user);
			session.flush();
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		return;
	}

	public void setTwitterCredentials(Users user, String token, String tokenSecret) {
		Session session = sessionFactory.openSession();
		try {
			user.setTwitterToken(token);
			user.setTwitterTokenSecret(tokenSecret);
			session.update(user);
			session.flush();
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		return;
	}

	@SuppressWarnings("unchecked")
	public Boolean checkGoogleConnection(String username) {
		Session session = sessionFactory.openSession();
		List<String> token = null;
		try {
			String hql = "select u.googleToken from it.polito.ai.ifttt.progetto.models.Users u where u.username=:n";
			Query query = session.createQuery(hql);
			query.setString("n", username);
			token = query.list();
			// users = query.list();
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if (token == null || token.isEmpty() || token.get(0) == null) {
			return false;
		}
		return true;
	}

	@SuppressWarnings("unchecked")
	public Boolean checkTwitterConnection(String username) {
		Session session = sessionFactory.openSession();
		List<String> token = null;
		try {
			String hql = "select u.twitterTokenSecret from it.polito.ai.ifttt.progetto.models.Users u where u.username=:n";
			Query query = session.createQuery(hql);
			query.setString("n", username);
			token = query.list();
			// users = query.list();
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if (token == null || token.isEmpty() || token.get(0) == null) {
			return false;
		}
		return true;
	}
	
	public void disconnectGoogle(String username) {
		Session session = sessionFactory.openSession();
		Users user = null;
		try {
			String hql = "from it.polito.ai.ifttt.progetto.models.Users u where u.username=:n";
			Query query = session.createQuery(hql);
			query.setString("n", username);
			user = (Users) query.list().get(0);
			user.setGoogleToken(null);
			user.setGoogleExpire(null);
			session.update(user);
			session.flush();
			// users = query.list();
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		return;
	}
	
	public void disconnectTwitter(String username) {
		Session session = sessionFactory.openSession();
		Users user = null;
		try {
			String hql = "from it.polito.ai.ifttt.progetto.models.Users u where u.username=:n";
			Query query = session.createQuery(hql);
			query.setString("n", username);
			user = (Users) query.list().get(0);
			user.setTwitterToken(null);
			user.setTwitterTokenSecret(null);
			session.update(user);
			session.flush();
			// users = query.list();
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		return;
	}
	
//	public Integer changePassword(/*String username, String newpass*/ Users user) {
//		Session session = sessionFactory.openSession();
//		Integer flag = 0;
////		Users user = null;
//		try {
////			String hql = "from it.polito.ai.ifttt.progetto.models.Users u where u.username=:n";
////			Query query = session.createQuery(hql);
////			query.setString("n", username);
////			try {
////				user = (Users) query.list().get(0);
////			} catch(Exception e) {
////				flag = -1;
////			}
////			if (newpass.length() < 8) {
////				flag = -2;
////			}
////			else {
////				user.setPassword(this.computeMD5(newpass));
//				session.update(user);
//				session.flush();
////			}
//		} finally {
//			if (session != null) {
//				// close session in any case
//				session.close();
//			}
//		}
//		return flag;
//	}
	
	public Integer changePasswordTimezone(Users user) {
		Session session = sessionFactory.openSession();
		Integer flag = 0;
		try {
			session.update(user);
			session.flush();
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		return flag;
	}

	public Integer deleteAccount(Users user) {

		//TODO: delete account:
		// 1) delete all his/her recipes
		// 2) delete tuple in user_roles
		// 3) delete tuple in users
		
		Session session = sessionFactory.openSession();
		try {
			// begin transaction
			Transaction tx = session.beginTransaction();
			try {
				List<Recipes> recipes = user.getRecipes();
				for(Recipes r : recipes) {
					Integer code = recipesManager.deleteRecipe(r.getRid());
					if(code==-1) {
						return -1;
					}
				}
				session.delete(user);
				session.flush();				
		
			} catch (Exception e) {
				// if some errors during the transaction occur,
				// rollback and return code -1
				System.out.println(e);
				tx.rollback();
				return -1;
			}
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		// -1 if errors
		return 0;
	}
	
	public Integer deleteAllRecipes(Users user) {
		
		Integer code = 0;
		Session session = sessionFactory.openSession();
		try {
			// begin transaction
			Transaction tx = session.beginTransaction();
			try {
				List<Recipes> recipes = user.getRecipes();
				if(recipes == null || recipes.size()==0) {
					code = -2;
				} 
				else {
					for(Recipes r : recipes) {
						code = recipesManager.deleteRecipe(r.getRid());
					}	
				}
		
			} catch (Exception e) {
				// if some errors during the transaction occur,
				// rollback and return code -1
				System.out.println(e);
				tx.rollback();
				return -1;
			}
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		// -1 if errors
		return code;
	}
	
	// function to compute an MD5 hash of the user password
	public static String computeMD5(String input) {
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");
			byte[] messageDigest = md.digest(input.getBytes());
			BigInteger number = new BigInteger(1, messageDigest);
			String hashtext = number.toString(16);
			// Now we need to zero pad it if you actually want the full 32
			// chars.
			while (hashtext.length() < 32) {
				hashtext = "0" + hashtext;
			}
			return hashtext;
		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException(e);
		}
	}
}
