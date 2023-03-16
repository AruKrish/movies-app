import React from "react";
import Joi from "joi-browser";
import Form from "./Form";
import * as userService from "../Services/userService";


class RegisterForm extends Form {
  state = {
    data: {
      username: "",
      password: "",
      name: "",
    },
    errors: {},
  };

  schema = {
    username: Joi.string().required().email().label("Username"),
    password: Joi.string().required().min(5).label("Password"),
    name: Joi.string().required().label("Name"),
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
    try{
    const response =  await userService.register(this.state.data);
      localStorage.setItem("token", response.headers['x-auth-token']);
      window.location="/";

    }catch(ex){
      if(ex.response && ex.response.status===400){
        const errors={...this.state.errors};
        errors.username=ex.response.data;
        this.setState({errors});
      }
    }
  };

  render() {
    return (
      <div>
        <form onSubmit={(e)=>this.handleSubmit(e)}>
          {this.renderInput("username", "Username", "text", "Enter Username")}
          {this.renderInput("password", "Password", "password", "Enter Password")}
          {this.renderInput("name", "Name", "text", "Enter Name")}
          {this.renderButton("Register")}
        </form>
      </div>
    );
  }
}
export default RegisterForm;
