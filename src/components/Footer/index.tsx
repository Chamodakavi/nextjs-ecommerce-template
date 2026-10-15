import React from "react";
import Image from "next/image";
import { MapPin, PhoneCall, Mail } from "lucide-react";
import {
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa6";
import { WebData } from "@/types/webData";

const Footer = ({ webData }: { webData: WebData | null }) => {
  const year = new Date().getFullYear();

  return (
    <footer className="overflow-hidden">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- footer menu start --> */}
        <div className="flex flex-wrap xl:flex-nowrap gap-10 xl:gap-19 xl:justify-between pt-17.5 xl:pt-22.5 pb-10 xl:pb-15">
          <div className="max-w-[330px] w-full">
            <h2 className="mb-7.5 text-custom-1 font-medium text-dark">
              Help & Support
            </h2>

            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-4.5">
                <span className="flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-blue" />
                </span>
                <span>
                  {webData?.address || "Egaloya,Bulathsinhala,Sri Lanka."}
                </span>
              </li>

              <li>
                <a
                  href="tel:+0995327869843"
                  className="flex items-center gap-4.5 ease-out duration-200 hover:text-blue"
                >
                  <PhoneCall className="w-5 h-5 text-blue flex-shrink-0" />
                  {webData?.phone || "+0995327869843"}
                </a>
              </li>

              <li>
                <a
                  href="mailto:binoshrandula@gmail.com"
                  className="flex items-center gap-4.5 ease-out duration-200 hover:text-blue"
                >
                  <Mail className="w-5 h-5 text-blue flex-shrink-0" />
                  {webData?.email || "binoshrandula@gmail.com"}
                </a>
              </li>
            </ul>

            {/* <!-- Social Links start --> */}
            <div className="flex items-center gap-4 mt-7.5">
              <a
                href="#"
                aria-label="Facebook Social Link"
                className="flex items-center justify-center ease-out duration-200 text-dark-4 hover:text-blue"
              >
                <FaFacebookF className="w-4.5 h-4.5" />
              </a>

              <a
                href="#"
                aria-label="Twitter Social Link"
                className="flex items-center justify-center ease-out duration-200 text-dark-4 hover:text-blue"
              >
                <FaXTwitter className="w-4.5 h-4.5" />
              </a>

              <a
                href="#"
                aria-label="Instagram Social Link"
                className="flex items-center justify-center ease-out duration-200 text-dark-4 hover:text-blue"
              >
                <FaInstagram className="w-5 h-5" />
              </a>

              <a
                href="#"
                aria-label="Linkedin Social Link"
                className="flex items-center justify-center ease-out duration-200 text-dark-4 hover:text-blue"
              >
                <FaLinkedinIn className="w-4.5 h-4.5" />
              </a>
            </div>
            {/* <!-- Social Links end --> */}
          </div>

          <div className="w-full sm:w-auto">
            <h2 className="mb-7.5 text-custom-1 font-medium text-dark">
              Account
            </h2>

            <ul className="flex flex-col gap-3.5">
              <li>
                <a className="ease-out duration-200 hover:text-blue" href="#">
                  My Account
                </a>
              </li>
              <li>
                <a className="ease-out duration-200 hover:text-blue" href="#">
                  Login / Register
                </a>
              </li>
              <li>
                <a className="ease-out duration-200 hover:text-blue" href="#">
                  Cart
                </a>
              </li>
              <li>
                <a className="ease-out duration-200 hover:text-blue" href="#">
                  Wishlist
                </a>
              </li>
              <li>
                <a className="ease-out duration-200 hover:text-blue" href="#">
                  Shop
                </a>
              </li>
            </ul>
          </div>

          <div className="w-full sm:w-auto">
            <h2 className="mb-7.5 text-custom-1 font-medium text-dark">
              Quick Link
            </h2>

            <ul className="flex flex-col gap-3">
              <li>
                <a className="ease-out duration-200 hover:text-blue" href="#">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a className="ease-out duration-200 hover:text-blue" href="#">
                  Refund Policy
                </a>
              </li>
              <li>
                <a className="ease-out duration-200 hover:text-blue" href="#">
                  Terms of Use
                </a>
              </li>
              <li>
                <a className="ease-out duration-200 hover:text-blue" href="#">
                  FAQ’s
                </a>
              </li>
              <li>
                <a className="ease-out duration-200 hover:text-blue" href="#">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* <!-- footer menu end --> */}
      </div>

      {/* <!-- footer bottom start --> */}
      <div className="py-5 xl:py-7.5 bg-gray-1">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-5 flex-wrap items-center justify-between">
            <p className="text-dark font-medium">
              &copy; {year}. All rights reserved by Premier Auto Hub. Designed
              by Team Webtend.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <p className="font-medium">We Accept:</p>

              <div className="flex flex-wrap items-center gap-6">
                <a href="#" aria-label="payment system with visa card">
                  <Image
                    src="/images/payment/payment-01.svg"
                    alt="visa card"
                    width={66}
                    height={22}
                  />
                </a>
                <a href="#" aria-label="payment system with paypal">
                  <Image
                    src="/images/payment/payment-02.svg"
                    alt="paypal"
                    width={18}
                    height={21}
                  />
                </a>
                <a href="#" aria-label="payment system with master card">
                  <Image
                    src="/images/payment/payment-03.svg"
                    alt="master card"
                    width={33}
                    height={24}
                  />
                </a>
                <a href="#" aria-label="payment system with apple pay">
                  <Image
                    src="/images/payment/payment-04.svg"
                    alt="apple pay"
                    width={52.94}
                    height={22}
                  />
                </a>
                <a href="#" aria-label="payment system with google pay">
                  <Image
                    src="/images/payment/payment-05.svg"
                    alt="google pay"
                    width={56}
                    height={22}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- footer bottom end --> */}
    </footer>
  );
};

export default Footer;
