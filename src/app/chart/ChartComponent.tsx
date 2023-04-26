'use client';
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js';
export default function ChartComponent(props: { data: any }) {
  const { data } = props;
  return <Line data={data}></Line>;
}
