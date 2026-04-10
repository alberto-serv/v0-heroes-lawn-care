"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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

  // Fertilizer packages are charged per visit over a 6-visit season; service
  // packages (mosquito/plant/pet waste/snow/irrigation) are flat-rate.
  const isFertilizerPackage = bookingData.package.startsWith("Lawn Health")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Request Submitted!</h1>
          <p className="text-gray-600">Your lawn care service request has been submitted</p>
        </div>

        <div className="max-w-xl mx-auto">
          <Card>
            <CardContent className="p-6 md:p-8 space-y-6">
              {/* Service Package */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Your Service
                </h3>
                <p className="text-lg font-semibold text-foreground">{bookingData.package}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  {isFertilizerPackage ? (
                    <>
                      <span className="text-base font-bold text-primary">
                        ${bookingData.packagePrice}/visit
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ${bookingData.packageTotal} total (6 visits)
                      </span>
                    </>
                  ) : (
                    <span className="text-base font-bold text-primary">${bookingData.packagePrice}</span>
                  )}
                </div>
              </div>

              {oneTimeServices.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    One-Time Services
                  </h3>
                  {oneTimeServices.map((addon, index) => (
                    <p key={index} className="text-sm text-foreground">
                      {addon.name} <span className="text-muted-foreground">- ${addon.price}</span>
                    </p>
                  ))}
                </div>
              )}

              {regularAddOns.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Additional Services
                  </h3>
                  {regularAddOns.map((addon, index) => (
                    <p key={index} className="text-sm text-foreground">
                      {addon.name}{" "}
                      <span className="text-muted-foreground">
                        - ${addon.price}
                        {isFertilizerPackage ? "/visit" : ""}
                      </span>
                    </p>
                  ))}
                </div>
              )}

              {perVisitServices.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Per-Visit Services
                  </h3>
                  {perVisitServices.map((addon, index) => (
                    <p key={index} className="text-sm text-foreground">
                      {addon.name} <span className="text-muted-foreground">- ${addon.price}/visit</span>
                    </p>
                  ))}
                </div>
              )}

              {/* Next Steps */}
              <div className="border-t border-border pt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Next Steps
                </h3>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-3">
                  <p className="text-sm text-foreground leading-relaxed">Access your Client Hub to:</p>
                  <ul className="text-sm text-foreground space-y-1">
                    <li>{"• Review and approve your quote"}</li>
                    <li>{"• Add a payment method and enable auto-billing"}</li>
                  </ul>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A local representative will contact you to schedule your first visit and confirm final pricing on
                    site.
                  </p>
                  <Button
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white mt-1"
                    onClick={() => window.open("https://clienthub.getjobber.com", "_blank")}
                  >
                    Go to Client Hub
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
