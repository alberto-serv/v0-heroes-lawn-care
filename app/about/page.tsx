import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function AboutPage() {
  const coreValues = [
    {
      title: "Quality",
      description:
        "We are committed to delivering the highest quality lawn care services that exceed customer expectations.",
    },
    {
      title: "Reliability",
      description: "We show up when we say we will and provide consistent, dependable service you can count on.",
    },
    {
      title: "Expertise",
      description: "Our team has the knowledge and experience to handle all your lawn care and landscaping needs.",
    },
    {
      title: "Customer Focus",
      description: "Your satisfaction is our priority. We listen to your needs and tailor our services accordingly.",
    },
  ]

  const teamMembers = [
    {
      name: "Mike Johnson",
      position: "Founder & Owner",
      bio: "Mike founded Heroes Lawn Care in 2010 with a passion for creating beautiful outdoor spaces in The Woodlands community.",
    },
    {
      name: "Sarah Martinez",
      position: "Operations Manager",
      bio: "Sarah oversees daily operations and ensures every customer receives exceptional service and results.",
    },
    {
      name: "Tom Wilson",
      position: "Lead Landscaper",
      bio: "Tom brings over 12 years of landscaping experience and leads our team of skilled lawn care professionals.",
    },
    {
      name: "Lisa Chen",
      position: "Customer Service",
      bio: "Lisa is dedicated to ensuring every customer has a positive experience with Heroes Lawn Care.",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-green-50 py-16">
        <div className="container text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">About Heroes Lawn Care</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn more about our company, our values, and the team behind The Woodlands' premier lawn care service.
          </p>
        </div>
      </section>

      {/* Company Information */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4">
                <p>
                  Founded in 2010, Heroes Lawn Care has grown from a small local business to the leading provider of
                  lawn care and landscaping services in The Woodlands, TX and surrounding areas. Our journey began with
                  a simple mission: to be the heroes that transform ordinary lawns into extraordinary outdoor spaces.
                </p>
                <p>
                  Over the years, we have built a reputation for excellence, reliability, and exceptional customer
                  service. We serve hundreds of satisfied customers throughout Montgomery County, from residential
                  homeowners to commercial properties, always with the same commitment to quality.
                </p>
                <p>
                  What sets Heroes Lawn Care apart is our dedication to treating every lawn as if it were our own. We
                  believe in building long-term relationships with our clients based on trust, quality work, and
                  outstanding results that make us true lawn care heroes.
                </p>
              </div>
            </div>
            <div className="bg-green-100 h-[400px] flex items-center justify-center rounded-lg">
              <p className="text-muted-foreground">Heroes Lawn Care Team Photo Placeholder</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-green-50/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do and define who we are as your lawn care heroes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value) => (
              <Card key={value.title} className="h-full">
                <CardHeader>
                  <div className="mb-2">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our team of dedicated lawn care professionals is committed to making your property look amazing.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-32 h-32 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
                  <p className="text-muted-foreground">Photo</p>
                </div>
                <h3 className="text-lg md:text-xl font-bold">{member.name}</h3>
                <p className="text-sm text-primary font-medium mb-2">{member.position}</p>
                <p className="text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-green-50/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Achievements</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We take pride in our accomplishments and the trust our community has placed in us.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { number: "13+", label: "Years Serving The Woodlands" },
              { number: "500+", label: "Happy Customers" },
              { number: "2,000+", label: "Lawns Maintained" },
              { number: "15+", label: "Team Members" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-bold mb-2 text-primary">{stat.number}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
