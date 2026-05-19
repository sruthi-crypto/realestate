import { useState } from "react";
import { WHATSAPP_NUMBER } from "@/data/types";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppButton = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi, I'm ${name}. My phone is ${phone}. I'm interested in ${message}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
    setOpen(false);
    setName(""); setPhone(""); setMessage("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-whatsapp text-whatsapp-foreground shadow-elevated hover:shadow-elevated hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Contact via WhatsApp"
      >
        <div className="absolute inset-0 rounded-full bg-whatsapp/20 animate-pulse group-hover:animate-none" />
        <MessageCircle className="h-6 w-6 relative group-hover:rotate-12 transition-transform duration-300" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-md rounded-2xl bg-background p-6 shadow-elevated animate-scale-in border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">Contact Us on WhatsApp</h3>
                <p className="text-xs text-muted-foreground mt-1">Quick response guaranteed</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors hover:rotate-90 duration-300"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up">
              <div className="animate-stagger" style={{ animationDelay: '0.1s' }}>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">Your Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-whatsapp focus:border-transparent transition-smooth"
                />
              </div>

              <div className="animate-stagger" style={{ animationDelay: '0.15s' }}>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">Phone Number</label>
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-whatsapp focus:border-transparent transition-smooth"
                />
              </div>

              <div className="animate-stagger" style={{ animationDelay: '0.2s' }}>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">Your Message</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about the property you're interested in..."
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-whatsapp focus:border-transparent transition-smooth resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 font-semibold rounded-lg hover-lift mt-2 animate-stagger"
                style={{ animationDelay: '0.25s' }}
              >
                Send via WhatsApp
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppButton;
