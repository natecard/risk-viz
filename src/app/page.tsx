'use client';
import DataMap from './map/Components/MapComponent';
import TableComponent from './table/Components/TableComponent';
import ChartComponent from './chart/Components/ChartComponent';
import { useContext } from 'react';
import { DataContext } from './contextProvider';

export default function Home() {
  const { geoData, setGeoData, year, setYear } = useContext(DataContext);
  return (
    <div className=''>
      <main className='flex flex-col justify-center py-72'>
        <div className='px-8'>
          <DataMap />
        </div>
        <div className='px-8'>
          <TableComponent />
        </div>
        <div className='px-8'>
          <ChartComponent />
        </div>
      </main>
    </div>
  );
}
