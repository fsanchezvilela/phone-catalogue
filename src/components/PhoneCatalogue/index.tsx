import { useSuspenseQuery } from '@tanstack/react-query';

import { phonesQueryOptions } from '~/utils/phone';
import { columns } from './columns';
import { DataTable } from '~/components/ui/data-table';

export const PhoneCatalogue = () => {
  const phonesQuery = useSuspenseQuery(phonesQueryOptions());

  if (phonesQuery.isLoading) {
    return <div>Loading...</div>;
  }
  if (phonesQuery.isError) {
    return <div>Error: {phonesQuery.error.message}</div>;
  }
  return (
    <div className="p-4">
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Phone Catalogue List</h1>
        <br />
        <p className="mb-4">
          This is a list of phones available in the catalogue. Click on a phone name to view its
          details.
        </p>
        <DataTable columns={columns} data={phonesQuery.data} />
      </div>
    </div>
  );
};
