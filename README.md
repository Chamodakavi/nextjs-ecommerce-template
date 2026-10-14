1. In the Storefront API Route (app/api/storefront/config/route.ts)
   Filter out isActive === false before returning the JSON:

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
try {
const { data, error } = await supabase
.from("storefront_settings")
.select("\*")
.eq("id", "default")
.single();

    if (error) throw error;

    // Filter out inactive slides and promo cards
    const activeSlides = (data.carousel_slides || []).filter(
      (slide: any) => slide.isActive !== false
    );

    const activePromos = (data.promo_cards || []).filter(
      (promo: any) => promo.isActive !== false
    );

    // Filter small promo banners
    const activeSmallBanners = (data.promo_banners?.smallBanners || []).filter(
      (b: any) => b.isActive !== false
    );

    // Big banner active check
    const bigBanner = data.promo_banners?.bigBanner?.isActive
      ? data.promo_banners.bigBanner
      : null;

    // Countdown banner active check
    const countdown = data.countdown_config?.isActive
      ? data.countdown_config
      : null;

    return NextResponse.json({
      slides: activeSlides,
      promos: activePromos,
      promoBanners: {
        bigBanner,
        smallBanners: activeSmallBanners,
      },
      countdownConfig: countdown,
      generalConfig: data.general_config,
    });

} catch (error: any) {
return NextResponse.json({ error: error.message }, { status: 500 });
}
}

2. In Storefront Components (Conditional Rendering)
   In your storefront page or components, render conditionally so hidden sections collapse completely:

// app/page.tsx (Storefront Home)
export default async function HomePage() {
const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/storefront/config`, {
next: { revalidate: 60 }, // Cache and revalidate every minute
});
const data = await res.json();

return (
<main>
{/_ 1. Only show Hero if there are active slides _/}
{data.slides?.length > 0 && <Hero data={data} />}

      {/* 2. Promo Section (Hides if big banner and small banners are all inactive) */}
      {(data.promoBanners?.bigBanner || data.promoBanners?.smallBanners?.length > 0) && (
        <PromoBanner data={data.promoBanners} />
      )}

      {/* 3. Countdown Section (Completely hides when isActive: false or deadline passed) */}
      {data.countdownConfig && (
        <CountDown data={data.countdownConfig} />
      )}
    </main>

);
}
