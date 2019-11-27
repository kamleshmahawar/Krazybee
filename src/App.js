import { connect } from 'react-redux';
import './sass/App.scss';
import React, { Component } from 'react';
import AlbumContainer from './containers/AlbumContainer';
import { fetchAlbums } from './reducer';

export class App extends Component {
  constructor() {
    super();
    this.state = {
      showLoader: false,
    };
  }

  componentDidMount() {
    this.loadAlbums();
  }

  loadAlbums() {
    var that = this;
    that.setState({ showLoader: true });
    that.props.dispatchFetch().then(function () {
      that.setState({ showLoader: false });
    });
  }

  render() {
    const { sections } = this.props;
    const { showLoader } = this.state;
    return (
      <div className="App">
        <div className="row">
          <h1>Photo Albums</h1>
          {showLoader && <div className="loader">
            <img src="./loader.gif" alt="Loading..." width="400" height="400" />
          </div>}
          <div className="main">
            {sections && sections.map(album =>
              <AlbumContainer
                album={album}
                key={album.id}
                totalScrollAmount={500}
                scrollAmountPerInterval={100}
                interval={70}
              />
            )}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  sections: state.sections,
})

const mapDispatchToProps = {
  dispatchFetch: fetchAlbums,
}

export default connect(mapStateToProps, mapDispatchToProps)(App);



