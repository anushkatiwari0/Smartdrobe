
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-8 px-4 py-12 md:px-6">
        <div className="flex flex-col gap-2">
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary"
            >
              <path
                d="M12 6L12.0001 7.00004M12 6C12.5522 6 13 5.55228 13 5C13 4.44772 12.5522 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M12 10V20.5C12 21.3284 11.3284 22 10.5 22H5.5C4.67157 22 4 21.3284 4 20.5V18.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M12 10V20.5C12 21.3284 12.6716 22 13.5 22H18.5C19.3284 22 20 21.3284 20 20.5V18.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M12 10L12.0001 8.99996M12 10C11.4478 10 11 10.4477 11 11C11 11.5523 11.4478 12 12 12C12.5522 12 13 11.5523 13 11C13 10.4477 12.5522 10 12 10Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M9 5C8.44772 5 8 5.44772 8 6C8 6.55228 8.44772 7 9 7C9.55228 7 10 6.55228 10 6C10 5.44772 9.55228 5 9 5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M15 5C14.4477 5 14 5.44772 14 6C14 6.55228 14.4477 7 15 7C15.5523 7 16 6.55228 16 6C16 5.44772 15.5523 5 15 5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <span className="font-semibold font-headline text-lg">SmartDrobe</span>
          </Link>
          <p className="text-muted-foreground text-sm">
            Your AI-Powered Wardrobe Assistant.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="grid gap-1">
            <h3 className="font-semibold">Quick Links</h3>
            <Link href="#" className="text-sm hover:underline" prefetch={false}>
              Home
            </Link>
            <Link href="#features" className="text-sm hover:underline" prefetch={false}>
              Features
            </Link>
            <Link href="mailto:hello@anushkatiwari.com" className="text-sm hover:underline" prefetch={false}>
              Contact
            </Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Contact</h3>
            <Link href="mailto:hello@anushkatiwari.com" className="text-sm hover:underline" prefetch={false}>
              Email
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold">Get weekly styling tips + AI fashion insights.</h3>
          <form className="flex space-x-2">
            <Input type="email" placeholder="Enter your email" className="max-w-lg flex-1" />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </div>
      <div className="bg-muted py-4">
        <div className="container flex flex-col sm:flex-row items-center justify-between px-4 text-sm text-muted-foreground md:px-6 gap-2">
          <p>&copy; 2026 SmartDrobe. All rights reserved.</p>
          <p>Crafted with ♥ by Anushka Tiwari</p>
        </div>
      </div>
    </footer>
  );
}
