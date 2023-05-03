'use client';
import { useEffect, useState } from 'react';
import { ChartDataCustomTypesPerDataset } from 'chart.js';
import { Chart, Line } from 'react-chartjs-2';
import { convertJSON, convertToGeoJSON } from '@/app/jsonToGeo';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

async function createData() {
  console.log('Fetching data...');
  //Fetch cached with Next.js 13
  const request = await fetch(process.env.NEXT_PUBLIC_WEB_URL! + '/api/data');
  const response = await request.json();
  console.log('Converting data...');
  let jsonData = convertJSON(response);
  let geoData = convertToGeoJSON(jsonData);
  //Destructure array
  const { features } = geoData;
}
function extractChartData(features: FeatureCollection[]): {
  years: number[];
  riskRatings: number[];
} {
  const years: number[] = [];
  const riskRatings: number[] = [];
  if (Array.isArray(features)) {
    features.forEach((feature: any) => {
      if (feature.properties && feature.geometry.type === 'Point') {
        const year = feature.properties.Year;
        const riskRating = feature.properties['Risk Rating'];

        if (!years.includes(year)) {
          years.push(year);
          riskRatings.push(riskRating);
        }
      }
    });
  }

  return { years, riskRatings };
}


type ChartData = {
  labels: number[];
  datasets: {
    label: string;
    data: number[];
    fill: boolean;
    borderColor: string;
    tension: number;
  }[];
};

export function ChartComponent( features: any ): JSX.Element {
  const { years, riskRatings } = extractChartData(features);
  const chartData: ChartData = {
    labels: years,
    datasets: [
      {
        label: 'Risk Ratings',
        data: riskRatings,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };
  return <Line data={chartData} />;
};

// export default function ChartComponent() {
//   const [chartData, setChartData] = useState<any>([]);
//   useEffect(() => {
//     async function fetchData() {
//       const data = await createData();
//       setChartData(data);
//       console.log(data);
//     }
//     fetchData();
//   }, []);
//   return (
//     <Chart data={chartData} width={500} height={500} type={'line'}>
//       <Line data={chartData.feature[i].properties['Risk Rating']} />
//     </Chart>
//   );
// }
