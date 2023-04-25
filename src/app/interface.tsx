export interface GeoJSON {
  type: string;
  features: unknown;
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
    riskFactors: any[];
    year: any;
  };
}
