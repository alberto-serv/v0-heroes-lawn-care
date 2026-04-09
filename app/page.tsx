"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  ArrowRight,
  Check,
  LocateFixed,
  CornerDownLeft,
  HelpCircle,
  AlertCircle,
  Bug,
  Leaf,
  Dog,
  Droplets,
  Sparkles,
  Snowflake,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

const getPackagePrice = (packageId: string, yardSize: number) => {
  const pricingTable: Record<string, Record<string, { perVisit: number; total: number }>> = {
    basic: {
      upTo3000: { perVisit: 50, total: 300 },
      upTo5000: { perVisit: 58, total: 350 },
      upTo7000: { perVisit: 67, total: 400 },
      upTo10000: { perVisit: 75, total: 450 },
    },
    plus: {
      upTo3000: { perVisit: 58, total: 350 },
      upTo5000: { perVisit: 67, total: 400 },
      upTo7000: { perVisit: 75, total: 450 },
      upTo10000: { perVisit: 83, total: 500 },
    },
    complete: {
      upTo3000: { perVisit: 67, total: 400 },
      upTo5000: { perVisit: 75, total: 450 },
      upTo7000: { perVisit: 83, total: 500 },
      upTo10000: { perVisit: 92, total: 550 },
    },
  }

  const packagePricing = pricingTable[packageId]
  if (!packagePricing) return { perVisit: 0, total: 0 }

  if (yardSize <= 3000) return packagePricing.upTo3000
  if (yardSize <= 5000) return packagePricing.upTo5000
  if (yardSize <= 7000) return packagePricing.upTo7000
  if (yardSize <= 10000) return packagePricing.upTo10000

  return { perVisit: 0, total: 0 }
}

type ServiceType =
  | "fertilizer"
  | "irrigation"
  | "lawncommand"
  | "mosquito"
  | "plantcare"
  | "petwaste"
  | "snow"
  | null

type MosquitoPlan = "full" | "monthly" | "bimonthly"

type SnowPricingMode = "seasonal" | "perPush"
type SnowDrivewayLength = "short" | "medium" | "long"

type Service = {
  id: Exclude<ServiceType, null>
  name: string
  description: string
  blurb: string
  icon?: string
  Icon?: React.ComponentType<{ className?: string }>
}

const sizeOptions = [
  { value: 0, label: "I don't know", size: 0 },
  { value: 1, label: "Up to 3,000 sq ft", size: 3000 },
  { value: 2, label: "3,000 - 5,000 sq ft", size: 5000 },
  { value: 3, label: "5,000 - 7,000 sq ft", size: 7000 },
  { value: 4, label: "7,000 - 10,000 sq ft", size: 10000 },
  { value: 5, label: "10,000+ sq ft", size: 15000 },
]

export default function HomePage() {
  const router = useRouter()
  const [selectedService, setSelectedService] = useState<ServiceType>("fertilizer")
  const [sizeSliderValue, setSizeSliderValue] = useState(1)
  const [yardSize, setYardSize] = useState(3000)
  const [showAddressField, setShowAddressField] = useState(false)
  const [addressInput, setAddressInput] = useState("")
  const [isLocating, setIsLocating] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [addressNotRecognized, setAddressNotRecognized] = useState(false)
  const [manualCity, setManualCity] = useState("")
  const [manualState, setManualState] = useState("")
  const [manualZip, setManualZip] = useState("")
  const [mosquitoPlan, setMosquitoPlan] = useState<MosquitoPlan>("full")
  const [numDogs, setNumDogs] = useState(1)
  const [snowPricingMode, setSnowPricingMode] = useState<SnowPricingMode>("seasonal")
  const [snowDrivewayLength, setSnowDrivewayLength] = useState<SnowDrivewayLength>("medium")
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const mockAddresses = [
    "123 Woodlands Pkwy, The Woodlands, TX 77380",
    "456 Lake Woodlands Dr, The Woodlands, TX 77381",
    "789 Research Forest Dr, The Woodlands, TX 77382",
    "321 Grogan's Mill Rd, The Woodlands, TX 77380",
    "555 Sawdust Rd, Spring, TX 77380",
    "888 Kuykendahl Rd, Spring, TX 77379",
    "222 Gosling Rd, Spring, TX 77388",
    "444 Rayford Rd, Spring, TX 77386",
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (addressInput.length >= 3) {
      const filtered = mockAddresses.filter((addr) => addr.toLowerCase().includes(addressInput.toLowerCase()))
      setSuggestions(filtered.length > 0 ? filtered : mockAddresses.slice(0, 4))
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [addressInput])

  const handleSliderChange = (value: number[]) => {
    const sliderVal = value[0]
    setSizeSliderValue(sliderVal)
    
    if (sliderVal === 0) {
      setShowAddressField(true)
      setYardSize(3000)
    } else {
      setShowAddressField(false)
      setYardSize(sizeOptions[sliderVal].size)
    }
  }

  const handleGeolocation = () => {
    setIsLocating(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          const mockAddress = mockAddresses[Math.floor(Math.random() * mockAddresses.length)]
          setAddressInput(mockAddress)
          setIsLocating(false)
          const serviceableSizes = [3000, 5000, 7000, 10000]
          const newSize = serviceableSizes[Math.floor(Math.random() * serviceableSizes.length)]
          setYardSize(newSize)
        },
        (error) => {
          console.error("Geolocation error:", error)
          setIsLocating(false)
          alert("Unable to get your location. Please enter your address manually.")
        },
        { timeout: 10000 },
      )
    } else {
      setIsLocating(false)
      alert("Geolocation is not supported by your browser.")
    }
  }

  const handleSelectSuggestion = (address: string) => {
    setAddressInput(address)
    setShowSuggestions(false)
    const sizeIndex = Math.floor(Math.random() * 4) + 1
    const newSize = sizeOptions[sizeIndex].size
    setYardSize(newSize)
    setSizeSliderValue(sizeIndex)
    setShowAddressField(false)
  }

  const services: Service[] = [
    {
      id: "fertilizer",
      name: "Lawn Care",
      description: "Lawn fertilization & weed control",
      blurb: "Keep your lawn lush and weed-free with our seasonal fertilization program. 6 visits per year to maintain a healthy, green lawn.",
      icon: "/images/icon-fertilizer-force.png",
    },
    {
      id: "irrigation",
      name: "Irrigation",
      description: "Repairs, maintenance & winterization",
      blurb: "Seasonal irrigation programs covering drip line and sprinkler head repair, valve covers for up to six zones, and fall winterization to protect your system.",
      icon: "/images/icon-irrigation-army.png",
    },
    {
      id: "lawncommand",
      name: "Landscaping",
      description: "Full lawn & landscape services",
      blurb: "Comprehensive lawn and landscape care including mowing, edging, trimming, and seasonal cleanups tailored to your property.",
      icon: "/images/icon-lawn-command.png",
    },
    {
      id: "mosquito",
      name: "Mosquito Control",
      description: "Eco-friendly seasonal protection",
      blurb: "Reclaim your yard with our environmentally friendly mosquito control program. Full season coverage from March through October keeps your family comfortable all summer long.",
      Icon: Bug,
    },
    {
      id: "plantcare",
      name: "Plant Healthcare",
      description: "Trees, shrubs & ornamentals",
      blurb: "Year-round care for your ornamental trees and shrubs. Deep root feedings, insect prevention, soil testing, and seasonal inspections from certified experts.",
      Icon: Leaf,
    },
    {
      id: "petwaste",
      name: "Pet Waste",
      description: "Weekly dog waste pickup",
      blurb: "Reliable weekly pet waste pickup so your yard stays clean, sanitary, and family-friendly. Simple monthly billing with per-pet pricing.",
      Icon: Dog,
    },
    {
      id: "snow",
      name: "Snow Services",
      description: "Driveway clearing & plowing",
      blurb: "Snow removal for residential driveways. Choose a seasonal package priced by driveway length or pay per push. Available in select regions only: Fargo, New Jersey, and Iowa.",
      Icon: Snowflake,
    },
  ]

  const packages = [
    {
      id: "basic",
      name: "Basic",
      subtitle: "Essential lawn care",
      features: ["Fertilizer Applications", "Crabgrass Pre-emergent", "Weed Control", "Micronutrients"],
    },
    {
      id: "plus",
      name: "Plus",
      subtitle: "Enhanced protection",
      popular: true,
      features: [
        "Everything in Basic",
        "Insect/Grub Control",
        "Soil Amendment",
      ],
    },
    {
      id: "complete",
      name: "Complete",
      subtitle: "Total lawn health",
      features: [
        "Everything in Plus",
        "Fungus Control",
        "Aeration & Overseeding",
      ],
    },
  ]

  const handleSelectPlan = (packageId: string) => {
    const pricing = getPackagePrice(packageId, yardSize)
    const params = new URLSearchParams({
      package: packageId,
      address: addressInput || "",
      yardSize: yardSize.toString(),
      perVisitPrice: pricing.perVisit.toString(),
      packageTotal: pricing.total.toString(),
      addressUnverified: showAddressField ? "true" : "false",
    })
    router.push(`/checkout?${params.toString()}`)
  }

  const handleAddressSubmit = (e: React.FormEvent, isManualEntry = false) => {
    e.preventDefault()
    if (addressInput.trim()) {
      // Check if address is recognized
      const isRecognized = mockAddresses.some(
        (addr) => addr.toLowerCase() === addressInput.toLowerCase()
      )

      if (isRecognized) {
        // Address recognized - get yard size from lookup
        const sizeIndex = Math.floor(Math.random() * 4) + 1
        const newSize = sizeOptions[sizeIndex].size
        setYardSize(newSize)
        setSizeSliderValue(sizeIndex)
        setShowAddressField(false)
        setShowManualEntry(false)
        setAddressNotRecognized(false)
      } else if (!isManualEntry) {
        // Address not recognized - show manual entry option
        setShowManualEntry(true)
      } else {
        // Manual entry also not recognized - use minimum size with warning
        setYardSize(3000)
        setSizeSliderValue(1)
        setShowAddressField(false)
        setShowManualEntry(false)
        setAddressNotRecognized(true)
      }
    }
  }

  const handleManualAddressSubmit = () => {
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent
    handleAddressSubmit(fakeEvent, true)
  }

  const getCurrentSizeLabel = () => {
    return sizeOptions[sizeSliderValue].label
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
              Every Lawn Needs a Hero
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Expert Lawn & Landscape Services
            </p>
            
            {/* Service Selection */}
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-semibold text-foreground mb-6">Select your service</h2>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {services.map((service) => {
                  const LucideIcon = service.Icon
                  return (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`group flex items-center gap-3 px-5 py-3 rounded-full transition-all duration-300 ${
                        selectedService === service.id
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-card border border-border hover:border-primary/50 hover:shadow-md"
                      }`}
                    >
                      {LucideIcon ? (
                        <LucideIcon className="w-6 h-6" />
                      ) : (
                        <img
                          src={service.icon || "/placeholder.svg"}
                          alt=""
                          className="w-7 h-7 object-contain"
                        />
                      )}
                      <span className="font-medium">{service.name}</span>
                    </button>
                  )
                })}
              </div>
              
              {/* Service Blurb */}
              {selectedService && (
                <p className="text-muted-foreground text-center max-w-xl mx-auto">
                  {services.find(s => s.id === selectedService)?.blurb}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Fertilizer Force Content */}
      {selectedService === "fertilizer" && (
        <>
          {/* Size Selector */}
          <section className="py-12 bg-card border-y border-border">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    Select your lawn size
                  </h2>
                  <p className="text-muted-foreground">
                    Get instant pricing based on your property
                  </p>
                </div>
                
                <div className="bg-secondary/50 rounded-2xl p-6 md:p-8">
                  <Slider
                    value={[sizeSliderValue]}
                    onValueChange={handleSliderChange}
                    max={5}
                    min={0}
                    step={1}
                    className="w-full mb-4"
                  />
                  <div className="flex justify-between text-sm">
                    {[
                      { label: "Unknown", value: 0 },
                      { label: "< 3k", value: 1 },
                      { label: "3-5k", value: 2 },
                      { label: "5-7k", value: 3 },
                      { label: "7-10k", value: 4 },
                      { label: "+10k", value: 5 },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSliderChange([option.value])}
                        className={`transition-colors ${
                          sizeSliderValue === option.value 
                            ? "text-primary font-semibold" 
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  
                  {/* Address Field */}
                  {showAddressField && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <p className="text-center text-muted-foreground mb-4 text-sm">
                        Enter your address to estimate lawn size
                      </p>
                      <form onSubmit={handleAddressSubmit}>
                        <div className="relative" ref={suggestionsRef}>
                          <button
                            type="button"
                            onClick={handleGeolocation}
                            disabled={isLocating}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50 z-10"
                          >
                            <LocateFixed className={`h-5 w-5 ${isLocating ? "animate-pulse" : ""}`} />
                          </button>
                          <Input
                            type="text"
                            placeholder="Enter address and press Enter"
                            value={addressInput}
                            onChange={(e) => setAddressInput(e.target.value)}
                            className="pl-12 pr-12 h-14 rounded-xl bg-background border-border text-base"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <CornerDownLeft className="h-5 w-5" />
                          </div>
                          {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
                              {suggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => handleSelectSuggestion(suggestion)}
                                  className="w-full px-4 py-3 text-left text-sm hover:bg-secondary flex items-center gap-3 transition-colors"
                                >
                                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </form>

                      {/* Manual Entry Option */}
                      {showManualEntry && (
                        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                          <div className="flex items-start gap-3 mb-4">
                            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm text-amber-800 font-medium">Address not found in our system</p>
                              <p className="text-sm text-amber-700 mt-1">
                                {"Please enter your full address manually. We'll use estimated pricing based on minimum lot size."}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label htmlFor="manualStreet" className="text-amber-800 text-sm font-medium">Street Address *</label>
                              <Input
                                id="manualStreet"
                                value={addressInput}
                                onChange={(e) => setAddressInput(e.target.value)}
                                placeholder="123 Main Street"
                                className="mt-1 bg-white"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <label htmlFor="manualCityHome" className="text-amber-800 text-sm font-medium">City *</label>
                                <Input
                                  id="manualCityHome"
                                  value={manualCity}
                                  onChange={(e) => setManualCity(e.target.value)}
                                  placeholder="The Woodlands"
                                  className="mt-1 bg-white"
                                />
                              </div>
                              <div>
                                <label htmlFor="manualStateHome" className="text-amber-800 text-sm font-medium">State *</label>
                                <Input
                                  id="manualStateHome"
                                  value={manualState}
                                  onChange={(e) => setManualState(e.target.value)}
                                  placeholder="TX"
                                  className="mt-1 bg-white"
                                  maxLength={2}
                                />
                              </div>
                              <div>
                                <label htmlFor="manualZipHome" className="text-amber-800 text-sm font-medium">ZIP *</label>
                                <Input
                                  id="manualZipHome"
                                  value={manualZip}
                                  onChange={(e) => setManualZip(e.target.value)}
                                  placeholder="77380"
                                  className="mt-1 bg-white"
                                />
                              </div>
                            </div>
                            <Button
                              type="button"
                              onClick={handleManualAddressSubmit}
                              disabled={!addressInput.trim() || !manualCity.trim() || !manualState.trim() || !manualZip.trim()}
                              className="w-full mt-2 h-10 bg-amber-600 hover:bg-amber-700 text-white"
                            >
                              Continue with This Address
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Address Not Recognized Warning */}
                  {addressNotRecognized && !showAddressField && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-green-800 font-medium">Pricing based on minimum lot size</p>
                          <p className="text-sm text-green-700 mt-1">
                            {"We couldn't verify your property size. Prices shown are for properties up to 3,000 sq ft and may be adjusted after we measure your lawn."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Cards */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  Choose your plan
                </h2>
                <p className="text-muted-foreground text-lg">
                  {sizeSliderValue === 0 ? "Select your lawn size for pricing" : sizeSliderValue === 5 ? "Custom pricing for larger properties" : `Pricing for ${getCurrentSizeLabel().toLowerCase()}`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {packages.map((pkg) => {
                  const pricing = getPackagePrice(pkg.id, yardSize)
                  const isCustomQuote = sizeSliderValue === 5
                  return (
                    <div
                      key={pkg.id}
                      className={`relative bg-card rounded-2xl p-6 md:p-8 transition-all duration-300 ${
                        isCustomQuote
                          ? "border border-border opacity-90"
                          : pkg.popular 
                            ? "ring-2 ring-primary shadow-xl scale-[1.02]" 
                            : "border border-border hover:border-primary/30 hover:shadow-lg"
                      }`}
                    >
                      {pkg.popular && !isCustomQuote && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium">
                            Most Popular
                          </span>
                        </div>
                      )}
                      
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-foreground mb-1">{pkg.name}</h3>
                        <p className="text-muted-foreground text-sm">{pkg.subtitle}</p>
                      </div>
                      
                      <div className="mb-6">
                        {isCustomQuote ? (
                          <div className="text-center py-2">
                            <span className="text-2xl font-bold text-foreground">
                              Call for Custom Quote
                            </span>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-bold text-foreground">
                                ${pricing.perVisit}
                              </span>
                              <span className="text-muted-foreground">/visit</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              ${pricing.total} total for 6 visits
                            </p>
                          </>
                        )}
                      </div>
                      
                      <ul className="space-y-3 mb-8">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm">
                            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {isCustomQuote ? (
                        <div className="w-full h-12 rounded-xl font-medium bg-muted text-muted-foreground flex items-center justify-center text-sm">
                          Call for Custom Quote
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleSelectPlan(pkg.id)}
                          className={`w-full h-12 rounded-xl font-medium ${
                            pkg.popular 
                              ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                              : "bg-foreground hover:bg-foreground/90 text-background"
                          }`}
                        >
                          Get Started
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Irrigation Inline Form */}
      {selectedService === "irrigation" && (
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Droplets className="w-5 h-5 text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    Seasonal Program
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Irrigation Repair &amp; Maintenance
                </h2>
                <p className="text-muted-foreground mb-6">
                  Repair of drip lines, sprinkler heads, and valve covers for up to six zones, plus end-of-season winterization.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 p-5 rounded-xl bg-primary/5 border border-primary/20 mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Seasonal Price
                    </p>
                    <p className="text-3xl md:text-4xl font-bold text-foreground">$349</p>
                    <p className="text-sm text-muted-foreground">for the season (up to 6 zones)</p>
                  </div>
                  <ul className="text-sm text-foreground space-y-1.5">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" /> Drip line &amp; sprinkler head repair
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" /> Valve covers (up to 6 zones)
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" /> Fall winterization
                    </li>
                  </ul>
                </div>
                <Button
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  onClick={() => {
                    const params = new URLSearchParams({
                      package: "irrigation",
                      address: addressInput || "",
                      yardSize: yardSize.toString(),
                      perVisitPrice: "349",
                      packageTotal: "349",
                      addressUnverified: showAddressField ? "true" : "false",
                    })
                    router.push(`/checkout?${params.toString()}`)
                  }}
                >
                  Book Irrigation Service
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Landscaping Inline Form */}
      {selectedService === "lawncommand" && (
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
                <iframe
                  src="https://clienthub.getjobber.com/hubs/0ae5bac0-dfd6-45df-856d-3206cdffc7a1/public/requests/1438026/new?utm_source=Paid_Gpb_Website_Organic_Search"
                  className="w-full h-[700px] border-0"
                  title="Landscaping Service Request"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Mosquito Control Section */}
      {selectedService === "mosquito" && (
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-card rounded-2xl border border-border p-6 md:p-10 shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Leaf className="w-5 h-5 text-green-600" />
                  <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                    Environmentally Friendly
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Seasonal Mosquito Control
                </h2>
                <p className="text-muted-foreground mb-6">
                  Full season coverage from March through October using eco-friendly, family-safe treatments.
                </p>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-foreground mb-3">Choose your payment plan</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: "full" as MosquitoPlan,
                        label: "Pay in Full",
                        price: "$499",
                        subtext: "one-time for the season",
                      },
                      {
                        id: "monthly" as MosquitoPlan,
                        label: "Monthly",
                        price: "$62.38",
                        subtext: "/mo × 8 (Mar–Oct)",
                      },
                      {
                        id: "bimonthly" as MosquitoPlan,
                        label: "Bi-Monthly",
                        price: "$124.75",
                        subtext: "every 2 mo × 4",
                      },
                    ].map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setMosquitoPlan(plan.id)}
                        className={`text-left rounded-xl p-4 transition-all ${
                          mosquitoPlan === plan.id
                            ? "ring-2 ring-primary bg-primary/5"
                            : "border border-border hover:border-primary/40"
                        }`}
                      >
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                          {plan.label}
                        </p>
                        <p className="text-2xl font-bold text-foreground">{plan.price}</p>
                        <p className="text-xs text-muted-foreground">{plan.subtext}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Full season coverage (March–October)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Family &amp; pet-safe treatments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Flexible installment options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Barrier treatments around your yard</span>
                  </li>
                </ul>

                <Button
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  onClick={() =>
                    window.open(
                      "https://clienthub.getjobber.com/hubs/0ae5bac0-dfd6-45df-856d-3206cdffc7a1/public/requests/1438026/new?utm_source=Paid_Gpb_Website_Organic_Search",
                      "_blank",
                    )
                  }
                >
                  Request Mosquito Control
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Plant Healthcare Section */}
      {selectedService === "plantcare" && (
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-card rounded-2xl border border-border p-6 md:p-10 shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    Annual Recurring Program
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Plant Healthcare
                </h2>
                <p className="text-muted-foreground mb-6">
                  A full-year care program for your ornamental trees and shrubs, delivered by certified plant health experts.
                </p>

                <div className="flex items-end justify-between p-5 rounded-xl bg-primary/5 border border-primary/20 mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Annual Program
                    </p>
                    <p className="text-4xl md:text-5xl font-bold text-foreground">$500</p>
                    <p className="text-sm text-muted-foreground">per year, all-inclusive</p>
                  </div>
                  <Leaf className="w-12 h-12 text-primary/40 hidden sm:block" />
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Deep root feedings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Insect prevention treatments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Seasonal expert inspections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Soil testing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Preventative nutrient treatments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Preventative pest treatments</span>
                  </li>
                </ul>

                <Button
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  onClick={() =>
                    window.open(
                      "https://clienthub.getjobber.com/hubs/0ae5bac0-dfd6-45df-856d-3206cdffc7a1/public/requests/1438026/new?utm_source=Paid_Gpb_Website_Organic_Search",
                      "_blank",
                    )
                  }
                >
                  Enroll in Plant Healthcare
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pet Waste Section */}
      {selectedService === "petwaste" && (
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-card rounded-2xl border border-border p-6 md:p-10 shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Dog className="w-5 h-5 text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    Weekly Service
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Pet Waste Pickup
                </h2>
                <p className="text-muted-foreground mb-6">
                  Reliable weekly pet waste pickup so your yard stays clean and family-friendly.
                </p>

                <div className="p-5 rounded-xl bg-secondary/50 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <label htmlFor="numDogs" className="text-sm font-medium text-foreground">
                      How many dogs?
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setNumDogs(Math.max(1, numDogs - 1))}
                        className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-background transition-colors"
                        aria-label="Decrease dog count"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-semibold text-lg">{numDogs}</span>
                      <button
                        type="button"
                        onClick={() => setNumDogs(numDogs + 1)}
                        className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-background transition-colors"
                        aria-label="Increase dog count"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm border-t border-border pt-4">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Base fee (weekly service)</span>
                      <span>$50.00</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>
                        Per-pet fee ({numDogs} × $15)
                      </span>
                      <span>${(numDogs * 15).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-foreground font-bold text-lg border-t border-border pt-2">
                      <span>Monthly total</span>
                      <span>${(50 + numDogs * 15).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Weekly pickup schedule</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Sanitary disposal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Simple monthly billing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>No long-term contracts</span>
                  </li>
                </ul>

                <Button
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  onClick={() =>
                    window.open(
                      "https://clienthub.getjobber.com/hubs/0ae5bac0-dfd6-45df-856d-3206cdffc7a1/public/requests/1438026/new?utm_source=Paid_Gpb_Website_Organic_Search",
                      "_blank",
                    )
                  }
                >
                  Sign Up for Pet Waste Service
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Snow Services Section */}
      {selectedService === "snow" && (
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-card rounded-2xl border border-border p-6 md:p-10 shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Snowflake className="w-5 h-5 text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    Seasonal Service
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Snow Services
                </h2>
                <p className="text-muted-foreground mb-4">
                  Residential driveway snow clearing. Choose a seasonal package priced by driveway length, or pay per push.
                </p>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 mb-6">
                  <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-900">Available in select regions only</p>
                    <p className="text-amber-800 mt-0.5">
                      Currently offered in <span className="font-medium">Fargo</span>,{" "}
                      <span className="font-medium">New Jersey</span>, and{" "}
                      <span className="font-medium">Iowa</span>.
                    </p>
                  </div>
                </div>

                <div className="inline-flex rounded-full border border-border p-1 mb-5 bg-secondary/50">
                  <button
                    type="button"
                    onClick={() => setSnowPricingMode("seasonal")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      snowPricingMode === "seasonal"
                        ? "bg-primary text-primary-foreground shadow"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Seasonal package
                  </button>
                  <button
                    type="button"
                    onClick={() => setSnowPricingMode("perPush")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      snowPricingMode === "perPush"
                        ? "bg-primary text-primary-foreground shadow"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Per push
                  </button>
                </div>

                {snowPricingMode === "seasonal" ? (
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-foreground mb-3">
                      Select your driveway length
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          id: "short" as SnowDrivewayLength,
                          label: "Short",
                          sublabel: "1 car length",
                          price: 350,
                        },
                        {
                          id: "medium" as SnowDrivewayLength,
                          label: "Medium",
                          sublabel: "2–3 car lengths",
                          price: 425,
                        },
                        {
                          id: "long" as SnowDrivewayLength,
                          label: "Long / Turnaround",
                          sublabel: "Extra-long or with turnaround",
                          price: 500,
                        },
                      ].map((tier) => (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setSnowDrivewayLength(tier.id)}
                          className={`text-left rounded-xl p-4 transition-all ${
                            snowDrivewayLength === tier.id
                              ? "ring-2 ring-primary bg-primary/5"
                              : "border border-border hover:border-primary/40"
                          }`}
                        >
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                            {tier.label}
                          </p>
                          <p className="text-2xl font-bold text-foreground">
                            ${tier.price}
                          </p>
                          <p className="text-xs text-muted-foreground">{tier.sublabel}</p>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Seasonal pricing ranges from $350 to $500 depending on driveway length.
                    </p>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="flex items-end justify-between p-5 rounded-xl bg-primary/5 border border-primary/20">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                          Pay per push
                        </p>
                        <div className="flex items-baseline gap-1">
                          <p className="text-4xl md:text-5xl font-bold text-foreground">$50</p>
                          <span className="text-muted-foreground">/ push</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Billed each time we clear your driveway.
                        </p>
                      </div>
                      <Snowflake className="w-12 h-12 text-primary/40 hidden sm:block" />
                    </div>
                  </div>
                )}

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Driveway clearing after each snowfall</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Seasonal or per-push billing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Pricing based on driveway length</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Serviced by local crews</span>
                  </li>
                </ul>

                <Button
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  onClick={() =>
                    window.open(
                      "https://clienthub.getjobber.com/hubs/0ae5bac0-dfd6-45df-856d-3206cdffc7a1/public/requests/1438026/new?utm_source=Paid_Gpb_Website_Organic_Search",
                      "_blank",
                    )
                  }
                >
                  Request Snow Service
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Need Help Section */}
      <section className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-muted-foreground mb-4">
              Not sure which service is right for you?
            </p>
            <Button
              variant="outline"
              className="rounded-full px-6 bg-transparent"
              onClick={() => window.open("https://clienthub.getjobber.com/hubs/0ae5bac0-dfd6-45df-856d-3206cdffc7a1/public/requests/1438026/new?utm_source=Paid_Gpb_Website_Organic_Search", "_blank")}
            >
              Get in touch
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
