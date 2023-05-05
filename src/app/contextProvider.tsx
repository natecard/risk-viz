'use client';
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from 'geojson';
import { ReactNode, createContext, useEffect, useState } from 'react';
import { convertJSON, convertToGeoJSON } from './jsonToGeo';
type GroupablePropertyKey =
  | 'assetName'
  | 'businessCategory'
  | 'latitude'
  | 'longitude'
  | 'riskFactors'
  | 'riskRating'
  | 'year';
interface DataProviderProps {
  children: ReactNode;
}
export const DataContext = createContext({
  geoData: {} as FeatureCollection<Geometry, GeoJsonProperties> | undefined,
  setGeoData: (data: FeatureCollection<Geometry, GeoJsonProperties>) => {},
  year: 0,
  setYear: (year: number) => {},
  inputValue: '' as string | number,
  setInputValue: (inputValue: string | number) => {},
  selectedProperty: '' as string,
  setSelectedProperty: (selectedProperty: string) => {},
  groupBy: '' as GroupablePropertyKey,
  setGroupBy: (groupBy: GroupablePropertyKey) => {},
});

export default function DataProvider({
  children,
}: DataProviderProps): JSX.Element {
  const [geoData, setGeoData] =
    useState<FeatureCollection<Geometry, GeoJsonProperties>>();
  const [year, setYear] = useState(2030);
  const [inputValue, setInputValue] = useState<string | number>('');
  const [selectedProperty, setSelectedProperty] = useState('assetName');
  const [groupBy, setGroupBy] = useState<GroupablePropertyKey>('assetName');

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
