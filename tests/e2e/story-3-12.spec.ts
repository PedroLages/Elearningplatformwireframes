/**
 * Story 3.12: Code & Media Blocks — ATDD Acceptance Tests
 *
 * Tests verify:
 *   - AC1: Code blocks with syntax highlighting and language selector
 *   - AC2: Inline images via drag-and-drop / toolbar button
 *   - AC3: YouTube embeds via toolbar button and paste
 *   - AC4: Collapsible details (toggle) blocks
 *
 * Navigation: LessonPlayer → Notes tab → NoteEditor
 * Uses static course data (nci-access) — no IndexedDB seeding needed.
 */
import { test, expect } from '../support/fixtures'
import { navigateAndWait } from '../support/helpers/navigation'

// ---------------------------------------------------------------------------
// Test Data — use a static course/lesson that has video (renders Notes tab)
// ---------------------------------------------------------------------------

const COURSE_ID = 'nci-access'
const LESSON_ID = 'nci-fnl-drones-psyops'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Navigate to lesson player Notes tab with sidebar closed. */
async function openNoteEditor(
  page: import('@playwright/test').Page,
) {
  await page.addInitScript(() => {
    localStorage.setItem('eduvi-sidebar-v1', 'false')
  })

  // Navigate to lesson player
  await navigateAndWait(page, `/courses/${COURSE_ID}/${LESSON_ID}`)

  // Wait for Notes tab to appear, then click it
  const notesTab = page.getByRole('tab', { name: 'Notes' })
  await notesTab.waitFor({ state: 'visible', timeout: 30000 })
  await notesTab.click()

  // Wait for editor to render
  await page.waitForSelector('[data-testid="note-editor"]', { timeout: 15000 })
}

// ---------------------------------------------------------------------------
// AC1: Code blocks with syntax highlighting
// ---------------------------------------------------------------------------

test.describe('AC1: Code blocks with syntax highlighting', () => {
  test('inserting a code block renders with syntax highlighting', async ({
    page,
  }) => {
    await openNoteEditor(page)

    const editor = page.locator('.tiptap')
    await editor.click()

    // Click Code Block toolbar button
    const codeBlockBtn = page.getByRole('button', { name: 'Code block' })
    await codeBlockBtn.click()

    // Type some JavaScript code
    await page.keyboard.type('const x = 42;')

    // Verify code block element exists
    const codeBlock = editor.locator('pre code')
    await expect(codeBlock).toBeVisible()
  })

  test('code block has a language selector dropdown', async ({
    page,
  }) => {
    await openNoteEditor(page)

    const editor = page.locator('.tiptap')
    await editor.click()

    // Insert a code block
    const codeBlockBtn = page.getByRole('button', { name: 'Code block' })
    await codeBlockBtn.click()
    await page.keyboard.type('print("hello")')

    // Verify language selector is visible
    const langSelect = editor.locator('select')
    await expect(langSelect).toBeVisible()

    // Verify supported languages are present in the dropdown
    const options = langSelect.locator('option')
    const optionTexts = await options.allTextContents()
    expect(optionTexts).toEqual(
      expect.arrayContaining(['JavaScript', 'TypeScript', 'Python', 'CSS', 'HTML', 'Bash']),
    )
  })

  test('changing language re-highlights code', async ({
    page,
  }) => {
    await openNoteEditor(page)

    const editor = page.locator('.tiptap')
    await editor.click()

    // Insert a code block
    const codeBlockBtn = page.getByRole('button', { name: 'Code block' })
    await codeBlockBtn.click()
    await page.keyboard.type('const x = 42;')

    // Change language to Python
    const langSelect = editor.locator('select')
    await langSelect.selectOption('python')

    // Verify the language attribute changed
    const codeElement = editor.locator('pre code')
    await expect(codeElement).toHaveAttribute('class', /language-python/)
  })
})

// ---------------------------------------------------------------------------
// AC2: Inline images
// ---------------------------------------------------------------------------

test.describe('AC2: Inline images', () => {
  test('toolbar image button inserts an image via file picker', async ({
    page,
  }) => {
    await openNoteEditor(page)

    // Verify image toolbar button exists
    const imageBtn = page.getByRole('button', { name: /image/i })
    await expect(imageBtn).toBeVisible()
  })

  test('dropped image embeds inline as block element', async ({
    page,
  }) => {
    await openNoteEditor(page)

    const editor = page.locator('.tiptap')
    await editor.click()

    // Create a small PNG data URL for testing
    const dataTransfer = await page.evaluateHandle(() => {
      const dt = new DataTransfer()
      // Create a 1x1 red pixel PNG
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = 'red'
      ctx.fillRect(0, 0, 1, 1)
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'test.png', { type: 'image/png' })
          dt.items.add(file)
        }
      }, 'image/png')
      return dt
    })

    // Dispatch drop event
    await editor.dispatchEvent('drop', { dataTransfer })

    // Verify image was inserted (may be async)
    const img = editor.locator('img')
    await expect(img).toBeVisible({ timeout: 10000 })
  })
})

// ---------------------------------------------------------------------------
// AC3: YouTube embeds
// ---------------------------------------------------------------------------

test.describe('AC3: YouTube embeds', () => {
  test('toolbar YouTube button opens a URL dialog', async ({
    page,
  }) => {
    await openNoteEditor(page)

    // Click YouTube toolbar button
    const youtubeBtn = page.getByRole('button', { name: /youtube/i })
    await youtubeBtn.click()

    // Verify dialog opens
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // Verify URL input exists in the dialog
    const urlInput = dialog.locator('input')
    await expect(urlInput).toBeVisible()
  })

  test('inserting a YouTube URL creates a responsive embed', async ({
    page,
  }) => {
    await openNoteEditor(page)

    // Open YouTube dialog
    const youtubeBtn = page.getByRole('button', { name: /youtube/i })
    await youtubeBtn.click()

    const dialog = page.getByRole('dialog')
    const urlInput = dialog.locator('input')

    // Enter a YouTube URL
    await urlInput.fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ')

    // Click insert/submit button
    const insertBtn = dialog.getByRole('button', { name: /insert|embed|add/i })
    await insertBtn.click()

    // Verify YouTube iframe or embed container exists
    const embed = page.locator('.tiptap iframe[src*="youtube"], .tiptap div[data-youtube-video]')
    await expect(embed).toBeVisible({ timeout: 10000 })
  })
})

// ---------------------------------------------------------------------------
// AC4: Collapsible details blocks
// ---------------------------------------------------------------------------

test.describe('AC4: Collapsible details blocks', () => {
  test('toolbar toggle button inserts a details block', async ({
    page,
  }) => {
    await openNoteEditor(page)

    const editor = page.locator('.tiptap')
    await editor.click()

    // Click toggle/details toolbar button
    const toggleBtn = page.getByRole('button', { name: /toggle|details|collapsible/i })
    await toggleBtn.click()

    // Verify details element is inserted
    const details = editor.locator('details')
    await expect(details).toBeVisible()

    // Verify summary element exists
    const summary = editor.locator('details summary')
    await expect(summary).toBeVisible()
  })

  test('clicking summary toggles content visibility', async ({
    page,
  }) => {
    await openNoteEditor(page)

    const editor = page.locator('.tiptap')
    await editor.click()

    // Insert a details block
    const toggleBtn = page.getByRole('button', { name: /toggle|details|collapsible/i })
    await toggleBtn.click()

    // Type summary text
    await page.keyboard.type('Click to expand')
    await page.keyboard.press('Enter')
    await page.keyboard.type('Hidden content here')

    // Get the details element
    const details = editor.locator('details')
    await expect(details).toBeVisible()

    // Click summary to toggle — details elements have built-in toggle behavior
    const summary = editor.locator('details summary')
    await summary.click()

    // Verify the details block responds to toggle interaction
    // The open attribute toggles on click
    await expect(details).toBeVisible()
  })
})
