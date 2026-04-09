import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckoutDialog } from "@/components/checkout-dialog"
import { Home, Building, Scissors, Sprout, TreePine, Shield, Flower } from "lucide-react"

export default function ServicesPage() {
  const residentialServices = [
    {
      title: "Weekly Lawn Mowing",
      description: "Regular mowing service to keep your lawn healthy and perfectly manicured.",
      icon: <Scissors className="h-6 w-6" />,
    },
    {
      title: "Fertilization Program",
      description: "Customized fertilization schedule to promote lush, green grass growth.",
      icon: <Sprout className="h-6 w-6" />,
    },
    {
      title: "Landscape Design",
      description: "Create beautiful outdoor spaces with our professional landscape design services.",
      icon: <Flower className="h-6 w-6" />,
    },
    {
      title: "Pest & Weed Control",
      description: "Protect your lawn from pests and weeds with our treatment programs.",
      icon: <Shield className="h-6 w-6" />,
    },
    {
      title: "Tree & Shrub Care",
      description: "Professional pruning and care for your trees and shrubs.",
      icon: <TreePine className="h-6 w-6" />,
    },
  ]

  const commercialServices = [
    {
      title: "Commercial Mowing",
      description: "Reliable commercial lawn mowing services for businesses and office complexes.",
      icon: <Scissors className="h-6 w-6" />,
    },
    {
      title: "Property Maintenance",
      description: "Complete property maintenance services for commercial landscapes.",
      icon: <Building className="h-6 w-6" />,
    },
    {
      title: "Seasonal Cleanup",
      description: "Spring and fall cleanup services for commercial properties.",
      icon: <TreePine className="h-6 w-6" />,
    },
    {
      title: "Commercial Landscaping",
      description: "Professional landscaping design and installation for businesses.",
      icon: <Flower className="h-6 w-6" />,
    },
    {
      title: "Snow Removal",
      description: "Winter snow removal services for commercial properties.",
      icon: <Shield className="h-6 w-6" />,
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-green-50 py-16">
        <div className="container text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Our Lawn Care Services</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive lawn care and landscaping services for residential and commercial properties in The Woodlands,
            TX.
          </p>
        </div>
      </section>

      {/* Services Tabs */}
      <section className="py-16">
        <div className="container">
          <Tabs defaultValue="residential" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="residential" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Residential
                </TabsTrigger>
                <TabsTrigger value="commercial" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Commercial
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="residential">
              <div className="text-center mb-8">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">Residential Lawn Care</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Our residential services are designed to keep your home's lawn and landscape beautiful year-round.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {residentialServices.map((service) => (
                  <Card key={service.title} className="h-full flex flex-col">
                    <CardHeader>
                      <div className="mb-2">{service.icon}</div>
                      <CardTitle>{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground">
                        Our experienced lawn care professionals use the latest techniques and high-quality materials to
                        ensure your lawn looks its absolute best.
                      </p>
                    </CardContent>
                    <div className="p-6 pt-0 mt-auto">
                      <CheckoutDialog serviceName={service.title} />
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="commercial">
              <div className="text-center mb-8">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">Commercial Landscaping</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Our commercial services are tailored to meet the unique needs of businesses and commercial properties.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {commercialServices.map((service) => (
                  <Card key={service.title} className="h-full flex flex-col">
                    <CardHeader>
                      <div className="mb-2">{service.icon}</div>
                      <CardTitle>{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground">
                        We understand the importance of maintaining a professional appearance for your business while
                        providing reliable, consistent service.
                      </p>
                    </CardContent>
                    <div className="p-6 pt-0 mt-auto">
                      <CheckoutDialog serviceName={service.title} />
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-green-50/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Process</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We follow a proven process to ensure your complete satisfaction with our lawn care services.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Free Consultation",
                description:
                  "We start with a free consultation to assess your lawn and understand your specific needs.",
              },
              {
                step: "2",
                title: "Custom Plan",
                description: "We create a customized lawn care plan tailored to your property and budget.",
              },
              {
                step: "3",
                title: "Professional Service",
                description: "Our trained professionals execute the plan with precision and attention to detail.",
              },
              {
                step: "4",
                title: "Ongoing Care",
                description: "We provide ongoing maintenance and adjustments to keep your lawn looking perfect.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">{item.step}</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
