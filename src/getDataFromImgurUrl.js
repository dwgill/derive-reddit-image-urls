const imgurAlbumUrlRE = /https?:\/\/imgur.com\/a\/([A-Za-z0-9]+)\/?/;

function extractAlbumHashFromUrl(albumUrl) {
  return imgurAlbumUrlRE.exec(albumUrl)[1];
}

async function getImageUrlsFromImgurAlbumUrl(albumUrl) {
  const albumHash = extractAlbumHashFromUrl(albumUrl)?.trim() ?? '';
  if (!albumHash) {
    return [];
  }
  // API ref: https://apidocs.imgur.com/#7dde894b-a967-4419-9be2-082fbf379109
  const result = await fetch(new Request(`https://api.imgur.com/3/album/${albumHash}/images`, {
    method: 'GET',
    headers: new Headers({
      Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
    }),
  }));
  const jsonBody = await result.json();
  if (jsonBody.status !== 200) {
    return [];
  }
  return jsonBody.data.map(albumEntry => {
    // data model ref: https://api.imgur.com/models/image
    return albumEntry.link;
  });
}

export default getImageUrlsFromImgurAlbumUrl;
