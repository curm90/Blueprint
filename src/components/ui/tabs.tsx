import React from 'react'
import { cn } from '@/lib/utils'

type TabsProps = {
  defaultValue?: string
  className?: string
  children: React.ReactNode
}

type TabsListProps = {
  className?: string
  children: React.ReactNode
}

type TabsTriggerProps = {
  value: string
  className?: string
  children: React.ReactNode
}

type TabsContentProps = {
  value: string
  className?: string
  children: React.ReactNode
}

const TabsContext = React.createContext<{
  activeTab: string
  setActiveTab: (value: string) => void
}>({
  activeTab: '',
  setActiveTab: () => {},
})

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultValue = '', className, children, ...props }, ref) => {
    const [activeTab, setActiveTab] = React.useState(defaultValue)

    return (
      <TabsContext.Provider value={{ activeTab, setActiveTab }}>
        <div ref={ref} className={cn('', className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    )
  },
)
Tabs.displayName = 'Tabs'

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
)
TabsList.displayName = 'TabsList'

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, className, children, ...props }, ref) => {
    const { activeTab, setActiveTab } = React.useContext(TabsContext)
    const isActive = activeTab === value

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          isActive && 'bg-background text-foreground shadow-sm',
          className,
        )}
        onClick={() => setActiveTab(value)}
        {...props}
      >
        {children}
      </button>
    )
  },
)
TabsTrigger.displayName = 'TabsTrigger'

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, className, children, ...props }, ref) => {
    const { activeTab } = React.useContext(TabsContext)

    if (activeTab !== value) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent }
