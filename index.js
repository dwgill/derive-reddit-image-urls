addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequest(event.request).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  );
});

/**
 * @param {Request} request 
 * @returns {Promise<Response>}
 */
async function handleRequest(request) {
  if (request.method?.toLowerCase() === 'get') {
    return new Response('hello world', {
      headers: {
        "content-type": "text/plain;charset=UTF-8"
      }
    })
  }
  const json = await request.json();
  let result = [];
  if (typeof json.url === 'string' && /https:.*reddit.*comments/i.test(json.url)) {
    result = await getImagesUrlsFromRedditUrl(json.url);
  }

  const responseBody = {
    status: 'success',
    result,
  };

  const jsonResult = JSON.stringify(responseBody, null, 2);

  return new Response(jsonResult, {
    headers: {
      "content-type": "application/json;charset=UTF-8"
    }
  });
}

const WWW_REDDIT_GALLERY_URL = 'https://www.reddit.com/gallery';
const REDDIT_GALLERY_URL = 'https://reddit.com/gallery';

async function getImagesUrlsFromRedditUrl(url) {
  url = url.replace(/\/^/, '') + '.json';
  const redditRes = await fetch(url);
  const json = await redditRes.json();
  const opData = json
    .filter(entry => entry?.kind?.toLowerCase() === 'listing')
    .flatMap(entry => entry?.data?.children ?? [])
    .find(post => post?.kind?.toLowerCase() === 't3')
    ?.data ?? null;

  const title = opData?.title ?? null;
  const permalink = opData?.permalink ?? null;
  const author = opData?.author ?? null;
  let images = [];
  if (/https:\/\/i.redd.it\/.*(jpe?g)|(png)/.test(opData.url)) {
    // it's a normal reddit image
    images = [opData.url];
  } else if (/https:\/\/i.imgur.com\/.*(jpe?g)|(png)/.test(opData.url)) {
    // it's an imgur link to an individual image
    images = [opData.url];
  } else if (opData.url?.toLowerCase()?.startsWith(WWW_REDDIT_GALLERY_URL)
    || opData.url?.toLowerCase()?.startsWith(REDDIT_GALLERY_URL)
  ) {
    // it's a reddit gallery link
    images = opData.gallery_data?.items
      .map(item => {
        const { media_id, id } = item;
        const metadata = opData.media_metadata?.[media_id];
        const fmt = metadata?.m?.toLowerCase()?.trim() ?? '';
        if (["image/jpg", "image/jpeg"].includes(fmt)) {
          return `https://i.redd.it/${media_id}.jpg`;
        }
        if (["image/png"].includes(fmt)) {
          return `https://i.redd.it/${media_id}.png`;
        }
        return null;
      })
      .filter(x => !!x)
      ?? [];
  }
  /**
   * cannot handle imgur albums yet such as
   * https://imgur.com/a/iItVZDf
   * But there might be a way to do it by appending /zip to the end.
   */
  return { author, title, permalink, images };
}