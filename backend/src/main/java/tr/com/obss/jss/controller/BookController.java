package tr.com.obss.jss.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import tr.com.obss.jss.entity.Book;
import tr.com.obss.jss.entity.User;
import tr.com.obss.jss.model.BookDTO;
import tr.com.obss.jss.service.BookService;

import javax.validation.Valid;
import java.util.Optional;
import java.util.Set;


@RestController
@RequestMapping("/api/books")
public class BookController {

	private BookService bookService;
	
	@Autowired
	public BookController(BookService bookService)
	{
		this.bookService = bookService;
	}
	
	@GetMapping("")
    @ResponseBody
    public ResponseEntity<?> get(@RequestParam(name="pageSize", defaultValue = "12") int pageSize,
                                 @RequestParam(name="pageNumber", defaultValue = "0") int pageNumber) {
        return ResponseEntity.ok(bookService.findAllActive(pageSize, pageNumber));
    }
	
	@GetMapping("/{id}")
    @ResponseBody
    public ResponseEntity<?> get(@PathVariable long id) {
        Optional<Book> bookOptional = bookService.getById(id);
        if (bookOptional.isPresent()) {
            return ResponseEntity.ok(bookOptional.get());
        }
        throw new IllegalArgumentException("Kitap bulunamadı");
    }
	
    @GetMapping("/search")
    @ResponseBody
    public ResponseEntity<?> search(@RequestParam(name = "name", defaultValue = "") String name, 
					    		 @RequestParam(name="pageSize", defaultValue = "12") int pageSize,
					             @RequestParam(name="pageNumber", defaultValue = "0") int pageNumber) {
        return ResponseEntity.ok(bookService.searchBook(name, pageSize, pageNumber));
    }
	
    @GetMapping("/favorites/{id}")
    @ResponseBody
    public ResponseEntity<?> getUsersWhoFavorited(@PathVariable long id) {
        Optional<Book> bookOptional = bookService.getById(id);
        if (bookOptional.isPresent()) {
        	Set <User> userSet = bookOptional.get().getUsersAddedToFavorites();
            return ResponseEntity.ok(userSet);
        }
        throw new IllegalArgumentException("Kitap bulunamadı");
    }
    
    @GetMapping("/reads/{id}")
    @ResponseBody
    public ResponseEntity<?> getUsersWhoRead(@PathVariable long id) {
        Optional<Book> bookOptional = bookService.getById(id);
        if (bookOptional.isPresent()) {
        	Set <User> userSet = bookOptional.get().getUsersRead();
            return ResponseEntity.ok(userSet);
        }
        throw new IllegalArgumentException("Kitap bulunamadı");
    }
    
    
    //BURDAN SADECE ADMINLERE YONELIK OLACAK
    @DeleteMapping("/{id}")
    @ResponseBody
    public ResponseEntity<?> delete(@PathVariable long id) {
        Book book = bookService.delete(id);
        return ResponseEntity.ok(book);
    }
	
    @PostMapping("")
    @ResponseBody
    public ResponseEntity<?> post(@Valid @RequestBody BookDTO bookDTO) {
        Book book = bookService.save(bookDTO);
        return ResponseEntity.ok(book);
    }
    
    @PutMapping("/{id}")
    @ResponseBody
    public ResponseEntity<?> update(@PathVariable long id, @Valid @RequestBody BookDTO bookDTO) {
    	Book book = bookService.update(id, bookDTO);
    	return ResponseEntity.ok(book);
    }
	
}
