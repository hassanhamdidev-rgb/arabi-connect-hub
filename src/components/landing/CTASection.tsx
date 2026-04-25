import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 gradient-teal">
      <div className="section-container text-center">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
          هل تحتاج استشارة قانونية؟
        </h2>
        <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
          تواصل معنا الآن واحصل على استشارة مجانية من فريقنا المتخصص
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/contact">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 text-base px-8">
              <Phone className="w-5 h-5" />
              اتصل بنا الآن
            </Button>
          </Link>
          <a href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer">
            <Button size="lg"  className="bg-accent/80 text-accent-foreground hover:bg-accent/70 gap-2 text-base px-8">
              <MessageCircle className="w-5 h-5" />
              واتساب
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
