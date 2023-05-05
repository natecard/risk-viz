import { FeatureCollection } from 'geojson';
import ChartComponent from './Components/ChartComponent';
import { convertJSON, convertToGeoJSON } from '../jsonToGeo';

const response = await fetch(process.env.NEXT_PUBLIC_WEB_URL! + '/api/data', {
  cache: 'no-cache',
});
const data = await response.json();
const jsonData = convertJSON(data);
const geoData = convertToGeoJSON(jsonData);

export default function Chart() {
  return (
    <div>
      <ChartComponent />
    </div>
  );
}
