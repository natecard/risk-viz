'use client'
import { Map, Layer, Source, LayerProps } from "react-map-gl";
import { useEffect, useState } from "react";
import { GeoJSON, Feature } from "../api/data/route";
import { pointStyle } from "./mapStyle";
const apiKey: string = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

  
export default async function DataMap(){
 const [data, setData] = useState<GeoJSON | any | null>(null)
//lat and lng set to Toronto on initialization
//TODO Set up map data layer and points
 useEffect(() => {
    async function getData(){
   const request = await fetch("/api/data")
   const response = await request.json();
    const data = await response;
    setData(data)
    console.log(data)
    }
    getData();
 },);
 console.log(data);
 const layerData: LayerProps = {
        id: "point",
        type: "circle",
        paint: {
            "circle-radius": 10,
            "circle-color": "#007cbf",
  },
 }

    return (
        <Map
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