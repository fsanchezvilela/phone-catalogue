import { createServerFileRoute } from '@tanstack/react-start/server';
import phoneSeedResponse from '~/db/seed/phones.json';

export const ServerRoute = createServerFileRoute('/api/phone/').methods({
  GET: async () => {
    return new Response(JSON.stringify(phoneSeedResponse), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
});
