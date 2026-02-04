import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  // EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'

export default function EmptyOutline() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        {/* <EmptyMedia variant="icon">
          <IconCloud />
        </EmptyMedia> */}
        <EmptyTitle>No Planned Exercises</EmptyTitle>
        <EmptyDescription>
          Add your first exercise to get started.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm">
          Add new Exercise
        </Button>
      </EmptyContent>
    </Empty>
  )
}
