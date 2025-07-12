
'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Ship, Send, PackageSearch, Sparkles, Home as HomeIcon, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import React from 'react';
import { createClient } from '@supabase/supabase-js'

const navLinks = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/post-trip', label: 'Post a Trip', icon: Ship },
  { href: '/send-parcel', label: 'Send a Parcel', icon: Send },
  { href: '/dashboard', label: 'Dashboard', icon: PackageSearch },
  { href: '/ai-assistant', label: 'AI Assistant', icon: Sparkles },
];

async function handleSignOut(router: any) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { error } = await supabase.auth.signOut();
  if (!error) {
    router.push('/login');
  } else {
    console.error('Sign out error:', error);
  }
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const router = useRouter();

  React.useEffect(() => {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };

  }, []);

  const pathname = usePathname();

  const NavLink = ({
    href,
    children,
    className,
    isBrand = false,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    isBrand?: boolean;
  }) => {
    const isActive = !isBrand && pathname === href;
    return (
      <Link
        href={href}
        className={cn(
          'nav-link-glass',
          isActive && 'active',
          className
        )}
        onClick={() => setMobileMenuOpen(false)}
      >
        {children}
      </Link>
    );
  };

  const MobileNavLink = ({
    href,
    label,
    icon: Icon,
  }: {
    href: string;
    label: string;
    icon: React.ElementType;
  }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
          isActive && 'bg-accent text-primary'
        )}
        onClick={() => setMobileMenuOpen(false)}
      >
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    );
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300'
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <NavLink href="/" className="font-bold flex items-center gap-2" isBrand>
          <Send className="h-6 w-6 text-primary" />
          <span className="font-headline">delibro</span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 p-1">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
            {user ? (
                <>
                    <span className="text-sm nav-link-glass">Welcome, {user.user_metadata?.name || user.email}</span>
                    <Button variant="ghost" className="nav-link-glass" onClick={() => handleSignOut(router)}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </>
            ) : (
                <>
                    <Button variant="ghost" asChild className="nav-link-glass">
                        <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild className="nav-link-glass">
                        <Link href="/signup">Sign Up</Link>
                    </Button>
                </>
            )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col h-full">
                <div className="border-b p-4">
                  <Link
                    href="/"
                    className="flex items-center gap-2 font-bold text-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Send className="h-6 w-6 text-primary" />
                    <span className="font-headline">delibro</span>
                  </Link>
                </div>
                <nav className="flex-grow grid gap-2 text-lg font-medium p-4">
                  {navLinks.map((link) => (
                    <MobileNavLink key={link.href} {...link} />
                  ))}
                </nav>
                <div className="mt-auto p-4 border-t">
                  <div className="flex flex-col gap-2">
                     {user ? (
                        <Button variant="outline" onClick={() => { handleSignOut(router); setMobileMenuOpen(false); }}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" asChild>
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                            </Button>
                            <Button asChild>
                            <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                            </Button>
                        </>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
