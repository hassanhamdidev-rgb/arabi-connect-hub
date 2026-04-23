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
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ServicesPage from "./pages/ServicesPage";
import LegalPage from "./pages/LegalPage";
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
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const Protected = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

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
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:type" element={<ServicesPage />} />
          <Route path="/privacy" element={<LegalPage variant="privacy" />} />
          <Route path="/terms" element={<LegalPage variant="terms" />} />
          <Route path="/dashboard" element={<Protected><DashboardHome /></Protected>} />
          <Route path="/dashboard/articles" element={<Protected><ArticlesPage /></Protected>} />
          <Route path="/dashboard/services" element={<Protected><ServicesAdminPage /></Protected>} />
          <Route path="/dashboard/faq" element={<Protected><FAQAdminPage /></Protected>} />
          <Route path="/dashboard/users" element={<Protected><UsersPage /></Protected>} />
          <Route path="/dashboard/messages" element={<Protected><MessagesPage /></Protected>} />
          <Route path="/dashboard/terms" element={<Protected><TermsPage /></Protected>} />
          <Route path="/dashboard/settings" element={<Protected><SettingsPage /></Protected>} />
          <Route path="/dashboard/profile" element={<Protected><ProfilePage /></Protected>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
