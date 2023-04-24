'use client'
import { Map, Layer, Source, LayerProps, MapRef } from "react-map-gl";
import { useEffect, useState, useRef, Suspense } from 'react';
import { Feature, GeoJSON } from '../interface';
import Loading from './loading';
const apiKey: string = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

export default async function DataMap() {
  // console.log('DataMap rendered');
  const [data, setData] = useState();
  const mapRef = useRef<MapRef | null>(null);
  //lat and lng set to Toronto on initialization
  //TODO Set up map data layer and points
  useEffect(() => {
    getData();
    console.log(mapRef);
  }, []);
  const getData = () => {
    fetch('/api/data/')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.log(error));
  };

  const layerData: LayerProps = {
    id: 'Point',
    type: 'circle',
    paint: {
      'circle-radius': 5,
      'circle-color': '#007cbf',
    },
  };

  return (
    <div>
      {/* {data && ( */}
      <Suspense fallback={<Loading />}>
        <Map
          ref={mapRef}
          reuseMaps
          initialViewState={{
            longitude: -79.36,
            latitude: 43.65,
            zoom: 6,
          }}
          mapStyle='mapbox://styles/mapbox/light-v11'
          style={{ width: '100vw', height: '60vh' }}
          mapboxAccessToken={apiKey}
        >
          <Source type='geojson' data={'/api/data'}>
            <Layer {...layerData} />
          </Source>
        </Map>
      </Suspense>
      {/* )} */}
    </div>
  );
}