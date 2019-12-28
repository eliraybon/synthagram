import React from 'react';
import { Mutation } from 'react-apollo';
import CommentIndex from './CommentIndex';
import EditCommentForm from './EditCommentForm';
import { DELETE_COMMENT } from '../../graphql/mutations';
import { FEED } from '../../graphql/queries';
import { Link } from 'react-router-dom';

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
      return (
        <EditCommentForm 
          comment={comment} 
          finishEdit={this.finishEdit}
        />
      )
    }

    return (
      <li className="comment">
        <p><Link className="comment-author" to={`/users/${comment.author._id}`}>{comment.author.username}</Link> {comment.body}</p>
        <div className="comment-buttons">
          <button onClick={() => this.props.setReplyForm(comment)}>
            Reply
          </button>

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
        </div>

        <CommentIndex 
          comments={this.props.comments} 
          context="comment" 
          commentId={comment._id}
          currentUser={currentUser}
          setReplyForm={this.props.setReplyForm}
        />
      </li>
    )
  }
}