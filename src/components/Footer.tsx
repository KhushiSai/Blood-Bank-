import React from 'react';
import { Heart, Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-red-500" />
              <span className="text-2xl font-bold">BloodBank+</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Saving lives through efficient blood bank management. Connect donors with those in need 
              and help build a healthier community together.
            </p>
            <div className="flex space-x-4">
              <div className="bg-red-600 p-2 rounded-full">
                <Heart className="h-5 w-5" />
              </div>
              <span className="text-sm text-gray-300">Trusted by 1000+ hospitals nationwide</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/donors" className="text-gray-300 hover:text-white transition-colors">Find Donors</a></li>
              <li><a href="/inventory" className="text-gray-300 hover:text-white transition-colors">Blood Inventory</a></li>
              <li><a href="/requests" className="text-gray-300 hover:text-white transition-colors">Blood Requests</a></li>
              <li><a href="/register" className="text-gray-300 hover:text-white transition-colors">Register as Donor</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-red-500" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-red-500" />
                <span className="text-gray-300">info@bloodbank.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-red-500" />
                <span className="text-gray-300">123 Medical Center Dr</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2024 BloodBank+. All rights reserved. | Built with care for saving lives.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;