import React from 'react';
import { Query } from 'react-apollo';
import { CURRENT_USER, FETCH_USER } from '../../graphql/queries';
import ThumbIndex from '../thumbnails/ThumbIndex';

export default class UserShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null
    };
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

          return (
            <Query
              query={FETCH_USER}
              variables={{ _id: this.props.match.params.userId }}
            >
              {({ loading, error, data }) => {

                if (loading) return null;
                if (error) return <p>Error</p>

                const { user } = data;

                return (
                  <div className="user-show">
                    <img                        //overly long link to mediocre image vvv
                      src={user.profileImg || 'https://us.123rf.com/450wm/burntime555/burntime5551505/burntime555150500105/40328001-music-note-flat-web-icon-or-sign-isolated-on-grey-background-collection-modern-trend-concept-design-.jpg?ver=6'}
                      width="100px"
                      height="100px"
                    />

                    <p>{user.username}</p>

                    <p>Posts: {user.photos.length}</p>
                    <p>Followers: {user.followers.length}</p>
                    <p>Followed: {user.followedUsers.length}</p>

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