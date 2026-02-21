import { useState, useRef } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Menu, MenuButton, SearchInput } from "@components";
import { useClickOutside, useDebounce, useMenuPosition } from "@hooks";
import { useUserSearch } from "../hooks/useUserSearch";

export function UserSearchDropdown() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { results, loading } = useUserSearch(debouncedSearchTerm);
  const navigate = useNavigate();

  // Open dropdown when searchTerm is non-empty and input is focused
  const handleFocus = () => {
    if (searchTerm) setDropdownOpen(true);
  };

  // Handle search input changes
  const handleChange = (val: string) => {
    setSearchTerm(val);
    if (val) setDropdownOpen(true);
    else setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useClickOutside(
    [
      inputRef as React.RefObject<HTMLElement>,
      dropdownRef as React.RefObject<HTMLElement>,
    ],
    () => setDropdownOpen(false),
    dropdownOpen,
  );

  // Calculate dropdown position
  const menuStyle = useMenuPosition(
    dropdownOpen,
    inputRef as React.RefObject<HTMLElement>,
    dropdownRef as React.RefObject<HTMLElement>,
    42,
    "right",
    true,
  );

  return (
    <div className="relative w-full max-w-xs">
      <SearchInput
        ref={inputRef}
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search"
        onFocus={handleFocus}
      />
      {dropdownOpen && (
        <Menu
          open={dropdownOpen}
          onClose={() => setDropdownOpen(false)}
          containerRef={dropdownRef}
          disableScroll
          style={menuStyle}
        >
          {loading ? (
            <div className="p-4 text-center text-muted">Searching...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-muted">No users found</div>
          ) : (
            <ul>
              {results.map((user) => (
                <li key={user.uid}>
                  <MenuButton
                    onClick={() => {
                      navigate(`/users/${user.username}`);
                      setDropdownOpen(false);
                    }}
                    icon={
                      user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.username}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <FaCircleUser className="w-8 h-8 text-muted" />
                      )
                    }
                    className="w-full flex items-center gap-3 px-2 py-2"
                    ariaLabel={`Go to ${user.username}'s profile`}
                  >
                    <div className="flex flex-col items-start">
                      {user.displayName && (
                        <span className="font-medium">{user.displayName}</span>
                      )}
                      <span className="text-sm text-muted">
                        @{user.username}
                      </span>
                    </div>
                  </MenuButton>
                </li>
              ))}
            </ul>
          )}
        </Menu>
      )}
    </div>
  );
}
