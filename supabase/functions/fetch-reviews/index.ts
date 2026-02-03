import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Platform {
  id: string;
  company_id: string;
  platform_name: string;
  business_id: string;
  is_active: boolean;
}

interface Review {
  company_id: string;
  platform_id: string;
  platform_name: string;
  review_id: string;
  author: string;
  content: string;
  rating: number;
  sentiment: string;
  url: string;
  reviewed_at: string;
  fetched_at: string;
}

async function generateSampleReviews(
  platformName: string,
  count: number = 10
) {
  const sentiments = ["positive", "negative", "neutral"];
  const authors = [
    "John D.",
    "Sarah M.",
    "Michael P.",
    "Emma L.",
    "David R.",
  ];
  const comments = {
    positive: [
      "Great experience!",
      "Excellent service!",
      "Highly recommended!",
      "Very satisfied!",
      "Best company ever!",
    ],
    negative: [
      "Poor service!",
      "Very disappointed!",
      "Would not recommend!",
      "Terrible experience!",
      "Waste of money!",
    ],
    neutral: [
      "It was okay.",
      "Average service.",
      "Nothing special.",
      "Decent enough.",
      "Fair value.",
    ],
  };

  const reviews = [];
  for (let i = 0; i < count; i++) {
    const sentiment =
      sentiments[Math.floor(Math.random() * sentiments.length)];
    const rating =
      sentiment === "positive"
        ? 4 + Math.random()
        : sentiment === "negative"
          ? 1 + Math.random() * 2
          : 2.5 + Math.random();

    reviews.push({
      review_id: `sample-${platformName}-${Date.now()}-${i}`,
      author: authors[Math.floor(Math.random() * authors.length)],
      content:
        comments[sentiment as keyof typeof comments][
          Math.floor(
            Math.random() * comments[sentiment as keyof typeof comments].length
          )
        ],
      rating: Math.round(rating * 10) / 10,
      sentiment,
      url: `https://${platformName}.example.com/review/${i}`,
      reviewed_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return reviews;
}

async function fetchReviews(
  supabase: any,
  platforms: Platform[],
  companyId: string
) {
  const reviews = [];

  for (const platform of platforms) {
    if (!platform.is_active) continue;

    try {
      console.log(`Fetching reviews from ${platform.platform_name}...`);

      // Record sync job start
      const { data: jobData } = await supabase
        .from("sync_jobs")
        .insert({
          company_id: companyId,
          platform_name: platform.platform_name,
          status: "running",
        })
        .select("id")
        .single();

      const jobId = jobData?.id;

      // Generate sample reviews (in production, this would fetch from real APIs)
      const platformReviews = await generateSampleReviews(
        platform.platform_name
      );

      const reviewsToInsert = platformReviews.map((review: any) => ({
        ...review,
        company_id: companyId,
        platform_id: platform.id,
        platform_name: platform.platform_name,
        fetched_at: new Date().toISOString(),
      }));

      // Insert reviews
      const { error: insertError, data: insertedReviews } = await supabase
        .from("reviews")
        .upsert(reviewsToInsert, { onConflict: "company_id,platform_name,review_id" })
        .select();

      if (insertError) {
        console.error(`Error inserting reviews: ${insertError.message}`);
        if (jobId) {
          await supabase
            .from("sync_jobs")
            .update({
              status: "failed",
              error_message: insertError.message,
            })
            .eq("id", jobId);
        }
        continue;
      }

      // Update sync job
      if (jobId) {
        await supabase
          .from("sync_jobs")
          .update({
            status: "success",
            reviews_fetched: insertedReviews?.length || 0,
            completed_at: new Date().toISOString(),
          })
          .eq("id", jobId);
      }

      reviews.push(...(insertedReviews || []));
    } catch (error) {
      console.error(
        `Error fetching from ${platform.platform_name}:`,
        error
      );
    }
  }

  return reviews;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all active companies with their platforms
    const { data: companies, error: companiesError } = await supabase
      .from("companies")
      .select("id, user_id");

    if (companiesError) throw companiesError;

    let totalReviewsFetched = 0;

    for (const company of companies || []) {
      const { data: platforms, error: platformsError } = await supabase
        .from("platforms")
        .select("*")
        .eq("company_id", company.id)
        .eq("is_active", true);

      if (platformsError) {
        console.error(`Error fetching platforms for company ${company.id}:`, platformsError);
        continue;
      }

      const reviews = await fetchReviews(supabase, platforms || [], company.id);
      totalReviewsFetched += reviews.length;
    }

    return new Response(
      JSON.stringify({
        success: true,
        reviewsFetched: totalReviewsFetched,
        message: "Review fetch completed successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in fetch-reviews function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
