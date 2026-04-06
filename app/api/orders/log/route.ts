import { promises as fs } from "fs"
import path from "path"

const logFilePath = path.join(process.cwd(), "data", "orders-log.json")

async function ensureLogDir() {
  await fs.mkdir(path.dirname(logFilePath), { recursive: true })
}

async function readLog() {
  try {
    const data = await fs.readFile(logFilePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    return {
      savedNet: 0,
      lastResetDay: null,
      history: [] as Array<{ event: string; timestamp: number; value: number }>,
    }
  }
}

async function writeLog(log: { savedNet: number; lastResetDay: string | null; history: Array<{ event: string; timestamp: number; value: number }> }) {
  await ensureLogDir()
  await fs.writeFile(logFilePath, JSON.stringify(log, null, 2), "utf8")
}

export async function GET() {
  const log = await readLog()
  return Response.json(log)
}

export async function PATCH(req: Request) {
  const body = await req.json()
  if (body.action !== "clear" && body.action !== "archive") {
    return Response.json({ error: "Invalid action" }, { status: 400 })
  }

  const log = await readLog()
  if (body.action === "clear") {
    const nextLog = {
      ...log,
      savedNet: 0,
      lastResetDay: new Date().toISOString(),
      history: [],
    }
    await writeLog(nextLog)
    return Response.json(nextLog)
  }

  const amount = Number(body.amount ?? 0)
  const addedAmount = Number.isFinite(amount) && amount > 0 ? amount : 0
  const currentSavedNet = typeof log.savedNet === "number" ? log.savedNet : 0
  const nextSavedNet = currentSavedNet + addedAmount
  const nextLog = {
    ...log,
    savedNet: nextSavedNet,
    lastResetDay: new Date().toISOString(),
    history: [
      ...log.history,
      { event: "archive", timestamp: Date.now(), value: addedAmount },
    ],
  }

  await writeLog(nextLog)
  return Response.json(nextLog)
}
