import { MapPin } from "lucide-react";

const MapSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="section-container">
        <div className="text-center mb-10">
          <span className="text-accent font-medium text-sm">موقعنا</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-2">
            زوروا مكتبنا
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>الرياض، المملكة العربية السعودية</span>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden border border-border shadow-lg h-[400px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.6554!2d46.6753!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQyJzQ5LjAiTiA0NsijNDAnMzEuMSJF!5e0!3m2!1sar!2ssa!4v1"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="موقع المكتب"
          />
        </div>
      </div>
    </section>
  );
};

export default MapSection;
