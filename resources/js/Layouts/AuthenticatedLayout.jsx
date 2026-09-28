import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { BookOpen, Award, LayoutDashboard, Compass, User as UserIcon, LogOut, CheckCircle, AlertCircle } from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const role = user?.roles?.[0] || 'student';

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const getRoleBadge = (r) => {
        switch (r) {
            case 'admin':
                return <span className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 text-xs px-2.5 py-0.5 rounded-full font-semibold">Administrator</span>;
            case 'instructor':
                return <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-xs px-2.5 py-0.5 rounded-full font-semibold">Pengajar</span>;
            default:
                return <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs px-2.5 py-0.5 rounded-full font-semibold">Peserta</span>;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
            {/* Top Navigation */}
            <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex items-center gap-2.5 group">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <div>
                                    <span className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                                        EduLMS
                                    </span>
                                    <span className="hidden sm:inline-block ms-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded">
                                        E-Learning
                                    </span>
                                </div>
                            </Link>

                            <div className="hidden space-x-2 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium"
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </NavLink>

                                <NavLink
                                    href={route('courses.index')}
                                    active={route().current('courses.*') && !route().current('courses.learn')}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium"
                                >
                                    <Compass className="h-4 w-4" />
                                    Jelajah Kursus
                                </NavLink>

                                {role === 'student' && (
                                    <NavLink
                                        href={route('certificates.index')}
                                        active={route().current('certificates.*')}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium"
                                    >
                                        <Award className="h-4 w-4" />
                                        Sertifikat Saya
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        {/* User menu & Role badge */}
                        <div className="hidden sm:flex sm:items-center sm:gap-4">
                            {getRoleBadge(role)}

                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                        >
                                            <div className="h-7 w-7 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs">
                                                {user.name.charAt(0)}
                                            </div>
                                            <span>{user.name}</span>
                                            <svg className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content width="48">
                                        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                                            Masuk sebagai <strong className="text-slate-700 dark:text-slate-200">{user.email}</strong>
                                        </div>
                                        <Dropdown.Link href={route('profile.edit')} className="flex items-center gap-2">
                                            <UserIcon className="h-4 w-4 text-slate-400" />
                                            Profil Saya
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button" className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                            <LogOut className="h-4 w-4" />
                                            Keluar (Log Out)
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                {showingNavigationDropdown && (
                    <div className="sm:hidden border-t border-slate-200 dark:border-slate-800 px-4 pt-3 pb-4 space-y-2 bg-white dark:bg-slate-900">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('courses.index')} active={route().current('courses.*')}>
                            Jelajah Kursus
                        </ResponsiveNavLink>
                        {role === 'student' && (
                            <ResponsiveNavLink href={route('certificates.index')} active={route().current('certificates.*')}>
                                Sertifikat Saya
                            </ResponsiveNavLink>
                        )}
                        <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                            <div className="text-sm font-medium">{user.name}</div>
                            <div className="text-xs text-slate-500">{user.email}</div>
                            <div className="mt-2 space-y-1">
                                <ResponsiveNavLink href={route('profile.edit')}>Profil</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('logout')} method="post" as="button">Keluar</ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Flash Alerts */}
            {flash?.success && (
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-xl text-sm font-medium shadow-sm animate-fade-in">
                        <CheckCircle className="h-5 w-5 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                </div>
            )}
            {flash?.error && (
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 p-4 rounded-xl text-sm font-medium shadow-sm animate-fade-in">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                </div>
            )}

            {/* Optional Header Banner */}
            {header && (
                <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className="py-8">
                {children}
            </main>
        </div>
    );
}
