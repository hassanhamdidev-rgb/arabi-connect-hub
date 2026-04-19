import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import FAQPage from "./pages/FAQPage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import AuthPage from "./pages/AuthPage";
import ServicesPage from "./pages/ServicesPage";
import BlogPostPage from "./pages/BlogPostPage";
import DashboardHome from "./pages/dashboard/DashboardHome";
import TermsPage from "./pages/dashboard/TermsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import ArticlesPage from "./pages/dashboard/ArticlesPage";
import ServicesAdminPage from "./pages/dashboard/ServicesAdminPage";
import FAQAdminPage from "./pages/dashboard/FAQAdminPage";
import UsersPage from "./pages/dashboard/UsersPage";
import MessagesPage from "./pages/dashboard/MessagesPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/articles" element={<ArticlesPage />} />
          <Route path="/dashboard/services" element={<ServicesAdminPage />} />
          <Route path="/dashboard/faq" element={<FAQAdminPage />} />
          <Route path="/dashboard/users" element={<UsersPage />} />
          <Route path="/dashboard/messages" element={<MessagesPage />} />
          <Route path="/dashboard/terms" element={<TermsPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
