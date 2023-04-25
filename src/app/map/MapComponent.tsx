'use client';
import {
  Map,
  Layer,
  Source,
  LayerProps,
  Marker,
  MarkerProps,
} from 'react-map-gl';
import { useEffect, useState, Suspense, useMemo, SetStateAction } from 'react';
import Loading from './loading';
import { FeatureCollection, Feature } from '../interface';
import ControlPanel from './ControlPanel';
import { AnySourceData } from 'react-map-gl/dist/esm/types';
const apiKey: string = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

interface extendedProps extends MarkerProps {
  riskRating: any;
}
export default function DataMap(props: { data: any }) {
  const { data } = props;
  const [allData, setAllData] = useState<any>(data);
  const [decade, setDecade] = useState(2030);

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
        // riskRating={features.properties.riskRating}
        // riskFactors={features.properties.riskFactors}
        // year={features.properties.year}
        latitude={features.geometry.coordinates[0]}
        longitude={features.geometry.coordinates[1]}
      ></Marker>
    ));
  }
  // const dataLayer: AnySourceData = allData;
  const layerData: LayerProps = {
    id: 'Point',
    type: 'circle',
    // source: filteredData,
    paint: {
      'circle-radius': {
        base: 10,
        stops: [
          [12, 15],
          [22, 100],
        ],
      },
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
      <Map
        reuseMaps={true}
        initialViewState={{
          //lat and lng set to Toronto on initialization
          longitude: -79.36,
          latitude: 43.65,
          zoom: 6,
        }}
        mapStyle='mapbox://styles/mapbox/dark-v11'
        style={{ width: '100vw', height: '60vh' }}
        mapboxAccessToken={apiKey}
      >
        <Source type='geojson' data={allData}>
          <Layer {...layerData} />
        </Source>
        <ControlPanel
          onChange={(value: SetStateAction<number>) => {
            setDecade(value);
            console.log(value);
          }}
          decade={decade}
        />
      </Map>
    </div>
  );
}
