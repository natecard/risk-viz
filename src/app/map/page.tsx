import { FeatureCollection } from 'geojson';
import DataMap from './Components/MapComponent';
import { convertJSON, convertToGeoJSON } from '../jsonToGeo';

const response = await fetch(process.env.NEXT_PUBLIC_WEB_URL! + '/api/data', {
  cache: 'no-cache',
});
const data = await response.json();
const jsonData = convertJSON(data);
const geoData: FeatureCollection = convertToGeoJSON(jsonData);
export default function Map() {
  return (
    <div>
      <DataMap data={geoData} />
    </div>
  );
}
