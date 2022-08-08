import { Application, Router, Context } from "https://deno.land/x/oak/mod.ts";
import { isURL } from "https://deno.land/x/is_url/mod.ts";
import { getUrl, newShort } from "./shorty.ts"

const router = new Router();
router
  .get("/", (context: any) => {
    console.log(Deno.env.get("APP_ID") || "");

    context.response.headers.set("Content-Type", "text/html");
    context.response.body = "<form action=/api/new method=post><label for=url>URL</label><br><input type=text id=url name=url><br><button>Click Me!</button></form>";
  })
  .get("/:short", async (context :any) => {
    const { url, short } = await getUrl(context.params.short);
    if (url !== "") {
        context.response.status = 301;
        context.response.headers.set("Location", url);
    } else {
        context.response.status = 404;
    }
  })
  .get("/api/get/:short", async (context: any) => {
    console.log(context.params.short);
    context.response.body = await getUrl(context.params.short);
  })
  .post("/api/new", async (context: Context) => {
    const body = await context.request.body({type: "form"}).value;
    console.log(body.get("url"));
    
    if(isURL(body.get("url"))) {
        context.response.body = await newShort(body.get("url") || "");
    } else {
        context.response.status = 400;
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });