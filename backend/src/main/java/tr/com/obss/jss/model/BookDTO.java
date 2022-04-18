package tr.com.obss.jss.model;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class BookDTO {
	
	@NotBlank
    @Size(max = 255, min = 1, message = "Lütfen gecerli bir kitap adi giriniz")
    private String name;

    @NotBlank
    @Size(max = 255, min = 3, message = "Lütfen geçerli bir yazar giriniz")
    private String author;
    
    @NotBlank
    @Size(max = 255, min = 3, message = "Lütfen geçerli bir url  giriniz")
    private String image;
    
    @NotBlank
    @Size(max=255, min = 3, message = "Lütfen geçerli bir ebook giriniz")
    private String ebookFile;
    
    
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setImage(String image) {
		this.image = image;
	}
	
	public String getImage() {
		return image;
	}
	
	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}
    
	public String getEbookFile() {
		return ebookFile;
	}
	
	public void setEbookFile(String ebook) {
		this.ebookFile = ebook;
	}

}
