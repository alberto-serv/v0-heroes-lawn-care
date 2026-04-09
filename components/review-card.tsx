import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Star } from "lucide-react"

interface ReviewCardProps {
  name: string
  location: string
  review: string
  rating: number
}

export function ReviewCard({ name, location, review, rating }: ReviewCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < rating ? "text-black fill-black" : "text-muted-foreground"}`} />
            ))}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm italic">"{review}"</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <p className="font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{location}</p>
      </CardFooter>
    </Card>
  )
}
