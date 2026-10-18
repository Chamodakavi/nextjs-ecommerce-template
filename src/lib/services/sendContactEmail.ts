export interface ContactFormData {
  firstName: string;
  lastName: string;
  subject?: string;
  phone?: string;
  message: string;
}

export interface SendEmailResponse {
  success: boolean;
  message: string;
}

export const sendContactEmail = async (
  formData: ContactFormData,
): Promise<SendEmailResponse> => {
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to send message");
    }

    return {
      success: true,
      message: "Your message has been sent successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred while sending your message.",
    };
  }
};
