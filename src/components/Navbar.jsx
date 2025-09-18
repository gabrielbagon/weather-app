import Image from "next/image";
import DropdownMenu from "./DropdownMenu";

export default function Navbar() {
    return (
        <nav className="w-full pt-5 flex items-center justify-between pl-12 pr-12">
            <Image src="/logo.svg" alt="Logo" width={196} height={40} />
            <div className="relative">
                <DropdownMenu />
            </div>
        </nav>
    );
}