import HeaderClient from "./header-client";

const menuItems = [
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
];

export function HeroHeader({ isLoggedIn }: { isLoggedIn: boolean }) {
  return <HeaderClient isLoggedIn={isLoggedIn} menuItems={menuItems} />;
}
