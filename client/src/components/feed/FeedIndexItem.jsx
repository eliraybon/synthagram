import React from 'react';
import CommentIndex from '../comment/CommentIndex';
import { Mutation } from 'react-apollo';
import { FEED } from '../../graphql/queries';
import { ADD_LIKE, REMOVE_LIKE, DELETE_PHOTO } from '../../graphql/mutations';
import { withRouter } from 'react-router-dom';

class FeedIndexItem extends React.Component {
  handleLike = (e, addLike) => {
    e.preventDefault();
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

  handleDelete = (e, deletePhoto) => {
    e.preventDefault();
    deletePhoto({
      variables: {
        photoId: this.props.photo._id
      }
    })
  }

  updateCache(cache, currentUser, deletedPhoto) {
    deletedPhoto = deletedPhoto.data.data.deletePhoto;

    let photos;
    try {
      photos = cache.readQuery({
        query: FEED,
        variables: {
          currentUserId: currentUser
        }
      });
    } catch (err) {
      return;
    }

    if (photos) {
      let feed = photos.feed;
      const newFeed = feed.filter(photo => photo._id !== deletedPhoto._id);
      debugger;
      cache.writeQuery({
        query: FEED,
        variables: { currentUserId: currentUser },
        data: { feed: newFeed }
      });
    }
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

  renderDeleteButton = () => {
    const { photo, currentUser } = this.props;
    if (photo.user._id === currentUser) {
      return (
        <Mutation
          mutation={DELETE_PHOTO}
          update={(cache, data) => this.updateCache(cache, currentUser, { data })}
          // refetchQueries={[
          //   {
          //     query: FEED,
          //     variables: {
          //       currentUserId: this.props.currentUser
          //     }
          //   }
          // ]}
        >
          {deletePhoto => (
            <button onClick={(e => this.handleDelete(e, deletePhoto))}>
              Delete
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

          <div className="feed-item-buttons">
            {this.renderLikeButton()}
            <button 
              onClick={() => this.props.history.push(`/photos/${photo._id}`)}
              >Comment
            </button>
            {this.renderDeleteButton()}
          </div>


          <p className="feed-item-likes-count">{photo.likes.length} likes</p>
        </div>
        {/* <CommentIndex comments={rootComments} /> */}
      </li>
    )
  }
}

export default withRouter(FeedIndexItem);