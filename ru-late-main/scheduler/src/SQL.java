import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class SQL {

	public SQL() {
	}

	private static final String DB_URL = "jdbc:mysql://localhost:3306/rulate";
	private static final String USER = "API";
	private static final String PASS = "RuLate2022";
	private static final String SELECT_QUERY = "SELECT * ,(SELECT Email FROM User U  WHERE U.UserID = E.UserID) As Email ,(SELECT Name  FROM User U  WHERE U.UserID = E.UserID) As Name FROM EmailSchedule E  WHERE ExecutionTime < ?;";
	private static final String DELETE_QUERY = "DELETE FROM EmailSchedule WHERE NotificationID IN (%s);";

//	public static void main(String[] args) {
//		System.err.println(getRequestsFromDB());
//	}

	public static List<NotificationRequest> getRequestsFromDB() {

		List<NotificationRequest> requests = new ArrayList<>();
		
		try {
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection(DB_URL, USER, PASS);

			PreparedStatement stmt = conn.prepareStatement(SELECT_QUERY);
			stmt.setLong(1, System.currentTimeMillis());

			ResultSet rs = stmt.executeQuery();

			while (rs.next()) {
				String email = rs.getString("Email");
				String name = rs.getString("Name");
				int noteID = rs.getInt("NotificationID");
				
				if(email==null || name==null)continue;
				
				NotificationRequest r = new NotificationRequest(email, name, rs.getString("RouteID"), rs.getString("StopID"));
				r.setNotificationID(noteID);		
				
				requests.add(r);
			}
			
			//DELETION
			
			if(requests.isEmpty() == false) {
				PreparedStatement deleteStatement = conn.prepareStatement(String.format(DELETE_QUERY, requests.stream().map(v -> "?").collect(Collectors.joining(", "))));
				
				int i = 0;
				for(NotificationRequest request : requests) {
					deleteStatement.setInt(++i, request.getNotificationID());
				}
				
				System.err.println(deleteStatement);
				
				deleteStatement.execute();  //UNCOMMENT THIS IN PRODUCTIOn
			}
			
			

			conn.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		
		
		
		return requests;
	}

}
