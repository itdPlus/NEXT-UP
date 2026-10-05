// Source: framer_toplevel/main (entry)

import * as Framer from "framer"

import * as React from "react"

import { createPortal } from "react-dom"

import * as ReactDOM from "react-dom/client"

const routes = {
  elEPmP6Qe: {
    elements: {
      b4I4dOSc_: "video-section",
      euhdQMqUi: "scroll-text",
      eUNG4Zy2_: "header",
      gZZEBM3M8: "welcome",
      Iq4VKOs1g: "footer",
      k49LRyZza: "slider-video",
      qVsGN6gkg: "cms-blogger",
    },
    page: Framer.lazy(() => import("./pages/Home/Home.js")),
    path: "/",
  },
  CPyR6k5qo: {
    elements: { B93yxc_h_: "footer" },
    page: Framer.lazy(() => import("./pages/Cases/Cases.js")),
    path: "/cases",
  },
  VZ0IjOXBQ: {
    elements: { u79gAh4fy: "footer" },
    page: Framer.lazy(() => import("./pages/News/News.js")),
    path: "/news",
  },
  eBtI7lsTr: {
    elements: {},
    page: Framer.lazy(() => import("./pages/OldHome/OldHome.js")),
    path: "/old-home",
  },
  aUyUqIJXs: {
    elements: {
      a4gyWZHZW: "videotextcombo",
      ahnDG7jOR: "home",
      hhzsMQGzJ: "artists",
      hyDa_mM_V: "footer",
      Ja_mU2Pvi: "awards",
      lZGWzeJOm: "videotextcombo-pre",
      qrxnLeWKI: "services",
      Y9lG97BEO: "videotextcombo-container",
    },
    page: Framer.lazy(() => import("./pages/NextupMusic/NextupMusic.js")),
    path: "/nextup-music",
  },
  Yvzxd0lFp: {
    elements: { xZ3HZbQ8w: "footer" },
    page: Framer.lazy(() => import("./pages/Bloggers/Bloggers.js")),
    path: "/blogers",
  },
  LWHzopyWu: {
    elements: { MleJlFC9B: "footer" },
    page: Framer.lazy(() => import("./pages/Job/Job.js")),
    path: "/job",
  },
  xLl4xhqIo: {
    elements: {},
    page: Framer.lazy(() => import("./pages/SubmitSuccess/SubmitSuccess.js")),
    path: "/submit-success",
  },
  dv84bIMyR: {
    collectionId: "WejaOcucf",
    elements: { pkTUQcVW1: "footer" },
    page: Framer.lazy(() => import("./pages/CaseDetail/CaseDetail.js")),
    path: "/cases/:rTw0lmuDP",
  },
  sRbHMshia: {
    collectionId: "uNYl8DcRf",
    elements: { DQBPRMffh: "footer" },
    page: Framer.lazy(() => import("./pages/NewsDetail/NewsDetail.js")),
    path: "/news/:c7gDfD2Ro",
  },
  De5XDsdl3: {
    collectionId: "QvUSVJCmT",
    elements: { IzRZ75jOA: "footer", yYHk7damv: "cms-blogger" },
    page: Framer.lazy(() => import("./pages/BloggerDetail/BloggerDetail.js")),
    path: "/blogers/:N8o8T7s_Q",
  },
}

const locales = [{ code: "ru", id: "default", name: "Russian", slug: "", textDirection: "ltr" }]

const collectionUtils = {
  QvUSVJCmT: async () => (await import("./cms/Bloggers.js"))?.["utils"],
  uNYl8DcRf: async () => (await import("./cms/News.js"))?.["utils"],
  WejaOcucf: async () => (await import("./cms/Cases.js"))?.["utils"],
}

const framerSiteId = "8d4036230082af2f58713b3ef2016670e6d6ee32c93862614765a7e2d3e3f00e"

const isBrowser = typeof document !== "undefined"

const isBot = isBrowser && /bot|-google|google-|yandex|ia_archiver|crawl|spider/iu.test(navigator.userAgent)

export async function getPageRoot({ routeId, pathVariables, localeId, collectionItemId }) {
  const rootPreload = routes[routeId].page.preload()

  const content = React.createElement(
    Framer.PageRoot,

    {
      isWebsite: true,

      environment: "site",

      routeId,

      pathVariables,

      routes,

      collectionUtils,

      framerSiteId,

      notFoundPage: Framer.lazy(() => import("./framer-modules/SitesNotFoundPage.js")),

      isReducedMotion: false,

      localeId,

      locales,

      preserveQueryParams: false,

      siteCanonicalURL: "https://www.nextupmedia.ru",

      EditorBar:
        // LOCAL PATCH: панель on-page редактора Framer грузится с framer.com и шлёт туда framerSiteId;
        // в локальной копии выключена. Включить: VITE_FRAMER_EDITOR_BAR=1 npm run dev
        typeof window !== "undefined" && import.meta.env.VITE_FRAMER_EDITOR_BAR === "1"
          ? (() => {
              if (isBot) {
                console.log("[Framer On-Page Editing] Unavailable because navigator is bot")

                return
              }

              return Framer.lazy(async () => {
                const dependencies = {
                  __version: 3,

                  framer: {
                    useCurrentRoute: Framer.useCurrentRoute,

                    useLocaleInfo: Framer.useLocaleInfo,

                    useRouter: Framer.useRouter,
                  },

                  react: {
                    createElement: React.createElement,

                    Fragment: React.Fragment,

                    memo: React.memo,

                    useCallback: React.useCallback,

                    useEffect: React.useEffect,

                    useRef: React.useRef,

                    useState: React.useState,

                    useLayoutEffect: React.useLayoutEffect,
                  },

                  "react-dom": { createPortal },
                }

                window.__framer_editorBarDependencies = dependencies

                const { createEditorBar } = await import("https://framer.com/edit/init.mjs")

                return {
                  default: createEditorBar(),
                }
              })
            })()
          : undefined,

      adaptLayoutToTextDirection: false,

      loadSnippetsModule: new Framer.LazyValue(() => import("./snippets.js")),

      initialCollectionItemId: collectionItemId,
    }
  )

  const contentWithFeaturesContext = React.createElement(
    Framer.LibraryFeaturesProvider,

    {
      children: content,

      value: {
        autobahnNavigation: true,
        disableCustomCode: false,
        editorBarDisableFrameAncestorsSecurity: false,
        motionDivToDiv: false,
        onPageLocalizationSupport: true,
        onPageMoveTool: true,
        synchronousNavigationOnDesktop: false,
        yieldOnTap: false,
      },
    }
  )

  const contentWithGracefullyDegradingErrorBoundary = React.createElement(
    Framer.GracefullyDegradingErrorBoundary,
    {
      children: contentWithFeaturesContext,
    }
  )

  const page = React.createElement(Framer.PageEffectsProvider, {
    children: contentWithGracefullyDegradingErrorBoundary,

    value: {
      global: {
        enter: {
          mask: { type: "circle", x: "50%", y: "50%" },
          opacity: 1,
          rotate: 0,
          rotate3d: false,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          transition: {
            damping: 30,
            delay: 0,
            duration: 0.8,
            ease: [0.27, 0, 0.51, 1],
            mass: 1,
            stiffness: 400,
            type: "tween",
          },
          x: "0px",
          y: "0px",
        },
      },
      routes: {},
    },
  })

  // We don't want the initial render to immediately have to suspend.

  await rootPreload

  return page
}

if (isBrowser) {
  window.__framer_importFromPackage = (packageAndFilename, exportIdentifier) => () => {
    return React.createElement(Framer.ErrorPlaceholder, {
      error: 'Package component not supported: "' + exportIdentifier + '" in "' + packageAndFilename + '"',
    })
  }

  window.__framer_events = window.__framer_events || []

  // Initialize lazy modules cache for hydration

  Framer.initLazyModulesCache()

  // Fallback support for stack gaps

  Framer.installFlexboxGapWorkaroundIfNeeded()

  const container = document.getElementById("main")

  // We know that #main is parsed before this script, so we don't need to wait for DOMContentLoaded or similar events.

  if ("framerHydrateV2" in container.dataset) main(true, container)
  else main(false, container)
}

function track() {
  if (!isBrowser) return

  window.__framer_events.push(arguments)
}

async function main(shouldHydrate, container) {
  function handleError(error, errorInfo, recoverable = true) {
    if (error.caught || window.__framer_hadFatalError) return // we already logged it

    const componentStack = errorInfo?.componentStack

    if (recoverable) {
      console.warn(
        "Caught a recoverable error. The site is still functional, but might have some UI flickering or degraded page load performance. If you are the author of this website, update external components and check recently added custom code or code overrides to fix the following server/client mismatches:\n",
        error,
        componentStack
      )

      // we only want to collect 1%, because this can be quite noisy (floods the data pipeline)

      if (Math.random() > 0.01) return
    } else {
      console.error(
        "Caught a fatal error. Please report the following to the Framer team via https://www.framer.com/contact/:\n",
        error,
        componentStack
      )
    }

    track(recoverable ? "published_site_load_recoverable_error" : "published_site_load_error", {
      message: String(error),

      componentStack, // componentStack is more useful

      stack: componentStack
        ? undefined
        : error instanceof Error && typeof error.stack === "string"
          ? error.stack
          : null,
    })
  }

  try {
    let routeId, localeId, pathVariables, breakpoints, routeData

    if (shouldHydrate) {
      routeData = JSON.parse(container.dataset["framerHydrateV2"])

      routeId = routeData.routeId

      localeId = routeData.localeId

      pathVariables = routeData.pathVariables

      breakpoints = routeData.breakpoints

      routeId = Framer.patchRoutesForABTesting(routes, routeId) // Prioritize optimized route id to avoid flickering in browsers not supporting the server-timing header (Safari older than 16.4)
    } else {
      Framer.patchRoutesForABTesting(routes, undefined) // This must happen before inferInitialRouteFromPath

      const serverRouteExperimentEnabled = true

      const serverRoute =
        serverRouteExperimentEnabled &&
        performance.getEntriesByType("navigation")[0]?.serverTiming?.find((e) => e.name === "route")
          ?.description

      if (serverRoute) {
        const routeData = new URLSearchParams(serverRoute)

        routeId = routeData.get("id")

        localeId = routeData.get("locale")

        for (const [key, value] of routeData.entries()) {
          if (!key.startsWith("var.")) continue

          pathVariables ??= {}

          pathVariables[key.slice(4)] = value
        }
      }

      if (!routeId || !localeId) {
        const routeData = Framer.inferInitialRouteFromPath(
          routes,
          decodeURIComponent(location.pathname),
          true,
          locales
        )

        routeId = routeData.routeId

        localeId = routeData.localeId

        pathVariables = routeData.pathVariables
      }
    }

    const pagePromise = getPageRoot({
      routeId,

      localeId,

      pathVariables,

      collectionItemId: routeData?.collectionItemId,
    })

    if (typeof window !== "undefined") {
      void (async () => {
        const route = routes[routeId]

        const defaultLocaleId = "default"

        const framerLocale = locales.find(({ id }) =>
          !localeId ? id === defaultLocaleId : id === localeId
        ).code

        let collectionItemId = routeData?.collectionItemId ?? null

        if (collectionItemId === null && route?.collectionId && collectionUtils) {
          const utils = await collectionUtils[route.collectionId]?.()

          const [slug] = Object.values(pathVariables)

          if (utils && typeof slug === "string") {
            collectionItemId = (await utils.getRecordIdBySlug(slug, framerLocale || undefined)) ?? null
          }
        }

        const resolvedDateTimeOptions = Intl.DateTimeFormat().resolvedOptions()

        const timezone = resolvedDateTimeOptions.timeZone

        const locale = resolvedDateTimeOptions.locale

        // wait for the page to be activated before sending the pageview event

        // https://developer.chrome.com/docs/web-platform/prerender-pages#impact-on-analytics

        await new Promise((resolve) => {
          if (document.prerendering) {
            document.addEventListener("prerenderingchange", resolve, { once: true })
          } else {
            resolve()
          }
        })

        window.__framer_events.push([
          "published_site_pageview",

          {
            framerSiteId: framerSiteId ?? null,

            version: 2,

            routePath: route?.path || "/",

            collectionItemId,

            framerLocale: framerLocale || null,

            webPageId: route?.abTestingVariantId ?? routeId,

            abTestId: route?.abTestId,

            referrer: document.referrer || null,

            url: window.location.href,

            hostname: window.location.hostname || null,

            pathname: window.location.pathname || null,

            hash: window.location.hash || null,

            search: window.location.search || null,

            timezone,

            locale,
          },

          "eager",
        ])

        // Yield to avoid blocking the main thread with the user code

        await Framer.yieldToMain({
          priority: "background",
          ensureContinueBeforeUnload: true,
          continueAfter: "paint",
        })

        document.dispatchEvent(
          new CustomEvent("framer:pageview", {
            detail: { framerLocale: framerLocale || null },
          })
        )
      })()
    }

    const page = await pagePromise

    if (shouldHydrate) {
      Framer.withPerformanceMarks("framer-rewrite-breakpoints", () => {
        Framer.removeHiddenBreakpointLayersV2(breakpoints)

        window.__framer_onRewriteBreakpoints?.(breakpoints)
      })

      const startTransition = isBot ? (cb) => cb() : React.startTransition

      startTransition(() => {
        Framer.markHydrationStart()

        if (true) Framer.turnOffReactEventHandling()

        ReactDOM.hydrateRoot(container, page, { onRecoverableError: handleError })
      })
    } else {
      ReactDOM.createRoot(container, { onRecoverableError: handleError }).render(page)
    }
  } catch (error) {
    handleError(error, undefined, false)

    throw error
  }
}
