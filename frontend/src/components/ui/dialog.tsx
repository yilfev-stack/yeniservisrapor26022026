import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

export const DialogRoot = Dialog.Root
export const DialogTrigger = Dialog.Trigger

export function DialogContent({ children }: { children: React.ReactNode }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className='fixed inset-0 bg-black/40' />
      <Dialog.Content className='fixed left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl'>
        <Dialog.Close className='absolute right-4 top-4'><X size={16} /></Dialog.Close>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  )
}
