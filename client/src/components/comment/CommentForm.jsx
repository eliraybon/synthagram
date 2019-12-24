import React from 'react';
import { Mutation } from 'react-apollo';
import { NEW_COMMENT } from '../../graphql/mutations';
import { FEED } from '../../graphql/queries';

export default class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    let body = (props.parentComment) ? 
      '@' + props.parentComment.author.username : '';
    this.state = {
      body
    };
  }

  update(field) {
    return e => this.setState({ [field]: e.currentTarget.value });
  }

  //refactor to use updateCache later 

  handleSubmit = (e, newComment) => {
    e.preventDefault();
    const body = this.state.body.trim();
   
    let parentComment = (this.props.parentComment) ? 
      this.props.parentComment._id : null

    if (body) {
      this.setState({ body: '' });
      newComment({
        variables: {
          body: this.state.body,
          author: this.props.currentUser,
          photo: this.props.photoId,
          parentCommentId: parentComment
        }
      }).then(() => {
        if (this.props.cancelReply) this.props.cancelReply();
      })
    } else {
      //add error messages here 
      //this.setState({ message: "Comment cannot be empty"})
      return;
    }
  }

  render() {
    return (
      <Mutation
        mutation={NEW_COMMENT}
        refetchQueries={[
          {
            query: FEED,
            variables: { currentUserId: this.props.currentUser}
          }
        ]}
      >
        {newComment => (
          <div>
            <form
              className='comment-form'
              onSubmit={e => this.handleSubmit(e, newComment)}
            >

              <textarea
                className='form-input'
                value={this.state.body}
                onChange={this.update('body')}
                placeholder='Leave a comment'
              />

              <button className='comment-form-button'>
                Comment
              </button>
              
            </form>

            {this.props.parentComment && (
              <button onClick={this.props.cancelReply}>
                Cancel reply 
              </button>
            )}
          </div>
        )}
      </Mutation>
    )
  }
}