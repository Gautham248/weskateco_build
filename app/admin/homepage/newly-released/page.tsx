import { requireAuth } from "lib/admin/actions/auth";
import { getHomeNewlyReleased } from "lib/sanity/queries";
import { NewlyReleasedForm } from "./newly-released-form";

export default async function NewlyReleasedPage() {
  await requireAuth();
  const slides = await getHomeNewlyReleased();

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">Newly Released Carousel</span>
        <div className="admin-topbar-right">
          <span className="admin-badge admin-badge-success">Sanity Connected</span>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-page-header">
          <h1>Newly Released Carousel</h1>
          <p>Configure product slides, titles, subtitles, prices, and board/wheel ImageKit uploads.</p>
        </div>

        <NewlyReleasedForm initialSlides={slides} />
      </div>
    </>
  );
}
