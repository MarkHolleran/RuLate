import React from 'react'
import { GoogleMap, useJsApiLoader} from '@react-google-maps/api';

const MAP_ID="XXXX REMOVED TOKEN XXXX" //Token for Google Maps

//Makes sure that the map is loaded. If not laoded it will be reloaded.
function Map({ coordinates, mapStyle ,components,zoom = 16 }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "XXXX REMOVED API KEY XXXX"
  })

  const [map, setMap] = React.useState(null)
  const onLoad = React.useCallback(function callback(map) {
    map.setZoom(zoom)
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  //Checks if map loads for user
  return isLoaded ? (
    <>
      <GoogleMap
        options={{ mapId: MAP_ID }}
        mapContainerStyle={mapStyle}
        center={coordinates}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
      {components}
        <></>
      </GoogleMap>
      </>
  ) : <></>
}
export default React.memo(Map)
