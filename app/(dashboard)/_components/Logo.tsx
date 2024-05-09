import Image from "next/image";

const Logo = () => {
    return ( 
        <Image
            width={175}
            height={27}
            alt="logo"
            src="/logo_loc.svg"
            priority={true}
        />
     );
}
 
export default Logo;