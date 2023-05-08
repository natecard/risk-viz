/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { FirstDataRenderedEvent } from 'ag-grid-community';
import { Feature, Point } from 'geojson';
import { DataContext } from '@/app/contextProvider';
import {
  extractChartData,
  filterByProperty,
} from '@/app/chart/Components/ChartComponent';

interface RiskFactorsCellProps {
  value: Record<string, number>;
}
async function createRowData(
  data: {
    year: number;
    riskRating: number;
    assetName: string;
    latitude: number;
    longitude: number;
    riskFactors: object;
    businessCategory: string;
  }[][],
) {
  if (!data) {
    return [];
  }
  //Initialize rowData array
  let rowData: any = [];
  for (const group of data) {
    for (const entry of group) {
      rowData.push({
        'Asset Name': entry.assetName,
        Latitude: entry.latitude,
        Longitude: entry.longitude,
        'Business Category': entry.businessCategory,
        'Risk Rating': entry.riskRating,
        'Risk Factors': entry.riskFactors,
        Year: entry.year,
      });
    }
  }

  return rowData;
}

export default function TableComponent() {
  const {
    geoData,
    setGeoData,
    inputValue,
    groupBy,
    clickedFeature,
    setClickedFeature,
  } = useContext(DataContext);
  const gridRef = useRef<AgGridReact<any>>(null);
  //reinitialize array for state
  const [rowData, setRowData] = useState<any>([]);
  useEffect(() => {
    async function fetchData() {
      if (!geoData || !geoData.features) {
        return null;
      }
      console.log('Fetching row data...');
      const filteredFeatures = filterByProperty(geoData, groupBy, inputValue);

      // Check if there is a clickedFeature
      if (clickedFeature) {
        const clickedFeatureData = clickedFeature as Feature;
        const singleData = {
          year: clickedFeatureData.properties!.Year,
          riskRating: clickedFeatureData.properties!['Risk Rating'],
          assetName: clickedFeatureData.properties!['Asset Name'],
          latitude: (clickedFeatureData.geometry as Point).coordinates[1],
          longitude: (clickedFeatureData.geometry as Point).coordinates[0],
          riskFactors: clickedFeatureData.properties!['Risk Factors'],
          businessCategory: clickedFeatureData.properties!['Business Category'],
        };
        setRowData([singleData]);
      } else {
        const data = extractChartData([filteredFeatures]);
        const tableData = await createRowData(data);
        setRowData(tableData);
      }
    }
  });

  // Risk factor object rendering
  const RiskFactorsCell: React.FC<RiskFactorsCellProps> = ({ value }) => {
    return (
      <div>
        <ul>
          {Object.entries(value).map(([riskFactor, val]) => (
            <li key={riskFactor}>
              {riskFactor}: {val}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  function riskFactorsFilter(params: any) {
    const value = params.value;
    console.log('value:', value);
    const filterText = params.filterText.toLowerCase();
    console.log('Search:', filterText);
    if (typeof value === 'object') {
      return Object.entries(value).some(([key, val]) => {
        const strVal = val as string;
        console.log('StringVal:', strVal);
        return (
          key.toLowerCase().includes(filterText) ||
          strVal.toLowerCase().includes(filterText)
        );
      });
    } else {
      return value.toString().toLowerCase().includes(filterText);
    }
  }

  //Custom comparator for risk factors object
  function riskFactorsComparator(
    filter: string,
    value: any,
    filterText: string,
  ) {
    console.log('Using custom comparator');
    if (typeof value === 'object') {
      //Assuming the object has multiple properties
      return Object.entries(value).some(([key, val]) => {
        //Compare both key and value with filter text
        return key === filterText || val === filterText;
      });
    } else {
      //Fallback to default comparison
      return value === filterText;
    }
  }
  const riskFactorsRowSpan = (params: any) => {
    if (params.data) {
      const riskFactors = params.data['Risk Factors'];
      return Object.keys(riskFactors).length;
    } else {
      return 1;
    }
  };
  //Column headers with filters
  const [columnDefs, setColumnDefs] = useState([
    {
      resizable: true,
      autoHeight: true,
      field: 'Asset Name',
      sortable: true,
      filter: true,
    },
    {
      resizable: true,
      autoHeight: true,
      field: 'Latitude',
      sortable: true,
      filter: true,
    },
    {
      resizable: true,
      autoHeight: true,
      field: 'Longitude',
      sortable: true,
      filter: true,
    },
    {
      resizable: true,
      autoHeight: true,
      field: 'Business Category',
      sortable: true,
      filter: true,
    },
    {
      resizable: true,
      autoHeight: true,
      field: 'Risk Rating',
      sortable: true,
      filter: true,
    },
    {
      resizable: true,
      autoHeight: true,
      field: 'Risk Factors',
      sortable: true,
      filter: 'agTextColumnFilter',
      rowSpan: riskFactorsRowSpan, //creates row span
      cellRendererFramework: RiskFactorsCell, //Custom renderer
      filterParams: { customFilter: riskFactorsComparator }, //Custom filter
    },
    {
      resizable: true,
      autoHeight: true,
      field: 'Year',
      sortable: true,
      filter: true,
    },
  ]);

  const columnsToFit = useCallback((params: FirstDataRenderedEvent) => {
    gridRef.current!.api.sizeColumnsToFit();
  }, []);
  return (
    <div
      className='ag-theme-alpine-dark p-10'
      style={{ height: '100vh', width: '100vw' }}
    >
      <AgGridReact
        pagination={true}
        paginationAutoPageSize={true}
        columnDefs={columnDefs}
        ref={gridRef}
        rowData={rowData}
      ></AgGridReact>
    </div>
  );
}
