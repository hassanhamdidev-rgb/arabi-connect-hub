const READING_TIME_OPTIONS = [
    { value: 5, labelAr: "5 دقائق", labelEn: "5 min" },
    { value: 10, labelAr: "10 دقائق", labelEn: "10 min" },
    { value: 15, labelAr: "15 دقيقة", labelEn: "15 min" },
    { value: 20, labelAr: "20 دقيقة", labelEn: "20 min" },
    { value: 30, labelAr: "30 دقيقة", labelEn: "30 min" },
    { value: 45, labelAr: "45 دقيقة", labelEn: "45 min" },
    { value: 60, labelAr: "1 ساعة", labelEn: "1 hour" },
    { value: 90, labelAr: "1 ساعة و 30 دقيقة", labelEn: "1 hour 30 min" }
  ];

  const mainItems = [
    { title: "نظرة عامة", url: "/dashboard", icon: LayoutDashboard, end: true },
    { title: "المقالات والمدونة", url: "/dashboard/articles", icon: FileText },
    { title: "الخدمات", url: "/dashboard/services", icon: Briefcase },
    { title: "الأسئلة الشائعة", url: "/dashboard/faq", icon: HelpCircle },
  ];
  
  const manageItems = [
    { title: "المستخدمون", url: "/dashboard/users", icon: Users },
    { title: "الرسائل الواردة", url: "/dashboard/messages", icon: Mail },
    { title: "الشروط والسياسة", url: "/dashboard/terms", icon: ShieldCheck },
    { title: "الإعدادات", url: "/dashboard/settings", icon: Settings },
    { title: "الملف الشخصي", url: "/dashboard/profile", icon: UserCircle },
  ];



  const visitorsData = [
    { day: "السبت", visitors: 320, views: 540 },
    { day: "الأحد", visitors: 410, views: 690 },
    { day: "الإثنين", visitors: 380, views: 720 },
    { day: "الثلاثاء", visitors: 520, views: 880 },
    { day: "الأربعاء", visitors: 610, views: 1020 },
    { day: "الخميس", visitors: 480, views: 940 },
    { day: "الجمعة", visitors: 550, views: 1100 },
  ];
  
  const categoryData = [
    { name: "تجارية", value: 35 },
    { name: "عمالية", value: 25 },
    { name: "أحوال", value: 20 },
    { name: "تحكيم", value: 12 },
    { name: "أخرى", value: 8 },
  ];
  
  const COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--accent))",
    "hsl(var(--gold))",
    "hsl(var(--teal-light))",
    "hsl(var(--gold-dark))",
  ];