"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Phone, MapPin } from "lucide-react"

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const [bookingData, setBookingData] = useState({
    package: "Silver Package - Complete lawn care",
    packagePrice: "119",
    packageTotal: "400",
    address: "47 Sawbridge Circle, The Woodlands, TX 77381",
    yardSize: "8893",
    addOns: "",
    subtotal: "119.00",
    tax: "7.88",
    total: "126.88",
    customerName: "Customer",
    customerEmail: "customer@example.com",
    phone: "(555) 123-4567",
    dateRange: "Next week",
  })

  useEffect(() => {
    const packageName = searchParams.get("package")
    const packagePrice = searchParams.get("packagePrice")
    const packageTotal = searchParams.get("packageTotal")
    const address = searchParams.get("address")
    const yardSize = searchParams.get("yardSize")
    const addOns = searchParams.get("addOns")
    const subtotal = searchParams.get("subtotal")
    const tax = searchParams.get("tax")
    const total = searchParams.get("total")
    const customerName = searchParams.get("customerName")
    const customerEmail = searchParams.get("customerEmail")
    const phone = searchParams.get("phone")
    const dateRange = searchParams.get("dateRange")

    if (packageName) {
      setBookingData({
        package: packageName || "",
        packagePrice: packagePrice || "119",
        packageTotal: packageTotal || "400",
        address: address || "47 Sawbridge Circle, The Woodlands, TX 77381",
        yardSize: yardSize || "8893",
        addOns: addOns || "",
        subtotal: subtotal || "119.00",
        tax: tax || "7.88",
        total: total || "126.88",
        customerName: customerName || "Customer",
        customerEmail: customerEmail || "customer@example.com",
        phone: phone || "(555) 123-4567",
        dateRange: dateRange || "Next week",
      })
    }
  }, [searchParams])

  const addOnsList = bookingData.addOns
    ? bookingData.addOns.split(",").map((addon) => {
        const [name, price] = addon.split(":")
        return { name, price }
      })
    : []

  const oneTimeServices = addOnsList.filter(
    (addon) => addon.name === "Core Aeration" || addon.name === "Fire Ant Control",
  )
  const perVisitServices = addOnsList.filter((addon) => addon.name === "Bi-Weekly Mosquito Control")
  const regularAddOns = addOnsList.filter(
    (addon) =>
      addon.name !== "Core Aeration" &&
      addon.name !== "Fire Ant Control" &&
      addon.name !== "Bi-Weekly Mosquito Control",
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your lawn care service has been successfully scheduled</p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900">Contact Information</h3>
                <div>
                  <p className="text-base font-medium text-gray-900">{bookingData.customerName}</p>
                  <p className="text-base text-gray-600">{bookingData.customerEmail}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-600" />
                  <p className="text-base text-gray-900">{bookingData.phone}</p>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-base text-gray-900">{bookingData.address}</p>
                    <p className="text-sm text-gray-600">
                      Estimated yard size: {Number(bookingData.yardSize).toLocaleString()} sq ft
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="font-medium">Service Package</Label>
                <p>{bookingData.package}</p>
                <p className="text-sm text-gray-600">${bookingData.packagePrice}/visit</p>
              </div>

              {addOnsList.length > 0 && (
                <div>
                  {oneTimeServices.length > 0 && (
                    <div className="mb-3">
                      <Label className="font-medium">One-Time Services</Label>
                      {oneTimeServices.map((addon, index) => (
                        <p key={index} className="text-sm text-gray-600">
                          {addon.name} - ${addon.price}
                        </p>
                      ))}
                    </div>
                  )}
                  {regularAddOns.length > 0 && (
                    <div>
                      <Label className="font-medium">Additional Services</Label>
                      {regularAddOns.map((addon, index) => (
                        <p key={index} className="text-sm text-gray-600">
                          {addon.name} - ${addon.price}/visit
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <Label className="font-medium">Total due today</Label>
                <p className="text-lg md:text-xl font-bold">${bookingData.total}</p>
                <div className="text-sm text-gray-600">
                  <p>Subtotal: ${bookingData.subtotal}</p>
                  <p>Tax: ${bookingData.tax}</p>
                  {perVisitServices.length > 0 && (
                    <p className="mt-2 italic">First visit of {perVisitServices[0].name} included</p>
                  )}
                </div>
                {oneTimeServices.length > 0 && (
                  <p className="text-xs text-gray-500 italic mt-2">
                    *One-time services will be charged at the time of visit
                  </p>
                )}
                <p className="text-xs text-gray-500 italic mt-2">
                  *Final price will be determined during your visit and may vary based on property conditions
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>What Happens Next</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-emerald-700 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">First Installment Payment</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Click the button below to complete your first payment and confirm your booking. You'll also
                      receive this link via email and SMS.
                    </p>
                    <Button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white">
                      Proceed to Payment <span className="ml-2">→</span>
                    </Button>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-emerald-700 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Service Scheduling</h4>
                    <p className="text-sm text-gray-600">
                      Our team will contact you with more details and the date and time of your service.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-emerald-700 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Pre-Service Preparation</h4>
                    <p className="text-sm text-gray-600">Remove any obstacles from lawn areas</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-emerald-700 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Service Report</h4>
                    <p className="text-sm text-gray-600">Receive detailed report and next service schedule</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preparation Instructions */}
        <Card className="max-w-4xl mx-auto mt-8">
          <CardHeader>
            <CardTitle>Preparation Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Before We Arrive</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Remove toys, furniture, and decorations from lawn</li>
                  <li>• Ensure gates are unlocked for backyard access</li>
                  <li>• Mark any sprinkler heads or hidden obstacles</li>
                  <li>• Keep pets indoors during service</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">After Service</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Keep pets and children off treated areas for 24 hours</li>
                  <li>• Water lawn if recommended by technician</li>
                  <li>• Review service report and recommendations</li>
                  <li>• Schedule any additional services if needed</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Label({ children, className = "", ...props }) {
  return (
    <label className={`block text-sm font-medium text-gray-700 mb-1 ${className}`} {...props}>
      {children}
    </label>
  )
}
