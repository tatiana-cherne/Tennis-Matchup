import React, { useState, useEffect } from "react";
import { useLoaderData, Link } from "react-router-dom";
import httpClient from "../httpClient";
import initMap from "./Courts"

export default function Dashboard(props) {
  const { loggedIn } = props;
  const dashboard = useLoaderData();
  const [photoUrl, setPhotoUrl] = useState(dashboard.player.photo);
  const [acts, setActs] = useState(dashboard.activities);
  const [courts, setCourts] = useState(dashboard.courts);
  console.log(dashboard)

  if (!loggedIn) {
    return (    
    <div>
    <h2>Hi friend, to see your dashboard please log in.</h2>
    </div>
    )
  }

  async function handlePhotoUpload(event) {
    const imageFile = event.target.files[0];
    try {
      const response = await uploadPhoto(imageFile);
      setPhotoUrl(response.url);
    } catch (error) {
      console.error(error);
    }
  }

  async function handlePhotoRemove() {
    try {
      await removePhoto();
      setPhotoUrl(null);
    } catch (error) {
      console.error(error);
    }
  }

  async function uploadPhoto(imageFile) {
    const formData = new FormData();
    formData.append("file", imageFile);
    try {
      const response = await httpClient.post(
        "http://localhost:5000/upload-photo",
        formData
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function removePhoto() {
    try {
      const response = await httpClient.get("http://localhost:5000/remove-photo");
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return (
    <div className="profile-page">
      <div className="photo-and-info">
        <div className="photo-and-buttons">
          <div className="profile-photo">
            {photoUrl ? (
              <img 
                src={photoUrl}
                alt="Profile"
                className="profile-picture"
              />
            ) : (
              <img
                src="temp-profile.jpeg"
                alt="Profile"
                className="profile-picture"
              />
            )}
          </div>
          <div className="photo-buttons">
            <div className="col">
              <div>
                <input 
                  type="file" 
                  className="btn btn-primary" 
                  onChange={handlePhotoUpload} 
                  style={{ display: "none" }} 
                  id="upload-photo" />
                <label 
                  htmlFor="upload-photo" 
                  className="btn btn-primary"
                  >Upload Photo
                </label>
              </div>
            </div>
            <div className="col">
              <button 
                className="btn btn-danger" 
                onClick={handlePhotoRemove}
                >Remove Photo
              </button>
            </div>
          </div>
        </div>
        <div className="player-info">
          <PlayerInfo p={dashboard.player} c={courts}/>
        </div>
      </div>

      <br></br><br></br>

      <div className="profile-courts">
        <ProfileCourts c={courts} setCourts={setCourts}/>
      </div>

      <br></br><br></br>

      <div className="profile-activities">
        <Activities acts={acts} setActs={setActs} />
      </div>

      <br></br><br></br>

      <div className="profile-ratings">
        <RatingsReceived 
          rr={dashboard.ratingsR} 
          lvl={dashboard.player.skill_lvl} />
      </div>

    </div>
  );
}

export function PlayerInfo({ p, c }) {
    const [prefCourt, setPrefCourt] = useState(p.pref_court);

    const handleCourtChange = async (event) => {
      const courtId = event.target.value;
      setPrefCourt(courtId);
  
      try {
        await httpClient.post('http://localhost:5000/pref-court', 
        { courtId: courtId }, {
          headers: {
            "Content-Type": "application/json",
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    const joinDate = new Date(p.join_date);
    const formattedDate = joinDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    return (
      <div>
        <h1>
          {p.fname} {p.lname}
        </h1>
        <p>Gender: {p.gender}</p>
        <p>Skill Level: {p.skill_lvl.toFixed(1)}</p>
        <p>Game Preference: {p.game_pref}</p>
        <p>Join Date: {formattedDate}</p>
        <div className="row">

          <div className="col">
            <label 
              htmlFor="pref-court-select"
              style={{ color: 'white' }}>Preferred Court :
            </label>
          </div>

          <div className="col">
            <select value={prefCourt} onChange={handleCourtChange}>
              <option value="">Select a court</option>
              {c.map((court) => (
                <option key={court.id} value={court.id}>
                  {court.name}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>
    );
  }

  export function PlayerPhoto(props) {
    const { p } = props;
    const [photoUrl, setPhotoUrl] = useState(p.photo);
  
    const handleUploadPhoto = async (event) => {
      const files = event.target.files;
      const data = new FormData();
      data.append("file", files[0]);
  
      await httpClient.post('http://localhost:5000/upload-photo', { body: data });
    };
  
    const handleRemovePhoto = async () => {
      setPhotoUrl("");
  
      await httpClient.get('http://localhost:5000/remove-photo');
    };
  
    const handleChangePhoto = async (event) => {
      await handleRemovePhoto();
      await handleUploadPhoto(event);
    };
  
    return (
      <div>
        {photoUrl ? (
          <div>
            <img src={photoUrl} alt="Profile" className="profile-picture" />
            <div>
              <button onClick={handleRemovePhoto}>Remove</button>
              <input type="file" onChange={handleChangePhoto} />
            </div>
          </div>
        ) : (
          <div>
            <p>No photo uploaded.</p>
            <input type="file" onChange={handleUploadPhoto} />
          </div>
        )}
      </div>
    );
  }

export function ProfileCourts(props) {
  const { c } = props;

  useEffect(() => {
    const google = window.google;

    var map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 40.7264996, lng: -73.9877832 },
      zoom: 11
    });

    c.map((court) => {
      var marker = new google.maps.Marker({
        position: { lat: parseFloat(court.lat), lng: parseFloat(court.long) },
        map: map,
        title: court.name,
        icon: {
          url: "tennisball.png",
          scaledSize: new google.maps.Size(20, 20)
        }
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `${court.name}`,
        maxWidth: 200
      });

      marker.addListener("mouseover", () => {
        infoWindow.open(map, marker);
      });

      marker.addListener("mouseout", () => {
        infoWindow.close();
      });
    });
  }, [c]);

  const  handleDeleteCourt= async (id) => {
    try {
      const response = await httpClient.post(
        'http://localhost:5000/delete-court', 
        { courtId: id }, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      props.setCourts(c.filter(court => court.id !== id));
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="container">
      <div className="header mb-3 text-center">
        <h1>My Courts</h1>
      </div>

      <div
        className="container"
        id="map"
        style={{ height: "500px", width: "1110px" }}
      ></div>
      <br />

      <div>
        {c.length === 0 ? (
          <h4>
            No preferred courts. Please select them <Link to={"/courts"}>here</Link>.
          </h4>
        ) : (
          <table className="table table-striped align-middle mb-0 bg-white equal-container">
            <thead>
              <tr>
                <th>Borough</th>
                <th style={{ width: '15%' }}>Name</th>
                <th style={{ width: '20%' }}>Location</th>
                <th style={{ width: '12%' }}>Phone</th>
                <th style={{ width: '8%' }}>Count</th>
                <th>In / Out</th>
                <th>Surface</th>
                <th>Accessible</th>
                <th>Remove?</th>
              </tr>
            </thead>
            <tbody>
              {c.map((court) => (
                <tr key={court.id}>
                  <td>{court.borough}</td>
                  <td>
                    <Link to={`/courts/${court.id}`}> {court.name} </Link>
                  </td>
                  <td>{court.location}</td>
                  <td>{court.phone}</td>
                  <td>{court.court_count}</td>
                  <td>{court.indoor_outdoor}</td>
                  <td>{court.surface}</td>
                  <td>{court.accessible}</td>
                  <td className="align-middle">
                    <button 
                    onClick={() => handleDeleteCourt(court.id)}
                    >Delete</button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export function Activities(props) {
  const { acts } = props;

  const handleDeleteActivity = async (id) => {
    try {
      const response = await httpClient.post(
        'http://localhost:5000/delete-activity', 
        { id }, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      props.setActs(acts.filter(a => a.activity_id !== id));
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  if (acts.length === 0) {
    return (
      <p> No activities planned. </p>
    );
  } else {

    return (
      <div className="container">
        <div className="equal-container"> 
          <div className="header mb-3 text-center">
            <h1 className="mb-0">My Activities</h1>
          </div>
        </div>
        <table className="table table-striped align-middle mb-0 bg-white" id="activity-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Time</th>
              <th>Photo</th>
              <th>Player</th>
              <th>Court</th>
              <th>Match Type</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Cancel?</th>
            </tr>
          </thead>
          <tbody>
          {acts.map((a) => (
          <tr key={a.activity_id}>
            <td className="align-middle">{new Date(a.date).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}</td>
            <td className="align-middle">{new Date(a.date).toLocaleString('en-US', {hour: 'numeric', minute: 'numeric' })}</td>
            <td className="align-middle">              
              <img 
                src={a.partner_photo}
                className="activity-table-picture"
              />
            </td>
            <td className="align-middle">
              <Link to={`/players/${a.partner_id}`}>{a.partner_name}</Link>
            </td>
            <td className="align-middle">
              <Link to={`/courts/${a.court_id}`}> {a.court_name } </Link>
            </td>
            <td className="align-middle">{a.match_type}</td>
            <td className="align-middle">
              {new Date(a.date) > new Date() ? 'Activity Scheduled' :
                a.rating !== null ? a.rating.toFixed(1) :
                <Link className="player-rating-link" to={`/rating/${a.partner_id}/${a.activity_id}`}>
                  Submit Rating
                </Link>
              }
            </td>
            <td className="align-middle">{a.comments}</td>
            <td className="align-middle">
              {new Date(a.date) > new Date() ? (
               <button 
               onClick={() => handleDeleteActivity(a.activity_id)}
               >Delete</button>
              ) : null}
            </td>
          </tr>
        ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export function RatingsReceived(props) {
  const { rr, lvl } = props;

  if (rr.length === 0) {
    return (
      <div>
        <h4> No ratings Received. </h4>
      </div>
    );
  } else {

    return (
      <div className="container">
        <div className="equal-container"> 
          <div className="header mb-3 text-center">
            <h1 className="mb-0">My Skill Level Ratings</h1>
          </div>
        </div>  
        <table className="table table-striped align-middle mb-0 bg-white" id="activity-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Received</th>
              <th>Claimed</th>
              <th>Difference</th>
              <th style={{ width: '35%' }}>Comments</th>
            </tr>
          </thead>
          <tbody>
            {rr.map((r) => (
              <tr key={r.id}>
                <td className="align-middle">{new Date(r.created_at).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}</td>
                <td>{r.lvl_rating.toFixed(1)}</td>
                <td>{lvl.toFixed(1)}</td>
                <td style={{color: r.lvl_rating - lvl < 0 ? 'red' : 'green'}}>{(r.lvl_rating-lvl).toFixed(1)}</td>
                <td>{r.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

// data loader
export const DashboardLoader = async () => {

  try {
    const response = await httpClient.get('http://localhost:5000/dashboard');
    return response.data;

  } catch (error) {
    throw new Error('Could not fetch dashboard data.');
  }
}