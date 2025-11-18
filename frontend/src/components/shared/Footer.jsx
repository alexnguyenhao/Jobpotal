import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Briefcase,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* --- TOP SECTION: GRID LAYOUT --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* 1. Brand & Social */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-[#6A38C2] p-1.5 rounded-lg">
                <Briefcase className="text-white w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Job<span className="text-[#6A38C2]">Portal</span>
              </h1>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Connecting talent with opportunity. Your dream career starts here.
              Join the fastest growing job platform today.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 pt-2">
              <SocialLink
                href="#"
                icon={Facebook}
                color="hover:text-blue-600"
              />
              <SocialLink href="#" icon={Twitter} color="hover:text-sky-500" />
              <SocialLink
                href="#"
                icon={Instagram}
                color="hover:text-pink-500"
              />
              <SocialLink
                href="#"
                icon={Linkedin}
                color="hover:text-blue-700"
              />
            </div>
          </div>

          {/* 2. For Candidates */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">For Candidates</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <Link
                  to="/jobs"
                  className="hover:text-[#6A38C2] transition-colors"
                >
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/browse"
                  className="hover:text-[#6A38C2] transition-colors"
                >
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/cv/home"
                  className="hover:text-[#6A38C2] transition-colors"
                >
                  CV Builder
                </Link>
              </li>
              <li>
                <Link
                  to="/career-guide"
                  className="hover:text-[#6A38C2] transition-colors"
                >
                  Career Advice
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. For Recruiters */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">For Recruiters</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <Link
                  to="/signup"
                  className="hover:text-[#6A38C2] transition-colors"
                >
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#6A38C2] transition-colors">
                  Browse Resumes
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#6A38C2] transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#6A38C2] transition-colors">
                  Recruiter Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Newsletter */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Stay Updated</h3>
            <p className="text-sm text-gray-500 mb-4">
              Subscribe to our newsletter for the latest job openings and career
              tips.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Email address"
                className="bg-gray-50 border-gray-200 focus-visible:ring-[#6A38C2]"
              />
              <Button size="icon" className="bg-[#6A38C2] hover:bg-[#5a2ea6]">
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION: COPYRIGHT --- */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} JobPortal. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-gray-900">
              Terms of Service
            </Link>
            <Link to="#" className="hover:text-gray-900">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Helper Component for Social Icons
const SocialLink = ({ href, icon: Icon, color }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={`w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-all duration-300 hover:bg-white hover:shadow-md ${color}`}
  >
    <Icon size={18} />
  </a>
);

export default Footer;
