import Map from "ol/Map.js";
import View from "ol/View.js";
import { GPX } from "ol/format.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import { Vector as VectorSource, XYZ } from "ol/source.js";

const key = "0yDoYUyzleSI5bGLBsWV";
const attributions =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

// Initialize the map
const map = new Map({
  layers: [
    new TileLayer({
      source: new XYZ({
        attributions: attributions,
        url:
          "https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=" + key,
        maxZoom: 20,
      }),
    }),
  ],
  target: "map",
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

// Fetch the GPX file
fetch("test.gpx") // Change to the path of your GPX file
  .then((response) => response.text())
  .then((data) => {
    // Parse the GPX data
    const format = new GPX();
    const features = format.readFeatures(data, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });

    // Create a vector source and layer
    const vectorSource = new VectorSource({
      features: features,
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    // Add the vector layer to the map
    map.addLayer(vectorLayer);

    // Fit the view to the extent of the GPX data
    map.getView().fit(vectorSource.getExtent());
  })
  .catch((error) => console.error("Error loading GPX file:", error));
