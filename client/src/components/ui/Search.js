import React from "react";
import { ApolloConsumer } from "react-apollo";
import { Link } from "react-router-dom";
import { SEARCH_USERS } from '../../graphql/queries';


class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      filter: "",
      empty: true
    }
  }

  searchUsers = async (client, filter) => {
    this.setState({ filter });
    if (filter.length === 0) {
      this.setState({ users: [], empty: true });
      return null;
    } else {
      this.setState({ empty: false });
      const { data } = await client.query({ 
        query: SEARCH_USERS, 
        variables: { filter } 
      });
      this.setState({ users: data.searchUsers})
    }
  }

  renderResults = client => {
    if (this.state.users.length > 0) {
      return this.state.users.map(user => {
        return (
          <Link 
            key={user._id} 
            to={`/users/${user._id}`} 
            onClick={() => this.searchUsers(client, "")}
          >
            <li className="search-result">
              <p>{user.username}</p>
            </li>
          </Link>
        )
      })
    } else if (this.state.empty !== true) {
      return <li className="results">No users found</li>
    }
  }

  render() {
    return (
      <ApolloConsumer>
        {(client) => {
          return (
            <div className="search">
                <input 
                  className="search-input" 
                  type="search" 
                  onChange={e => this.searchUsers(client, e.target.value)}
                  placeholder="Search" 
                />

                <ul className="search-results">
                  {this.renderResults(client)} 
                </ul>
            </div>
          )
        }}
      </ApolloConsumer>
    )
  }
}

export default Search;