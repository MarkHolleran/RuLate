import React from 'react'
import {PolylineF} from '@react-google-maps/api';
import decodePolyline from 'decode-google-map-polyline';

//Gets the routes and segements to be maped
const segmentsAPI= require('../../../components/data/segments.json')
const routes=segmentsAPI.routes;
const segments=segmentsAPI.segments;
var routesDict={};
var segmentsDict={};

routes.map(route => {
  routesDict[route.id]=route.segments;
})
segments.map(segment => {
  segmentsDict[segment.id]={levels: segment.levels, points: segment.points};
})

//Creates the route on the map using decodePolyline() that was mapped eariler
function decodeLevels(encodedLevelsString) {
  var decodedLevels = [];

  for (var i = 0; i < encodedLevelsString.length; ++i) {
    var level = encodedLevelsString.charCodeAt(i) - 63;
    decodedLevels.push(level);
  }

  return decodedLevels;
}

//Plots on the map using routes/segments
export default function Route({routeId, routeColor}) {
  const path= routesDict[routeId];
  return (
    path.map(segment => {
      var seg=segmentsDict[Math.abs(segment)];
      var decodedPath = decodePolyline(seg.points);
      var decodedLevels = decodeLevels(seg.levels);
      return <PolylineF options={{
        strokeColor: routeColor,
        strokeOpacity: 1,
        strokeWeight: 5,
    }} path= {decodedPath} levels= {decodedLevels} /> })
      )
}
