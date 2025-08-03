import { createFileRoute } from '@tanstack/react-router';
import { PhoneCatalogue } from '~/components/PhoneCatalogue';
import { RouterContext } from '~/types/Router';
import { phonesQueryOptions } from '~/utils/phone';

export const Route = createFileRoute('/')({
  loader: async (ctx) => {
    const { queryClient } = ctx.context as RouterContext;
    await queryClient.ensureQueryData(phonesQueryOptions());
  },
  component: PhoneCatalogue,
});
