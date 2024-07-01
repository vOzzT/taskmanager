import Home from './Home.jsx'
import Login from './Login.jsx';
import SignUp from './SignUp.jsx';
import Calendar from './Calendar.jsx';

import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
function App() {
 
    return (
      <Router>
        <Switch>

          <Route exact path = "/">
            <Home/>
          </Route>

          <Route path = "/login">
            <Login/>
          </Route>

          <Route path = "/signup">
            <SignUp/>
          </Route>
        
          <Route path = "/calendar">
            <Calendar/>
          </Route>

        </Switch>
      </Router>
    );
}

export default App

