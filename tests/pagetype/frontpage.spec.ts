import { test, expect } from '@fixtures/index';
import { FrontPage } from "src/pom/FrontPage";

test("Frontpage structure sanity checks", async ({ page }) => {
  
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
  await frontPage.expectStructureSanity();
});

