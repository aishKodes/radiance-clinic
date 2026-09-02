import type { GoogleReviewsFeed } from "@/types/google-reviews";

const googleMapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Radiance%20Skin%20%26%20Hair%20Clinics%20Nayapalli%20Bhubaneswar";

export const verifiedGoogleReviewsSnapshot: GoogleReviewsFeed = {
  source: "verified-snapshot",
  rating: 4.8,
  totalReviewCount: 2279,
  verifiedAt: "2026-09-02",
  googleMapsUrl,
  reviews: [
    {
      id: "google-anjali-sunani-2026-09",
      reviewerName: "Anjali Sunani",
      rating: 5,
      text: "It's my first session.. Session was good and also staff behaviour was good",
      sourceUrl: googleMapsUrl,
    },
    {
      id: "google-sashi-kanta-parida-2026-09",
      reviewerName: "Sashi Kanta Parida",
      rating: 5,
      text: "Genuinely it's a very good clinic.After consulting here, my hair fall has reduced significantly and is now under control.i'm really happy with the treatment and the overall experience.",
      sourceUrl: googleMapsUrl,
    },
    {
      id: "google-umakanta-pradhan-2026-09",
      reviewerName: "Umakanta Pradhan",
      rating: 5,
      text: "Dr Satya Sir is very good, I did not feel any pain in my transplant, initially I was scared but Sir told me that there will not be any pain, it has been 2 years since my transplant, I am very happy.",
      sourceUrl: googleMapsUrl,
    },
    {
      id: "google-suneli-prava-2026-09",
      reviewerName: "Suneli Prava",
      rating: 5,
      text: "I had acne issues on my face but after coming to radiance and using medicine and getting treated here the issues has been solved now my skin is smooth. Im thnakfull for dr satyartha and radiance team",
      sourceUrl: googleMapsUrl,
    },
    {
      id: "google-debajani-mallick-2026-09",
      reviewerName: "Debajani Mallick",
      rating: 5,
      text: "Best clinic for hair and skin treatment in BBSR👍🏼you can go for it without any second thought🙏🏼",
      sourceUrl: googleMapsUrl,
    },
    {
      id: "google-sudipta-kumar-jena-2026-09",
      reviewerName: "Sudipta Kumar Jena",
      rating: 5,
      text: "I had hair thinning issue which I consulted at radiance 5 month ago now I have excellent results and really happy with the service here",
      sourceUrl: googleMapsUrl,
    },
  ],
};
