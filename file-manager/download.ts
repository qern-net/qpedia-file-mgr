export async function saveResponse(response: Response, name: string) {
  if (!response.ok)
    throw new Error(
      (await response.text()).slice(0, 400) || response.statusText,
    )
  const url = URL.createObjectURL(await response.blob())
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 60000)
}
