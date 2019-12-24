import React from 'react';
import { Mutation } from '../../graphql/mutations';
//import follow and unfollow mutations

export default class UserIndexItem extends React.Component {
  render() {
    const { user } = this.props;

    return (
      <li>
        <p>{user.username}</p>
      </li>
    )
  }
}