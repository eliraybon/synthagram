import React from 'react';
import { Mutation } from 'react-apollo';
import CommentIndex from './CommentIndex';
import EditCommentForm from './EditCommentForm';
import { DELETE_COMMENT } from '../../graphql/mutations';
import { FEED } from '../../graphql/queries';

export default class CommentIndexItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };
  }

  handleDelete = (e, deleteComment) => {
    e.preventDefault();
    deleteComment({
      variables: {
        commentId: this.props.comment._id
      }
    })
  }

  finishEdit = () => {
    this.setState({ editing: false });
  }

  render() {
    const { comment, currentUser } = this.props;

    if (this.state.editing) {
      //you'll nedd to pass this a cancel edit function as well to set editing state to false
      return (
        <EditCommentForm 
          comment={comment} 
          finishEdit={this.finishEdit}
        />
      )
    }

    return (
      <li className="comment">
        <p>{comment.author.username} {comment.body}</p>

        {(comment.author._id === currentUser) && (
          <Mutation
            mutation={DELETE_COMMENT}
            refetchQueries={[
              {
                query: FEED,
                variables: {
                  currentUserId: currentUser
                }
              }
            ]}
          >
            {(deleteComment => {
              return (
                <button
                  onClick={e => this.handleDelete(e, deleteComment)}
                >
                  Delete
              </button>
              )
            })}
          </Mutation>
        )}

        {(comment.author._id === currentUser) && (
          <button onClick={() => this.setState({ editing: true })}>
            Edit
          </button>
        )}

        <CommentIndex 
          comments={comment.replies} 
          context="comment" 
          commentId={comment._id}
        />
      </li>
    )
  }
}