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
 * @returns {Promise<Request>}
 */
async function handleRequest(request) {
  try {
    if (request.method?.toUpperCase() === 'GET') {
      return helloWorldResponse();
    }
    const json = await request.json();

    if (
      typeof json.url === 'string' &&
      /https:.*reddit.*comments/i.test(json.url)
    ) {
      const result = await getImageDataFromRedditUrl(json.url);
      return jsonResponse({
        status: 'success',
        result,
      });
    }

    return jsonResponse(
      {
        status: 'failure',
        result: 'invalid url',
      },
      {
        status: 400,
      },
    );
  } catch (err) {
    return errResponse(err);
  }
}

function helloWorldResponse() {
  return new Response('hello world', {
    headers: {
      'content-type': 'text/plain;charset=UTF-8',
    },
  });
}

function errResponse(err) {
  return jsonResponse(
    {
      status: 'error',
      error: err,
    },
    {
      status: 500,
    },
  );
}

/**
 * @param {object} obj
 * @param {ResponseInit?} responseInit
 * @returns
 */
function jsonResponse(obj, { headers, status, statusText } = {}) {
  const jsonStr = JSON.stringify(obj, null, 2);
  return new Response(jsonStr, {
    ...(status && { status }),
    ...(statusText && { statusText }),
    headers: {
      ...headers,
      'content-type': 'application/json;charset=UTF-8',
    },
  });
}
