import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { Notifications } from "@mantine/notifications";
import "dayjs/locale/es"
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";

import "./assets/css/styles.css";
import "./assets/css/layouts.css";
import "./assets/css/pages.css";
import { AppRouter } from "./router/AppRouter";

import { AuthProvider } from "./providers/AuthProvider";
import { ModalProvider } from "./providers/ModalProvider";
import { MetadataProvider } from "./providers/MetadataProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <MetadataProvider>
            <MantineProvider>
              <Notifications
                limit={3}
                position="top-right"
                autoClose={5000} />
              <DatesProvider settings={{ locale: "es" }}>
                <ModalProvider>
                  <AppRouter />
                </ModalProvider>
              </DatesProvider>
            </MantineProvider>
          </MetadataProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);