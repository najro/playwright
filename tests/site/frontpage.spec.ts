import { test } from "@playwright/test";
import { FrontPage } from "@pages/FrontPage";

test("frontpage structure sanity checks", async ({ page }) => {
  
  const frontPage = new FrontPage(page);

  await frontPage.goto();  
  // Option A: keep checks explicit
  await frontPage.expectBodyHasFrontpageClass();
  await frontPage.expectTopTasks(6);
  await frontPage.expectInsightSelectedGridRowCount(1);
  await frontPage.expectInsightSelectedCardsCount(6);
  await frontPage.expectCarouselListInSingleContentRow();
  await frontPage.expectFooterVisible();

  // Option B: single call (if you prefer)
  // await frontPage.expectStructureSanity();
});

