import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
const Notifications = () => {
  const { notifications, readNotifications } = useChatStore();
  useEffect(() => {
    readNotifications();
  }, [readNotifications]);
  if (!notifications || notifications?.length == 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center ">
        <h1 className="text-3xl font-white font-semibold ">No notifications</h1>
      </div>
    );
  }
  return (
    <div className="flex max-w-3xl  flex-col mx-auto  ">
      <div className="w-full text-start  text-white font-semibold sm:text-lg md:text-xl mb-3">
        Notifications
      </div>
      {notifications?.toReversed().map((notification, index) => {
        return (
          <div
            key={index}
            className={` w-full  flex items-center justify-between  min-h-15 gap-5   text-white text:sm px-5  border-b-2 border-slate-400  py-2   ${
              notification.isRead ? " bg-slate-700" : "bg-blue-400"
            } `}
          >
            <p>{notification.message}</p>
            <p className="text-nowrap">
              {notification.createdAt.split("T")[0]}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Notifications;
