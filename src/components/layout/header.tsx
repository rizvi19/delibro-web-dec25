
'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Ship, Send, PackageSearch, Sparkles, Home as HomeIcon, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createSupabaseClient } from '@/lib/supabase/client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '../ui/skeleton';


async function handleSignOut(router: any) {
  const supabase = createSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (!error) {
    router.push('/login'); 
  } else {
    console.error('Sign out error:', error);
  }
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createSupabaseClient();

  useEffect(() => {
    const getInitialUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        } catch (e) {
            console.error("Error fetching user", e)
        } finally {
            setLoading(false);
        }
    }
    
    getInitialUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (event === 'SIGNED_IN') {
         if(pathname.startsWith('/login') || pathname.startsWith('/signup')) {
            router.push('/');
        } else {
            router.refresh();
        }
      }
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });


    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase, pathname]);


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
          isBrand && '!bg-transparent !shadow-none !border-none !text-foreground',
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

  const userInitial = user?.user_metadata?.name?.[0] || user?.email?.[0] || '?';

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
            {loading ? (
                 <Skeleton className="h-10 w-24 rounded-full" />
            ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.name || user.email || ''} />
                        <AvatarFallback className='bg-primary text-primary-foreground'>{userInitial.toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.user_metadata?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild disabled>
                       <Link href="/profile">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleSignOut(router)}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
            <SheetContent side="right" className="p-0">
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
                     {loading ? (
                         <div className="flex items-center gap-4 p-2 mb-2">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[150px]" />
                                <Skeleton className="h-3 w-[120px]" />
                            </div>
                         </div>
                     ) : user ? (
                        <>
                          <div className="flex items-center gap-4 p-2 mb-2">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.name || user.email || ''} />
                              <AvatarFallback className='bg-primary text-primary-foreground'>{userInitial.toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium leading-none">{user.user_metadata?.name}</p>
                              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <MobileNavLink href="/dashboard" label="Dashboard" icon={LayoutDashboard} />
                           <MobileNavLink href="/profile" label="Profile" icon={UserIcon} />

                          <Button variant="outline" onClick={() => { handleSignOut(router); setMobileMenuOpen(false); }}>
                              <LogOut className="mr-2 h-4 w-4" />
                              Sign Out
                          </Button>
                        </>
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

const navLinks = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/post-trip', label: 'Post a Trip', icon: Ship },
  { href: '/send-parcel', label: 'Send a Parcel', icon: Send },
  { href: '/dashboard', label: 'Dashboard', icon: PackageSearch },
  { href: '/ai-assistant', label: 'AI Assistant', icon: Sparkles },
];
