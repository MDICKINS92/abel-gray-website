# Temporarily unpublished project

Lindoe Meadows / Great Addington is deliberately unpublished at the owner's
request because the site has not yet been purchased. Do not publish it again
without an explicit request.

The original `lindoe-meadows.html` is unchanged. Production's leading temporary
redirect prevents its clean URL, HTML URL and path variants from serving it.
References were removed from public HTML, shared project data and the sitemap,
not hidden with CSS or left in HTML comments.

`restore.patch` preserves the exact removed content and original placement.
It is a reverse patch of this isolated unpublishing change. To restore later:

1. Use the patch to restore the project cards, blog and Thrapston wording,
   shared project facts and sitemap entry. Check its context against any
   subsequent page changes rather than replacing whole pages.
2. Remove the leading `/lindoe-meadows*` temporary redirect only when the
   restored content is ready. Keep the existing `.html` to clean URL 301.
3. Use a fresh `project-data.js` cache version on every page that loads it;
   do not reuse a prior immutable-cache version.
4. Verify the page, all references and other projects, then release through
   GitHub main / Netlify and verify the live clean URL and HTML redirect.

The patch also contains historical cache-version changes and the archive
protection rule. Do not blindly revert current cache versions or remove the
`/.agents/*` protection. That rule prevents this archive from being served by
Netlify. Source files and their Git history remain preserved.
