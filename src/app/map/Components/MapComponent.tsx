'use client';
import { Map, Layer, Source, LayerProps } from 'react-map-gl';
import { Suspense, useMemo, useContext } from 'react';
import { DataContext } from '@/app/contextProvider';
import Loading from '../loading';
import ControlPanel from './ControlPanel';
import { Popup } from 'react-map-gl';
import Chart from '@/app/chart/Components/ChartComponent';
import Table from '@/app/table/Components/TableComponent';
import { Feature, FeatureCollection } from 'geojson';
import {
  extractChartData,
  filterByProperty,
} from '@/app/chart/Components/ChartComponent';

const apiKey: string = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

function groupByLocation(data: FeatureCollection): Feature[][] {
  const groupedData: { [key: string]: Feature[] } = {};

  data.features.forEach((feature) => {
    const {
      'Asset Name': assetName,
      Longitude: longitude,
      Latitude: latitude,
    } = feature.properties as any;

    const locationKey = `${assetName}-${longitude}-${latitude}`;

    if (!groupedData[locationKey]) {
      groupedData[locationKey] = [];
    }

    groupedData[locationKey].push(feature);
  });

  return Object.values(groupedData);
}

export default function DataMap() {
  const {
    geoData,
    setGeoData,
    year,
    setYear,
    groupBy,
    selectedProperty,
    showPopup,
    setShowPopup,
    popupInfo,
    setPopupInfo,
    clickedFeature,
    setClickedFeature,
  } = useContext(DataContext);

  const filteredData: FeatureCollection = useMemo(() => {
    if (!geoData || !geoData.features) {
      return { type: 'FeatureCollection', features: [] };
    }

    const filteredFeatures = filterByProperty(geoData, 'year', year);

    const groupedFeatures = groupByLocation(filteredFeatures);

    const newFeatures = groupedFeatures.flatMap((group) => group);

    return {
      ...geoData,
      type: 'FeatureCollection',
      features: newFeatures, // set the newFeatures as the features of the filteredData object
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
      return sortedValues.map((value, index) => [
        index * step,
        valueToColor(value),
      ]);
    }
  }, [geoData, selectedProperty]);

  function valueToColor(value: number) {
    const r = value < 0.5 ? 1 : 1 - (value - 0.5) * 2;
    const g = value > 0.5 ? 1 : value * 2;
    const b = 0;

    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(
      b * 255,
    )})`;
  }

  const riskRatingLayer: LayerProps = {
    id: 'Point',
    type: 'circle',
    paint: {
      'circle-opacity': 0.8,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff',
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
  function onClick(event: any) {
    const features = event.features;
    const clickedPoint =
      features &&
      features.find((f: { layer: { id: string } }) => f.layer.id === 'Point');
    if (clickedPoint) {
      setPopupInfo(clickedPoint);
      setShowPopup(true);
      setClickedFeature(clickedPoint);
    } else {
      setShowPopup(false);
      setPopupInfo(null);
      setClickedFeature(null);
    }
  }

  return (
    <div className='flex justify-center'>
      <Suspense fallback={<Loading />}>
        <Map
          onClick={onClick}
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
            {showPopup && popupInfo && (
              <Popup
                tipSize={5}
                anchor='top'
                longitude={popupInfo.geometry.coordinates[0]}
                latitude={popupInfo.geometry.coordinates[1]}
                closeOnClick={false}
                onClose={() => setShowPopup(false)}
              >
                <div>
                  <h4>Asset Name: {popupInfo.properties['Asset Name']}</h4>
                  <p>
                    Business Category:{' '}
                    {popupInfo.properties['Business Category']}
                  </p>
                  <p>Risk Rating: {popupInfo.properties['Risk Rating']}</p>
                  <p>
                    Risk Factors:{' '}
                    {JSON.stringify(popupInfo.properties['Risk Factors'])}
                  </p>
                </div>
              </Popup>
            )}
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
