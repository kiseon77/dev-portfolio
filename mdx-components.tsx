import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";

const components: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="mb-4 text-2xl font-semibold">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 mb-4 text-lg font-semibold text-gray-800 first:mt-0">
      {children}
    </h2>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-7 text-gray-700">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-black">{children}</strong>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 list-disc space-y-3 pl-5 leading-7 text-gray-700 marker:text-gray-400 [&_ul]:mt-2 [&_ul]:list-[circle] [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul]:text-[0.925em] [&_ul]:text-gray-600">
      {children}
    </ul>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2 hover:text-black"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mb-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100 [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),
  img: (props) => (
    <span className="relative mb-4 block aspect-video w-full overflow-hidden rounded-lg">
      <Image
        fill
        sizes="100vw"
        className="object-contain"
        {...(props as ImageProps)}
      />
    </span>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
