const GITHUB_REPOSITORY_API =
  "https://api.github.com/repos/evoelsewhere/oakit";
const LAST_KNOWN_STARS = 1;

interface GitHubRepository {
  stargazers_count?: unknown;
}

export async function GET() {
  let stars = LAST_KNOWN_STARS;
  let stale = true;

  try {
    const response = await fetch(GITHUB_REPOSITORY_API, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "oakit-website",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: 3_600 },
    });

    if (response.ok) {
      const repository = (await response.json()) as GitHubRepository;
      if (
        typeof repository.stargazers_count === "number" &&
        Number.isInteger(repository.stargazers_count) &&
        repository.stargazers_count >= 0
      ) {
        stars = repository.stargazers_count;
        stale = false;
      }
    }
  } catch {
    // The last known count keeps the badge useful during transient failures.
  }

  return Response.json(
    { stars, stale },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    },
  );
}
