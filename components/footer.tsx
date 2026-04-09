import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-4">
            <Link href="/">
              <Image
                src="/images/heroes-logo.png"
                alt="Heroes Lawn Care"
                width={150}
                height={50}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              Professional lawn care and landscaping services in The Woodlands, TX and surrounding areas since 2010.
            </p>
          </div>
          <div className="flex md:justify-end">
            <div className="space-y-4">
              <h3 className="text-sm font-bold">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>The Woodlands, TX 77381</li>
                <li>& Surrounding Areas</li>
                <li>(402) 866-8934</li>
                <li>
                  <Link
                    href="https://clienthub.getjobber.com/hubs/0ae5bac0-dfd6-45df-856d-3206cdffc7a1/public/requests/1438026/new?utm_source=Paid_Gpb_Website_Organic_Search"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-muted-foreground">© 2025 Heroes Lawn Care. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary">
              Terms of Service
            </Link>
            <Link
              href="https://www.goserv.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <span>Powered by</span>
              <Image src="/images/serv-logo.png" alt="Serv" width={50} height={16} className="h-4 w-auto" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
