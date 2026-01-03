// Auth components
export { AuthCard } from "./auth/components/AuthCard";
export { AuthFooter } from "./auth/components/AuthFooter";
export { AuthForm } from "./auth/components/AuthForm";
export { AuthLayout } from "./auth/components/AuthLayout";
export { GoogleSignInButton } from "./auth/components/GoogleSignInButton";

// Profile Components
export { ProfileInfoCard } from "./profile/components/ProfileInfoCard";
export { EditProfileModal } from "./profile/components/EditProfileModal";
export { UserAvatar } from "./profile/components/UserAvatar";
export { UserActivitySection } from "./activity/components/UserActivitySection";
export { VisitedCountriesCard } from "./profile/components/VisitedCountriesCard";

// Search Components
export { UserSearchDropdown } from "./search/components/UserSearchDropdown";

// Hooks
export { useAuth } from "./auth/hooks/useAuth";
export { useAuthHandlers } from "./auth/hooks/useAuthHandlers";
export { useFirestoreUsername } from "./profile/hooks/useFirestoreUsername";
export { useHomeCountry } from "./profile/hooks/useHomeCountry";
export { useUserProfile } from "./profile/hooks/useUserProfile";
export { useUserActivity } from "./activity/hooks/useUserActivity";
export { useUserDevices } from "./auth/hooks/useUserDevices";

// Redux
export { default as authReducer } from "./auth/slices/authSlice";
export * from "./auth/slices/authSlice";

// Services
export { authService } from "./auth/services/authService";

// Types
export * from "./types";

// Utils
export { logUserActivity } from "./activity/utils/activity";
export { isPasswordProvider } from "./auth/utils/auth";
export { isCurrentSession } from "./auth/utils/device";
