import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "VOLTA";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "description", content: "VOLTA schematic capture. Transient, AC, and DC analysis on a dark grid." },
      { name: "theme-color", content: "#0A0A0A" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
    scripts: [
      {
        children: `(function(){function fit(){try{if(localStorage.getItem("volta.sheet.v1"))return;}catch(e){return;}var svg=document.querySelector("[data-canvas]");if(!svg)return;var g=svg.querySelector("[data-camera]");if(!g)return;var x0=+svg.dataset.fitX0,y0=+svg.dataset.fitY0,x1=+svg.dataset.fitX1,y1=+svg.dataset.fitY1;if(!isFinite(x0)||!isFinite(x1)||x1<=x0)return;var r=svg.getBoundingClientRect();if(r.width<40||r.height<40)return;var bw=Math.max(80,x1-x0),bh=Math.max(80,y1-y0);var zoom=Math.min(2.2,Math.max(0.35,Math.min((r.width-96)/bw,(r.height-96)/bh)));g.setAttribute("transform","translate("+((r.width-(x0+x1)*zoom)/2)+" "+((r.height-(y0+y1)*zoom)/2)+") scale("+zoom+")");}function go(){fit();requestAnimationFrame(fit);}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",go);else go();})();`,
      },
    ],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
