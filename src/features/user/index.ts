// Activity Components
export { UserActivitySection } from "./activity/components/UserActivitySection";

// Auth components
export { AuthCard } from "./auth/components/AuthCard";
export { AuthFooter } from "./auth/components/AuthFooter";
export { AuthForm } from "./auth/components/AuthForm";
export { GoogleSignInButton } from "./auth/components/GoogleSignInButton";

// Friends Components
export { FriendsPanel } from "./friends/components/FriendsPanel";

// Profile Components
export { BestScoresCard } from "./profile/components/BestScoresCard";
export { EditProfileModal } from "./profile/components/EditProfileModal/EditProfileModal";
export { FriendsListSection } from "./profile/components/FriendsListSection";
export { ProfileAboutCard } from "./profile/components/ProfileAboutCard";
export { ProfileHeader } from "./profile/components/ProfileHeader";
export { UserAvatar } from "./profile/components/UserAvatar";
export { UserInfo } from "./profile/components/UserInfo";
export { VisitedCountriesCard } from "./profile/components/VisitedCountriesCard";

// Hooks
export { useAuth } from "./auth/hooks/useAuth";
export { useAuthHandlers } from "./auth/hooks/useAuthHandlers";
export { useFirestoreUsername } from "./profile/hooks/useFirestoreUsername";
export { useHomeCountry } from "./profile/hooks/useHomeCountry";
export { useLastLogin } from "./activity/hooks/useLastLogin";
export { useUserProfile } from "./profile/hooks/useUserProfile";
export { useUserActivity } from "./activity/hooks/useUserActivity";
export { useUserDevices } from "./auth/hooks/useUserDevices";
export { useUserFriendCount } from "./friends/hooks/useUserFriendCount";
export { useFriendProfiles } from "./friends/hooks/useFriendProfiles";
export { useUserFriends } from "./friends/hooks/useUserFriends";

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
