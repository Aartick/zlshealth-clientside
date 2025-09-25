"use client";

import { isHiddenPath } from "@/utils/hiddenPaths";
import Link from "next/link";
import { usePathname } from "next/navigation";

function formatLabel(segment: string) {
  if (/^[0-9a-fA-F]{10,}$/.test(segment)) return null; // skip IDs

  let label = segment.replace(/-/g, " "); // kebab-case → spaces
  label = label.replace(/([a-z])([A-Z])/g, "$1 $2"); // camelCase → spaces
  label = label.replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize

  return label;
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  let pathArray = pathname.split("/").filter((p) => p);

  // Generic rule: insert plural parent if route ends with *Description
  if (pathArray.some((seg) => seg.toLowerCase().endsWith("description"))) {
    const base = pathArray[0]; // e.g. "productDescription" → "product"
    const parent = base.replace(/Description$/i, "s"); // → "products"
    pathArray = [parent, base];
  }

  return (
    <>
      {pathname === "/" ? null : (
        <nav
          className={`${
            isHiddenPath(pathname) ? "-mt-11" : ""
          } text-sm text-gray-600`}
        >
          <ol className="flex space-x-2">
            {/* Home */}
            <li>
              <Link
                href="/"
                className="hover:underline text-[#848484] hover:text-[#71BF45]"
              >
                Home
              </Link>
            </li>

            {/* Segments */}
            {pathArray.map((segment, index) => {
              const label = formatLabel(segment);
              if (!label) return null; // skip IDs

              const href = "/" + pathArray.slice(0, index + 1).join("/");
              const isLast = index === pathArray.length - 1;

              return (
                <li key={href} className="flex items-center space-x-2">
                  <span>/</span>
                  {isLast ? (
                    <span className="font-semibold text-black">{label}</span>
                  ) : (
                    <Link
                      href={href}
                      className="hover:underline text-[#848484] hover:text-[#71BF45]"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}
    </>
  );
}
