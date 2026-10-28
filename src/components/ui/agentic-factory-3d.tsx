"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js"

export type CareerStation = {
  id: string
  title: string
  organization?: string
  date?: string
  summary?: string
  color: string
}

export type AgenticFactory3DProps = {
  height?: number | string
  className?: string
  stations: CareerStation[]
  activeStation?: number
  onStation?: (index: number) => void
  onReady?: () => void
}

const makeMaterial = (color: number, metalness = 0.5, roughness = 0.35) =>
  new THREE.MeshStandardMaterial({ color, metalness, roughness })

/** Flat "$" face for gold coins in the scene. */
const makeDollarFace = (size = 0.22) => {
  const canvas = document.createElement("canvas")
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext("2d")!
  ctx.clearRect(0, 0, 128, 128)
  ctx.fillStyle = "#5a3d08"
  ctx.font = "bold 92px ui-sans-serif, system-ui, sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("$", 64, 70)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }),
  )
  face.userData.dollarTex = tex
  return face
}

/** Tiny clipboard auditor that walks the six career stations. */
const createInspectorBot = () => {
  const bot = new THREE.Group()
  const bodyMat = makeMaterial(0xe8e4dc, 0.15, 0.55)
  const accentMat = makeMaterial(0xcda144, 0.45, 0.3)
  const darkMat = makeMaterial(0x1c1c22, 0.2, 0.45)
  const clipMat = makeMaterial(0xf4f1ea, 0, 0.78)

  const body = new THREE.Mesh(new RoundedBoxGeometry(0.38, 0.48, 0.32, 3, 0.06), bodyMat)
  body.position.y = 0.42
  body.castShadow = true
  bot.add(body)

  const head = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.3, 0.3, 3, 0.07), bodyMat)
  head.position.y = 0.82
  head.castShadow = true
  bot.add(head)

  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.1, 0.04), accentMat)
  visor.position.set(0, 0.84, 0.15)
  bot.add(visor)

  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.18, 8), darkMat)
  antenna.position.set(0.08, 1.05, 0)
  bot.add(antenna)
  const tip = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 10, 8),
    new THREE.MeshStandardMaterial({
      color: 0xcda144,
      emissive: 0xcda144,
      emissiveIntensity: 0.6,
      metalness: 0.45,
      roughness: 0.3,
    }),
  )
  tip.position.set(0.08, 1.16, 0)
  bot.add(tip)

  for (const x of [-0.1, 0.1]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.22, 8), darkMat)
    leg.position.set(x, 0.12, 0)
    bot.add(leg)
  }

  // Clipboard in the left hand
  const clipboard = new THREE.Group()
  clipboard.position.set(-0.32, 0.55, 0.12)
  clipboard.rotation.set(-0.35, 0.25, -0.15)
  const board = new THREE.Mesh(new RoundedBoxGeometry(0.28, 0.38, 0.03, 2, 0.02), clipMat)
  clipboard.add(board)
  const clip = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 0.04), accentMat)
  clip.position.set(0, 0.16, 0.02)
  clipboard.add(clip)
  for (let i = 0; i < 3; i++) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.015, 0.008), darkMat)
    line.position.set(0, 0.04 - i * 0.07, 0.02)
    clipboard.add(line)
  }
  bot.add(clipboard)

  // Pen in the right hand
  const penArm = new THREE.Group()
  penArm.position.set(0.28, 0.58, 0.1)
  const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.014, 0.28, 8), darkMat)
  pen.rotation.z = Math.PI / 2.4
  pen.rotation.y = 0.4
  penArm.add(pen)
  const nib = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.06, 8), accentMat)
  nib.position.set(0.14, -0.02, 0.04)
  nib.rotation.z = Math.PI / 2.4
  penArm.add(nib)
  bot.add(penArm)

  bot.userData.penArm = penArm
  bot.userData.clipboard = clipboard
  bot.userData.head = head
  bot.userData.tip = tip
  bot.scale.setScalar(0.92)
  return bot
}

/** An interactive, six-stage visual companion for a career timeline. */
export default function AgenticFactory3D({
  height = 560,
  className = "",
  stations,
  activeStation = 0,
  onStation,
  onReady,
}: AgenticFactory3DProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [selectedStation, setSelectedStation] = useState<number | null>(null)
  const callbacks = useRef({ onStation, onReady })
  const currentStation = useRef(activeStation)

  useEffect(() => {
    callbacks.current = { onStation, onReady }
  }, [onStation, onReady])

  useEffect(() => {
    currentStation.current = activeStation
    rootRef.current?.dispatchEvent(new CustomEvent("career-station", { detail: activeStation }))
  }, [activeStation])

  useEffect(() => {
    const root = rootRef.current
    if (!root || !stations.length) return
    const host = root.querySelector<HTMLElement>("[data-scene]")
    if (!host) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(8.2, 7.2, 11.2)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    host.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enablePan = false
    controls.enableZoom = false
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.minPolarAngle = 0.45
    controls.maxPolarAngle = 1.45
    controls.target.set(0, 0.65, 0)
    controls.rotateSpeed = 0.45

    const ambient = new THREE.HemisphereLight(0xffffff, 0x17130f, 3.3)
    scene.add(ambient)
    const key = new THREE.DirectionalLight(0xffecd1, 5.6)
    key.position.set(-5, 10, 7)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xcda144, 2.1)
    rim.position.set(5, 5, -8)
    scene.add(rim)

    const steel = makeMaterial(0x424249, 0.78, 0.3)
    const dark = makeMaterial(0x151519, 0.3, 0.52)
    const chrome = makeMaterial(0xf2f4f7, 0.75, 0.2)
    const warmAccent = makeMaterial(0xcda144, 0.55, 0.28)

    const base = new THREE.Mesh(new RoundedBoxGeometry(15, 0.45, 7, 5, 0.16), steel)
    base.position.y = -0.25
    base.receiveShadow = true
    scene.add(base)
    const deck = new THREE.Mesh(new RoundedBoxGeometry(14.65, 0.08, 6.65, 4, 0.1), makeMaterial(0x24242a, 0.75, 0.3))
    deck.position.y = 0.02
    scene.add(deck)
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(48, 38), new THREE.ShadowMaterial({ opacity: 0.3 }))
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -0.5
    floor.receiveShadow = true
    scene.add(floor)

    // ——— Elevated oval conveyor ———
    const BELT_Y = 0.38
    const RX = 5.2
    const RZ = 1.85
    const beltPath2d = new THREE.EllipseCurve(0, 0, RX, RZ, 0, Math.PI * 2, false, 0)
    const ellipsePoints2d = beltPath2d.getPoints(96)
    const beltCurve = new THREE.CatmullRomCurve3(
      ellipsePoints2d.map((p) => new THREE.Vector3(p.x, BELT_Y, p.y)),
      true,
      "catmullrom",
      0.15,
    )
    const belt = new THREE.Group()
    belt.rotation.y = -0.06
    scene.add(belt)

    const railMat = makeMaterial(0x3a3a42, 0.7, 0.35)
    const beltDark = makeMaterial(0x1a1a20, 0.25, 0.55)
    const tileMat = makeMaterial(0x52525c, 0.65, 0.32)

    const railOffset = 0.4
    const buildRail = (side: number) => {
      const pts = ellipsePoints2d.map((p) => {
        const nx = p.x / RX
        const nz = p.y / RZ
        const len = Math.hypot(nx, nz) || 1
        return new THREE.Vector3(
          p.x + (nx / len) * railOffset * side,
          BELT_Y + 0.06,
          p.y + (nz / len) * railOffset * side,
        )
      })
      const curve = new THREE.CatmullRomCurve3(pts, true)
      belt.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 120, 0.035, 6, true), railMat))
    }
    buildRail(1)
    buildRail(-1)

    const bed = new THREE.Mesh(new THREE.TubeGeometry(beltCurve, 120, 0.3, 8, true), beltDark)
    bed.scale.y = 0.28
    belt.add(bed)

    const TILE_COUNT = 72
    const tileGeo = new THREE.BoxGeometry(0.26, 0.055, 0.5)
    const tiles = new THREE.InstancedMesh(tileGeo, tileMat, TILE_COUNT)
    tiles.castShadow = true
    belt.add(tiles)
    const dummy = new THREE.Object3D()
    const point = new THREE.Vector3()
    const tangent = new THREE.Vector3()
    const updateBelt = (time: number) => {
      for (let i = 0; i < TILE_COUNT; i++) {
        const u = (i / TILE_COUNT + time * 0.014) % 1
        beltCurve.getPointAt(u, point)
        beltCurve.getTangentAt(u, tangent)
        dummy.position.copy(point)
        dummy.position.y += 0.04
        dummy.rotation.set(0, -Math.atan2(tangent.z, tangent.x), 0)
        dummy.updateMatrix()
        tiles.setMatrixAt(i, dummy.matrix)
      }
      tiles.instanceMatrix.needsUpdate = true
    }

    const legGeo = new THREE.CylinderGeometry(0.035, 0.045, BELT_Y + 0.02, 8)
    for (let i = 0; i < 10; i++) {
      const u = i / 10
      beltCurve.getPointAt(u, point)
      const leg = new THREE.Mesh(legGeo, chrome)
      leg.position.set(point.x, (BELT_Y - 0.02) / 2, point.z)
      leg.castShadow = true
      belt.add(leg)
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.04, 10), steel)
      foot.position.set(point.x, 0.04, point.z)
      belt.add(foot)
    }

    type Cargo = { group: THREE.Group; speed: number; phase: number; bob: number }
    const cargo: Cargo[] = []
    const makeCard = () => {
      const g = new THREE.Group()
      g.add(new THREE.Mesh(new RoundedBoxGeometry(0.38, 0.52, 0.04, 2, 0.02), makeMaterial(0xf4f1ea, 0, 0.75)))
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.03, 0.01), warmAccent)
      stripe.position.set(0, 0.12, 0.025)
      g.add(stripe)
      return g
    }
    const makeBox = (color: number) => {
      const g = new THREE.Group()
      g.add(new THREE.Mesh(new RoundedBoxGeometry(0.32, 0.28, 0.32, 2, 0.04), makeMaterial(color, 0.2, 0.45)))
      return g
    }
    const makeCoin = () => {
      const g = new THREE.Group()
      const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 20), warmAccent)
      coin.rotation.x = Math.PI / 2
      g.add(coin)
      const dollar = makeDollarFace(0.18)
      dollar.position.z = 0.028
      g.add(dollar)
      return g
    }
    ;[
      { build: makeCard, phase: 0.05, speed: 0.032, bob: 0.04 },
      { build: () => makeBox(0x3d3d48), phase: 0.22, speed: 0.032, bob: 0.03 },
      { build: makeCoin, phase: 0.4, speed: 0.032, bob: 0.05 },
      { build: makeCard, phase: 0.58, speed: 0.032, bob: 0.04 },
      { build: () => makeBox(0x56545d), phase: 0.75, speed: 0.032, bob: 0.03 },
      { build: makeCoin, phase: 0.9, speed: 0.032, bob: 0.05 },
    ].forEach(({ build, phase, speed, bob }) => {
      const group = build()
      belt.add(group)
      cargo.push({ group, speed, phase, bob })
    })

    const documentGroup = new THREE.Group()
    const paper = new THREE.Mesh(new RoundedBoxGeometry(0.52, 0.72, 0.045, 3, 0.03), makeMaterial(0xf4f1ea, 0, 0.78))
    documentGroup.add(paper)
    const documentAccent = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.035, 0.012), warmAccent)
    documentAccent.position.set(0, 0.17, 0.03)
    documentGroup.add(documentAccent)
    for (let i = 0; i < 3; i++) {
      const line = new THREE.Mesh(new THREE.BoxGeometry(0.34 - i * 0.04, 0.022, 0.01), makeMaterial(0x282732, 0, 0.65))
      line.position.set(-0.01, 0.04 - i * 0.1, 0.03)
      documentGroup.add(line)
    }
    belt.add(documentGroup)

    const stationMeshes: THREE.Object3D[] = []
    const glows: THREE.MeshStandardMaterial[] = []
    const rayTargets: THREE.Object3D[] = []
    const spinningReels: THREE.Object3D[] = []
    let checkoutCoin: THREE.Object3D | undefined

    // Original staggered row layout along the slab
    const positions: Array<[number, number]> = [
      [-5, -1.25], [-3, 1.1], [-1, -1.35], [1.15, 1.1], [3.45, -1.2], [5.25, 1.05],
    ]

    stations.slice(0, 6).forEach((station, index) => {
      const group = new THREE.Group()
      const [x, z] = positions[index]
      group.position.set(x, 0.08, z)
      group.userData.station = index
      scene.add(group)
      stationMeshes.push(group)
      rayTargets.push(group)
      const accent = new THREE.Color(station.color)
      const glow = new THREE.MeshStandardMaterial({
        color: accent, emissive: accent, emissiveIntensity: 0.35, metalness: 0.35, roughness: 0.28,
      })
      glows.push(glow)
      const plateMesh = new THREE.Mesh(new RoundedBoxGeometry(1.7, 0.18, 1.45, 4, 0.09), steel)
      plateMesh.position.y = 0.12
      plateMesh.castShadow = true
      group.add(plateMesh)
      const trim = new THREE.Mesh(new RoundedBoxGeometry(1.55, 0.035, 1.3, 3, 0.04), glow)
      trim.position.y = 0.23
      group.add(trim)
      const chassis = new THREE.Mesh(new RoundedBoxGeometry(1.45, 0.68, 1.1, 4, 0.1), makeMaterial(0x56545d, 0.65, 0.3))
      chassis.position.y = 0.62
      chassis.castShadow = true
      group.add(chassis)
      const screen = new THREE.Mesh(new RoundedBoxGeometry(1.1, 0.62, 0.06, 3, 0.04), makeMaterial(0x17171c, 0.2, 0.35))
      screen.position.set(0, 0.92, 0.57)
      group.add(screen)
      const indicator = new THREE.Mesh(new THREE.CircleGeometry(0.08, 18), glow)
      indicator.position.set(-0.4, 0.92, 0.61)
      group.add(indicator)
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.84, 12), chrome)
      arm.position.set(0.52, 1.35, -0.18)
      arm.rotation.z = -0.43
      group.add(arm)
      const tool = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 10), glow)
      tool.position.set(0.7, 1.72, -0.18)
      group.add(tool)

      if (index === 0) {
        const browser = new THREE.Mesh(new RoundedBoxGeometry(1.22, 0.76, 0.08, 3, 0.04), makeMaterial(0xf4f1ea, 0.15, 0.35))
        browser.position.set(-0.05, 1.62, 0.18)
        group.add(browser)
        const page = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 0.56), new THREE.MeshBasicMaterial({ color: new THREE.Color(station.color) }))
        page.position.set(-0.05, 1.62, 0.226)
        group.add(page)
      } else if (index === 1) {
        for (let row = 0; row < 3; row++) {
          const rack = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.12, 0.11), dark)
          rack.position.set(-0.03, 1.25 + row * 0.18, 0.51)
          group.add(rack)
          const light = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), glow)
          light.position.set(0.32, 1.25 + row * 0.18, 0.58)
          group.add(light)
        }
      } else if (index === 2) {
        const recorder = new THREE.Mesh(new RoundedBoxGeometry(1.12, 0.48, 0.52, 3, 0.08), dark)
        recorder.position.set(0, 1.28, 0)
        group.add(recorder)
        for (const rx of [-0.3, 0.3]) {
          const reel = new THREE.Group()
          reel.position.set(rx, 1.64, 0.22)
          const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.055, 20), chrome)
          disc.rotation.x = Math.PI / 2
          reel.add(disc)
          const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.07, 12), glow)
          hub.rotation.x = Math.PI / 2
          reel.add(hub)
          group.add(reel)
          spinningReels.push(reel)
        }
      } else if (index === 3) {
        const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.34, 2), glow)
        core.position.set(-0.16, 1.55, 0)
        group.add(core)
        const orbit = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.018, 8, 30), chrome)
        orbit.position.copy(core.position)
        orbit.rotation.x = Math.PI / 2.6
        group.add(orbit)
        spinningReels.push(orbit)
      } else if (index === 4) {
        const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.62, 12), chrome)
        stand.position.set(-0.08, 1.43, 0)
        group.add(stand)
        const tv = new THREE.Mesh(new RoundedBoxGeometry(0.78, 1.28, 0.1, 3, 0.06), dark)
        tv.position.set(-0.08, 1.92, 0)
        group.add(tv)
        const screenGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.63, 1.05), new THREE.MeshBasicMaterial({ color: new THREE.Color(station.color) }))
        screenGlow.position.set(-0.08, 1.92, 0.057)
        group.add(screenGlow)
      } else if (index === 5) {
        const cashier = new THREE.Mesh(new RoundedBoxGeometry(1.08, 0.42, 0.62, 3, 0.07), makeMaterial(0xf4f1ea, 0.25, 0.38))
        cashier.position.set(-0.1, 1.25, 0.04)
        group.add(cashier)
        const receipt = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.64, 0.035), makeMaterial(0xf4f1ea, 0, 0.8))
        receipt.position.set(0.28, 1.68, 0.1)
        receipt.rotation.x = -0.24
        group.add(receipt)
        const coin = new THREE.Group()
        coin.position.set(-0.48, 1.72, 0.16)
        const coinDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.065, 24), makeMaterial(0xcda144, 0.6, 0.22))
        coinDisc.rotation.x = Math.PI / 2
        coin.add(coinDisc)
        const dollar = makeDollarFace(0.24)
        dollar.position.z = 0.04
        coin.add(dollar)
        group.add(coin)
        checkoutCoin = coin
      }
      const label = document.createElement("div")
      label.className = "career-factory-label"
      label.style.setProperty("--accent", station.color)
      label.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><strong>${station.title}</strong><small>${station.organization || "Career stage"}</small>`
      root.querySelector("[data-labels]")?.appendChild(label)
      group.userData.label = label
    })

    // Inspector bot walks the conveyor loop like a factory worker, pausing to review each station.
    const inspector = createInspectorBot()
    belt.add(inspector)
    const walkPoint = new THREE.Vector3()
    const walkTangent = new THREE.Vector3()
    const walkOutward = new THREE.Vector3()
    const stationSample = new THREE.Vector3()
    const stationUs = positions.map(([sx, sz]) => {
      let bestU = 0
      let bestD = Infinity
      for (let i = 0; i < 120; i++) {
        const u = i / 120
        beltCurve.getPointAt(u, stationSample)
        const d = (stationSample.x - sx) ** 2 + (stationSample.z - sz) ** 2
        if (d < bestD) {
          bestD = d
          bestU = u
        }
      }
      return bestU
    })
    // Visit order follows the belt direction (ascending u), wrapping around the loop.
    const beltVisitOrder = stationUs
      .map((u, index) => ({ u, index }))
      .sort((a, b) => a.u - b.u)
    const WALK_SECS = 2.15
    const REVIEW_SECS = 2.9
    const SEGMENT_SECS = WALK_SECS + REVIEW_SECS

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let pointerStart = new THREE.Vector2()
    const onPointerDown = (event: PointerEvent) => {
      pointerStart.set(event.clientX, event.clientY)
    }
    const onPointerUp = (event: PointerEvent) => {
      if (pointerStart.distanceTo(new THREE.Vector2(event.clientX, event.clientY)) > 6) return
      const bounds = renderer.domElement.getBoundingClientRect()
      pointer.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -((event.clientY - bounds.top) / bounds.height) * 2 + 1)
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.intersectObjects(rayTargets, true)[0]
      if (hit) {
        let target: THREE.Object3D | null = hit.object
        while (target && typeof target.userData.station !== "number") target = target.parent
        if (target) {
          const index = target.userData.station as number
          callbacks.current.onStation?.(index)
          setSelectedStation(index)
        }
      }
    }
    renderer.domElement.addEventListener("pointerdown", onPointerDown)
    renderer.domElement.addEventListener("pointerup", onPointerUp)
    const setStation = (event: Event) => { currentStation.current = (event as CustomEvent<number>).detail }
    root.addEventListener("career-station", setStation)

    type Mode = "assembled" | "cutaway" | "stations" | "journey"
    type View = "overview" | "side" | "top" | "station"
    let mode: Mode = "assembled"
    let view: View = "overview"
    let playing = true
    let spread = 0
    const desiredCamera = new THREE.Vector3()
    const desiredTarget = new THREE.Vector3(0, 0.65, 0)
    const setView = (next: View) => {
      view = next
      const active = stationMeshes[currentStation.current]
      if (next === "side") desiredCamera.set(15, 5.8, 7)
      else if (next === "top") desiredCamera.set(0.01, 18, 0.8)
      else if (next === "station" && active) {
        desiredTarget.copy(active.position).add(new THREE.Vector3(0, 0.8, 0))
        desiredCamera.copy(desiredTarget).add(new THREE.Vector3(5, 3.6, 6))
      } else { desiredCamera.set(8.2, 7.2, 11.2); desiredTarget.set(0, 0.65, 0) }
      root.querySelectorAll<HTMLButtonElement>("[data-view]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.view === next)))
    }
    const setMode = (next: Mode) => {
      mode = next
      root.querySelectorAll<HTMLButtonElement>("[data-mode]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.mode === next)))
      root.classList.toggle("career-factory--stations", next === "stations")
      if (next === "journey") setView("station")
    }
    const buttonListeners: Array<() => void> = []
    root.querySelectorAll<HTMLButtonElement>("[data-mode]").forEach((button) => {
      const handler = () => setMode(button.dataset.mode as Mode)
      button.addEventListener("click", handler); buttonListeners.push(() => button.removeEventListener("click", handler))
    })
    root.querySelectorAll<HTMLButtonElement>("[data-view]").forEach((button) => {
      const handler = () => setView(button.dataset.view as View)
      button.addEventListener("click", handler); buttonListeners.push(() => button.removeEventListener("click", handler))
    })
    const playButton = root.querySelector<HTMLButtonElement>("[data-play]")
    const togglePlay = () => { playing = !playing; playButton?.setAttribute("aria-pressed", String(!playing)); if (playButton) playButton.textContent = playing ? "Pause" : "Play" }
    playButton?.addEventListener("click", togglePlay)
    setView("overview")

    const resize = () => {
      const { width, height: sceneHeight } = host.getBoundingClientRect()
      if (!width || !sceneHeight) return
      renderer.setSize(width, sceneHeight, false)
      camera.aspect = width / sceneHeight
      camera.updateProjectionMatrix()
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)
    resize()
    let raf = 0
    const labelPosition = new THREE.Vector3()
    let interacting = false
    let cameraPinned = false
    const render = (now: number) => {
      const time = now / 1000
      if (playing) {
        updateBelt(time)
        cargo.forEach((item) => {
          const u = (item.phase + time * item.speed) % 1
          beltCurve.getPointAt(u, point)
          beltCurve.getTangentAt(u, tangent)
          item.group.position.copy(point)
          item.group.position.y += 0.22 + Math.sin(time * 2.5 + item.phase * 10) * item.bob
          item.group.rotation.set(0, -Math.atan2(tangent.z, tangent.x), 0)
        })
      }
      spinningReels.forEach((reel, index) => { reel.rotation.z = time * (index % 2 ? -1 : 1) * 1.8 })
      if (checkoutCoin) {
        checkoutCoin.rotation.y = time * 3.4
        checkoutCoin.position.y = 1.72 + Math.abs(Math.sin(time * 1.6)) * 0.18
      }

      // Factory worker: follow the conveyor path, pause at each station to review & write.
      const stationCount = beltVisitOrder.length
      const elapsed = playing ? time : 0
      const segmentIndex = Math.floor(elapsed / SEGMENT_SECS) % stationCount
      const segmentT = elapsed % SEGMENT_SECS
      const reviewing = segmentT >= WALK_SECS
      const currentStop = beltVisitOrder[segmentIndex]
      const prevStop = beltVisitOrder[(segmentIndex + stationCount - 1) % stationCount]
      const visitIndex = currentStop.index

      let walkU = currentStop.u
      if (!reviewing) {
        const t = segmentT / WALK_SECS
        const ease = t * t * (3 - 2 * t)
        let fromU = prevStop.u
        let toU = currentStop.u
        if (toU <= fromU) toU += 1
        walkU = (fromU + (toU - fromU) * ease) % 1
      }

      beltCurve.getPointAt(walkU, walkPoint)
      beltCurve.getTangentAt(walkU, walkTangent)
      walkOutward.set(walkPoint.x, 0, walkPoint.z).normalize()
      // Walk the aisle between the belt and the stations (outward from the oval).
      inspector.position.set(
        walkPoint.x + walkOutward.x * 0.95,
        0.08 + (reviewing ? Math.sin(time * 2.1) * 0.01 : Math.sin(time * 9.5) * 0.028),
        walkPoint.z + walkOutward.z * 0.95,
      )

      const penArm = inspector.userData.penArm as THREE.Group
      const clipboard = inspector.userData.clipboard as THREE.Group
      const head = inspector.userData.head as THREE.Object3D
      const tip = inspector.userData.tip as THREE.Mesh
      const tipMat = tip.material as THREE.MeshStandardMaterial
      const [sx, sz] = positions[visitIndex]

      if (reviewing) {
        // Face the workstation, glance station → clipboard, scribble notes.
        const lookX = sx - inspector.position.x
        const lookZ = sz - inspector.position.z
        inspector.rotation.y = Math.atan2(lookX, lookZ)
        const reviewPhase = (segmentT - WALK_SECS) / REVIEW_SECS
        const glance = Math.sin(reviewPhase * Math.PI * 2.2)
        head.rotation.x = -0.08 + glance * 0.18
        head.rotation.y = glance * 0.12
        clipboard.rotation.x = -0.55 + Math.sin(time * 3.2) * 0.04
        clipboard.rotation.z = -0.08
        // Write on the clipboard with the pen.
        penArm.rotation.x = -0.55 + Math.sin(time * 16) * 0.42
        penArm.rotation.y = 0.15 + Math.sin(time * 9) * 0.12
        penArm.rotation.z = 0.1 + Math.sin(time * 13) * 0.28
        tipMat.emissiveIntensity = 0.8 + Math.abs(Math.sin(time * 7)) * 1.6
      } else {
        // Walk along the belt facing travel direction.
        inspector.rotation.y = Math.atan2(walkTangent.x, walkTangent.z)
        head.rotation.x = 0
        head.rotation.y = 0
        clipboard.rotation.x = -0.35
        clipboard.rotation.z = -0.15
        penArm.rotation.x = Math.sin(time * 7) * 0.12
        penArm.rotation.y = 0
        penArm.rotation.z = 0
        tipMat.emissiveIntensity = 0.4
      }

      spread = THREE.MathUtils.lerp(spread, mode === "stations" ? 1 : 0, 0.055)
      stationMeshes.forEach((station, index) => {
        const active = index === currentStation.current
        const beingChecked = playing && reviewing && index === visitIndex
        const original = positions[index]
        station.position.x = original[0] * (1 + spread * 0.17)
        station.position.z = original[1] * (1 + spread * 0.42)
        station.position.y = (active || beingChecked ? 0.18 + Math.sin(time * 2.4) * 0.035 : 0.08) + spread * (index % 2 ? 0.14 : 0.32)
        station.scale.y = THREE.MathUtils.lerp(station.scale.y, mode === "cutaway" ? 0.68 : 1, 0.075)
        glows[index].emissiveIntensity = THREE.MathUtils.lerp(
          glows[index].emissiveIntensity,
          active || beingChecked ? 2.3 : 0.35,
          0.08,
        )
        const label = station.userData.label as HTMLDivElement
        // Anchor above the tallest station props so HTML labels sit clear of the factory.
        labelPosition.copy(station.position).add(new THREE.Vector3(0, 3.15, 0)).project(camera)
        const visible = labelPosition.z < 1
        const pad = 12
        const lw = label.offsetWidth || 168
        const lh = label.offsetHeight || 64
        let sx = (labelPosition.x * 0.5 + 0.5) * host.clientWidth
        let sy = (-labelPosition.y * 0.5 + 0.5) * host.clientHeight
        sx = Math.min(host.clientWidth - pad - lw * 0.5, Math.max(pad + lw * 0.5, sx))
        sy = Math.min(host.clientHeight - pad, Math.max(pad + lh, sy))
        const highlighted = active || beingChecked
        label.classList.toggle("is-active", highlighted)
        label.style.opacity = visible ? (highlighted ? "1" : "0.92") : "0"
        label.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -100%) scale(${highlighted ? 1.05 : 1})`
      })
      const u = (time * 0.035) % 1
      beltCurve.getPointAt(u, documentGroup.position)
      beltCurve.getTangentAt(u, tangent)
      documentGroup.position.y += 0.28 + Math.sin(time * 4) * 0.06
      documentGroup.rotation.set(0, -Math.atan2(tangent.z, tangent.x), 0)
      if (mode === "journey") {
        currentStation.current = Math.min(stations.length - 1, Math.floor(u * stations.length))
      }
      if (view === "station" && stationMeshes[currentStation.current]) {
        const active = stationMeshes[currentStation.current]
        desiredTarget.copy(active.position).add(new THREE.Vector3(0, 0.8, 0))
        desiredCamera.copy(desiredTarget).add(new THREE.Vector3(5, 3.6, 6))
      }
      if (!interacting && !cameraPinned) {
        camera.position.lerp(desiredCamera, 0.035)
        controls.target.lerp(desiredTarget, 0.035)
      }
      controls.autoRotate = !interacting && !cameraPinned
      controls.autoRotateSpeed = 0.35
      controls.update()
      renderer.render(scene, camera)
      raf = requestAnimationFrame(render)
    }
    controls.addEventListener("start", () => { interacting = true; cameraPinned = true; controls.autoRotate = false })
    controls.addEventListener("end", () => { interacting = false })
    raf = requestAnimationFrame(render)
    callbacks.current.onReady?.()

    return () => {
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      root.removeEventListener("career-station", setStation)
      buttonListeners.forEach((remove) => remove())
      playButton?.removeEventListener("click", togglePlay)
      renderer.domElement.removeEventListener("pointerdown", onPointerDown)
      renderer.domElement.removeEventListener("pointerup", onPointerUp)
      controls.dispose()
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh
        mesh.geometry?.dispose()
        const materials = mesh.material ? (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) : []
        materials.forEach((m) => m.dispose())
        const label = object.userData.label as HTMLDivElement | undefined
        label?.remove()
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [stations])

  return (
    <div ref={rootRef} className={`career-factory ${className}`} style={{ height }}>
      <div data-scene className="career-factory__scene" role="img" aria-label="Interactive six-stage factory representing Lennox Lewis's career journey. Drag to explore." />
      <div data-labels className="career-factory__labels" aria-hidden="true" />
      {selectedStation !== null && stations[selectedStation] && (
        <div className="career-factory-modal" role="dialog" aria-modal="true" aria-label={`${stations[selectedStation].title} summary`}>
          <button className="career-factory-modal__backdrop" type="button" aria-label="Close role summary" onClick={() => setSelectedStation(null)} />
          <article className="career-factory-modal__card">
            <button className="career-factory-modal__close" type="button" aria-label="Close role summary" onClick={() => setSelectedStation(null)}>×</button>
            <span>Stage {String(selectedStation + 1).padStart(2, "0")}</span>
            <h3>{stations[selectedStation].title}</h3>
            <p className="career-factory-modal__meta">{stations[selectedStation].organization} · {stations[selectedStation].date}</p>
            <p>{stations[selectedStation].summary}</p>
          </article>
        </div>
      )}
    </div>
  )
}
