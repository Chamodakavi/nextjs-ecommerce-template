import React, { useEffect } from "react";
import { X } from "lucide-react";

interface AddressModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const AddressModal: React.FC<AddressModalProps> = ({ isOpen, closeModal }) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (isOpen && target && !target.closest(".modal-content")) {
        closeModal();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-dark/70 sm:py-20 px-4 py-5 z-99999 flex items-center justify-center overflow-y-auto no-scrollbar">
      <div className="w-full max-w-[900px] rounded-xl shadow-3 bg-white p-6 sm:p-8 relative modal-content">
        <button
          onClick={closeModal}
          type="button"
          aria-label="Close modal"
          className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full bg-gray-2 text-dark hover:bg-gray-3 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-semibold text-dark mb-6">Edit Address</h3>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col lg:flex-row gap-5 mb-5">
            <div className="w-full">
              <label
                htmlFor="modal-name"
                className="block mb-2 text-sm font-medium text-dark"
              >
                Full Name
              </label>
              <input
                type="text"
                id="modal-name"
                defaultValue="Chamoda Kavishka"
                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 text-sm"
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="modal-email"
                className="block mb-2 text-sm font-medium text-dark"
              >
                Email Address
              </label>
              <input
                type="email"
                id="modal-email"
                defaultValue="chamoda@example.com"
                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-5 mb-6">
            <div className="w-full">
              <label
                htmlFor="modal-phone"
                className="block mb-2 text-sm font-medium text-dark"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="modal-phone"
                defaultValue="+94 77 123 4567"
                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 text-sm"
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="modal-address"
                className="block mb-2 text-sm font-medium text-dark"
              >
                Street Address
              </label>
              <input
                type="text"
                id="modal-address"
                defaultValue="Main Street, Colombo, Sri Lanka"
                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="py-2.5 px-6 rounded-md border border-gray-3 text-dark text-sm font-medium hover:bg-gray-1 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={closeModal}
              className="inline-flex font-medium text-white bg-blue py-2.5 px-6 rounded-md text-sm ease-out duration-200 hover:bg-blue-dark shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
