import React from 'react';
import $ from "jquery";
import { Query, Mutation } from 'react-apollo';
import { Link } from 'react-router-dom';
import { CURRENT_USER, FETCH_PHOTO } from '../../graphql/queries';
import { ADD_LIKE, REMOVE_LIKE, DELETE_PHOTO } from '../../graphql/mutations';
import CommentIndex from '../comment/CommentIndex';
import CommentForm from '../comment/CommentForm';

export default class PhotoShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tapped: false,
      parentComment: null
    };
  }

  handleTap = photoId => {
    if (this.state.tapped) {
      const likeButton = document.getElementById(`toggle-like-${photoId}`);
      likeButton.click();
      if (!likeButton.children[0].classList[2]) {
        $(`#just-liked-modal-${photoId}`).animate({ opacity: 1 }, 200);
        this.setState({ justLiked: true });

        setTimeout(() => {
          this.setState({ justLiked: false });
          $(`#just-liked-modal-${photoId}`).animate({ opacity: 0 }, 600);
        }, 1000);
      }
    } else {
      this.setState({ tapped: true });
      setTimeout(() => this.setState({ tapped: false }), 500);
    }
  }

  setReplyForm = parentComment => {
    this.setState({ parentComment });
  }

  cancelReply = () => {
    this.setState({ parentComment: null });
  }

  handleLike = (e, addLike) => {
    e.preventDefault();
    addLike({
      variables: {
        photoId: this.props.match.params.photoId,
        userId: this.state.currentUser
      }
    })
  }

  handleUnlike = (e, removeLike) => {
    e.preventDefault();
    removeLike({
      variables: {
        photoId: this.props.match.params.photoId,
        userId: this.state.currentUser
      }
    })
  }

  handleDelete = (e, deletePhoto) => {
    e.preventDefault();
    deletePhoto({
      variables: {
        photoId: this.props.match.params.photoId
      }
    })
  }

  renderLikeButton = (photo, currentUser) => {

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

  renderDeleteButton = (photo, currentUser) => {

    if (photo.user._id === currentUser) {
      return (
        <Mutation
          mutation={DELETE_PHOTO}
          // update={(cache, data) => this.updateCache(cache, currentUser, { data })}
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
              query={FETCH_PHOTO}
              variables={{ _id: this.props.match.params.photoId }}
            >
              {({ loading, error, data }) => {
                if (loading) return null;
                if (error) return <p>Error</p>
                const { photo } = data;

                return (
                  <div className="feed-index-item">
                    <div className="feed-item-top">
                      <div className="feed-item-profile-photo">
                        {/* <img /> */}
                      </div>
                      <p className="feed-item-username">{photo.user.username}</p>
                    </div>
                    <div className="feed-item-image-container">
                      <img
                        src={photo.photoUrl}
                      />
                      <div
                        id={`just-liked-modal-${photo._id}`}
                        className="just-liked-modal"
                        onClick={() => this.handleTap(photo._id)}
                      >
                        <i className="fas fa-music"></i>
                      </div>
                    </div>
                    <div className="feed-item-bottom">


                      <div className="feed-item-buttons">
                        <div className="feed-item-buttons-left">
                          {this.renderLikeButton(photo, currentUser)}
                          <button
                            onClick={() => this.props.history.push(`/photos/${photo._id}`)}
                          ><i className="fas fa-comment"></i>
                          </button>
                        </div>
                        {this.renderDeleteButton(photo, currentUser)}
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
                      setReplyForm={this.setReplyForm}
                    />

                    {this.state.parentComment && (
                      <CommentForm
                        currentUser={currentUser}
                        photoId={photo._id}
                        parentComment={this.state.parentComment || null}
                        cancelReply={this.cancelReply}
                      />
                    )}

                    {!this.state.parentComment && (
                      <CommentForm
                        currentUser={currentUser}
                        photoId={photo._id}
                        parentComment={this.state.parentComment || null}
                      />
                    )}
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