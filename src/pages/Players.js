import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import httpClient from "../httpClient"
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import RootLayout from '../layouts/RootLayout'

export default function Players(props) {
  const { loggedIn } = props;
  const [players, setPlayers] = useState([]);
  const [showFriends, setShowFriends] = useState(false);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedSkillLevels, setSelectedSkillLevels] = useState([]);

  useEffect(() => {
    const url = showFriends ? "http://localhost:5000/friends" : "http://localhost:5000/all-players";
    httpClient.get(url)
    .then((response) => {
      let filteredPlayers = response.data;
      if (selectedGenders.length > 0) {
        filteredPlayers = filteredPlayers.filter((player) =>
          selectedGenders.includes(player.gender)
        );
      }
      if (selectedSkillLevels.length > 0) {
        filteredPlayers = filteredPlayers.filter((player) =>
          selectedSkillLevels.includes(player.skill_lvl)
        );
      }
      setPlayers(filteredPlayers);
    })
    .catch((error) => console.error(error));
  }, [showFriends, selectedGenders, selectedSkillLevels]);

  const handleCheckboxChange = (event) => {
    setShowFriends(event.target.checked);
  };

  const handleGenderChange = (event) => {
    const value = event.target.value;
    if (event.target.checked) {
      setSelectedGenders([...selectedGenders, value]);
    } else {
      setSelectedGenders(selectedGenders.filter((v) => v !== value));
    }
  };

  const handleSkillLevelChange = (event) => {
    const value = Number(event.target.value);
    if (event.target.checked) {
      setSelectedSkillLevels([...selectedSkillLevels, value]);
    } else {
      setSelectedSkillLevels(
        selectedSkillLevels.filter((v) => v !== value)
      );
    }
  };

return (
    <div className="container">
      <div className="equal-container"> 
        <div className="header mb-3 text-center">
          <h1 className="mb-0">Tennis Players</h1>
        </div>
      </div>

      <div className="container mb-3">
        <div className="card mb-3" id="player-form-inputs">
          <div className="card-body">
            <form className="form-inline justify-content-around">
              
              <div className="form-group mb-3">
                <label className="mr-2">Gender:</label>
                <div className="btn-group btn-group-toggle custom-toggle" data-toggle="buttons">
                  <label className="btn btn-outline-secondary btn-equal-width">
                    <input onFocus={handleGenderChange} type="checkbox" name="gender" value="M"/> Male
                  </label>
                  <label className="btn btn-outline-secondary btn-equal-width">
                    <input onFocus={handleGenderChange} type="checkbox" name="gender" value="F"/> Female
                  </label>
                </div>
              </div>
              
              <div className="form-group mb-3">
                <label className="mr-2">Skill Level:</label>
                <div className="btn-group btn-group-toggle custom-toggle" data-toggle="buttons">
                  <label className="btn btn-outline-secondary btn-equal-width">
                    <input onFocus={handleSkillLevelChange} type="checkbox" name="skill-checkbox-buttons" value="2.5" /> 2.5
                  </label>
                  <label className="btn btn-outline-secondary btn-equal-width">
                    <input onFocus={handleSkillLevelChange} type="checkbox" name="skill-checkbox-buttons" value="3.0" /> 3.0
                  </label>
                  <label className="btn btn-outline-secondary btn-equal-width">
                    <input onFocus={handleSkillLevelChange} type="checkbox" name="skill-checkbox-buttons" value="3.5" /> 3.5
                  </label>
                  <label className="btn btn-outline-secondary btn-equal-width">
                    <input onFocus={handleSkillLevelChange} type="checkbox" name="skill-checkbox-buttons" value="4.0" /> 4.0
                  </label>
                  <label className="btn btn-outline-secondary btn-equal-width">
                    <input onFocus={handleSkillLevelChange} type="checkbox" name="skill-checkbox-buttons" value="4.5" /> 4.5
                  </label>
                  <label className="btn btn-outline-secondary btn-equal-width">
                    <input onFocus={handleSkillLevelChange} type="checkbox" name="skill-checkbox-buttons" value="5.0" /> 5.0
                  </label>
                </div>
              </div>
              {loggedIn ? (
                <div className="form-check mb-3">
                    <input checked={showFriends} onChange={handleCheckboxChange} className="form-check-input" type="checkbox" id="friendsCheckbox" name="friendsCheckbox"></input>
                    <label className="form-check-label" htmlFor="friendsCheckbox">Friends Only</label>
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </div>
      
     
      <div className="container equal-container">
        <div className="row">
          {players.map((player) => (
            <div className="col-3 mb-4" key={player.id}>
              <div className="card" id="player-cards">
                <div className="card-body">
                  {player.photo ? (
                    <img src={player.photo} alt="Profile" className="player-picture mb-3 mx-auto d-block" />
                  ) : (
                    <img src="temp-profile.jpeg" alt="Profile" className="player-picture mb-3 mx-auto d-block" />
                  )}
                  <h5 className="card-title text-center"><Link to={`/players/${player.id}`}>{player.fname} {player.lname} ({player.gender})</Link></h5>
                  <div className="card-text" id="player-card-info">
                    <p>{player.game_pref} / {player.skill_lvl.toFixed(1)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}