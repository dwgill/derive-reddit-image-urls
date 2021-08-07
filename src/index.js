import getImageDataFromRedditUrl from './getImageDataFromRedditUrl';

addEventListener('fetch', event => {
  event.respondWith(
    handleRequest(event.request).catch(
      err => new Response(err.stack, { status: 500 }),
    ),
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
        'content-type': 'text/plain;charset=UTF-8',
      },
    });
  }
  const json = await request.json();
  let result = {};
  if (
    typeof json.url === 'string' &&
    /https:.*reddit.*comments/i.test(json.url)
  ) {
    result = await getImageDataFromRedditUrl(json.url);
  }

  const responseBody = {
    status: 'success',
    result,
  };

  const jsonResult = JSON.stringify(responseBody, null, 2);

  return new Response(jsonResult, {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
}
