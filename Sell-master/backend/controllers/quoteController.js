import {
  createQuoteService,
  getQuotesService,
  updateQuoteStatusService,
} from "../services/quoteService.js";

export const createQuote = async (req, res, next) => {
  try {
    const {
      name,
      company,
      phone,
      email,
      productName,
      message,
    } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email, and message are required",
      });
    }

    const quote = await createQuoteService({
      name,
      company,
      phone,
      email,
      productName,
      message,
    });

    res.status(201).json({
      message: "Quote request submitted successfully",
      quote,
    });
  } catch (error) {
    next(error);
  }
};

export const getQuotes = async (_req, res, next) => {
  try {
    const quotes = await getQuotesService();

    res.json(quotes);
  } catch (error) {
    next(error);
  }
};

export const updateQuoteStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const quote = await updateQuoteStatusService(
      req.params.id,
      status
    );

    if (!quote) {
      return res.status(404).json({
        message: "Quote not found",
      });
    }

    res.json(quote);
  } catch (error) {
    next(error);
  }
};
