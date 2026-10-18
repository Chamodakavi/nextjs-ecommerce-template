import Contact from "@/components/Contact";
import { getWebData } from "@/lib/services/getWebData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Premier Auto Hub",
  description:
    "Get in touch with Premier Auto Hub. Reach out for inquiries, orders, and support.",
};

const ContactPage = async () => {
  const webData = await getWebData();

  return (
    <main>
      <Contact webData={webData} />
    </main>
  );
};

export default ContactPage;
