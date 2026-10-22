"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ModalProvider } from "@/app/context/QuickViewModalContext";
import { CartModalProvider } from "@/app/context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import { AuthProvider } from "@/context/AuthContext";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "@/app/context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";
import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";
import { WebData } from "@/types/webData";

interface ClientLayoutProps {
  children: React.ReactNode;
  webData: WebData | null;
}

export default function ClientLayout({ children, webData }: ClientLayoutProps) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ReduxProvider>
      <AuthProvider>
        {loading ? (
          <PreLoader />
        ) : (
          <>
            <CartModalProvider>
              <ModalProvider>
                <PreviewSliderProvider>
                  <Header webData={webData} />
                  <main className="pt-1 lg:pt-10">{children}</main>
                  <QuickViewModal />
                  <CartSidebarModal />
                  <PreviewSliderModal />
                </PreviewSliderProvider>
              </ModalProvider>
            </CartModalProvider>
            <ScrollToTop />
            <Footer webData={webData} />
          </>
        )}
      </AuthProvider>
    </ReduxProvider>
  );
}
