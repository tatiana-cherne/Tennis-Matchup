import { useLoaderData, useParams, Link } from 'react-router-dom';
import httpClient from "../httpClient"

export default function PlayerProfile(props) {
  const { loggedIn } = props;

  const { id } = useParams();
  const d = useLoaderData()

  const joinDate = new Date(d.player.join_date);
  const formattedDate = joinDate.toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="profile-page">
      <div className="photo-and-info">
        <div className="photo-and-buttons">
          <div className="profile-photo">
            {d.player.photo ? (
              <img 
                src={d.player.photo}
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
          <Link 
            className = "player-schedule-link"
            to={`/scheduler/${d.player.id}`}>
            Schedule a session
            </Link>
        </div>
        <div className="player-info">
              <h1>{ d.player.fname } { d.player.lname }</h1>
              <p>Gender: { d.player.gender }</p>
              <p>Skill Level: { d.player.skill_lvl.toFixed(1) }</p>
              <p>Game Preference: { d.player.game_pref }</p>
              <p>Join Date: { formattedDate }</p>
              <p>Preferred Court: {d.player.pref_court ? d.court.name : "TBD"}</p>
          </div>
      </div>
      <div className="container col-6">
        <h2 className="text-center mt-5 mb-3">Player Ratings</h2>
        <table className="table table-striped align-middle mb-0 bg-white" id="activity-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Skill Level Rating</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {d.ratings.map((r) => (
              <tr key={r.id}>
                <td>{new Date(r.created_at).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}</td>
                <td>{r.lvl_rating}</td>
                <td>{r.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    
  )
}

// data loader
export const PlayerProfileLoader = async ({ params }) => {
  const { id } = params;

  try {
    const response = await httpClient('http://localhost:5000/players/' + id);
    return response.data;
    
  } catch (error) {
    throw new Error('Could not find player.');
  }
}