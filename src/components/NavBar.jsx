import { useLocation } from "react-router-dom";
import { Component as SterlingGateNav } from "@/components/ui/sterling-gate-kinetic-navigation";

const portfolioNavItems = [
  { label: "Home", to: "/#hero", shape: "1" },
  { label: "Work", to: "/work", shape: "2" },
  { label: "Services", to: "/#services", shape: "2" },
  { label: "Pricing", to: "/#pricing", shape: "4" },
  { label: "Experience", to: "/#experience", shape: "3" },
  { label: "Skills", to: "/#skills", shape: "4" },
  { label: "Thoughts", to: "/#thoughts", shape: "5" },
  { label: "Contact", to: "/#contact", shape: "1" },
];

const NavBar = () => {
  const location = useLocation();
  const isWorkPage = location.pathname === "/work";
  const isArticlePage =
    location.pathname.startsWith("/article") || location.pathname === "/thoughts";

  // Work and article pages mount their own dedicated nav pills
  if (isWorkPage || isArticlePage) {
    return null;
  }

  return (
    <SterlingGateNav
      brandName="Lennox Lewis"
      brandHref="/"
      items={portfolioNavItems}
    />
  );
};

export default NavBar;
