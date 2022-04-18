package tr.com.obss.jss.controller;


//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
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
import tr.com.obss.jss.model.UserDTO;
import tr.com.obss.jss.model.UserUpdateDTO;
import tr.com.obss.jss.service.UserService;

import javax.validation.Valid;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    //private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

    @GetMapping("")
    @ResponseBody
    public ResponseEntity<?> get(@RequestParam(name="pageSize", defaultValue = "100") int pageSize,
                                 @RequestParam(name="pageNumber", defaultValue = "0") int pageNumber) {
        return ResponseEntity.ok(userService.findAll(pageSize, pageNumber));
    }

    @GetMapping("/{id}")
    @ResponseBody
    public ResponseEntity<?> get(@PathVariable long id) {
        Optional<User> userOptional = userService.findById(id);
        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());
        }
        throw new IllegalArgumentException("Kullanıcı bulunamadı");
    }

    @GetMapping("/search")
    @ResponseBody
    public ResponseEntity<?> get(@RequestParam(name = "username", defaultValue = "") String username) {
        Optional<User> userList = userService.findByUsername(username);
        return ResponseEntity.ok(userList);
    }
    
    @GetMapping("/has-role-user")
    @ResponseBody
    public ResponseEntity<?> findByRoles() {
        List<User> userList = userService.findByRoles(Arrays.asList("ROLE_USER"));
        return ResponseEntity.ok(userList);
    }
    
    @PutMapping("/{id}")
    @ResponseBody
    public ResponseEntity<?> update(@PathVariable long id, @Valid @RequestBody UserUpdateDTO userDTO) {
        User user = userService.update(id, userDTO);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    @ResponseBody
    public ResponseEntity<?> delete(@PathVariable long id) {
        User user = userService.delete(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping("")
    @ResponseBody
    public ResponseEntity<?> post(@Valid @RequestBody UserDTO userDTO) {
        User user = userService.save(userDTO);

        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/favorites/{id}")
    @ResponseBody
    public ResponseEntity<?> getFavorites(@PathVariable long id) {
        Optional<User> user = userService.findById(id);
        if (!user.isPresent()) {
            throw new IllegalArgumentException("Kullanıcı bulunamadı");
        }

        Set<Book> favBooks = user.get().getFavoriteBooks(); 
        return ResponseEntity.ok(favBooks);
    }
    
    @GetMapping("/reads/{id}")
    @ResponseBody
    public ResponseEntity<?> getReads(@PathVariable long id) {
        Optional<User> user = userService.findById(id);
        if (!user.isPresent()) {
            throw new IllegalArgumentException("Kullanıcı bulunamadı");
        }

        Set<Book> readBooks = user.get().getReadBooks(); 
        return ResponseEntity.ok(readBooks);
    }
    
    @PostMapping("/favorites/mark/{userId}/{bookId}")
    @ResponseBody
    public ResponseEntity<?> insertFavBook(@PathVariable long userId, @PathVariable long bookId)
    {
    	try {
    		Book book = userService.addOrRemoveFavBook(userId, bookId);
        	return ResponseEntity.ok(book);
    	} catch(IllegalArgumentException ex) {
    		return (ResponseEntity<?>) ResponseEntity.badRequest();
    	}
    }
    
    @PostMapping("/reads/mark/{userId}/{bookId}")
    @ResponseBody
    public ResponseEntity<?> insertReadBook(@PathVariable long userId, @PathVariable long bookId)
    {
    	try {
    		Book book = userService.addOrRemoveReadBook(userId, bookId);
        	return ResponseEntity.ok(book);
    	} catch(IllegalArgumentException ex) {
    		return (ResponseEntity<?>) ResponseEntity.badRequest();
    	}
    }
    
    
//    @GetMapping("/admin/test")
//    @ResponseBody
//    public ResponseEntity<?> test()
//    {
//    	return ResponseEntity.ok(new int [] { 1, 2, 3 });
//    }
}
