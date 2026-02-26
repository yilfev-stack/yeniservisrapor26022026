import { cn } from '@/lib/utils'

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-medium', className ?? 'bg-blue-50 text-blue-700')}>{children}</span>
}
