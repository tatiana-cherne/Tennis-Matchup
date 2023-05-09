import { useState } from "react";

import {createBrowserRouter, 
  createRoutesFromElements,
  Route, 
  RouterProvider
} from 'react-router-dom'


// pages
import Home from './pages/Home'
import Players from './pages/Players'
import Signup from './pages/Signup'
import PlayerProfile, {PlayerProfileLoader} from './pages/PlayerProfile'
import Courts, {CourtsLoader} from './pages/Courts'
import CourtProfile, {CourtProfileLoader} from './pages/CourtProfile'
import Scheduler, {CourtsPlayersLoader} from './pages/Scheduler'
import Dashboard, {DashboardLoader} from './pages/Dashboard.js'
import Rating, {RatingLoader} from './pages/Rating'
import NotFound from './pages/NotFound'
// layouts
import RootLayout from './layouts/RootLayout'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}>
        <Route 
          index 
          element={<Home />} 
          />
        <Route 
          path="signup"
          element={<Signup />} 
          />
        <Route 
          path="players" 
          element={<Players loggedIn={loggedIn} />} 
          />
        <Route 
          path="courts" 
          element={<Courts loggedIn={loggedIn} />} 
          loader={CourtsLoader}
          />
        <Route 
          path="courts/:id" 
          element={<CourtProfile loggedIn={loggedIn} />}
          loader={CourtProfileLoader}
          />
        <Route 
          path="players/:id" 
          element={<PlayerProfile loggedIn={loggedIn} />}
          loader={PlayerProfileLoader}
          />
        <Route 
          path="scheduler/:id" 
          element={<Scheduler loggedIn={loggedIn} />}
          loader={CourtsPlayersLoader}
          />
         <Route 
          path="rating/:pid/:aid" 
          element={<Rating loggedIn={loggedIn} />}
          loader={RatingLoader}
          />
        <Route 
          path="dashboard" 
          element={<Dashboard loggedIn={loggedIn} />}
          loader={DashboardLoader}
          />
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return (
    <RouterProvider router={router} />
  );
}

export default App