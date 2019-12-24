import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { LOGIN_USER } from '../../graphql/mutations';
import { Link } from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      message: ''
    };
  }

  update(field) {
    return e => this.setState({ [field]: e.target.value });
  }

  updateCache(client, { data }) {
    client.writeData({
      data: { isLoggedIn: data.login.loggedIn, currentUser: data.login._id }
    });
  }

  handleSubmit = (e, loginUser) => {
    e.preventDefault();
    loginUser({
      variables: {
        username: this.state.username,
        password: this.state.password
      }
    });
  }

  render() {
    return (
      <Mutation
        mutation={LOGIN_USER}
        onCompleted={data => {
          const { token } = data.login;
          localStorage.setItem("auth-token", token);
          this.props.history.push("/feed");
        }}
        onError={err => this.setState({ message: err.message })}
        update={(client, data) => this.updateCache(client, data)}
      >
        {loginUser => {
          let message = this.state.message;
          let loginError;
          if (message) loginError = "auth-error-outline";
          if (message) message = "Invalid credentials";

          return (
            <div className="auth-div">

              <form 
                className="auth-form"
                onSubmit={e => this.handleSubmit(e, loginUser) }
              >

                <h1 className="auth-form-header">
                  Synthagram
                </h1>
  
                <input
                  value={this.state.username}
                  onChange={this.update("username")}
                  placeholder="Username"
                  className={`auth-input ${loginError}`}
                />
  
                <input
                  value={this.state.password}
                  onChange={this.update("password")}
                  type="password"
                  placeholder="Password"
                  className={`auth-input ${loginError}`}
                />
  
                <button className="auth-button">Log In</button>
                <p className="auth-error-messages">{message}</p>
              </form>

              <div className="auth-form-bottom">
                <p className="auth-form-text">
                  Don't have an account?     
                  <Link 
                    to="/register" 
                    className="auth-form-link"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          )
        }}
      </Mutation>
    );
  }
}

export default Login;