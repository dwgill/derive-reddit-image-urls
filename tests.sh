# Local
python.exe -m httpie POST http://127.0.0.1:8787 url=https://www.reddit.com/r/battlemaps/comments/ozdwdn/wyverns_crossroads_battlemapoc22x331540x2310/

# Against the "live" app
python.exe -m httpie POST https://derive-reddit-image-urls.dwgill.workers.dev url=https://www.reddit.com/r/battlemaps/comments/ozdwdn/wyverns_crossroads_battlemapoc22x331540x2310/