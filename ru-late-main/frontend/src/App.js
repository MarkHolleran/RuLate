import { BrowserRouter as Router, Routes as Switch, Route, Navigate } from "react-router-dom";
import Authenticated from './pages/Authenticated';
import Dashboard from "./pages/pages/dashboard";
import Routes from "./pages/pages/routes";
import Notifications from "./pages/pages/notifications";
import Settings from "./pages/pages/settings";
import Admin from "./pages/pages/admin";
import Unauthenticated from "./pages/Unauthenticated";
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from "./pages/Login";
import Logout from './pages/Logout';
import NotFound from './pages/NotFound';
import { StyledContainer } from "./components/Styles";

//manav code
import { useSelector } from 'react-redux';

//Our main controller for the RuLate React UI
const App = () => {
  //manav
  const user = useSelector((state) => state.user.user);
  var adminSelect=0
  if (user !== null){
    const { admin } = user;
    adminSelect=admin;
  }
  
  return (
    <StyledContainer>
      <Router>
        <Switch>
          {/* User must be logged in to access these routes */}
          <Route exact path="/dashboard" element={
            <Authenticated children={<Dashboard />} />
          } />
          <Route exact path="/routes" element={
            <Authenticated children={<Routes />} />
          } />
          <Route exact path="/notifications" element={
            <Authenticated children={<Notifications />} />
          } />
          <Route exact path="/settings" element={
            <Authenticated children={<Settings />} />
          } />
          {adminSelect ? (
          <Route exact path="/admin" element={
            <Authenticated children={<Admin />} />
          } />
          )
          :(<></>)}
          {/* User must be logged out to access these routes */}
          <Route exact path="/home" element={
            <Unauthenticated children={<Home />} />
          } />
          <Route exact path="/signup" element={
            <Unauthenticated children={<Signup />} />
          } />
          <Route exact path="/login" element={
            <Unauthenticated children={<Login />} />
          } />
          <Route exact path="/" element={
            <Navigate to="/home" />
          } />
          
          {/* User can always acccess these routes */}
          <Route exact path="/logout" element={
            <Logout />
          } />

          {/* 404 Not Found */}
          <Route path="*" element={
            <NotFound />
          }/>
        </Switch>
      </Router>
    </StyledContainer>
  );
}

export default App;