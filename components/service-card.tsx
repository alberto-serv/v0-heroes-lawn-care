import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckoutDialog } from "@/components/checkout-dialog"

interface ServiceCardProps {
  title: string
  description: string
  withCta?: boolean
  icon?: React.ReactNode
}

export function ServiceCard({ title, description, withCta = false, icon }: ServiceCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        {icon && <div className="mb-2">{icon}</div>}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      {withCta && (
        <CardFooter>
          <CheckoutDialog serviceName={title} />
        </CardFooter>
      )}
    </Card>
  )
}
