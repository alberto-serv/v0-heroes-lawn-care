"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css"

import { ArrowLeft, Check, MapPin, Loader2, LocateFixed, ChevronDown, ChevronUp } from "lucide-react"

function addBusinessDays(date: Date, days: number) {
  const result = new Date(date)
  let added = 0
  while (added < days) {
    result.setDate(result.getDate() + 1)
    const day = result.getDay()
    if (day !== 0 && day !== 6) added++
  }
  return result
}

const getPackagePrice = (packageId: string, yardSize: number) => {
  const pricingTable: Record<
    string,
    {
      upTo3000: { monthly: number; total: number }
      upTo5000: { monthly: number; total: number }
      upTo7000: { monthly: number; total: number }
      upTo10000: { monthly: number; total: number }
    }
  > = {
    basic: {
      upTo3000: { monthly: 50, total: 300 },
      upTo5000: { monthly: 58.33, total: 350 },
      upTo7000: { monthly: 66.67, total: 400 },
      upTo10000: { monthly: 75, total: 450 },
    },
    plus: {
      upTo3000: { monthly: 58.33, total: 350 },
      upTo5000: { monthly: 66.67, total: 400 },
      upTo7000: { monthly: 75, total: 450 },
      upTo10000: { monthly: 83.33, total: 500 },
    },
    complete: {
      upTo3000: { monthly: 66.67, total: 400 },
      upTo5000: { monthly: 75, total: 450 },
      upTo7000: { monthly: 83.33, total: 500 },
      upTo10000: { monthly: 91.67, total: 550 },
    },
  }

  const packagePricing = pricingTable[packageId]
  if (!packagePricing) return { monthly: 0, total: 0 }

  if (yardSize <= 3000) return packagePricing.upTo3000
  if (yardSize <= 5000) return packagePricing.upTo5000
  if (yardSize <= 7000) return packagePricing.upTo7000
  if (yardSize <= 10000) return packagePricing.upTo10000

  return { monthly: 0, total: 0 }
}

const FERTILIZER_PACKAGE_IDS = new Set(["basic", "plus", "complete"])

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const [selectedPackage, setSelectedPackage] = useState<any>(null)
  const [serviceAddress, setServiceAddress] = useState("")
  const [yardSize, setYardSize] = useState(0)
  const [addressUnverified, setAddressUnverified] = useState(false)
  const [isLookingUpAddress, setIsLookingUpAddress] = useState(false)
  const [addressInput, setAddressInput] = useState("")
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isGeolocating, setIsGeolocating] = useState(false)
  const suggestionRef = useRef<HTMLDivElement>(null)
  const [selectedAddOns, setSelectedAddOns] = useState<any[]>([])
  const [phoneNumber, setPhoneNumber] = useState("")
  const [customerInfo, setCustomerInfo] = useState<{ firstName: string; lastName: string; email: string }>({
    firstName: "",
    lastName: "",
    email: "",
  })
  const [city, setCity] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [state, setState] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [showFeatures, setShowFeatures] = useState(false)
  const [addressNotRecognized, setAddressNotRecognized] = useState(false)

  const minStartDateObj = useMemo(() => addBusinessDays(new Date(), 3), [])
  const [preferredStartDateObj, setPreferredStartDateObj] = useState<Date>(minStartDateObj)
  const [scheduleComments, setScheduleComments] = useState("")

  // Helper function to parse address components
  const parseAddressComponents = useCallback((address: string) => {
    const parts = address.split(",").map((p) => p.trim())
    if (parts.length >= 2) {
      const cityPart = parts[1]
      setCity(cityPart)

      const lastPart = parts[parts.length - 1]
      const stateZipMatch = lastPart.match(/([A-Z]{2})\s*(\d{5})/)
      if (stateZipMatch) {
        setState(stateZipMatch[1])
        setZipCode(stateZipMatch[2])
      } else {
        const zipMatch = lastPart.match(/\d{5}/)
        if (zipMatch) {
          setZipCode(zipMatch[0])
        }
      }
    }
  }, [])

  // Calculate next week's dates
  const nextWeekDates = useMemo(() => {
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)

    const monday = new Date(nextWeek)
    // Shift to the Monday of next week (nextWeek.getDay(): 0 = Sun, 1 = Mon, ...)
    monday.setDate(nextWeek.getDate() - nextWeek.getDay() + 1)

    const friday = new Date(monday)
    friday.setDate(monday.getDate() + 4)

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        weekday: "short",
      })
    }

    return {
      start: formatDate(monday),
      end: formatDate(friday),
    }
  }, [])

  // Static data
  const packages: Record<
    string,
    {
      name: string
      subtitle: string
      monthlyPrice: number
      packageTotal: number
      features: string[]
    }
  > = {
    basic: {
      name: "Lawn Health Basic",
      subtitle: "Seasonal applications of fertilizer and targeted weed control",
      monthlyPrice: 50,
      packageTotal: 300,
      features: ["Fertilizer Applications", "Crabgrass Pre-emergent", "Weed Control as needed", "Micronutrients"],
    },
    plus: {
      name: "Lawn Health Plus",
      subtitle: "Seasonal applications of fertilizer and targeted weed controls, insect control, and soil amendment",
      monthlyPrice: 58.33,
      packageTotal: 350,
      features: [
        "Fertilizer Applications",
        "Crabgrass Pre-emergent",
        "Weed Control as needed",
        "Micronutrients",
        "Insect/Grub Control",
        "Soil Amendment",
      ],
    },
    complete: {
      name: "Lawn Health Complete",
      subtitle:
        "All the benefits of our Plus package with the addition of fungus control. Also, included aeration and overseeding which helps maintain a healthy lawn year after year",
      monthlyPrice: 66.67,
      packageTotal: 400,
      features: [
        "Fertilizer Applications",
        "Crabgrass Pre-emergent",
        "Weed Control as needed",
        "Micronutrients",
        "Insect/Grub Control",
        "Soil Amendment",
        "Fungus Control",
        "Aeration with Overseeding",
      ],
    },
    irrigation: {
      name: "Irrigation Repair & Maintenance",
      subtitle:
        "Seasonal program covering drip lines, sprinkler heads, valve covers for up to six zones, plus end-of-season winterization",
      monthlyPrice: 349,
      packageTotal: 349,
      features: [
        "Drip line & sprinkler head repair",
        "Valve covers (up to 6 zones)",
        "Fall winterization",
      ],
    },
    "irrigation-service-call": {
      name: "Irrigation Service Call",
      subtitle:
        "Includes inspection of the system with minor adjustments, and a quote for repairs and improvements. Larger lawns may have a higher evaluation fee. Repairs will have an additional cost.",
      monthlyPrice: 200,
      packageTotal: 200,
      features: [
        "Full system inspection",
        "Minor adjustments included",
        "Quote for repairs & improvements",
        "Repairs billed separately",
      ],
    },
    mosquito: {
      name: "Mosquito Control",
      subtitle:
        "Full season mosquito control (March through October) using family and pet-safe treatments.",
      monthlyPrice: 499,
      packageTotal: 499,
      features: [
        "Full season coverage (March–October)",
        "Family & pet-safe treatments",
        "Flexible installment options",
        "Barrier treatments around your yard",
      ],
    },
    plantcare: {
      name: "Plant Healthcare",
      subtitle:
        "Annual care program for ornamental trees and shrubs (up to 12 plants), 4 seasonal visits.",
      monthlyPrice: 125,
      packageTotal: 500,
      features: [
        "Deep root feedings",
        "Insect prevention treatments",
        "Seasonal expert inspections",
        "Soil testing",
      ],
    },
    petwaste: {
      name: "Pet Waste Pickup",
      subtitle: "Weekly pet waste pickup to keep your yard clean, sanitary, and family-friendly.",
      monthlyPrice: 65,
      packageTotal: 65,
      features: [
        "Weekly pickup schedule",
        "Sanitary disposal",
        "Simple monthly billing",
        "No long-term contracts",
      ],
    },
    snow: {
      name: "Snow Services",
      subtitle: "Residential driveway snow clearing, seasonal package or per-push pricing.",
      monthlyPrice: 425,
      packageTotal: 425,
      features: [
        "Driveway clearing after each snowfall",
        "Seasonal or per-push billing",
        "Pricing based on driveway length",
        "Serviced by local crews",
      ],
    },
    "landscaping-refresh": {
      name: "Landscaping Refresh",
      subtitle: "Seasonal cleanup, mulch, and bed edging to refresh your property.",
      monthlyPrice: 499,
      packageTotal: 499,
      features: [
        "Mulch refresh (up to 4 yards)",
        "Bed edging & shaping",
        "Weed pull & bed cleanup",
        "Shrub trimming",
      ],
    },
    "landscaping-transform": {
      name: "Landscaping Transform",
      subtitle: "New plantings, soil prep, and bed redesign for a fresh look.",
      monthlyPrice: 1999,
      packageTotal: 1999,
      features: [
        "Mulch refresh & bed edging",
        "New plantings (up to 15 specimens)",
        "Soil amendment & prep",
        "Bed redesign consultation",
      ],
    },
    "landscaping-design": {
      name: "Landscaping Design & Build",
      subtitle: "Full landscape design with hardscape installation and planting.",
      monthlyPrice: 4999,
      packageTotal: 4999,
      features: [
        "Custom landscape design plan",
        "Hardscape installation (patios, walkways)",
        "Tree & large specimen planting",
        "Full install & cleanup",
      ],
    },
  }

  const LANDSCAPING_PACKAGE_IDS = new Set([
    "landscaping-refresh",
    "landscaping-transform",
    "landscaping-design",
  ])

  const isFertilizerPackage = selectedPackage
    ? FERTILIZER_PACKAGE_IDS.has(selectedPackage.id)
    : true

  const availableAddOns = useMemo(() => {
    // Mosquito package has a single Tick Control add-on.
    if (selectedPackage && selectedPackage.id === "mosquito") {
      return [
        {
          id: "tick-control",
          name: "Tick Control",
          price: 45,
          perVisit: true,
          description: "Targeted tick treatments applied alongside your mosquito service",
        },
      ]
    }

    // Landscaping packages have their own one-time project add-ons.
    if (selectedPackage && LANDSCAPING_PACKAGE_IDS.has(selectedPackage.id)) {
      return [
        {
          id: "mulch-install",
          name: "Additional Mulch Installation",
          price: 199,
          isOneTime: true,
          description: "One-time add-on: Extra mulch coverage beyond base package (per 2 yards)",
        },
        {
          id: "bed-edging",
          name: "Extended Bed Edging",
          price: 149,
          isOneTime: true,
          description: "One-time add-on: Clean, deep edging for additional bed linear footage",
        },
        {
          id: "seasonal-cleanup",
          name: "Seasonal Cleanup",
          price: 249,
          isOneTime: true,
          description: "One-time add-on: Leaf removal, bed clearing, and debris haul-away",
        },
      ]
    }

    // For other non-fertilizer service packages, show generic recurring add-ons.
    if (selectedPackage && !FERTILIZER_PACKAGE_IDS.has(selectedPackage.id)) {
      return [
        {
          id: "addon-1",
          name: "Add-on 1",
          price: 25,
          perVisit: true,
          description: "Recurring add-on service",
        },
        {
          id: "addon-2",
          name: "Add-on 2",
          price: 35,
          perVisit: true,
          description: "Recurring add-on service",
        },
        {
          id: "addon-3",
          name: "Add-on 3",
          price: 50,
          perVisit: true,
          description: "Recurring add-on service",
        },
      ]
    }

    const getPriceByYardSize = (prices: { 3000?: number; 5000?: number; 7000?: number; 10000?: number }) => {
      if (yardSize <= 3000) return prices[3000] ?? 0
      if (yardSize <= 5000) return prices[5000] ?? 0
      if (yardSize <= 7000) return prices[7000] ?? 0
      return prices[10000] ?? 0
    }

    return [
      {
        id: "bi-weekly-mosquito",
        name: "Bi-Weekly Mosquito Control",
        price: getPriceByYardSize({ 3000: 60, 5000: 70, 7000: 80, 10000: 95 }),
        perVisit: true,
        description: "Per visit service: Ongoing mosquito protection with bi-weekly treatments",
      },
      {
        id: "core-aeration",
        name: "Core Aeration",
        price: getPriceByYardSize({ 3000: 180, 5000: 210, 7000: 220, 10000: 235 }),
        isOneTime: true,
        description: "One-time service: Improves soil health and oxygen circulation (1 visit per year)",
      },
      {
        id: "fire-ant-control",
        name: "Fire Ant Control",
        price: getPriceByYardSize({ 3000: 120, 5000: 155, 7000: 195, 10000: 255 }),
        isOneTime: true,
        description: "One-time service: Eliminates fire ant colonies and prevents new infestations (1 visit per year)",
      },
    ]
  }, [yardSize, selectedPackage])

  const hasInitialized = useRef(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Initialize data from URL parameters
  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    const packageId = searchParams.get("package")
    const address = searchParams.get("address")
    const size = searchParams.get("yardSize") || searchParams.get("size")
    const unverified = searchParams.get("addressUnverified") === "true"
    const perVisitPriceParam = searchParams.get("perVisitPrice")
    const packageTotalParam = searchParams.get("packageTotal")

    if (packageId && packages[packageId]) {
      const basePackage = packages[packageId]
      const yardSizeNum = size ? Number.parseInt(size) : 2000

      // Prefer URL-provided pricing. Fall back to lookup table for legacy links.
      const urlPerVisit = perVisitPriceParam ? Number.parseFloat(perVisitPriceParam) : NaN
      const urlTotal = packageTotalParam ? Number.parseFloat(packageTotalParam) : NaN
      const fallback = getPackagePrice(packageId, yardSizeNum)

      const monthlyPrice = Number.isFinite(urlPerVisit) ? urlPerVisit : fallback.monthly || basePackage.monthlyPrice
      const packageTotal = Number.isFinite(urlTotal) ? urlTotal : fallback.total || basePackage.packageTotal

      const dynamicPackage = {
        ...basePackage,
        id: packageId,
        monthlyPrice,
        packageTotal,
      }
      setSelectedPackage(dynamicPackage)
      setYardSize(yardSizeNum)
    }
    if (address) {
      setServiceAddress(address)
      setAddressInput(address)
      parseAddressComponents(address)
    }
    setAddressUnverified(unverified || !address)
  }, [searchParams, parseAddressComponents])

  const mockAddressSuggestions = useMemo(
    () => [
      "123 Oak Street, The Woodlands, TX 77380",
      "456 Pine Avenue, The Woodlands, TX 77381",
      "789 Maple Drive, The Woodlands, TX 77382",
      "321 Cedar Lane, Spring, TX 77373",
      "654 Birch Court, Conroe, TX 77304",
      "987 Willow Way, Tomball, TX 77375",
      "147 Elm Boulevard, Magnolia, TX 77354",
      "258 Ash Road, Montgomery, TX 77356",
    ],
    [],
  )

  useEffect(() => {
    const isExactMatch = mockAddressSuggestions.some(
      (addr) => addr.toLowerCase() === addressInput.toLowerCase(),
    )

    if (addressInput.length >= 3 && !isExactMatch) {
      const filtered = mockAddressSuggestions.filter((addr) =>
        addr.toLowerCase().includes(addressInput.toLowerCase()),
      )
      setAddressSuggestions(filtered.length > 0 ? filtered.slice(0, 5) : mockAddressSuggestions.slice(0, 5))
      setShowSuggestions(true)
    } else {
      setAddressSuggestions([])
      setShowSuggestions(false)
    }
  }, [addressInput, mockAddressSuggestions])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleAddressLookupWithAddress = useCallback(
    async (address: string, isManualEntry = false) => {
      if (!address.trim()) return

      setIsLookingUpAddress(true)
      setAddressNotRecognized(false)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const isRecognized = mockAddressSuggestions.some(
          (suggestion) => suggestion.toLowerCase() === address.toLowerCase(),
        )

        if (isRecognized) {
          const serviceableSizes = [3000, 4500, 5500, 7500]
          const newSize = serviceableSizes[Math.floor(Math.random() * serviceableSizes.length)]

          setServiceAddress(address)
          setYardSize(newSize)
          setAddressUnverified(false)
          setShowManualEntry(false)
          parseAddressComponents(address)

          // Only recompute pricing for fertilizer packages — service packages
          // (mosquito/plantcare/petwaste/snow) are not yard-size dependent.
          if (selectedPackage && FERTILIZER_PACKAGE_IDS.has(selectedPackage.id)) {
            const newPricing = getPackagePrice(selectedPackage.id, newSize)
            setSelectedPackage((prev: any) => ({
              ...prev,
              monthlyPrice: newPricing.monthly,
              packageTotal: newPricing.total,
            }))
          }
        } else if (!isManualEntry) {
          setShowManualEntry(true)
        } else {
          setServiceAddress(address)
          setYardSize(3000)
          setAddressUnverified(true)
          setAddressNotRecognized(true)
          setShowManualEntry(false)
          parseAddressComponents(address)

          if (selectedPackage && FERTILIZER_PACKAGE_IDS.has(selectedPackage.id)) {
            const newPricing = getPackagePrice(selectedPackage.id, 3000)
            setSelectedPackage((prev: any) => ({
              ...prev,
              monthlyPrice: newPricing.monthly,
              packageTotal: newPricing.total,
            }))
          }
        }
      } catch (error) {
        console.error("Address lookup failed:", error)
      } finally {
        setIsLookingUpAddress(false)
      }
    },
    [selectedPackage, mockAddressSuggestions, parseAddressComponents],
  )

  const handleGeolocation = useCallback(async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      return
    }

    setIsGeolocating(true)
    try {
      await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        })
      })

      await new Promise((resolve) => setTimeout(resolve, 800))

      const mockGeoAddress = "123 Current Location Dr, The Woodlands, TX 77380"
      setAddressInput(mockGeoAddress)
      setServiceAddress(mockGeoAddress)
      setShowSuggestions(false)
      parseAddressComponents(mockGeoAddress)

      handleAddressLookupWithAddress(mockGeoAddress)
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 800))
      const mockGeoAddress = "123 Current Location Dr, The Woodlands, TX 77380"
      setAddressInput(mockGeoAddress)
      setServiceAddress(mockGeoAddress)
      setShowSuggestions(false)
      parseAddressComponents(mockGeoAddress)
      handleAddressLookupWithAddress(mockGeoAddress)
    } finally {
      setIsGeolocating(false)
    }
  }, [handleAddressLookupWithAddress, parseAddressComponents])

  const handleSelectSuggestion = useCallback(
    (suggestion: string) => {
      setShowSuggestions(false)
      setAddressSuggestions([])
      setAddressInput(suggestion)
      handleAddressLookupWithAddress(suggestion)
    },
    [handleAddressLookupWithAddress],
  )

  const handleAddressLookup = useCallback(async () => {
    handleAddressLookupWithAddress(addressInput)
  }, [addressInput, handleAddressLookupWithAddress])

  // Calculate pricing
  const subtotal = useMemo(() => {
    if (!selectedPackage) return 0
    const packagePrice = selectedPackage.monthlyPrice
    const addOnPrice = selectedAddOns.reduce((sum, addOn) => {
      if (addOn.isOneTime) {
        return sum
      } else if (addOn.perVisit) {
        return sum + addOn.price
      } else {
        return sum + addOn.price * 6
      }
    }, 0)
    return packagePrice + addOnPrice
  }, [selectedPackage, selectedAddOns])

  const tax = useMemo(() => subtotal * 0.0825, [subtotal])
  const total = useMemo(() => subtotal + tax, [subtotal, tax])

  const handleAddOnToggle = useCallback((addOn: any) => {
    setSelectedAddOns((prev) => {
      const exists = prev.find((item) => item.id === addOn.id)
      if (exists) {
        return prev.filter((item) => item.id !== addOn.id)
      } else {
        return [...prev, addOn]
      }
    })
  }, [])

  const handleBookService = useCallback(async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const bookingData = {
        package: selectedPackage.name,
        packagePrice: selectedPackage.monthlyPrice.toFixed(2),
        packageTotal: selectedPackage.packageTotal.toString(),
        address: serviceAddress,
        yardSize: yardSize.toString(),
        addOns: selectedAddOns.map((addon) => `${addon.name}:${addon.price}`).join(","),
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`.trim(),
        customerEmail: customerInfo.email,
        phone: phoneNumber,
        dateRange: `${nextWeekDates.start} - ${nextWeekDates.end}`,
      }

      const params = new URLSearchParams(bookingData)
      window.location.href = `/checkout/confirmation?${params.toString()}`
    } catch (error) {
      console.error("Booking failed:", error)
    } finally {
      setIsLoading(false)
    }
  }, [
    selectedPackage,
    serviceAddress,
    yardSize,
    selectedAddOns,
    subtotal,
    tax,
    total,
    customerInfo,
    phoneNumber,
    nextWeekDates,
  ])

  const canBookService = useMemo(() => {
    return (
      customerInfo.firstName && customerInfo.lastName && customerInfo.email && phoneNumber.trim()
    )
  }, [customerInfo, phoneNumber])

  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p>Please wait while we load your selected package.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Plans
          </Link>
          <h1 className="font-bold text-gray-900 text-3xl text-center">Book your Service</h1>
        </div>

        {/* Centered Layout */}
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6">
            {/* Service Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base md:text-lg">Your Service</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 p-4 md:p-6 rounded-lg">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900">{selectedPackage.name}</h3>
                        {isFertilizerPackage && yardSize > 10000 ? (
                          <span className="text-lg font-bold text-foreground">Contact Us for Pricing</span>
                        ) : (
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg md:text-2xl font-bold text-primary">
                              ${selectedPackage.monthlyPrice.toFixed(2)}
                            </span>
                            {isFertilizerPackage && (
                              <span className="text-gray-600 text-sm">/visit</span>
                            )}
                            {selectedPackage.id === "plantcare" && (
                              <span className="text-gray-600 text-sm">/visit</span>
                            )}
                          </div>
                        )}
                      </div>
                      {isFertilizerPackage && yardSize <= 10000 && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          ${selectedPackage.packageTotal} total (6 visits)
                        </p>
                      )}
                      {selectedPackage.id === "plantcare" && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          ${selectedPackage.packageTotal} total (4 visits)
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-2">{selectedPackage.subtitle}</p>
                      <button
                        type="button"
                        onClick={() => setShowFeatures(!showFeatures)}
                        className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-2 hover:underline"
                      >
                        {showFeatures ? "Hide details" : "See what's included"}
                        {showFeatures ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                      </button>
                      {showFeatures && (
                        <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                          {selectedPackage.features.map((feature: string, i: number) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                              <Check className="h-4 w-4 text-primary shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base md:text-lg">Your Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Preferred start date</Label>
                    <div className="mt-2 rounded-lg border border-border p-3 flex justify-center">
                      <DayPicker
                        mode="single"
                        required
                        selected={preferredStartDateObj}
                        onSelect={(date) => date && setPreferredStartDateObj(date)}
                        disabled={{ before: minStartDateObj }}
                        defaultMonth={preferredStartDateObj}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="scheduleComments">Scheduling notes (optional)</Label>
                    <Textarea
                      id="scheduleComments"
                      value={scheduleComments}
                      onChange={(e) => setScheduleComments(e.target.value)}
                      placeholder="e.g. free in the afternoon, gate code 1234, please call before arrival"
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base md:text-lg">
                  Additional Services (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableAddOns.map((addOn) => (
                    <div key={addOn.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-start">
                        <Checkbox
                          checked={selectedAddOns.some((item) => item.id === addOn.id)}
                          onCheckedChange={() => handleAddOnToggle(addOn)}
                          className="mt-1"
                        />
                        <div className="ml-4 flex-1 min-w-0">
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <h4 className="font-semibold text-gray-900">{addOn.name}</h4>
                            {addOn.isOneTime ? (
                              <span className="font-semibold text-primary">
                                +${addOn.price}{" "}
                                <span className="text-sm font-normal text-gray-500">one-time</span>
                              </span>
                            ) : !isFertilizerPackage ? (
                              <span className="font-semibold text-primary">+${addOn.price}</span>
                            ) : addOn.perVisit ? (
                              <span className="font-semibold text-primary">
                                +${addOn.price}/visit{" "}
                                <span className="text-sm font-normal text-gray-500">
                                  ${addOn.price * 6} total (6 visits)
                                </span>
                              </span>
                            ) : (
                              <span className="font-semibold text-primary">
                                +${addOn.price}/month{" "}
                                <span className="text-sm font-normal text-gray-500">
                                  ${addOn.price * 6} total
                                </span>
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{addOn.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base md:text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={customerInfo.firstName}
                          onChange={(e) =>
                            setCustomerInfo((prev) => ({ ...prev, firstName: e.target.value }))
                          }
                          placeholder="John"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={customerInfo.lastName}
                          onChange={(e) =>
                            setCustomerInfo((prev) => ({ ...prev, lastName: e.target.value }))
                          }
                          placeholder="Doe"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="john@example.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Mobile Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="(555) 123-4567"
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        We&apos;ll use this to contact you about your service appointments.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Entry Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-3" ref={suggestionRef}>
                  <div className="relative flex-1">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={handleGeolocation}
                        disabled={isGeolocating}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors disabled:opacity-50"
                        title="Use my current location"
                      >
                        {isGeolocating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <LocateFixed className="h-4 w-4" />
                        )}
                      </button>
                      <Input
                        value={addressInput}
                        onChange={(e) => setAddressInput(e.target.value)}
                        placeholder="Enter your service address"
                        className="pl-10"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setShowSuggestions(false)
                            handleAddressLookup()
                          }
                        }}
                      />
                    </div>
                    {showSuggestions && addressSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {addressSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-sm border-b last:border-b-0"
                            onClick={() => handleSelectSuggestion(suggestion)}
                          >
                            <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {isLookingUpAddress && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-primary">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Looking up your address...
                  </div>
                )}

                {addressNotRecognized && !isLookingUpAddress && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      We couldn&apos;t verify this address. Pricing shown is based on a minimum yard size and may
                      be adjusted after an on-site assessment.
                    </p>
                  </div>
                )}

                {serviceAddress && !isLookingUpAddress && !addressNotRecognized && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <p className="text-sm text-gray-700">
                      Address verified. Estimated yard size: {yardSize.toLocaleString()} sq ft. Prices have been
                      updated.
                    </p>
                  </div>
                )}

                {/* Property Details Slider */}
                {serviceAddress && isFertilizerPackage && (
                  <div className="mt-5 pt-5 border-t border-border">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-foreground">Property Details</h4>
                      <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                        Adjust if needed
                      </span>
                    </div>
                    <div className="bg-secondary/30 rounded-2xl p-6">
                      <Slider
                        value={[
                          yardSize > 10000
                            ? 5
                            : yardSize <= 3000
                              ? 1
                              : yardSize <= 5000
                                ? 2
                                : yardSize <= 7000
                                  ? 3
                                  : 4,
                        ]}
                        onValueChange={(value) => {
                          const sizes = [3000, 3000, 4500, 6000, 8500, 15000]
                          const newSize = sizes[value[0]]
                          setYardSize(newSize)
                          if (newSize <= 10000 && selectedPackage) {
                            const newPricing = getPackagePrice(selectedPackage.id, newSize)
                            setSelectedPackage((prev: any) => ({
                              ...prev,
                              monthlyPrice: newPricing.monthly,
                              packageTotal: newPricing.total,
                            }))
                          }
                        }}
                        max={5}
                        min={1}
                        step={1}
                        className="w-full mb-4"
                      />
                      <div className="flex justify-between text-xs">
                        {[
                          { label: "X-Small", sublabel: "< 3,000 sq ft", value: 1 },
                          { label: "Small", sublabel: "3-5,000 sq ft", value: 2 },
                          { label: "Standard", sublabel: "5-7,000 sq ft", value: 3 },
                          { label: "Large", sublabel: "7-10,000 sq ft", value: 4 },
                          { label: "Estate", sublabel: "+10,000 sq ft", value: 5 },
                        ].map((option) => {
                          const currentValue =
                            yardSize > 10000
                              ? 5
                              : yardSize <= 3000
                                ? 1
                                : yardSize <= 5000
                                  ? 2
                                  : yardSize <= 7000
                                    ? 3
                                    : 4
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                const sizes = [3000, 3000, 4500, 6000, 8500, 15000]
                                const newSize = sizes[option.value]
                                setYardSize(newSize)
                                if (newSize <= 10000 && selectedPackage) {
                                  const newPricing = getPackagePrice(selectedPackage.id, newSize)
                                  setSelectedPackage((prev: any) => ({
                                    ...prev,
                                    monthlyPrice: newPricing.monthly,
                                    packageTotal: newPricing.total,
                                  }))
                                }
                              }}
                              className={`flex flex-col items-center gap-0.5 transition-colors ${
                                currentValue === option.value
                                  ? "text-primary font-semibold"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <span>{option.label}</span>
                              <span className="text-[10px] font-normal">{option.sublabel}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end pt-6 pb-8">
              {isFertilizerPackage && yardSize > 10000 ? (
                <a
                  href="https://clienthub.getjobber.com/hubs/0ae5bac0-dfd6-45df-856d-3206cdffc7a1/public/requests/1438026/new?utm_source=Paid_Gpb_Website_Organic_Search"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 rounded-xl font-medium bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center text-sm transition-colors"
                >
                  Contact Us for a Quote
                </a>
              ) : (
                <Button
                  onClick={handleBookService}
                  disabled={!canBookService || isLoading}
                  size="lg"
                  className="px-16 w-full"
                >
                  {isLoading ? "Processing..." : "Book Service"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
