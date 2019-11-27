import { connect } from 'react-redux';
import React, { Component } from 'react';
import Photo from '../componnents/Photo';
import { fetchPhotos } from '../reducer';

const labels = {
  'past': 'days ago',
  'future': 'days later',
  'live': 'live',
}
export class AlbumContainer extends Component {
  constructor() {
    super();
    this.toggleScrollIcons = this.toggleScrollIcons.bind(this);
    this.changeScrollPosition = this.changeScrollPosition.bind(this);
    this.state = {
      isVisibleLeftIcon: false,
      isVisibleRightIcon: false,
      showLoader: false,
    };
    this.boxContainer = {};
    this.scrollWidth = null;
    this.interval = null;
    this.setBoxContainerRef = ((box) => { this.boxContainer = box; });
  }

  componentDidMount() {
    this.loadPhotos();
    if (this.scrollWidth !== this.boxContainer.scrollWidth) {
      this.changeScrollPosition(false);
    }
  }

  loadPhotos() {
    const that = this;
    that.setState({ showLoader: true });
    const { album, dispatchFetchPhotos } = this.props;
    dispatchFetchPhotos(album.id).then(function () {
      that.setState({ showLoader: false });
    });
  }

  toggleScrollIcons() {
    const {
      scrollWidth,
      scrollLeft,
      offsetWidth,
    } = this.boxContainer;
    this.scrollWidth = scrollWidth;
    if (parseInt(scrollWidth, 10) <= offsetWidth) {
      this.setState({ isVisibleLeftIcon: false, isVisibleRightIcon: false });
    } else {
      if (scrollLeft === 0) {
        this.setState({ isVisibleLeftIcon: false });
      } else {
        this.setState({ isVisibleLeftIcon: true });
      }
      if (Math.ceil(scrollLeft + offsetWidth) === scrollWidth ||
        (Math.floor(scrollLeft + offsetWidth) === scrollWidth)) {
        this.setState({ isVisibleRightIcon: false });
      } else {
        this.setState({ isVisibleRightIcon: true });
      }
    }
  }

  changeScrollPosition(isScrollLeft) {
    const {
      totalScrollAmount,
      scrollAmountPerInterval,
      interval,
    } = this.props;
    let increment = 0;
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      if (increment + scrollAmountPerInterval >= totalScrollAmount) {
        clearInterval(this.interval);
      }
      const boxContainerRef = this.boxContainer;
      if (boxContainerRef) {
        boxContainerRef.scrollLeft = isScrollLeft ?
          boxContainerRef.scrollLeft - scrollAmountPerInterval :
          boxContainerRef.scrollLeft + scrollAmountPerInterval;
        increment = increment + scrollAmountPerInterval;
        if (increment >= totalScrollAmount ||
          boxContainerRef.scrollLeft === 0 ||
          boxContainerRef.scrollLeft + boxContainerRef.offsetWidth === this.scrollWidth
        ) {
          this.toggleScrollIcons();
        }
      } else {
        clearInterval(this.interval);
      }
    }, interval);
  }

  componentDidUpdate() {
    if (this.scrollWidth !== this.boxContainer.scrollWidth) {
      this.toggleScrollIcons(this.boxContainer);
      this.changeScrollPosition(true);
    }
  }

  render() {
    const {
      isVisibleLeftIcon,
      isVisibleRightIcon,
    } = this.state;
    const {
      album, albumPhotos
    } = this.props;
    return (
      <div className="album" key={album.id}>
        <div className="header">
          <h3>{album.title}</h3>
          <div>id: {album.id}, userid: {album.userId}</div>
        </div>
        <hr />
        <div className="crousel-container" >
          {isVisibleLeftIcon && <div className="left scroll" onClick={() => this.changeScrollPosition(true)}>
            <div>&lt;</div>
          </div>}
          <div class="crousel" ref={this.setBoxContainerRef}>
            {albumPhotos[album.id] && albumPhotos[album.id].photos.map(photo =>
              <Photo photo={photo} key={photo.id} />
            )}
          </div>
          {isVisibleRightIcon && <div className="right scroll" onClick={() => this.changeScrollPosition(false)}>
            <div>&gt; </div>
          </div>}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  albumPhotos: state.albumPhotos,
})

const mapDispatchToProps = {
  dispatchFetchPhotos: fetchPhotos,
}

export default connect(mapStateToProps, mapDispatchToProps)(AlbumContainer);



