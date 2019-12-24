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
                  setReplyForm={this.props.setReplyForm}
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
            if (comment.parentComment._id === this.props.commentId) {
              return (
                <CommentIndexItem
                  comment={comment}
                  currentUser={currentUser}
                  setReplyForm={this.props.setReplyForm}
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