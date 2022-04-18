package tr.com.obss.jss.cache;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import tr.com.obss.jss.model.UserDTO;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@Component("prototypeCache")
@Scope("prototype")
public class UserCachePrototype implements UserCache {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserCachePrototype.class);
    public Map<String, UserDTO> users;

    @PostConstruct
    public void init() {
        LOGGER.info("Prototype bean oluştu");
        users = new HashMap<>();
    }

    @Override
    public void put(UserDTO user) {
        users.put(user.getUsername(), user);
    }

    @Override
    public Map<String, UserDTO> getMap() {
        return users;
    }
}
