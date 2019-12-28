import React from 'react';
import { withRouter } from "react-router-dom";

class ThumbIndexItem extends React.Component {
  render() {
    const { thumb } = this.props;

    return (
      <li className="thumb-index-item">
        <img 
          src={thumb.photoUrl} 
          onClick={() => this.props.history.push(`/photos/${thumb._id}`)} 
          alt=""
        />

        <div className="thumb-index-item-modal" onClick={() => this.props.history.push(`/photos/${thumb._id}`)}>
          <p><i className="fas fa-music"></i> {thumb.likes.length}</p>
          <p><i className="fas fa-comment"></i> {thumb.comments.length}</p>
        </div>
      </li>
    )
  }
}

export default withRouter(ThumbIndexItem);