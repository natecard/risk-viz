'use client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Feature } from 'geojson';
import { useContext } from 'react';
import { DataContext } from '@/app/contextProvider';

type ChartData = {
  labels: number[];
  datasets: {
    label: string;
    data: number[] | string[];
    fill: boolean;
    borderColor: string;
    tension: number;
  }[];
};

export default function ChartComponent() {
  const { geoData, setGeoData, year, setYear } = useContext(DataContext);
  const { features } = geoData;
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Risk Ratings Over Time',
      },
    },
  };
  function extractChartData(features: Feature[]): {
    yearsData: number[];
    riskRatings: number[];
  } {
    const yearsData: number[] = [];
    const riskRatings: number[] = [];
    if (Array.isArray(features)) {
      features.forEach((feature: any) => {
        if (feature.properties && feature.geometry.type === 'Point') {
          const year = feature.properties.Year;
          const riskRating = feature.properties['Risk Rating'];

          if (!yearsData.includes(year)) {
            yearsData.push(year);
            riskRatings.push(riskRating);
          }
        }
      });
    }

    return { yearsData, riskRatings };
  }
  const { yearsData, riskRatings } = extractChartData(features);
  const chartData: ChartData = {
    labels: yearsData,
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
  return <Line options={options} data={chartData} />;
}
