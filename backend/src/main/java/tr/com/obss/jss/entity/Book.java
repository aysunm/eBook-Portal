package tr.com.obss.jss.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import java.util.Set;

@Entity
@Table(name = "BOOK")
public class Book extends EntityBase {
	
	private static final long serialVersionUID = 1L;
	
	@Column(name = "NAME", length = 255)
	private String name;
	
	@Column(name = "AUTHOR", length = 255)
	private String author;
	
	@Column(name = "IMAGE_URL", length = 255)
	private String imageUrl;
	
	@Column(name = "EBOOK_FILE", columnDefinition="varchar(255) default 'lorem-ipsum.epub'")
	private String ebookFile;
	
	@ManyToMany(mappedBy = "favoriteBooks")
	@JsonBackReference
	private Set <User> usersAddedToFavorites;
	
	@ManyToMany(mappedBy = "readBooks")
	@JsonBackReference
	private Set <User> usersRead;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public Set<User> getUsersAddedToFavorites() {
		return usersAddedToFavorites;
	}

	public void setUsersAddedToFavorites(Set<User> usersAddedToFavorites) {
		this.usersAddedToFavorites = usersAddedToFavorites;
	}

	public Set<User> getUsersRead() {
		return usersRead;
	}

	public void setUsersRead(Set<User> usersRead) {
		this.usersRead = usersRead;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}
	
	public String getEbookFile() {
		return ebookFile;
	}
	
	public void setEbookFile(String ebook) {
		this.ebookFile = ebook;
	}
}
