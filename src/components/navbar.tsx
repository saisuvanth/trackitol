import { FC, useEffect, useState } from "react";
import { Switch } from "./ui/switch";
import { useTheme } from "next-themes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";
import { MdMenu } from 'react-icons/md';
import { useRouter } from "next/router";


const Navbar: FC = () => {
    const { systemTheme, setTheme, theme } = useTheme();
    const { data: session } = useSession();
    const router = useRouter();


    const [currentTheme, setCurrentTheme] = useState('dark');
    const [activeMenu, setActiveMenu] = useState<boolean>(false);

    const menus = [
        { name: 'Dashboard', path: '/' },
        { name: 'Groups', path: '/groups' },
        { name: 'Expenses', path: '/expenses' }
    ]

    const routePath = router.pathname;

    useEffect(() => {
        if (theme && systemTheme) {
            setCurrentTheme(theme === 'system' ? systemTheme : theme)
        }
    }, [theme, systemTheme]);

    const handleThemeChange = () => {
        if (currentTheme === 'dark') {
            setTheme('light');
            setCurrentTheme('light');
        } else {
            setTheme('dark');
            setCurrentTheme('dark');
        }
    }

    return (
        <nav className="w-full border-b sticky top-0 left-0">
            <div className="items-center px-4 gap-4 md:flex md:px-8">
                <div className="flex items-center justify-between py-3 md:py-5 md:block">
                    <Link href="/">
                        <h1 className="text-2xl font-bold">Trackitol</h1>
                    </Link>
                    <div className="md:hidden">
                        <button
                            className="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
                            onClick={() => setActiveMenu(!activeMenu)}
                        >
                            <MdMenu className='text-2xl' />
                        </button>
                    </div>
                </div>
                <div
                    className={`flex-1 pb-3 mt-8 md:block md:pb-0 md:mt-0 ${activeMenu ? "block" : "hidden"}`}
                >
                    <div className="justify-center items-center md:flex">
                        <div className="flex-1 flex flex-col md:flex-row pl-2 justify-center mb-4 md:mb-0 gap-4 md:gap-8">
                            {menus.map((item, idx) => (
                                <div key={idx} className={`${router.pathname === item.path ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground`}>
                                    <Link href={item.path}>{item.name}</Link>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-between flex-row-reverse md:flex-row gap-6">
                            <Switch className="" checked={currentTheme === 'dark'} onCheckedChange={handleThemeChange} />
                            {session ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Avatar>
                                            {/* @ts-ignore */}
                                            <AvatarImage src={session.user?.image} />
                                            <AvatarFallback>
                                                {session.user?.name?.[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>) : (
                                <div>
                                    <Button variant={'default'} className="h-fit py-2"
                                        onClick={() => signIn()}
                                    >
                                        Login
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>


    )
}

export default Navbar;