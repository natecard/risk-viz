export interface GeoJSON {
  type: string;
  features: Feature[];
}

export interface Feature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  properties: {
    assetName: any;
    businessCategory: any;
    riskRating: any;
    riskFactors: any;
    year: any;
  };
}
