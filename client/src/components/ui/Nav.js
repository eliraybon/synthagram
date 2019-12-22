import React from 'react';
import { ApolloConsumer } from "react-apollo";
import { Link, withRouter } from 'react-router-dom';
import { CURRENT_USER } from "../../graphql/queries";


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

        <div className="search">
          <input 
            placeholder="Search"
          />
        </div>  

        <div className="nav-buttons">

          <button
            onClick={() => this.props.history.push("/post")}
            className="nav-button"
          >
            Post
          </button>

          <button
            onClick={() => this.props.history.push("/explore")}
            className="nav-button"
          >
            Explore
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
                  Profile
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
                  this.props.history.push("/");
                }}
              >
                Logout
              </button>
            )}
          </ApolloConsumer>
        </div>

      </nav>
    );
  }
};
export default withRouter(Nav);