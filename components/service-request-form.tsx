"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check, Loader2, Copy } from "lucide-react"

interface ServiceRequestFormProps {
  serviceName: string
  serviceIcon: string
  emailAddress: string
}

export function ServiceRequestForm({ serviceName, serviceIcon, emailAddress }: ServiceRequestFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [formDataCopied, setFormDataCopied] = useState(false)

  const getFormattedBody = () => {
    return `Customer Name: ${formData.name}\n` +
      `Customer Address: ${formData.address}\n` +
      `Customer Email: ${formData.email}\n` +
      `Customer Phone: ${formData.phone}\n\n` +
      `Service Request Description:\n${formData.description}`
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy email:", err)
    }
  }

  const handleCopyFormData = async () => {
    try {
      await navigator.clipboard.writeText(getFormattedBody())
      setFormDataCopied(true)
      setTimeout(() => setFormDataCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy form data:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 300))

    // Copy form data to clipboard
    try {
      await navigator.clipboard.writeText(getFormattedBody())
    } catch (err) {
      console.error("Failed to copy form data:", err)
    }

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (isSubmitted) {
    return (
      <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">Thank you!</h3>
        <p className="text-muted-foreground mb-6">
          Please email your request details to us. We will get back to you promptly.
        </p>
        
        {/* Email address with copy button */}
        <div className="bg-muted/50 rounded-xl p-4 mb-4">
          <p className="text-sm text-muted-foreground mb-2">Send your request to:</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-semibold text-foreground">{emailAddress}</span>
            <button
              onClick={handleCopyEmail}
              className="p-2 rounded-lg hover:bg-muted transition-colors border border-border"
              title="Copy email address"
              type="button"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
          {copied && (
            <p className="text-xs text-green-600 mt-2">Email copied to clipboard!</p>
          )}
        </div>

        {/* Copy request details button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={handleCopyFormData}
            className="rounded-lg w-full"
          >
            {formDataCopied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-600" />
                Request Details Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Request Details to Paste in Email
              </>
            )}
          </Button>
        </div>
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => {
              setIsSubmitted(false)
              setCopied(false)
              setFormData({ name: "", address: "", email: "", phone: "", description: "" })
            }}
            className="rounded-xl"
          >
            Submit Another Request
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden p-8">
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <img 
            src={serviceIcon} 
            alt={serviceName} 
            className="w-12 h-12 object-contain"
          />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Request {serviceName} Service</h3>
        <p className="text-muted-foreground text-sm">
          Fill out the form below and we will get back to you promptly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
            Customer Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Smith"
            className="h-11 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-foreground mb-1.5">
            Customer Address <span className="text-red-500">*</span>
          </label>
          <Input
            id="address"
            name="address"
            type="text"
            required
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main St, Denver, CO 80246"
            className="h-11 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
            Customer Email <span className="text-red-500">*</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="h-11 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
            Customer Mobile Phone Number <span className="text-red-500">*</span>
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
            className="h-11 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1.5">
            Service Request Description <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="description"
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Please describe what service you need..."
            className="min-h-[100px] rounded-lg resize-none"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 rounded-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Preparing Email...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Submit Request
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground mt-4">
          Your request will be sent to {emailAddress}
        </p>
      </form>

    </div>
  )
}
