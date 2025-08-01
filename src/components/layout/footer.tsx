import { Send, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href}>
    <span className="text-sm text-gray-300 hover:text-white transition-colors">
      {children}
    </span>
  </Link>
);

const SocialLink = ({ href, icon: Icon }: { href: string; icon: React.ElementType }) => (
  <Link href={href}>
    <span className="text-gray-400 hover:text-white transition-colors">
      <Icon className="h-6 w-6" />
    </span>
  </Link>
);

export default function Footer() {
  const companyLinks = [
    { href: '#', label: 'About us' },
    { href: '#', label: 'Our offerings' },
    { href: '#', label: 'Newsroom' },
    { href: '#', label: 'Investors' },
    { href: '#', label: 'Blog' },
    { href: '#', label: 'Careers' },
  ];

  const productLinks = [
    { href: '/send-parcel', label: 'Send Parcel' },
    { href: '/post-trip', label: 'Post a Trip' },
    { href: '/track', label: 'Track Parcel' },
    { href: '#', label: 'Business' },
  ];

  const citizenshipLinks = [
    { href: '#', label: 'Safety' },
    { href: '#', label: 'Sustainability' },
  ];

  const travelLinks = [
    { href: '#', label: 'Airports' },
    { href: '#', label: 'Cities' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl font-headline">
            <Image src="/logo.png" alt="delibro logo" width={150} height={40} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map(link => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Products</h3>
            <ul className="space-y-3">
              {productLinks.map(link => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Global citizenship</h3>
            <ul className="space-y-3">
              {citizenshipLinks.map(link => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Travel</h3>
            <ul className="space-y-3">
              {travelLinks.map(link => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="flex gap-6 mb-4 md:mb-0">
            <SocialLink href="#" icon={Facebook} />
            <SocialLink href="#" icon={Twitter} />
            <SocialLink href="#" icon={Instagram} />
            <SocialLink href="#" icon={Linkedin} />
          </div>
          <div className="text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Delibro. All rights reserved.</p>
            <div className="flex gap-4 justify-center mt-2">
                <FooterLink href="#">Privacy</FooterLink>
                <FooterLink href="#">Accessibility</FooterLink>
                <FooterLink href="#">Terms</FooterLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
