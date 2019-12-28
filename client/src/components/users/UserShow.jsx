import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { CURRENT_USER, FETCH_USER, FEED } from '../../graphql/queries';
import { ADD_FOLLOW, REMOVE_FOLLOW } from '../../graphql/mutations';
import ThumbIndex from '../thumbnails/ThumbIndex';

export default class UserShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      currentUser: null
    };
  }

  handleFollow = (e, addFollow) => {
    e.preventDefault();
    addFollow({
      variables: {
        followingId: this.props.match.params.userId,
        userId: this.state.currentUser
      }
    })
  }

  handleUnfollow = (e, removeFollow) => {
    e.preventDefault();
    removeFollow({
      variables: {
        unfollowingId: this.props.match.params.userId,
        userId: this.state.currentUser
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
    if (this.props.match.params.userId === this.state.currentUser) return null;
    return (
      <Mutation
        mutation={ADD_FOLLOW}
        refetchQueries={[
          {
            query: FEED,
            variables: { currentUserId: this.state.currentUser }
          }
        ]}
      >
        {addFollow => (
          <button
            onClick={(e => this.handleFollow(e, addFollow))}
            className="follow-button"
          >
            Follow
            </button>
        )}
      </Mutation>
    )
  }

  renderUnfollowButton = () => {
    if (this.props.match.params.userId === this.state.currentUser) return null;
    return (
      <Mutation
        mutation={REMOVE_FOLLOW}
        refetchQueries={[
          {
            query: FEED,
            variables: { currentUserId: this.state.currentUser }
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

  render() {
    return (
      <Query 
        query={CURRENT_USER}
        onCompleted={data => this.setState({ currentUser: data.currentUser })}
      >
        {({ loading, error, data }) => {

          if (loading) return null;
          if (error) return <p>Error</p>

          const { currentUser } = data;

          return (
            <Query
              query={FETCH_USER}
              variables={{ _id: this.props.match.params.userId }}
              onCompleted={data => this.setState({ user: data.user })}
            >
              {({ loading, error, data }) => {

                if (loading) return null;
                if (error) return <p>Error</p>

                const { user } = data;

                return (
                  <div className="user-show">
                    <div className="user-show-top">
                      <div className="user-show-top-main">
                        <div className="user-show-pfp-container">
                          <img                        //overly long link to mediocre image vvv
                            src={user.profileImg || 'https://us.123rf.com/450wm/burntime555/burntime5551505/burntime555150500105/40328001-music-note-flat-web-icon-or-sign-isolated-on-grey-background-collection-modern-trend-concept-design-.jpg?ver=6'}
                            width="100px"
                            height="100px"
                            alt=""
                          />
                        </div>
                        <div className="user-show-top-info">
                          <p className="user-show-username">{user.username}</p>

                          {(!this.followed(user.followers, currentUser)) ? 
                            this.renderFollowButton() : this.renderUnfollowButton()
                          }
                        </div>
                      </div>
                      <div className="user-show-stats">
                        <p>Posts: {user.photos.length}</p>
                        <p>Followers: {user.followers.length}</p>
                        <p>Followed: {user.followedUsers.length}</p>
                      </div>
                    </div>

                    <ThumbIndex thumbs={user.photos} />
                  </div>
                )
              }}
            </Query>
          )
        }}
      </Query>
    )
  }
}