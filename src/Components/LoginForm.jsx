import React from "react";
import Joi from "joi-browser";
import Form from "./Form";
import * as authService from "../Services/authService";
import { Redirect } from "react-router-dom";

class LoginForm extends Form {
  state = {
    data: {
      username: "",
      password: "",
    },
    errors: {},
  };

  schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      const { data: jwt } = await authService.login(
        data.username,
        data.password
      );
      localStorage.setItem("token", jwt);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
        console.log("error", errors);
      }
    }
  };

  render() {
    if (authService.getCurrentUser()) return <Redirect to="/" />;

    return (
      <div>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          {this.renderInput("username", "Username", "text", "Enter Username")}
          {this.renderInput(
            "password",
            "Password",
            "password",
            "Enter Password"
          )}
          {this.renderButton("Login")}
        </form>
      </div>
    );
  }
}

export default LoginForm;
