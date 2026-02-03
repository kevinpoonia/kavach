import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface NotificationConfig {
  id: string;
  notification_type: string;
  recipient: string;
  alert_type: string;
  is_active: boolean;
}

async function sendEmailNotification(
  recipient: string,
  subject: string,
  message: string,
  resendApiKey?: string
): Promise<boolean> {
  try {
    if (!resendApiKey) {
      console.warn("Resend API key not configured. Skipping email send.");
      return false;
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "noreply@repupulse.com",
        to: recipient,
        subject,
        html: `<p>${message}</p>`,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

async function sendSmsNotification(
  recipient: string,
  message: string,
  twilioAccountSid?: string,
  twilioAuthToken?: string
): Promise<boolean> {
  try {
    if (!twilioAccountSid || !twilioAuthToken) {
      console.warn("Twilio credentials not configured. Skipping SMS send.");
      return false;
    }

    const auth = btoa(`${twilioAccountSid}:${twilioAuthToken}`);
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${auth}`,
        },
        body: new URLSearchParams({
          From: "+1234567890",
          To: recipient,
          Body: message,
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error("SMS send error:", error);
    return false;
  }
}

async function sendWhatsAppNotification(
  recipient: string,
  message: string,
  twilioAccountSid?: string,
  twilioAuthToken?: string
): Promise<boolean> {
  try {
    if (!twilioAccountSid || !twilioAuthToken) {
      console.warn(
        "Twilio credentials not configured. Skipping WhatsApp send."
      );
      return false;
    }

    const auth = btoa(`${twilioAccountSid}:${twilioAuthToken}`);
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${auth}`,
        },
        body: new URLSearchParams({
          From: "whatsapp:+1234567890",
          To: `whatsapp:${recipient}`,
          Body: message,
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error("WhatsApp send error:", error);
    return false;
  }
}

async function checkAndSendNotifications(
  supabase: any,
  companyId: string,
  resendApiKey?: string,
  twilioAccountSid?: string,
  twilioAuthToken?: string
) {
  try {
    // Get recent reviews for this company
    const { data: recentReviews, error: reviewsError } = await supabase
      .from("reviews")
      .select("*")
      .eq("company_id", companyId)
      .gt("created_at", new Date(Date.now() - 30 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false });

    if (reviewsError) throw reviewsError;

    if (!recentReviews || recentReviews.length === 0) return;

    // Calculate metrics
    const negativeReviews = recentReviews.filter(
      (r: any) => r.rating < 3
    ).length;
    const averageRating =
      recentReviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
      recentReviews.length;

    // Get notification settings
    const { data: notifications, error: notificationsError } = await supabase
      .from("notifications")
      .select("*")
      .eq("company_id", companyId)
      .eq("is_active", true);

    if (notificationsError) throw notificationsError;

    const message =
      negativeReviews > 0
        ? `Alert: ${negativeReviews} negative review(s) detected. Average rating: ${averageRating.toFixed(1)}/5`
        : `Update: New reviews received. Average rating: ${averageRating.toFixed(1)}/5`;

    // Send notifications based on type
    for (const notification of notifications || []) {
      let success = false;

      if (
        notification.alert_type === "all" ||
        (notification.alert_type === "negative_review" && negativeReviews > 0)
      ) {
        if (notification.notification_type === "email") {
          success = await sendEmailNotification(
            notification.recipient,
            "RepuPulse Review Alert",
            message,
            resendApiKey
          );
        } else if (notification.notification_type === "sms") {
          success = await sendSmsNotification(
            notification.recipient,
            message,
            twilioAccountSid,
            twilioAuthToken
          );
        } else if (notification.notification_type === "whatsapp") {
          success = await sendWhatsAppNotification(
            notification.recipient,
            message,
            twilioAccountSid,
            twilioAuthToken
          );
        }

        // Log notification
        if (success || true) {
          await supabase.from("notification_logs").insert({
            company_id: companyId,
            notification_id: notification.id,
            review_id: recentReviews[0]?.id,
            status: success ? "sent" : "pending",
            message,
            sent_at: new Date().toISOString(),
          });
        }
      }
    }
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all companies with active notifications
    const { data: companies, error: companiesError } = await supabase
      .from("companies")
      .select("id");

    if (companiesError) throw companiesError;

    let notificationsSent = 0;

    for (const company of companies || []) {
      await checkAndSendNotifications(
        supabase,
        company.id,
        resendApiKey,
        twilioAccountSid,
        twilioAuthToken
      );
      notificationsSent++;
    }

    return new Response(
      JSON.stringify({
        success: true,
        companiesProcessed: notificationsSent,
        message: "Notification check completed",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-notifications function:", error);
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
