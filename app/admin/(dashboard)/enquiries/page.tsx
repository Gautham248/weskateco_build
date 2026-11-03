import {
  EnquiriesBrowser,
  type EnquiryListItem,
} from "components/admin/enquiries-browser";
import { ADMIN_RESULTS_PAGE_SIZE, pageWindow } from "lib/admin/pagination";
import { countContactEnquiries, listContactEnquiries } from "lib/admin/queries";
import { isKnownReason } from "lib/contact/enquiry-display";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Enquiries | WeSkate Admin",
  robots: { index: false, follow: false },
};

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

/** `?page=` is user-controlled, so anything unparseable means page one. */
function parsePage(value: string): number {
  const parsed = Number.parseInt(value, 10);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export default async function AdminEnquiriesPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const requestedPage = parsePage(first(searchParams.page));
  const rawReason = first(searchParams.reason);
  // Validated rather than cast: ?reason= arrives from the URL, so an unknown or
  // inherited key ("constructor") must fall back to "no filter", not filter on it.
  const reason = isKnownReason(rawReason) ? rawReason : "";

  let enquiries: EnquiryListItem[] = [];
  let total = 0;
  let pagination = pageWindow(0, 1);
  let loadError = false;

  try {
    total = await countContactEnquiries(reason || undefined);

    // Clamp before querying, so a stale ?page=99 of a three-page table reads the
    // last page rather than returning empty alongside a valid-looking total.
    pagination = pageWindow(total, requestedPage);

    const rows = await listContactEnquiries({
      limit: ADMIN_RESULTS_PAGE_SIZE,
      offset: pagination.offset,
      reason: reason || undefined,
    });

    enquiries = rows.map((row) => ({
      id: row.id,
      enquiryId: row.enquiryId,
      reason: row.reason,
      reasonLabel: row.reasonLabel,
      routedTo: row.routedTo,
      receivedAt: row.createdAt.toISOString(),
      answers: row.answers,
      meta: row.meta,
    }));
  } catch (error) {
    // The error alone: a row here holds a name, an email and a phone number, and
    // the logging rule is IDs, never PII.
    console.error("Could not read contact enquiries:", error);
    loadError = true;
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-clash text-xl font-bold tracking-widest uppercase">
          Enquiries
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Everything submitted through the contact form, newest first. Read-only
          — replies are still sent outside this panel.
        </p>
      </header>

      {loadError ? (
        <p
          role="alert"
          className="rounded-sm border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          Could not read the contact enquiries. This is a loading failure, not
          an empty list — nothing has been lost.
        </p>
      ) : (
        <EnquiriesBrowser
          enquiries={enquiries}
          reason={reason}
          total={total}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          rangeStart={pagination.rangeStart}
          rangeEnd={pagination.rangeEnd}
        />
      )}
    </div>
  );
}
