import React from "react";
import { fetchPictures, getMyFavorites, addToFavorites } from "./fetchPictures";
import "./gallery.css";

var TYPES = ["gif,jpg,png", "gif", "jpg", "png", "liked"];

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      liked: new Set(),
      page: 0,
      imageType: "gif,jpg,png"
    };
  }

  componentDidMount = () => {
    this.fetchPhotos();
    this.fetchLiked();
  };

  componentDidUpdate(_, prevState) {
    const { page, imageType } = this.state;
    if (
      page !== prevState.page &&
      imageType === prevState.imageType &&
      imageType === "liked"
    ) {
      this.fetchLiked();
    } else if (page !== prevState.page && imageType === prevState.imageType) {
      this.fetchPhotos();
    }
  }

  fetchPhotos = () => {
    const { page, imageType } = this.state;
    fetchPictures({ page, imageType }).then((data) => {
      this.setState({ photos: data });
    });
  };

  fetchLiked = () => {
    const { page, liked } = this.state;
    getMyFavorites({ page }).then((data) => {
      data.forEach((photo) => {
        liked.add(photo.image_id);
      });
      this.setState({ photos: data, liked });
    });
  };

  handleTypeSelection = (e) => {
    this.setState({ imageType: e.target.value, page: 0 }, () => {
      if (this.state.imageType === "liked") {
        this.fetchLiked();
      } else {
        this.fetchPhotos();
      }
    });
  };

  handleLike = (imageId) => {
    return async () => {
      const res = await addToFavorites({ imageId });
      if (res.status === 200) {
        const liked = this.state.liked;
        liked.add(imageId);
        this.setState({ liked });
      }
    };
  };

  renderGallary = () => {
    const { photos, liked } = this.state;
    return (
      <div className="gallery">
        {photos.map((photo, idx) => (
          <div
            key={idx}
            className="gallery-item"
            onDoubleClick={this.handleLike(photo.id)}
          >
            <img src={photo.url ? photo.url : photo.image.url} alt="" />
            <div id="liked">
              {liked.has(photo.id) || liked.has(photo.image_id) ? "❤" : ""}
            </div>
          </div>
        ))}
      </div>
    );
  };

  renderTypeSelect = () => {
    const { imageType } = this.state;
    return (
      <div className="type-select-container">
        <label>
          Image Types:
          <select value={imageType} onChange={this.handleTypeSelection}>
            {TYPES.map((type, idx) => {
              return (
                <option key={idx} value={type}>
                  {type === "gif,jpg,png" ? "All Types" : type}
                </option>
              );
            })}
          </select>
        </label>
      </div>
    );
  };

  renderPagination = () => {
    const { page } = this.state;
    return (
      <div className="pagination-container">
        <button
          disabled={page === 0}
          onClick={() => this.setState({ page: page - 1 })}
        >
          Previous Page
        </button>
        <h2>{page + 1}</h2>
        <button onClick={() => this.setState({ page: page + 1 })}>
          Next Page
        </button>
      </div>
    );
  };

  render = () => {
    return (
      <div className="gallery-container">
        {this.renderTypeSelect()}
        {this.renderPagination()}
        {this.renderGallary()}
      </div>
    );
  };
}

export default Gallery;
