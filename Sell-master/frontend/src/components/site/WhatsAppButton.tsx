import { MessageCircle } from "lucide-react";

const whatsappNumber = "923002409524";

export function WhatsAppButton() {
    const message = encodeURIComponent("Hello Pacxone International, I would like to ask an engineer for assistance.");

    return (
        <a
            href={`https://wa.me/${whatsappNumber}?text=${message}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-green-900/20 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
        >
            <MessageCircle className="h-7 w-7" />
        </a>
    );
}
