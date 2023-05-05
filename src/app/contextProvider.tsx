'use client';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { ReactNode, createContext, useEffect, useState } from 'react';
import { convertJSON, convertToGeoJSON } from './jsonToGeo';

interface DataProviderProps {
  children: ReactNode;
}
export const DataContext = createContext({
  geoData: {} as FeatureCollection<Geometry, GeoJsonProperties> | undefined,
  setGeoData: (data: FeatureCollection<Geometry, GeoJsonProperties>) => {},
  year: 0,
  setYear: (year: number) => {},
  inputValue: undefined as string | number | undefined,
  setInputValue: (inputValue: string | number) => {},
  selectedProperty: 'latitude',
  setSelectedProperty: (selectedProperty: string) => {},
  groupBy: undefined as string | number | undefined,
  setGroupBy: (groupBy: string | number) => {},
});

export default function DataProvider({
  children,
}: DataProviderProps): JSX.Element {
  const [geoData, setGeoData] =
    useState<FeatureCollection<Geometry, GeoJsonProperties>>();
  const [year, setYear] = useState(2030);
  const [inputValue, setInputValue] = useState<string | number>();
  const [selectedProperty, setSelectedProperty] = useState('assetName');
  const [groupBy, setGroupBy] = useState<string | number>();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        process.env.NEXT_PUBLIC_WEB_URL! + '/api/data',
        {
          cache: 'no-cache',
        },
      );
      const data = await response.json();
      let jsonData = convertJSON(data);
      let geoJSONData = convertToGeoJSON(jsonData);
      setGeoData(geoJSONData);
    }
    fetchData();
  }, []);

  return (
    <DataContext.Provider
      value={{
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
