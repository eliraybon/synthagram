import React from 'react';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import { Query, Mutation } from 'react-apollo';

import { CURRENT_USER, FEED, FETCH_USER } from '../../graphql/queries';
import { NEW_PHOTO } from '../../graphql/mutations';

export default class PhotoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      body: '',
      photoUrl: null,
      user: null,
      content: null,
      message: null,
      submitted: false
    };
  }

  handleSubmit = (e, newPhoto) => {
    e.preventDefault();
    if (this.state.submitted) return;
    this.setState({ submitted: true });
    if (this.state.content) {
      const formData = new FormData();
      formData.append('photo', this.state.content, this.state.content.name);

      axios.post('http://localhost:5000/files/upload', formData)
        .then(res => {

          this.setState({ photoUrl: res.data.photoUrl });
          newPhoto({
            variables: {
              body: this.state.body,
              photoUrl: this.state.photoUrl,
              user: this.state.user
            }
          }).then(() => {
              this.props.history.push('/feed');
            });
        })
    } else {
      this.setState({ message: "Please upload a photo" });
    }
  }

  updateCache(cache, newPhoto) {
    newPhoto = newPhoto.data.data.newPhoto;
    newPhoto.likes = [];

    let photos;
    try {
      photos = cache.readQuery({ 
        query: FEED,
        variables: {
          currentUserId: this.state.user
        }
      });
    } catch (err) {
      return;
    }

    if (photos) {
      let feed = photos.feed;
      cache.writeQuery({
        query: FEED,
        variables: { currentUserId: this.state.user },
        data: { feed: [newPhoto].concat(feed) }
      });
    }
  }

  update(field) {
    return e => this.setState({ [field]: e.currentTarget.value });
  }

  validateFile = file => {
    const validTypes = [
      'image/x-png',
      'image/png',
      'image/jpg',
      'image/jpeg',
      'image/gif'
    ];

    const fileSize = file.size;
    const fileType = file.type;
    if (fileSize > 1000000000) return false;
    if (!validTypes.includes(fileType)) return false;
    return true;
  }

  onDrop = async files => {
    const file = files[0]
    if (!this.validateFile(file)) {
      this.setState({ message: "Invalid file", previewImg: null, content: null });
      return;
    }

    this.setState({ content: file });
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      this.setState({ previewImg: reader.result })
    }, false)

    reader.readAsDataURL(file);
  }

  handleFile = e => {
    const file = e.target.files[0];
    this.setState({ content: file });
  }

  render() {
    return (
      <div className="photo-form-main">
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
              update={(cache, data) => this.updateCache(cache, { data })}
              refetchQueries={[
                {
                  query: FETCH_USER,
                  variables: { _id: this.state.user }
                }
              ]}
            >
              {newPhoto => (
                <form
                  className='photo-form'
                  onSubmit={e => this.handleSubmit(e, newPhoto)}
                  encType="multipart/form-data"
                >

                  <h2>Upload a Photo</h2>

                  
                  <div>
                  <Dropzone onDrop={this.onDrop}>
                    {({ getRootProps, getInputProps }) => (
                      <div {...getRootProps()} className="dropzone">
                        <input {...getInputProps()} />
                        { !this.state.content && (
                          <p>Drag and Drop Here</p>
                        )}

                        {this.state.previewImg && (
                          <img
                            src={this.state.previewImg}
                            className="preview-image"
                            alt=""
                          />
                        )}
                      </div>
                    )}
                  </Dropzone>

                  <textarea
                    className='form-input'
                    // type="text"
                    value={this.state.body}
                    onChange={this.update('body')}
                    placeholder='Caption this photo'
                  />
                  </div>

                  <button className='post-form-button'>
                    Post
                  </button>

                  <p>{this.state.message}</p>
                </form>
              )}
            </Mutation>
          )
        }}
      </Query>
      </div>
    )
  }
}