import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import ClientLayout from "@/components/ClientLayout/ClientLayout";
import {
  getHeroData,
  getPromoData,
  getWebData,
} from "@/lib/services/getWebData";
import { WebDataProvider } from "@/context/WebCarouselContext";
import { WebCatProvider } from "@/context/WebCatProvider";
import { WebPromoProvider } from "@/context/WebPromoSecContext";
import { getCatData } from "@/lib/services/getCatData";
import { getCountdownData } from "@/lib/services/getCountdownData";
import { WebCountdownProvider } from "@/context/WebCountdownContext";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const webData = await getWebData();
  const heroData = await getHeroData();
  const categories = await getCatData();
  const promos = await getPromoData();
  const countdownData = await getCountdownData();

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <WebCountdownProvider countdown={countdownData}>
          <WebPromoProvider promos={promos.promos}>
            <WebCatProvider categories={categories}>
              <WebDataProvider
                slides={heroData.slides}
                promos={heroData.promos}
              >
                <ClientLayout webData={webData}>{children}</ClientLayout>
              </WebDataProvider>
            </WebCatProvider>
          </WebPromoProvider>
        </WebCountdownProvider>
      </body>
    </html>
  );
}
