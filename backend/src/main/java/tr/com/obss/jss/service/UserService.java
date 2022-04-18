package tr.com.obss.jss.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import tr.com.obss.jss.entity.Book;
import tr.com.obss.jss.entity.Role;
import tr.com.obss.jss.entity.User;
import tr.com.obss.jss.model.MyUserDetails;
import tr.com.obss.jss.model.UserDTO;
import tr.com.obss.jss.model.UserUpdateDTO;
import tr.com.obss.jss.repo.BookRepository;
import tr.com.obss.jss.repo.RoleRepository;
import tr.com.obss.jss.repo.UserRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private PasswordEncoder encoder;
   

    @Bean
    public PasswordEncoder encoder(){
        return new BCryptPasswordEncoder();
    }

    public User save(UserDTO userDto) {
        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(encoder.encode(userDto.getPassword()));
        user.setRoles(Stream.of(roleRepository.findByName("ROLE_USER")).collect(Collectors.toSet()));
        User savedUser = userRepository.save(user);    
        return savedUser;
    }

    public Page<User> findAll(int pageSize, int pageNumber) {
        Pageable paged = PageRequest.of(pageNumber, pageSize);
        return userRepository.findAll(paged);
    }

    public List<User> findByRoles(List<String> roles) {
        return userRepository.findByRoles_NameIn(roles);
    }

    public Optional<User> findById(long id) {
        return userRepository.getByIdNative(id);
    }

    public Optional<User> findByUsername(String name) {
        return userRepository.findByUsername(name);
    }

    public User update(long id, UserUpdateDTO dto) {
        Optional<User> byId = userRepository.findById(id);
        if (byId.isPresent()) {
            User user = byId.get();
            if (dto.getPassword().length() > 0) {
            	user.setPassword(encoder.encode(dto.getPassword()));
            }
            Set<Role> roles = user.getRoles();
            if (dto.getAdminRole()) {
            	roles.add(roleRepository.findByName("ROLE_ADMIN"));
            }
            else {
            	roles.remove(roleRepository.findByName("ROLE_ADMIN"));
            }
            if (dto.getUserRole()) {
            	roles.add(roleRepository.findByName("ROLE_USER"));
            } else {
            	roles.remove(roleRepository.findByName("ROLE_USER"));
            }
            user.setRoles(roles);
            return userRepository.save(user);

        }
        throw new IllegalArgumentException("Kullanıcı bulunamadı");
    }

    public User delete(long id) {
        Optional<User> byId = userRepository.findById(id);
        if (byId.isPresent()) {
            User user = byId.get();
            user.setActive(!user.isActive());
            return userRepository.save(user);

        }
        throw new IllegalArgumentException("Kullanıcı bulunamadı");
    }
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> byUsername = userRepository.findByUsername(username);
        if (byUsername.isPresent()) {
            return new MyUserDetails(byUsername.get());
        }
        throw new UsernameNotFoundException("Kullanıcı bulunamadı");
    }
    
    public Book addOrRemoveFavBook(long userId, long bookId) {
        Optional<User> user = userRepository.findById(userId);
        if (!user.isPresent()) {
            throw new IllegalArgumentException("Kullanıcı bulunamadı");
        }
        
        Optional<Book> book = bookRepository.findById(bookId);
        if (!book.isPresent()) {
        	throw new IllegalArgumentException("Kitap bulunamadı");
        }
        
        User usr = user.get();
        Book bk = book.get();
        
        if (!usr.getFavoriteBooks().contains(bk)) {
        	usr.getFavoriteBooks().add(bk);
        } else {
        	usr.getFavoriteBooks().remove(bk);
        }
        userRepository.save(usr);
        bookRepository.save(bk);
        
        return bk;
    }
    
    public Book addOrRemoveReadBook(long userId, long bookId) {
        Optional<User> user = userRepository.findById(userId);
        if (!user.isPresent()) {
            throw new IllegalArgumentException("Kullanıcı bulunamadı");
        }
        
        Optional<Book> book = bookRepository.findById(bookId);
        if (!book.isPresent()) {
        	throw new IllegalArgumentException("Kitap bulunamadı");
        }
        
        User usr = user.get();
        Book bk = book.get();

        if (!usr.getReadBooks().contains(bk)) {
        	usr.getReadBooks().add(bk);
        } else {
        	usr.getReadBooks().remove(bk);
        }
        userRepository.save(usr);
        bookRepository.save(bk);
        
        return bk;
    }

}
