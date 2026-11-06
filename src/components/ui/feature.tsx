import { useEffect, useRef, useState, type ComponentType } from "react"
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion"
import { Flag, Rocket } from "lucide-react"
import { AgentProgress } from "@/components/ui/agent-progress"
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat-bubble"
import { testimonialAvatar } from "@/constants"
import { QualityTrackerCard, type QualityData } from "@/components/ui/quality-tracker-card"
import { cn } from "@/lib/utils"

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Advances through `steps` on a timer, only while the visual is on screen.
 * With reduced motion it holds the last, completed step.
 */
function useLoopStep(steps: number, intervalMs: number) {
  const ref = useRef(null as HTMLDivElement | null)
  const inView = useInView(ref, { amount: 0.3 })
  const reduceMotion = useReducedMotion()
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!inView || reduceMotion) return undefined
    const timer = setInterval(() => setStep((current) => (current + 1) % steps), intervalMs)
    return () => clearInterval(timer)
  }, [inView, reduceMotion, steps, intervalMs])

  return { ref, step: reduceMotion ? steps - 1 : step }
}

const QUALITY_DATA: QualityData = {
  startLabel: "Kickoff",
  endLabel: "Launch",
  // Illustrative shape of a project moving through its stages, not measured data.
  graphData: [
    { stage: "Design", duration: 10, height: 60 },
    { stage: "Review", duration: 5, height: 30 },
    { stage: "Test", duration: 2, height: 75 },
    { stage: "Build", duration: 8, height: 50 },
    { stage: "Design", duration: 15, height: 65 },
    { stage: "Build", duration: 10, height: 55 },
    { stage: "Build", duration: 20, height: 60 },
    { stage: "Review", duration: 8, height: 35 },
    { stage: "Build", duration: 10, height: 60 },
    { stage: "Test", duration: 5, height: 50 },
    { stage: "Review", duration: 2, height: 80 },
    { stage: "Test", duration: 5, height: 60 },
  ],
}

const QUALITY_ICONS = {
  start: <Flag className="size-3.5" />,
  end: <Rocket className="size-3.5" />,
}

const QUALITY_TICK_MS = 450
const QUALITY_HOLD_TICKS = 4 // keeps the finished graph on screen before the sweep restarts

export function QualityTracker() {
  const { ref, step } = useLoopStep(QUALITY_DATA.graphData.length + QUALITY_HOLD_TICKS, QUALITY_TICK_MS)

  return <QualityTrackerCard ref={ref} aria-hidden="true" data={QUALITY_DATA} progress={step} icons={QUALITY_ICONS} />
}

const DEV_LOGO = "/images/branding/DevLogo.jpeg"

const CHAT_PEOPLE = {
  client: {
    fallback: "C",
    variant: "received",
    avatarClassName: "bg-black-200",
  },
  // The logo has wide black margins, so it's enlarged, with a faint ring to separate it from the card.
  lennox: {
    fallback: "LL",
    variant: "sent",
    avatarClassName: "ring-1 ring-white/15 [&_img]:scale-[1.35]",
  },
} as const

type ChatMessage = { from: keyof typeof CHAT_PEOPLE; text: string }

// Clients are illustrative, so their avatars use made-up seeds rather than real reviewers' names.
const CHAT_SCENARIOS: { clientAvatar: string; messages: ChatMessage[] }[] = [
  {
    clientAvatar: testimonialAvatar("Zuri"),
    messages: [
      { from: "client", text: "Hi Lennox, any update on the site?" },
      { from: "lennox", text: "Yes! Homepage is done, preview sent." },
      { from: "client", text: "Just saw it. Looks great, thanks!" },
    ],
  },
  {
    clientAvatar: testimonialAvatar("Mateo"),
    messages: [
      { from: "client", text: "Can we tweak the hero headline?" },
      { from: "lennox", text: "Sure, send the new copy over." },
      { from: "client", text: "Just sent it. Thanks for the quick reply!" },
    ],
  },
  {
    clientAvatar: testimonialAvatar("Priya"),
    messages: [
      { from: "lennox", text: "Quick heads-up: launch is on track for Friday." },
      { from: "client", text: "Great! Anything you need from me?" },
      { from: "lennox", text: "Just the final logo files, please." },
    ],
  },
]

// Each chat runs as: typing, message, typing, message, ... then a clear before the next one.
const clearStep = (script: ChatMessage[]) => script.length * 2

const chatStepDuration = (script: ChatMessage[], step: number) => {
  if (step === clearStep(script)) return 600
  if (step === clearStep(script) - 1) return 3000
  // Even steps are typing; longer messages take longer to type.
  return step % 2 === 0 ? 900 + script[step / 2].text.length * 15 : 800
}

export function LiveChat() {
  const ref = useRef(null as HTMLDivElement | null)
  const inView = useInView(ref, { amount: 0.3 })
  const reduceMotion = useReducedMotion()
  const [chat, setChat] = useState({ scenario: 0, step: 0 })
  const { clientAvatar, messages: script } = CHAT_SCENARIOS[chat.scenario]
  const step = reduceMotion ? clearStep(script) - 1 : chat.step

  // Loads every avatar up front, so a new conversation doesn't flash the initials first.
  useEffect(() => {
    ;[DEV_LOGO, ...CHAT_SCENARIOS.map(({ clientAvatar: avatar }) => avatar)].forEach((src) => {
      new Image().src = src
    })
  }, [])

  useEffect(() => {
    if (!inView || reduceMotion) return undefined
    const timer = setTimeout(() => {
      setChat(({ scenario, step: current }) =>
        current === clearStep(CHAT_SCENARIOS[scenario].messages)
          ? { scenario: (scenario + 1) % CHAT_SCENARIOS.length, step: 0 }
          : { scenario, step: current + 1 },
      )
    }, chatStepDuration(script, chat.step))
    return () => clearTimeout(timer)
  }, [inView, reduceMotion, chat, script])

  const typing = step % 2 === 0 && step !== clearStep(script)
  const visibleCount = step === clearStep(script) ? 0 : Math.floor(step / 2) + 1

  return (
    <div ref={ref} aria-hidden="true" className="flex h-[176px] flex-col justify-end gap-2 overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        {script.slice(0, visibleCount).map(({ from, text }, index) => {
          const { fallback, variant, avatarClassName } = CHAT_PEOPLE[from]
          const src = from === "lennox" ? DEV_LOGO : clientAvatar
          return (
            <motion.div
              key={`${chat.scenario}-${index}`}
              layout={reduceMotion ? false : "position"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <ChatBubble variant={variant} className="mb-0">
                <ChatBubbleAvatar src={src} fallback={fallback} className={cn("h-7 w-7 text-[10px]", avatarClassName)} />
                <ChatBubbleMessage
                  variant={variant}
                  isLoading={typing && index === visibleCount - 1}
                  className={cn(
                    "min-w-0 max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-4",
                    variant === "received" && "bg-black-200 text-white",
                  )}
                >
                  {text}
                </ChatBubbleMessage>
              </ChatBubble>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

const DELIVERY_STAGES = ["Planning", "Building", "Delivering"]
const DELIVERY_TICK_MS = 100
const DELIVERY_STAGE_TICKS = 30 // 3 seconds per stage

export function DeliveryProgress() {
  const { ref, step } = useLoopStep(DELIVERY_STAGES.length * DELIVERY_STAGE_TICKS, DELIVERY_TICK_MS)

  return (
    <div ref={ref} aria-hidden="true" className="flex justify-center">
      <AgentProgress
        label={DELIVERY_STAGES[Math.floor(step / DELIVERY_STAGE_TICKS)]}
        elapsedSeconds={(step * DELIVERY_TICK_MS) / 1000}
        className="text-base text-white-50 [&>span:first-child]:size-7 [&>span:first-child]:text-primary"
      />
    </div>
  )
}

export interface FeatureItem {
  title: string
  desc: string
  Visual: ComponentType
}

interface FeaturesSectionProps {
  eyebrow: string
  items: FeatureItem[]
}

// The stagger lives on the grid, so the cards' hover isn't held back by a reveal delay.
const GRID_VARIANTS = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const REVEAL_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

export function FeaturesSection({ eyebrow, items }: FeaturesSectionProps) {
  const reduceMotion = useReducedMotion()
  const initial = reduceMotion ? "visible" : "hidden"

  return (
    <section className="padding-x-lg">
      <div className="mx-auto w-full max-w-[1280px]">
        <motion.p
          className="mb-8 text-sm uppercase tracking-widest text-white-50"
          variants={REVEAL_VARIANTS}
          initial={initial}
          whileInView="visible"
          viewport={{ once: true }}
        >
          {eyebrow}
        </motion.p>

        <motion.div
          className="grid-3-cols"
          variants={GRID_VARIANTS}
          initial={initial}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {items.map(({ title, desc, Visual }) => (
            <motion.div
              key={title}
              className="card-dark flex flex-col rounded-xl p-6 md:p-7"
              variants={REVEAL_VARIANTS}
              whileHover={reduceMotion ? undefined : { scale: 0.98, transition: { duration: 0.2 } }}
            >
              <div className="flex min-h-[120px] flex-1 flex-col justify-center">
                <Visual />
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-white md:text-[22px]">{title}</h3>
                <p className="mt-2 text-[15px] text-white-50 md:text-[17px]">{desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
