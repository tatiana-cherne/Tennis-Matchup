import { useState, useEffect } from "react";
import { useLoaderData, Link, useParams, useNavigate } from 'react-router-dom';
import httpClient from "../httpClient";

export default function Rating(props) {
  const { loggedIn } = props;
  const { pid, aid } = useParams();
  const data = useLoaderData();
  const navigate = useNavigate();
  console.log(data)

  const [formData, setFormData] = useState({
    playerId: pid,
    activityId: aid,
    rating: "",
    comments: "",
  });

  if (!loggedIn) {
    return (    
    <div className="d-flex justify-content-center align-items-center player-profile-unauth" >>
      <h2>Hi friend, to submit a rating please log in.</h2>
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
      const response = await httpClient.post("http://localhost:5000/submit-rating", formData, {
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
        <div className="col-9">
          <div className="card mt-4">
            <div className="card-header bg-secondary text-white text-center">
              <h4 className="mb-0">Submit a Rating</h4>
            </div>

            <div className="card-body">
              <form id="rating-form"onSubmit={handleSubmit}>
                <div className="player-rating-info">
                  <img 
                        src={data.player.photo}
                        alt="Profile"
                        className="rating-picture"
                      />
                  <div>
                    <h5 style={{ color: 'black' }}>Player: {data.player.fname} {data.player.lname}</h5>
                    <span> Currently rated { data.player.skill_lvl.toFixed(1) }</span>
                  </div>  
                </div>

                <div className="form-group">
                  <label htmlFor="rating">Rating: </label>
                  <div className="btn-group btn-group-toggle col-10" data-toggle="buttons">
                    <label className="btn btn-outline-secondary btn-equal-width">
                      <input 
                        type="radio" 
                        name="rating" 
                        value="2.5" 
                        onFocus={handleInputChange}
                        required
                        /> 2.5
                    </label>
                    <label className="btn btn-outline-secondary btn-equal-width">
                      <input 
                        type="radio" 
                        name="rating" 
                        value="3"
                        onFocus={handleInputChange}
                      /> 3
                    </label>
                    <label className="btn btn-outline-secondary btn-equal-width">
                      <input 
                        type="radio" 
                        name="rating" 
                        value="3.5"
                        onFocus={handleInputChange}
                      /> 3.5
                    </label>
                    <label className="btn btn-outline-secondary btn-equal-width">
                      <input 
                        type="radio" 
                        name="rating" 
                        value="4"
                        onFocus={handleInputChange}
                        /> 4
                    </label>
                    <label className="btn btn-outline-secondary btn-equal-width">
                      <input 
                        type="radio" 
                        name="rating" 
                        value="4.5"
                        onFocus={handleInputChange}
                      /> 4.5
                    </label>
                    <label className="btn btn-outline-secondary btn-equal-width">
                      <input 
                        type="radio" 
                        name="rating" 
                        value="5"
                        onFocus={handleInputChange}
                      /> 5
                    </label>
                  </div>
                  <div className="text-muted mt-3">
              </div>
                </div>
                <div className="form-group">
                  <label htmlFor="comments">Comments:</label>
                  <textarea 
                    id="comments" 
                    name="comments" 
                    className="form-control" 
                    onChange={handleInputChange}
                    required></textarea>
                </div>
                <button 
                type="submit" 
                className="btn btn-primary"
                onSubmit={handleSubmit}
                >Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}

// data loader
export const RatingLoader = async ({ params }) => {
  const { pid, aid } = params;

  try {
    const response = await httpClient('http://localhost:5000/players/' + pid);
    return response.data;
    
  } catch (error) {
    throw new Error('Could not find player.');
  }
}