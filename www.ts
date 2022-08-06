import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { getUrl, newShort } from "./shorty.ts"

const router = new Router();
router
  .get("/", (context) => {
    context.response.headers.set("Content-Type", "text/html");
    context.response.body = "<form action=`/api/new` method=`post`><label for=`url`>URL</label><br><input type=`text` id=`url` name=`url`><br><button>Click Me!</button></form>";
  })
  .get("/:short", async (context) => {
    const { url, short } = await getUrl(context.params.short);
    if (url !== "") {
        context.response.status = 301;
        context.response.headers.set("Location", url);
    } else {
        context.response.status = 404;
    }
  })
  .get("/api/get/:short", async (context) => {
    console.log(context.params.short);
    context.response.body = await getUrl(context.params.short);
  })
  .post("/api/new", async (context) => {
    const body = await context.request.body().value;
    if(body.url) {
        context.response.body = await newShort(body.url);
    } else {
        context.response.status = 400;
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });