import type { ReactNode } from "react";
import { FaUserMinus, FaUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { MenuButton } from "@components";
import { friendService } from "../services/friendService";
import { useAuth } from "../../auth/hooks/useAuth";

interface FriendListItemMenuActionsProps {
  uid: string;
  username?: string;
}

export function FriendListItemMenuActions({
  uid,
  username,
}: FriendListItemMenuActionsProps): ReactNode {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <>
      <MenuButton
        onClick={() => {
          if (username) {
            navigate(`/users/${username}`);
          } else {
            navigate(`/users/${uid}`);
          }
        }}
        icon={<FaUser className="me-2" />}
        className="w-full"
      >
        View Profile
      </MenuButton>
      {user && user.uid !== uid && (
        <MenuButton
          onClick={() => {
            if (user?.uid) {
              friendService.removeFriend(user.uid, uid);
            }
          }}
          icon={<FaUserMinus className="me-2" />}
          className="w-full text-danger"
        >
          Unfriend
        </MenuButton>
      )}
    </>
  );
}
