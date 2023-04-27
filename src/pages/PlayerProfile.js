import { useLoaderData, useParams, Link } from 'react-router-dom'

export default function PlayerProfile() {
  const { id } = useParams();
  const player = useLoaderData()

  return (
    <div className="container">
        <div className="row">
            <div className="col-md-4">
               {/* <img src="public/placeholder.jpg" className="img-fluid"></img> */}
            </div>
            <div className="col-md-8">
                <h1>{ player.fname } { player.lname }</h1>
                <p>Gender: { player.gender }</p>
                <p>Skill Level: { player.skill_lvl }</p>
                <p>Game Preference: { player.game_pref }</p>
                <p>Join Date: { player.join_date }</p>
                {/* <p>Preferred Court: { player.pref_court.name }</p> */}
            </div>
        </div>
        TO UPDATE: NEED TO INCLUDE MAP WITH ALL COURT PREFS
        TO UPDATE: NEED TO SHOW PLAYER HISTORY

    <Link to={`/scheduler?player_id=${player.id}`}>Schedule a session</Link>
    </div>
  )
}

// data loader
export const PlayerProfileLoader = async ({ params }) => {
  const { id } = params

  const res = await fetch('http://localhost:5000/players/' + id)

  if (!res.ok) {
    throw Error('Could not find player.')
  }

  return res.json()
}