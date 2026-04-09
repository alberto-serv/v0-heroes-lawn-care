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
import { ArrowLeft, User, Check, MapPin, Search, AlertCircle, Loader2, LocateFixed } from "lucide-react"

const getPackagePrice = (packageId: string, yardSize: number) => {
  const pricingTable = {
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

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [serviceAddress, setServiceAddress] = useState("")
  const [yardSize, setYardSize] = useState(0)
  const [addressUnverified, setAddressUnverified] = useState(false)
  const [isLookingUpAddress, setIsLookingUpAddress] = useState(false)
  const [addressInput, setAddressInput] = useState("")
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isGeolocating, setIsGeolocating] = useState(false)
  const suggestionRef = useRef<HTMLDivElement>(null)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [selectedAddOns, setSelectedAddOns] = useState([])
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
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
  const [addressNotRecognized, setAddressNotRecognized] = useState(false)

  // Helper function to parse address components
  const parseAddressComponents = useCallback((address: string) => {
    // Expected format: "123 Main St, City, TX 77000" or "123 Main St, City, State 77000"
    const parts = address.split(",").map(p => p.trim())
    if (parts.length >= 2) {
      // City is typically the second part
      const cityPart = parts[1]
      setCity(cityPart)
      
      // State and ZIP are typically in the last part
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
    monday.setDate(nextWeek.getDate() - nextWeek.getDay() + 1)

    const friday = new Date(monday)
    friday.setDate(monday.getDate() + 4)

    const formatDate = (date) => {
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
  }

  const availableDates = useMemo(() => {
    const dates = []
    const today = new Date()
    let daysAdded = 0
    const currentDate = new Date(today)
    currentDate.setDate(currentDate.getDate() + 1) // Start from tomorrow

    while (daysAdded < 10) {
      if (currentDate.getDay() !== 0) {
        // Skip Sundays
        dates.push(new Date(currentDate))
        daysAdded++
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }
    return dates
  }, [])

  const irrigationTimeSlots = useMemo(
    () => [
      { id: "morning", label: "8:00 AM - 12:00 PM" },
      { id: "afternoon", label: "12:00 PM - 4:00 PM" },
      { id: "evening", label: "4:00 PM - 6:00 PM" },
    ],
    [],
  )

  const availableAddOns = useMemo(() => {
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
  }, [yardSize])

  const hasInitialized = useRef(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Initialize data from URL parameters
  useEffect(() => {
    // Only run once
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

      // Prefer URL-provided pricing (perVisitPrice / packageTotal). Fall back to
      // the lookup table for legacy links that don't include them.
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
    // Don't show suggestions if the input exactly matches a suggestion (user selected it)
    const isExactMatch = mockAddressSuggestions.some(
      (addr) => addr.toLowerCase() === addressInput.toLowerCase()
    )
    
    if (addressInput.length >= 3 && !isExactMatch) {
      const filtered = mockAddressSuggestions.filter((addr) => addr.toLowerCase().includes(addressInput.toLowerCase()))
      // If no matches, show some defaults for the area
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
        // Simulate address lookup and yard size calculation
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Check if address is in our mock suggestions (simulating address recognition)
        const isRecognized = mockAddressSuggestions.some(
          (suggestion) => suggestion.toLowerCase() === address.toLowerCase()
        )

        if (isRecognized) {
          // Address recognized - get yard size from lookup
          const serviceableSizes = [3000, 4500, 5500, 7500]
          const newSize = serviceableSizes[Math.floor(Math.random() * serviceableSizes.length)]

          setServiceAddress(address)
          setYardSize(newSize)
          setAddressUnverified(false)
          setShowManualEntry(false)
          parseAddressComponents(address)

          // Update package pricing based on new yard size
          if (selectedPackage) {
            const newPricing = getPackagePrice(selectedPackage.id, newSize)
            setSelectedPackage((prev) => ({
              ...prev,
              monthlyPrice: newPricing.monthly,
              packageTotal: newPricing.total,
            }))
          }
        } else if (!isManualEntry) {
          // Address not recognized - show manual entry option
          setShowManualEntry(true)
        } else {
          // Manual entry also not recognized - use minimum size with warning
          setServiceAddress(address)
          setYardSize(3000) // Use minimum size
          setAddressUnverified(true)
          setAddressNotRecognized(true)
          setShowManualEntry(false)
          parseAddressComponents(address)

          // Update package pricing to minimum size
          if (selectedPackage) {
            const newPricing = getPackagePrice(selectedPackage.id, 3000)
            setSelectedPackage((prev) => ({
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
    [selectedPackage, mockAddressSuggestions],
  )

  const handleGeolocation = useCallback(async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      return
    }

    setIsGeolocating(true)
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        })
      })

      // Simulate reverse geocoding - in production this would call a real geocoding API
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Mock address based on geolocation
      const mockGeoAddress = "123 Current Location Dr, The Woodlands, TX 77380"
      setAddressInput(mockGeoAddress)
      setShowSuggestions(false)

      // Automatically trigger address lookup
      handleAddressLookupWithAddress(mockGeoAddress)
    } catch (error) {
      console.error("Geolocation error:", error)
      alert("Unable to get your location. Please enter your address manually.")
    } finally {
      setIsGeolocating(false)
    }
  }, [handleAddressLookupWithAddress])

  const handleSelectSuggestion = useCallback(
    (suggestion: string) => {
      setShowSuggestions(false)
      setAddressSuggestions([])
      setAddressInput(suggestion)
      // Automatically look up the selected address
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
        // One-time services: payment collected at time of visit, not included in total
        return sum
      } else if (addOn.perVisit) {
        return sum + addOn.price
      } else {
        // Regular monthly add-ons multiply by 6
        return sum + addOn.price * 6
      }
    }, 0)
    return packagePrice + addOnPrice
  }, [selectedPackage, selectedAddOns])

  const tax = useMemo(() => subtotal * 0.0825, [subtotal])
  const total = useMemo(() => subtotal + tax, [subtotal, tax])

  // Helper function to convert yard size to range format
  const getYardSizeRange = useCallback((size) => {
    if (size <= 3000) return "Up to 3,000"
    if (size <= 5000) return "3,001 to 5,000"
    if (size <= 7000) return "5,001 to 7,000"
    if (size <= 10000) return "7,001 to 10,000"
    return "10,000+"
  }, [])

  // Event handlers
  const handleFileUpload = useCallback((files) => {
    const newFiles = Array.from(files).map((file) => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
    }))
    setUploadedFiles((prev) => [...prev, ...newFiles])
  }, [])

  const handleAddOnToggle = useCallback((addOn) => {
    setSelectedAddOns((prev) => {
      const exists = prev.find((item) => item.id === addOn.id)
      if (exists) {
        return prev.filter((item) => item.id !== addOn.id)
      } else {
        return [...prev, addOn]
      }
    })
  }, [])

  const handleYardSizeChange = useCallback(
    (value: number[]) => {
      const newSize = value[0]
      setYardSize(newSize)

      // Update package pricing based on new yard size
      if (selectedPackage) {
        const newPricing = getPackagePrice(selectedPackage.id, newSize)
        setSelectedPackage((prev) => ({
          ...prev,
          monthlyPrice: newPricing.monthly,
          packageTotal: newPricing.total,
        }))
      }
    },
    [selectedPackage],
  )

  const [selectedScheduleDate, setSelectedScheduleDate] = useState<string | null>(null)
  const [selectedScheduleTime, setSelectedScheduleTime] = useState<string | null>(null)

  const handleBookService = useCallback(async () => {
    setIsLoading(true)
    try {
      // Simulate booking process
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
        <div className="flex items-center mb-8">
          <Link href="/" className="flex items-center text-primary hover:text-primary/80 mr-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Plans
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Complete Your Booking</h1>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Order Flow and Details */}
          <div className="lg:col-span-7">
            <div className="space-y-6">
              {/* Address Entry Card */}
              <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">Enter your address for accurate pricing</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Current prices shown are estimates for smaller properties. Enter your service address to get your exact quote.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3" ref={suggestionRef}>
                  <div className="relative flex-1">
                    <button
                      type="button"
                      onClick={handleGeolocation}
                      disabled={isGeolocating}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors disabled:opacity-50 z-10"
                      title="Use my current location"
                    >
                      <LocateFixed className={`h-5 w-5 ${isGeolocating ? "animate-pulse" : ""}`} />
                    </button>
                    <Input
                      type="text"
                      placeholder="Enter your service address"
                      value={addressInput}
                      onChange={(e) => setAddressInput(e.target.value)}
                      className="pl-10 h-12 bg-white border-gray-200"
                    />
                    {showSuggestions && addressSuggestions.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {addressSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className="w-full px-4 py-3 text-left text-sm hover:bg-green-50 flex items-center gap-2 transition-colors"
                          >
                            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleAddressLookup}
                    disabled={isLookingUpAddress || !addressInput.trim()}
                    className="h-12 px-5 bg-green-200 hover:bg-green-300 text-green-800 font-medium"
                  >
                    {isLookingUpAddress ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Get Exact Quote
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Manual Entry Option */}
                {showManualEntry && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
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
                        <Label htmlFor="manualStreet" className="text-amber-800 text-sm">Street Address *</Label>
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
                          <Label htmlFor="manualCity" className="text-amber-800 text-sm">City *</Label>
                          <Input
                            id="manualCity"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="The Woodlands"
                            className="mt-1 bg-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="manualState" className="text-amber-800 text-sm">State *</Label>
                          <Input
                            id="manualState"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="TX"
                            className="mt-1 bg-white"
                            maxLength={2}
                          />
                        </div>
                        <div>
                          <Label htmlFor="manualZip" className="text-amber-800 text-sm">ZIP *</Label>
                          <Input
                            id="manualZip"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            placeholder="77380"
                            className="mt-1 bg-white"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          const fullAddress = `${addressInput}, ${city}, ${state} ${zipCode}`
                          handleAddressLookupWithAddress(fullAddress, true)
                        }}
                        disabled={!addressInput.trim() || !city.trim() || !state.trim() || !zipCode.trim()}
                        className="w-full mt-2 h-10 bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        Continue with This Address
                      </Button>
                    </div>
                  </div>
                )}

                {/* Address Not Recognized Warning */}
                {addressNotRecognized && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
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
                
                {/* Property Details */}
                {serviceAddress && (
                  <div className="mt-5 pt-5 border-t border-border">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-foreground">Property Details</h4>
                      <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">Adjust if needed</span>
                    </div>
                    <div className="bg-secondary/30 rounded-2xl p-6">
                      <Slider
                        value={[yardSize <= 3000 ? 1 : yardSize <= 5000 ? 2 : yardSize <= 7000 ? 3 : 4]}
                        onValueChange={(value) => {
                          const sizes = [3000, 3000, 4500, 6000, 8500]
                          const newSize = sizes[value[0]]
                          setYardSize(newSize)
                          if (selectedPackage) {
                            const newPricing = getPackagePrice(selectedPackage.id, newSize)
                            setSelectedPackage((prev) => ({
                              ...prev,
                              monthlyPrice: newPricing.monthly,
                              packageTotal: newPricing.total,
                            }))
                          }
                        }}
                        max={4}
                        min={1}
                        step={1}
                        className="w-full mb-4"
                      />
                      <div className="flex justify-between text-sm">
                        {[
                          { label: "< 3k", value: 1 },
                          { label: "3-5k", value: 2 },
                          { label: "5-7k", value: 3 },
                          { label: "7-10k", value: 4 },
                        ].map((option) => {
                          const currentValue = yardSize <= 3000 ? 1 : yardSize <= 5000 ? 2 : yardSize <= 7000 ? 3 : 4
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                const sizes = [3000, 3000, 4500, 6000, 8500]
                                const newSize = sizes[option.value]
                                setYardSize(newSize)
                                if (selectedPackage) {
                                  const newPricing = getPackagePrice(selectedPackage.id, newSize)
                                  setSelectedPackage((prev) => ({
                                    ...prev,
                                    monthlyPrice: newPricing.monthly,
                                    packageTotal: newPricing.total,
                                  }))
                                }
                              }}
                              className={`transition-colors ${
                                currentValue === option.value 
                                  ? "text-primary font-semibold" 
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {option.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Service Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base md:text-lg">
                    <Check className="w-5 h-5 mr-2 text-primary" />
                    Service Selection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{selectedPackage.name}</h3>
                        <p className="text-gray-600">{selectedPackage.subtitle}</p>
                      </div>
                      <div className="text-right">
                        {addressUnverified && (
                          <span className="text-xs text-green-600 font-medium block mb-1">Starting at</span>
                        )}
                        <span className="text-xl md:text-2xl font-bold text-primary">
                          ${selectedPackage.monthlyPrice.toFixed(2)}
                        </span>
                        <span className="text-gray-600">/visit</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Package Includes:</h4>
                        <ul className="space-y-2">
                          {selectedPackage.features.map((feature, index) => (
                            <li key={index} className="flex items-start text-sm">
                              <Check className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold mb-3">Property Details:</h4>
                        <div className="space-y-4 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Estimated yard size:</span>
                            <span className="font-semibold text-emerald-700">{getYardSizeRange(yardSize)} sq ft</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base md:text-lg">
                    <Check className="w-5 h-5 mr-2 text-primary" />
                    Additional Services (Optional)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Enhance your lawn care with these optional add-on services. These can be added to your first service
                    or scheduled separately.
                  </p>

                  <div className="space-y-4">
                    {availableAddOns.map((addOn) => (
                      <div
                        key={addOn.id}
                        className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-start flex-1">
                          <Checkbox
                            checked={selectedAddOns.some((item) => item.id === addOn.id)}
                            onCheckedChange={() => handleAddOnToggle(addOn)}
                            className="mt-1"
                          />
                          <div className="ml-4 flex-1">
                            <h4 className="font-semibold text-gray-900">{addOn.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{addOn.description}</p>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          {addOn.isOneTime ? (
                            <>
                              <span className="font-semibold text-primary text-lg">+${addOn.price}</span>
                              <p className="text-sm text-gray-500 mt-1">one-time</p>
                            </>
                          ) : addOn.perVisit ? (
                            <>
                              <span className="font-semibold text-primary text-lg">+${addOn.price}/visit</span>
                              <p className="text-sm text-gray-500 mt-1">${addOn.price * 6} total (6 visits)</p>
                            </>
                          ) : (
                            <>
                              <span className="font-semibold text-primary text-lg">+${addOn.price}/month</span>
                              <p className="text-sm text-gray-500 mt-1">${addOn.price * 6} total</p>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base md:text-lg">
                    <User className="w-5 h-5 mr-2 text-primary" />
                    Personal Information
                  </CardTitle>
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
                            onChange={(e) => setCustomerInfo((prev) => ({ ...prev, firstName: e.target.value }))}
                            placeholder="John"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={customerInfo.lastName}
                            onChange={(e) => setCustomerInfo((prev) => ({ ...prev, lastName: e.target.value }))}
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
                          We'll use this to contact you about your service appointments.
                        </p>
                      </div>
                      

                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end pt-6 pb-8">
                <Button
                  onClick={handleBookService}
                  disabled={!canBookService || isLoading}
                  size="lg"
                  className="px-8 w-full md:w-auto"
                >
                  {isLoading ? "Processing..." : "Complete Booking"}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Package Header with Total */}
                    {selectedPackage && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {selectedPackage.name} - ${selectedPackage.monthlyPrice.toFixed(2)}/visit
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {addressUnverified ? "Estimated " : ""}6 visits = ${selectedPackage.packageTotal.toFixed(2)}{" "}
                          package total
                        </p>
                      </div>
                    )}

                    <hr />

                    {/* Service Details Section */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Service Details</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Address:</span>
                          <span className="text-gray-900 text-right">{serviceAddress || "Not provided"}</span>
                        </div>
                      </div>
                    </div>

                    {selectedAddOns.some((addon) => addon.isOneTime) && (
                      <>
                        <hr />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">One-Time Services</h4>
                          <div className="space-y-2">
                            {selectedAddOns
                              .filter((addon) => addon.isOneTime)
                              .map((addon) => (
                                <div key={addon.id} className="flex justify-between text-sm">
                                  <span>{addon.name}</span>
                                  <span>+${addon.price.toFixed(2)}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </>
                    )}

                    <hr />

                    {/* Payment Breakdown Section */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Payment Breakdown</h4>
                      <div className="space-y-2">
                        {selectedPackage && (
                          <div className="flex justify-between text-sm">
                            <span>First Installment</span>
                            <span>${selectedPackage.monthlyPrice.toFixed(2)}</span>
                          </div>
                        )}

                        {selectedAddOns
                          .filter((addon) => addon.perVisit)
                          .map((addon) => (
                            <div key={addon.id} className="flex justify-between text-sm">
                              <span>{addon.name} (first visit)</span>
                              <span>+${addon.price.toFixed(2)}</span>
                            </div>
                          ))}

                        {selectedAddOns
                          .filter((addon) => !addon.isOneTime && !addon.perVisit)
                          .map((addon) => (
                            <div key={addon.id} className="flex justify-between text-sm">
                              <span>{addon.name}</span>
                              <span>+${addon.price.toFixed(2)}</span>
                            </div>
                          ))}

                        <div className="flex justify-between text-sm pt-2 border-t">
                          <span>Subtotal</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span>Tax (8.25%)</span>
                          <span>${tax.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between font-semibold text-lg pt-3 border-t">
                          <span>Total due today</span>
                          <span className="text-primary">${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800">
                        <>
                          <span className="font-semibold">Note:</span> This is a preliminary estimate. Final pricing
                          will be determined during your on-site visit and may vary based on property conditions and
                          specific requirements.
                        </>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
