import * as LabelPrimitive from '@radix-ui/react-label'

export function Label(props: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>) {
  return <LabelPrimitive.Root className='text-sm text-muted-foreground' {...props} />
}
