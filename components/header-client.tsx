"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";

export default function HeaderClient({
  isLoggedIn,
  menuItems,
}: {
  isLoggedIn: boolean;
  menuItems: { name: string; href: string }[];
}) {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className={cn(
          "fixed z-20 w-full transition-all duration-300",
          isScrolled &&
            "bg-background/75 border-b border-black/5 backdrop-blur-lg"
        )}
      >
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative flex flex-wrap items-center justify-between py-3">
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Logo />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 block cursor-pointer p-2.5 lg:hidden"
              >
                {menuState ? (
                  <X className="size-6" />
                ) : (
                  <Menu className="size-6" />
                )}
              </button>

              {/* Desktop menu */}
              <div className="hidden lg:block">
                <ul className="flex gap-1">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={item.href}>{item.name}</Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Dropdown + Auth */}
            <div
              className={cn(
                "hidden w-full flex-col items-end space-y-6 rounded-3xl border p-6 shadow-xl bg-background lg:static lg:flex lg:w-fit lg:flex-row lg:items-center lg:space-y-0 lg:p-0 lg:shadow-none",
                menuState && "block"
              )}
            >
              {/* Mobile menu items */}
              <div className="lg:hidden w-full">
                <ul className="space-y-4 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="block text-muted-foreground hover:text-foreground transition"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Auth buttons */}
              <div className="flex flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0">
                {!isLoggedIn ? (
                  <>
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/login">Login</Link>
                    </Button>

                    <Button
                      asChild
                      size="sm"
                      className="
     
    focus-visible:outline-none focus-visible:ring-0
  "
                    >
                      <Link href="/register">Sign Up</Link>
                    </Button>
                  </>
                ) : (
                  <form action="/api/logout" method="post">
                    <Button
                      type="submit"
                      size="sm"
                      variant="ghost"
                      className="
    text-red-600 
    hover:bg-red-50 
    font-semibold
    cursor-pointer
    focus-visible:ring-0 
    focus-visible:outline-none
  "
                    >
                      Log out
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
