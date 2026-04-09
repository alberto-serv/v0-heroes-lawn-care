"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Clock, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [prefilledAddress, setPrefilledAddress] = useState("")
  const [selectedPlan, setSelectedPlan] = useState("")
  const searchParams = useSearchParams()

  useEffect(() => {
    const address = searchParams.get("address")
    const plan = searchParams.get("plan")
    if (address) {
      setPrefilledAddress(address)
    }
    if (plan) {
      setSelectedPlan(plan)
    }
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
  }

  const getPlanName = (planId: string) => {
    const plans = {
      bronze: "Bronze Package",
      silver: "Silver Package",
      gold: "Gold Package",
    }
    return plans[planId as keyof typeof plans] || ""
  }

  const faqs = [
    {
      question: "What areas do you serve?",
      answer:
        "We serve The Woodlands, TX and surrounding areas including Spring, Conroe, Tomball, Magnolia, and other Montgomery County communities within a 15-mile radius.",
    },
    {
      question: "Do you offer free estimates?",
      answer:
        "Yes, we provide free estimates for all our lawn care and landscaping services. You can request an estimate through our contact form or by calling our office.",
    },
    {
      question: "How often do you mow lawns?",
      answer:
        "We typically mow lawns weekly during the growing season (spring through fall). However, we can adjust the frequency based on your lawn's needs and your preferences.",
    },
    {
      question: "Are you licensed and insured?",
      answer:
        "Yes, Heroes Lawn Care is fully licensed and insured. All our team members are trained professionals who take pride in their work.",
    },
    {
      question: "Do you offer seasonal services?",
      answer:
        "We provide year-round services including spring cleanup, fall leaf removal, winter preparation, and seasonal landscaping for residential and commercial properties.",
    },
  ]

  const serviceAreas = [
    "The Woodlands",
    "Spring",
    "Conroe",
    "Tomball",
    "Magnolia",
    "Oak Ridge North",
    "Shenandoah",
    "Panorama Village",
    "Willis",
    "Montgomery",
    "Pinehurst",
    "Cut and Shoot",
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-green-50 py-16">
        <div className="container text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Contact Heroes Lawn Care</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to transform your lawn? Get in touch with our team for a free consultation and quote.
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedPlan ? `Get Quote for ${getPlanName(selectedPlan)}` : "Get Your Free Quote"}
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 24 hours with your free estimate.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!formSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First name</Label>
                          <Input id="first-name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last name</Label>
                          <Input id="last-name" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="tel" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Property Address</Label>
                        <Input id="address" defaultValue={prefilledAddress} required />
                      </div>
                      {selectedPlan && (
                        <div className="space-y-2">
                          <Label htmlFor="selected-plan">Selected Plan</Label>
                          <Input id="selected-plan" value={getPlanName(selectedPlan)} disabled />
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="service">Service Needed</Label>
                        <select
                          id="service"
                          defaultValue={selectedPlan ? "fertilizer-package" : ""}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Select a service</option>
                          <option value="fertilizer-package">Heroes Fertilizer Force Package</option>
                          <option value="lawn-mowing">Lawn Mowing</option>
                          <option value="landscaping">Landscaping</option>
                          <option value="seasonal-cleanup">Seasonal Cleanup</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Tell us about your project</Label>
                        <Textarea id="message" rows={5} required />
                      </div>
                      <Button type="submit" className="bg-primary hover:bg-primary/90">
                        Get My Free Quote
                      </Button>
                    </form>
                  ) : (
                    <div className="py-12 text-center space-y-4">
                      <h3 className="text-lg md:text-xl font-medium">Thank you for your request!</h3>
                      <p>We've received your information and will contact you within 24 hours with your free quote.</p>
                      <Button onClick={() => setFormSubmitted(false)} className="bg-primary hover:bg-primary/90">
                        Send Another Request
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <p className="font-medium">Service Area</p>
                      <p className="text-sm text-muted-foreground">The Woodlands, TX 77381</p>
                      <p className="text-sm text-muted-foreground">& Surrounding Areas</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">(402) 866-8934</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <p className="font-medium">Business Hours</p>
                      <p className="text-sm text-muted-foreground">Monday - Friday: 7:00 AM - 6:00 PM</p>
                      <p className="text-sm text-muted-foreground">Saturday: 8:00 AM - 4:00 PM</p>
                      <p className="text-sm text-muted-foreground">Sunday: Closed</p>
                      <p className="text-sm font-medium mt-2 text-primary">Emergency Services Available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {serviceAreas.map((area) => (
                      <div key={area} className="text-sm">
                        {area}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-green-50/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to our most commonly asked questions about our lawn care services. If you don't see what
              you're looking for, please contact us.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Service Area</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We proudly serve The Woodlands, TX and surrounding Montgomery County communities.
            </p>
          </div>
          <div className="bg-green-100 h-[400px] flex items-center justify-center rounded-lg">
            <p className="text-muted-foreground">The Woodlands, TX Service Area Map Placeholder</p>
          </div>
        </div>
      </section>
    </div>
  )
}
