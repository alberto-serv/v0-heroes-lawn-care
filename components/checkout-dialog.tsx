"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface CheckoutDialogProps {
  serviceName: string
  buttonText?: string
}

export function CheckoutDialog({ serviceName, buttonText = "Get Quote" }: CheckoutDialogProps) {
  const [open, setOpen] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    setTimeout(() => {
      setOpen(false)
      setFormSubmitted(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        {!formSubmitted ? (
          <>
            <DialogHeader>
              <DialogTitle>Request Quote for {serviceName}</DialogTitle>
              <DialogDescription>Fill out the form below to get a free quote for this service.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
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
                <Input id="address" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional details about your lawn</Label>
                <Textarea id="notes" />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Request Quote
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <div className="py-12 text-center space-y-4">
            <h3 className="text-xl font-medium">Thank you!</h3>
            <p>Your quote request has been submitted. We'll contact you within 24 hours with your free estimate.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
