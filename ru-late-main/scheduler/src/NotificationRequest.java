
public class NotificationRequest {

	private String email;
	private String name;
	private String routeID;
	private String stopID;
	private int notificationID;
	

	public NotificationRequest(String email, String name, String routeID, String stopID) {
		this.email = email;
		this.name = name;
		this.routeID = routeID;
		this.stopID = stopID;
	}

	public int getNotificationID() {
		return notificationID;
	}

	public void setNotificationID(int notificationID) {
		this.notificationID = notificationID;
	}

	public String getName() {
		return name;
	}

	public String getEmail() {
		return email;
	}
	
	public String getRouteName() {
		return TransLOC.routeIDToName(routeID);
	}
	
	public String getStopName() {
		return TransLOC.stopIDToName(stopID);
	}

	public String getRouteID() {
		return routeID;
	}

	public String getStopID() {
		return stopID;
	}

	@Override
	public String toString() {
		return "NotificationRequest [email=" + email + ", name=" + name + ", routeID=" + routeID + ", stopID=" + stopID
				+ "]";
	}


}
