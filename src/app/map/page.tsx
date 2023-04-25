import DataMap from './MapComponent';
export default async function Map() {
  const data = await fetch('/api/data');
  return (
    <div>
      <DataMap data={data} />
    </div>
  );
}
