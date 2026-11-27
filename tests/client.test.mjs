import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { compile } from 'svelte/compiler'

test('the public file manager compiles for Svelte clients and SSR independently of QPedia', async () => {
  const filename = import.meta.resolve('@qern/file-manager/FileManager.svelte')
  const source = await readFile(new URL(filename), 'utf8')
  for (const generate of ['client', 'server']) {
    const result = compile(source, { filename: 'FileManager.svelte', generate })
    assert.ok(result.js.code.includes('Download ZIP'))
    assert.deepEqual(result.warnings, [])
  }
})

test('browser downloads propagate storage errors and do not require an engine', async () => {
  const { saveResponse } = await import('@qern/file-manager/download')
  await assert.rejects(saveResponse(new Response('Revision unavailable', { status: 404 }), 'a.txt'), /Revision unavailable/)
})
