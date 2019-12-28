import React from 'react';
import { Mutation } from 'react-apollo';
import { ADD_FOLLOW, REMOVE_FOLLOW } from '../../graphql/mutations';
import { Link } from 'react-router-dom';
import { FEED } from '../../graphql/queries';

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
              query: FEED,
              variables: {
                currentUserId: currentUser
              }
            }
          ]}
        >
          {addFollow => (
            <button
              className="follow-button"
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
          refetchQueries={[
            {
              query: FEED,
              variables: {
                currentUserId: currentUser
              }
            }
          ]}
        >
          {removeFollow => (
            <button
              className="follow-button"
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
          <img
            src={user.profileImg || 'https://us.123rf.com/450wm/burntime555/burntime5551505/burntime555150500105/40328001-music-note-flat-web-icon-or-sign-isolated-on-grey-background-collection-modern-trend-concept-design-.jpg?ver=6'}
            width="100px"
            height="100px"
            alt=""
          />
        </div>
        <Link to={`/users/${user._id}`}>
          <p className="user-index-item-username">{user.username}</p>
        </Link>

        {this.renderFollowButton()}
      </li>
    )
  }
}