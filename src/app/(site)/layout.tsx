import "../css/euclid-circular-a-font.css";
import "../css/style.css";

import {
  getHeroData,
  getPromoData,
  getWebData,
} from "@/lib/services/getWebData";
import { getCatData } from "@/lib/services/getCatData";
import { getCountdownData } from "@/lib/services/getCountdownData";
import { getNewArrivalProducts } from "@/lib/services/getProducts";

import { WebDataProvider } from "@/context/WebCarouselContext";
import { WebCatProvider } from "@/context/WebCatProvider";
import { WebPromoProvider } from "@/context/WebPromoSecContext";
import { WebCountdownProvider } from "@/context/WebCountdownContext";
import { NewArrivalProvider } from "@/context/NewArrivalContext";
import ClientLayout from "@/components/ClientLayout/ClientLayout";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [webData, heroData, categories, promos, countdownData, newArrivals] =
    await Promise.all([
      getWebData(),
      getHeroData(),
      getCatData(),
      getPromoData(),
      getCountdownData(),
      getNewArrivalProducts(8),
    ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NewArrivalProvider products={newArrivals ?? []}>
          <WebCountdownProvider countdown={countdownData}>
            <WebPromoProvider promos={promos}>
              <WebCatProvider categories={categories ?? []}>
                <WebDataProvider
                  slides={heroData.slides}
                  promos={heroData.promos}
                >
                  <ClientLayout webData={webData}>{children}</ClientLayout>
                </WebDataProvider>
              </WebCatProvider>
            </WebPromoProvider>
          </WebCountdownProvider>
        </NewArrivalProvider>
      </body>
    </html>
  );
}
