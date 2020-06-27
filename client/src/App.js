import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL ,{Marker, Popup} from 'react-map-gl';
import listLogEntries from './api'
import LogEntryForm from './LogEntryForm';
const App = () => {

  const [logEntries,setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 28.6374213,
    longitude: 77.0642205,
    zoom: 3
  });

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  useEffect(() => {
    getEntries();
  }, []);

  const showAddMarkerPopup = (event) => {
    const [longitude, latitude] = event.lngLat;
    setAddEntryLocation({
      latitude,
      longitude,
    });
  }

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/abhaybaiju/ckbt37p1b0i7g1hqqskttnzs8"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      onDblClick={showAddMarkerPopup}
    >
      {logEntries.map(entry => (
        <React.Fragment>
        <Marker key={entry._id}
         latitude={entry.latitude} 
         longitude={entry.longitude} 
         offsetLeft={-15} 
         offsetTop={-30}>

          <div 
           onClick = {() => setShowPopup({
           [entry._id]: true,
         })}>
          <svg className="marker" style={{width: '30px', height: '30px',}} 
          viewBox="0 0 24 24" width="48" height="48" stroke-width="0.8" fill="crimson" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </div>
        </Marker>
      {
        showPopup[entry._id] ? ( 
        <Popup
          latitude={entry.latitude}
          longitude={entry.longitude}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setShowPopup({ 
           [entry._id]: false,
         })}
          anchor="top" >
          <div className="popup"> 
            <h3>{entry.title}</h3>
            <p>{entry.description}</p>
            <small>Visited on: {new Date(entry.visitDate).toLocaleDateString()}</small>
            {entry.image && <img src={entry.image} alt={entry.title}/>}
          </div>
      </Popup> ) : null
      }
      </React.Fragment>
      ))}
      {
        addEntryLocation ? (
          <>
            <Marker 
              latitude={addEntryLocation.latitude} 
              longitude={addEntryLocation.longitude} 
              offsetLeft={-15} 
              offsetTop={-30}>

              <div>
                <svg className="marker" style={{width: '30px', height: '30px',}} 
                viewBox="0 0 24 24" width="48" height="48" stroke-width="0.8" fill="crimson" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
            </Marker>
            <Popup
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setAddEntryLocation(null)}
              anchor="top" >
              <div className="popup"> 
                <LogEntryForm onClose={() => {
                  setAddEntryLocation(null);
                  getEntries();
                }} location={addEntryLocation}/>
              </div>
            </Popup>
          </>
        ) : null
      }
    </ReactMapGL>
  );
}
export default App;