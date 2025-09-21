import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';


export default function NotificationsPanel({ className = '' }) {
const [open, setOpen] = useState(false);
const panelRef = useRef(null);
const buttonRef = useRef(null);
const [notifications, setNotifications] = useState([
{ id: '1', title: 'Welcome!', body: 'Welcome to AI Chat. You have 1,250 credits to start with.', time: '5m ago', unread: true },
{ id: '2', title: 'Feature Update', body: 'New conversation export feature is now available.', time: '2h ago', unread: true },
]);


const unreadCount = notifications.filter((n) => n.unread).length;


const markAllRead = () => {
setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
};


// Close on outside click
useEffect(() => {
	if (!open) return;
	const handleClick = (e) => {
		if (panelRef.current && !panelRef.current.contains(e.target) && buttonRef.current && !buttonRef.current.contains(e.target)) {
			setOpen(false);
		}
	};
	document.addEventListener('mousedown', handleClick);
	document.addEventListener('touchstart', handleClick);
	return () => {
		document.removeEventListener('mousedown', handleClick);
		document.removeEventListener('touchstart', handleClick);
	};
}, [open]);

return (
<div className={`relative ${className}`}>
<button
onClick={() => setOpen((o) => !o)}
className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
aria-label="Notifications"
ref={buttonRef}
>
<Bell size={22} className="text-gray-600" />
{unreadCount > 0 && (
<span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-medium rounded-full w-4 h-4 flex items-center justify-center">
{unreadCount}
</span>
)}
</button>


{open && (
<div ref={panelRef} className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 shadow-xl rounded-xl z-20">
<div className="flex items-center justify-between px-4 py-3 bg-blue-50 rounded-t-xl">
<h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
{unreadCount > 0 ? (
<button
onClick={markAllRead}
className="text-xs text-blue-600 font-medium hover:underline"
>
Mark all read
</button>
) : (
<span className="text-xs text-gray-500">All read</span>
)}
</div>


<div className="divide-y divide-gray-100">
{notifications.map((n) => (
<div key={n.id} className="px-4 py-3 flex items-start justify-between hover:bg-blue-50/60 transition-colors cursor-pointer">
<div className="flex-1">
<h4 className="font-medium text-gray-800">{n.title}</h4>
<p className="text-sm text-gray-600 mt-1">{n.body}</p>
</div>
<div className="flex flex-col items-end ml-3">
<span className="text-xs text-gray-400">{n.time}</span>
{n.unread && <span className="mt-2 w-2 h-2 bg-blue-600 rounded-full"></span>}
</div>
</div>
))}
</div>
</div>
)}
</div>
);
}