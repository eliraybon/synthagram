import React from 'react';
import { Mutation } from 'react-apollo';
import { ADD_FOLLOW, REMOVE_FOLLOW } from '../../graphql/mutations';

export default class UserIndexItem extends React.Component {

  handleFollow = (e, addFollow) => {
    e.preventDefault();
    debugger;
    addFollow({
      variables: {
        followingId: this.props.user._id,
        userId: this.props.currentUser
      }
    }).then(() => console.log('whaaat?'))
  }

  handleUnfollow = (e, removeFollow) => {
    e.preventDefault();
    removeFollow({
      variables: {
        unfollowingId: this.props.user._id,
        userId: this.props.currentUser
      }
    })
  }

  followed = (followers, currentUser) => {
    followers.forEach(follower => {
      if (follower._id === currentUser) {
        return true;
      }
    })
    return false;
  }

  renderFollowButton = () => {
    const { user, currentUser } = this.props;

    if (!this.followed(user.followers, currentUser)) {
      return (
        <Mutation
          mutation={ADD_FOLLOW}
        >
          {addFollow => (
            <button
              onClick={(e => this.handleFollow(e, addFollow))}
            >
              Follow
            </button>
          )}
        </Mutation>
      )
    } else {
      return (
        <Mutation
          mutation={REMOVE_FOLLOW}
        >
          {removeFollow => (
            <button
              onClick={(e => this.handleUnfollow(e, removeFollow))}
            >
              Unfollow
            </button>
          )}
        </Mutation>
      )
    }
  }

  render() {
    const { user } = this.props;

    return (
      <li>
        <p>{user.username}</p>
        {this.renderFollowButton()}
      </li>
    )
  }
}