import * as Dialog from '@radix-ui/react-dialog'

export const Sheet = Dialog.Root
export const SheetTrigger = Dialog.Trigger

export function SheetContent({ children }: { children: React.ReactNode }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className='fixed inset-0 bg-black/20' />
      <Dialog.Content className='fixed right-0 top-0 h-full w-[460px] bg-white p-6 shadow-xl'>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  )
}
