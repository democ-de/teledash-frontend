import { Transition } from "@headlessui/react";
import { useNotificationStore } from "stores/notifications";
import { Notification } from "./Notification";

export const Notifications = () => {
  const { notifications, dismissNotification } = useNotificationStore();

  return (
    <div aria-live="assertive">
      <Transition
        show={notifications.length > 0}
        as="div"
        className="z-50 fixed flex flex-col inset-0 space-y-4 items-end px-4 py-6 sm:p-6 pointer-events-none"
      >
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onDismiss={dismissNotification}
          />
        ))}
      </Transition>
    </div>
  );
};
