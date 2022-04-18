package tr.com.obss.jss.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tr.com.obss.jss.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    List<User> findByUsernameStartingWithAndOperationTypeIsNotNullAndActiveTrueOrderByIdDesc(String username);

    List<User> findByRoles_NameIn(List<String> roles);

    @Query("select u from User u where u.id = :id")
    Optional<User> getById(long id);

    @Query(value = "select * from User u where u.id = :id", nativeQuery = true)
    Optional<User> getByIdNative(long id);
    
//    @Query(nativeQuery = true, value = "select case when exists(select * from users_roles " 
//    	    + "where user_id = :userId and role_id = 2) then 'true' else 'false' end from dual")
//    	boolean isAdmin(@Param("userId") long userId);
}
