import React from "react";

function Footer() {
  return (
    <footer className="py-6 px-4 sm:px-14 ">
      <div className="container mx-auto text-sm text-muted-foreground">
        <p className="mb-2 text-left font-normal text-sm/5 sm:text-base/5 ">
          <span className="font-medium">기획과 디자인의 언어</span>를 이해하고,
          <span className="font-medium">개발 언어</span>로 옮깁니다. <br />
          끊임 없는 <span className="font-medium">도전</span>을 통해 꾸준히{" "}
          <span className="font-medium">성장</span>해나아가고 있습니다.
          <br />{" "}
          <span className="font-medium">Let&rsquo;s go work together!</span>
        </p>
        © {new Date().getFullYear()} KISEON.dev. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
