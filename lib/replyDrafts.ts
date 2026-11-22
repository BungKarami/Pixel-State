// Reply draft templates. They are built from the enquiry itself, so the
// admin can copy, edit and send them in their own email app. Nothing here
// sends email automatically.

export type DraftKind = "first_reply" | "quote_ready" | "follow_up";

export function buildDraft(
  kind: DraftKind,
  enquiry: {
    name: string;
    businessName?: string | null;
    enquiryType: string;
    service?: string | null;
    package?: string | null;
    quotedValueCents?: number | null;
  }
): { subject: string; body: string } {
  const firstName = enquiry.name.trim().split(" ")[0] || enquiry.name;
  const business = enquiry.businessName ? ` at ${enquiry.businessName}` : "";
  const quoted = enquiry.quotedValueCents
    ? `$${(enquiry.quotedValueCents / 100).toLocaleString("en-AU")}`
    : "";

  if (kind === "quote_ready") {
    return {
      subject: `Your Pixel State website quote${business ? ` for ${enquiry.businessName}` : ""}`,
      body: [
        `Hi ${firstName},`,
        ``,
        `Thanks for asking Pixel State for a quote${business}.`,
        quoted
          ? `Your fixed quote is ${quoted}, and that includes the full build, handover training and 100 percent ownership of your website and code.`
          : `Your fixed quote is below, and that includes the full build, handover training and 100 percent ownership of your website and code.`,
        ``,
        `If you would like to go ahead, reply to this email and I will confirm the start date and what I need from you to begin.`,
        ``,
        `Thanks,`,
        `Pixel State, Bendigo`,
        `33 Creek St S, Bendigo VIC 3550`
      ].join("\n")
    };
  }

  if (kind === "follow_up") {
    return {
      subject: `Checking in on your website${business ? ` for ${enquiry.businessName}` : ""}`,
      body: [
        `Hi ${firstName},`,
        ``,
        `I wanted to check in on your website enquiry${business}.`,
        `No pressure at all. If you would like a fixed quote or a free review of your current website, just reply and I will get it to you within one business day.`,
        ``,
        `Thanks,`,
        `Pixel State, Bendigo`,
        `33 Creek St S, Bendigo VIC 3550`
      ].join("\n")
    };
  }

  return {
    subject:
      enquiry.enquiryType === "free_review"
        ? `Your free Pixel State website review${business ? ` for ${enquiry.businessName}` : ""}`
        : `Thanks for your Pixel State enquiry${business ? ` for ${enquiry.businessName}` : ""}`,
    body: [
      `Hi ${firstName},`,
      ``,
      `Thanks for getting in touch with Pixel State${business}.`,
      enquiry.enquiryType === "free_review"
        ? `I will review your current website and send you the findings within one business day, with clear next steps and a fixed quote if you would like one.`
        : `I will come back to you within one business day with a fixed quote and clear next steps.`,
      ``,
      `Thanks,`,
      `Pixel State, Bendigo`,
      `33 Creek St S, Bendigo VIC 3550`
    ].join("\n")
  };
}
