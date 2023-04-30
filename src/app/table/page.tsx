// import { FeatureCollection } from 'geojson';
// import { convertJSON, convertToGeoJSON } from '../jsonToGeo';
import TableComponent from './Components/TableComponent';
// const response = await fetch(process.env.NEXT_PUBLIC_WEB_URL! + '/api/data', {
//   cache: 'no-cache',
// });
// const data = await response.json();
// const jsonData = convertJSON(data);
// const geoData = convertToGeoJSON(jsonData);
export default function Table() {
  return (
    <div>
      <TableComponent />
    </div>
  );
}
