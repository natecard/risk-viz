export interface FeatureCollection {
  type: string;
  features: any;
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
