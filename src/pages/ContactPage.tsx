import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  Share2, 
  Loader2, 
  MessageCircle, 
  Upload, 
  X,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { breadcrumbsLd, organizationLd } from "@/lib/seo";
import { directus, createItem, uploadFiles, readItems } from "@/lib/directus";
import { z } from "zod";

// ========== TYPES ==========
interface Category {
  id: string | number;
  name: string;
}

interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  category: string;
  description: string;
  owner?: string;
  is_read?: boolean;
  is_replied?: boolean;
  status?: string;
  files?: Array<{ directus_files_id: string }>;
}

interface FileRelation {
  directus_files_id: string;
}

// ========== VALIDATION SCHEMA ==========
const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "الاسم قصير جداً" })
    .max(100, { message: "الاسم طويل جداً" }),
  email: z
    .string()
    .trim()
    .email({ message: "بريد إلكتروني غير صالح" })
    .max(255, { message: "البريد الإلكتروني طويل جداً" }),
  phone: z
    .string()
    .trim()
    .min(8, { message: "رقم الهاتف غير صالح" })
    .max(20, { message: "رقم الهاتف طويل جداً" })
    .regex(/^[+0-9\s-]+$/, { message: "رقم الهاتف يحتوي على رموز غير صالحة" }),
  category: z
    .string()
    .min(1, { message: "اختر نوع الاستفسار" })
    .max(255),
  description: z
    .string()
    .trim()
    .min(10, { message: "الرسالة قصيرة جداً (10 أحرف على الأقل)" })
    .max(2000, { message: "الرسالة طويلة جداً" }),
});

type ContactFormData = z.infer<typeof contactSchema>;

// ========== CONSTANTS ==========
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_FILES = 3;
const RATE_LIMIT_MINUTES = 30;
const RATE_LIMIT_KEY = "last_contact_submission";

// ========== DEFAULT CATEGORIES (FALLBACK) ==========
const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: "استشارة قانونية" },
  { id: 2, name: "قضايا تجارية" },
  { id: 3, name: "قضايا عمالية" },
  { id: 4, name: "أحوال شخصية" },
  { id: 5, name: "تحكيم" },
  { id: 6, name: "استفسار عام" },
];

// ========== CONTACT PAGE COMPONENT ==========
const ContactPage = () => {
  const { toast } = useToast();

  // ========== STATE MANAGEMENT ==========
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    category: "",
    description: "",
  });

  // ========== FETCH CATEGORIES ON MOUNT ==========
  useEffect(() => {
    fetchCategories();
  }, []);

  // ========== FETCH CATEGORIES FROM DIRECTUS ==========
  const fetchCategories = async () => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    
    try {
      const response = await directus.request(
        readItems("categories", {
          filter: {
            type: {
              _eq: "contact",
            },
          },
          fields: ["id", "name"],
          limit: -1, // Fetch all
          sort: ["name"], // Sort alphabetically
        })
      );

      if (response && Array.isArray(response) && response.length > 0) {
        setCategories(response as Category[]);
        console.log("✅ Categories loaded successfully:", response.length);
      } else {
        console.warn("⚠️ No categories found, using defaults");
        setCategories(DEFAULT_CATEGORIES);
        setCategoriesError("تم استخدام الفئات الافتراضية");
      }
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
      
      // Use default categories on error
      setCategories(DEFAULT_CATEGORIES);
      setCategoriesError(
        error instanceof Error
          ? error.message
          : "فشل تحميل الفئات، تم استخدام القيم الافتراضية"
      );

      // Show toast notification about fallback
      toast({
        title: "تنبيه",
        description: "تم استخدام الفئات الافتراضية بسبب مشكلة الاتصال",
        variant: "destructive",
      });
    } finally {
      setCategoriesLoading(false);
    }
  };

  // ========== RATE LIMITING ==========
  const checkRateLimit = (): boolean => {
    const lastSubmission = localStorage.getItem(RATE_LIMIT_KEY);
    if (!lastSubmission) return true;

    const lastTime = parseInt(lastSubmission, 10);
    const currentTime = Date.now();
    const diffMinutes = (currentTime - lastTime) / (1000 * 60);

    if (diffMinutes < RATE_LIMIT_MINUTES) {
      const remainingMinutes = Math.ceil(RATE_LIMIT_MINUTES - diffMinutes);
      
      toast({
        title: "انتظر قليلاً",
        description: `يمكنك إرسال استفسار جديد بعد ${remainingMinutes} دقيقة`,
        variant: "destructive",
      });
      
      return false;
    }

    return true;
  };

  const recordSubmission = () => {
    localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
  };

  // ========== FILE HANDLING ==========
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles = [...files, ...selectedFiles];

    // Validate file count
    if (newFiles.length > MAX_FILES) {
      toast({
        title: "عدد الملفات زائد",
        description: `يمكنك تحميل بحد أقصى ${MAX_FILES} ملفات فقط`,
        variant: "destructive",
      });
      return;
    }

    // Validate file sizes
    for (const file of newFiles) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "حجم الملف كبير جداً",
          description: `حد أقصى لحجم الملف هو 5 MB - ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
          variant: "destructive",
        });
        return;
      }
    }

    setFiles(newFiles);
    // Reset input
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ========== FORM SUBMISSION ==========
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null);

    // Check rate limit
    if (!checkRateLimit()) {
      return;
    }

    // Validate form data
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      toast({
        title: "خطأ في البيانات",
        description: firstError.message || "يرجى التحقق من البيانات المدخلة",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      let uploadedFileIds: string[] = [];

      // Step 1: Upload files if any
      if (files.length > 0) {
        try {
          console.log("📤 Uploading files...");
          uploadedFileIds = await uploadFiles(files);
          console.log("✅ Files uploaded:", uploadedFileIds);
        } catch (uploadError) {
          console.error("❌ File upload failed:", uploadError);
          
          toast({
            title: "خطأ في رفع الملفات",
            description:
              uploadError instanceof Error
                ? uploadError.message
                : "فشل رفع الملفات. يمكنك المتابعة بدون ملفات",
            variant: "destructive",
          });
          
          // Continue without files
          uploadedFileIds = [];
        }
      }

      // Step 2: Map files to Directus relation format
      const fileRelations: FileRelation[] = uploadedFileIds.map((id) => ({
        directus_files_id: id,
      }));

      // Step 3: Create contact message
      const contactMessageData: ContactMessage = {
        ...parsed.data,
        owner: "client",
        is_read: false,
        is_replied: false,
        status: "new",
      };

      // Only add files if any were uploaded
      if (fileRelations.length > 0) {
        contactMessageData.files = fileRelations;
      }

      console.log("📝 Creating contact message...", contactMessageData);

      const createdMessage = await directus.request(
        createItem("contact_messages", contactMessageData as never)
      );

      console.log("✅ Contact message created:", createdMessage);

      // Record submission for rate limiting
      recordSubmission();

      // Show success message
      setSuccessMessage(
        `شكراً لتواصلك معنا! سنرد على استفسارك في أقرب وقت على البريد الإلكتروني: ${parsed.data.email}`
      );

      toast({
        title: "✅ تم إرسال رسالتك بنجاح",
        description: "سنتواصل معك قريباً",
      });

      // Reset form
      setForm({
        name: "",
        email: "",
        phone: "",
        category: "",
        description: "",
      });
      setFiles([]);

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error("❌ Submission error:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى";

      toast({
        title: "❌ فشل إرسال الرسالة",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ========== FORM UPDATE HELPER ==========
  const updateForm = <K extends keyof ContactFormData>(
    key: K,
    value: ContactFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ========== SHARE LOCATION ==========
  const shareLocation = () => {
    if (navigator.share) {
      navigator.share({
        title: "موقع مكتب المجنوني للمحاماة",
        url: "https://maps.google.com/?q=24.7136,46.6753",
      });
    } else {
      toast({
        title: "المشاركة غير مدعومة",
        description: "جهازك لا يدعم المشاركة المباشرة",
        variant: "destructive",
      });
    }
  };

  // ========== SEO ==========
  const seoNode = (
    <SEO
      title="تواصل معنا | حجز استشارة قانونية بالرياض"
      description="تواصل مع مكتب خالد عويد المجنوني للمحاماة في الرياض عبر الهاتف، البريد الإلكتروني أو زيارتنا. متاحون للاستشارات القانونية."
      path="/contact"
      keywords={["تواصل محامي", "حجز استشارة", "مكتب محاماة الرياض"]}
      jsonLd={[
        organizationLd,
        breadcrumbsLd([
          { name: "الرئيسية", path: "/" },
          { name: "تواصل معنا", path: "/contact" },
        ]),
      ]}
    />
  );

  // ========== RENDER ==========
  return (
    <Layout>
      {seoNode}
      
      {/* Hero Section */}
      <section className="pt-36 pb-20 gradient-teal">
        <div className="section-container text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">
            تواصل معنا
          </h1>
          <p className="text-primary-foreground/80 text-lg">
            نسعد بتواصلكم ونرد على جميع استفساراتكم
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form Side */}
            <div className="glass-card rounded-xl p-8">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                أرسل رسالتك
              </h2>

              {/* Success Message */}
              {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      {successMessage}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      الاسم الكامل <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="أدخل اسمك"
                      value={form.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                      maxLength={100}
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      dir="ltr"
                      value={form.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      maxLength={255}
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    placeholder="+966 5X XXX XXXX"
                    dir="ltr"
                    value={form.phone}
                    onChange={(e) => updateForm("phone", e.target.value)}
                    maxLength={20}
                    required
                    disabled={submitting}
                  />
                </div>

                {/* Category with Loading State */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    نوع الاستفسار <span className="text-red-500">*</span>
                  </label>
                  
                  {categoriesError && (
                    <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700 flex gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{categoriesError}</span>
                    </div>
                  )}

                  <Select
                    value={form.category}
                    onValueChange={(v) => updateForm("category", v)}
                    disabled={submitting || categoriesLoading}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          categoriesLoading
                            ? "جاري التحميل..."
                            : "اختر نوع الاستفسار"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={`${category.id}-${category.name}`}
                          value={category.name}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    الرسالة <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder="اكتب رسالتك هنا..."
                    rows={5}
                    value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    maxLength={2000}
                    required
                    disabled={submitting}
                  />
                  <div className="text-xs text-muted-foreground mt-1 text-left">
                    {form.description.length}/2000
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    المرفقات (اختياري)
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-accent transition-colors">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-input"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                      disabled={submitting || files.length >= MAX_FILES}
                    />
                    <label
                      htmlFor="file-input"
                      className={`cursor-pointer flex flex-col items-center gap-2 ${
                        submitting ? "opacity-50" : ""
                      }`}
                    >
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <div className="text-sm font-medium text-foreground">
                        انقر أو اسحب الملفات هنا
                      </div>
                      <div className="text-xs text-muted-foreground">
                        حد أقصى {MAX_FILES} ملفات، 5 MB لكل ملف
                      </div>
                    </label>
                  </div>

                  {/* File List */}
                  {files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {files.map((file, idx) => (
                        <div
                          key={`${idx}-${file.name}`}
                          className="flex items-center justify-between bg-muted p-3 rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="ml-3 p-1 hover:bg-destructive/20 rounded transition-colors"
                            disabled={submitting}
                          >
                            <X className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitting || loading}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      إرسال الرسالة
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Info Side */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="font-heading font-bold text-foreground mb-4">
                  معلومات التواصل
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: MapPin,
                      label: "العنوان",
                      value: "الرياض، المملكة العربية السعودية",
                    },
                    { icon: Phone, label: "الهاتف", value: "+966 50 000 0000" },
                    { icon: Mail, label: "البريد", value: "info@almajnouni.com" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {item.label}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share Section */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="font-heading font-bold text-foreground mb-4">
                  شارك موقعنا
                </h3>
                <div className="flex gap-3 flex-wrap">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      typeof window !== "undefined"
                        ? window.location.href
                        : ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      فيسبوك
                    </Button>
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      typeof window !== "undefined"
                        ? window.location.href
                        : ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      تويتر
                    </Button>
                  </a>

                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      typeof window !== "undefined"
                        ? window.location.href
                        : ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      لنكدان
                    </Button>
                  </a>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      typeof window !== "undefined"
                        ? window.location.href
                        : ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="gap-2">
                      <MessageCircle className="h-4 w-4" />
                      واتساب
                    </Button>
                  </a>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareLocation}
                    className="gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    مشاركة الموقع
                  </Button>
                </div>
              </div>

              {/* Google Maps */}
              <div className="rounded-xl overflow-hidden border border-border h-[250px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.6554!2d46.6753!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQyJzQ5LjAiTiA0NsijNDAnMzEuMSJF!5e0!3m2!1sar!2ssa!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="موقع المكتب"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;