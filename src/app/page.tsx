
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowRight,
  Box,
  MapPin,
  ShieldCheck,
  Ship,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Home() {
  const features = [
    {
      icon: <Ship className="h-8 w-8 text-primary" />,
      title: 'Post Your Trip',
      description: 'Share your travel route and earn money on the go.',
    },
    {
      icon: <Box className="h-8 w-8 text-primary" />,
      title: 'Send a Parcel',
      description: 'Get your items delivered faster and cheaper by travelers.',
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: 'Real-Time Tracking',
      description: 'Always know where your parcel is with our tracking system.',
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: 'AI-Powered Meetings',
      description:
        'Our smart assistant suggests the best meeting points for you.',
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Post or Request',
      description:
        'Travelers post their trip details. Senders post their parcel needs.',
    },
    {
      step: 2,
      title: 'Get Matched',
      description:
        'Our system intelligently matches travelers with parcel requests.',
    },
    {
      step: 3,
      title: 'Meet & Handover',
      description: 'Use our AI assistant to find the perfect meeting spot.',
    },
    {
      step: 4,
      title: 'Deliver & Get Paid',
      description:
        'Complete the delivery and receive your payment securely.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-accent/50 w-full overflow-hidden">
            <div className="container mx-auto px-4 py-20 md:py-32">
                <div className="grid md:grid-cols-1 gap-8 items-center">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-foreground mb-4">
                            Ship Smarter, Travel Further
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0 mb-8">
                           delibro connects travelers with individuals who need to send parcels. Turn your extra luggage space into cash or get your items delivered with speed and care.
                        </p>
                        <div className="flex justify-center md:justify-start gap-4 flex-wrap">
                            <Button asChild size="lg" className="font-semibold">
                            <Link href="/send-parcel">
                                Send a Parcel <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="font-semibold">
                            <Link href="/post-trip">
                                Become a Traveler
                            </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">
                How It Works
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                A simple and secure process for everyone.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((item) => (
                <Card key={item.step} className="text-center border-2 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader>
                    <div className="mx-auto bg-accent rounded-full h-12 w-12 flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-primary">{item.step}</span>
                    </div>
                    <CardTitle className="font-headline">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-accent">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">
                Why Choose delibro?
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                We provide features that make your life easier and your
                deliveries safer.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold font-headline mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust & Safety Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="w-full md:w-1/2">
                <Image
                  src="https://placehold.co/600x400.png"
                  alt="Trust and Safety"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                  data-ai-hint="security handshake"
                />
              </div>
              <div className="w-full md:w-1/2">
                <ShieldCheck className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
                  Your Trust, Our Priority
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  We are committed to making delibro a safe and reliable
                  platform. With secure payments, user verification, and dedicated support, you can send and carry parcels with confidence.
                </p>
                <Button variant="link" asChild className="p-0 h-auto text-primary">
                  <Link href="/trust-safety">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-accent">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} delibro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
