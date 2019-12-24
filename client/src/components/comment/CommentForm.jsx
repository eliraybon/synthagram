import React from 'react';
import { Mutation } from 'react-apollo';
import { NEW_COMMENT } from '../../graphql/mutations';
import { FEED } from '../../graphql/queries';

export default class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      body: ''
    };
  }

  update(field) {
    return e => this.setState({ [field]: e.currentTarget.value });
  }

  //refactor to use updateCache later 

  handleSubmit = (e, newComment) => {
    e.preventDefault();
    this.setState({ body: '' });
    newComment({
      variables: {
        body: this.state.body,
        author: this.props.currentUser,
        photo: this.props.photoId,
        parentComment: this.props.parentComment || null
      }
    })
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
          </div>
        )}
      </Mutation>
    )
  }
}