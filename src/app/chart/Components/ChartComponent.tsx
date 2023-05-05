'use client';
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { FeatureCollection, Feature } from 'geojson';
import { useContext } from 'react';
import { DataContext } from '@/app/contextProvider';
import * as Plot from '@observablehq/plot';
import { format, select } from 'd3';
type PropertyKey = keyof Feature['properties'];
type GroupablePropertyKey =
  | 'assetName'
  | 'businessCategory'
  | 'latitude'
  | 'longitude'
  | 'riskFactors'
  | 'riskRating'
  | 'year';

export default function ChartComponent() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [localGroupBy, setLocalGroupBy] =
    useState<GroupablePropertyKey>('year');

  const {
    geoData,
    setGeoData,
    year,
    setYear,
    inputValue,
    setInputValue,
    selectedProperty,
    setSelectedProperty,
    groupBy,
    setGroupBy,
  } = useContext(DataContext);
  function groupByProperty(
    geoData: FeatureCollection,
    property: GroupablePropertyKey,
  ): FeatureCollection[] {
    interface Groups {
      [key: string]: Feature[];
    }
    const groups: Groups = {};

    geoData.features.forEach((feature: Feature) => {
      if (feature.properties && feature.properties[property]) {
        const key = feature.properties[property].toString();
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(feature);
      }
    });

    return Object.values(groups).map((group) => ({
      type: 'FeatureCollection',
      features: group,
    }));
  }

  function extractChartData(groupedGeoData: FeatureCollection[]): {
    year: number;
    riskRating: number;
    assetName: string;
    latitude: number;
    longitude: number;
    riskFactors: object;
    businessCategory: string;
  }[][] {
    if (!groupedGeoData) {
      return [];
    }

    const data: {
      year: number;
      riskRating: number;
      assetName: string;
      latitude: number;
      longitude: number;
      riskFactors: object;
      businessCategory: string;
    }[][] = [];

    groupedGeoData.forEach((geoData) => {
      const groupData: {
        year: number;
        riskRating: number;
        assetName: string;
        latitude: number;
        longitude: number;
        riskFactors: object;
        businessCategory: string;
      }[] = [];

      geoData.features.forEach((feature) => {
        if (feature.properties && feature.geometry.type === 'Point') {
          const year = feature.properties.Year;
          const riskRating = feature.properties['Risk Rating'];
          const latitude = feature.geometry.coordinates[1];
          const longitude = feature.geometry.coordinates[0];
          const assetName = feature.properties['Asset Name'];
          const riskFactors = feature.properties['Risk Factors'];
          const businessCategory = feature.properties['Business Category'];

          groupData.push({
            year,
            riskRating,
            latitude,
            longitude,
            assetName,
            riskFactors,
            businessCategory,
          });
        }
      });

      data.push(groupData);
    });
    console.log(data);

    return data;
  }
  useEffect(() => {
    console.log('selectedProperty:', selectedProperty); // Add this line for debugging
    console.log('groupBy:', groupBy); // Add this line for debugging
    if (geoData) {
      const groupedFeatures = groupByProperty(geoData, localGroupBy);
      console.log('groupedFeatures:', groupedFeatures); // Add this line
      const data = extractChartData(groupedFeatures);
      const colors = {
        2030: 'blue',
        2040: 'green',
        2050: 'yellow',
        2060: 'purple',
        2070: 'orange',
      };
      const chart = Plot.plot({
        x: {
          label: 'Year',
          grid: true,
          ticks: 5,
          tickFormat: format(''),
        },
        y: {
          label: 'Risk Rating',
          grid: true,
          ticks: 10,
        },
        color: {
          domain: Object.keys(colors),
          range: Object.values(colors),
        },
        marks: [
          Plot.ruleY([0]),
          ...data.map((groupData) =>
            Plot.line(groupData, {
              x: 'year',
              y: 'riskRating',
            }),
          ),
        ],
        width: 700,
        height: 600,
      });

      if (chartRef.current) {
        select(chartRef.current).selectAll('*').remove();
        select(chartRef.current).node()?.appendChild(chart);
      }

      return () => {
        select(chartRef.current).selectAll('*').remove();
      };
    }
  }, [geoData, groupBy]);
  return (
    <>
      <div className='flex w-full justify-center py-2'>
        <label>
          Group by:
          <select
            value={localGroupBy}
            onChange={(e) =>
              setLocalGroupBy(e.target.value as GroupablePropertyKey)
            }
          >
            <option value='assetName'>Asset Name</option>
            <option value='businessCategory'>Business Category</option>
            <option value='latitude'>Latitude</option>
            <option value='longitude'>Longitude</option>
            <option value='riskFactors'>Risk Factors</option>
            <option value='riskRating'>Risk Rating</option>
            <option value='year'>Year</option>
          </select>
        </label>
        <input
          className='mx-2 border'
          type='text'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          className='rounded-sm border px-2'
          onClick={() => setGroupBy(localGroupBy)}
        >
          Group
        </button>
      </div>
      <div className='flex w-full justify-center'>
        <div ref={chartRef}></div>
      </div>
    </>
  );
}
