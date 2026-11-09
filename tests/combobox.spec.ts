import { expect, test, type Locator } from '@playwright/test';

const box = async (locator: Locator) => {
  const rect = await locator.boundingBox();
  if (!rect) throw new Error('Element is not rendered');
  return rect;
};

/** The element at the center of `target`, as a path of class names starting from the topmost element */
const topmostAtCenter = (target: Locator) =>
  target.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
    return {
      isTarget: el === hit || el.contains(hit),
      insideSuggestions: !!hit?.closest('.combobox-suggestions'),
    };
  });

test.describe('combobox stacking story', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('#combobox-stacking');
    await page.locator('#combobox-stacking .docs-preview').scrollIntoViewIfNeeded();
  });

  for (const [name, index, suggestionsOnTop] of [
    ['broken', 0, false],
    ['fixed', 1, true],
  ] as const) {
    test.describe(`${name} example`, () => {
      test('the input fills the width of its column', async ({ page }) => {
        const column = page.locator('#combobox-stacking .docs-playground-grid > div').nth(index);
        const columnBox = await box(column);
        const inputBox = await box(column.locator('.form-select-input'));
        const comboboxBox = await box(column.locator('.form-control-combobox'));

        expect(comboboxBox.width).toBeCloseTo(columnBox.width, 0);
        expect(inputBox.width).toBeCloseTo(columnBox.width, 0);
      });

      test(`the suggestions ${suggestionsOnTop ? 'cover' : 'are covered by'} the following field`, async ({ page }, testInfo) => {
        const column = page.locator('#combobox-stacking .docs-playground-grid > div').nth(index);
        const following = column.locator('input[aria-label="Following field"]');
        const suggestions = column.locator('.combobox-suggestions');

        // The list has to actually overlap the field, otherwise the check below proves nothing
        const [followingBox, suggestionsBox] = await Promise.all([box(following), box(suggestions)]);
        expect(suggestionsBox.y).toBeLessThan(followingBox.y);
        expect(suggestionsBox.y + suggestionsBox.height).toBeGreaterThan(followingBox.y + followingBox.height);

        await testInfo.attach(`${name}.png`, { body: await column.screenshot(), contentType: 'image/png' });

        const hit = await topmostAtCenter(following);
        expect(hit.insideSuggestions).toBe(suggestionsOnTop);
        expect(hit.isTarget).toBe(!suggestionsOnTop);
      });
    });
  }
});

test.describe('combobox story', () => {
  test('the open list stays inside the demo and the input fills it', async ({ page }) => {
    await page.goto('#combobox');
    const preview = page.locator('#combobox .docs-preview');
    await preview.scrollIntoViewIfNeeded();

    const previewBox = await box(preview);
    const suggestionsBox = await box(page.locator('#combobox .combobox-suggestions'));
    expect(suggestionsBox.y + suggestionsBox.height).toBeLessThanOrEqual(previewBox.y + previewBox.height);

    const inputBox = await box(page.locator('#combobox-open'));
    expect(inputBox.width).toBeCloseTo(suggestionsBox.width, 0);
  });
});
