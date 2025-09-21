import { useState, useRef, useEffect } from 'react';
import { Coins, ChevronDown, User, Menu } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import { selectChatCoins } from '../../store/slices/chatSlice';
import NotificationsPanel from './NotificationsPanel';
import AdminPanel from './AdminPanel';

export default function Header({ className = '', onMobileMenuToggle, mobileMenuOpen }) {
	const coins = useSelector(selectChatCoins);
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef(null);
	const triggerRef = useRef(null);
	const dispatch = useDispatch();

	useEffect(() => {
		if (!menuOpen) return;
		const handler = (e) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(e.target) &&
				triggerRef.current &&
				!triggerRef.current.contains(e.target)
			) {
				setMenuOpen(false);
			}
		};
		document.addEventListener('mousedown', handler);
		document.addEventListener('touchstart', handler);
		return () => {
			document.removeEventListener('mousedown', handler);
			document.removeEventListener('touchstart', handler);
		};
	}, [menuOpen]);

	const handleLogout = async () => {
		try {
			await dispatch(logoutUser()).unwrap();
		} catch (_) {
			/* ignore */
		}
		window.location.href = '/signin';
	};

	return (
		<header className={`flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b border-gray-200 gap-4 ${className}`}>
			<div className="flex items-center gap-3">
				{/* Mobile menu button */}
				<button
					className="md:hidden p-2 rounded-md border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
					aria-label="Toggle menu"
					aria-expanded={mobileMenuOpen || false}
					onClick={onMobileMenuToggle}
				>
					<Menu size={20} className="text-gray-700" />
				</button>
				<h1 className="text-lg font-semibold text-gray-900">AI Chat</h1>
			</div>

			<div className="flex items-center gap-3 sm:gap-4">
						<div className="flex items-center gap-2 bg-blue-50 text-blue-600 rounded-full px-4 py-1.5 shadow-sm">
							<Coins size={18} strokeWidth={2} />
							<span className="text-sm font-medium">{coins}</span>
						</div>

				<NotificationsPanel />

				<button
					ref={triggerRef}
					onClick={() => setMenuOpen((o) => !o)}
					className={`flex items-center gap-2 rounded-full pl-1 pr-2 py-1 transition-all border border-transparent hover:border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
					aria-haspopup="menu"
					aria-expanded={menuOpen}
				>
					<div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-sm">
						<User size={16} className="text-white" />
					</div>
					<span className="text-sm font-medium text-gray-900">Admin</span>
					<ChevronDown size={16} className={`text-gray-600 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
				</button>

				{menuOpen && <AdminPanel ref={menuRef} onLogout={handleLogout} />}
			</div>
		</header>
	);
}