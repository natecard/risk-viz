'use client';
import {
  Map,
  Layer,
  Source,
  LayerProps,
  MapLayerMouseEvent,
} from 'react-map-gl';
import { Suspense, useMemo, useContext, useState } from 'react';
import { DataContext } from '@/app/contextProvider';
import Loading from '../loading';
import ControlPanel from './ControlPanel';
import { Popup } from 'react-map-gl';
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  Point,
} from 'geojson';
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
    popupInfo: maybePopupInfo,
    setPopupInfo,
    clickedFeature,
    setClickedFeature,
  } = useContext(DataContext);
  const popupInfo = maybePopupInfo as Feature<
    Geometry,
    GeoJsonProperties
  > | null;
  const [mapInstance, setMapInstance] = useState<any>(null);

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
    if (geoData && geoData.features) {
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
  function isPoint(geometry: Geometry): geometry is Point {
    return geometry.type === 'Point';
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

  function onMapClick(event: MapLayerMouseEvent) {
    if (mapInstance) {
      const features = mapInstance.queryRenderedFeatures(event.point);

      const clickedFeature = features.find(
        (feature: any) => feature.layer.id === 'Point',
      );

      if (clickedFeature) {
        const coordinates = clickedFeature.geometry.coordinates.slice();
        const description = clickedFeature.properties.description;

        while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        setClickedFeature(clickedFeature);
        setPopupInfo(clickedFeature);
        setShowPopup(true);
        console.log(clickedFeature);
      } else {
        setShowPopup(false);
        console.log('error');
      }
    }
  }
  function onMapMouseEnter() {
    if (mapInstance) {
      mapInstance.getCanvas().style.cursor = 'pointer';
    }
  }
  function onMapMouseLeave() {
    if (mapInstance) {
      mapInstance.getCanvas().style.cursor = '';
    }
  }
  return (
    <div className='flex justify-center'>
      <Suspense fallback={<Loading />}>
        <Map
          onLoad={(event: any) => setMapInstance(event.target)}
          onClick={onMapClick}
          onMouseEnter={onMapMouseEnter}
          onMouseLeave={onMapMouseLeave}
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
          {showPopup && popupInfo && (
            <Popup
              anchor='top'
              longitude={
                isPoint(popupInfo.geometry)
                  ? popupInfo.geometry.coordinates[0]
                  : 0
              }
              latitude={
                isPoint(popupInfo.geometry)
                  ? popupInfo.geometry.coordinates[1]
                  : 0
              }
              closeOnClick={false}
              onClose={() => setShowPopup(false)}
              offset={[0, -20]}
            >
              <h2>Asset Name: {popupInfo.properties?.['Asset Name']}</h2>
              <h3>
                Business Category: {popupInfo.properties?.['Business Category']}
              </h3>
              <h3>Risk Rating: {popupInfo.properties?.['Risk Rating']}</h3>
              {/* <h3>Risk Rating: {popupInfo.properties?.['Risk Factors']}</h3> */}
            </Popup>
          )}
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