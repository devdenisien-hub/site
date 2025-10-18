"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Randonnées", href: "/randonnees" },
    { name: "Association", href: "/association" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="Les Mornes Denisien"
                width={80}
                height={80}
                className="rounded-full"
              />
              <span className="text-xl font-bold text-gray-900 hidden sm:block transition-colors duration-200" style={{ '--hover-color': '#888973' } as React.CSSProperties} onMouseEnter={(e) => e.currentTarget.style.color = '#888973'} onMouseLeave={(e) => e.currentTarget.style.color = '#111827'}>
                Les Mornes Denisien
              </span>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-100"
                style={{ '--hover-color': '#888973' } as React.CSSProperties}
                onMouseEnter={(e) => e.currentTarget.style.color = '#888973'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Bouton CTA Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/adhesion"
              className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-105"
              style={{ backgroundColor: '#888973' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6b6d5a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#888973'}
            >
              Adhésion
            </Link>
          </div>

          {/* Bouton Menu Mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 focus:outline-none transition-all duration-200 hover:scale-110"
              style={{ '--hover-color': '#888973' } as React.CSSProperties}
              onMouseEnter={(e) => e.currentTarget.style.color = '#888973'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
              aria-label="Ouvrir le menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out transform ${
            isMenuOpen
              ? "max-h-96 opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-2 overflow-hidden"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMenu}
                className="text-gray-700 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 hover:bg-gray-100"
                style={{ '--hover-color': '#888973' } as React.CSSProperties}
                onMouseEnter={(e) => e.currentTarget.style.color = '#888973'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href="/adhesion"
                onClick={closeMenu}
                className="text-white block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 text-center hover:shadow-md"
                style={{ backgroundColor: '#888973' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6b6d5a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#888973'}
              >
                Rejoindre l'association
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
