package tr.com.obss.jss.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import tr.com.obss.jss.entity.Book;
import tr.com.obss.jss.entity.User;
import tr.com.obss.jss.model.BookDTO;
import tr.com.obss.jss.repo.BookRepository;
import tr.com.obss.jss.repo.UserRepository;

import java.util.List;
import java.util.Optional;


@Service
public class BookService {

	@Autowired
	BookRepository bookRepository;

	public Page<Book> findAll(int pageSize, int pageNumber) {
		Pageable paged = PageRequest.of(pageNumber, pageSize);
		return bookRepository.findAll(paged);
	}
	
	public Page<Book> findAllActive(int pageSize, int pageNumber) {
		Pageable paged = PageRequest.of(pageNumber, pageSize);
		return bookRepository.findByActiveTrue(paged);
	}
	
	public Page<Book> searchBook(String infix, int pageSize, int pageNumber) {
		Pageable paged = PageRequest.of(pageNumber, pageSize);
		return bookRepository.findByNameContainingAndActiveTrue(infix, paged);
	}
 
	public Optional<Book> getById(long id) {
		return bookRepository.findById(id);
	}
	
	public Optional<Book> getByName(String name) {
		return bookRepository.findByName(name);
	}
	
	public Optional<Book> getByAuthor(String author) {
		return bookRepository.findByAuthor(author);
	}
	
	public Book save(BookDTO bookDTO) {
		Book book = new Book();
		book.setName(bookDTO.getName());
		book.setAuthor(bookDTO.getAuthor());
		book.setImageUrl(bookDTO.getImage());
		book.setEbookFile(bookDTO.getEbookFile());
		return bookRepository.save(book);
	}
	
	public Book update(long id, BookDTO bookDTO) {
		Optional<Book> byId = bookRepository.findById(id);
        if (byId.isPresent()) {
            Book book = byId.get();
            book.setName(bookDTO.getName());
    		book.setAuthor(bookDTO.getAuthor());
    		book.setImageUrl(bookDTO.getImage());
    		book.setEbookFile(bookDTO.getEbookFile());
            return bookRepository.save(book);
        }
        throw new IllegalArgumentException("Kitap bulunamadı");

	}
	
	public List<Book> saveAll (List<Book> employees) {
		return bookRepository.saveAll(employees);
	}
	
    public Book delete(long id) {
        Optional<Book> byId = bookRepository.findById(id);
        if (byId.isPresent()) {
            Book book = byId.get();
            book.setActive(!book.isActive());
            return bookRepository.save(book);
        }
        throw new IllegalArgumentException("Kitap bulunamadı");
    }
}
