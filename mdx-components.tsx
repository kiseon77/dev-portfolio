import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import {
  Cases,
  Chips,
  Compare,
  Figure,
  Flow,
  Highlights,
  Overview,
  RouletteSketch,
  SideBySide,
} from "@/components/mdx/blocks";

const components: MDXComponents = {
  Overview,
  Highlights,
  Flow,
  Cases,
  Compare,
  Figure,
  Chips,
  RouletteSketch,
  SideBySide,
  h1: ({ children }) => (
    <h1 className="mb-4 text-2xl font-semibold">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 first:mt-0 before:h-4 before:w-1 before:rounded-full before:bg-gray-900 before:content-['']">
      {children}
    </h2>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-7 text-gray-800">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-black">{children}</strong>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 list-disc space-y-3 pl-5 leading-7 text-gray-800 marker:text-gray-500 [&_ul]:mt-2 [&_ul]:list-[circle] [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul]:text-[0.925em] [&_ul]:text-gray-700">
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
