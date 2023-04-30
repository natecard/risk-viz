'use client';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useEffect, useState } from 'react';
import { convertJSON, convertToGeoJSON } from '@/app/jsonToGeo';

async function createRowData() {
  console.log('Fetching data...');
  //Fetch cached with Next.js 13
  const response = await fetch(process.env.NEXT_PUBLIC_WEB_URL! + '/api/data');
  const data = await response.json();
  console.log('Converting data...');
  let jsonData = convertJSON(data);
  let geoData = convertToGeoJSON(jsonData);
  //Destructure array
  const { features } = geoData;
  console.log('Creating row data...');
  //Initialize rowData array
  let rowData: any = [];
  for (let i = 0; i < features.length; i++) {
    let feature = features[i];
    //Checking properties of features
    if (feature.properties && feature.geometry.type === 'Point') {
      //Push to rowData state for rendering
      rowData.push({
        'Asset Name': feature.properties['Asset Name'],
        Latitude: feature.geometry.coordinates[1],
        Longitude: feature.geometry.coordinates[0],
        'Business Category': feature.properties['Business Category'],
        'Risk Rating': feature.properties['Risk Rating'],
        'Risk Factors': feature.properties['Risk Factors'],
        Year: feature.properties.Year,
      });
    }
  }
  console.log('Row data:', rowData);
  return rowData;
}

export default function TableComponent() {
  //reinitialize array for state
  const [rowData, setRowData] = useState<any>([]);
  useEffect(() => {
    async function fetchData() {
      console.log('Fetching row data...');
      const data = await createRowData();
      console.log('Setting row data...');
      setRowData(data);
    }
    fetchData();
  }, []);
  //Column headers with filters
  const [columnDefs, setColumnDefs] = useState([
    { field: 'Asset Name', filter: true },
    { field: 'Latitude', filter: true },
    { field: 'Longitude', filter: true },
    { field: 'Business Category', filter: true },
    { field: 'Risk Rating', filter: true },
    { field: 'Risk Factors', filter: true },
    { field: 'Year', filter: true },
  ]);
  return (
    <div
      className='ag-theme-alpine-dark p-10'
      style={{ height: '100vh', width: '100vw' }}
    >
      <AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact>
    </div>
  );
}
