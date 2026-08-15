export function SiteSearch() {
  return (
    <form className="site-search" action="/search" role="search">
      <label className="sr-only" htmlFor="site-search-query">
        Search OAKit documentation
      </label>
      <input
        id="site-search-query"
        name="q"
        type="search"
        placeholder="Search docs"
        autoComplete="off"
      />
      <button type="submit" aria-label="Search">
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="5.25" />
          <path d="m12.5 12.5 4 4" />
        </svg>
      </button>
    </form>
  );
}
