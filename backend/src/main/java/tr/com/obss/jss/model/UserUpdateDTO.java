package tr.com.obss.jss.model;

//import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class UserUpdateDTO {
    @Size(max = 255, min = 0, message = "Lütfen geçerli bir şifre giriniz")
    private String password;
    
    private boolean adminRole;

    private boolean userRole;
    
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    
    public boolean getAdminRole() {
    	return adminRole;
    }
    
    public boolean getUserRole() {
    	return userRole;
    }
    
    public void setAdminRole(boolean role) {
    	this.adminRole = role;
    }
    
    public void setUserRole(boolean role) {
    	this.userRole = role;
    }
}
