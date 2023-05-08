'use client';
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, useContext } from 'react';
import { FeatureCollection, Feature } from 'geojson';
import { DataContext } from '@/app/contextProvider';
import { select } from 'd3-selection';
import {
  axisBottom,
  axisLeft,
  scaleLinear,
  scaleTime,
  line,
  scaleOrdinal,
  schemeCategory10,
  format,
} from 'd3';

type PropertyKey = keyof Feature['properties'];
type GroupablePropertyKey =
  | 'assetName'
  | 'businessCategory'
  | 'latitude'
  | 'longitude'
  | 'riskFactors'
  | 'riskRating'
  | 'year';

  export function extractChartData(
    groupedGeoData: FeatureCollection[],
    clickedFeature?: Feature | null,
  ): {
    year: number;
    riskRating: number;
    assetName: string;
    latitude: number;
    longitude: number;
    riskFactors: object;
    businessCategory: string;
  }[][] {
    // If a clickedFeature is provided, use it as the only data point
    if (clickedFeature) {
      const feature = clickedFeature;
      if (feature.properties && feature.geometry.type === 'Point') {
        const year = feature.properties.Year;
        const riskRating = feature.properties['Risk Rating'];
        const latitude = feature.geometry.coordinates[1];
        const longitude = feature.geometry.coordinates[0];
        const assetName = feature.properties['Asset Name'];
        const riskFactors = feature.properties['Risk Factors'];
        const businessCategory = feature.properties['Business Category'];

        return [
          [
            {
              year,
              riskRating,
              latitude,
              longitude,
              assetName,
              riskFactors,
              businessCategory,
            },
          ],
        ];
      }
    }
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
      geoData?.features?.forEach((feature) => {
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
    return data;
  }
  export function filterByProperty(
    geoData: FeatureCollection,
    property: GroupablePropertyKey,
    filterValue: string | number,
  ): FeatureCollection {
    if (!geoData) {
      return {
        type: 'FeatureCollection',
        features: [], // Return an empty features array
      };
    }
    // Return all features if filterValue is empty or not provided
    if (!filterValue) {
      return geoData;
    }

    interface Groups {
      [key: string]: Feature[];
    }
    const groups: Groups = {};

    // Map properties to the ones with spaces in the data
    const propertyMap: { [key in GroupablePropertyKey]: string } = {
      assetName: 'Asset Name',
      businessCategory: 'Business Category',
      latitude: 'Latitude',
      longitude: 'Longitude',
      riskFactors: 'Risk Factors',
      riskRating: 'Risk Rating',
      year: 'Year',
    };

    // Check if geoData.features is defined before filtering
    const filteredFeatures: Feature[] = geoData.features
      ? geoData.features.filter((feature: Feature) => {
          if (feature.properties && feature.properties[propertyMap[property]]) {
            return (
              feature.properties[propertyMap[property]].toString() ===
              filterValue.toString()
            );
          }
          return false;
        })
      : [];

    return {
      type: 'FeatureCollection',
      features: filteredFeatures,
    };
  }

  export default function ChartComponent() {
    const chartRef = useRef<HTMLDivElement>(null);

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
      clickedFeature,
      setClickedFeature,
    } = useContext(DataContext);

    const onDotClick = (groupData: any): void => {
      setGeoData(groupData);
    };

    useEffect(() => {
      if (geoData) {
        const filteredFeatures = filterByProperty(geoData, groupBy, inputValue);
        const data = extractChartData([filteredFeatures], clickedFeature);
        const width = 700;
        const height = 600;
        const margin = { top: 20, right: 20, bottom: 50, left: 50 };

        const xScale = scaleLinear()
          .domain([2030, 2070])
          .range([margin.left, width - margin.right]);

        const yScale = scaleLinear()
          .domain([0, 1])
          .range([height - margin.bottom, margin.top]);

        const colorScale = scaleOrdinal(schemeCategory10);

        const xAxis = axisBottom(xScale).ticks(5).tickFormat(format('d'));

        const yAxis = axisLeft(yScale).ticks(10);

        if (chartRef.current) {
          select(chartRef.current).selectAll('*').remove();

          const svg = select(chartRef.current)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

          svg
            .append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(xAxis);

          svg
            .append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(yAxis);

          data.forEach((groupData, i) => {
            svg
              .selectAll('dot')
              .data(groupData)
              .enter()
              .append('circle')
              .attr('cx', (d) => xScale(d.year))
              .attr('cy', (d) => yScale(d.riskRating))
              .attr('r', 3)
              .attr('fill', colorScale(i.toString()))
              .on('click', () => onDotClick(groupData));
          });
        }

        return () => {
          select(chartRef.current).selectAll('*').remove();
        };
      }
    }, [geoData, groupBy, inputValue, clickedFeature]);

    return (
      <>
        <div className='flex w-full justify-center py-2'>
          <label>
            Group by:
            <select
              value={groupBy}
              onChange={(e) =>
                setGroupBy(e.target.value as GroupablePropertyKey)
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
            onClick={() => setGroupBy(groupBy)}
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
