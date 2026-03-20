import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface PageBreadcrumbProps {
  href: string
  label: string
  current: string
}

export function PageBreadcrumb({ href, label, current }: PageBreadcrumbProps) {
  return (
    <Breadcrumb className="w-full">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="max-w-[32ch] truncate">
            {current}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
