import React from 'react';
import { ApolloConsumer } from "react-apollo";
import { Link, withRouter } from 'react-router-dom';
import { CURRENT_USER } from "../../graphql/queries";
import Search from './Search';


class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null
    };
  }

  //decide if using Link of history.push is better
  render() {
    return (
      <nav className="nav">

        <div className="nav-logo">
          <Link to="/explore">
            <h1>Synthagram</h1>
          </Link>
        </div>

        <Search />

        <div className="nav-buttons">

          <button
            onClick={() => this.props.history.push("/post")}
            className="nav-button"
          >
            {/* Post */}
            <i className="far fa-plus-square"></i>
          </button>

          <button
            onClick={() => this.props.history.push("/explore")}
            className="nav-button"
          >
            {/* Explore */}
            <i className="far fa-compass"></i>
          </button>

          <ApolloConsumer>
            {client => {
              if (!this.state.currentUser) {
                client.query({ query: CURRENT_USER })
                  .then(({ data }) => {
                    this.setState({ currentUser: data.currentUser })
                  })
              }
              return (
                <button 
                  className="nav-button"
                  onClick={() => this.props.history.push(`/users/${this.state.currentUser}`)} 
                >
                  {/* Profile */}
                  <i className="far fa-user"></i>
                </button>
              )
            }}
          </ApolloConsumer>

          <ApolloConsumer>
            {client => (
              <button className="nav-button"
                onClick={e => {
                  e.preventDefault();
                  localStorage.removeItem("auth-token");
                  client.writeData({ data: { isLoggedIn: false } });
                  this.props.history.push("/login");
                }}
              >
                {/* Logout */}
                <i className="fas fa-sign-out-alt"></i>
              </button>
            )}
          </ApolloConsumer>
        </div>

      </nav>
    );
  }
};
export default withRouter(Nav);