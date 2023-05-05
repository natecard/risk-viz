'use client';
export default function ControlPanel(props: { onChange?: any; year?: number }) {
  const { year } = props;
  return (
    <div className='m-2 flex w-4/5 flex-col justify-center rounded border bg-gray-300 px-2'>
      <p>
        Use this to see the different risk factor ratings per year. <br />
        Currently : {year}
      </p>
      <div key={'decade'} className='flex flex-row'>
        <label className='px-2'>Year</label>
        <input
          type='range'
          value={year}
          min={2030}
          max={2070}
          step={10}
          onChange={(evt) => props.onChange(Number(evt.target.value))}
        />
      </div>
    </div>
  );
}
