'use client'

import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

function Drawer({ children, open, onOpenChange }: { children: React.ReactNode, open?: boolean, onOpenChange?: (open: boolean) => void }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  )
}

function DrawerTrigger({ children, ...props }: React.ComponentProps<typeof Dialog.Trigger>) {
  return <Dialog.Trigger {...props}>{children}</Dialog.Trigger>
}

function DrawerClose({ children, ...props }: React.ComponentProps<typeof Dialog.Close>) {
  return <Dialog.Close {...props}>{children}</Dialog.Close>
}

function DrawerPortal({ children }: { children: React.ReactNode }) {
  return <Dialog.Portal>{children}</Dialog.Portal>
}

function DrawerOverlay({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <Dialog.Overlay
      className={cn(
        'fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out',
        className
      )}
      {...props}
    />
  )
}

function DrawerContent({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <Dialog.Content
        className={cn(
          'fixed right-0 top-0 h-full w-3/4 bg-background shadow-lg flex flex-col z-50',
          className
        )}
        {...props}
      >
        {children}
      </Dialog.Content>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-1 p-4', className)} {...props} />
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />
}

function DrawerTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('text-foreground font-semibold', className)} {...props} />
}

function DrawerDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('text-muted-foreground text-sm', className)} {...props} />
}

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
