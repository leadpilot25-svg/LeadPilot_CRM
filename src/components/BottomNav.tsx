import { Calendar, UserPlus, Plus, CheckCircle, BarChart3 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

interface BottomNavProps {
  onRefresh: () => void;
  onAddLead: () => void; // ✅ added
}

export function BottomNav({ onRefresh, onAddLead }: BottomNavProps) {

  const navItems = [
    { label: 'Today', icon: Calendar, path: '/' },
    { label: 'New', icon: UserPlus, path: '/?filter=New' },
    { label: 'Add', icon: Plus, isCenter: true }, // ❌ removed path
    { label: 'Stats', icon: BarChart3, path: '/stats' },
    { label: 'Done', icon: CheckCircle, path: '/?filter=Done' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center py-2 px-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">

      {navItems.map((item, idx) => {

        // 🔥 CENTER ADD BUTTON (FIXED)
        if (item.isCenter) {
          return (
            <button
              key={idx}
              onClick={onAddLead} // ✅ FIXED HERE
              className="flex flex-col items-center -mt-6 active:scale-95 transition-all"
            >
              <div className="bg-emerald-500 text-white p-3 rounded-full shadow-lg">
                <Plus size={22} />
              </div>
              <span className="text-[11px] mt-1 text-gray-600 font-medium">
                Add
              </span>
            </button>
          );
        }

        // 🔥 NORMAL NAV LINKS
        return (
          <NavLink
            key={idx}
            to={item.path!}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 text-[11px] font-medium transition-all",
                isActive
                  ? "text-emerald-600 scale-105"
                  : "text-gray-500"
              )
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
}