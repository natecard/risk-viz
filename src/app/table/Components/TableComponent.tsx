'use client';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { convertJSON, convertToGeoJSON } from '@/app/jsonToGeo';
import { FirstDataRenderedEvent } from 'ag-grid-community';
interface RiskFactorsCellProps {
  value: Record<string, number>;
}
async function createRowData() {
  console.log('Fetching data...');
  //Fetch cached with Next.js 13
  const response = await fetch(process.env.NEXT_PUBLIC_WEB_URL! + '/api/data');
  const data = await response.json();
  console.log('Converting data...');
  let jsonData = convertJSON(data);
  let geoData = convertToGeoJSON(jsonData);
  //Destructure array
  const { features } = geoData;
  console.log('Creating row data...');
  //Initialize rowData array
  let rowData: any = [];
  for (let i = 0; i < features.length; i++) {
    let feature = features[i];
    //Checking properties of features
    if (feature.properties && feature.geometry.type === 'Point') {
      //Push to rowData state for rendering
      rowData.push({
        'Asset Name': feature.properties['Asset Name'],
        Latitude: feature.geometry.coordinates[1],
        Longitude: feature.geometry.coordinates[0],
        'Business Category': feature.properties['Business Category'],
        'Risk Rating': feature.properties['Risk Rating'],
        'Risk Factors': feature.properties['Risk Factors'],
        Year: feature.properties.Year,
      });
    }
  }
  console.log('Row data:', rowData);
  return rowData;
}
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
function riskFactorsComparator(filter: string, value: any, filterText: string) {
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
export default function TableComponent() {
  const gridRef = useRef<AgGridReact<any>>(null);
  //reinitialize array for state
  const [rowData, setRowData] = useState<any>([]);
  useEffect(() => {
    async function fetchData() {
      console.log('Fetching row data...');
      const data = await createRowData();
      console.log('Setting row data...');
      setRowData(data);
    }
    fetchData();
  }, []);
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
        columnDefs={columnDefs}
        ref={gridRef}
        rowData={rowData}
      ></AgGridReact>
    </div>
  );
}