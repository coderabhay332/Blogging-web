import React, { ReactNode } from 'react';
import { PenLine, Zap, Users, Globe } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode; 
  variant?: "default" | "outline"; 
}

// Update the Button component to accept typed props
const Button: React.FC<ButtonProps> = ({ children, variant = "default", ...props }) => (
  <button
    className={`px-4 py-2 rounded-md ${
      variant === "outline" ? "border border-gray-300 hover:bg-gray-100" : "bg-blue-500 text-white hover:bg-blue-600"
    }`}
    {...props}
  >
    {children}
  </button>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    {...props}
  />
);

export default function BlogLandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <a href="#" className="flex items-center justify-center">
          <PenLine className="h-6 w-6 mr-2" />
          <span className="font-bold">BlogHub</span>
        </a>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <a href="#" className="text-sm font-medium hover:underline underline-offset-4">
            Sign In
          </a>
          <a href="#" className="text-sm font-medium hover:underline underline-offset-4">
            Sign Up
          </a>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Share Your Story with the World
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  BlogHub is the perfect platform for writers, thinkers, and storytellers. Start your blogging journey today.
                </p>
              </div>
              <div className="space-x-4">
                <Button>Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Why Choose BlogHub?</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Zap className="h-12 w-12 text-blue-500" />
                <h3 className="text-xl font-bold">Easy to Use</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Intuitive interface that makes blogging a breeze for beginners and pros alike.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Users className="h-12 w-12 text-blue-500" />
                <h3 className="text-xl font-bold">Grow Your Audience</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Built-in tools to help you reach and engage with your readers effectively.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Globe className="h-12 w-12 text-blue-500" />
                <h3 className="text-xl font-bold">Global Reach</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Share your content with readers from around the world effortlessly.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Start Your Blog Today</h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join thousands of bloggers who have already found their voice on BlogHub. It's free to get started!
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input className="max-w-lg flex-1" placeholder="Enter your email" type="email" />
                  <Button type="submit">Sign Up</Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  By signing up, you agree to our{" "}
                  <a href="#" className="underline underline-offset-2">
                    Terms & Conditions
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 BlogHub. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </a>
          <a href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </a>
          <a href="#" className="text-xs hover:underline underline-offset-4">
            Contact
          </a>
        </nav>
      </footer>
    </div>
  );
}
