import { useLoaderData, Link } from 'react-router-dom'

export default function Courts(props) {
    const { loggedIn } = props;
    const courts = useLoaderData()
  
    return (
        <div className="container">
        <h1>Tennis Courts</h1>
        <h5>These tennis courts are public and provided by NYC parks. 
            Submit your court if you don't see it here!
        </h5>
        <table className="table table-striped align-middle mb-0 bg-white">
            <thead>
                <tr>
                    <th>Borough</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Phone</th>
                    <th>Court Count</th>
                    <th>Indoor/Outdoor</th>
                    <th>Surface</th>
                    <th>Accessible</th>
                </tr>
            </thead>
            <tbody>
              {courts.map((court) => (
                <tr key={court.id}>
                    <td>{ court.borough }</td>
                    <td><Link to={`/courts/${court.id}`}> { court.name } </Link></td>
                    <td>{ court.location }</td>
                    <td>{ court.phone }</td>
                    <td>{ court.court_count }</td>
                    <td>{ court.indoor_outdoor }</td>
                    <td>{ court.surface }</td>
                    <td>{ court.accessible }</td>
                </tr>
              ))}
            </tbody>
        </table>
    </div>
  )
  }

// data loader
export const CourtsLoader = async () => {

  const res = await fetch('http://localhost:5000/courts')
  
  if (!res.ok) {
    throw Error('Could not fetch the list of courts')
  }
  
  return res.json()
}