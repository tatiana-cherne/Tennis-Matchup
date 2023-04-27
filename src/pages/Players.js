import { useState, useEffect } from "react";
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
    // httpClient.get(url, {
    //   method: 'GET',
    //   credentials: 'include',
    //   mode:'cors'
    // })
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
    <div>
      <div className="container equal-container"> 
        <div className="header mb-3">
          <h1 className="mb-0">Tennis Players</h1>
        </div>
      </div>
      <div className="container">
        <div className="card mb-3">
          <div className="card-body">
            <form className="form-inline justify-content-around">
              
              <div className="form-group mb-2">
                <label className="mr-2">Gender:</label>
                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                  <label className="btn btn-outline-secondary btn-equal-width">
                    <input onFocus={handleGenderChange} type="checkbox" name="gender" value="M"/> Male
                  </label>
                  <label className="btn btn-outline-secondary btn-equal-width">
                    <input onFocus={handleGenderChange} type="checkbox" name="gender" value="F"/> Female
                  </label>
                </div>
              </div>
              
              <div className="form-group mb-2">
                <label className="mr-2">Skill Level:</label>
                <div className="btn-group btn-group-toggle" data-toggle="buttons">
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
                <div className="form-check mb-2">
                    <input checked={showFriends} onChange={handleCheckboxChange} className="form-check-input" type="checkbox" id="friendsCheckbox" name="friendsCheckbox"></input>
                    <label className="form-check-label" htmlFor="friendsCheckbox">Friends Only</label>
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </div>

      <div className="container equal-container">
        <table className="table table-striped align-middle mb-0 bg-white" id="players-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Skill Level</th>
              <th>Game Preference</th>
              <th>Join Date</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id}>
                <td><a href={`/players/${player.id}`}> { player.fname } { player.lname }</a></td>
                <td>{player.gender}</td>
                <td>{player.skill_lvl.toFixed(1)}</td>
                <td>{player.game_pref}</td>
                <td>{player.join_date.substring(0,4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}