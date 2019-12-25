import React from 'react';
import { Mutation } from 'react-apollo';
import { ADD_FOLLOW, REMOVE_FOLLOW } from '../../graphql/mutations';
import { EXPLORE_USERS } from '../../graphql/queries';

export default class UserIndexItem extends React.Component {

  handleFollow = (e, addFollow) => {
    e.preventDefault();
    addFollow({
      variables: {
        followingId: this.props.user._id,
        userId: this.props.currentUser
      }
    })
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
    let followed = false; 
    followers.forEach(follower => {
      if (follower._id === currentUser) {
        followed = true;
      }
    })
    return followed;
  }

  renderFollowButton = () => {
    const { user, currentUser } = this.props;

    if (!this.followed(user.followers, currentUser)) {
      return (
        <Mutation
          mutation={ADD_FOLLOW}
          refetchQueries={[
            {
              query: EXPLORE_USERS
            }
          ]}
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
      <li key={`user-index-item-${user._id}`} className="user-index-item">
        <div className="user-index-pfp-container">
          {/* <img /> */}
        </div>
        <p className="user-index-item-username">{user.username}</p>
        {this.renderFollowButton()}
      </li>
    )
  }
}