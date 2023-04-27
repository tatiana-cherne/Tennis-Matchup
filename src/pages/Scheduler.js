import { useState } from "react";
import { useLoaderData, Link } from 'react-router-dom'


export default function Scheduler(props) {
  const { loggedIn } = props;
  const data = useLoaderData();

  const [formData, setFormData] = useState({
    hittingPartner: "",
    schedulingPlayer: loggedIn,
    datetime:"",
    courtSession:"",
    matchType:"",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("http://localhost:5000/submit-schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-9">
          <div className="card mt-4">
            <div className="card-header bg-secondary text-white text-center">
              <h4 className="mb-0">Schedule a Hitting Session</h4>
            </div>
            <div className="card-body">
              <form id="my-form" className="form">
                <div className="form-group">
                  <label htmlFor="hitting-partner">Hitting Partner:</label>
                  <select className="form-control" id="hitting-partner" name="hittingPartner" required>
                    <option value="" disabled selected hidden>
                      Select Player
                    </option>
                    {data.players.map((player) => (      
                      <option 
                        key={player.id} 
                        value={player.id.toString()}
                        onChange={handleInputChange}
                        required
                        >{player.fname} {player.lname} ({player.skill_lvl.toFixed(1)})
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
                    onChange={handleInputChange}
                    required/>
                </div>
                <div className="form-group">
                  <label htmlFor="court-session">Court:</label>
                  <select className="form-control" id="court-session" name="courtSession" required>
                    <option value="" disabled selected hidden>
                      Select Court
                    </option>
                    {data.courts.map((court) => (  
                      <option 
                        key={court.id} 
                        value={court.id.toString()}
                        onChange={handleInputChange}
                        required
                        >{court.name} ({court.borough})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Match Type:</label>
                  <div className="btn-group btn-group-toggle" data-toggle="buttons">
                    <label className="btn btn-outline-secondary active">
                      <input 
                        type="radio" 
                        name="matchType" 
                        value="match" 
                        onFocus={handleInputChange}
                        required
                        /> Match
                    </label>
                    <label className="btn btn-outline-secondary">
                      <input 
                        type="radio" 
                        name="matchType" 
                        value="practice" 
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
                {/* <!-- Hidden input field to store the session ID -->
                <input type="hidden" name="session_id" value="{{ session['id'] }}">
                <button type="submit" className="btn btn-primary col-md-3">Submit</button> */}
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