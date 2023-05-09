import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [alertMessage, setAlertMessage] = useState("");

  const [formData, setFormData] = useState({
    fname: "",
    lname:"",
    matchPrac: "",
    signUpEmail: "",
    signUpPassword: "",
    gender: "",
    skillLevel: "",
    gamePref: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('http://localhost:5000/welcome', {
      method: "POST",
      credentials: 'include',
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
        navigate("/");
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlertMessage(<div className="alert alert-danger" role="alert">
            Email already in use. Please enter a different email.
          </div>);
      });
  };


  return (
    <div className="container mt-5 col-6">
      <div className="card">
      <div className="card-header bg-secondary text-white text-center">
          <h3>Sign up to match up</h3>
        </div>
        <div className="card-body">
          {alertMessage}
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-6 form-group">
                <input
                  type="text"
                  className="form-control form-control"
                  name="fname"
                  placeholder="First Name"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-6 form-group">
                <input
                  type="text"
                  className="form-control form-control"
                  name="lname"
                  placeholder="Last Name"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-control form-control"
                name="signUpEmail"
                id="sign-up-email"
                placeholder="Email"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control form-control"
                name="signUpPassword"
                id="sign-up-password"
                placeholder="Password"
                pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{12,}$"
                title="sign-up-password must contain at least 12 characters, one uppercase letter, one lowercase letter and one number"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="row">
              <div className="col">
                <div className="form-group d-inline-block">
                  <label>Gender</label>
                  <br />
                  <div
                    className="btn-group btn-group-toggle"
                    data-toggle="buttons"
                  >
                    <label className="btn btn-outline-secondary btn-equal-width">
                      <input
                        type="radio"
                        name="gender"
                        id="female"
                        value="F"
                        onFocus={handleInputChange}
                        required
                      />
                      Female
                    </label>
                    <label className="btn btn-outline-secondary btn-equal-width">
                      <input
                        type="radio"
                        name="gender"
                        id="male"
                        value="M"
                        onFocus={handleInputChange}
                      />
                      Male
                    </label>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="form-group d-inline-block">
                  <label htmlFor="skillLevel">Skill Level</label>
                  <select 
                    className="btn btn-outline-secondary form-control form-control" 
                    name="skillLevel" 
                    id="skillLevel"
                    onChange={handleInputChange} 
                    required>
                      <option value="" disabled selected hidden>
                        Select skill
                      </option>
                      <option>2.5</option>
                      <option>3.0</option>
                      <option>3.5</option>
                      <option>4.0</option>
                      <option>4.5</option>
                      <option>5.0</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label>Game Preference</label>
                  <br/>
                  <div className="btn-group btn-group-toggle" data-toggle="buttons">
                    <label className="btn btn-outline-secondary btn-equal-width">
                      <input 
                      type="radio" 
                      name="gamePref" 
                      id="singles" 
                      value="Singles" 
                      onFocus={handleInputChange}
                      required/> Singles
                    </label>
                    <label className="btn btn-outline-secondary btn-equal-width">
                      <input 
                      type="radio" 
                      name="gamePref" 
                      id="doubles" 
                      value="Doubles"
                      onFocus={handleInputChange}
                      /> Doubles
                    </label>
                    <label className="btn btn-outline-secondary btn-equal-width">
                      <input 
                      type="radio" 
                      name="gamePref" 
                      id="both-game" 
                      value="Both"
                      onFocus={handleInputChange}
                      /> Both
                    </label>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label>Competition Type</label>
                  <br/>
                  <div className="btn-group btn-group-toggle" data-toggle="buttons">
                    <label className="btn btn-outline-secondary btn-equal-width">
                      <input 
                      type="radio" 
                      name="matchPrac" 
                      id="practice" 
                      value="Practice" 
                      onFocus={handleInputChange}
                      required
                      /> Practice
                    </label>
                    <label className="btn btn-outline-secondary btn-equal-width">
                      <input 
                      type="radio" 
                      name="matchPrac" 
                      id="match" 
                      value="Match"
                      onFocus={handleInputChange}
                      /> Matches 
                    </label>
                    <label className="btn btn-outline-secondary btn-equal-width">
                      <input 
                      type="radio" 
                      name="matchPrac" 
                      id="both-comp" 
                      value="Both"
                      onFocus={handleInputChange}
                      /> Both 
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <br/>
            <div className="row">
              <button 
              type="submit" 
              className="btn btn-primary sign-up-btn mx-auto col-6"
              onSubmit={handleSubmit}
              >Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}