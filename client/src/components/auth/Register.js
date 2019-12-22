import React from 'react';
import { Mutation } from 'react-apollo';
import { REGISTER_USER } from '../../graphql/mutations';

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
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
    registerUser({
      variables: {
        name: this.state.name,
        email: this.state.email,
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
          let nameError;
          let emailError;
          let passwordError;

          if (message) {
            if (message.includes("Email")) emailError = "auth-error-outline";
            if (message.includes("Name")) nameError = "auth-error-outline";
            if (message.includes("Password")) passwordError = "auth-error-outline";
          }

          return (
            <div className="auth-div">

              <form 
                className="auth-form"
                onSubmit={ e => this.handleSubmit(e, registerUser) }
              >

                <input 
                  type="text" 
                  value={this.state.name} 
                  onChange={this.update("name")}
                  placeholder="Name"
                  className={`auth-input ${nameError}`}
                />

                <input
                  type="text"
                  value={this.state.email}
                  onChange={this.update("email")}
                  placeholder="Email"
                  className={`auth-input ${emailError}`}
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
            </div>
          )
        }}
      </Mutation>
    );
  }
}