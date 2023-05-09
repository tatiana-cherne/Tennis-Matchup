import { useState, useEffect } from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import httpClient from "../httpClient";
import initMap from "../Maps";

export default function Courts(props) {
    const { loggedIn } = props;
    const courtsData = useLoaderData()

    const [selectedBoroughs, setSelectedBoroughs] = useState([]);
    const [selectedSurfaces, setSelectedSurfaces] = useState([]);
    const [accessibleOnly, setAccessibleOnly] = useState(false);

    const courts = courtsData.filter((court) => {
      if (selectedBoroughs.length > 0 && !selectedBoroughs.includes(court.borough)) {
        return false;
      }
      if (selectedSurfaces.length > 0 && !selectedSurfaces.includes(court.surface)) {
        return false;
      }
      if (accessibleOnly && court.accessible !== "Y") {
        return false;
      }
      return true;
    });

    useEffect(() => {
      initMap(courts);
    }, [selectedBoroughs,selectedSurfaces,accessibleOnly]);

    const handleBoroughChange = (event) => {
      const borough = event.target.value;
      const isChecked = event.target.checked;
      if (isChecked) {
        setSelectedBoroughs([...selectedBoroughs, borough]);
      } else {
        setSelectedBoroughs(selectedBoroughs.filter((b) => b !== borough));
      }
    };

    const handleSurfaceChange = (event) => {
      const surface = event.target.value;
      const isChecked = event.target.checked;
      if (isChecked) {
        setSelectedSurfaces([...selectedSurfaces, surface]);
      } else {
        setSelectedSurfaces(selectedSurfaces.filter((s) => s !== surface));
      }
    };

    const handleAccessibilityChange = (event) => {
      setAccessibleOnly(event.target.checked);
    };

    return (
      <div className="container ">
        <div className="header mb-3 text-center">
          <h1>Tennis Courts</h1>
        </div>

        <div className="container" id="map" style={{ height: "500px", width: "100%" }}></div>
        <br/>
        <h5>These tennis courts are public and provided by NYC parks. 
            Submit your court if you don't see it here!
        </h5>
        
        <div className="container">
          <div className="card m-3">
            <div className="card-body">
              <form className="form-inline justify-content-around">
                
              <div className="form-group mb-2">
                  <label className="mr-2"> Borough </label>
                  <div className="btn-group btn-group-toggle custom-toggle" data-toggle="buttons">
                    <label className="btn btn-outline-secondary btn-equal-width">
                      <input onFocus={handleBoroughChange} type="checkbox" name="borough-checkbox-buttons" value="Manhattan" /> Manhattan
                    </label>
                    <label className="btn btn-outline-secondary btn-equal-width">
                      <input onFocus={handleBoroughChange} type="checkbox" name="borough-checkbox-buttons" value="Brooklyn" /> Brooklyn
                    </label>
                    <label className="btn btn-outline-secondary btn-equal-width">
                      <input onFocus={handleBoroughChange}type="checkbox" name="borough-checkbox-buttons" value="Queens" /> Queens
                    </label>
                    <label className="btn btn-outline-secondary btn-equal-width">
                      <input onFocus={handleBoroughChange} type="checkbox" name="borough-checkbox-buttons" value="Bronx" /> Bronx
                    </label>
                    <label className="btn btn-outline-secondary btn-equal-width">
                      <input onFocus={handleBoroughChange} type="checkbox" name="borough-checkbox-buttons" value="Staten Island" /> Staten Island
                    </label>
                  </div>
                </div>

                <div className="form-group mb-2">
                  <label className="mr-2"> Court Surface </label>
                  <div className="btn-group btn-group-toggle custom-toggle" data-toggle="buttons">
                    <label className="btn btn-outline-secondary btn-equal-width">
                      <input onFocus={handleSurfaceChange} type="checkbox" name="court-checkbox-buttons" value="Hard" /> Hard
                    </label>
                    <label className="btn btn-outline-secondary btn-equal-width">
                      <input onFocus={handleSurfaceChange} type="checkbox" name="court-checkbox-buttons" value="Clay" /> Clay
                    </label>
                  </div>
                </div>

                <div className="form-group mb-2">
                  <div className="btn-group btn-group-toggle" data-toggle="buttons">
                    <label className="btn btn-outline-secondary btn-equal-width">
                      <input onFocus={handleAccessibilityChange} type="checkbox" name="access-checkbox-buttons" value="Y" /> Accessible
                    </label>
                  </div>
                </div>
                
              </form>
            </div>
          </div>
        </div>

        <table className="table table-striped align-middle mb-0 bg-white equal-container">
          <thead>
            <tr>
              <th style={{ width: '10%' }}>Borough</th>
              <th style={{ width: '15%' }}>Name</th>
              <th style={{ width: '25%' }}>Location</th>
              {/* <th style={{ width: '15%' }}>Phone</th> */}
              <th style={{ width: '8%' }}>Count</th>
              {/* <th style={{ width: '10%' }}>In/Out</th> */}
              <th style={{ width: '10%' }}>Surface</th>
              <th style={{ width: '8%' }}>Accessible</th>
            </tr>
          </thead>
          <tbody>
            {courts.map((court) => (
              <tr key={court.id}>
                <td>{ court.borough }</td>
                <td><Link to={`/courts/${court.id}`}> { court.name } </Link></td>
                <td>{ court.location }</td>
                {/* <td>{ court.phone }</td> */}
                <td>{ court.court_count }</td>
                {/* <td>{ court.indoor_outdoor }</td> */}
                <td>{ court.surface }</td>
                <td>{ court.accessible }</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

// data loader
export const CourtsLoader = async () => {

  try {
    const response = await httpClient.get('http://localhost:5000/courts');
    return response.data;
    
  } catch (error) {
    throw new Error('Could not fetch the list of courts');
  }
}