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
        <p>{photo.user.username}</p>

        <img
          src={photo.photoUrl}
        />

        <p>{photo.body}</p>

        <p>{photo.likes.length}</p>

        {this.renderLikeButton()}

        {/* <CommentIndex comments={rootComments} /> */}
      </li>
    )
  }
}