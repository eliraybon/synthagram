import React from 'react';
import CommentIndexItem from './CommentIndexItem';

export default class CommentIndex extends React.Component {
  render() {
    const { comments, context, currentUser } = this.props;

    if (!comments) return null;

    if (context === "photo") {
      return (
        <ul className="comment-index">
          {comments.map(comment => {
            //you'll need to see what parentComment actually is 
            if (!comment.parentComment) {
              return (
                <CommentIndexItem 
                  comment={comment} 
                  currentUser={currentUser}
                  key={comment._id} 
                />
              )
            } else {
              return null;
            }
          })}
        </ul>
      )
    } else if (context === "comment") {
      return (
        <ul className="comment-index">
          {comments.map(comment => {
            //commentId will only be pased into props when a comment renders a comment index
            if (comment.parentComment._id === this.props.commentId) {
              return (
                <CommentIndexItem
                  comment={comment}
                  key={comment._id}
                />
              )
            } else {
              return null;
            }
          })}
        </ul>
      )
    } else {
      return null;
    }
  }
}