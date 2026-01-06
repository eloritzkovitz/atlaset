import { useNavigate } from "react-router-dom";
import { ActionButton } from "@components";

export function AuthButtons() {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-end gap-2 mt-4 mr-4">
      <ActionButton
        variant="secondary"
        className="py-2 px-4 !rounded-full"
        onClick={() => navigate("/login")}
      >
        Login
      </ActionButton>
      <ActionButton
        variant="primary"
        className="py-2 px-4 !rounded-full"
        onClick={() => navigate("/signup")}
      >
        Sign up
      </ActionButton>      
    </div>
  );
}
