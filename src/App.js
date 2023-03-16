import { Redirect, Route, Switch } from "react-router-dom";
import React, { Component } from "react";
import MovieDev from "./Components/MovieDev";
import NotFound from "./Components/NotFound";
import NavBar from "./Components/NavBar";
import MovieForm from "./Components/MovieForm";
import LoginForm from "./Components/LoginForm";
import RegisterForm from "./Components/RegisterForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import jwtDecode from "jwt-decode";
import Logout from "./Components/Logout";
import ProtectedRoute from "./Components/ProtectedRoute";

class App extends Component {
  state = {};

  componentDidMount() {
    try {
      const jwt = localStorage.getItem("token");
      const user = jwtDecode(jwt);
      this.setState({ user });
      console.log(user);
    } catch (ex) {}
  }

  render() {
    const { user } = this.state;
    return (
      <React.Fragment>
        <ToastContainer />
        <NavBar user={user} />
        <main className="container">
          <Switch>
            <Route path="/register" component={RegisterForm} />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <ProtectedRoute
              path="/movies/:id" component={MovieForm}
            />
            <Route
              path="/movies"
              render={(props) => <MovieDev {...props} user={user} />}
            ></Route>
            <Route path="/not-found" component={NotFound}></Route>
            <Redirect from="/" exact to="/movies" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
