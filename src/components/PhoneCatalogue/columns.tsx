import { Link } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import { Phone } from '~/types/Phone';

export const columns: ColumnDef<Phone>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link
        to="/phones/$id"
        params={{ id: String(row.original.id) }}
        className="text-blue-800 hover:text-blue-600"
        activeProps={{ className: 'text-black font-bold' }}
      >
        {row.getValue('name')}
      </Link>
    ),
  },
  {
    accessorKey: 'manufacturer',
    header: 'Manufacturer',
  },
  {
    accessorKey: 'price',
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];
