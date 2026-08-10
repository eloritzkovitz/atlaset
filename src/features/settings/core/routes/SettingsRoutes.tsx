import { Navigate, Route, Routes } from "react-router-dom";
import { SecurityInfoSection } from "@features/user/account";
import SettingsPage from "../pages/SettingsPage";
import { AccountSettingsSection } from "../../account/components/AccountSettingsSection";
import { DisplaySettingsSection } from "../../display/components/DisplaySettingsSection";
import { AccessibilitySettingsSection } from "../../accessibility/components/AccessibilitySettingsSection";
import { PrivacySettingsSection } from "../../privacy/components/PrivacySettingsSection";

export function SettingsRoutes() {
  return (
    <Routes>
      <Route element={<SettingsPage />}>
        <Route index element={<Navigate to="account" replace />} />
        <Route path="account" element={<AccountSettingsSection />} />
        <Route path="display" element={<DisplaySettingsSection />} />
        <Route
          path="accessibility"
          element={<AccessibilitySettingsSection />}
        />
        <Route path="privacy" element={<PrivacySettingsSection />} />
        <Route path="security" element={<SecurityInfoSection />} />
        <Route path="*" element={<Navigate to="account" replace />} />
      </Route>
    </Routes>
  );
}
