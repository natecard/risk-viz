import ChartComponent from './ChartComponent';
const response = await fetch('/api/data');
const data = await response.json();
export default function Chart() {
  return <ChartComponent data={data}></ChartComponent>;
}
