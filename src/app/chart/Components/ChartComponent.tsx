'use client';
import { CartesianGrid, LineChart, Tooltip } from 'recharts';
import { useState } from 'react';
import { convertJSON, convertToGeoJSON } from '@/app/jsonToGeo';
import { Line } from 'react-chartjs-2';

console.log('Fetching data...');
//Fetch cached with Next.js 13
const response = await fetch(process.env.NEXT_PUBLIC_WEB_URL! + '/api/data');
const data = await response.json();
console.log('Converting data...');
let jsonData = convertJSON(data);
let geoData = convertToGeoJSON(jsonData);
//Destructure array
const { features } = geoData;
console.log(features);

export default function ChartComponent() {
  // const [options, setOptions] = useState<AgChartOptions>({
  //   autoSize: true,
  //   title: {
  //     text: 'Risk Factors',
  //   },
  //   data: [data],
  //   series: [
  //     {
  //       xKey: 'Decade',
  //       yKey: riskFactor[0],
  //       yName: 'Risk Factor #1',
  //     },
  //     {
  //       xKey: 'Decade',
  //       yKey: riskFactor[1],
  //       yName: 'Risk Factor #2',
  //     },
  //     {
  //       xKey: 'Decade',
  //       yKey: riskFactor[2],
  //       yName: 'Risk Factor #3',
  //     },
  //   ],
  // });
  return (
    <div>
      <LineChart data={features}>
        {/* <Line
        dataKey='Risk Rating'
        dot={{ stroke: 'red', strokeWidth: 2 }}
        type='monotone'
        /> */}
        <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
        <Tooltip />
      </LineChart>
    </div>
  );
}
