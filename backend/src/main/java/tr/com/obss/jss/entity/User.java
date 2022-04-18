package tr.com.obss.jss.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;


import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.PreRemove;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.NotAuthorizedException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Set;

@Entity
@Table(name = "USER")
public class User extends EntityBase {

	private static final long serialVersionUID = 1L;

	@Column(name = "USERNAME", length = 255, unique = true)
    private String username;

    @Column(name = "PASSWORD")
    private String password;

    @ManyToMany(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinTable(name = "USERS_ROLES",
            joinColumns = {@JoinColumn(name = "USER_ID", referencedColumnName = "ID")},
            inverseJoinColumns = {@JoinColumn(name = "ROLE_ID", referencedColumnName = "ID")})
    @JsonManagedReference
    private Set<Role> roles;
    
	@ManyToMany(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
	@JoinTable(name = "USERS_FAVORITES", 
		joinColumns = {@JoinColumn(name = "USER_ID", referencedColumnName = "ID")},
		inverseJoinColumns = {@JoinColumn(name = "BOOK_ID", referencedColumnName = "ID")})
	@JsonManagedReference
	private Set<Book> favoriteBooks;
    
	@ManyToMany(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
	@JoinTable(name = "USERS_READ", 
		joinColumns = {@JoinColumn(name = "USER_ID", referencedColumnName = "ID")},
		inverseJoinColumns = {@JoinColumn(name = "BOOK_ID", referencedColumnName = "ID")})
	@JsonManagedReference
	private Set<Book> readBooks;
    

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }
    
    public Set<Book> getFavoriteBooks() {
		return favoriteBooks;
	}

	public void setFavoriteBooks(Set<Book> favoriteBooks) {
		this.favoriteBooks = favoriteBooks;
	}

	public Set<Book> getReadBooks() {
		return readBooks;
	}

	public void setReadBooks(Set<Book> readBooks) {
		this.readBooks = readBooks;
	}
	
	public boolean isAdmin() {
		for(Role r : this.getRoles()) {
			if (r.getName().equals("ROLE_ADMIN")) {
				return true;
			}
		}
		return false;
	}

	@PreUpdate
    public void preUpdateFunction() throws NotAuthorizedException {
    	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    	boolean admin = false;
    	for(GrantedAuthority gauth : auth.getAuthorities()) {
    		if (gauth.getAuthority().equals("ROLE_ADMIN")) {
    			admin = true;
    			break;
    		}
    	}
    	
    	if(!admin && !this.getUsername().equals(auth.getName()))
    	{
    		throw new NotAuthorizedException("not authorized");
    	}
    }
    
    
    @PreRemove
    public void preRemoveFunction() throws NotAuthorizedException {
    	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    	if (this.getUsername().contentEquals(auth.getName()))
    	{
    		throw new BadRequestException("cannot perform self delete");
    	}
    	
    	for(GrantedAuthority gauth : auth.getAuthorities()) {
    		if (gauth.getAuthority().equals("ROLE_ADMIN")) {
    			return;
    		}
    	}
		throw new NotAuthorizedException("not authorized");
    }
}
