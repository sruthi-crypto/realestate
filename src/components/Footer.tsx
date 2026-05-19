import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { AREAS, WHATSAPP_NUMBER } from "@/data/types";
import { MapPin } from "lucide-react";

const Footer = () => {
  const { setSelectedArea, setSelectedCategory } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi, I'm ${name}. My phone is ${phone}. I'm interested in ${message}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
    setName(""); setPhone(""); setMessage("");
  };

  const handleAreaClick = (area: string) => {
    setSelectedArea(area);
    setSelectedCategory(null);
    navigate("/");
    window.scrollTo(0, 0);
  };

  return (
    <footer className="border-t border-border bg-gradient-to-b from-background to-muted/30 mt-auto">
      <div className="container py-16">
        {/* <div className="grid md:grid-cols-2 gap-12 mb-8"> */}
        <div className="grid gap-12 mb-8">
          {/* Contact Form */}
          <div className="animate-slide-up">
            <div className="mb-6">
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">Get in Touch</h3>
              <p className="text-sm text-muted-foreground">Send us a message via WhatsApp</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-elevated transition-shadow">
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
                  placeholder="Tell us about your inquiry..."
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-whatsapp focus:border-transparent transition-smooth resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 px-4 py-3 text-sm font-semibold hover-lift transition-smooth animate-stagger"
                style={{ animationDelay: '0.25s' }}
              >
                Send via WhatsApp
              </button>
            </form>
          </div>

          {/* Areas */}
          {/* <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="mb-6">
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">Explore Areas</h3>
              <p className="text-sm text-muted-foreground">Browse properties by location</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
              <div className="grid grid-cols-2 gap-3">
                {AREAS.map((area, idx) => (
                  <button
                    key={area}
                    onClick={() => handleAreaClick(area)}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-background/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-smooth group animate-stagger"
                    style={{ animationDelay: `${0.15 + idx * 0.05}s` }}
                  >
                    <MapPin className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">{area}</span>
                  </button>
                ))}
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="container flex flex-col sm:flex-row items-center justify-between py-6 gap-4 text-xs text-muted-foreground">
          <p className="font-medium">© 2026 DreamHome Realty. All rights reserved.</p>
          <div className="flex gap-6">
            <button
              onClick={() => navigate("/privacy-policy")}
              className="hover:text-primary transition-colors hover:underline decoration-transparent hover:decoration-primary"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate("/terms-conditions")}
              className="hover:text-primary transition-colors hover:underline decoration-transparent hover:decoration-primary"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
