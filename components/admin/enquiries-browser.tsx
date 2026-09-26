"use client";

import { ResultsPager } from "components/admin/results-pager";
import type { ResultsNoun } from "lib/admin/pagination";
import {
  describeAnswers,
  describeMeta,
  ENQUIRY_REASON_FILTER_OPTIONS,
  summariseEnquiry,
  type AnswerFact,
} from "lib/contact/enquiry-display";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

const ENQUIRY_NOUN: ResultsNoun = { one: "enquiry", many: "enquiries" };

/**
 * Fixed locale and timezone rather than the viewer's: the server and the browser
 * have to produce the same string or React reports a hydration mismatch, and the
 * people reading this list work from Bengaluru.
 */
const RECEIVED_FORMAT = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  dateStyle: "medium",
  timeStyle: "short",
});

function formatReceived(iso: string): string {
  const date = new Date(iso);

  return Number.isNaN(date.getTime()) ? iso : RECEIVED_FORMAT.format(date);
}

export type EnquiryListItem = {
  /** The row's primary key. Used for React keys and open state, because
   * `enquiryId` is a display reference and is deliberately not unique. */
  id: string;
  enquiryId: string;
  reason: string;
  reasonLabel: string;
  routedTo: string;
  /** ISO 8601, UTC. */
  receivedAt: string;
  answers: unknown;
  meta: unknown;
};

export function EnquiriesBrowser({
  enquiries,
  reason,
  total,
  currentPage,
  totalPages,
  rangeStart,
  rangeEnd,
}: {
  enquiries: EnquiryListItem[];
  reason: string;
  total: number;
  currentPage: number;
  totalPages: number;
  rangeStart: number;
  rangeEnd: number;
}) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);

  /**
   * Paging and filtering live in the URL, so the view is linkable and the back
   * button works. Changing the filter always returns to page one — the result
   * set shrinks out from under the current page number otherwise.
   */
  function navigate(nextReason: string, nextPage: number) {
    const params = new URLSearchParams();

    if (nextReason) {
      params.set("reason", nextReason);
    }

    if (nextPage > 1) {
      params.set("page", String(nextPage));
    }

    const query = params.toString();

    router.push(query ? `/admin/enquiries?${query}` : "/admin/enquiries");
  }

  return (
    <div className="space-y-4">
      <label className="flex w-fit flex-col gap-1">
        <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
          Reason
        </span>
        <select
          value={reason}
          onChange={(event) => navigate(event.target.value, 1)}
          className="cursor-pointer rounded-sm border border-neutral-300 bg-white px-2.5 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-950"
        >
          {ENQUIRY_REASON_FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {enquiries.length === 0 ? (
        <p className="rounded-sm border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/40 dark:text-neutral-300">
          {reason
            ? "No enquiries have come in for this reason yet."
            : "No enquiries yet. Anything sent through the contact form will appear here."}
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-xs tracking-wider text-neutral-500 uppercase dark:border-neutral-800 dark:text-neutral-400">
                  <th className="py-2 pr-3 font-semibold">Reference</th>
                  <th className="py-2 pr-3 font-semibold">Received</th>
                  <th className="py-2 pr-3 font-semibold">Reason</th>
                  <th className="py-2 pr-3 font-semibold">Contact</th>
                  <th className="py-2 font-semibold">
                    <span className="sr-only">Detail</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enquiry) => {
                  const contact = summariseEnquiry(enquiry.answers);
                  const isOpen = openId === enquiry.id;
                  const detailId = `enquiry-detail-${enquiry.id}`;

                  return (
                    <Fragment key={enquiry.id}>
                      <tr className="border-b border-neutral-100 align-top dark:border-neutral-900">
                        <td className="py-3 pr-3 font-mono text-xs">
                          {enquiry.enquiryId}
                        </td>
                        <td
                          className="py-3 pr-3 whitespace-nowrap"
                          title={enquiry.receivedAt}
                        >
                          {formatReceived(enquiry.receivedAt)}
                        </td>
                        <td className="py-3 pr-3">
                          <span className="block">{enquiry.reasonLabel}</span>
                          <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                            {enquiry.routedTo}
                          </span>
                        </td>
                        <td className="py-3 pr-3">
                          <span className="block font-medium">
                            {contact.name || "—"}
                          </span>
                          <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                            {contact.email || "—"}
                          </span>
                          <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                            {contact.phone || "—"}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenId(isOpen ? null : enquiry.id)
                            }
                            aria-expanded={isOpen}
                            aria-controls={detailId}
                            className="cursor-pointer rounded-sm border border-neutral-300 px-2.5 py-1 text-xs font-semibold transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
                          >
                            {isOpen ? "Hide" : "View"}
                          </button>
                        </td>
                      </tr>

                      {isOpen ? (
                        <tr
                          id={detailId}
                          className="border-b border-neutral-100 dark:border-neutral-900"
                        >
                          <td
                            colSpan={5}
                            className="bg-neutral-50 px-3 py-4 dark:bg-neutral-900/40"
                          >
                            <div className="grid gap-6 md:grid-cols-2">
                              <AnswerList
                                title="Enquiry"
                                facts={describeAnswers(
                                  enquiry.reason,
                                  enquiry.answers,
                                )}
                              />
                              <AnswerList
                                title="Provenance"
                                facts={describeMeta(enquiry.meta)}
                              />
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ResultsPager
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            total={total}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => navigate(reason, page)}
            noun={ENQUIRY_NOUN}
          />
        </>
      )}
    </div>
  );
}

function AnswerList({ title, facts }: { title: string; facts: AnswerFact[] }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
        {title}
      </h3>

      {facts.length === 0 ? (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Nothing recorded.
        </p>
      ) : (
        <dl className="space-y-2">
          {facts.map((fact) => (
            <div key={fact.key}>
              <dt className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {fact.label}
              </dt>
              <dd className="text-sm break-words whitespace-pre-wrap">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
