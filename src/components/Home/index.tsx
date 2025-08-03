import { useLoaderData, useRouter } from '@tanstack/react-router';
import { updateCount } from './actions';

export function Home() {
  const router = useRouter();
  const state = useLoaderData({ from: '/' }).count as number;

  return (
    <button
      type="button"
      onClick={() => {
        updateCount({ data: 1 }).then(() => {
          router.invalidate();
        });
      }}
    >
      Add 1 to {state}?
    </button>
  );
}
