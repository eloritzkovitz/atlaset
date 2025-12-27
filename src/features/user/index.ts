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
export { useAuthHandlers } from "./auth/hooks/useAuthHandlers";
export { useFirestoreUsername } from "./profile/hooks/useFirestoreUsername";
export { useHomeCountry } from "./profile/hooks/useHomeCountry";
export { useUserProfile } from "./profile/hooks/useUserProfile";

// Services
export { authService } from "./auth/services/authService";

// Utils
export { logUserActivity } from "./activity/utils/activity";
