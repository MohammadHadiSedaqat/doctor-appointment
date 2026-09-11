import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Route, Routes } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { AuthProvider } from "@/lib/AuthContext";
import { I18nProvider } from "@/i18n/I18nContext";
import PublicLayout from "@/components/PublicLayout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import Qualifications from "@/pages/Qualifications";
import Pricing from "@/pages/Pricing";
import ContactPage from "@/pages/ContactPage";
import Clinic from "@/pages/Clinic";
import Privacy from "@/pages/Privacy";
import PageNotFound from "@/lib/PageNotFound";
import { publicPaths } from "@/seo/routes";
import { getLocaleBasename, localizePath } from "@/i18n/locale";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/qualifications", element: <Qualifications /> },
  { path: "/services", element: <Services /> },
  { path: "/services/:id", element: <ServiceDetail /> },
  { path: "/pricing", element: <Pricing /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/clinic", element: <Clinic /> },
  { path: "/privacy", element: <Privacy /> },
];

export function renderPublicRoute(pathname, lang = "fa") {
  const location = localizePath(pathname, lang);
  return renderToStaticMarkup(
    <AuthProvider>
      <I18nProvider initialLang={lang}>
        <StaticRouter basename={getLocaleBasename(lang)} location={location}>
          <Routes>
            <Route element={<PublicLayout />}>
              {routes.map((route) => <Route key={route.path} path={route.path} element={route.element} />)}
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </StaticRouter>
      </I18nProvider>
    </AuthProvider>,
  );
}

export const prerenderRoutes = publicPaths;
