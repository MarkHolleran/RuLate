//Returns a list of stops based on user selection
export default function DropDownStopList(  selection  ) {
  const stops= require('../../../components/data/routeStops.json')

    return (stops[selection].stops);
  };