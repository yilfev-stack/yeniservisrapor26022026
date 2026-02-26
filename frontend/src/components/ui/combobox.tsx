import * as React from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Command } from 'cmdk'
import { ChevronDown } from 'lucide-react'

export function Combobox({ value, onChange, options, placeholder, searchPlaceholder = '' }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string; searchPlaceholder?: string }) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className='flex h-11 w-full items-center justify-between rounded-xl border border-border bg-white px-3 text-left text-sm text-slate-700'>
        {value || placeholder} <ChevronDown size={16} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className='z-50 mt-1 w-[var(--radix-popover-trigger-width)] rounded-xl border border-border bg-white p-2 shadow-lg'>
          <Command>
            <Command.Input placeholder={searchPlaceholder} className='mb-2 h-10 w-full rounded-lg border border-border px-2 text-sm' />
            <Command.List className='max-h-48 overflow-auto'>
              {options.map((item) => (
                <Command.Item key={item} onSelect={() => { onChange(item); setOpen(false) }} className='cursor-pointer rounded-md px-2 py-2 text-sm data-[selected=true]:bg-slate-100'>
                  {item}
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
