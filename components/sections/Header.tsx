import Image from "next/image";
import Link from "next/link";

function Header() {
  return (
    <header className="flex items-center justify-between h-14 px-4 sm:px-14">
      <Link className="text-sm font-medium" href="/">
        KISEON.dev
      </Link>
      <ul className="flex gap-4">
        <li>
          <Link
            href="https://github.com/kiseon77"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/github.svg"
              width={20}
              height={20}
              alt="Picture of the author"
            />
          </Link>
        </li>
        <li>
          <Link
            href="https://www.linkedin.com/in/%EA%B8%B0%EC%84%A0-%ED%95%9C-84b48b32a/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/linkdin.svg"
              width={20}
              height={20}
              alt="Picture of the author"
            />
          </Link>
        </li>
        <li>
          <Link
            href="mailto:kiseon.han77@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/email.svg"
              width={20}
              height={20}
              alt="Picture of the author"
            />
          </Link>
        </li>
      </ul>
    </header>
  );
}

export default Header;
