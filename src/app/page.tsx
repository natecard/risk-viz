import DataMap from './map/Components/MapComponent';
import TableComponent from './table/Components/TableComponent';
import ChartComponent from './chart/Components/ChartComponent';

export default function Home() {
  return (
    <main className='flex flex-col justify-center'>
      <div className='flex flex-row'>
        <div className='flex flex-col'>
          <TableComponent />
        </div>
        <div className='flex flex-col'>
          <ChartComponent />
        </div>
      </div>
      <div className='flex flex-col'>
        <DataMap />
      </div>
    </main>
  );
}
