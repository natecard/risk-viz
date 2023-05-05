'use client';
import { Map, Layer, Source, LayerProps } from 'react-map-gl';
import { Suspense, useMemo, useContext } from 'react';
import { DataContext } from '@/app/contextProvider';
import Loading from '../loading';
import ControlPanel from './ControlPanel';
import { FeatureCollection } from 'geojson';
const apiKey: string = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

export default function DataMap() {
  const { geoData, setGeoData, year, setYear } = useContext(DataContext);
  const filteredData: FeatureCollection = useMemo(() => {
    console.log(geoData);
    if (!geoData || !geoData.features) {
      return { type: 'FeatureCollection', features: [] };
    }
    const filteredFeatures = geoData.features.filter(
      (feature: any) => feature.properties.Year === year,
    );
    return {
      ...geoData,
      type: 'FeatureCollection',
      features: filteredFeatures,
    };
  }, [geoData, year]);

  const riskRatingLayer: LayerProps = {
    id: 'Point',
    type: 'circle',
    paint: {
      'circle-radius': {
        base: 5,
        stops: [
          [5, 10],
          [12, 10],
        ],
      },
      'circle-color': {
        property: 'Risk Rating',
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
    <div className='flex justify-center'>
      <Suspense fallback={<Loading />}>
        <Map
          initialViewState={{
            longitude: -79.36,
            latitude: 43.65,
            zoom: 6,
          }}
          mapStyle='mapbox://styles/mapbox/dark-v11'
          style={{ width: '90vw', height: '70vh' }}
          mapboxAccessToken={apiKey}
          attributionControl={false}
        >
          <Source id='data' type='geojson' data={filteredData}>
            <Layer {...riskRatingLayer} />
          </Source>
          <ControlPanel
            onChange={(value: number) => {
              setYear(value);
            }}
            year={year}
          />
        </Map>
      </Suspense>
    </div>
  );
}
