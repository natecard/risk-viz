import DataMap from './map/Components/MapComponent';
import TableComponent from './table/Components/TableComponent';
// import ChartComponent from './chart/Components/ChartComponent';
import { convertJSON, convertToGeoJSON } from './jsonToGeo';

const response = await fetch(process.env.NEXT_PUBLIC_WEB_URL! + '/api/data', {
  cache: 'no-cache',
});
const data = await response.json();
const jsonData = convertJSON(data);
const geoData = convertToGeoJSON(jsonData);
export default async function Home() {
  return (
    <div className=''>
      <main className='flex flex-row justify-center py-72'>
        <div className='px-8'>
          <DataMap data={geoData} />
        </div>
        <div className='px-8'>
          <TableComponent />
        </div>
        <div className='px-8'>{/* <ChartComponent data={geoData} /> */}</div>
      </main>
    </div>
  );
}
