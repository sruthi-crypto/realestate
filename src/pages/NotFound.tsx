import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted px-4 py-12">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center max-w-md animate-slide-up">
        {/* 404 Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="text-8xl font-display font-bold text-primary/20">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-6 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-elevated animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <Home className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3 animate-stagger" style={{ animationDelay: '0.1s' }}>
          Page Not Found
        </h1>

        <p className="text-lg text-muted-foreground mb-2 animate-stagger" style={{ animationDelay: '0.15s' }}>
          Oops! It seems the property you're looking for doesn't exist.
        </p>

        <p className="text-sm text-muted-foreground/70 mb-8 animate-stagger" style={{ animationDelay: '0.2s' }}>
          The page might have been moved or doesn't exist anymore.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-stagger" style={{ animationDelay: '0.25s' }}>
          <a href="/" className="inline-block">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent text-primary-foreground hover-lift font-semibold rounded-lg">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </a>

          <a href="/" className="inline-block">
            <Button variant="outline" className="w-full sm:w-auto border-border hover:bg-muted rounded-lg transition-smooth">
              Browse Properties
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </a>
        </div>

        {/* Additional Help Text */}
        <div className="mt-12 pt-8 border-t border-border/50 animate-stagger" style={{ animationDelay: '0.3s' }}>
          <p className="text-xs text-muted-foreground mb-3">Need help?</p>
          <button className="text-primary hover:text-primary/80 transition-colors text-sm font-medium underline decoration-transparent hover:decoration-primary">
            Contact our support team
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
