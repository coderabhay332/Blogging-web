// LandingPage.tsx
import React, { FC, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';
import { PenSquare, BookOpen, Users } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

// Define the props for the Button component, including the 'variant' prop
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'default'; // Add the variant prop here
}

// Button component with the custom variant prop
const Button: FC<ButtonProps> = ({ children, className, variant = 'default', ...props }) => (
  <button
    className={`px-4 py-2 font-medium ${
      variant === 'outline'
        ? 'border border-black text-black'
        : 'bg-black text-white'
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Input component with type definitions
const Input: FC<InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input
    className={`px-3 py-2 border border-gray-300 ${className}`}
    {...props}
  />
);

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <a className="flex items-center justify-center" href="#">
          <PenSquare className="h-6 w-6 mr-2" />
          <span className="font-bold text-lg">Bloghub</span>
        </a>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Features
          </a>
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Pricing
          </a>
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </a>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to Bloghub
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Your platform for sharing ideas, stories, and knowledge with the world.
                </p>
              </div>
              <div className="space-x-4">
                <Link to="/signin"> {/* Use Link to navigate to the Signin page */}
                  <Button className="rounded-sm">Get Started</Button>
                </Link>
                <Button className="rounded-sm" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-sm">
                <PenSquare className="h-10 w-10 mb-2" />
                <h2 className="text-xl font-bold">Easy Writing</h2>
                <p className="text-center text-gray-500">Intuitive editor for seamless content creation</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-sm">
                <BookOpen className="h-10 w-10 mb-2" />
                <h2 className="text-xl font-bold">Rich Content</h2>
                <p className="text-center text-gray-500">Support for various media types and formatting</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-sm">
                <Users className="h-10 w-10 mb-2" />
                <h2 className="text-xl font-bold">Community</h2>
                <p className="text-center text-gray-500">Connect with readers and fellow writers</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Start Your Blogging Journey</h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  Join Bloghub today and share your voice with the world.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1 rounded-sm"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button className="rounded-sm" type="submit">
                    Sign Up
                  </Button>
                </form>
                <p className="text-xs text-gray-500">
                  By signing up, you agree to our{" "}
                  <a className="underline underline-offset-2" href="#">
                    Terms & Conditions
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 Bloghub. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  );
}
