import ChartComponent from './ChartComponent';
const response = await fetch('http://localhost:3000/api/data');
const data = await response.json();
export default function Chart() {
  return <ChartComponent data={data}></ChartComponent>;
}
