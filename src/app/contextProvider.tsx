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
  showPopup: false,
  setShowPopup: (show: boolean) => {},
  popupInfo: null,
  setPopupInfo: (info: any) => {},
  clickedFeature: null,
  setClickedFeature: (feature: any) => {},
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
  const [showPopup, setShowPopup] = useState(false);
  const [popupInfo, setPopupInfo] = useState(null);
  const [clickedFeature, setClickedFeature] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        process.env.NEXT_PUBLIC_WEB_URL! + '/api/data',
      );
      const data = await response.json();
      setGeoData(data);
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
        showPopup,
        setShowPopup,
        popupInfo,
        setPopupInfo,
        clickedFeature,
        setClickedFeature,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
