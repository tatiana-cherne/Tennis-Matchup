export default function Dashboard(props) {
    const { loggedIn } = props;
  
    return (
      <div className="dashboard">
        DASHBOARD
      </div>
  )
  }

//   const form = document.getElementById("profile-picture-form");
// const photoInput = document.getElementById("photo-input");
// const removePictureBtn = document.getElementById("remove-picture-btn");

// form.addEventListener("submit", event => {
//   event.preventDefault();

//   const formData = new FormData(form);

//   fetch("/upload_photo", {
//     method: "POST",
//     body: formData
//   })
//   .then(response => response.text())
//   .then(result => {
//     if (result.ok) {
//       // Reload the page to display the updated photo
//       location.reload();
//     } else {
//       console.error("Error uploading photo");
//     }
//   });
// });

// if (removePictureBtn) {
//   removePictureBtn.addEventListener("click", () => {
//     const playerId = {{ player.id }};

//     fetch(`/remove_photo/${playerId}`, {
//       method: "POST"
//     })
//     .then(response => response.text())
//     .then(result => {
//       if (result === "success") {
//         // Reload the page to remove the photo
//         location.reload();
//       } else {
//         console.error("Error removing photo");
//       }
//     });
//   });
// }



// function ProfilePicture() {
//   const [photo, setPhoto] = useState("static/images/temp-profile.jpeg");

//   const handleUploadPhoto = (event) => {
//     event.preventDefault();

//     const formData = new FormData(event.target);

//     fetch("/upload_photo", {
//       method: "POST",
//       body: formData
//     })
//       .then((response) => {
//         if (response.ok) {
//           return response.json();
//         } else {
//           throw new Error("Error uploading photo");
//         }
//       })
//       .then((data) => {
//         setPhoto(data.url);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   };

//   const handleRemovePhoto = (event) => {
//     event.preventDefault();

//     fetch(`/remove_photo/${player.id}`, {
//       method: "POST"
//     })
//       .then((response) => {
//         if (response.ok) {
//           return response.json();
//         } else {
//           throw new Error("Error removing photo");
//         }
//       })
//       .then((data) => {
//         setPhoto("static/images/temp-profile.jpeg");
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   };

//   return (
//     <div className="col-md-4">
//       {photo ? (
//         <img src={photo} alt="Profile Picture" className="profile-picture" />
//       ) : (
//         <img
//           src="static/images/temp-profile.jpeg"
//           alt="Default Profile Picture"
//           className="profile-picture"
//         />
//       )}
//       <form onSubmit={handleUploadPhoto}>
//         <input type="hidden" name="player_id" value={player.id} />
//         <div className="form-group">
//           <label htmlFor="photo">Upload Photo</label>
//           <input type="file" name="photo" className="form-control-file" />
//         </div>
//         <button type="submit" className="btn btn-primary">
//           Upload
//         </button>
//       </form>
//       <button onClick={handleRemovePhoto} className="btn btn-danger">
//         Remove
//       </button>
//     </div>
//   );
// }

// function PlayerInfo({ player }) {
//   return (
//     <div className="col-md-8">
//       <h1>
//         {player.fname} {player.lname}
//       </h1>
//       <p>Gender: {player.gender}</p>
//       <p>Skill Level: {player.skill_lvl}</p>
//       <p>Game Preference: {player.game_pref}</p>
//       <p>Join Date: {player.join_date}</p>
//       <p>Preferred Court: {player.pref_court_id}</p>
//     </div>
//   );
// }

// function App({ player }) {
//   return (
//     <div className="container">
//       <div className="row">
//         <ProfilePicture player={player} />
//         <PlayerInfo player={player} />
//       </div>
//     </div>
//   );
// }

// ReactDOM.render(<App />, document.getElementById("player-profile"));