import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, subject, phone, message } = body;

    if (!firstName || !lastName || !message) {
      return NextResponse.json(
        { error: "First Name, Last Name, and Message are required." },
        { status: 400 },
      );
    }

    const data = await resend.emails.send({
      from: "Premier Auto Hub Contact <onboarding@resend.dev>",
      to: "ckhapu12345@gmail.com",
      subject: `New Contact Form Inquiry: ${subject || "No Subject"}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #3C50E0; border-bottom: 2px solid #3C50E0; padding-bottom: 8px;">
            New Message from Premier Auto Hub
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 30%;">Full Name:</td>
              <td style="padding: 8px 0;">${firstName} ${lastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
              <td style="padding: 8px 0;">${phone || "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Subject:</td>
              <td style="padding: 8px 0;">${subject || "General Inquiry"}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #3C50E0; border-radius: 4px;">
            <h4 style="margin: 0 0 10px 0; color: #555;">Message:</h4>
            <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "Email sent successfully!", data },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Resend Email Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send email." },
      { status: 500 },
    );
  }
}
