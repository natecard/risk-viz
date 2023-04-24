'use client'
import { Map, Layer, Source, LayerProps, MapRef } from "react-map-gl";
import { useEffect, useState, useRef } from "react";
import { GeoJSON, Feature } from '../api/data/route';
const apiKey: string = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

  
export default async function DataMap(){
console.log("DataMap rendered");
 const [data, setData] = useState<GeoJSON | any | null>(null)
 const mapRef = useRef<MapRef|null>(null);
//lat and lng set to Toronto on initialization
//TODO Set up map data layer and points
useEffect(() => {
  getData();
  console.log(mapRef);
}, []);
useEffect(() => {
  getData();
}, []);

const getData = () => {
  fetch("/api/data/")
    .then((response) => response.json())
    .then((data) => setData(data))
    .catch((error) => console.log(error));
};
 console.log(data);
 const layerData: LayerProps = {
   id: 'Point',
   type: 'circle',
   paint: {
     'circle-radius': 10,
     'circle-color': '#007cbf',
   },
 };

    return (
        <Map
            ref={mapRef}
            reuseMaps
            initialViewState={{
            longitude: -79.36,
            latitude: 43.65,
            zoom: 6}}
            mapStyle="mapbox://styles/mapbox/light-v11"
            style={{width: "100vw", height: "60vh"}}
            mapboxAccessToken={apiKey}
        >
            {data && (
            <Source type="geojson" data={data}>
                <Layer {...layerData} />
            </Source>)}
        </Map>
    );
}