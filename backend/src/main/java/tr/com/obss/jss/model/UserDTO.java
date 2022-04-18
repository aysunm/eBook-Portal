package tr.com.obss.jss.model;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class UserDTO {

    @NotBlank
    @Size(max = 255, min = 3, message = "Lütfen geçerli bir kullanıcı adı giriniz")
    private String username;

    @NotBlank
    @Size(max = 255, min = 3, message = "Lütfen geçerli bir şifre giriniz")
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
