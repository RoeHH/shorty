/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.133.0/http/server.ts";
import { router } from "https://crux.land/router@0.0.11";
import { h, ssr } from "https://crux.land/nanossr@0.0.4";
import { isURL } from "https://deno.land/x/is_url/mod.ts";
import { getUrl, newShort } from "./shorty.ts"


serve(router(
  {
    "/": () => ssr(() => <App/>),
    "/favicon.ico": async () => await fetch("https://www.roeh.ch/img/logo.png"),
    "/:short": async (req:Request) => {
      const { url, short } = await getUrl(req.url.substring(new URL(req.url).origin.length + 1));
      if (url !== "") {
          return Response.redirect(url)
      } else {
          return ssr(() => <NotFound/>)
      }
    },
    "/api/get/:short": async (req:Request) => {
      return new Response(JSON.stringify(await getUrl(req.url.substring(new URL(req.url).origin.length + 9))), {
        headers: { "content-type": "application/json; charset=utf-8" },
      })
    },
    "/api/new": async (req: Request) => {
      if(req.body){ 
        const body = await req.formData()
        if(!body.get("url"))
          return ssr(() => <ERROR msg="Try again" />);
        
        if(!isURL(body.get("url"))) 
          return ssr(() => <ERROR msg="Use a valid url" />);
        return new Response(JSON.stringify(await newShort(body.get("url")?.toString() || "")), {
          headers: { "content-type": "application/json; charset=utf-8" },
        });
      }
      return ssr(() => <ERROR msg="Try again" />)
    },
  },
  () => ssr(() => <NotFound/>),
));

function App() {
  return (
    <div class="min-h-screen justify-center bg-gray-800">
      <form action="/api/new" method="post" class="grid gap-0 auto-rows-min align-middle justify-center">
        <input type="text" name="url" id="url"></input>
        <button class="text-xl text-white text-center bg-blue-600" id="button">Generate Short</button>
      </form>
    </div>
  );
}

function NotFound() {
  return (
    <div class="min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div class="max-w-max mx-auto">
        <main class="sm:flex">
          <p class="text-4xl font-extrabold text-indigo-600 sm:text-5xl">404</p>
          <div class="sm:ml-6">
            <div class="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Page not found</h1>
              <p class="mt-1 text-base text-gray-500">Please check the URL in the address bar and try again. <a href="/">(HOME)</a></p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function ERROR({msg: msg}:{msg: string}) {
  return (
    <div class="min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div class="max-w-max mx-auto">
        <main class="sm:flex">
          <p class="text-4xl font-extrabold text-indigo-600 sm:text-5xl">400</p>
          <div class="sm:ml-6">
            <div class="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Bad Request</h1>
              <p class="mt-1 text-base text-gray-500">{msg}<a href="/">(HOME)</a></p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
/*
const router = new Router();
router.get("/", (context: any) => {
  context.response.headers.set("Content-Type", "text/html");
  context.response.body = "<form action=/api/new method=post><label for=url>URL</label><br><input type=text id=url name=url><br><button>Click Me!</button></form>";
})
router.get("/:short", async (context :any) => {
  context.response.headers.set("Content-Type", "text/html");
  const { url, short } = await getUrl(context.params.short);
  if (url !== "") {
      context.response.status = 301;
      context.response.headers.set("Location", url);
  } else {
      context.response.status = 404;
  }
})
router.get("/api/get/:short", async (context: any) => {
  console.log(context.params.short);
  context.response.body = await getUrl(context.params.short);
})
router.post("/api/new", async (context: any) => {
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

await app.listen({ port: 8000 });*/