import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems
} from "@headlessui/react";
import { BellIcon } from "@heroicons/react/16/solid";
import { NavLink } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";
import { motion } from "framer-motion";

const navigation = [
  { name: "Home", to: "/", current: false },
  { name: "Jadwal Latihan", to: "/jadwal-latihan", current: false },
  { name: "Members", to: "/members", current: false },
  { name: "Member Management", to: "/member-management", current: false },
  { name: "Admin", to: "/admins", current: false },
  { name: "Absensi", to: "/absensi", current: false }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const { logout } = useAuth();
  return (
    <Disclosure as="nav" className="bg-black">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <motion.div 
                  className="flex shrink-0 items-center"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  
                  <span className="ml-2 text-2xl font-bold text-emerald-500">Sonore Vocal Ensemble</span>
                </motion.div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <motion.div
                        key={item.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <NavLink
                          to={item.to}
                          className={({ isActive }) => {
                            return classNames(
                              isActive
                                ? "bg-emerald-600 text-white"
                                : "text-gray-300 hover:bg-emerald-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
                            );
                          }}
                        >
                          {item.name}
                        </NavLink>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative rounded-full bg-black p-1 text-emerald-400 hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </motion.button>

                <Menu as="div" className="relative ml-3">
                  <div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MenuButton className="relative flex rounded-full bg-black text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                        />
                      </MenuButton>
                    </motion.div>
                  </div>
                  <MenuItems
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-black py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <MenuItem>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? 'bg-emerald-600 text-white' : 'text-gray-300',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Your Profile
                        </a>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? 'bg-emerald-600 text-white' : 'text-gray-300',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Settings
                        </a>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <a
                          onClick={() => logout()}
                          className={classNames(
                            active ? 'bg-emerald-600 text-white' : 'text-gray-300',
                            'block px-4 py-2 text-sm cursor-pointer'
                          )}
                        >
                          Sign out
                        </a>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
