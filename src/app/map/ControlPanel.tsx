export default function ControlPanel(props: {
  onChange?: any;
  decade?: number;
}) {
  const { decade } = props;
  return (
    <div className='mx-12 mt-12 w-2/5 rounded border bg-gray-400 px-2'>
      <h3>Options</h3>
      <p>
        Use this to see the different risk factor ratings per year. <br />
        Currently : <b>{decade}</b>
      </p>
      <div key={'decade'} className='flex flex-row'>
        <label className='px-2'>Year</label>
        <input
          type='range'
          value={decade}
          min={2030}
          max={2070}
          step={10}
          onChange={(evt) => props.onChange(evt.target.value)}
        />
      </div>
    </div>
  );
}
