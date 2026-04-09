"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"
import Image from "next/image"

export default function ServiceSelectionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [address, setAddress] = useState("")
  const [yardSize, setYardSize] = useState(0)
  const [addressUnverified, setAddressUnverified] = useState(false)

  useEffect(() => {
    const addr = searchParams.get("address")
    const size = searchParams.get("yardSize")
    const unverified = searchParams.get("addressUnverified")

    if (addr) setAddress(decodeURIComponent(addr))
    if (size) setYardSize(Number.parseInt(size))
    if (unverified) setAddressUnverified(unverified === "true")
  }, [searchParams])

  const handleFertilizerForce = () => {
    const params = new URLSearchParams({
      address: address,
      yardSize: yardSize.toString(),
      addressUnverified: addressUnverified.toString(),
    })
    router.push(`/?${params.toString()}`)
  }

  const handleExternalService = () => {
    window.open(
      "https://clienthub.getjobber.com/hubs/c20cde5c-8f7f-4f02-85a0-23f4be1a8b23/public/requests/1577945/new?utm_source=Paid_Gpb_Website_Organic_Search",
      "_blank",
    )
  }

  const services = [
    {
      id: "fertilizer",
      name: "Fertilizer Force",
      tagline: "Bring out your lawn's deepest green",
      image: "/images/fertilizer-lawn.png",
      features: [
        "Full lawn evaluation to identify soil needs, weak spots, and growth issues",
        "Eco-friendly fertilizer applications that feed roots and thicken your turf",
        "Seasonal weed control to stop invasions before they spread",
        "Targeted treatments that prevent disease and improve color",
      ],
      icon: "/images/icon-fertilizer-force.png",
      buttonText: "Get Instant Quote",
      onClick: handleFertilizerForce,
    },
    {
      id: "irrigation",
      name: "Irrigation Army",
      tagline: "Keep your lawn healthy, efficient, and watered",
      image: "/images/irrigation-sprinkler.png",
      features: [
        "Thorough system inspections to keep everything running smoothly",
        "Fast repairs for broken heads, leaks, clogs, and wiring issues",
        "New system installations tailored to your lawn",
        "Seasonal adjustments & maintenance for peak performance",
      ],
      icon: "/images/icon-irrigation-army.png",
      buttonText: "Email Us",
      onClick: () => window.location.href = "mailto:HLC137@heroeslawncare.com?subject=Irrigation Service Request",
    },
    {
      id: "mosquito",
      name: "Mosquito Legion",
      tagline: "Reclaim your outdoor space from biting pests",
      image: "/images/irrigation-sprinkler.png",
      features: [
        "Effective treatments that eliminate mosquitoes at the source",
        "Long-lasting protection for your entire yard",
        "Safe for family, pets, and plants",
        "Seasonal programs to keep pests away all summer",
      ],
      icon: "/images/icon-mosquito-legion.png",
      buttonText: "Email Us",
      onClick: () => window.location.href = "mailto:HLC137@heroeslawncare.com?subject=Mosquito Control Service Request",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50/30">
      <div className="container py-4 md:py-6">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Select Your Service
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            Choose the service that best fits your lawn care needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              {service.id === "fertilizer" ? (
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src="/images/fertilizer-hero.png"
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/10" />
                  <div className="absolute inset-0 flex">
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold tracking-wider drop-shadow-lg">FEED</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold tracking-wider drop-shadow-lg">WEED</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold tracking-wider drop-shadow-lg">PREP</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              )}

              <div className="absolute top-36 left-1/2 -translate-x-1/2 z-10">
                <div className="relative w-20 h-20 rounded-2xl bg-white shadow-xl p-2 ring-4 ring-white">
                  <Image
                    src={service.icon || "/placeholder.svg"}
                    alt={service.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </div>

              <div className="flex-grow p-6 pt-14 flex flex-col">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-3 tracking-tight">{service.name}</h2>

                <p className="text-sm text-gray-600 text-center leading-relaxed mb-6 font-light">{service.tagline}</p>

                <div className="space-y-3 mb-6 flex-grow">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={service.onClick}
                  className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 transition-all duration-200 rounded-xl group-hover:shadow-lg"
                >
                  {service.buttonText}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
