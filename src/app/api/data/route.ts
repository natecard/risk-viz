import { convertJSON, convertToGeoJSON } from '@/app/jsonToGeo';
import { NextResponse } from 'next/server';

const sheetsId = process.env.GOOGLE_SHEETS_ID!;
const apiKey = process.env.GOOGLE_SHEETS_API!;
export async function GET() {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}/values/Sheet1?alt=json&key=${apiKey}`,
  );
  const data = await response.json();
  let jsonData = convertJSON(data);
  let geoJSONData = convertToGeoJSON(jsonData);
  return NextResponse.json(geoJSONData);
}
