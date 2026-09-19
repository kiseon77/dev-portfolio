import React from "react";
import Link from "next/link";

const CONTACT_LINKS = [
  {
    label: "Email",
    value: "kiseon.han77@gmail.com",
    href: "mailto:kiseon.han77@gmail.com",
  },
  {
    label: "Github",
    value: "github.com/kiseon77",
    href: "https://github.com/kiseon77",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/kiseon-han-84b48b32a",
    href: "https://www.linkedin.com/in/%EA%B8%B0%EC%84%A0-%ED%95%9C-84b48b32a/",
  },
  {
    label: "Blog",
    value: "creator41360.tistory.com",
    href: "https://creator41360.tistory.com",
  },
];

function Footer() {
  return (
    <footer className="py-6 px-4 sm:px-14 ">
      <div className="container mx-auto flex flex-col gap-6 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <div>
          <p className="mb-2 text-left font-normal text-sm/5 sm:text-base/5 ">
            <span className="font-medium">기획과 디자인의 언어</span>를
            이해하고,
            <span className="font-medium">개발 언어</span>로 옮깁니다. <br />
            끊임 없는 <span className="font-medium">도전</span>을 통해 꾸준히{" "}
            <span className="font-medium">성장</span>해나아가고 있습니다.
            <br />{" "}
            <span className="font-medium">Let&rsquo;s go work together!</span>
          </p>
          © {new Date().getFullYear()} KISEON.dev. All rights reserved.
        </div>
        <ul className="flex flex-col gap-1">
          {CONTACT_LINKS.map((link) => (
            <li key={link.label} className="flex gap-2">
              <span className="w-16 shrink-0 font-medium">{link.label}</span>
              <Link
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {link.value}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
