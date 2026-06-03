import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

const LOGS_DIR = '/home/sherry/personal/sherry-os/logs'

function readJson(filename: string): Record<string, unknown> | null {
  try {
    const raw = readFileSync(join(LOGS_DIR, filename), 'utf-8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export async function GET() {
  const snapshot = readJson('snapshot.json')
  const securityPosture = readJson('security_posture.json')

  if (!snapshot) {
    return NextResponse.json(
      { error: 'snapshot.json not found — run crawler.py first' },
      { status: 503 }
    )
  }

  const merged = {
    ...snapshot,
    security_posture: securityPosture ?? { error: 'security_posture.json not found — run security_posture.py first' },
  }

  return NextResponse.json(merged, {
    headers: { 'Cache-Control': 'max-age=5' },
  })
}
