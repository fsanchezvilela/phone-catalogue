import { json } from '@tanstack/react-start';
import { createServerFileRoute } from '@tanstack/react-start/server';
// Importing the seed data from the JSON file
// This file contains the phone data that will be used to respond to requests.
// this can be later a database query
import seed from '~/db/seed/phones.json'; // Adjust the import path as necessary

export const ServerRoute = createServerFileRoute('/api/phone/$id').methods({
  GET: async ({ request, params }) => {
    console.info(`Fetching Phone by id=${params.id}... @`, request.url);
    try {
      const res = seed.find((phone) => phone.id === parseInt(params.id));
      if (!res) {
        throw new Error('Phone not found');
      }
      console.info(`Found Phone:`, res);
      // Return the found user as JSON response
      // Note: The json function is used to create a response with the correct content type
      // and to ensure it can be parsed correctly by the client.
      return json(res, { status: 200 });
    } catch (e) {
      console.error(e);
      return json({ error: 'Phone not found' }, { status: 404 });
    }
  },
});
