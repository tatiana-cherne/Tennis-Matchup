import { useLoaderData, useParams, Link } from 'react-router-dom'

export default function CourtProfile() {
  const { id } = useParams();
  const court = useLoaderData()

  return (
    <div class="container mt-5">
    <h1>Court Profile</h1>
    <table class="table table-bordered">
      <tbody>
        <tr>
          <th>Borough:</th>
          <td>{ court.borough }</td>
        </tr>
        <tr>
          <th>Name:</th>
          <td>{ court.name }</td>
        </tr>
        <tr>
          <th>Location:</th>
          <td>{ court.location }</td>
        </tr>
        <tr>
          <th>Phone:</th>
          <td>{ court.phone }</td>
        </tr>
        <tr>
          <th>Court Count:</th>
          <td>{ court.court_count }</td>
        </tr>
        <tr>
          <th>Indoor/Outdoor:</th>
          <td>{ court.indoor_outdoor }</td>
        </tr>
        <tr>
          <th>Surface:</th>
          <td>{ court.surface }</td>
        </tr>
        <tr>
          <th>Accessible:</th>
          <td>{ court.accessible }</td>
        </tr>
      </tbody>
    </table> 
    {/* <h2>Preferred Players</h2>
    <ul>
      {% for player in court.pref_players %}
        <li>{{ player.fname }} {{ player.lname }}</li>
      {% endfor %}
    </ul>
    <h2>Players</h2>
    <ul>
      {% for player in court.players %}
        <li>{{ player.name }}</li>
      {% endfor %}
    </ul>
    <h2>Activities</h2>
    <ul>
      {% for activity in court.activities %}
        <li>{{ activity.date }}</li>
      {% endfor %}
    </ul> */}
    <Link to="/scheduler">Schedule a session</Link>  
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