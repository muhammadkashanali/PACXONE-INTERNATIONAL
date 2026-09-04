import Quote from "../models/Quote.js";
import { sendCustomerConfirmation, sendQuoteNotification } from "../utils/sendQuoteEmail.js";

export const createQuoteService = async ({
  name,
  company,
  phone,
  email,
  productName,
  message,
}) => {
  const quote = await Quote.create({
    name,
    company: company || "",
    phone: phone || "",
    email,
    productName: productName || "",
    message,
    source: "website",
  });

  try {
    await sendQuoteNotification({
      name,
      company: company || "",
      phone: phone || "",
      email,
      productName: productName || "",
      message,
    });
  } catch (error) {
    console.error("Failed to send quote notification email:", error);
  }

  try {
    await sendCustomerConfirmation({
      name,
      email,
      productName: productName || "",
      message,
    });
  } catch (error) {
    console.error("Failed to send customer confirmation email:", error);
  }

  return quote;
};

export const getQuotesService = async () => {
  return await Quote.find().sort({
    createdAt: -1,
  });
};

export const updateQuoteStatusService = async (
  quoteId,
  status
) => {
  return await Quote.findByIdAndUpdate(
    quoteId,
    { status },
    {
      new: true,
      runValidators: true,
    }
  );
};
