import React from 'react';
import UserIndexItem from './UserIndexItem';

export default class UserIndex extends React.Component {
  render() {
    const { users, currentUser } = this.props;

    if (!users) return null;

    return (
      <ul className="user-index">
        {users.map(user => {
          if (user._id === currentUser) return null;
          return (
            <UserIndexItem
              user={user}
              key={user._id}
            />
          )
        })}
      </ul>
    )
  }
}