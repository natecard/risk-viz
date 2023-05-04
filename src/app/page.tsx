'use client';
import DataMap from './map/Components/MapComponent';
import TableComponent from './table/Components/TableComponent';
import ChartComponent from './chart/Components/ChartComponent';

export default function Home() {
  return (
    <div className=''>
      <main className='flex flex-col justify-center py-12'>
        <div className='pb-48'>
          <DataMap />
        </div>
        <div className='pb-48'>
          <TableComponent />
        </div>
        <div className='pb-48'>
          <ChartComponent />
        </div>
      </main>
    </div>
  );
}
