import React from 'react';
import Link from 'next/link';

function Footer() {
  return (
    <footer className="bg-[#171B26] text-[#EFEFED] p-8 mt-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About DermaVision AI</h3>
            <p className="text-sm">
              Empowering skin health through advanced AI technology and expert care.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/"><a className="text-sm hover:text-blue-400">Home</a></Link></li>
              <li><Link href="/analysis"><a className="text-sm hover:text-blue-400">Analysis</a></Link></li>
              <li><Link href="/appointments"><a className="text-sm hover:text-blue-400">Appointments</a></Link></li>
              <li><Link href="/education"><a className="text-sm hover:text-blue-400">Education</a></Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-sm">Email: info@dermavisionai.com</p>
            <p className="text-sm">Phone: +1 (555) 123-4567</p>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-2xl hover:text-blue-400" aria-label="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-2xl hover:text-blue-400" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-2xl hover:text-blue-400" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-2xl hover:text-blue-400" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-gray-700 text-center">
          <p className="text-sm">&copy; 2024 DermaVision AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;