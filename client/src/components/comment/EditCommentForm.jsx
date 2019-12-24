import React from 'react';
import { Mutation } from 'react-apollo';
import { UPDATE_COMMENT } from '../../graphql/mutations';
import { FEED } from '../../graphql/queries';

export default class EditCommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      body: this.props.comment.body
    };
  }

  update(field) {
    return e => this.setState({ [field]: e.currentTarget.value });
  }

  handleSubmit = (e, updateComment) => {
    e.preventDefault();
    debugger;
    updateComment({
      variables: {
        id: this.props.comment._id,
        body: this.state.body,
      }
    }).then(() => this.props.finishEdit())
  }

  render() {
    return (
      <Mutation
        mutation={UPDATE_COMMENT}
      >
        {updateComment => (
          <div>
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

            <button onClick={this.props.finishEdit}>
              Cancel
            </button>
          </div>
        )}
      </Mutation>
    )
  }
}