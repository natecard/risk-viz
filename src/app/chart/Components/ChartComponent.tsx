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
  } = useContext(DataContext);
  function filterByProperty(
    geoData: FeatureCollection,
    property: GroupablePropertyKey,
    filterValue: string | number,
  ): FeatureCollection {
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

    const filteredFeatures: Feature[] = geoData.features.filter(
      (feature: Feature) => {
        if (feature.properties && feature.properties[propertyMap[property]]) {
          return (
            feature.properties[propertyMap[property]].toString() ===
            filterValue.toString()
          );
        }
        return false;
      },
    );

    return {
      type: 'FeatureCollection',
      features: filteredFeatures,
    };
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
    return data;
  }
  useEffect(() => {
    if (geoData) {
      const filteredFeatures = filterByProperty(geoData, groupBy, inputValue);
      const data = extractChartData([filteredFeatures]);

      const width = 700;
      const height = 600;
      const margin = { top: 20, right: 20, bottom: 50, left: 50 };

      const xScale = scaleLinear()
        .domain([2000, 2100])
        .range([margin.left, width - margin.right]);

      const yScale = scaleLinear()
        .domain([0, 1])
        .range([height - margin.bottom, margin.top]);

      const colorScale = scaleOrdinal(schemeCategory10);

      const xAxis = axisBottom(xScale).ticks(5).tickFormat(format('d')); // Add this line

      const yAxis = axisLeft(yScale).ticks(10);

      const d3line = line<{
        year: number;
        riskRating: number;
        assetName: string;
        latitude: number;
        longitude: number;
        riskFactors: object;
        businessCategory: string;
      }>()
        .x((d) => xScale(d.year))
        .y((d) => yScale(d.riskRating));

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
            .append('path')
            .datum(groupData)
            .attr('fill', 'none')
            .attr('stroke', colorScale(i.toString()))
            .attr('stroke-width', 1.5)
            .attr('d', d3line);
        });
      }

      return () => {
        select(chartRef.current).selectAll('*').remove();
      };
    }
  }, [geoData, groupBy, inputValue]);

  return (
    <>
      <div className='flex w-full justify-center py-2'>
        <label>
          Group by:
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as GroupablePropertyKey)}
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
