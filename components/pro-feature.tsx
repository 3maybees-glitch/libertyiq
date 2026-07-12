'use client'

import { ProGate } from '@/components/pro-gate'

export function ProFeature({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <ProGate title={title} description={description}>
      {children}
    </ProGate>
  )
}
