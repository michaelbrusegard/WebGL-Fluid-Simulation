import { Loader } from '@/components/ui/loader';

export default function Loading() {
  return (
    <main className='flex h-full w-full items-center justify-center'>
      <Loader size='lg' />
    </main>
  );
}
