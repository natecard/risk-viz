'use client';
import { Map, Layer, Source, LayerProps } from 'react-map-gl';
import { Suspense, useMemo, useContext } from 'react';
import { DataContext } from '@/app/contextProvider';
import Loading from '../loading';
import ControlPanel from './ControlPanel';
import { FeatureCollection } from 'geojson';
import {
  extractChartData,
  filterByProperty,
} from '@/app/chart/Components/ChartComponent';

const apiKey: string = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

export default function DataMap() {
  const { geoData, setGeoData, year, setYear, groupBy, selectedProperty } =
    useContext(DataContext);

  const filteredData: FeatureCollection = useMemo(() => {
    if (!geoData || !geoData.features) {
      return { type: 'FeatureCollection', features: [] };
    }

    const filteredFeatures = filterByProperty(geoData, 'year', year);

    return {
      ...geoData,
      type: 'FeatureCollection',
      features: filteredFeatures.features, // get the features from the filteredFeatures object
    };
  }, [geoData, year]);

  const colorStops = useMemo(() => {
    if (geoData) {
      const uniqueValues = new Set(
        geoData.features.map(
          (feature: any) => feature.properties[selectedProperty],
        ),
      );
      const sortedValues = Array.from(uniqueValues).sort((a, b) => a - b);
      const step = 1 / (sortedValues.length - 1);
      return sortedValues.map((value, index) => [index * step, value]);
    }
  }, [geoData, selectedProperty]);

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
        property: selectedProperty,
        stops: colorStops,
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
