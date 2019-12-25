import React from 'react';
import ThumbIndexItem from './ThumbIndexItem';

export default class ThumbIndex extends React.Component {
  render() {
    const { thumbs } = this.props;
    return (
      <div className="thumb-index-container">
      <ul className="thumb-index">
        {thumbs.map(thumb => {
          return (
            <ThumbIndexItem
              thumb={thumb}
              key={thumb._id}
            />
          )
        })}
        <li className="thumb-index-item-hidden"></li>
        <li className="thumb-index-item-hidden"></li>
      </ul>
      </div>
    )
  }
}