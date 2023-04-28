import Link from 'next/link';

export default async function Home() {
  return (
    <div className=''>
      <main className='flex flex-row justify-center py-72'>
        <div className='px-8'>
          <Link href='/map'>
            <button>Data Map</button>
          </Link>
        </div>
        <div className='px-8'>
          <Link href='/table'>
            <button>Data Table</button>
          </Link>
        </div>
        <div className='px-8'>
          <Link href='/chart'>
            <button>Data Chart</button>
          </Link>
        </div>
      </main>
    </div>
  );
}
