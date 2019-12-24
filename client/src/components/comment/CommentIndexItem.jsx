import React from 'react';
import { Mutation } from 'react-apollo';
import CommentIndex from './CommentIndex';
import EditCommentForm from './EditCommentForm';

export default class CommentIndexItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    }
  }

  render() {
    const { comment, currentUser } = this.props;

    if (this.state.editing) {
      //you'll nedd to pass this a cancel edit function as well to set editing state to false
      return <EditCommentForm commentId={comment._ids} />
    }

    return (
      <li className="comment">
        <p>{comment.body}</p>

        <CommentIndex 
          comments={comment.replies} 
          context="comment" 
          commentId={comment._id}
        />
      </li>
    )
  }
}