import React from 'react';
import { Mutation } from 'react-apollo';
import { REGISTER_USER } from '../../graphql/mutations';
import { Link } from 'react-router-dom';

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      message: ''
    };
  }

  update(field) {
    return e => this.setState({ [field]: e.currentTarget.value });
  }

  updateCache(cache, { data }) {
    console.log(data);
    cache.writeData({
      data: { isLoggedIn: data.register.loggedIn, currentUser: data.register._id }
    });
  }

  handleSubmit = (e, registerUser) => {
    e.preventDefault();
    console.log(this.state);
    registerUser({
      variables: {
        username: this.state.username,
        password: this.state.password
      }
    });
  }

  render() {
    return (
      <Mutation
        mutation={REGISTER_USER}
        onCompleted={data => {
          console.log(data)
          const { token } = data.register;
          localStorage.setItem("auth-token", token);
        }}
        onError={err => this.setState({ message: err.message })}
        update={(cache, data) => this.updateCache(cache, data)}
      >
        {registerUser => { 
          const message = this.state.message;
          let usernameError;
          let passwordError;

          if (message) {
            if (message.includes("Username")) usernameError = "auth-error-outline";
            if (message.includes("Password")) passwordError = "auth-error-outline";
          }

          return (
            <div className="auth-div">

              <form 
                className="auth-form"
                onSubmit={ e => this.handleSubmit(e, registerUser) }
              >

                <h1 className="auth-form-header">Synthagram</h1>

                <input
                  type="text"
                  value={this.state.username}
                  onChange={this.update("username")}
                  placeholder="Username"
                  className={`auth-input ${usernameError}`}
                />

                <input
                  type="password"
                  value={this.state.password}
                  onChange={this.update("password")}
                  placeholder="Password"
                  className={`auth-input ${passwordError}`}
                />

                <button className="auth-button">Sign Up</button>

                <p className="auth-error-messages">{this.state.message.slice(15)}</p>
              </form>

              <div className="auth-form-bottom">
                <p>Already have an account? 
                  <Link 
                    to="/"
                    className="auth-form-link"
                  >
                    Log In
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