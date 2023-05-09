import { useLoaderData, useParams, Link, useNavigate } from 'react-router-dom'

import httpClient from "../httpClient";

export default function CourtProfile(props) {
  const { loggedIn } = props;
  const { id } = useParams();
  const data = useLoaderData()
  const navigate = useNavigate();
  console.log(data)

  const handleAddCourt = async (event) => {
    event.preventDefault();
    try {
      const response = await httpClient.post(
        'http://localhost:5000/add-court',
        { courtId: id }, 
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <div className="container">
      <div className="container text-center">
        <h1 className="mb-3">Court Profile</h1>
      </div>
      <div className="row justify-content-center">
        <div className="col-6">
          <div className="table-responsive">
            <table className="table table-bordered" id="court-table">
              <tbody>
                <tr>
                  <th>Borough:</th>
                  <td>{ data.court.borough }</td>
                </tr>
                <tr>
                  <th>Name:</th>
                  <td>{ data.court.name }</td>
                </tr>
                <tr>
                  <th>Location:</th>
                  <td>{ data.court.location }</td>
                </tr>
                <tr>
                  <th>Phone:</th>
                  <td>{ data.court.phone }</td>
                </tr>
                <tr>
                  <th>Court Count:</th>
                  <td>{ data.court.court_count }</td>
                </tr>
                <tr>
                  <th>Indoor/Outdoor:</th>
                  <td>{ data.court.indoor_outdoor }</td>
                </tr>
                <tr>
                  <th>Surface:</th>
                  <td>{ data.court.surface }</td>
                </tr>
                <tr>
                  <th>Accessible:</th>
                  <td>{ data.court.accessible }</td>
                </tr>
                <tr>
                  <th>Coordinates:</th>
                  <td>({ data.court.lat }, { data.court.long })</td>
                </tr>
              </tbody>
            </table> 
          </div>
          {loggedIn && !data.players.some(player => player.id === loggedIn.id) && (
            <div className="row justify-content-center my-4">
              <div className="col-6">
                <button 
                  className="btn btn-primary court-add-btn w-100" 
                  onClick={handleAddCourt}>
                  Add Court
                </button>
              </div>
            </div> 
          )}
        </div>
        <div className="container equal-container">
          <div className="row">
            {data.players.map((player) => (
              <div className="col-3 mb-4" key={player.id}>
                <div className="card" id="player-cards">
                  <div className="card-body">
                    {player.photo ? (
                      <img src={player.photo} alt="Profile" className="court-player-picture mb-3 mx-auto d-block" />
                    ) : (
                      <img src="temp-profile.jpeg" alt="Profile" className="court-player-picture mb-3 mx-auto d-block" />
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
    </div>
  )
}

// data loader
export const CourtProfileLoader = async ({ params }) => {
    const { id } = params
  
    const res = await fetch('http://localhost:5000/courts/' + id)
  
    if (!res.ok) {
      throw Error('Could not find court.')
    }
  
    return res.json()
  }