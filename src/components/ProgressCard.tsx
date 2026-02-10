export default function ProgressCard() {
  return (
    <div className="border border-border/50 rounded-lg p-6 bg-card shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-foreground leading-tight">
          Smith Machine Incline Press
        </h2>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Current
            </span>
            <span className="text-lg font-semibold text-foreground">65kg</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Started at
            </span>
            <div className="flex items-center gap-2">
              <span className="text-base text-foreground">50kg</span>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
                +15kg
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <span className="text-sm font-medium text-muted-foreground">
              Last session
            </span>
            <span className="text-sm text-foreground">Feb 6, 2026</span>
          </div>
        </div>
      </div>
    </div>
  )
}
