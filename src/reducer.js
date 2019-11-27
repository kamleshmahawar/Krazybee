import axios from 'axios';
export let actualData = [];

export const initialState = {
  albums: [],
  albumPhotos: {
    id: { photos: [] }
  }
}

export const reducerName = (state = { ...initialState }, action) => {
  switch (action.type) {
    case 'FETCH_ALBUM':
      return { ...state, sections: action.data };
    case 'FETCH_PHOTO':
      return {
        ...state, albumPhotos: {
          ...state.albumPhotos,
          [action.data.id]: { photos: action.data.photos }
        }
      };
    default:
      return state;
  }
}

export const fetchAlbums = () => {
  return (dispatch) =>
    axios.get('https://jsonplaceholder.typicode.com/albums').then((res) => {
      dispatch({ type: 'FETCH_ALBUM', data: res.data.slice(0, 10) })
    });
}

export const fetchPhotos = (id) => {
  return (dispatch) =>
    axios.get('https://jsonplaceholder.typicode.com/photos?albumId=' + id).then((res) => {
      dispatch({ type: 'FETCH_PHOTO', data: { id, photos: res.data } });
    });
}
