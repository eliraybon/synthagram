import React from 'react';
import { Mutation } from 'react-apollo';
import { UPDATE_COMMENT } from '../../graphql/mutations';

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

  handleSubmit = (e, updateComment) => {
    e.preventDefault();
    updateComment({
      variables: {
        id: this.props.commentId,
        body: this.state.body,
      }
    })
  }

  render() {
    return (
      <Mutation
        mutation={UPDATE_COMMENT}
      >
        {updateComment => (
          <form
            className='comment-form'
            onSubmit={e => this.handleSubmit(e, updateComment)}
          >

            <textarea
              className='form-input'
              value={this.state.body}
              onChange={this.update('body')}
              placeholder='Edit your comment'
            />

            <button className='comment-form-button'>
              Edit
            </button>

          </form>
        )}
      </Mutation>
    )
  }
}