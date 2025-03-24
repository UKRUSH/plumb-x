import React from 'react';
import Link from 'next/link';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import { MdBusinessCenter } from 'react-icons/md';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    const socialLinks = [
        { icon: <FaFacebookF />, href: "https://facebook.com", label: "Facebook" },
        { icon: <FaTwitter />, href: "https://twitter.com", label: "Twitter" },
        { icon: <FaLinkedinIn />, href: "https://linkedin.com", label: "LinkedIn" },
        { icon: <FaInstagram />, href: "https://instagram.com", label: "Instagram" },
    ];

    const contactInfo = [
        { icon: <FaMapMarkerAlt />, text: "No 103,Highlevel Road,Rathnapura" },
        { icon: <FaPhone />, text: "+94 710181248" },
        { icon: <FaEnvelope />, text: "m&m@gmail.com" },
    ];

    return (
        <footer className="bg-[#fdc501]  text-black py-12 animate-fadeIn">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4 hover:transform hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center gap-2">
                            <MdBusinessCenter className="text-2xl animate-bounce" />
                            <h3 className="text-xl font-bold"> PlumbX</h3>
                        </div>
                        <p className="text-sm leading-relaxed">
                        Streamlining pipe distribution with smart and efficient solutions. Our dedicated team provides exceptional service, innovative inventory management, and quality plumbing supplies to meet all your project needs.
                        </p>
                        <div className="flex gap-4 pt-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-white hover:scale-125 transition-all duration-300"
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="hover:text-white transition-colors duration-300 flex items-center gap-2">
                                    → Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/employees" className="hover:text-white transition-colors duration-300 flex items-center gap-2">
                                    → Employees
                                </Link>
                            </li>
                            <li>
                                <Link href="/departments" className="hover:text-white transition-colors duration-300 flex items-center gap-2">
                                    → Departments
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-white transition-colors duration-300 flex items-center gap-2">
                                    → Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Contact Info</h3>
                        <ul className="space-y-4">
                            {contactInfo.map((info, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    <span className="text-black">{info.icon}</span>
                                    <span className="text-sm">{info.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Location Map */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Find Us</h3>
                        <div className="w-full h-30 bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.952912260219!2d3.375295414770757!3d6.5276316952784755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos!5e0!3m2!1sen!2sng!4v1629291"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Copyright */}
                <div className="mt-1 pt-1 border-t border-gray-800 text-center">
                    <p className="text-sm">
                        © {currentYear} Employee Management System. All rights reserved. | 
                        <Link href="/privacy-policy" className="hover:text-white ml-2 transition-colors duration-300">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;