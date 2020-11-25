import React from "react";
import ReactDOM from "react-dom";
import Gallery from "./gallery/Gallery.react";
import "./styles.css";

function App() {
  return (
    <div>
      <h1>La Galerie des Chats</h1>
      <Gallery />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
