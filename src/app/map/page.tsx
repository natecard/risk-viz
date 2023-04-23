'use client'
import {Map} from "react-map-gl";
const apiKey: string = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

  
export default async function DataMap(){
//lat and lng set to Toronto on initialization
//TODO Set up map data layer and points
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
        ></Map>
    );
}