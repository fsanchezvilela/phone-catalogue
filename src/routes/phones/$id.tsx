import { ErrorComponent, createFileRoute } from '@tanstack/react-router';
import { NotFound } from '~/components/NotFound';
import { PhoneDetail } from '~/components/PhoneCatalogue/PhoneDetail';
import { RouterContext } from '~/types/Router';
import { phoneQueryOptions } from '~/utils/phone';

export const Route = createFileRoute('/phones/$id')({
  loader: async (ctx) => {
    const { queryClient } = ctx.context as RouterContext;
    const { id } = ctx.params;
    await queryClient.ensureQueryData(phoneQueryOptions(id));
  },
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  component: PhoneDetail,
  notFoundComponent: () => {
    return <NotFound>phone not found</NotFound>;
  },
});
