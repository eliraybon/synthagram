import React from 'react';
import CommentIndexItem from './CommentIndexItem';

export default class CommentIndex extends React.Component {
  render() {
    const { comments } = this.props;
    
    return (
      <ul className="comment-index">
        {comments.map(comment => {
          return <CommentIndexItem comment={comment} key={comment._id}/>
        })}
      </ul>
    )
  }
}