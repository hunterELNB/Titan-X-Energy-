import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      company,
      email,
      phone,
      region,
      inquiryType,
      message
    } = body;

    if (!name || !email || !inquiryType || !message) {
      return NextResponse.json(
        { error: "Required fields are missing." },
        { status: 400 }
      );
    }

    const recipient = process.env.CONTACT_EMAIL;
    const resendKey = process.env.RESEND_API_KEY;

    if (!recipient || !resendKey) {
      console.error("Missing CONTACT_EMAIL or RESEND_API_KEY.");

      return NextResponse.json(
        { error: "Contact service is not configured yet." },
        { status: 500 }
      );
    }

    const text = [
      `Name: ${name}`,
      `Company: ${company || "-"}`,
      `Email: ${email}`,
      `Phone: ${phone || "-"}`,
      `Country / Region: ${region || "-"}`,
      `Inquiry Type: ${inquiryType}`,
      "",
      "Message:",
      message
    ].join("\n");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`
      },
      body: JSON.stringify({
        from: "Titan X Website <contact@titan-x-energy.com>",
        to: [recipient],
        reply_to: email,
        subject: `Titan X Website Inquiry — ${inquiryType}`,
        text
      })
    });

    if (!response.ok) {
      console.error(await response.text());

      return NextResponse.json(
        { error: "Email delivery failed." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
