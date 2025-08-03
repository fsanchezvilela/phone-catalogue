import { Home } from '~/components/Home';
import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { readCount } from '~/utils/server';

const getCount = createServerFn({
  method: 'GET',
}).handler(() => {
  return readCount();
});

const loader = async () => {
  const count = await getCount();
  return { count };
};

export const Route = createFileRoute('/')({
  component: Home,
  loader: loader,
});
