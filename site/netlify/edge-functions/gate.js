// Password gate for the whole site while it is not public yet.
//
// Active only when the SITE_PASSWORD environment variable is set in Netlify
// (Project configuration → Environment variables). Remove the variable and
// redeploy to open the site. Optional SITE_USER (default "estanza").
export default async (request, context) => {
  const password = Netlify.env.get("SITE_PASSWORD");
  if (!password) return context.next();

  const user = Netlify.env.get("SITE_USER") || "estanza";
  const header = request.headers.get("authorization") || "";
  if (header.startsWith("Basic ")) {
    try {
      const decoded = new TextDecoder().decode(Uint8Array.from(atob(header.slice(6)), (c) => c.charCodeAt(0)));
      const i = decoded.indexOf(":");
      if (i > 0 && decoded.slice(0, i) === user && decoded.slice(i + 1) === password) return context.next();
    } catch {
      /* malformed header: fall through to the challenge */
    }
  }

  return new Response("Sitio en preparación / Site in preparation", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Estanza", charset="UTF-8"',
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "Content-Type": "text/plain; charset=UTF-8",
    },
  });
};

export const config = { path: "/*" };
