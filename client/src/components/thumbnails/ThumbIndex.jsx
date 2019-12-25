import React from 'react';
import ThumbIndexItem from './ThumbIndexItem';

export default class ThumbIndex extends React.Component {
  render() {
    const { thumbs } = this.props;
    return (
      <ul className="thumb-index">
        {thumbs.map(thumb => {
          return (
            <ThumbIndexItem
              thumb={thumb}
              key={thumb._id}
            />
          )
        })}
      </ul>
    )
  }
}