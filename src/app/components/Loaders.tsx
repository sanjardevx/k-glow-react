import { t } from "../../lib/i18n";
import "../../css/loaders.css";

/** A small ring in the current text colour — sized to sit inside a button. */
export function Spinner() {
  return <span className="kg-spinner" aria-hidden="true" />;
}

/**
 * A button's label while its action runs: the spinner plus what is happening,
 * so a slow upload on mobile reads as "working", not "frozen".
 */
export function BusyLabel({ children }: { children: string }) {
  return (
    <span className="kg-busy" role="status">
      <Spinner />
      {children}
    </span>
  );
}

/** Shown while a page's code downloads the first time it is opened. */
export function PageLoader() {
  return (
    <div className="kg-page-loader" role="status">
      <Spinner />
      <span className="kg-visually-hidden">{t("load.generic")}</span>
    </div>
  );
}

/** A centred spinner and message, for panels that wait on one request. */
export function LoadingNote({ children }: { children: string }) {
  return (
    <div className="kg-loading-note" role="status">
      <Spinner />
      {children}
    </div>
  );
}

/**
 * Stand-ins built from the product card's own frame and photo box, placed
 * inside the page's real grid — so it is exactly the size it will be and
 * nothing shifts when products land. The screen-reader label goes last: the
 * home grids hide cards past the sixth on phones by counting children.
 */
export function ProductCardSkeletons({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div className="p-card kg-skeleton-card" key={i} aria-hidden="true">
          <div className="p-photo">
            <div className="kg-skel kg-skel-fill" />
          </div>
          <div className="p-body">
            <div className="kg-skel kg-skel-line kg-skel-w45" />
            <div className="kg-skel kg-skel-line is-tight kg-skel-w85" />
            <div className="kg-skel kg-skel-line kg-skel-w60" />
            <div className="kg-skel kg-skel-line kg-skel-w30" />
            <div className="kg-skel kg-skel-pill" />
          </div>
        </div>
      ))}
      <span className="kg-visually-hidden" role="status">
        {t("load.products")}
      </span>
    </>
  );
}

export function ReviewGridSkeleton({ count }: { count: number }) {
  return (
    <div className="review-grid">
      {Array.from({ length: count }, (_, i) => (
        <div className="review-card kg-skeleton-review" key={i} aria-hidden="true">
          <div className="kg-skel kg-skel-line kg-skel-w30" />
          <div className="kg-skel kg-skel-line kg-skel-w85" />
          <div className="kg-skel kg-skel-line kg-skel-w85" />
          <div className="kg-skel kg-skel-line kg-skel-w60" />
          <div className="kg-skel kg-skel-line kg-skel-w45" />
        </div>
      ))}
      <span className="kg-visually-hidden" role="status">
        {t("load.reviews")}
      </span>
    </div>
  );
}

/** The product page's two columns: photo on the left, details on the right. */
export function ProductDetailSkeleton() {
  return (
    <div className="chosen-product-page" role="status">
      <span className="kg-visually-hidden">{t("load.product")}</span>
      <div className="pdp" aria-hidden="true">
        <div className="pdp-gallery">
          <div className="pdp-photo">
            <div className="kg-skel kg-skel-fill" />
          </div>
        </div>
        <div className="pdp-info">
          <div className="kg-skel kg-skel-line kg-skel-w30" />
          <div className="kg-skel kg-skel-line is-title kg-skel-w85" />
          <div className="kg-skel kg-skel-line kg-skel-w45" />
          <div className="kg-skel kg-skel-line is-title kg-skel-w30" />
          <div className="kg-skel kg-skel-line kg-skel-w85" />
          <div className="kg-skel kg-skel-line kg-skel-w85" />
          <div className="kg-skel kg-skel-line kg-skel-w60" />
        </div>
      </div>
    </div>
  );
}

/** Rows for lists of orders. */
export function ListSkeleton({ rows }: { rows: number }) {
  return (
    <div role="status">
      <span className="kg-visually-hidden">{t("load.generic")}</span>
      {Array.from({ length: rows }, (_, i) => (
        <div className="kg-skel kg-skel-row" key={i} aria-hidden="true" />
      ))}
    </div>
  );
}
