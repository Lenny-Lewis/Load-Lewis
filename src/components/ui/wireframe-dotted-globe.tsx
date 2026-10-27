"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import type { FeatureCollection, MultiPolygon, Polygon } from "geojson"

interface RotatingEarthProps {
  width?: number
  height?: number
  className?: string
}

type LandData = FeatureCollection<Polygon | MultiPolygon>

const landUrl =
  "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json"

export default function RotatingEarth({
  width = 800,
  height = 600,
  className = "",
}: RotatingEarthProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!container || !canvas || !context) return

    const controller = new AbortController()
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let disposed = false
    let containerWidth = width
    let containerHeight = height
    let landFeatures: LandData | undefined
    const allDots: [number, number][] = []
    const rotation: [number, number] = [0, 0]
    let drag: { id: number; x: number; y: number; rotation: [number, number] } | null = null
    let inView = false
    const projection = d3.geoOrthographic().clipAngle(90)
    const path = d3.geoPath().projection(projection).context(context)
    const graticule = d3.geoGraticule()()

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight)
      const radius = projection.scale()
      context.beginPath()
      context.arc(containerWidth / 2, containerHeight / 2, radius, 0, 2 * Math.PI)
      context.fillStyle = "#000000"
      context.fill()
      context.strokeStyle = "#ffffff"
      context.lineWidth = 2
      context.stroke()

      context.beginPath()
      path(graticule)
      context.strokeStyle = "rgba(255, 255, 255, 0.25)"
      context.lineWidth = 1
      context.stroke()

      if (!landFeatures) return
      context.beginPath()
      landFeatures.features.forEach((feature) => path(feature))
      context.strokeStyle = "#ffffff"
      context.stroke()

      // Projection alone does not clip points on the far side of the globe.
      const center: [number, number] = [-rotation[0], -rotation[1]]
      context.beginPath()
      allDots.forEach((dot) => {
        if (d3.geoDistance(dot, center) >= Math.PI / 2) return
        const projected = projection(dot)
        if (!projected) return
        context.moveTo(projected[0] + 1.2, projected[1])
        context.arc(projected[0], projected[1], 1.2, 0, 2 * Math.PI)
      })
      context.fillStyle = "#999999"
      context.fill()
    }

    const resize = () => {
      containerWidth = Math.max(1, Math.min(width, container.clientWidth))
      containerHeight = Math.max(1, Math.min(height, containerWidth * height / width))
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(containerWidth * dpr)
      canvas.height = Math.round(containerHeight * dpr)
      canvas.style.width = `${containerWidth}px`
      canvas.style.height = `${containerHeight}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      projection
        .scale(Math.min(containerWidth, containerHeight) / 2.5)
        .translate([containerWidth / 2, containerHeight / 2])
      render()
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
    })
    visibilityObserver.observe(container)

    const pointInRing = (point: [number, number], ring: number[][]) => {
      const [x, y] = point
      let inside = false
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const [xi, yi] = ring[i]
        const [xj, yj] = ring[j]
        if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside
        }
      }
      return inside
    }

    const loadWorldData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(landUrl, { signal: controller.signal })
        if (!response.ok) throw new Error("Failed to load land data")
        const data: LandData = await response.json()
        if (disposed) return
        landFeatures = data

        // Use coordinate bounds so polygons crossing the dateline still get dots.
        data.features.forEach(({ geometry }) => {
          const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates
          polygons.forEach((rings) => {
            const outer = rings[0]
            const minLng = Math.min(...outer.map(([lng]) => lng))
            const maxLng = Math.max(...outer.map(([lng]) => lng))
            const minLat = Math.min(...outer.map(([, lat]) => lat))
            const maxLat = Math.max(...outer.map(([, lat]) => lat))
            for (let lng = minLng; lng <= maxLng; lng += 1.28) {
              for (let lat = minLat; lat <= maxLat; lat += 1.28) {
                const point: [number, number] = [lng, lat]
                if (pointInRing(point, outer) && !rings.slice(1).some((ring) => pointInRing(point, ring))) {
                  allDots.push(point)
                }
              }
            }
          })
        })
        render()
        setIsLoading(false)
        // Preserve the contact scene's existing preloader readiness signal.
        Object.assign(window, { __CONTACT_3D_READY__: true })
        window.dispatchEvent(new CustomEvent("contact-3d-ready"))
      } catch {
        if (disposed) return
        setError("Failed to load land map data")
        setIsLoading(false)
      }
    }

    let previousElapsed = 0
    const rotationTimer = d3.timer((elapsed) => {
      const delta = Math.min(elapsed - previousElapsed, 50)
      previousElapsed = elapsed
      if (drag || !inView || document.hidden || reducedMotion.matches) return
      rotation[0] = (rotation[0] + delta * 0.03) % 360
      projection.rotate(rotation)
      render()
    })

    const handlePointerDown = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0) return
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, rotation: [...rotation] }
      canvas.setPointerCapture(event.pointerId)
      canvas.style.cursor = "grabbing"
    }
    const handlePointerMove = (event: PointerEvent) => {
      if (!drag || drag.id !== event.pointerId) return
      rotation[0] = drag.rotation[0] + (event.clientX - drag.x) * 0.5
      rotation[1] = Math.max(-90, Math.min(90, drag.rotation[1] - (event.clientY - drag.y) * 0.5))
      projection.rotate(rotation)
      render()
    }
    const handlePointerUp = (event: PointerEvent) => {
      if (!drag || drag.id !== event.pointerId) return
      drag = null
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
      canvas.style.cursor = "grab"
    }

    canvas.addEventListener("pointerdown", handlePointerDown)
    canvas.addEventListener("pointermove", handlePointerMove)
    canvas.addEventListener("pointerup", handlePointerUp)
    canvas.addEventListener("pointercancel", handlePointerUp)
    canvas.addEventListener("lostpointercapture", handlePointerUp)
    // Leave wheel events untouched so scrolling over the globe scrolls the page.
    void loadWorldData()

    return () => {
      disposed = true
      controller.abort()
      rotationTimer.stop()
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      canvas.removeEventListener("pointerdown", handlePointerDown)
      canvas.removeEventListener("pointermove", handlePointerMove)
      canvas.removeEventListener("pointerup", handlePointerUp)
      canvas.removeEventListener("pointercancel", handlePointerUp)
      canvas.removeEventListener("lostpointercapture", handlePointerUp)
    }
  }, [width, height])

  return (
    <div
      ref={containerRef}
      className={`relative flex w-full items-center justify-center rounded-2xl bg-black ${className}`}
      aria-busy={isLoading}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Rotating wireframe Earth with dotted continents. Drag to rotate."
        className="max-w-full cursor-grab rounded-2xl"
        style={{ touchAction: "pan-y" }}
      />
      {isLoading && (
        <div role="status" className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/80">
          <span className="size-10 animate-spin rounded-full border-2 border-white/20 border-t-white motion-reduce:animate-none" />
          <span className="sr-only">Loading Earth visualization</span>
        </div>
      )}
      {error && (
        <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black p-8 text-center">
          <p className="mb-2 font-semibold text-red-400">Error loading Earth visualization</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      )}
    </div>
  )
}
