import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

public class Main {

	private static final long INTERVAL = 5*1000;
	
	public static void main(String[] args) {
		
		
		while(true) {
			try {
				
				Thread.sleep(INTERVAL);
				
				List<NotificationRequest> requests = SQL.getRequestsFromDB();
				
				processNotificationRequests(requests);
				
			}catch(Exception e) {
				e.printStackTrace();
			}
		}

	}

	public static void processNotificationRequests(List<NotificationRequest> requests) {
		if (requests.isEmpty())
			return;
		
		TransLOC.updateTransLocData();

		Map<String, List<NotificationRequest>> result = requests.stream()
				.collect(Collectors.groupingBy(NotificationRequest::getEmail, Collectors.toList()));

		for (Entry<String, List<NotificationRequest>> e : result.entrySet()) {
			String email = e.getKey();
			processSingleNotificationRequest(email, e.getValue());
		}

	}

	private static void processSingleNotificationRequest(String email, List<NotificationRequest> requests) {
		String name = requests.get(0).getName();
		
		String msg = "Hello " + name + "! \n\nHere are your bus notifications:\n";
		
		for(NotificationRequest request : requests) {
			msg += "\n\t Route: " + request.getRouteName() + "\t\t Stop: " + request.getStopName() + ":\n";
			
			for(ArrivalNode a : TransLOC.getArrivalNodesMatching(request.getRouteID(), request.getStopID())){
				msg += "\t\t" + a.getDateFormated() + "\t Bus: " + a.getCallName()+ "\n";
			}
			
		}
		
		System.err.println(msg);
//		Email.sendEmail(email, msg);
	}
}
