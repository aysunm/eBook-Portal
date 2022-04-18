package tr.com.obss.jss.entity;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;
import javax.persistence.PreRemove;
import javax.persistence.PreUpdate;
import java.io.Serializable;
import java.util.Date;

@MappedSuperclass
public class EntityBase implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "CREATE_DATE")
    private Date createDate;

    @Column(name = "UPDATE_DATE")
    private Date updateDate;

    @Column(name = "ACTIVE")
    private boolean active;

    @Column(name = "OPERATION_TYPE")
    private String operationType;

    @PrePersist
    public void onPrePersist() {
        this.setOperationType("SAVE");
        this.setCreateDate(new Date());
        this.setUpdateDate(new Date());
        this.setActive(true);
    }

    @PreUpdate
    public void onPreUpdate() {
        this.setOperationType("UPDATE");
        this.setUpdateDate(new Date());
    }

    @PreRemove
    public void onPreRemove() {
        this.setOperationType("DELETE");
        this.setUpdateDate(new Date());
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getOperationType() {
        return operationType;
    }

    public void setOperationType(String operationType) {
        this.operationType = operationType;
    }
}
