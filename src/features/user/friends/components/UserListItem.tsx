import { FaCircleUser, FaCheck, FaXmark } from "react-icons/fa6";
import { useUserProfile } from "../../profile/hooks/useUserProfile";
import { Link } from "react-router-dom";
import { ActionButton } from "@components";

interface UserListItemProps {
  uid: string;
  profileLink?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  loading?: boolean;
}

export function UserListItem({
  uid,
  profileLink = true,
  onAccept,
  onReject,
  loading: externalLoading,
}: UserListItemProps) {
  const { profile: userProfile, loading: profileLoading } = useUserProfile({
    uid,
  });
  const loading = externalLoading ?? profileLoading;

  const content = (
    <>
      {loading ? (
        <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
      ) : userProfile?.photoURL ? (
        <img
          src={userProfile.photoURL}
          alt={userProfile.username}
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <FaCircleUser className="w-8 h-8 text-muted" />
      )}
      <div className="flex flex-col flex-1 min-w-0">
        {loading ? (
          <span className="h-4 w-24 bg-muted rounded-lg animate-pulse" />
        ) : (
          <>
            {userProfile?.displayName && (
              <span className="font-medium truncate">
                {userProfile.displayName}
              </span>
            )}
            <span className="text-sm text-muted truncate">
              @{userProfile?.username}
            </span>
          </>
        )}
      </div>
    </>
  );

  return (
    <li className="flex bg-surface-alt/40 rounded-lg items-center gap-3 px-2 py-2">
      {profileLink ? (
        <Link
          to={`/users/${userProfile?.username || uid}`}
          className="flex items-center gap-3 flex-1 min-w-0 hover:underline focus:outline-none"
          tabIndex={0}
        >
          {content}
        </Link>
      ) : (
        <div className="flex items-center gap-3 flex-1 min-w-0">{content}</div>
      )}
      {(onAccept || onReject) && (
        <div className="flex gap-1 ml-2">
          {onAccept && (
            <ActionButton
              onClick={onAccept}
              title="Accept"
              ariaLabel="Accept friend request"
              icon={<FaCheck />}
              className="text-success"
              rounded
            />
          )}
          {onReject && (
            <ActionButton
              onClick={onReject}
              title="Reject"
              ariaLabel="Reject friend request"
              icon={<FaXmark />}
              className="text-danger"
              rounded
            />
          )}
        </div>
      )}
    </li>
  );
}
