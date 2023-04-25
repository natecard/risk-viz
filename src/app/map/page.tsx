'use client'
import { Map, Layer, Source, LayerProps, Marker } from 'react-map-gl';
import { useEffect, useState, Suspense, useMemo, SetStateAction } from 'react';
import Loading from './loading';
import { GeoJSON, Feature } from '../interface';
import ControlPanel from './ControlPanel';
import { AnySourceData } from 'react-map-gl/dist/esm/types';
const apiKey: string = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

interface allData {}
export default async function DataMap() {
  const [allData, setAllData] = useState<GeoJSON | AnySourceData>();
  const [decade, setDecade] = useState(2030);

  //TODO Set up map data layer and points
  useEffect(() => {
    getData();
  }, []);
  async function getData() {
    const request = await fetch('/api/data');
    const response = await request.json();
    const data = response;
    setAllData(data);
    console.log(data);
  }

  if (allData) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const filteredData = useMemo(() => {
      return allData.features.filter(
        (feature: Feature) => feature.properties.year === decade,
      );
    }, [allData, decade]);

    filteredData.map((features: Feature) => (
      <Marker
        key={features.properties.assetName}
        longitude={features.geometry.coordinates[1]}
        latitude={features.geometry.coordinates[0]}
        assetName={features.properties.assetName}
        riskRating={features.properties.riskRating}
        riskFactors={features.properties.riskFactors}
        year={features.properties.year}
      ></Marker>
    ));
    setAllData(filteredData);
  }
  // const dataLayer: AnySourceData = allData;
  const layerData: LayerProps = {
    id: 'Point',
    type: 'circle',
    // source: dataLayer,
    paint: {
      'circle-color': {
        property: 'riskRating',
        stops: [
          [0, '#3288bd'],
          [0.1, '#66c2a5'],
          [0.2, '#abdda4'],
          [0.3, '#e6f598'],
          [0.4, '#ffffbf'],
          [0.5, '#fee08b'],
          [0.6, '#fdae61'],
          [0.7, '#f46d43'],
          [0.8, '#d53e4f'],
        ],
      },
    },
  };
  return (
    <div>
      {/* <Suspense fallback={<Loading />}> */}
      <Map
        reuseMaps
        initialViewState={{
          //lat and lng set to Toronto on initialization
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
        <ControlPanel
          onChange={(value: SetStateAction<number>) => setDecade(value)}
          decade={decade}
        />
      </Map>
      {/* </Suspense> */}
    </div>
  );
}