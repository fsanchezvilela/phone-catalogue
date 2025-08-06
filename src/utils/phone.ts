import { queryOptions } from '@tanstack/react-query';
import axios from 'redaxios';

import { Phone } from '~/types/Phone';

export const phonesQueryOptions = () =>
  queryOptions({
    queryKey: ['phones'],
    queryFn: () =>
      axios
        .get<Array<Phone>>('/api/phones')
        .then((r) => r.data)
        .catch(() => {
          throw new Error('Failed to fetch phones catalogue');
        }),
  });

export const phoneQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['phone', id],
    queryFn: () =>
      axios
        .get<Phone>('/api/phones/' + id)
        .then((r) => r.data)
        .catch(() => {
          throw new Error('Failed to fetch phone details');
        }),
  });
