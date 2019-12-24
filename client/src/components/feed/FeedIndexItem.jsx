import React from 'react';
import CommentIndex from '../comment/CommentIndex';
import { Mutation } from 'react-apollo';
import { ADD_LIKE, REMOVE_LIKE } from '../../graphql/mutations';

export default class FeedIndexItem extends React.Component {
  handleLike = (e, addLike) => {
    e.preventDefault();
    debugger;
    addLike({
      variables: {
        photoId: this.props.photo._id,
        userId: this.props.currentUser
      }
    })
  } 

  handleUnlike = (e, removeLike) => {
    e.preventDefault();
    removeLike({
      variables: {
        photoId: this.props.photo._id,
        userId: this.props.currentUser
      }
    })
  } 

  renderLikeButton = () => {
    const { photo, currentUser } = this.props;

    if (!photo.likes.includes(currentUser)) {
      return (
        <Mutation
          mutation={ADD_LIKE}
        >
          {addLike => (
            <button onClick={(e => this.handleLike(e, addLike))}>
              Like
            </button>
          )}
        </Mutation>
      )
    } else {
      return (
        <Mutation
          mutation={REMOVE_LIKE}
          variables={{ photoId: photo._id, userId: currentUser }}
        >
          {removeLike => (
            <button onClick={(e => this.handleLike(e, removeLike))}>
              Unlike
            </button>
          )}
        </Mutation>
      )
    }
  }


  render() {
    const { photo, currentUser } = this.props;
    // const rootComments = photo.comments.filter(comment => comment.parentComment === null);

    return (
      <li className="feed-index-item">
        <div className="feed-item-top">
          <div className="feed-item-profile-photo">
            {/* <img /> */}
          </div>
          <p className="feed-item-username">{photo.user.username}</p>
        </div>
        <img
          src={photo.photoUrl}
        />
        <div className="feed-item-bottom">
          <p className="feed-item-body">{photo.body}</p>

          {this.renderLikeButton()}

          <p className="feed-item-likes-count">{photo.likes.length} likes</p>
        </div>
        {/* <CommentIndex comments={rootComments} /> */}
      </li>
    )
  }
}