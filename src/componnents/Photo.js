import React from 'react';

function Photo(props) {
    const { photo } = props;
    return (
      <div className="photo">
          <div>
          {photo && <img src={photo.thumbnailUrl} />}
          </div>
          <div>
              <div className="elipsis padding-5">
              <strong>{photo && photo.title}</strong>
              </div>
              <div className="text-center">
               id: {photo && photo.id}
              </div>
          </div>
      </div>
    )
}
export default Photo;



