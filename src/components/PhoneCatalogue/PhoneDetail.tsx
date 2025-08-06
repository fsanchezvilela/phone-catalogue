import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';
import { phoneQueryOptions } from '~/utils/phone';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

export const PhoneDetail = () => {
  const params = useParams({ from: '/phones/$id' });
  const phoneQuery = useSuspenseQuery(phoneQueryOptions(params.id));
  const phone = phoneQuery.data;
  if (phoneQuery.isLoading) {
    return <div>Loading...</div>;
  }
  if (phoneQuery.isError) {
    return <div>Error: {phoneQuery.error.message}</div>;
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(phone.price);

  return (
    <section className="container mx-auto p-4">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Phone Details</h1>
        <Card className="shadow-lg rounded-lg grid-rows-1 grid grid-cols-1 md:grid-cols-2 gap-4 place-content-center px-4">
          <figure className="p-4 bg-gray-100 rounded-lg">
            <img
              src={'/images/' + phone.imageFileName}
              alt={phone.name}
              className="w-full h-auto object-cover rounded-lg"
            />
          </figure>
          <section className="p-4 space-y-5">
            <CardHeader>
              <CardTitle>{phone.name}</CardTitle>
              <CardDescription>
                <p className="text-sm text-gray-600 mb-2">{phone.description}</p>
              </CardDescription>
              <CardAction>{formattedPrice}</CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2 capitalize">
                Manufacturer: <strong>{phone.manufacturer}</strong>
              </p>
              <p className="text-sm text-gray-600 mb-2 capitalize">
                Color: <strong>{phone.color}</strong>
              </p>
              <p className="text-sm text-gray-600 mb-2 capitalize">
                Screen: <strong>{phone.screen}</strong>
              </p>
              <p className="text-sm text-gray-600 mb-2 capitalize">
                Processor: <strong>{phone.processor}</strong>
              </p>
              <p className="text-sm text-gray-600 mb-2 capitalize">
                RAM: <strong>{phone.ram} GB</strong>{' '}
              </p>
            </CardContent>
          </section>
          <CardFooter>
            <Link
              to="/"
              className="text-blue-800 hover:text-blue-600 active:text-blue-700 font-medium"
            >
              View Catalogue
            </Link>
          </CardFooter>
        </Card>
      </article>
    </section>
  );
};
