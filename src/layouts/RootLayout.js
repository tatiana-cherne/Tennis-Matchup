import { useState, useEffect } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import httpClient from "../httpClient"

export default function RootLayout(props) {
      const { loggedIn, setLoggedIn } = props;
      const [showPopup, setShowPopup] = useState(false);
      const [alertMessage, setAlertMessage] = useState("");
      const navigate = useNavigate();

      const handleLoginClick = () => {
          setShowPopup(true);
      };
      
      const handlePopupClose = () => {
          setShowPopup(false);
          setAlertMessage(false);
      };
      
      const handlePopupClick = (event) => {
          if (event.target === event.currentTarget) {
          setShowPopup(false);
          setAlertMessage(false);
          }
      };

      const handleEscapeKey = (event) => {
          if (event.keyCode === 27) {
          setShowPopup(false);
          setAlertMessage(false);
          }
      };
      
      const handleLoginFormSubmit = (event) => {
          event.preventDefault();
          const email = event.target.email.value;
          const password = event.target.password.value;
      
          // Send email, password, and rememberMe to server for authentication
          httpClient.post('http://localhost:5000/login', {
            email: email,
            password: password
          })
          .then(response => {
            if (response.status === 200) {
              // Authentication successful
              return response.data;
            } else {
              // Authentication failed
              setAlertMessage(<div className="alert alert-danger" role="alert">
                  Login failed. Please try again.
                </div>);
            }
          })
          .then(data => {
            const loginPopup = document.getElementById('login-popup');
            loginPopup.style.display = "none";
            setLoggedIn(data.id);
            setShowPopup(false);
            setAlertMessage(false);
            navigate("dashboard");
          })
          .catch(error => {
            console.error('Error:', error);
          });
      };

      const handleLogoutClick = () => {
          // Call the server to remove session cookies
          fetch('http://localhost:5000/logout')
          .then((response) => {
              if (response.ok) {
              setLoggedIn(false);
              navigate("/"); // redirect to home page after logout
              } else {
              console.error("Logout failed");
              }
          })
          .catch((error) => {
              console.error("Error:", error);
          });
      };
      
      useEffect(() => {
          const loginPopup = document.getElementById("login-popup");
          if (showPopup) {
          loginPopup.style.display = "block";
          }
          else {
          loginPopup.style.display = "none";
          }
      }, [showPopup]);

      useEffect(() => {
          document.addEventListener("keydown", handleEscapeKey);
          return () => {
          document.removeEventListener("keydown", handleEscapeKey);
          };
      }, []);


    return (
    <div className="root-layout">
      <header>
        <nav>
          <div className="nav-left">
            <img src="logo.jpg" alt="tennis ball" id="logo"/>
            <h1> Tennis Matchup </h1>
          </div>
          <div className="nav-right">
            <NavLink to="/">HOME</NavLink>
            <NavLink to="players">PLAYERS</NavLink>
            <NavLink to="courts">COURTS</NavLink>
            {loggedIn ? (
              <>
                <NavLink to="dashboard">DASHBOARD</NavLink>
                <button onClick={handleLogoutClick} id="logout-button">LOG OUT</button>
              </>
            ) : (
              <>
                <NavLink to="signup">SIGN UP</NavLink>
                <button onClick={handleLoginClick} id="login-button">LOG IN</button>
              </>
              )}
          </div>
        </nav>

        <div className="popup" onClick={handlePopupClick} id="login-popup">
          <div className="popup-content">
            {alertMessage}
            <button type="button" className="close" onClick={handlePopupClose}>&times;</button>
            <p className="popup-signup">If you are not already a member you can click <Link to="signup" onClick={handlePopupClick}>here</Link></p>
            <form onSubmit={handleLoginFormSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="text" className="form-control" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type="password" className="form-control" id="password" name="password" required />
              </div>
              <button type="submit" className="btn btn-primary">Login</button>
            </form>
            {/* Lost your email or password?
            Click <Link to="reset-password" onClick={handlePopupClick}>here</Link> to get them resent to your email address. */}
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}