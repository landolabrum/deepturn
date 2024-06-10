export interface IMapMarker {
  id: number; // Unique identifier for the marker
  name: string; // Name of the marker
  coordinates: [number, number]; // Geographical coordinates [longitude, latitude]
  path?: Array<{
    type: string; // Type of the feature, typically "Feature"
    geometry: {
      type: string; // Geometry type, usually "Point"
      coordinates: [number, number]; // Coordinates of the point
    };
    properties: {
      name: string; // Property name for the marker
    };
  }>; // Optional path array to track the marker's movement
}

export interface MarkerFeatureProperties {
  name: string;
}

export interface VesselFeature
  extends GeoJSON.Feature<GeoJSON.Point, MarkerFeatureProperties> { }

export default interface IMap {
  vessels?: IMapMarker[]
}