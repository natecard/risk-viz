import DataMap from './map/Components/MapComponent';
import TableComponent from './table/Components/TableComponent';
import ChartComponent from './chart/Components/ChartComponent';

export default function Home() {
  return (
    <div className=''>
      <main className='flex flex-col justify-center'>
        <div className='flex flex-col justify-center pb-48'>
          <h1 className='pb-4 text-center text-2xl'>Map</h1>
          <DataMap />
        </div>
        <div className='flex flex-col justify-center pb-48'>
          <h1 className='pb-4 text-center text-2xl'>Table</h1>
          <TableComponent />
        </div>
        <div className='flex flex-col justify-center pb-48'>
          <h1 className='pb-4 text-center text-2xl'>Line Chart</h1>
          <ChartComponent />
        </div>
      </main>
    </div>
  );
}
