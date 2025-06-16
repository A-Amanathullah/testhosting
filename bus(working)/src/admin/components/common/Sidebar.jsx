import React, { useState, useEffect } from "react";
import {
  BarChart2,
  Bus,
  Calendar,
  ClipboardList,
  FileText,
  Map,
  Award,
  Users,
  MessageSquare,
  User,
  Menu,
  Clock,
  UserPlus,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Lock,
  PieChart,
  FileBarChart,
  UserX,
  DollarSign,
  CreditCard as LoyaltyCardIcon,
  BarChart,
  UserCog,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const SIDEBAR_ITEMS = [
  {
    name: "Dashboard",
    icon: BarChart2,
    color: "#3B82F6",
    href: "/admin",
  },
  {
    name: "Bus Schedule",
    icon: Calendar,
    color: "#8B5CF6",
    href: "/admin/bus-schedule",
  },
  {
    name: "Bus Register",
    icon: Bus,
    color: "#EC4899",
    href: "/admin/bus-register",
  },
  {
    name: "Booking Management",
    icon: ClipboardList,
    color: "#10B981",
    hasChildren: true,
    children: [
      {
        name: "Bus Booking",
        icon: BookOpen,
        href: "/admin/booking/bus-booking",
      },
      {
        name: "Freezing Seat",
        icon: Lock,
        href: "/admin/booking/freezing-seat",
      },
    ],
  },
  {
    name: "Staff Management",
    icon: UserPlus,
    color: "#6366F1",
    hasChildren: true,
    children: [
      // {
      //   name: "New Staff Create",
      //   icon: UserPlus,
      //   href: "/admin/staff/create",
      // },
      {
        name: "Staff List",
        icon: Users,
        href: "/admin/staff/list",
      },
      {
        name: "Role Access Management",
        icon: UserCog,
        href: "/admin/staff/role-access",
      },
    ],
  },
  {
    name: "Report",
    icon: FileText,
    color: "#EF4444",
    hasChildren: true,
    children: [
      {
        name: "Bus Booking Report",
        icon: FileBarChart,
        href: "/admin/report/booking",
      },
      {
        name: "Cancellation Report",
        icon: UserX,
        href: "/admin/report/cancellation",
      },
      {
        name: "Agentwise Report",
        icon: PieChart,
        href: "/admin/report/agent",
      },
      {
        name: "Revenue Report",
        icon: DollarSign,
        href: "/admin/report/revenue",
      },
    ],
  },
  {
    name: "Bus Tracking",
    icon: Map,
    color: "#14B8A6",
    href: "/admin/tracking",
  },
  {
    name: "Loyalty Management",
    icon: Award,
    color: "#F97316",
    hasChildren: true,
    children: [
      {
        name: "Loyalty Card",
        icon: LoyaltyCardIcon,
        href: "/admin/loyalty/card",
      },
      {
        name: "Loyalty Report",
        icon: BarChart,
        href: "/admin/loyalty/report",
      },
    ],
  },
  {
    name: "User Management",
    icon: Users,
    color: "#8B5CF6",
    href: "/admin/users",
  },
  {
    name: "SMS Template",
    icon: MessageSquare,
    color: "#06B6D4",
    href: "/admin/sms-template",
  },
  {
    name: "Profile",
    icon: User,
    color: "#6EE7B7",
    href: "/admin/profile",
  },
];

const Sidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [expandedItems, setExpandedItems] = useState({});
  const location = useLocation();
  
  // Update the date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Find if any submenu item is active
    SIDEBAR_ITEMS.forEach(item => {
      if (item.hasChildren) {
        const activeChild = item.children.find(child => currentPath === child.href);
        if (activeChild) {
          setExpandedItems(prev => ({
            ...prev,
            [item.name]: true
          }));
        }
      }
    });
  }, [location.pathname]);
  
  // Check if a menu item is active
  const isActive = (href) => {
    return location.pathname === href;
  };

  // Check if a parent menu has any active child
  const hasActiveChild = (item) => {
    if (!item.hasChildren) return false;
    return item.children.some(child => location.pathname === child.href);
  };
  
  // Format date and time
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };
  
  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  };

  // Toggle submenu expanded state
  const toggleSubmenu = (itemName) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      } h-screen`}
      animate={{ width: isSidebarOpen ? "256" : "80" }}
    >
      <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-sm">
        
        {/* Divider */}
        <div className="px-4">
          <div className="h-px bg-gray-200"></div>
        </div>
        
        <div className="flex flex-col flex-grow overflow-hidden">
          <div className="p-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-700 transition-colors rounded-full hover:bg-gray-100 max-w-fit"
            >
              <Menu size={24} />
            </motion.button>
          </div>

          {/* Make nav element scrollable with flex-grow */}
          <nav className="flex-grow px-4 pb-2 overflow-y-auto">
            {SIDEBAR_ITEMS.map((item, index) => (
              <div key={item.name} className="mb-1">
                {/* Main menu item */}
                {item.hasChildren ? (
                  // Item with children - clickable but doesn't navigate
                  <div
                    onClick={() => toggleSubmenu(item.name)}
                    className={`flex items-center justify-between p-3 text-sm font-medium transition-colors rounded-lg cursor-pointer hover:bg-gray-100 
                      ${hasActiveChild(item) ? 'bg-red-50 text-red-800' : 'text-gray-700'}`}
                  >
                    <div className="flex items-center">
                      <item.icon
                        size={20}
                        style={{ color: hasActiveChild(item) ? '#991b1b' : item.color, minWidth: "20px" }}
                      />
                      <AnimatePresence>
                        {isSidebarOpen && (
                          <motion.span
                            className="ml-4 whitespace-nowrap"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2, delay: 0.3 }}
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {expandedItems[item.name] ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  // Regular link item
                  <Link to={item.href}>
                    <motion.div 
                      className={`flex items-center p-3 text-sm font-medium transition-colors rounded-lg hover:bg-gray-100 
                      ${isActive(item.href) ? 'bg-red-50 text-red-800' : 'text-gray-700'}`}
                    >
                      <item.icon
                        size={20}
                        style={{ color: isActive(item.href) ? '#991b1b' : item.color, minWidth: "20px" }}
                      />
                      <AnimatePresence>
                        {isSidebarOpen && (
                          <motion.span
                            className="ml-4 whitespace-nowrap"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2, delay: 0.3 }}
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                )}

                {/* Submenu items */}
                {item.hasChildren && expandedItems[item.name] && isSidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-6"
                  >
                    {item.children.map((child) => (
                      <Link key={child.href} to={child.href}>
                        <motion.div 
                          className={`flex items-center p-2 mt-1 text-xs font-medium transition-colors rounded-md hover:bg-gray-100 
                          ${isActive(child.href) ? 'bg-red-50 text-red-800 font-semibold' : 'text-gray-600'}`}
                        >
                          <child.icon 
                            size={14} 
                            className="min-w-[14px]"
                            style={{ color: isActive(child.href) ? '#991b1b' : 'currentColor' }}
                          />
                          <span className="ml-3">{child.name}</span>
                        </motion.div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </nav>
        </div>
        
        {/* Date and Time at bottom */}
        <div className="flex flex-col items-center px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-center mb-1 text-gray-500">
            <Clock size={16} className="mr-2" />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  className="text-xs font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {formatDate(currentDateTime)}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                className="text-xs font-medium text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {formatTime(currentDateTime)}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;