import React from 'react';

export default class ThumbIndexItem extends React.Component {
  render() {
    const { thumb } = this.props;
    return (
      <li className="thumb-index-item">
        <img src={thumb.photoUrl} />

        <div>
          <p>{thumb.likes.length} Likes</p>
          <p>{thumb.comments.length} Comments</p>
        </div>
      </li>
    )
  }
}