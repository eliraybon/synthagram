import React from 'react';
import CommentIndex from './CommentIndex';

export default class CommentIndexItem extends React.Component {
  render() {
    const { comment } = this.props;

    return (
      <li className="comment">
        <p>{comment.body}</p>
      </li>

      //each comment will have to render a comment index with their replies
      // <CommentIndex comments={comment.replies} />
    )

  }
}