import React, { useState } from "react";
import { CalendarHeart, Clock, FileText, User, LayoutDashboard, Users, CalendarCheck, MessageSquare } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/lib/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import PatientPanel from "@/components/dashboards/PatientPanel";
import DoctorPanel from "@/components/dashboards/DoctorPanel";
import AdminPanel from "@/components/dashboards/AdminPanel";

export default function Dashboard() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [section, setSection] = useState("overview");

  const role = user?.role || "user";

  let navItems, Panel;
  if (role === "admin") {
    navItems = [
      { key: "overview", label: t("dash.overview"), icon: LayoutDashboard },
      { key: "messages", label: t("sections.contactTitle"), icon: MessageSquare },
    ];
    Panel = AdminPanel;
  } else if (role === "doctor") {
    navItems = [
      { key: "overview", label: t("dash.overview"), icon: LayoutDashboard },
      { key: "today", label: t("dash.today"), icon: CalendarCheck },
      { key: "patients", label: t("dash.patients"), icon: Users },
    ];
    Panel = DoctorPanel;
  } else {
    navItems = [
      { key: "overview", label: t("dash.overview"), icon: LayoutDashboard },
      { key: "appointments", label: t("dash.myAppts"), icon: CalendarHeart },
      { key: "history", label: t("dash.myHistory"), icon: Clock },
      { key: "prescriptions", label: t("dash.myPrescriptions"), icon: FileText },
      { key: "documents", label: t("dash.myDocuments"), icon: FileText },
      { key: "profile", label: t("dash.myProfile"), icon: User },
    ];
    Panel = PatientPanel;
  }

  return (
    <DashboardLayout navItems={navItems} active={section} onNavigate={setSection}>
      <Panel section={section} />
    </DashboardLayout>
  );
}