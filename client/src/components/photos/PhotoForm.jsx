import React from 'react';
import axios from 'axios';
import { Query, Mutation } from 'react-apollo';

import { CURRENT_USER } from '../../graphql/queries';
import { NEW_PHOTO } from '../../graphql/mutations';

export default class PhotoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      body: '',
      photoUrl: null,
      user: null
    };
  }

  handleSubmit = (e, newPhoto) => {
    e.preventDefault();
    if (this.state.content) {
      const formData = new FormData();
      formData.append('photo', this.state.content, this.state.content.name);
      debugger;
      axios.post('http://localhost:5000/files/upload', formData)
        .then(res => {
          debugger;
          this.setState({ photoUrl: res.data.photoUrl });
          newPhoto({
            variables: {
              body: this.state.body,
              photoUrl: this.state.photoUrl,
              user: this.state.user
            }
          }).then(() => {
              this.props.history.push('/explore');
            });
        })
    } else {
      this.props.processForm(this.state)
        .then(() => {
          this.props.history.push('/explore')
        });
    }
  }

  update(field) {
    return e => this.setState({ [field]: e.currentTarget.value });
  }

  handleFile = e => {
    const file = e.target.files[0];
    this.setState({ content: file });
  }

  render() {
    return (
      <Query
        query={CURRENT_USER}
        onCompleted={data => this.setState({ user: data.currentUser })}
      >

        {({ loading, error, data }) => {

          if (loading) return null;
          if (error) return <p>Error</p>

          return (
            <Mutation
              mutation={NEW_PHOTO}
            >
              {newPhoto => (
                <form
                  className='photo-form'
                  onSubmit={e => this.handleSubmit(e, newPhoto)}
                  encType="multipart/form-data"
                >

                  <h2>Photo Upload</h2>

                  <input
                    className='form-input'
                    type="text"
                    value={this.state.body}
                    onChange={this.update('body')}
                    placeholder='Body'
                  />


                  <input
                    className='post-media-input'
                    type="file"
                    onChange={this.handleFile}
                  />

                  <button className='post-form-button'>
                    Post
                  </button>
                </form>
              )}
            </Mutation>
          )
        }}
      </Query>
    )
  }
}