const WWW_REDDIT_GALLERY_URL = 'https://www.reddit.com/gallery';
const REDDIT_GALLERY_URL = 'https://reddit.com/gallery';

/**
 *
 * @param {string} url
 * @returns {{
 * author: string,
 * title: string,
 * permalink: string,
 * images: string[],
 * }}
 */
async function getImageDataFromRedditUrl(url) {
  url = url.replace(/\/$/, '') + '.json';
  const redditRes = await fetch(url);
  const json = await redditRes.json();
  const originalPosterData =
    json
      .filter(entry => entry?.kind?.toLowerCase() === 'listing')
      .flatMap(entry => entry?.data?.children ?? [])
      .find(post => post?.kind?.toLowerCase() === 't3')?.data ?? null;

  const title = originalPosterData?.title ?? null;
  const permalink = originalPosterData?.permalink ?? null;
  const author = originalPosterData?.author ?? null;
  let images = [];
  if (/https:\/\/i.redd.it\/.*(jpe?g)|(png)/.test(originalPosterData.url)) {
    // it's a normal reddit image
    images = [originalPosterData.url];
  } else if (
    /https:\/\/i.imgur.com\/.*(jpe?g)|(png)/.test(originalPosterData.url)
  ) {
    // it's an imgur link to an individual image
    images = [originalPosterData.url];
  } else if (
    originalPosterData.url?.toLowerCase()?.startsWith(WWW_REDDIT_GALLERY_URL) ||
    originalPosterData.url?.toLowerCase()?.startsWith(REDDIT_GALLERY_URL)
  ) {
    // it's a reddit gallery link
    images =
      originalPosterData.gallery_data?.items
        .map(item => {
          const { media_id, id } = item;
          const metadata = originalPosterData.media_metadata?.[media_id];
          const fmt = metadata?.m?.toLowerCase()?.trim() ?? '';
          if (['image/jpg', 'image/jpeg'].includes(fmt)) {
            return `https://i.redd.it/${media_id}.jpg`;
          }
          if (['image/png'].includes(fmt)) {
            return `https://i.redd.it/${media_id}.png`;
          }
          return null;
        })
        .filter(x => !!x) ?? [];
  }
  /**
   * cannot handle imgur albums yet such as
   * https://imgur.com/a/iItVZDf
   * But there might be a way to do it by appending /zip to the end.
   */
  return { author, title, permalink, images };
}

export default getImageDataFromRedditUrl;
