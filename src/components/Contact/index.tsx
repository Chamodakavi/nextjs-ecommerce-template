"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { WebData } from "@/types/webData";
import {
  sendContactEmail,
  ContactFormData,
} from "@/lib/services/sendContactEmail";

interface ContactModalProps {
  isOpen: boolean;
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

// Custom Alert Modal for Form Submission Results
const ContactResponseModal: React.FC<ContactModalProps> = ({
  isOpen,
  type,
  message,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/40 backdrop-blur-xs transition-opacity duration-200">
      <div className="bg-white rounded-2xl p-6 w-[300px] sm:w-[360px] shadow-2xl flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="relative flex items-center justify-center w-16 h-16 mb-4">
          <div
            className={`flex items-center justify-center w-14 h-14 rounded-full ${
              isSuccess ? "bg-green-500 text-white" : "bg-red text-white"
            } animate-in zoom-in-75 duration-200`}
          >
            {isSuccess ? (
              <Check className="w-8 h-8 stroke-[3]" />
            ) : (
              <AlertCircle className="w-8 h-8 stroke-[3]" />
            )}
          </div>
        </div>

        <h4 className="font-semibold text-dark text-base sm:text-lg mb-1">
          {isSuccess ? "Message Sent!" : "Failed to Send"}
        </h4>

        <p className="text-xs sm:text-sm text-gray-500 max-w-[260px] mb-4">
          {message}
        </p>

        <button
          type="button"
          onClick={onClose}
          className={`py-2 px-6 rounded-lg text-white font-medium text-xs sm:text-sm transition-colors ${
            isSuccess
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red hover:bg-red-dark"
          }`}
        >
          {isSuccess ? "OK" : "Try Again"}
        </button>
      </div>
    </div>
  );
};

const Contact = ({ webData }: { webData: WebData | null }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    subject: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    message: string;
  }>({
    isOpen: false,
    type: "success",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.message.trim()
    ) {
      setModalState({
        isOpen: true,
        type: "error",
        message: "Please fill in all required fields and try again.",
      });
      return;
    }

    setLoading(true);

    const result = await sendContactEmail(formData);

    setLoading(false);

    if (result.success) {
      setModalState({
        isOpen: true,
        type: "success",
        message: "Your message has been sent successfully!",
      });
      setFormData({
        firstName: "",
        lastName: "",
        subject: "",
        phone: "",
        message: "",
      });
    } else {
      setModalState({
        isOpen: true,
        type: "error",
        message: result.message || "Failed to send email. Please try again.",
      });
    }
  };

  return (
    <>
      <Breadcrumb title="Contact Us" pages={["contact"]} />

      <section className="overflow-hidden py-12 sm:py-16 lg:py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col xl:flex-row gap-7.5">
            {/* Contact Information Sidebar */}
            <div className="xl:max-w-[370px] w-full bg-white rounded-xl shadow-1 h-fit">
              <div className="py-5 px-4 sm:px-7.5 border-b border-gray-3">
                <p className="font-medium text-xl text-dark">
                  Contact Information
                </p>
              </div>

              <div className="p-4 sm:p-7.5">
                <div className="flex flex-col gap-5">
                  <div className="flex items-start gap-4 text-dark font-medium text-custom-sm">
                    <User className="w-5 h-5 text-blue shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-2xs uppercase text-gray-500 font-normal">
                        Contact Person
                      </span>
                      Premier Auto Hub Team
                    </div>
                  </div>

                  <div className="flex items-start gap-4 text-dark font-medium text-custom-sm">
                    <Phone className="w-5 h-5 text-blue shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-2xs uppercase text-gray-500 font-normal">
                        Phone
                      </span>
                      <a
                        href={`tel:${webData?.phone || ""}`}
                        className="hover:text-blue transition-colors"
                      >
                        {webData?.phone || "+94 77 123 4567"}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 text-dark font-medium text-custom-sm">
                    <Mail className="w-5 h-5 text-blue shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-2xs uppercase text-gray-500 font-normal">
                        Email Address
                      </span>
                      <a
                        href={`mailto:${webData?.email || ""}`}
                        className="hover:text-blue transition-colors"
                      >
                        {webData?.email || "info@premierautohub.lk"}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 text-dark font-medium text-custom-sm">
                    <MapPin className="w-5 h-5 text-blue shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-2xs uppercase text-gray-500 font-normal">
                        Store Address
                      </span>
                      {webData?.address ||
                        "No. 123, High Level Road, Colombo, Sri Lanka"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="xl:max-w-[770px] w-full bg-white rounded-xl shadow-1 p-4 sm:p-7.5 xl:p-10">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                  <div className="w-full">
                    <label
                      htmlFor="firstName"
                      className="block mb-2.5 font-medium text-dark text-sm"
                    >
                      First Name <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      required
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="lastName"
                      className="block mb-2.5 font-medium text-dark text-sm"
                    >
                      Last Name <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      required
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                  <div className="w-full">
                    <label
                      htmlFor="subject"
                      className="block mb-2.5 font-medium text-dark text-sm"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Type your subject"
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="phone"
                      className="block mb-2.5 font-medium text-dark text-sm"
                    >
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>
                </div>

                <div className="mb-7.5">
                  <label
                    htmlFor="message"
                    className="block mb-2.5 font-medium text-dark text-sm"
                  >
                    Message <span className="text-red">*</span>
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message here..."
                    required
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark shadow-sm disabled:opacity-70 cursor-pointer"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Response Modal Popup */}
      <ContactResponseModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        message={modalState.message}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};

export default Contact;
