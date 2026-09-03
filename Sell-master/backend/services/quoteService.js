import Quote from "../models/Quote.js";

export const createQuoteService = async ({
  name,
  company,
  phone,
  email,
  productName,
  message,
}) => {
  return await Quote.create({
    name,
    company: company || "",
    phone: phone || "",
    email,
    productName: productName || "",
    message,
    source: "website",
  });
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
