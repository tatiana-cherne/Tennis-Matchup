import { useState, useEffect } from "react";
import { useLoaderData, Link, useParams, useNavigate } from 'react-router-dom';
import httpClient from "../httpClient";

export default function Scheduler(props) {
  const { loggedIn } = props;
  const data = useLoaderData();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    hittingPartner: id,
    schedulingPlayer: loggedIn,
    datetime: "",
    courtSession: "",
    matchType: "",
  });

    if (!loggedIn) {
    return (    
    <div>
    <h2>Hi friend, to see your dashboard please log in.</h2>
    </div>
    )
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await httpClient.post('http://localhost:5000/submit-schedule', formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="container mt-5 col-6">
      <div className="row justify-content-center">
        <div className="col-md-9">
          <div className="card mt-4">
            <div className="card-header bg-secondary text-white text-center">
              <h4 className="mb-0">Schedule a Hitting Session</h4>
            </div>

            <div className="card-body">
              <form id="schedule-form" className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="hitting-partner">Hitting Partner:</label>
                  <select
                    className="form-control"
                    id="hitting-partner"
                    name="hittingPartner"
                    value={formData.hittingPartner}
                    onChange={handleInputChange}
                    required
                  >
                    {data.players.map((player) => (
                      <option
                        key={player.id}
                        value={player.id.toString()}
                      >
                        {player.fname} {player.lname} ({player.skill_lvl.toFixed(1)})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="datetime">Date:</label>
                  <input
                    type="datetime-local"
                    id="datetime"
                    name="datetime"
                    value={formData.datetime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="court-session">Court:</label>
                  <select
                    className="form-control"
                    id="court-session"
                    name="courtSession"
                    value={formData.courtSession}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled hidden>
                      Select Court
                    </option>
                    {data.courts.map((court) => (
                      <option
                        key={court.id}
                        value={court.id.toString()}
                      >
                        {court.name} ({court.borough})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Match Type:</label>
                  <div className="btn-group btn-group-toggle" data-toggle="buttons">
                    <label className="btn btn-outline-secondary">
                      <input 
                        type="radio" 
                        name="matchType" 
                        value="Match" 
                        onFocus={handleInputChange}
                        required
                        /> Match
                    </label>
                    <label className="btn btn-outline-secondary">
                      <input 
                        type="radio" 
                        name="matchType" 
                        value="Practice" 
                        onChange={handleInputChange}
                        /> Practice
                    </label>
                  </div>
                </div>
                <div className="row">
                  <button 
                    type="submit" 
                    className="btn btn-primary mx-auto col-6"
                    onSubmit={handleSubmit}
                    >Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  }

// data loader
export const CourtsPlayersLoader = async () => {

    const res = await fetch('http://localhost:5000/courts-players')
    
    if (!res.ok) {
      throw Error('Could not fetch all courts and players')
    }
    
    return res.json()
  }