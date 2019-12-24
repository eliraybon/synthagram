import React from 'react';
import CommentIndex from '../comment/CommentIndex';

export default class FeedIndexItem extends React.Component {
  render() {
    const { photo } = this.props;
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

        <p>{photo.body}</p>

        <p>{photo.likes.length}</p>

        {/* <CommentIndex comments={rootComments} /> */}
      </li>
    )
  }
}