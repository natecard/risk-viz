import { NextResponse } from "next/server";
import { Feature, FeatureCollection } from '@/app/interface';

const sheetsId = process.env.GOOGLE_SHEETS_ID!;
const apiKey = process.env.GOOGLE_SHEETS_API!;
export async function GET(){
const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}/values/Sheet1?alt=json&key=${apiKey}`)
const jsonData = await response.json()
function convertToGeoJSON(data: any) {
  const geoJSON: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };
  // Remove the header row
  const values = data.values.slice(1);

  values.forEach((row: any) => {
    const [
      assetName,
      lat,
      long,
      businessCategory,
      riskRating,
      riskFactors,
      year,
    ] = row;

    // Parse riskFactors as JSON
    let parsedRiskFactors;
    try {
      parsedRiskFactors = JSON.parse(riskFactors);
    } catch (error) {
      console.error(
        `Failed to parse risk factors for ${assetName}: ${riskFactors}`
      );
      parsedRiskFactors = {};
    }
    //Convert JSON to GeoJSON for map data
    const feature: Feature = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [parseFloat(long), parseFloat(lat)],
      },
      properties: {
        assetName,
        businessCategory,
        riskRating: parseFloat(riskRating),
        riskFactors: parsedRiskFactors,
        year: parseInt(year),
      },
    };

    geoJSON.features.push(feature);
  });

  return geoJSON;
}
const data = convertToGeoJSON(jsonData)
return NextResponse.json(data)
}
