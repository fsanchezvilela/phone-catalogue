import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorComponent, createFileRoute } from '@tanstack/react-router';
import type { ErrorComponentProps } from '@tanstack/react-router';
import { NotFound } from '~/components/NotFound';
import { RouterContext } from '~/types/Router';
import { phoneQueryOptions } from '~/utils/phone';

export const Route = createFileRoute('/phone/$id')({
  loader: async (ctx) => {
    const { queryClient } = ctx.context as RouterContext;
    const { id } = ctx.params;
    await queryClient.ensureQueryData(phoneQueryOptions(id));
  },
  errorComponent: PhoneErrorComponent,
  component: PhoneDetail,
  notFoundComponent: () => {
    return <NotFound>phone not found</NotFound>;
  },
});

export function PhoneErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />;
}

function PhoneDetail() {
  const params = Route.useParams();
  const phoneQuery = useSuspenseQuery(phoneQueryOptions(params.id));
  const phone = phoneQuery.data;

  return (
    <div className="space-y-2">
      <h4 className="text-xl font-bold underline">{phone.name}</h4>
      <div className="text-sm">{phone.name}</div>
    </div>
  );
}
