import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, Outlet } from '@tanstack/react-router';
import { phonesQueryOptions } from '~/utils/phone';

export const PhoneCatalogue = () => {
  const phonesQuery = useSuspenseQuery(phonesQueryOptions());

  return (
    <div className="p-2 flex gap-2">
      <ul className="list-disc pl-4">
        {[...phonesQuery.data].map((phone) => {
          return (
            <li key={phone.id} className="whitespace-nowrap">
              <Link
                to="/phone/$id"
                params={{
                  id: String(phone.id),
                }}
                className="block py-1 text-blue-800 hover:text-blue-600"
                activeProps={{ className: 'text-black font-bold' }}
              >
                <div>{phone.name}</div>
              </Link>
            </li>
          );
        })}
      </ul>
      <hr />
      <Outlet />
    </div>
  );
};
