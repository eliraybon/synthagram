import React from 'react';
import CommentIndex from '../comment/CommentIndex';
import CommentForm from '../comment/CommentForm';
import { Mutation } from 'react-apollo';
import { FEED } from '../../graphql/queries';
import { ADD_LIKE, REMOVE_LIKE, DELETE_PHOTO } from '../../graphql/mutations';
import { withRouter, Link } from 'react-router-dom';

class FeedIndexItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tapped: false
    };
  }

  handleTap = photoId => {
    if (this.state.tapped) {
      const likeButton = document.getElementById(`toggle-like-${photoId}`);
      likeButton.click();
      if (!likeButton.children[0].classList[2]) {
        this.setState({ justLiked: true });
        setTimeout(() => this.setState({ justLiked: false }) ,1000);
      }
    } else {
      this.setState({ tapped: true });
      setTimeout(() => this.setState({ tapped: false }), 500);
    }
  }

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
            <button 
              id={`toggle-like-${photo._id}`}
              onClick={(e => this.handleLike(e, addLike))}
            >
              <i className="fas fa-music"></i>
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
            <button 
              id={`toggle-like-${photo._id}`}
              onClick={(e => this.handleLike(e, removeLike))}
            >
              <i className="fas fa-music liked"></i>
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
              <i className="fas fa-trash-alt"></i>
            </button>
          )}
        </Mutation>
      )
    }
  }


  render() {
    const { photo, currentUser } = this.props;
    debugger;
    return (
      <li className="feed-index-item">
        <div className="feed-item-top">
          <div className="feed-item-profile-photo">
            {/* <img /> */}
          </div>
          <p className="feed-item-username">{photo.user.username}</p>
        </div>
        <img
          onClick={() => this.handleTap(photo._id)}
          src={photo.photoUrl}
        />
        <div className="feed-item-bottom">
          {this.state.justLiked && (
            <p>heart</p>
          )}
         
          <div className="feed-item-buttons">
            <div className="feed-item-buttons-left">
              {this.renderLikeButton()}
              <button 
                onClick={() => this.props.history.push(`/photos/${photo._id}`)}
              ><i className="fas fa-comment"></i>
              </button>
            </div>
            {this.renderDeleteButton()}
          </div>


          <p className="feed-item-likes-count">{photo.likes.length} likes</p>

          <div className="feed-item-body">
            <div className="feed-item-body-username">
              <Link to={`/users/${photo.user._id}`}>{photo.user.username}</Link>
            </div>
            {photo.body}
          </div>
        </div>
        <CommentIndex 
          comments={photo.comments} 
          context="photo" 
          currentUser={currentUser}
        />

        <CommentForm 
          currentUser={currentUser}
          photoId={photo._id}
        />
      </li>
    )
  }
}

export default withRouter(FeedIndexItem);