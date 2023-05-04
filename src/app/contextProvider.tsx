'use client';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { ReactNode, createContext, useState } from 'react';
import { convertJSON, convertToGeoJSON } from './jsonToGeo';

interface DataProviderProps {
  children: ReactNode;
}
export const DataContext = createContext({
  geoData: {} as FeatureCollection<Geometry, GeoJsonProperties>,
  setGeoData: (data: FeatureCollection<Geometry, GeoJsonProperties>) => {},
  year: 0,
  setYear: (year: number) => {},
});

//Fetch set to not cache
const response = await fetch(process.env.NEXT_PUBLIC_WEB_URL! + '/api/data', {
  cache: 'no-cache',
});
const data = await response.json();
let jsonData = convertJSON(data);
let geoJSONData = convertToGeoJSON(jsonData);

export default function DataProvider({
  children,
}: DataProviderProps): JSX.Element {
  const [geoData, setGeoData] = useState(geoJSONData);
  const [year, setYear] = useState(2030);
  return (
    <DataContext.Provider value={{ geoData, setGeoData, year, setYear }}>
      {children}
    </DataContext.Provider>
  );
}
