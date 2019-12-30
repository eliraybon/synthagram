import React from "react";
import { ApolloConsumer } from "react-apollo";
import { Link } from "react-router-dom";
import { SEARCH_USERS } from '../../graphql/queries';
import _ from 'lodash';


class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      filter: "",
      empty: true,
      searching: false
    };
  }

  searchUsers = _.debounce(async (client, filter) => {
    if (filter.length === 0) {
      this.setState({ users: [], empty: true, filter });
      return null;
    } else {
      this.setState({ empty: false, searching: true });
      const { data } = await client.query({ 
        query: SEARCH_USERS, 
        variables: { filter } 
      });
      this.setState({ users: data.searchUsers, searching: false });
    }
  }, 50)

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
              <img
                src={user.profileImg}
                alt=""
              />
              <p>{user.username}</p>
            </li>
          </Link>
        )
      })
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
                  {!!this.state.users.length && (
                    this.renderResults(client).slice(0, 5)
                  )}
                </ul>
            </div>
          )
        }}
      </ApolloConsumer>
    )
  }
}

export default Search;