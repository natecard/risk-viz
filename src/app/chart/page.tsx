import ChartComponent from './ChartComponent';
const response = await fetch(process.env.NEXT_PUBLIC_WEB_URL! + '/api/data');
const data = await response.json();
export default function Chart() {
  return <ChartComponent data={data}></ChartComponent>;
}
