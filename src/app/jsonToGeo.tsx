import { FeatureCollection, Feature } from 'geojson';
export function convertJSON(data: any) {
  // Remove the header row
  const values = data.values.slice(1);
  const convertedData = values.map((row: any) => {
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
        `Failed to parse risk factors for ${assetName}: ${riskFactors}`,
      );
      parsedRiskFactors = {};
    }

    return {
      assetName,
      lat,
      long,
      businessCategory,
      riskRating: parseFloat(riskRating),
      riskFactors: parsedRiskFactors,
      year: parseInt(year),
    };
  });

  return convertedData;
}
export function convertToGeoJSON(data: any) {
  const geoJSON: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };

  data.forEach((row: any) => {
    const feature: Feature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(row.long), parseFloat(row.lat)],
      },
      properties: {
        'Asset Name': row.assetName,
        'Business Category': row.businessCategory,
        'Risk Rating': row.riskRating,
        'Risk Factors': row.riskFactors,
        Year: row.year,
      },
    };

    geoJSON.features.push(feature);
  });

  return geoJSON;
}
