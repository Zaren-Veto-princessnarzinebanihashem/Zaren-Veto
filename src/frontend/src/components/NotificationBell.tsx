import { Bell } from "lucide-react";

interface NotificationBellProps {
  unreadCount: number;
  onClick?: () => void;
  className?: string;
}

/**
 * Bell icon with a red unread-count badge.
 * Shows a dot when unreadCount > 0; shows numeric badge for > 0 count.
 */
export function NotificationBell({
  unreadCount,
  onClick,
  className = "",
}: NotificationBellProps) {
  const hasUnread = unreadCount > 0;
  const displayCount = unreadCount > 99 ? "99+" : String(unreadCount);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        hasUnread ? `${unreadCount} unread notifications` : "Notifications"
      }
      data-ocid="notification-bell"
      className={`notification-bell text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
    >
      <Bell className="w-5 h-5" />
      {hasUnread && (
        <span
          className="notification-badge"
          aria-hidden="true"
          data-ocid="notification-badge"
          style={
            unreadCount > 0
              ? {
                  width: unreadCount > 9 ? "auto" : "16px",
                  height: "16px",
                  padding: unreadCount > 9 ? "0 3px" : "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#fff",
                  top: 2,
                  right: 2,
                  borderRadius: unreadCount > 9 ? "8px" : "50%",
                }
              : {}
          }
        >
          {unreadCount > 0 ? displayCount : null}
        </span>
      )}
    </button>
  );
}
