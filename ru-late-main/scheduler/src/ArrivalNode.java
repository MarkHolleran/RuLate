import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.json.JSONException;
import org.json.JSONObject;

public class ArrivalNode {

	private String routeID;
	private String stopID;
	private long timestamp;
	private String callName;
	
	public ArrivalNode(JSONObject a) throws JSONException {
		routeID = a.getInt("route_id")+"";
		stopID = a.getInt("stop_id")+"";
		timestamp = a.getLong("timestamp")*1000;
		callName = a.getString("call_name");
	}
	
	public boolean matches(String routeID, String stopID) {
		return this.routeID.equals(routeID) && this.stopID.equals(stopID);
	}
	
	public Date getDate() {
		Timestamp ts=new Timestamp(timestamp);  
        return new Date(ts.getTime());  
	}
	
	private static SimpleDateFormat f = new SimpleDateFormat("hh:mm a");
	
	public String getDateFormated() {
		return f.format(new Date(timestamp));
	}

	public String getRouteID() {
		return routeID;
	}

	public String getStopID() {
		return stopID;
	}

	public long getTimestamp() {
		return timestamp;
	}
	
	public String getRouteName() {
		return TransLOC.routeIDToName(routeID);
	}
	
	public String getStopName() {
		return TransLOC.stopIDToName(stopID);
	}

	public String getCallName() {
		return callName;
	}

	
}
