import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import ClientLayout from "@/components/ClientLayout/ClientLayout";
import { getWebData } from "@/lib/services/getWebData";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const webData = await getWebData();

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <ClientLayout webData={webData}>{children}</ClientLayout>
      </body>
    </html>
  );
}
