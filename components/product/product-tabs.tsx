"use client";

import { useState } from "react";
import Prose from "components/prose";
import { useTranslation } from "lib/i18n/TranslationProvider";

interface ProductTabsProps {
  descriptionHtml?: string;
  description?: string;
  metafields: {
    key: string;
    value: string;
    namespace: string;
    type: string;
  }[];
}

export default function ProductTabs({
  descriptionHtml,
  description,
  metafields,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "specifications">("description");
  const { t } = useTranslation();

  // Filter valid metafields (specifically from configurator namespace with actual values)
  const specs = metafields.filter(
    (m) => m && m.namespace === "configurator" && m.value && m.value !== "null"
  );

  const formatKey = (key: string) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="mt-12 w-full border-t border-neutral-200 pt-10 dark:border-neutral-800">
      {/* Tab Headers */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setActiveTab("description")}
          className={`border-b-2 px-6 pb-4 text-sm font-semibold tracking-wide transition-all duration-200 ${
            activeTab === "description"
              ? "border-black text-black dark:border-white dark:text-white"
              : "border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          }`}
        >
          {t("product.description")}
        </button>
        <button
          onClick={() => setActiveTab("specifications")}
          className={`border-b-2 px-6 pb-4 text-sm font-semibold tracking-wide transition-all duration-200 ${
            activeTab === "specifications"
              ? "border-black text-black dark:border-white dark:text-white"
              : "border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          }`}
        >
          {t("product.specifications")}
        </button>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === "description" && (
          <div className="animate-fadeIn">
            {descriptionHtml ? (
              <Prose
                className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300"
                html={descriptionHtml}
              />
            ) : (
              <p className="text-sm text-neutral-600 dark:text-neutral-300">{description}</p>
            )}
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="animate-fadeIn max-w-2xl">
            {specs.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
                <table className="w-full text-left text-sm">
                  <tbody>
                    {specs.map((spec) => (
                      <tr
                        key={spec.key}
                        className="border-b last:border-b-0 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20"
                      >
                        <td className="py-3 px-4 font-semibold text-neutral-500 dark:text-neutral-400">
                          {formatKey(spec.key)}
                        </td>
                        <td className="py-3 px-4 text-neutral-900 dark:text-neutral-100">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {t("product.specifications_coming_soon") || "Specifications coming soon."}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
