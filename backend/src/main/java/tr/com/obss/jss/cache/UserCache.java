package tr.com.obss.jss.cache;

import tr.com.obss.jss.model.UserDTO;

import java.util.Map;

public interface UserCache {
     void put(UserDTO user);
     Map<String, UserDTO> getMap();
}
