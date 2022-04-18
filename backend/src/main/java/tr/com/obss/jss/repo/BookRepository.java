package tr.com.obss.jss.repo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import tr.com.obss.jss.entity.Book;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

	Optional<Book> findByName(String name);
	
	@Query("select b from Book b where b.author = :author")
	Optional <Book> findByAuthor(String author);
	
	Page<Book> findByActiveTrue(Pageable pageable);
	
	Page<Book> findByNameContainingAndActiveTrue(String infix, Pageable pageable);
	
//	@Query(value = "SELECT * FROM User u WHERE u.email = ?2 AND u.username = ?1 AND u.age BETWEEN 15 and 20", nativeQuery = true)
//	List<User> findSpecialUsers(String username, String email);
	
//	Page<Employee> findByNameContains(String name, Pageable pageable);
	
	
}
