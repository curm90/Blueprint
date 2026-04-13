import { Skeleton } from '~/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

export default function ProgressTableSkeleton() {
  const columnWidths = ['w-32', 'w-24', 'w-16', 'w-20', 'w-24', 'w-12']

  return (
    <div className='overflow-hidden rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            {columnWidths.map((w, i) => (
              <TableHead key={i}>
                <Skeleton className={`h-4 ${w}`} />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 6 }).map((_, i) => (
            <TableRow key={i}>
              {columnWidths.map((w, j) => (
                <TableCell key={j}>
                  <Skeleton className={`h-4 ${w}`} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
