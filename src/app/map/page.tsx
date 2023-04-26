import DataMap from './MapComponent';
const response = await fetch('http://localhost:3000/api/data');
const data = await response.text();
export default function Map() {
  console.log(data);
  return (
    <div>
      {' '}
      <DataMap data={data} />
    </div>
  );
}
